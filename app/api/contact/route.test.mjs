import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { NextRequest } from "next/server.js";

const hooks = registerHooks({ resolve(specifier, context, nextResolve) { return nextResolve(specifier === "next/server" ? "next/server.js" : specifier === "@/app/lib/emailTemplates" ? new URL("../../lib/emailTemplates.ts", import.meta.url).pathname : specifier, context); } });
const { POST } = await import("./route.ts");
hooks.deregister();

const origin = "https://fitcheck.test";
const settings = { VERCEL: "1", UPSTASH_REDIS_REST_URL: "https://redis.test", UPSTASH_REDIS_REST_TOKEN: "test-token", RESEND_API_KEY: "resend-test", FITCHECK_CONTACT_FROM: "FitCheck <contact@fitcheck.test>" };
const original = Object.fromEntries(Object.keys(settings).map((key) => [key, process.env[key]]));
Object.assign(process.env, settings);
test.after(() => {
  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function request(body, extra = {}) {
  return new NextRequest(`${origin}/api/contact`, { method: "POST", headers: { host: "fitcheck.test", origin, "sec-fetch-site": "same-origin", "content-type": "application/json", "x-vercel-forwarded-for": "203.0.113.10", ...extra }, body });
}
const valid = { email: "studio+hello@example.com", title: "Partnership", message: "Hello\nthere  " };

test("validates media, origin, bounded JSON, and fields before provider calls", async () => {
  const provider = test.mock.method(globalThis, "fetch", async () => { throw new Error("unexpected request"); });
  assert.equal((await POST(request(JSON.stringify(valid), { "content-type": "text/plain" }))).status, 415);
  assert.equal((await POST(request(JSON.stringify(valid), { origin: "https://evil.test" }))).status, 403);
  assert.equal((await POST(request(JSON.stringify(valid), { "sec-fetch-site": "cross-site" }))).status, 403);
  assert.equal((await POST(request("{"))).status, 400);
  assert.equal((await POST(request("[]"))).status, 400);
  assert.equal((await POST(request(JSON.stringify({ ...valid, email: "Name <a@example.com>" })))).status, 400);
  assert.equal((await POST(request(JSON.stringify({ ...valid, title: "x\r\nBcc: bad@example.com" })))).status, 400);
  assert.equal((await POST(request(JSON.stringify({ ...valid, message: "x\u0000y" })))).status, 400);
  assert.equal((await POST(request(JSON.stringify(valid), { "content-length": "32769" }))).status, 413);
  assert.equal((await POST(request(JSON.stringify({ ...valid, email: "x\u0085@example.com" })))).status, 400);
  assert.equal((await POST(request(JSON.stringify({ ...valid, email: " .a@example.com " })))).status, 400);
  assert.equal((await POST(request(JSON.stringify(valid), { "content-length": "false" }))).status, 413);
  assert.equal(provider.mock.callCount(), 0);
});

test("uses atomic Redis limits and sends a fixed-address escaped email", async () => {
  const calls = [];
  const mock = test.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url) === `${settings.UPSTASH_REDIS_REST_URL}/`) return Response.json({ result: [1, 1, 600, 600, 0] });
    return Response.json({ id: "mail-id" });
  });
  const response = await POST(request(JSON.stringify(valid)));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(calls.length, 2);
  const redisRequest = JSON.parse(calls[0].options.body);
  assert.equal(redisRequest[0], "EVAL");
  assert.match(redisRequest[3], /[a-f0-9]{64}$/);
  assert.doesNotMatch(redisRequest[3], /203\.0\.113/);
  const mappedCalls = [];
  const mapped = test.mock.method(globalThis, "fetch", async (url, options) => {
    mappedCalls.push({ url: String(url), options });
    return String(url) === `${settings.UPSTASH_REDIS_REST_URL}/` ? Response.json({ result: [1, 1, 600, 600, 0] }) : Response.json({ id: "mail-id" });
  });
  await POST(request(JSON.stringify(valid), { "x-vercel-forwarded-for": "::ffff:cb00:710a" }));
  assert.equal(JSON.parse(mappedCalls[0].options.body)[3], redisRequest[3]);
  await POST(request(JSON.stringify(valid), { "x-vercel-forwarded-for": "2001:db8:abcd:12::1" }));
  const firstV6Key = JSON.parse(mappedCalls[2].options.body)[3];
  await POST(request(JSON.stringify(valid), { "x-vercel-forwarded-for": "2001:db8:abcd:12:ffff::2" }));
  assert.equal(JSON.parse(mappedCalls[4].options.body)[3], firstV6Key);
  mapped.mock.restore();
  const email = JSON.parse(calls[1].options.body);
  assert.equal(email.to[0], "fitcheckai0@gmail.com");
  assert.equal(email.from, settings.FITCHECK_CONTACT_FROM);
  assert.equal(email.reply_to, valid.email);
  assert.match(email.html, /Hello<br|Hello\n/);
  assert.equal(calls[1].options.redirect, "error");
  mock.mock.restore();
});

