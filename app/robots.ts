import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

// AI search / answer-engine crawlers, listed explicitly so FitCheck can be cited in
// ChatGPT, Claude, Perplexity, Gemini, Copilot and Apple answers. A crawler that matches
// a named group ignores the "*" group, so each group repeats the same rules.
const AI_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
];

const rules = { allow: "/", disallow: "/api/" };

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", ...rules },
      { userAgent: AI_CRAWLERS, ...rules },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
