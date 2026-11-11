import { randomUUID } from "node:crypto";
import { closeSync, lstatSync, openSync } from "node:fs";
import { isAbsolute } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { CreateTokenResponse } from "@decartai/sdk";
import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "fitcheck_showroom";
const MODEL = "lucy-vton-3.6";
const MAX_BODY_BYTES = 512;
const GOALS = new Set(["style", "details", "curious"]);
const GARMENTS = new Set(["bomber", "tee", "hoodie", "terno", "barong"]);
const GARMENT_COLUMN = "garment TEXT NOT NULL DEFAULT 'bomber' CHECK(garment IN ('bomber', 'tee', 'hoodie', 'terno', 'barong'))";
const RATINGS = new Set(["yes", "somewhat", "no"]);

function getSettings() {
  const { DECART_API_KEY: apiKey, FITCHECK_SHOWROOM_ORIGIN: origin, FITCHECK_SHOWROOM_DB: path, FITCHECK_SHOWROOM_LIMIT: budget } = process.env;
  const limit = Number(budget);
  if (!apiKey?.trim() || !origin || !path || !isAbsolute(path) || !budget || !/^\d+$/.test(budget) || !Number.isSafeInteger(limit) || limit < 1) return;

  try {
    const url = new URL(origin);
    if (url.origin === origin && ["http:", "https:"].includes(url.protocol) && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
      return { apiKey, url, path, limit };
    }
  } catch {
    return;
  }
}

function matchesOrigin(headers: Headers, origin: URL, requireOrigin: boolean) {
  const site = headers.get("sec-fetch-site");
  const suppliedOrigin = headers.get("origin");
  return headers.get("host") === origin.host && (site === null || site === "same-origin") &&
    ((!requireOrigin && suppliedOrigin === null) || suppliedOrigin === origin.origin);
}

function json(data: object, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function getTrialId(request: NextRequest) {
  const id = request.cookies.get(COOKIE)?.value;
  return id && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(id) ? id : undefined;
}

function setTrialCookie(response: NextResponse, id: string, origin: URL) {
  response.cookies.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "strict",
    secure: origin.protocol === "https:",
    path: "/api/showroom",
    maxAge: 30 * 24 * 60 * 60,
  });
}

function openStore(path: string) {
  try {
    closeSync(openSync(path, "wx", 0o600));
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) throw error;
  }
  const file = lstatSync(path);
  if (!file.isFile() || (file.mode & 0o077) !== 0) throw new Error("Trial database must be a private regular file");

  const db = new DatabaseSync(path);
  try {
    db.exec(`
      PRAGMA busy_timeout = 500;
      CREATE TABLE IF NOT EXISTS showroom_trials (
        id TEXT PRIMARY KEY,
        goal TEXT NOT NULL CHECK(goal IN ('style', 'details', 'curious')),
        issued INTEGER NOT NULL DEFAULT 0 CHECK(issued IN (0, 1)),
        rating TEXT CHECK(rating IN ('yes', 'somewhat', 'no')),
        ${GARMENT_COLUMN}
      );
    `);
    const garmentColumn = db.prepare("SELECT 1 FROM pragma_table_info('showroom_trials') WHERE name = 'garment'");
    if (!garmentColumn.get()) {
      db.exec("BEGIN IMMEDIATE");
      // Another process may have migrated while this connection waited for the write lock.
      if (!garmentColumn.get()) db.exec(`ALTER TABLE showroom_trials ADD COLUMN ${GARMENT_COLUMN}`);
      db.exec("COMMIT");
    }
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}

async function readBody(request: NextRequest) {
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/json" || !request.body) return;

  const reader = request.body.getReader();
  const bytes = new Uint8Array(MAX_BODY_BYTES);
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (length + value.length > MAX_BODY_BYTES) {
        await reader.cancel();
        return;
      }
      bytes.set(value, length);
      length += value.length;
    }

    const payload: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, length)));
    if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
      return payload as Record<string, unknown>;
    }
  } catch {
    return;
  } finally {
    reader.releaseLock();
  }
}

