import { NextResponse, type NextRequest } from "next/server";
import { createHmac } from "node:crypto";
import { randomUUID } from "node:crypto";
import { isIP } from "node:net";
import { renderInquiryEmailHtml } from "@/app/lib/emailTemplates";

const FITCHECK_RECIPIENT = "fitcheckai0@gmail.com";
const MAX_BODY_BYTES = 32 * 1024;
const LIMIT_WINDOW_SECONDS = 600;
const LIMIT_PER_IP = 5;
const LIMIT_GLOBAL = 50;
const LIMIT_SCRIPT = `
local ip = tonumber(redis.call('GET', KEYS[1]) or '0')
local total = tonumber(redis.call('GET', KEYS[2]) or '0')
local ipTtl = redis.call('TTL', KEYS[1])
local totalTtl = redis.call('TTL', KEYS[2])
if ip >= tonumber(ARGV[2]) or total >= tonumber(ARGV[3]) then
  return {ip, total, ipTtl, totalTtl, 1}
end
ip = redis.call('INCR', KEYS[1])
if ip == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]); ipTtl = tonumber(ARGV[1]) end
total = redis.call('INCR', KEYS[2])
if total == 1 then redis.call('EXPIRE', KEYS[2], ARGV[1]); totalTtl = tonumber(ARGV[1]) end
return {ip, total, ipTtl, totalTtl, 0}`;

function response(status: number, error: string, field?: string, retryAfter?: number) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (retryAfter) headers.set("Retry-After", String(retryAfter));
  return NextResponse.json({ success: false, error, ...(field ? { field } : {}) }, { status, headers });
}

function validMailbox(value: unknown): value is string {
  return typeof value === "string" && Buffer.byteLength(value, "utf8") <= 254 &&
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(value) &&
    value.split("@")[0].length <= 64 && !value.split("@")[0].startsWith(".") && !value.split("@")[0].endsWith(".") && !value.split("@")[0].includes("..");
}

function limiterIp(value: string): string | null {
  if (isIP(value) === 4) return `4:${value}`;
  if (isIP(value) !== 6) return null;
  if (value.includes("%")) return null;
  const normalized = new URL(`http://[${value}]/`).hostname.slice(1, -1).toLowerCase();
  if (normalized.startsWith("::ffff:")) {
    const [a, b] = normalized.slice(7).split(":").map((part) => Number.parseInt(part, 16));
    return `4:${a >> 8}.${a & 255}.${b >> 8}.${b & 255}`;
  }
  const [left, right] = normalized.split("::");
  const prefix = left ? left.split(":") : [];
  const suffix = right ? right.split(":") : [];
  const expanded = normalized.includes("::") ? [...prefix, ...Array(8 - prefix.length - suffix.length).fill("0"), ...suffix] : prefix;
  return `6:${expanded.slice(0, 4).map((piece) => piece.padStart(4, "0")).join("")}`;
}

