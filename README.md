# FitCheck AI

FitCheck is a browser-based garment style preview for Philippine fashion retailers. The landing page features Floating Brand and introduces FitCheck’s retailer pilot.

## Run locally

```bash
npm ci
npm run dev
```

Open [the local site](http://localhost:3000).

## Local live try-on evaluation

Use Node.js 22.15 or newer. The showroom offers a bomber, a Filipiniana terno, and an embroidered barong as illustrative fashion concepts. The bomber uses the existing hero jacket image. Use approved catalog images before testing commercial garments.

For an authorized professional evaluation, set these values in the ignored `.env.local` file. Keep the key on the server.

```dotenv
DECART_API_KEY=your-server-key
FITCHECK_SHOWROOM_ORIGIN=http://127.0.0.1:3000
FITCHECK_SHOWROOM_DB=/absolute/private/path/showroom.sqlite
FITCHECK_SHOWROOM_LIMIT=5
```

Choose a private directory that already exists for the SQLite file. Start the site with `npm run dev -- --hostname 127.0.0.1`. Open the same address configured above. The live preview is disabled when configuration is missing. Run on loopback without a tunnel or reverse proxy. Confirm shopper-facing use and media handling with Decart before making this trial publicly available. [Decart API terms](https://docs.platform.decart.ai/resources/api-terms)

The trial issues one token per browser cookie and uses the SQLite file to enforce the total issuance limit across restarts. Decart caps each session at 20 seconds. Use a dedicated, limited-credit account for evaluation because short-lived browser tokens may be replayed before they expire. A failed token request releases its slot. A successful token request consumes a slot even if the connection fails. The database records the trial question and feedback. It stores no video, images, audio, names, or email. For feedback counts, run `sqlite3 /absolute/private/path/showroom.sqlite "SELECT rating, count(*) FROM showroom_trials WHERE issued = 1 GROUP BY rating;"` after the evaluation. Stop the server and keep or delete the database according to the evaluation's retention plan.

## Development

Use `$fitcheck-development` for repository-specific development and review. The same guidance is available to contributors and tools that load instructions manually. [Development skill](.agents/skills/fitcheck-development/SKILL.md)

The site uses Next.js App Router, React, Tailwind CSS, and Three.js. Consult the Next.js documentation bundled at `node_modules/next/dist/docs/` for the installed version. See [product context](PRODUCT.md) and [visual direction](DESIGN.md).

```bash
npm run lint
npx tsc --noEmit
node --test app/api/showroom/route.test.mjs
npm run build
```
