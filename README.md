# FitCheck AI

FitCheck is a Next.js site for Floating Brand’s fashion showcase, a browser-based garment style preview, and retailer pilot inquiries. A preview is a visual guide only; shoppers should use the seller’s size chart to check fit.

The public preview is disabled unless its Google integrations are configured, a finite trial cap is set, and the Decart approval and enable flags are explicitly on. The photo path repeats a still image as a video stream for Decart Lucy VTON 3.6; it needs provider-approved visual quality review before public activation.

## Requirements and local development

- Node.js compatible with Next.js 16
- npm

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page and legal pages work without the external integrations. The questionnaire and sign-in appear only after the showroom integration settings are valid; live previews require additional approval and configuration.

Available package scripts:

```bash
npm run dev       # Start the local Next.js server
npm run lint      # Run ESLint
npx tsc --noEmit  # Type-check the TypeScript project
npm run build     # Build the production site
npm start         # Serve a production build
```

## Routes and code map

| Path | Purpose |
| --- | --- |
| `/` | Landing page, interactive showroom, illustrative pilot pricing, FAQs, and Work With Us dialog |
| `/privacy` | Privacy notice for questionnaire, preview, and inquiry data |
| `/terms` | Terms for using the site and style preview |
| `/api/showroom` | Reports feature availability and handles questionnaire, reservation, and preview token requests |

The live landing page composition is in `app/page.tsx`. Its active sections are implemented in `app/components/`; the preview lifecycle is in `app/components/showroom/LiveTryOn.tsx`. Server-side showroom integration is in `app/api/showroom/route.ts`. `components/` and some other `app/components/` files also contain reusable UI and earlier experiments; a file’s presence alone does not mean it is used on the public page. Check imports from the route before changing a component.

Shared page styles and metadata are in `app/globals.css` and `app/layout.tsx`. Product and visual guidance live in [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md). Repository development guidance is in [the FitCheck development skill](.agents/skills/fitcheck-development/SKILL.md).

## Prepare the questionnaire and preview

The questionnaire follows the supplied [FitCheck Market Validation Survey](https://forms.gle/YuevfVHSMdS3B3BX9). It has seven steps. After a visitor chooses live camera or photo, the site collects the questionnaire and Google sign-in before offering the preview flow. Survey answers are sent to the configured Apps Script and saved in a private Google Sheet. The script’s `Access Control` tab tracks a keyed Google-email hash, survey completion, and reservation state; the verified email itself is not added to the survey response sheet.

### Google and Apps Script setup

1. In Google Cloud, configure the OAuth consent screen and a Web application OAuth client. Add the exact site origin to its authorized JavaScript origins. Only the client ID is public; never place an OAuth client secret in this app.
2. Set up the locally maintained `integrations/google-apps-script/Code.gs` in Apps Script. This file is intentionally excluded from Git. Set Script Properties:
   - `WEBHOOK_SECRET`: a random secret with at least 32 characters
   - `SPREADSHEET_ID`: `1j9ZSUrU8A0DKNjY47lSRkx_wErYhEn7kt_NWfOMe8_s`
   - `RESPONSE_SHEET_NAME`: `FitCheck Public Try-On Survey Responses`
   - `ACCESS_SHEET_NAME`: `Access Control`
3. Deploy the script as a web app that executes as the Sheet owner and accepts requests from anyone. Keep the Sheet owner-only. Copy the deployment `/exec` URL. The shared secret authenticates requests from the FitCheck server.
4. Create a local, gitignored `.env` file or configure server environment variables in the hosting provider. Set these four values to make the questionnaire and verified Google sign-in available:

   ```dotenv
   GOOGLE_OAUTH_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
   FITCHECK_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-deployment-id/exec
   FITCHECK_APPS_SCRIPT_SECRET=the-same-random-secret-as-WEBHOOK_SECRET
   FITCHECK_SHOWROOM_ORIGIN=https://your-exact-site-origin
   ```

   For local development, `FITCHECK_SHOWROOM_ORIGIN` may use the exact local origin, such as `http://localhost:3000`. The configured origin must match the browser request host and origin.

### Additional requirements to enable previews

Keep previews off until written provider approval covers consumer use, photo/video processing, retention, and model improvement or training. Once approved, add the following server-side values:

```dotenv
FITCHECK_SHOWROOM_LIMIT=approved-positive-integer
DECART_API_KEY=your-server-side-key
DECART_PUBLIC_USE_APPROVED=true
FITCHECK_PUBLIC_TRYON_ENABLED=true
```

`FITCHECK_SHOWROOM_LIMIT` is a finite cap on active reservations plus previews started in the preceding hour across all accounts. The endpoint issues a short-lived Decart client token restricted to Lucy VTON 3.6 and the configured site origin. Keep the API key and Apps Script secret server-only; do not prefix them with `NEXT_PUBLIC_`.

Once enabled, a verified Gmail or Google Workspace account can reserve one 15-second preview per hour across both modes, subject to the global cap. The cooldown starts when the first generated video frame appears. Failures before that point release the reservation. Audio is off. A preview can be stopped at any time; leaving the page also stops local camera tracks and preview resources.

The live-camera mode streams browser video to Decart. The photo mode accepts JPG, PNG, or WebP up to 10 MB, then repeats the selected still image into a video stream for the same provider model. In either mode, the browser also sends the selected garment image to Decart. FitCheck does not send body media through its own server or store body media or generated video. Stopping the preview clears local media, but cannot remove media already sent to Decart. Provider-side handling depends on the approved terms.

The survey retains its supplied research questions about camera use and a 30-second preview even though the current preview is 15 seconds and includes photo upload. Update the survey wording and the matching route validation together if the research questions need to reflect the current experience.

## Work With Us email drafts

The Work With Us dialog offers three choices: General inquiry, Pricing & availability, and Request a demo. Each opens a prefilled draft addressed to `fitcheckai0@gmail.com` in the visitor’s email app. Choosing a plan from the pricing section carries that plan into the pricing and availability draft. Nothing is sent automatically; the visitor reviews and sends the draft. This flow needs no email delivery service or server environment variables.

## Product and pilot limits

- Try-on output is an approximate visual style preview, not a sizing guarantee or a fabric simulation. Direct shoppers to the seller’s size chart.
- The showroom offers three illustrative garments. The hero garment imagery is editorial artwork, not a product photo.
- Prices and allowances shown on the landing page are proposed pilot options. There is no checkout or automatic billing flow in this codebase; inquiries open the Work With Us dialog. Confirm final allowances, session limits, taxes, and billing terms with each pilot brand before launch.
- Work With Us creates an email draft only. The visitor sends it from their email app; the website does not submit or store the inquiry.
