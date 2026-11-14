// Single source of truth for plan tiers: rendered by MinimalPricing and used for the
// Service/Offer structured data and /llms.txt.
export type PricingPack = {
  name: string;
  price: string;
  detail: string;
  description: string;
  features: string[];
  selection: string;
  recommended?: boolean;
  /** Numeric price in PHP for structured data; omitted for quote-based plans. */
  amountPhp?: number;
  /** Set for subscription plans. */
  billing?: "monthly";
};

export const packs: PricingPack[] = [
  {
    name: "Starter",
    price: "₱499",
    detail: "5 previews · up to 30 seconds each",
    description: "A simple way to try FitCheck with one collection.",
    features: ["One-time prepaid pack", "About ₱100 per preview", "No automatic top-ups"],
    selection: "499",
    amountPhp: 499,
  },
  {
    name: "Growth",
    price: "₱1,799",
    detail: "20 previews · up to 30 seconds each",
    description: "For brands handling regular preview requests.",
    features: ["One-time prepaid pack", "About ₱90 per preview", "Around 10% less per preview than Starter", "No automatic top-ups"],
    selection: "1799",
    amountPhp: 1799,
    recommended: true,
  },
  {
    name: "Larger business",
    price: "₱4,999 / month",
    detail: "Plus metered usage",
    description: "For multi-brand retailers planning a higher-volume pilot.",
    features: ["Monthly plan with metered usage", "Usage and allowances tailored to the pilot", "Confirm session limits before launch"],
    selection: "larger_business",
    amountPhp: 4999,
    billing: "monthly",
  },
  {
    name: "Custom",
    price: "Custom",
    detail: "Quote after discovery",
    description: "A tailored quote based on preview volume, number of brands, team access, and reporting or integration needs.",
    features: ["Scope expected preview volume and session limits", "Plan for the number of brands and team access", "Discuss reporting or integration needs", "Final features and usage rates agreed before the pilot"],
    selection: "enterprise",
  },
];