async function reserveSend(request: NextRequest): Promise<{ status: "ok" | "limited" | "unavailable"; retryAfter: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const isVercel = process.env.VERCEL === "1";
  const forwarded = isVercel ? request.headers.get("x-vercel-forwarded-for") : null;
  const ip = forwarded?.split(",", 1)[0]?.trim();
  if (!url || !token) return { status: "unavailable", retryAfter: 1 };
  try {
    const bucketIp = ip ? limiterIp(ip) : null;
    const redisUrl = new URL(url);
    if (redisUrl.protocol !== "https:") return { status: "unavailable", retryAfter: 1 };
    const normalizedIp = isVercel && bucketIp ? bucketIp : "shared-untrusted-client";
    const ipHash = createHmac("sha256", token).update(normalizedIp).digest("hex");
    const key = `fitcheck:contact:${Math.floor(Date.now() / (LIMIT_WINDOW_SECONDS * 1000))}`;
    const result = await fetch(redisUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", LIMIT_SCRIPT, "2", `${key}:ip:${ipHash}`, `${key}:global`, String(LIMIT_WINDOW_SECONDS), String(LIMIT_PER_IP), String(LIMIT_GLOBAL)]),
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
      redirect: "error",
    });
    if (!result.ok) return { status: "unavailable", retryAfter: 1 };
    const payload = await result.json();
    const values = payload?.result;
    if (!Array.isArray(values) || values.length !== 5 || !values.every((value: unknown) => typeof value === "number" && Number.isInteger(value))) return { status: "unavailable", retryAfter: 1 };
    const [ipCount, globalCount, ipTtl, globalTtl, limited] = values;
    if (ipCount < 0 || globalCount < 0 || ipTtl < -2 || globalTtl < -2 || (limited !== 0 && limited !== 1)) return { status: "unavailable", retryAfter: 1 };
    if ((ipCount === 0 && ipTtl !== -2) || (globalCount === 0 && globalTtl !== -2) ||
        (ipCount > 0 && (ipTtl < 0 || ipTtl > LIMIT_WINDOW_SECONDS)) ||
        (globalCount > 0 && (globalTtl < 0 || globalTtl > LIMIT_WINDOW_SECONDS))) return { status: "unavailable", retryAfter: 1 };
    if (limited === 1 && ipCount < LIMIT_PER_IP && globalCount < LIMIT_GLOBAL) return { status: "unavailable", retryAfter: 1 };
    if (limited === 0 && (ipCount < 1 || globalCount < 1 || ipCount > LIMIT_PER_IP || globalCount > LIMIT_GLOBAL)) return { status: "unavailable", retryAfter: 1 };
    const blockedTtls = [ipCount >= LIMIT_PER_IP ? ipTtl : 0, globalCount >= LIMIT_GLOBAL ? globalTtl : 0].filter((ttl) => ttl > 0);
    const remainingWindow = LIMIT_WINDOW_SECONDS - Math.floor((Date.now() / 1000) % LIMIT_WINDOW_SECONDS);
    const retryAfter = Math.max(1, Math.min(remainingWindow, blockedTtls.length ? Math.max(...blockedTtls) : 1));
    return { status: limited === 1 ? "limited" : "ok", retryAfter };
  } catch {
    return { status: "unavailable", retryAfter: 1 };
  }
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  try {
    if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
      return response(415, "Send this form as JSON.");
    }
    const fetchSite = request.headers.get("sec-fetch-site");
    if (fetchSite && fetchSite.toLowerCase() === "cross-site") return response(403, "Request origin is not allowed.");
    const origin = request.headers.get("origin");
    if (origin) {
      let supplied: URL;
      try { supplied = new URL(origin); } catch { return response(403, "Request origin is not allowed."); }
      const trustedHost = process.env.VERCEL === "1" ? request.headers.get("x-forwarded-host") || request.headers.get("host") : new URL(request.url).host;
      const trustedProto = process.env.VERCEL === "1" ? request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.slice(0, -1) : new URL(request.url).protocol.slice(0, -1);
      if (!trustedHost || new URL(`${trustedProto}://${trustedHost}`).origin !== supplied.origin) {
        return response(403, "Request origin is not allowed.");
      }
    } else if (fetchSite?.toLowerCase() !== "same-origin" && fetchSite?.toLowerCase() !== "none") return response(403, "Request origin is not allowed.");
    const declaredLength = request.headers.get("content-length");
    if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_BODY_BYTES)) return response(413, "Request is too large.");
    if (!request.body) return response(400, "Request body must be a JSON object.");
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); return response(413, "Request is too large."); }
      chunks.push(value);
    }
    let body: unknown;
    try { body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))); }
    catch { return response(400, "Request body must be valid JSON."); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return response(400, "Request body must be a JSON object.");
    const { email, title, message } = body as Record<string, unknown>;
    if (typeof email !== "string" || /[\x00-\x1f\x7f-\x9f]/.test(email) || !validMailbox(email.trim())) return response(400, "Please provide a valid email address.", "email");
    const cleanEmail = email.trim();
    if (typeof title !== "string" || !title.trim() || title.trim().length > 200 || /[\r\n\x00-\x1f\x7f-\x9f\u2028\u2029]/.test(title)) return response(400, "Please provide a subject (max 200 characters).", "title");
    if (typeof message !== "string" || !message.trim() || message.length > 4000 || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/.test(message)) return response(400, "Please write a message (max 4,000 characters).", "message");
    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.FITCHECK_CONTACT_FROM?.trim();
    const senderMatch = from?.match(/^(?:[^<>\r\n]+ <([^<>\s]+@[^<>\s]+)>|([^<>\s]+@[^<>\s]+))$/);
    const senderMailbox = senderMatch?.[1] || senderMatch?.[2];
    if (!resendApiKey || !from || /[\r\n\x00-\x1f\x7f]/.test(from) || !senderMailbox || !validMailbox(senderMailbox) || senderMailbox.toLowerCase().endsWith("@resend.dev")) return response(503, "Contact form is temporarily unavailable.");
    const quota = await reserveSend(request);
    if (quota.status === "limited") return response(429, "Please wait before sending another message.", undefined, quota.retryAfter);
    if (quota.status !== "ok") return response(503, "Contact form is temporarily unavailable.");
    const normalizedTitle = title.trim();
    const emailText = `New Work With Us message submitted through fitcheck website:\n\nFrom: ${cleanEmail}\nSubject: ${normalizedTitle}\n\nMessage:\n${message}`;
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [FITCHECK_RECIPIENT], reply_to: cleanEmail, subject: normalizedTitle, text: emailText, html: renderInquiryEmailHtml({ senderEmail: cleanEmail, title: normalizedTitle, message }) }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
      redirect: "error",
    });
    if (!sent.ok) { console.error("contact_provider_rejected", { requestId, status: sent.status }); return response(502, "Message could not be sent. Please try again later."); }
    const receipt = await sent.json().catch(() => null);
    if (typeof receipt?.id !== "string" || !receipt.id.trim()) {
      console.error("contact_provider_invalid_receipt", { requestId });
      return response(502, "Message could not be sent. Please try again later.");
    }
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("contact_request_failed", { requestId });
    return response(502, "Message could not be sent. Please try again later.");
  }
}
