/**
 * Server-only: forwards a validated "Message Us" inquiry to FitCheck Ops.
 *
 * Contract: fitcheck_sys `docs/contracts/inquiries-api.md` (`POST /public/v1/inquiries`).
 * - The body is serialized ONCE; that exact string is signed and sent.
 * - `x-ops-signature = hex(HMAC_SHA256(WEBSITE_HMAC_SECRET, timestamp + "." + body))`.
 * - `x-client-ip-hash` is an HMAC of the visitor IP (never the raw IP), Ops' per-visitor rate-limit key.
 * - No automatic retries: Turnstile tokens are single-use. `submissionId` makes a manual resubmit safe.
 */
import { createHmac } from "node:crypto";
import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "./rateLimit";
import { composeMessage, inquirySchema, normalizePlanKey, toInterest, type InquiryType, type ValidatedInquiry } from "./inquirySchema";

export const OPS_TIMEOUT_MS = 8000;

export type OpsPayload = {
  brandName: string;
  contactName: string;
  email: string;
  phone?: string;
  interest: ReturnType<typeof toInterest>;
  inquiryType: InquiryType;
  message: string;
  consent: true;
  turnstileToken: string;
  submissionId?: string;
  pagePath?: string;
  utm?: ValidatedInquiry["utm"];
};

export function toOpsPayload(d: ValidatedInquiry): OpsPayload {
  const payload: OpsPayload = {
    brandName: d.brandName,
    contactName: d.contactPerson,
    email: d.contactEmail,
    interest: toInterest(d),
    inquiryType: d.inquiryType,
    message: composeMessage(d),
    consent: true,
    turnstileToken: d.turnstileToken,
  };
  if (d.phone) payload.phone = d.phone;
  if (d.submissionId) payload.submissionId = d.submissionId;
  if (d.pagePath) payload.pagePath = d.pagePath;
  const utm = d.utm && Object.fromEntries(Object.entries(d.utm).filter(([, v]) => v));
  if (utm && Object.keys(utm).length) payload.utm = utm;
  return payload;
}

export function signOpsBody(secret: string, body: string, timestamp: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

export function hashClientIp(secret: string, ip: string): string {
  return createHmac("sha256", secret).update(`client-ip:${ip}`).digest("hex");
}

type OpsConfig = { url: string; secret: string };

/** Null when not configured. Throws on an unsafe URL (non-HTTPS outside localhost). */
export function getOpsConfig(env: NodeJS.ProcessEnv = process.env): OpsConfig | null {
  const rawUrl = env.INTERNAL_SYSTEM_API_URL?.trim();
  const secret = env.WEBSITE_HMAC_SECRET?.trim();
  if (!rawUrl || !secret) return null;
  const url = new URL(rawUrl);
  const isLocalhost = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && (env.NODE_ENV === "production" || !isLocalhost)) {
    throw new Error("INTERNAL_SYSTEM_API_URL must use HTTPS.");
  }
  return { url: url.toString(), secret };
}

export type ForwardResult =
  | { ok: true; id: string; duplicate: boolean }
  | { ok: false; kind: "validation"; field?: string }
  | { ok: false; kind: "verification" }
  | { ok: false; kind: "rate_limited"; retryAfter?: string }
  | { ok: false; kind: "timeout" }
  | { ok: false; kind: "upstream"; status?: number; code?: string };

export async function forwardToOps(payload: OpsPayload, config: OpsConfig, clientIp: string, now = Date.now(), timeoutMs = OPS_TIMEOUT_MS): Promise<ForwardResult> {
  const body = JSON.stringify(payload);
  const timestamp = String(Math.floor(now / 1000));
  try {
    const res = await axios.post<unknown>(config.url, body, {
      timeout: timeoutMs,
      // Send the signed string untouched; never let Axios re-serialize it.
      transformRequest: [(data: unknown) => data],
      validateStatus: () => true,
      maxRedirects: 0,
      headers: {
        "content-type": "application/json",
        "x-ops-timestamp": timestamp,
        "x-ops-signature": signOpsBody(config.secret, body, timestamp),
        "x-client-ip-hash": hashClientIp(config.secret, clientIp),
      },
    });
    const data = (res.data ?? {}) as { id?: unknown; accepted?: unknown; error?: { code?: string; message?: string } };
    if ((res.status === 201 || res.status === 200) && typeof data.id === "string") {
      return { ok: true, id: data.id, duplicate: res.status === 200 };
    }
    if (res.status === 400 && data.error?.code === "VALIDATION") {
      const field = /^Invalid field: (.+)$/.exec(data.error.message ?? "")?.[1];
      return { ok: false, kind: "validation", field };
    }
    if (res.status === 403) return { ok: false, kind: "verification" };
    if (res.status === 429) return { ok: false, kind: "rate_limited", retryAfter: String(res.headers["retry-after"] ?? "") || undefined };
    return { ok: false, kind: "upstream", status: res.status, code: data.error?.code };
  } catch (err) {
    if (axios.isAxiosError(err) && (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT")) return { ok: false, kind: "timeout" };
    return { ok: false, kind: "upstream", code: axios.isAxiosError(err) ? err.code : undefined };
  }
}

/** Ops field → modal field, so an Ops 400 highlights the right input. */
const OPS_FIELD: Record<string, string> = {
  brandName: "brandName",
  contactName: "contactPerson",
  email: "contactEmail",
  phone: "phone",
  interest: "selectedPlan",
  message: "message",
  consent: "consent",
  turnstileToken: "turnstileToken",
};

const SUCCESS_MESSAGE = "Your inquiry has been received. Our team will contact you shortly.";
const FALLBACK_MESSAGE = "We couldn't send your inquiry right now. Your details are still here: please try again in a moment, or use the email draft below.";

function reply(status: number, body: Record<string, unknown>, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { "cache-control": "no-store", ...(headers ?? {}) } });
}

