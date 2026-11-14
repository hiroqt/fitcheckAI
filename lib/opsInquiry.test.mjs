import assert from "node:assert/strict";
import { createHmac, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { registerHooks } from "node:module";
import { after, before, beforeEach, describe, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// Resolve the app's `@/` alias and extensionless TS imports the way Next does.
const root = new URL("../", import.meta.url);
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "next/server") return nextResolve("next/server.js", context);
    const fromApp = context.parentURL?.startsWith("file:") && !context.parentURL.includes("/node_modules/");
    let target = specifier.startsWith("@/") ? new URL(specifier.slice(2), root).href : null;
    if (!target && fromApp && specifier.startsWith(".")) target = new URL(specifier, context.parentURL).href;
    if (target && !/\.[cm]?[jt]sx?$/.test(target)) target = existsSync(fileURLToPath(`${target}.ts`)) ? `${target}.ts` : target;
    if (target && !specifier.startsWith("@/") && !target.endsWith(".ts")) target = null;
    return nextResolve(target ?? specifier, context);
  },
});
const { NextRequest } = await import("next/server.js");
const ops = await import("./opsInquiry.ts");
const confirm = await import("./inquiryConfirmation.ts");
const { POST } = await import(pathToFileURL(fileURLToPath(new URL("app/api/inquiry/route.ts", root))).href);
hooks.deregister();

const SECRET = "test-website-secret";

/** Fake Ops: verifies the signature exactly like fitcheck_sys `convex/lib/hmac.ts`. */
let server;
let received = [];
let respond = () => ({ status: 201, body: { id: "inq_ops_1" } });
/** Fake Resend (`POST /emails`) on the same server. */
let emails = [];
let respondEmail = () => ({ status: 200, body: { id: "email_1" } });
before(async () => {
  server = createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", async () => {
      if (req.url === "/emails") {
        emails.push({ body: JSON.parse(raw), headers: req.headers });
        const r = respondEmail();
        res.writeHead(r.status, { "content-type": "application/json" });
        return res.end(JSON.stringify(r.body));
      }
      const ts = req.headers["x-ops-timestamp"];
      const expected = createHmac("sha256", SECRET).update(`${ts}.${raw}`).digest();
      const given = Buffer.from(String(req.headers["x-ops-signature"] ?? ""), "hex");
      const signed = given.length === expected.length && timingSafeEqual(given, expected);
      received.push({ raw, body: JSON.parse(raw), headers: req.headers, signed });
      const r = await respond();
      if (r.delayMs) await new Promise((ok) => setTimeout(ok, r.delayMs));
      if (res.destroyed) return;
      res.writeHead(signed ? r.status : 401, { "content-type": "application/json", ...(r.headers ?? {}) });
      res.end(JSON.stringify(signed ? r.body : { error: { code: "UNAUTHORIZED", message: "Invalid signature" } }));
    });
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
});
after(() => server.close());

const env = { ...process.env };
beforeEach(() => {
  received = [];
  emails = [];
  respond = () => ({ status: 201, body: { id: "inq_ops_1" } });
  respondEmail = () => ({ status: 200, body: { id: "email_1" } });
  process.env = { ...env, NODE_ENV: "test", WEBSITE_HMAC_SECRET: SECRET, INTERNAL_SYSTEM_API_URL: `http://127.0.0.1:${server.address().port}/public/v1/inquiries` };
});
after(() => (process.env = env));

