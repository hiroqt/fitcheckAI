---
name: fitcheck-development
description: Develop and review changes to the FitCheck AI landing page, Floating Brand showcase, garment preview, and pilot intake. Use when changing the site’s design, copy, motion, camera interaction, or development workflow.
---

# FitCheck development

## Find the current behavior

1. Read [PRODUCT.md](../../../PRODUCT.md) for the audience and product limits, [DESIGN.md](../../../DESIGN.md) for the visual direction, and [README.md](../../../README.md) for local commands.
2. Start with `app/page.tsx` and follow the imports for the live route. Use `app/layout.tsx` and `app/globals.css` for the shared page shell and styles. Inspect a component’s callers before editing it. Some prototype sections remain in the repository outside the live route.
3. Check the relevant guide under `node_modules/next/dist/docs/` before changing Next.js code. Use the installed docs for App Router, Server Actions, assets, and configuration. Next.js’s generated agent rules are disabled so this skill can own project guidance.

## Build within the product contract

- Floating Brand is the featured fashion label. FitCheck is the browser-based style preview and retailer pilot. Keep the hero and showroom clear about which name does what.
- Lead with one garment and one clear next action. Use the depth and lighting of the garment, large background type, and the supplied logo’s blue and white palette. Follow the responsive composition and motion rules in DESIGN.md.
- Keep the experience usable without WebGL, camera permission, or motion. Put copy and controls in accessible HTML. Keep focus visible and preserve keyboard operation of the preview and pilot dialog.
- Require an explicit action before requesting video. Preserve audio-off capture, the short preview limit, and immediate stop. If changing the camera lifecycle, verify camera denial and track cleanup on stop, timeout, and leaving the preview. Use safe fixtures for visual tests.
- Describe the implemented preview honestly. Use “style preview” and direct shoppers to the seller’s size chart for fit. Check source before making claims about physical accuracy, media processing, or what happens to pilot applications. Treat demo responses as simulated until an actual delivery path is verified.
- Confirm pilot pack allowances before publishing counts or per-preview rates. The previous pricing section and pilot form showed conflicting allowances. Keep pack names, prices, and confirmed allowances consistent across both surfaces.

## Verify the result

- Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Record the command and outcome for every check you rely on. Investigate failures and identify any pre-existing ones.
- Inspect the live route on a narrow mobile and a desktop viewport. Check garment cropping, headline legibility, horizontal overflow, the primary action, and contrast on light and dark surfaces.
- Exercise changed flows through their normal entry points. For the landing page, check section links, the showroom controls, and pilot dialog open, close, focus return, and validation as relevant. Verify reduced motion leaves meaningful content and actions accessible.
- Review the final diff against the brief. Keep visual changes focused and preserve the behavior of existing integrations.

## Improve this skill from evidence

After verification, check whether a repeated failure, a user-approved convention, or a version-specific constraint changed how the task should be done. If so, capture the symptom, the check that reproduced it, and the verified fix. Add or update one narrow rule in the owning document and include a source path or command that a later contributor can rerun. Remove stale guidance when replacing it. Include guidance edits in the normal diff and review, and keep user data, secrets, and raw logs out of the skill. Request direction before changing product policy, camera data boundaries, or shared tooling.
