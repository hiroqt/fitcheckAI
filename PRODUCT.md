# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, shadcn/ui, Radix UI primitives, Framer Motion, Lucide React.

## Users
- **Primary:** Founders and e-commerce managers of Philippine fashion brands, curated boutiques, and social-commerce labels (selling via Instagram/TikTok DMs, WhatsApp, and Shopify).
- **Secondary:** Filipino online shoppers seeking a short moving visual preview of curated garments before purchase.

## Product Purpose
FitCheck is a browser-based virtual style preview: "See it on you." Shoppers upload a still body photo and preview a selected garment in a short moving video. It serves as visual inspiration and a purchase-decision aid—explicitly **not** a sizing guarantee, fabric simulation, or promise of fewer returns.

## Current public demo

The landing page features Floating Brand and two try-on options: live camera or photo upload. Shoppers choose an option, answer the supplied market survey, sign in with Google, select one of three illustrative garments, and can use one 15-second preview per hour per verified Google account. The survey and access records write to a private Google Sheet. FitCheck does not persist body photos, camera video, or generated video. The feature is prepared but disabled until integrations and written provider approval are in place. Brand pilot form submissions still run demo validation.

## Positioning & Market
FitCheck operates a controlled, seller-assisted Philippine pilot targeting 3–5 approved brands selling higher-margin tops, jackets, dresses, and curated statement pieces. Rather than unmetered free try-on on low-margin basics (where generation costs exceed margins), FitCheck empowers sellers to provide high-intent shoppers with short, capped previews during DM consultations.

## Operating Context
- Philippine boutique sales workflows (Instagram DM inquiries, appointment bookings, and assisted online checkout).
- Mobile & desktop browsers without any required mobile application download.
- Transparent unit economics with fixed prepaid packs in Philippine Pesos (₱499 and ₱1,799) with zero auto-overages.

## Capabilities and Constraints
- Each enabled public account can use one 15-second preview per hour. An operator-set cap limits active reservations and previews started in the last hour across all accounts. Provider allowance is limited to the Lucy VTON 3.6 model and exact site origin.
- Immediate manual "Stop Preview" control at any second.
- Audio is strictly disabled by default.
- Informed consent before sending live camera video or an uploaded photo and selected garment image to the provider. FitCheck does not save body media or generated video; provider-side handling is subject to approved terms.
- Consumer preview activation requires written provider approval and data terms; preview flags remain off until then.
- Explicit customer guardrails: previews are visual approximations only; physical sizing must always be verified via the brand's size chart.

## Brand Commitments
- **Voice:** Discerning, direct, honest, transparent, and grounded in real Philippine retail economics.
- **Visual Identity:** Electric Royal Blue (`#0038FF`) and deep midnight obsidian (`#090A0D`), viewfinder camera brackets (`⌜ ⌝ ⌞ ⌟`), clean high-contrast Swiss typography.
- **Strict Anti-Overclaim Rule:** Never claim sizing precision, 100% on-device processing, or guaranteed return/sales lifts without verified evidence.
