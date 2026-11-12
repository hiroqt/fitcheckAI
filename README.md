# FitCheck AI

FitCheck is a browser-based garment style preview for Philippine fashion retailers. The public showroom is prepared but remains disabled until Google integrations are configured and Decart has approved consumer use and the applicable media terms in writing.

## Run locally

```bash
npm ci
npm run dev
```

Open [the local site](http://localhost:3000). Without the configuration below, the questionnaire and preview remain unavailable.

## Prepare the survey and try-on preview

The survey reproduces the [FitCheck Market Validation Survey](https://forms.gle/YuevfVHSMdS3B3BX9) questions in the site as a non-scrolling, seven-step modal, then writes answers to the owner-only [FitCheck Public Try-On Survey Responses Sheet](https://docs.google.com/spreadsheets/d/1j9ZSUrU8A0DKNjY47lSRkx_wErYhEn7kt_NWfOMe8_s/edit). Confirm that its response tab remains private. Its hidden `Access Control` tab stores a keyed Google-email hash, survey completion time, and reservation state. Visitors first choose live camera or photo upload; the survey appears after that choice, and both preview modes share one 15-second attempt per hour per account.

1. In Google Cloud, configure the OAuth consent screen and a Web application OAuth client. Add the exact site origin to its authorized JavaScript origins. Use the client ID only in the public configuration; never expose a client secret.
2. Use your locally maintained `integrations/google-apps-script/Code.gs` in Apps Script; the file is intentionally excluded from Git. Set Script Properties: `WEBHOOK_SECRET` to a random secret of at least 32 characters, `SPREADSHEET_ID` to `1j9ZSUrU8A0DKNjY47lSRkx_wErYhEn7kt_NWfOMe8_s`, `RESPONSE_SHEET_NAME` to `FitCheck Public Try-On Survey Responses`, and `ACCESS_SHEET_NAME` to `Access Control`.
3. Deploy the script as a web app that executes as the Sheet owner and accepts requests from anyone. Keep the Sheet owner-only. Copy the `/exec` URL. The shared secret authenticates requests from the FitCheck server.
4. For local use, fill the matching values in the gitignored root `.env`; for a deployed site, set them in the hosting provider’s server environment:

   ```dotenv
   GOOGLE_OAUTH_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
   FITCHECK_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-deployment-id/exec
   FITCHECK_APPS_SCRIPT_SECRET=the-same-random-secret-as-WEBHOOK_SECRET
   FITCHECK_SHOWROOM_ORIGIN=https://your-exact-site-origin
   FITCHECK_SHOWROOM_LIMIT=replace-with-approved-hourly-cap
   DECART_API_KEY=your-server-side-key
   DECART_PUBLIC_USE_APPROVED=true
   FITCHECK_PUBLIC_TRYON_ENABLED=true
   ```

   Configure the first five values to prepare the questionnaire and identity gate. Leave both preview flags unset/false and do not configure a Decart key until written approval covers consumer use, photo/video processing, retention, and model improvement/training. Set a finite trial limit suited to the approved credits before enabling previews. The local `.env` contains blank integration values and does not include credentials.

After sign-in, a verified Gmail or Google Workspace account can reserve one attempt per hour across both modes, subject to availability. The cooldown starts when the generated video first appears. Setup failures beforehand release the reservation. `FITCHECK_SHOWROOM_LIMIT` caps active reservations and previews started in the preceding hour across all accounts. Existing `Used at` timestamps apply automatically when the updated script is deployed. The 15-second clock starts when the video begins playing. The browser either streams the user's live camera or converts the chosen photo into a repeated video stream for Decart Lucy VTON 3.6; FitCheck does not persist body media or result. Closing/stopping clears the browser’s media, but cannot delete media already sent to Decart. The photo-to-video path needs a provider-approved visual quality check before public activation.

The survey text intentionally matches the supplied Google Form, including its camera and 30-second-preview research questions, although this prepared experience uses a photo and 15 seconds. Update the survey and matching validation/header values together if you want the metrics to describe the new experience.

## Configure Work With Us email

The Work With Us form sends inquiries through the server using Resend. Configure these server-only variables in the Vercel project before enabling live delivery:

```dotenv
RESEND_API_KEY=your-resend-api-key
FITCHECK_CONTACT_FROM=FitCheck <contact@your-verified-domain.example>
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-rest-token
```

Verify the sender domain in Resend and use an authorized sender address. Create an Upstash Redis database with REST access; the endpoint must use HTTPS. Keep all four values in the hosting provider's server environment and out of browser-visible variables. When Vercel's trusted `x-vercel-forwarded-for` address is available, the endpoint allows up to 5 attempts per IP (IPv6 grouped by /64) and 50 total attempts in each 10-minute window. Without a trusted address, requests share one 5-attempt bucket per 10-minute window. Missing email or rate-limit configuration and Redis failures fail closed. If a deployment needs per-client-IP controls outside Vercel, configure its WAF separately; the app's shared fallback bucket remains active. If server delivery cannot proceed, the form offers an email draft for the visitor to open and send themselves; a draft being opened is not a sent or accepted inquiry.

Do not report live email delivery until these settings are present and a controlled end-to-end check confirms provider acceptance. A successful provider response confirms acceptance for processing, not inbox delivery.

## Development

Use `$fitcheck-development` for repository-specific development and review. The same guidance is available to contributors and tools that load instructions manually. [Development skill](.agents/skills/fitcheck-development/SKILL.md)

The site uses Next.js App Router, React, Tailwind CSS, and Three.js. See [product context](PRODUCT.md) and [visual direction](DESIGN.md).

```bash
npm run lint
npx tsc --noEmit
npm run build
```