test("accepts exact limits then reports the blocking counter TTL", async () => {
  for (const result of [[5, 5, 600, 600, 0], [1, 50, 600, 600, 0]]) {
    const mock = test.mock.method(globalThis, "fetch", async (url) => String(url) === `${settings.UPSTASH_REDIS_REST_URL}/` ? Response.json({ result }) : Response.json({ id: "mail-id" }));
    assert.equal((await POST(request(JSON.stringify(valid)))).status, 200);
    mock.mock.restore();
  }
  const realNow = Date.now;
  Date.now = () => 1_700_000_000_000;
  try {
  for (const [result, retryAfter] of [
    [[5, 5, 44, 90, 1], "44"],
    [[0, 50, -2, 75, 1], "75"],
  ]) {
    const mock = test.mock.method(globalThis, "fetch", async () => Response.json({ result }));
    const response = await POST(request(JSON.stringify(valid)));
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("retry-after"), retryAfter);
    mock.mock.restore();
  }
  } finally { Date.now = realNow; }
});

test("requires configured verified sender and provider receipt id", async () => {
  process.env.FITCHECK_CONTACT_FROM = "FitCheck <onboarding@resend.dev>";
  const invalidFrom = test.mock.method(globalThis, "fetch", async () => { throw new Error("must not call provider"); });
  assert.equal((await POST(request(JSON.stringify(valid)))).status, 503);
  assert.equal(invalidFrom.mock.callCount(), 0);
  process.env.FITCHECK_CONTACT_FROM = settings.FITCHECK_CONTACT_FROM;
  const noId = test.mock.method(globalThis, "fetch", async (url) => String(url) === `${settings.UPSTASH_REDIS_REST_URL}/` ? Response.json({ result: [1, 1, 600, 600, 0] }) : Response.json({}));
  const failedReceipt = await POST(request(JSON.stringify(valid)));
  assert.equal(failedReceipt.status, 502);
  assert.deepEqual(await failedReceipt.json(), { success: false, error: "Message could not be sent. Please try again later." });
  noId.mock.restore();
});

test("fails closed when the distributed limiter is unavailable", async () => {
  const mock = test.mock.method(globalThis, "fetch", async () => new Response("down", { status: 503 }));
  const response = await POST(request(JSON.stringify(valid)));
  assert.equal(response.status, 503);
  assert.equal(mock.mock.callCount(), 1);
  mock.mock.restore();

  const persistentKey = test.mock.method(globalThis, "fetch", async (url) => String(url) === `${settings.UPSTASH_REDIS_REST_URL}/`
    ? Response.json({ result: [1, 1, -1, 600, 0] })
    : Response.json({ id: "must-not-send" }));
  const invalidTtl = await POST(request(JSON.stringify(valid)));
  assert.equal(invalidTtl.status, 503);
  assert.equal(persistentKey.mock.callCount(), 1);
});
