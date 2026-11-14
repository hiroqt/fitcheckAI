// Canonical public URL used for SEO (metadataBase, canonical links, sitemap, robots, JSON-LD).
// Deliberately separate from FITCHECK_SHOWROOM_ORIGIN, which the showroom API uses for
// origin checks and is set to localhost in development.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tryfitcheckai.online").replace(/\/+$/, "");

export const SITE_NAME = "FitCheck";

export const SITE_TITLE = "FitCheck: Live Virtual Try-On for Fashion Brands";

export const SITE_DESCRIPTION =
  "See it on you. FitCheck is a live virtual try-on pilot for Philippine fashion brands: preview a featured look with your camera or a photo, right in the browser.";

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/fitcheck.startup/",
  "https://www.threads.com/@fitcheck.startup",
  "https://www.facebook.com/profile.php?id=61596346923689",
  "https://www.linkedin.com/company/145435214/",
];

export const BRAND_COLOR = "#0038ff";
export const BACKGROUND_COLOR = "#f7f8ff";
