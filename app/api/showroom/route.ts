import { OAuth2Client } from "google-auth-library";
import type { CreateTokenResponse } from "@decartai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { getOpsConfig, signOpsBody } from "@/lib/opsInquiry";
import { parseDefinition, type SurveyDefinition } from "@/lib/surveyDefinition";

const MODEL = "lucy-vton-3.6";
const googleAuth = new OAuth2Client();
const MAX_BODY_BYTES = 16 * 1024;
const GARMENTS = new Set(["bomber", "shirt", "barong", "custom"]);
const MAX_ANSWERS = 12;
const SURVEY_CACHE_SECONDS = 60;

type Settings = {
  origin: URL;
  clientId: string;
  /** FitCheck Ops `/public/v1/tryon` (contract: fitcheck_sys docs/contracts/tryon-api.md). */
  opsUrl: URL;
  opsSecret: string;
  /** `GET /public/v1/tryon/survey` on the same Ops host, read with WEBSITE_READ_KEY. */
  surveyUrl: URL;
  readKey: string;
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
    DECART_API_KEY: apiKey, DECART_PUBLIC_USE_APPROVED: providerApproved,
    FITCHECK_PUBLIC_TRYON_ENABLED: enabled, FITCHECK_SHOWROOM_LIMIT: limitValue } = process.env;
  if (!originValue || !clientId) return;

  try {
    // Same Ops deployment and signing secret as the inquiry form; only the path differs.
    const ops = getOpsConfig();
    if (!ops) return;
    const opsUrl = new URL("/public/v1/tryon", ops.url);
    const surveyUrl = new URL("/public/v1/tryon/survey", ops.url);
    const readKey = process.env.WEBSITE_READ_KEY?.trim();
    if (!readKey) return;
    const origin = new URL(originValue);
    const localOrigin = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
    const validOrigin = origin.origin === originValue &&
      ((origin.protocol === "https:") || (localOrigin && origin.protocol === "http:"));
    const trialLimit = Number(limitValue);
    const validLimit = Boolean(limitValue && /^\d+$/.test(limitValue) && Number.isSafeInteger(trialLimit) && trialLimit > 0);
    if (!validOrigin) return;
    const surveyAvailable = true;
    const previewAvailable = surveyAvailable && Boolean(apiKey?.trim() && validLimit && providerApproved === "true" && enabled === "true");
    return { origin, clientId, opsUrl, opsSecret: ops.secret, surveyUrl, readKey, surveyAvailable, previewAvailable,
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

/** Shape check only (sizes, types). Ops validates every answer against the published definition. */
function validAnswers(answers: unknown, other: unknown) {
  if (typeof answers !== "object" || answers === null || Array.isArray(answers)) return false;
  if (typeof other !== "object" || other === null || Array.isArray(other)) return false;
  const entries = Object.entries(answers as Record<string, unknown>);
  const others = Object.entries(other as Record<string, unknown>);
  if (entries.length > MAX_ANSWERS || others.length > MAX_ANSWERS) return false;
  const id = (k: string) => /^[a-z0-9_]{1,40}$/.test(k);
  return entries.every(([k, v]) => id(k) && ((typeof v === "string" && v.length <= 300) || (Array.isArray(v) && v.length <= 11 && v.every((x) => typeof x === "string" && x.length <= 40)))) &&
    others.every(([k, v]) => id(k) && typeof v === "string" && v.length <= 300);
}

/** The published survey from Ops, cached by Next for up to a minute. Undefined = survey unavailable. */
async function fetchSurvey(settings: Settings): Promise<SurveyDefinition | undefined> {
  try {
    const response = await fetch(settings.surveyUrl, {
      headers: { authorization: `Bearer ${settings.readKey}` },
      signal: AbortSignal.timeout(5_000),
      next: { revalidate: SURVEY_CACHE_SECONDS },
      redirect: "error",
    });
    if (!response.ok) return;
    return parseDefinition(await response.json());
  } catch {
    return;
  }
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

/**
 * Signed call to Ops. The body is serialized once and that exact string is signed and sent.
 * `email` is the verified Google email; Ops stores only a keyed hash of it.
 */
async function callOps(settings: Settings, action: string, data: object) {
  const body = JSON.stringify({ action, ...data });
  const timestamp = String(Math.floor(Date.now() / 1000));
  let response: Response;
  try {
    response = await fetch(settings.opsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-ops-timestamp": timestamp, "x-ops-signature": signOpsBody(settings.opsSecret, body, timestamp) },
      body,
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
      redirect: "error",
    });
  } catch {
    throw new IntegrationError("google_service_unavailable", 503);
  }
  let result: Record<string, unknown>;
  try { result = await response.json() as Record<string, unknown>; }
  catch { throw new IntegrationError("google_service_unavailable", 503); }
  if (!response.ok || result.ok !== true) {
    // Business codes come back as `{ ok: false, code }`; auth, validation and rate errors as `{ error }`.
    const opsError = (result.error as { code?: string } | undefined)?.code;
    const code = typeof result.code === "string" ? result.code : opsError === "VALIDATION" ? "invalid_answers" : "google_service_unavailable";
    const status = code === "already_used" || code === "reservation_expired" || code === "reservation_in_progress" || code === "survey_outdated" ? 409 :
      code === "invalid_answers" ? 400 :
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
  survey_outdated: "The survey was just updated. Reload the page to answer the new questions.",
  invalid_answers: "Check your questionnaire answers and try again.",
};

export async function GET(request: NextRequest) {
  const settings = getSettings();
  if (!settings || !matchesOrigin(request, settings.origin, false)) return json({ surveyAvailable: false, previewAvailable: false });
  const survey = await fetchSurvey(settings);
  return json({ surveyAvailable: settings.surveyAvailable && Boolean(survey), previewAvailable: settings.previewAvailable, googleClientId: settings.clientId, survey });
}

export async function POST(request: NextRequest) {
  const settings = getSettings();
  if (!settings || !matchesOrigin(request, settings.origin, true)) return json({ error: "This service is not configured for this site." }, 503);
  const body = await readBody(request);
  if (!body || typeof body.action !== "string") return json({ error: "Check your answers and try again." }, 400);

  try {
    const email = await verifiedEmail(body.credential, settings.clientId);
    if (body.action === "survey" && Object.keys(body).length === 5 && Number.isSafeInteger(body.surveyVersion)) {
      if (!validAnswers(body.answers, body.other)) return json({ error: MESSAGES.invalid_answers }, 400);
      const result = await callOps(settings, "survey", { email, surveyVersion: body.surveyVersion, answers: body.answers, other: body.other });
      return json({ success: true, alreadyUsed: result.alreadyUsed === true, previewAvailable: settings.previewAvailable });
    }

    const lifecycle = body.action === "commit" || body.action === "release";
    if (lifecycle && Object.keys(body).length === 3 && typeof body.reservationId === "string" && /^[a-f0-9-]{36}$/.test(body.reservationId)) {
      const result = await callOps(settings, body.action, { email, reservationId: body.reservationId });
      return json({ success: true, ...("used" in result ? { used: result.used === true } : {}) });
    }

    if (body.action === "start" && Object.keys(body).length === 4 && body.consent === true &&
      typeof body.garment === "string" && GARMENTS.has(body.garment)) {
      if (!settings.previewAvailable || !settings.apiKey) return json({ error: "The preview is not enabled yet." }, 503);
      const reservation = await callOps(settings, "reserve", { email, trialLimit: settings.trialLimit });
      const reservationId = typeof reservation.reservationId === "string" ? reservation.reservationId : "";
      if (!reservationId) return json({ error: MESSAGES.google_service_unavailable }, 503);
      try {
        const apiKey = await mintToken(settings.apiKey, settings.origin.origin);
        return json({ apiKey, reservationId });
      } catch {
        await callOps(settings, "release", { email, reservationId }).catch(() => undefined);
        return json({ error: "The live preview is temporarily unavailable. Your try has been restored." }, 502);
      }
    }
    return json({ error: "Check your answers and try again." }, 400);
  } catch (error) {
    if (error instanceof IntegrationError) return json({ error: MESSAGES[error.code] ?? "The service is temporarily unavailable." }, error.status);
    return json({ error: "The service is temporarily unavailable. Please try again later." }, 503);
  }
}