function clientIpOf(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/**
 * Keeps the old `/api/work-with-us/*` payloads working: picks the fields the form uses and maps
 * `notes` → `message`, `garmentCategories` → `garmentStyles` and plan labels → plan keys.
 */
export function normalizeLegacyBody(raw: Record<string, unknown>, inquiryType: InquiryType): Record<string, unknown> {
  const pick = (k: string) => (typeof raw[k] === "string" ? (raw[k] as string) : undefined);
  const out: Record<string, unknown> = {
    inquiryType,
    brandName: raw.brandName,
    contactEmail: raw.contactEmail,
    contactPerson: raw.contactPerson,
    phone: pick("phone"),
    storeUrl: pick("storeUrl"),
    garmentStyles: pick("garmentStyles") ?? pick("garmentCategories"),
    preferredDate: pick("preferredDate"),
    message: pick("message") ?? pick("notes"),
    consent: raw.consent,
    turnstileToken: raw.turnstileToken,
    submissionId: raw.submissionId,
    pagePath: pick("pagePath"),
    hp_company_website: pick("hp_company_website"),
  };
  const plan = normalizePlanKey(raw.selectedPlan);
  if (plan) out.selectedPlan = plan;
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined));
}

/**
 * The one inquiry handler (`/api/inquiry` and the legacy `/api/work-with-us/*` routes).
 * Success is reported only after Ops stores the inquiry, with the stored Ops id.
 */
export async function handleInquiryRequest(request: NextRequest, legacy?: { inquiryType?: InquiryType }): Promise<NextResponse> {
  const clientIp = clientIpOf(request);

  try {
    const limit = await checkRateLimit(clientIp);
    if (!limit.success) {
      return reply(429, { success: false, code: "RATE_LIMITED", message: "Too many inquiry requests. Please try again later, or use the email draft below." }, { "retry-after": String(limit.retryAfter || 3600) });
    }
  } catch (err) {
    console.warn("[inquiry] rate limiter unavailable", err instanceof Error ? err.message : "");
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return reply(400, { success: false, code: "VALIDATION", message: "Invalid JSON request format." });
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return reply(400, { success: false, code: "VALIDATION", message: "Invalid JSON request format." });
  }
  if (legacy) {
    const record = raw as Record<string, unknown>;
    const type = legacy.inquiryType ?? (typeof record.type === "string" ? record.type : "general");
    raw = normalizeLegacyBody(record, type as InquiryType);
  }

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] ? String(issue.path[0]) : "general";
      errors[field] ??= issue.message;
    }
    return reply(400, { success: false, code: "VALIDATION", message: "Please correct the highlighted fields.", errors });
  }
  const data = parsed.data;

  // Bots that fill the hidden field get the normal thank-you; nothing is sent to Ops.
  if (data.hp_company_website && data.hp_company_website.trim() !== "") {
    return reply(200, { success: true, message: SUCCESS_MESSAGE });
  }

  let config: OpsConfig | null;
  try {
    config = getOpsConfig();
  } catch (err) {
    console.error("[inquiry] invalid Ops configuration:", err instanceof Error ? err.message : "");
    config = null;
  }
  if (!config) {
    // Never pretend: without a destination the inquiry would be lost.
    console.error("[inquiry] INTERNAL_SYSTEM_API_URL or WEBSITE_HMAC_SECRET is not configured; inquiry not stored.");
    return reply(503, { success: false, code: "UNAVAILABLE", message: FALLBACK_MESSAGE });
  }

  const result = await forwardToOps(toOpsPayload(data), config, clientIp);
  if (result.ok) {
    return reply(200, { success: true, inquiryId: result.id, type: data.inquiryType, message: SUCCESS_MESSAGE });
  }
  console.error("[inquiry] Ops did not store the inquiry", JSON.stringify({ kind: result.kind, ...("status" in result ? { status: result.status, code: result.code } : {}) }));

  switch (result.kind) {
    case "validation": {
      const field = result.field ? OPS_FIELD[result.field] : undefined;
      return reply(400, {
        success: false,
        code: "VALIDATION",
        message: "Please correct the highlighted fields.",
        errors: field ? { [field]: "Please check this field." } : undefined,
      });
    }
    case "verification":
      return reply(403, { success: false, code: "VERIFICATION_FAILED", message: "The verification check didn't pass. Please complete it again and resend.", errors: { turnstileToken: "Please complete the verification check again." } });
    case "rate_limited":
      return reply(429, { success: false, code: "RATE_LIMITED", message: "Too many inquiries right now. Please try again later, or use the email draft below." }, result.retryAfter ? { "retry-after": result.retryAfter } : undefined);
    case "timeout":
      return reply(504, { success: false, code: "TIMEOUT", message: "We couldn't confirm your inquiry was received. You can safely send it again (it won't be duplicated), or use the email draft below." });
    default:
      return reply(502, { success: false, code: "UNAVAILABLE", message: FALLBACK_MESSAGE });
  }
}
