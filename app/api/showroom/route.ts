import { OAuth2Client } from "google-auth-library";
import type { CreateTokenResponse } from "@decartai/sdk";
import { NextResponse, type NextRequest } from "next/server";

const MODEL = "lucy-vton-3.6";
const googleAuth = new OAuth2Client();
const MAX_BODY_BYTES = 16 * 1024;
const GARMENTS = new Set(["bomber", "shirt", "barong"]);
const SPEND = new Set(["Below ₱500", "₱500–₱999", "₱1,000–₱1,999", "₱2,000–₱3,999", "₱4,000 or more"]);
const CHALLENGE = new Set(["Unsure whether the size will fit", "Unsure how the clothing will look on me", "Product looks different from the photos", "Difficult to compare styles", "Other"]);
const SKIPPED = new Set(["Yes, frequently", "Yes, sometimes", "Rarely", "Never"]);
const PAYMENT = new Set(["₱1–₱49", "₱50–₱99", "₱100–₱149", "₱150 or more", "No, I would only use it if free"]);
const PURCHASE = new Set(["Much more likely", "Somewhat more likely", "No difference", "Less likely"]);

type Survey = {
  name: string;
  contactEmail: string;
  monthlySpend: string;
  biggestChallenge: string;
  biggestChallengeOther: string;
  skippedPurchase: string;
  usefulness: string;
  willingnessToPay: string;
  purchaseLikelihood: string;
};

type Settings = {
  origin: URL;
  clientId: string;
  scriptUrl: URL;
  scriptSecret: string;
  surveyAvailable: boolean;
  previewAvailable: boolean;
  apiKey?: string;
  trialLimit?: number;
};

class IntegrationError extends Error {
  constructor(readonly code: string, readonly status: number) { super(code); }
}

function getSettings(): Settings | undefined {
  const { FITCHECK_SHOWROOM_ORIGIN: originValue, GOOGLE_OAUTH_CLIENT_ID: clientId,
    FITCHECK_APPS_SCRIPT_URL: scriptUrlValue, FITCHECK_APPS_SCRIPT_SECRET: scriptSecret,
    DECART_API_KEY: apiKey, DECART_PUBLIC_USE_APPROVED: providerApproved,
    FITCHECK_PUBLIC_TRYON_ENABLED: enabled, FITCHECK_SHOWROOM_LIMIT: limitValue } = process.env;
  if (!originValue || !clientId || !scriptUrlValue || !scriptSecret) return;

  try {
    const origin = new URL(originValue);
    const scriptUrl = new URL(scriptUrlValue);
    const localOrigin = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
    const validOrigin = origin.origin === originValue &&
      ((origin.protocol === "https:") || (localOrigin && origin.protocol === "http:"));
    const validScript = scriptUrl.protocol === "https:" && scriptUrl.hostname === "script.google.com" &&
      /^\/macros\/s\/[^/]+\/exec$/.test(scriptUrl.pathname);
    const trialLimit = Number(limitValue);
    const validLimit = Boolean(limitValue && /^\d+$/.test(limitValue) && Number.isSafeInteger(trialLimit) && trialLimit > 0);
    if (!validOrigin || !validScript) return;
    const surveyAvailable = true;
    const previewAvailable = surveyAvailable && Boolean(apiKey?.trim() && validLimit && providerApproved === "true" && enabled === "true");
    return { origin, clientId, scriptUrl, scriptSecret, surveyAvailable, previewAvailable,
      ...(previewAvailable && apiKey && validLimit ? { apiKey, trialLimit } : {}) };
  } catch {
    return;
  }
}

function json(data: object, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function matchesOrigin(request: NextRequest, origin: URL, requireOrigin: boolean) {
  const site = request.headers.get("sec-fetch-site");
  const suppliedOrigin = request.headers.get("origin");
  return request.headers.get("host") === origin.host && (site === null || site === "same-origin") &&
    (requireOrigin ? suppliedOrigin === origin.origin : suppliedOrigin === null || suppliedOrigin === origin.origin);
}

async function readBody(request: NextRequest) {
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json" || !request.body) return;
  const reader = request.body.getReader();
  const bytes = new Uint8Array(MAX_BODY_BYTES);
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (length + value.length > MAX_BODY_BYTES) { await reader.cancel(); return; }
      bytes.set(value, length);
      length += value.length;
    }
    const value: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, length)));
    return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
  } catch {
    return;
  } finally {
    reader.releaseLock();
  }
}

