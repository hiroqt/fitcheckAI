// /llms.txt: a plain-markdown summary of the site for AI assistants and answer engines
// (https://llmstxt.org). Generated from the same data the page renders; prerendered at build.
import { allFaqs, faqAnswerText } from "../lib/faqs";
import { packs } from "../lib/pricing";
import { CONTACT_EMAIL, SITE_ALTERNATE_NAMES, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_PROFILES } from "../lib/site";

function body() {
  const plans = packs
    .map((p) => `- **${p.name}**: ${p.price}. ${p.detail}. ${p.description} (${p.features.join("; ")})`)
    .join("\n");

  const faq = allFaqs
    .map(({ audience, faqs }) =>
      [`### ${audience}`, ...faqs.map((f) => `**${f.question}**\n${faqAnswerText(f)}`)].join("\n\n")
    )
    .join("\n\n");

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} (also known as ${SITE_ALTERNATE_NAMES.join(", ")}) is a browser-based virtual try-on pilot for Philippine fashion brands. Shoppers choose a featured garment, then use their live camera or upload a photo to see a 15-second AI-generated preview of how the look could appear on them. No app install is required. Previews are a visual guide only; they do not confirm size or fit.

## Key facts

- Website: ${SITE_URL}
- Who it is for: Philippine fashion brands and retailers, and their shoppers
- How it works: choose a garment, choose live camera or photo upload, answer a short questionnaire, sign in with Google, and watch a 15-second preview
- Limits: one preview per hour per verified Google account; audio stays off; you can stop anytime
- Privacy: FitCheck does not save your photo, camera video, or generated preview
- Contact: ${CONTACT_EMAIL}

## Plans for brands

${plans}

Prices are introductory tiers; final allowances and billing terms are confirmed directly with each brand.

## Pages

- [Home](${SITE_URL}/): showroom, live try-on, pricing and FAQ
- [Pricing](${SITE_URL}/#scene-pricing)
- [FAQ](${SITE_URL}/#faq)
- [Privacy Notice](${SITE_URL}/privacy): how survey answers, sign-in, and try-on media are handled
- [Terms of Use](${SITE_URL}/terms)

## FAQ

${faq}

## Social profiles

${SOCIAL_PROFILES.map((url) => `- ${url}`).join("\n")}
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