let ip = 0;
const base = {
  brandName: "Habi Atelier",
  contactEmail: "Rina@Habi.ph",
  contactPerson: "Rina Dela Cruz",
  consent: true,
  turnstileToken: "tok",
  submissionId: "6f1c2a9e-1d2b-4c3d-9e8f-0a1b2c3d4e5f",
};
function call(handler, body) {
  return handler(new NextRequest("http://127.0.0.1:3000/api/inquiry", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ip}` },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }));
}

describe("signing", () => {
  test("shared test vector (same value asserted in fitcheck_sys convex/public/inquiries.test.ts)", () => {
    const body = JSON.stringify({ brandName: "Habi Atelier", interest: "undecided" });
    assert.equal(ops.signOpsBody("fitcheck-shared-test-vector", body, "1794470400"), "a81bc91c533a40672a10355b2da5350b6725ec2f25610f81a788cb2bf698e223");
  });
});

describe("POST /api/inquiry → Ops", () => {
  test("pricing with a plan: signed exact bytes, mapped fields, hashed IP, success only with the Ops id", async () => {
    const res = await call(POST, { ...base, inquiryType: "pricing", selectedPlan: "1799", storeUrl: "@habi", garmentStyles: "Barong", message: "Pilot in Dec", pagePath: "/", utm: { source: "ig" } });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { success: true, inquiryId: "inq_ops_1", type: "pricing", message: "Your inquiry has been received. Our team will contact you shortly." });
    const [r] = received;
    assert.equal(r.signed, true);
    assert.deepEqual(r.body, {
      brandName: "Habi Atelier",
      contactName: "Rina Dela Cruz",
      email: "rina@habi.ph",
      interest: "growth",
      inquiryType: "pricing",
      message: "Store / Instagram: @habi\nGarment styles: Barong\n\nPilot in Dec",
      consent: true,
      turnstileToken: "tok",
      submissionId: base.submissionId,
      pagePath: "/",
      utm: { source: "ig" },
    });
    assert.match(r.headers["x-client-ip-hash"], /^[0-9a-f]{64}$/);
    assert.ok(!r.raw.includes("10.0.0."), "raw IP never leaves the website");
  });

  test("general and demo send interest undecided; demo date goes into the message", async () => {
    assert.equal((await call(POST, { ...base, inquiryType: "general", message: "Hello there" })).status, 200);
    assert.equal((await call(POST, { ...base, inquiryType: "demo", preferredDate: "Tue 2pm", selectedPlan: "499" })).status, 200);
    assert.deepEqual(received.map((r) => [r.body.inquiryType, r.body.interest]), [["general", "undecided"], ["demo", "undecided"]]);
    assert.equal(received[1].body.message, "Preferred demo time: Tue 2pm");
  });

  test("Ops 200 (same submissionId already stored) is a success with the original id", async () => {
    respond = () => ({ status: 200, body: { id: "inq_existing" } });
    const res = await call(POST, { ...base, inquiryType: "general", message: "Hello again" });
    assert.equal(res.status, 200);
    assert.equal((await res.json()).inquiryId, "inq_existing");
  });

  test("local validation: contact name, consent and Turnstile required; nothing forwarded", async () => {
    const res = await call(POST, { ...base, inquiryType: "general", message: "Hello", contactPerson: "", consent: false, turnstileToken: "" });
    assert.equal(res.status, 400);
    const { errors } = await res.json();
    assert.ok(errors.contactPerson && errors.consent && errors.turnstileToken);
    assert.equal((await call(POST, { ...base, inquiryType: "general", message: "Hi there", extra: 1 })).status, 400);
    assert.equal((await call(POST, { ...base, inquiryType: "pricing", message: "x".repeat(1990), storeUrl: "https://example.com/store" })).status, 400, "combined message over 2,000");
    assert.equal((await call(POST, "not json")).status, 400);
    assert.equal(received.length, 0);
  });

  test("honeypot → thank-you without an id and nothing forwarded", async () => {
    const res = await call(POST, { ...base, inquiryType: "general", message: "Hello", hp_company_website: "spam" });
    assert.equal(res.status, 200);
    assert.equal((await res.json()).inquiryId, undefined);
    assert.equal(received.length, 0);
  });

  test("Ops rejections map to truthful errors", async () => {
    const ask = () => call(POST, { ...base, inquiryType: "general", message: "Hello" });
    respond = () => ({ status: 403, body: { error: { code: "UNAUTHORIZED", message: "Bot verification failed" } } });
    let res = await ask();
    assert.equal(res.status, 403);
    assert.ok((await res.json()).errors.turnstileToken);

    respond = () => ({ status: 400, body: { error: { code: "VALIDATION", message: "Invalid field: email" } } });
    res = await ask();
    assert.equal(res.status, 400);
    assert.ok((await res.json()).errors.contactEmail);

    respond = () => ({ status: 429, body: { error: { code: "RATE_LIMITED", message: "x" } }, headers: { "retry-after": "42" } });
    res = await ask();
    assert.equal(res.status, 429);
    assert.equal(res.headers.get("retry-after"), "42");

    respond = () => ({ status: 500, body: { error: { code: "MISCONFIGURED", message: "x" } } });
    res = await ask();
    assert.equal(res.status, 502);
    assert.equal((await res.json()).success, false);

    process.env.WEBSITE_HMAC_SECRET = "wrong-secret";
    res = await ask();
    assert.equal(res.status, 502, "bad signature (401 from Ops) is never reported as success");
  });

  test("missing configuration → 503, never a fake success", async () => {
    delete process.env.INTERNAL_SYSTEM_API_URL;
    const res = await call(POST, { ...base, inquiryType: "general", message: "Hello" });
    assert.equal(res.status, 503);
    assert.equal((await res.json()).success, false);
    process.env.INTERNAL_SYSTEM_API_URL = "http://ops.example.com/public/v1/inquiries";
    assert.equal((await call(POST, { ...base, inquiryType: "general", message: "Hello" })).status, 503, "non-HTTPS remote URL refused");
    assert.equal(received.length, 0);
  });

  test("timeout is reported as unconfirmed, not success", async () => {
    respond = () => ({ status: 201, body: { id: "late" }, delayMs: 300 });
    const result = await ops.forwardToOps(ops.toOpsPayload({ ...base, contactEmail: "rina@habi.ph", inquiryType: "general", message: "Hello" }), ops.getOpsConfig(), "1.2.3.4", Date.now(), 50);
    assert.deepEqual(result, { ok: false, kind: "timeout" });
  });
});

const until = async (check, ms = 1000) => {
  const end = Date.now() + ms;
  while (!check() && Date.now() < end) await new Promise((ok) => setTimeout(ok, 10));
};
const withEmail = (extra = {}) => {
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.INQUIRY_CONFIRMATION_FROM = "FitCheck AI <hello@tryfitcheckai.online>";
  process.env.RESEND_API_URL = `http://127.0.0.1:${server.address().port}/emails`;
  Object.assign(process.env, extra);
};

describe("visitor confirmation email", () => {
  test("sent once after Ops stores the inquiry: to the visitor, idempotent, no visitor-typed text", async () => {
    withEmail({ INQUIRY_CONFIRMATION_REPLY_TO: "fitcheckai0@gmail.com" });
    const res = await call(POST, { ...base, inquiryType: "pricing", selectedPlan: "1799", storeUrl: "@habi-store", message: "Visit http://spam.example now" });
    assert.equal(res.status, 200);
    await until(() => emails.length === 1);
    assert.equal(emails.length, 1);
    const [e] = emails;
    assert.equal(e.headers.authorization, "Bearer re_test_key");
    assert.equal(e.headers["idempotency-key"], "inquiry-confirmation/inq_ops_1");
    assert.deepEqual(e.body.to, ["rina@habi.ph"]);
    assert.equal(e.body.from, "FitCheck AI <hello@tryfitcheckai.online>");
    assert.equal(e.body.reply_to, "fitcheckai0@gmail.com");
    assert.equal(e.body.subject, "We received your FitCheck AI inquiry");
    assert.match(e.body.text, /pricing & availability inquiry for the Growth · ₱1,799 prepaid pack/);
    assert.match(e.body.text, /Reference ID: inq_ops_1/);
    assert.match(e.body.text, /just reply to this email/);
    for (const typed of ["spam.example", "habi-store", "Habi Atelier", "Rina Dela Cruz"]) {
      assert.ok(!JSON.stringify(e.body).includes(typed), `email must not echo "${typed}"`);
    }
  });

  test("not sent for a duplicate submissionId, a honeypot hit, or a failed inquiry", async () => {
    withEmail();
    respond = () => ({ status: 200, body: { id: "inq_existing" } });
    assert.equal((await call(POST, { ...base, inquiryType: "general", message: "Hello again" })).status, 200);
    respond = () => ({ status: 201, body: { id: "inq_ops_1" } });
    assert.equal((await call(POST, { ...base, inquiryType: "general", message: "Hello", hp_company_website: "x" })).status, 200);
    respond = () => ({ status: 403, body: { error: { code: "UNAUTHORIZED", message: "x" } } });
    assert.equal((await call(POST, { ...base, inquiryType: "general", message: "Hello" })).status, 403);
    await new Promise((ok) => setTimeout(ok, 100));
    assert.equal(emails.length, 0);
  });

  test("off when not configured, and a Resend failure never fails the inquiry", async () => {
    let res = await call(POST, { ...base, inquiryType: "general", message: "Hello" });
    assert.equal(res.status, 200);
    await new Promise((ok) => setTimeout(ok, 100));
    assert.equal(emails.length, 0, "no RESEND_API_KEY → no email");

    withEmail();
    respondEmail = () => ({ status: 500, body: { name: "application_error" } });
    res = await call(POST, { ...base, inquiryType: "demo" });
    assert.equal(res.status, 200);
    assert.equal((await res.json()).success, true);
    await until(() => emails.length === 1);
    assert.equal(emails.length, 1);
  });

  test("email copy: no reply line without reply-to; HTML is escaped; header injection refused", () => {
    const e = confirm.buildConfirmationEmail({ inquiryType: "demo", referenceId: "<id&1>", canReply: false });
    assert.match(e.text, /We've received your demo request\./);
    assert.ok(!e.text.includes("reply to this email"));
    assert.ok(e.html.includes("&lt;id&amp;1&gt;") && !e.html.includes("<id&1>"));
    assert.equal(confirm.getConfirmationConfig({ RESEND_API_KEY: "k", INQUIRY_CONFIRMATION_FROM: "a@b.co\r\nBcc: x@y.z" }), null);
    assert.equal(confirm.getConfirmationConfig({ NODE_ENV: "production", RESEND_API_KEY: "k", INQUIRY_CONFIRMATION_FROM: "a@b.co", RESEND_API_URL: "http://evil" }).endpoint, "https://api.resend.com/emails");
  });
});