function validSurvey(value: unknown): Survey | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return;
  const row = value as Record<string, unknown>;
  const expected = ["name", "contactEmail", "monthlySpend", "biggestChallenge", "biggestChallengeOther", "skippedPurchase", "usefulness", "willingnessToPay", "purchaseLikelihood"];
  if (Object.keys(row).length !== expected.length || expected.some((key) => !(key in row))) return;
  const name = typeof row.name === "string" ? row.name.trim() : "";
  const contactEmail = typeof row.contactEmail === "string" ? row.contactEmail.trim() : "";
  const biggestChallengeOther = typeof row.biggestChallengeOther === "string" ? row.biggestChallengeOther.trim() : "";
  if (!name || name.length > 120 || contactEmail.length > 254 ||
    (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) || biggestChallengeOther.length > 300) return;
  if (row.biggestChallenge !== "Other" && biggestChallengeOther) return;
  if (typeof row.monthlySpend !== "string" || !SPEND.has(row.monthlySpend) ||
    typeof row.biggestChallenge !== "string" || !CHALLENGE.has(row.biggestChallenge) ||
    typeof row.skippedPurchase !== "string" || !SKIPPED.has(row.skippedPurchase) ||
    typeof row.usefulness !== "string" || !["1", "2", "3", "4", "5"].includes(row.usefulness) ||
    typeof row.willingnessToPay !== "string" || !PAYMENT.has(row.willingnessToPay) ||
    typeof row.purchaseLikelihood !== "string" || !PURCHASE.has(row.purchaseLikelihood)) return;
  return { name, contactEmail, monthlySpend: row.monthlySpend, biggestChallenge: row.biggestChallenge,
    biggestChallengeOther, skippedPurchase: row.skippedPurchase, usefulness: row.usefulness,
    willingnessToPay: row.willingnessToPay, purchaseLikelihood: row.purchaseLikelihood };
}

async function verifiedEmail(credential: unknown, clientId: string) {
  if (typeof credential !== "string" || credential.length > 8_000) throw new IntegrationError("sign_in_required", 401);
  try {
    const ticket = await googleAuth.verifyIdToken({ idToken: credential, audience: clientId });
    const claims = ticket.getPayload();
    const email = claims?.email?.trim().toLowerCase();
    const authoritative = email?.endsWith("@gmail.com") || Boolean(claims?.hd);
    if (!claims?.sub || !claims.email_verified || !email || !authoritative) throw new Error("unverified Google email");
    return email;
  } catch {
    throw new IntegrationError("sign_in_required", 401);
  }
}

async function callAppsScript(settings: Settings, action: string, data: object) {
  const response = await fetch(settings.scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: settings.scriptSecret, action, ...data }),
    signal: AbortSignal.timeout(12_000),
    cache: "no-store",
    redirect: "follow",
  });
  let result: Record<string, unknown>;
  try { result = await response.json() as Record<string, unknown>; }
  catch { throw new IntegrationError("google_service_unavailable", 503); }
  if (!response.ok || result.ok !== true) {
    const code = typeof result.code === "string" ? result.code : "google_service_unavailable";
    const status = code === "already_used" || code === "reservation_expired" || code === "reservation_in_progress" ? 409 :
      code === "trial_limit_reached" ? 429 : code === "survey_required" ? 400 : 503;
    throw new IntegrationError(code, status);
  }
  return result;
}

