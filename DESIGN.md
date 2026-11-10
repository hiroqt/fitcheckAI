---
name: FitCheck Design System
description: Browser-based live style mirror design system for Philippine fashion brands and boutique e-commerce.
colors:
  bg-canvas: "#090A0D"
  bg-surface: "#111318"
  bg-elevated: "#181B22"
  bg-subtle: "#1F232D"
  border-subtle: "rgba(255, 255, 255, 0.08)"
  border-prominent: "rgba(255, 255, 255, 0.16)"
  border-focus: "#0038FF"
  text-primary: "#F8FAFC"
  text-secondary: "#94A3B8"
  text-muted: "#64748B"
  accent-blue: "#0038FF"
  accent-blue-hover: "#1A4CFF"
  accent-emerald: "#10B981"
  badge-bg: "rgba(0, 56, 255, 0.1)"
typography:
  display:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  h1:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  h2:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.75rem"
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
  micro:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
  nano:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
components:
  button-primary:
    backgroundColor: "#0038FF"
    textColor: "#FFFFFF"
    rounded: "8px"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "#181B22"
    textColor: "#F8FAFC"
    rounded: "8px"
    padding: "12px 24px"
---

# FitCheck Design System & Brand Governance

## 1. Visual Identity
- **Primary Color:** Electric Royal Cobalt Blue (`#0038FF`). Used for the FitCheck brand insignia, key CTAs, and active camera viewfinder focal brackets.
- **Backgrounds:** Deep midnight obsidian (`#090A0D` canvas, `#111318` cards, `#181B22` elevated interactive panels).
- **Viewfinder Motif:** Corner brackets (`⌜ ⌝ ⌞ ⌟`) framing camera streams and interactive previews, evoking a live optical mirror.
- **Philippine Context:** Pricing prominently displayed in Philippine Pesos (`₱`), realistic local retail scenarios (IG DMs, boutique reservations, GCash/Maya checkout flows).

## 2. Craft & Anti-Slop Directive
- **No Eyebrow/Kicker Labels:** Headings speak directly without redundant pill labels above them.
- **No Gradient Text:** Headlines are solid `#F8FAFC` or `#FFFFFF` with weight-based hierarchy.
- **Tabular Figures:** All prices, countdown timers (`00:30`), and ROI metrics use `tabular-nums font-mono`.
- **Honest Disclosures:** Every preview widget prominently features the official disclaimer banner: *"Illustrative visual style preview only. Sizing must be verified on seller size chart."*
