import assert from "node:assert/strict";
import { mkdtempSync, rmSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { NextRequest } from "next/server.js";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(specifier === "next/server" ? "next/server.js" : specifier, context);
  },
});
const { GET, POST } = await import("./route.ts");
hooks.deregister();

test("limits free showroom starts and stores feedback without a live provider request", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "fitcheck-showroom-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const origin = "http://127.0.0.1:3000";
  const path = join(dir, "test.sqlite");
  const settings = {
    DECART_API_KEY: "test-only",
    FITCHECK_SHOWROOM_ORIGIN: origin,
    FITCHECK_SHOWROOM_DB: path,
    FITCHECK_SHOWROOM_LIMIT: "1",
  };
  const original = Object.fromEntries(Object.keys(settings).map((name) => [name, process.env[name]]));
  t.after(() => {
    for (const [name, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });

  function get(cookie = "") {
    return GET(new NextRequest(`${origin}/api/showroom`, { headers: { host: "127.0.0.1:3000", cookie } }));
  }

  function post(body, cookie, suppliedOrigin = origin) {
    return POST(new NextRequest(`${origin}/api/showroom`, {
      method: "POST",
      headers: { host: "127.0.0.1:3000", origin: suppliedOrigin, "content-type": "application/json", cookie },
      body: JSON.stringify(body),
    }));
  }

  delete process.env.DECART_API_KEY;
  assert.deepEqual(await get().json(), { available: false });
  Object.assign(process.env, { ...settings, FITCHECK_SHOWROOM_ORIGIN: "https://example.test" });
  assert.deepEqual(await get().json(), { available: false });
  Object.assign(process.env, settings);

  const availability = get();
  assert.deepEqual(await availability.json(), { available: true });
  assert.equal(statSync(path).mode & 0o777, 0o600);
  assert.equal(availability.headers.get("cache-control"), "no-store");
  const cookieHeader = availability.headers.get("set-cookie");
  assert.match(cookieHeader, /HttpOnly; SameSite=strict/i);
  const cookie = cookieHeader.split(";", 1)[0];
  const otherCookie = get().headers.get("set-cookie").split(";", 1)[0];

  const start = { action: "start", garment: "bomber", goal: "style", consent: true };
  assert.equal((await post(start, cookie, "https://example.test")).status, 403);
  assert.equal((await post(start, "")).status, 403);
  assert.equal((await post({ ...start, consent: false }, cookie)).status, 400);
  assert.equal((await post({ ...start, unexpected: true }, cookie)).status, 400);
  assert.equal((await post({ ...start, oversized: "x".repeat(512) }, cookie)).status, 400);
  assert.equal((await post({ action: "feedback", rating: "yes" }, cookie)).status, 409);

  const provider = t.mock.method(globalThis, "fetch", async () => Response.json({ message: "upstream test error" }, { status: 502 }));
  const failed = await post(start, cookie);
  assert.equal(failed.status, 502);
  assert.doesNotMatch(await failed.text(), /upstream test error/);
  assert.deepEqual(await get().json(), { available: true });

  provider.mock.mockImplementation(async () => Response.json({ apiKey: "unrestricted-test-token" }));
  const unrestricted = await post(start, cookie);
  assert.equal(unrestricted.status, 502);
  assert.doesNotMatch(await unrestricted.text(), /unrestricted-test-token/);

  let release;
  let providerStarted;
  const pendingProvider = new Promise((resolve) => { providerStarted = resolve; });
  provider.mock.mockImplementation(async (url, options) => {
    assert.equal(url, "https://api.decart.ai/v1/client/tokens");
    assert.deepEqual(JSON.parse(options.body), {
      expiresIn: 20,
      allowedModels: ["lucy-vton-3.6"],
      allowedOrigins: [origin],
      constraints: { realtime: { maxSessionDuration: 20 } },
    });
    await new Promise((resolve) => {
      release = resolve;
      providerStarted();
    });
    return Response.json({
      apiKey: "short-lived-test-token",
      permissions: { models: ["lucy-vton-3.6"], origins: [origin] },
      constraints: { realtime: { maxSessionDuration: 20 } },
    });
  });

  const starting = post(start, cookie);
  await pendingProvider;
  const [sameBrowser, otherBrowser] = await Promise.all([post(start, cookie), post(start, otherCookie)]);
  assert.equal(sameBrowser.status, 409);
  assert.equal(otherBrowser.status, 429);
  release();
  const started = await starting;
  assert.deepEqual(await started.json(), { apiKey: "short-lived-test-token" });
  assert.equal(started.headers.get("cache-control"), "no-store");
  assert.equal(provider.mock.callCount(), 3);
  assert.deepEqual(await get().json(), { available: false });
  assert.deepEqual(await get(cookie).json(), { available: false, pendingFeedback: true });

  const feedback = { action: "feedback", rating: "yes" };
  assert.deepEqual(await (await post(feedback, cookie)).json(), { success: true });
  assert.deepEqual(await get(cookie).json(), { available: false });
  assert.equal((await post(feedback, cookie)).status, 200);
  assert.equal((await post({ ...feedback, rating: "no" }, cookie)).status, 409);

  const db = new DatabaseSync(path, { readOnly: true });
  try {
    const rows = db.prepare("SELECT goal, garment, issued, rating FROM showroom_trials").all();
    assert.deepEqual(rows.map((row) => ({ ...row })), [{ goal: "style", garment: "bomber", issued: 1, rating: "yes" }]);
  } finally {
    db.close();
  }
});