async function mintToken(apiKey: string, origin: string) {
  const response = await fetch("https://api.decart.ai/v1/client/tokens", {
    method: "POST",
    headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      expiresIn: 60,
      allowedModels: [MODEL],
      allowedOrigins: [origin],
      constraints: { realtime: { maxSessionDuration: 45 } },
    }),
    signal: AbortSignal.timeout(8_000),
    cache: "no-store",
    redirect: "error",
  });
  if (!response.ok) throw new Error("Token request failed");
  const token = (await response.json()) as Partial<CreateTokenResponse> | null;
  if (typeof token?.apiKey !== "string" || !token.apiKey || token.constraints?.realtime?.maxSessionDuration !== 45 ||
    !Array.isArray(token.permissions?.models) || token.permissions.models.length !== 1 || token.permissions.models[0] !== MODEL ||
    !Array.isArray(token.permissions?.origins) || token.permissions.origins.length !== 1 || token.permissions.origins[0] !== origin) {
    throw new Error("Token response was missing restrictions");
  }
  return token.apiKey;
}

const MESSAGES: Record<string, string> = {
  already_used: "This Google account can try again one hour after its last preview started.",
  trial_limit_reached: "All free try-on spots are currently in use. Please try again later.",
  survey_required: "Complete the questionnaire before starting a try-on.",
  sign_in_required: "Sign in with a verified Google account to continue.",
  reservation_expired: "The try-on setup expired. Start again to reserve your preview.",
  reservation_in_progress: "A try-on setup is already in progress for this Google account.",
  google_service_unavailable: "The survey service is unavailable right now. Please try again later.",
};

export function GET(request: NextRequest) {
  const settings = getSettings();
  if (!settings || !matchesOrigin(request, settings.origin, false)) return json({ surveyAvailable: false, previewAvailable: false });
  return json({ surveyAvailable: settings.surveyAvailable, previewAvailable: settings.previewAvailable, googleClientId: settings.clientId });
}

export async function POST(request: NextRequest) {
  const settings = getSettings();
  if (!settings || !matchesOrigin(request, settings.origin, true)) return json({ error: "This service is not configured for this site." }, 503);
  const body = await readBody(request);
  if (!body || typeof body.action !== "string") return json({ error: "Check your answers and try again." }, 400);

  try {
    const email = await verifiedEmail(body.credential, settings.clientId);
    if (body.action === "survey" && Object.keys(body).length === 3) {
      const survey = validSurvey(body.survey);
      if (!survey) return json({ error: "Check your questionnaire answers and try again." }, 400);
      const result = await callAppsScript(settings, "survey", { email, survey });
      return json({ success: true, alreadyUsed: result.alreadyUsed === true, previewAvailable: settings.previewAvailable });
    }

    const lifecycle = body.action === "commit" || body.action === "release";
    if (lifecycle && Object.keys(body).length === 3 && typeof body.reservationId === "string" && /^[a-f0-9-]{36}$/.test(body.reservationId)) {
      const result = await callAppsScript(settings, body.action, { email, reservationId: body.reservationId });
      return json({ success: true, ...("used" in result ? { used: result.used === true } : {}) });
    }

    if (body.action === "start" && Object.keys(body).length === 4 && body.consent === true &&
      typeof body.garment === "string" && GARMENTS.has(body.garment)) {
      if (!settings.previewAvailable || !settings.apiKey) return json({ error: "The preview is not enabled yet." }, 503);
      const reservation = await callAppsScript(settings, "reserve", { email, trialLimit: settings.trialLimit });
      const reservationId = typeof reservation.reservationId === "string" ? reservation.reservationId : "";
      if (!reservationId) return json({ error: MESSAGES.google_service_unavailable }, 503);
      try {
        const apiKey = await mintToken(settings.apiKey, settings.origin.origin);
        return json({ apiKey, reservationId });
      } catch {
        await callAppsScript(settings, "release", { email, reservationId }).catch(() => undefined);
        return json({ error: "The live preview is temporarily unavailable. Your try has been restored." }, 502);
      }
    }
    return json({ error: "Check your answers and try again." }, 400);
  } catch (error) {
    if (error instanceof IntegrationError) return json({ error: MESSAGES[error.code] ?? "The service is temporarily unavailable." }, error.status);
    return json({ error: "The service is temporarily unavailable. Please try again later." }, 503);
  }
}
