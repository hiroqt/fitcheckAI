import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

// Update these dates when a page's content meaningfully changes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date("2026-11-14"), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date("2026-11-12"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date("2026-11-12"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
