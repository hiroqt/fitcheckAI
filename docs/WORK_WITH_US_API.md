# FitCheck AI — "Message Us" inquiry API

The **Work with us / Message Us** modal sends inquiries to `POST /api/inquiry`. The website server validates them, signs them, and forwards them to **FitCheck Ops** (`POST /public/v1/inquiries` on the Ops Convex site). They then appear in Ops → **Inquiries** as **Website · New · Unassigned**, with the usual notifications and first-response deadline.

The website stores nothing itself. **Success is returned only after Ops has stored the inquiry**, and the response carries the Ops inquiry id.

```
Modal ──Axios POST──▶ /api/inquiry ──signed POST (HMAC)──▶ Ops /public/v1/inquiries ──▶ Convex ──▶ Ops Inquiries
```

Source of truth for the Ops side: `fitcheck_sys/docs/contracts/inquiries-api.md`.

## Endpoints

| Method | Path | Notes |
|---|---|---|
| `POST` | `/api/inquiry` | **Preferred.** Same-origin only (no CORS). |
| `POST` | `/api/work-with-us` | Deprecated, kept for one release. Uses `type` instead of `inquiryType`. |
| `POST` | `/api/work-with-us/{general,pricing,demo}` | Deprecated, kept for one release. The type comes from the path. |

All paths use the same handler and rules. Legacy field names `notes` (→ `message`) and `garmentCategories` (→ `garmentStyles`) are still accepted; other old fields (`metadata`, `averagePrice`, …) are ignored.

## Request body (`application/json`, unknown keys rejected)

| Field | Type | Rules |
|---|---|---|
| `inquiryType` | `"general" \| "pricing" \| "demo"` | required |
| `brandName` | string | required, 2–120 |
| `contactEmail` | string | required, valid email, ≤254 |
| `contactPerson` | string | **required**, 1–120 |
| `phone` | string | optional, ≤40 |
| `storeUrl` | string | optional, ≤300 |
| `selectedPlan` | `"499" \| "1799" \| "larger_business" \| "enterprise"` | Pricing only. Without it (or for General/Demo) Ops stores **No plan selected**. |
| `garmentStyles` | string | Pricing only, optional, ≤300 |
| `preferredDate` | string | Demo only, optional, ≤100 |
| `message` | string | required (≥5) for General; optional otherwise. The labeled details above are added to it, and the **combined text must be ≤2,000**. |
| `consent` | `true` | required |
| `turnstileToken` | string | required: a Cloudflare Turnstile token rendered with `action: "inquiry"`. Single-use. |
| `submissionId` | string | optional, 8–64 of `[A-Za-z0-9_-]`, one per form session. Resending with the same id returns the stored inquiry instead of creating a duplicate. |
| `pagePath`, `utm` | string, `{source,medium,campaign,term,content}` | optional, captured by the modal |
| `hp_company_website` | string | honeypot; leave empty |

Plan → Ops interest: `499` → Starter, `1799` → Growth, `larger_business` → Larger business, `enterprise` → Custom.

## Responses

| Status | `code` | Meaning / what the modal does |
|---|---|---|
| `200` | — | `{ success: true, inquiryId, type, message }`. Stored in Ops (or already stored for this `submissionId`). |
| `400` | `VALIDATION` | `errors` maps field → message. Values the visitor typed are kept. |
| `403` | `VERIFICATION_FAILED` | Turnstile rejected; the widget is reset and the visitor sends again. |
| `429` | `RATE_LIMITED` | `retry-after` header. Email fallback shown. |
| `502` | `UNAVAILABLE` | Ops refused or failed (including a signature/config problem). Email fallback shown. |
| `503` | `UNAVAILABLE` | The website isn't configured to reach Ops. **Never reported as success.** |
| `504` | `TIMEOUT` | Not confirmed. Sending again is safe because of `submissionId`. |

There are **no automatic retries** (Turnstile tokens are single-use). A honeypot hit returns `200` without an `inquiryId`, and nothing is sent to Ops.

## Configuration

| Where | Variable | Value |
|---|---|---|
| Website (server) | `INTERNAL_SYSTEM_API_URL` | `https://<deployment>.convex.site/public/v1/inquiries`. HTTPS required except localhost in dev. **Previews → staging Ops; production → production Ops.** |
| Website (server) | `WEBSITE_HMAC_SECRET` | Same value as Ops' `WEBSITE_HMAC_SECRET` for that environment. Also keys the visitor-IP hash. |
| Website (public) | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key for this hostname. |
| Ops (Convex env) | `WEBSITE_HMAC_SECRET`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_HOSTNAME` | See the Ops contract. |

`FITCHECK_APPS_SCRIPT_URL` / `FITCHECK_APPS_SCRIPT_SECRET` are no longer used.

## Testing

`npm test` runs `lib/opsInquiry.test.mjs` against a local fake Ops server that verifies the signature the same way Ops does. It also asserts a signing test vector shared with `fitcheck_sys/convex/public/inquiries.test.ts`.

Manual calls (Postman: `docs/FitCheck_Work_With_Us.postman_collection.json`) need a real Turnstile token, or Cloudflare's [testing site/secret keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) on a **staging** Ops deployment. Never use production keys for testing.
