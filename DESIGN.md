---
name: FitCheck AI Design System
description: High-end retail-tech design system for luxury and contemporary fashion e-commerce integration.
colors:
  bg-canvas: "#090A0D"
  bg-surface: "#111318"
  bg-elevated: "#181B22"
  bg-subtle: "#1F232D"
  border-subtle: "rgba(255, 255, 255, 0.08)"
  border-prominent: "rgba(255, 255, 255, 0.16)"
  border-focus: "#FFFFFF"
  text-primary: "#F8FAFC"
  text-secondary: "#94A3B8"
  text-muted: "#64748B"
  accent-retail: "#E2E8F0"
  accent-emerald: "#10B981"
  accent-indigo: "#6366F1"
  badge-bg: "rgba(255, 255, 255, 0.05)"
typography:
  display:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  h1:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  h2:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  h3:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  body:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.01em"
  caption:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent-retail}"
    textColor: "#090A0D"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
---

# Design System & Taste Governance

## 1. Overview
FitCheck AI bridges high-performance retail infrastructure with the pristine visual poise demanded by contemporary fashion houses (e.g., Acne Studios, Toteme, SSENSE, Arc'teryx, Represent). 

The goal of this landing page is to convert fashion store founders and e-commerce leaders by communicating institutional reliability, bespoke fit craftsmanship, and zero-risk technological speed.

### Anti-Slop Directive (Strict Mandate)
This design strictly bans generic "AI SaaS" templates and visual slop:
- **BANNED:** Monotonous, copy-paste 3-column card layouts with neon gradient border boxes.
- **BANNED:** Glowing purple, magenta, and cyan radial light leaks splashed behind random text blocks.
- **BANNED:** Cramped padding (`p-3` or `p-4` on primary containers), claustrophobic line heights, and uncalibrated spacing.
- **BANNED:** Generic pastel glassmorphism with excessive blur that feels like a mockup template instead of a functional retail software.
- **BANNED:** Cliché "AI Sparkle" icons next to every title and meaningless buzzword badges.
- **ENFORCED:** Editorial typography, crisp monochromatic foundation with tactile high-contrast accents, purposeful white space, asymmetric bento hierarchies, precise hairline borders, and realistic interactive mockups.

---

## 2. Colors
- **Canvas Base (`bg-canvas`):** Deep obsidian graphite (`#090A0D`), avoiding muddy blues or pure `#000000` pitch blacks to retain texture and depth.
- **Surface Elevation (`bg-surface` / `bg-elevated`):** `#111318` and `#181B22` provide subtle layer separation without heavy drop shadows.
- **Hairline Borders:** `rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.16)` creates crisp architectural lines reminiscent of editorial publication grid structures.
- **Typography Contrast:** Pure white `#F8FAFC` for high-impact headlines, slate-300 `#94A3B8` for supportive prose, and muted `#64748B` for secondary labels.
- **Functional Accents:**
  - `accent-retail`: Off-white `#E2E8F0` for primary conversion buttons.
  - `accent-emerald`: Clean muted green `#10B981` exclusively reserved for positive merchant metrics (e.g., "-38% Returns", "Live Sync").
  - `accent-indigo`: Refined indigo `#6366F1` reserved for code tokens and subtle active states.

---

## 3. Typography
- **Headings & Display:** Tight tracking (`-0.03em`), high contrast, structured letterforms. Headlines prioritize clear value proposition and merchant ROI over whimsical poetry.
- **Prose & Body:** Generous line heights (`leading-relaxed` / `1.6`) with balanced line lengths (max 65 characters) to ensure effortless readability for busy founders.
- **Technical & Metric Accents:** Monospace numerals (`font-mono`) for sizing metrics, latency badges, code snippets, and telemetry data points.

---

## 4. Layout
- **Max Width:** Constrained container at `max-w-7xl` (1280px) with generous gutter margins (`px-6 sm:px-8 lg:px-12`).
- **Vertical Rhythm:** Deliberate macro spacing between major sections (`py-24 lg:py-32`) giving each argument breathing room.
- **Bento & Feature Grids:** Asymmetrical layouts combining wide interactive demonstrations with contextual metric pillars instead of repetitive uniform grids.

---

## 5. Elevation & Depth
- **Borders over Shadows:** Rely on crisp 1px borders (`border border-white/[0.08]`) rather than muddy, diffused box-shadows.
- **Subtle Surface Lighting:** Micro linear highlights on top edges (`border-t border-white/[0.15]`) simulating fine industrial hardware edges.
- **Tactile Glass:** Restrained backdrop blur (`backdrop-blur-md bg-white/[0.02]`) applied strictly to floating headers and interactive PDP overlays.

---

## 6. Shapes
- **Corner Radii:** Consistent radius progression:
  - Tags and buttons: `rounded-lg` (8px) or `rounded-md` (6px).
  - Cards and containers: `rounded-xl` (12px) to `rounded-2xl` (16px).
  - Pill badges: `rounded-full` reserved for status indicators.
- **Hairlines:** Uniform 1px stroke weight across all dividers, separators, and card perimeters.

---

## 7. Components
- **Hero:** Punchy value proposition with immediate visual demonstration (split-screen or layered mock PDP widget preview).
- **Social Proof:** Infinite smooth marquee of luxury and modern retail brand logos with subtle grayscale opacity.
- **Problem vs. Solution:** Interactive before/after or clear comparative split illustrating returns drain vs. sizing confidence.
- **Interactive PDP Demo:** Functional sandbox simulating an apparel store PDP with dynamic size recommendation toggle and instant fit feedback.
- **Feature Pillars (Bento):** Dimensional sizing, real-time drape preview, 1-click Shopify/headless integration, and margin telemetry.
- **Code Snippet:** Dark luxury theme Shiki syntax-highlighted embed block with copy-to-clipboard functionality.
- **Pricing:** Clear B2B tier cards with highlighted volume discounts, zero hidden fees, and transparent ROI calculation.
- **FAQ:** Clean accordion using Radix UI with smooth expansion animations.
- **Final CTA:** High-contrast editorial conversion banner with direct demo booking and app install actions.

---

## 8. Do's and Don'ts
### Do:
- Use generous, deliberate negative space to create an elevated luxury atmosphere.
- Keep micro-animations snappy (`duration-200` to `duration-300`, ease-out) to convey engineered precision.
- Ground claims in real e-commerce mechanics (SKU variants, returns processing cost, add-to-cart velocity).
- Ensure mobile layouts feel as seamless and bespoke as a flagship retail app.

### Don't:
- Don't use neon magenta/purple radial gradients behind cards.
- Don't clutter cards with decorative icons that carry no informational meaning.
- Don't use heavy, blurred black drop shadows that dirty the obsidian canvas.
- Don't make buttons look like pillowy candy; keep them crisp, architectural, and tactile.