async function mintToken(apiKey: string, origin: string) {
  const response = await fetch("https://api.decart.ai/v1/client/tokens", {
    method: "POST",
    headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      expiresIn: 20,
      allowedModels: [MODEL],
      allowedOrigins: [origin],
      constraints: { realtime: { maxSessionDuration: 20 } },
    }),
    signal: AbortSignal.timeout(8_000),
    cache: "no-store",
    redirect: "error",
  });
  if (!response.ok) throw new Error("Token request failed");

  const token = (await response.json()) as Partial<CreateTokenResponse> | null;
  if (typeof token?.apiKey !== "string" || !token.apiKey || token.constraints?.realtime?.maxSessionDuration !== 20 ||
    !Array.isArray(token.permissions?.models) || token.permissions.models.length !== 1 || token.permissions.models[0] !== MODEL ||
    !Array.isArray(token.permissions?.origins) || token.permissions.origins.length !== 1 || token.permissions.origins[0] !== origin) {
    throw new Error("Token response was missing restrictions");
  }
  return token.apiKey;
}

export function GET(request: NextRequest) {
  const headers = request.headers;
  const settings = getSettings();
  if (!settings || !matchesOrigin(headers, settings.url, false)) return json({ available: false });

  let db: DatabaseSync | undefined;
  try {
    db = openStore(settings.path);
    const count = db.prepare("SELECT count(*) AS total FROM showroom_trials").get();
    const available = Number(count?.total) < settings.limit;
    const id = getTrialId(request);
    const pending = id && db.prepare("SELECT garment FROM showroom_trials WHERE id = ? AND issued = 1 AND rating IS NULL").get(id);
    const response = json(pending ? { available, pendingFeedback: true, garment: pending.garment } : { available });
    if (available && !id) setTrialCookie(response, randomUUID(), settings.url);
    return response;
  } catch {
    return json({ available: false });
  } finally {
    db?.close();
  }
}

export async function POST(request: NextRequest) {
  const settings = getSettings();
  if (!settings) return json({ error: "The live trial is currently unavailable." }, 503);
  if (!matchesOrigin(request.headers, settings.url, true)) return json({ error: "This origin cannot access the live trial." }, 403);

  const id = getTrialId(request);
  if (!id) return json({ error: "Reload the showroom before starting your trial." }, 403);

  const body = await readBody(request);
  const start = body?.action === "start" && Object.keys(body).length === 4 && body.consent === true &&
    typeof body.goal === "string" && GOALS.has(body.goal) &&
    typeof body.garment === "string" && GARMENTS.has(body.garment) ? { goal: body.goal, garment: body.garment } : undefined;
  const rating = body?.action === "feedback" && Object.keys(body).length === 2 &&
    typeof body.rating === "string" && RATINGS.has(body.rating) ? body.rating : undefined;
  const answers = start ? { action: "start" as const, ...start } : rating ? { action: "feedback" as const, rating } : null;
  if (!answers) return json({ error: "Check your showroom answers and try again." }, 400);

  let db: DatabaseSync | undefined;
  try {
    db = openStore(settings.path);
    if (answers.action === "feedback") {
      const result = db.prepare(`
        UPDATE showroom_trials SET rating = ?
        WHERE id = ? AND issued = 1 AND (rating IS NULL OR rating = ?)
      `).run(answers.rating, id, answers.rating);
      return result.changes === 1 ? json({ success: true }) : json({ error: "There is no trial awaiting this feedback." }, 409);
    }

    const reservation = db.prepare(`
      INSERT INTO showroom_trials (id, goal, garment)
      SELECT ?, ?, ? WHERE (SELECT count(*) FROM showroom_trials) < ?
      ON CONFLICT(id) DO NOTHING
    `).run(id, answers.goal, answers.garment, settings.limit);
    if (reservation.changes !== 1) {
      const used = db.prepare("SELECT 1 FROM showroom_trials WHERE id = ?").get(id);
      return used
        ? json({ error: "This browser has already started a free trial." }, 409)
        : json({ error: "All free trials have been claimed." }, 429);
    }

    let apiKey: string;
    try {
      apiKey = await mintToken(settings.apiKey, settings.url.origin);
    } catch {
      db.prepare("DELETE FROM showroom_trials WHERE id = ? AND issued = 0").run(id);
      return json({ error: "The live preview could not start. Please try again." }, 502);
    }

    db.prepare("UPDATE showroom_trials SET issued = 1 WHERE id = ?").run(id);
    const response = json({ apiKey });
    setTrialCookie(response, id, settings.url);
    return response;
  } catch {
    return json({ error: "The live trial is currently unavailable." }, 503);
  } finally {
    db?.close();
  }
}
