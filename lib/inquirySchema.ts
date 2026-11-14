import { z } from "zod";

/**
 * "Message Us" inquiry validation, shared by the modal and `/api/inquiry`.
 * Limits mirror the FitCheck Ops contract (`POST /public/v1/inquiries`); Ops stays the authority.
 */
export const LIMITS = {
  brandName: 120,
  contactName: 120,
  email: 254,
  phone: 40,
  storeUrl: 300,
  garmentStyles: 300,
  preferredDate: 100,
  /** Ops stores one message of at most 2,000 chars; the labeled details below count toward it. */
  message: 2000,
  pagePath: 200,
  utm: 100,
} as const;

export const INQUIRY_TYPES = ["general", "pricing", "demo"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

/** Pricing-card keys (see `app/lib/pilotEmail.ts` PLAN_LABELS) → Ops `interest`. */
export const PLAN_INTEREST = {
  "499": "starter",
  "1799": "growth",
  larger_business: "larger_business",
  enterprise: "custom",
} as const;
export type PlanKey = keyof typeof PLAN_INTEREST;
export type OpsInterest = (typeof PLAN_INTEREST)[PlanKey] | "undecided";
export const PLAN_KEYS = Object.keys(PLAN_INTEREST) as [PlanKey, ...PlanKey[]];

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === "string" && value in PLAN_INTEREST;
}

/** Accepts a plan key or an older display label ("Growth · ₱1,799"); anything else → undefined. */
export function normalizePlanKey(value: unknown): PlanKey | undefined {
  if (isPlanKey(value)) return value;
  if (typeof value !== "string") return undefined;
  const v = value.trim().toLowerCase();
  if (v.startsWith("starter")) return "499";
  if (v.startsWith("growth")) return "1799";
  if (v.startsWith("larger")) return "larger_business";
  if (v.startsWith("custom") || v.startsWith("enterprise")) return "enterprise";
  return undefined;
}

const optText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} must be ${max} characters or fewer.`).optional().or(z.literal(""));

export const inquirySchema = z
  .object({
    inquiryType: z.enum(INQUIRY_TYPES, { message: "Choose an inquiry type." }),
    brandName: z
      .string({ message: "Brand name is required." })
      .trim()
      .min(2, "Brand name must be at least 2 characters.")
      .max(LIMITS.brandName, `Brand name must be ${LIMITS.brandName} characters or fewer.`),
    contactEmail: z
      .string({ message: "Contact email is required." })
      .trim()
      .toLowerCase()
      .email("A valid business or contact email is required.")
      .max(LIMITS.email, `Email must be ${LIMITS.email} characters or fewer.`),
    contactPerson: z
      .string({ message: "Contact name is required." })
      .trim()
      .min(1, "Contact name is required.")
      .max(LIMITS.contactName, `Contact name must be ${LIMITS.contactName} characters or fewer.`),
    phone: optText(LIMITS.phone, "Phone number"),
    storeUrl: optText(LIMITS.storeUrl, "Store link"),
    selectedPlan: z.enum(PLAN_KEYS).optional(),
    garmentStyles: optText(LIMITS.garmentStyles, "Garment styles"),
    preferredDate: optText(LIMITS.preferredDate, "Preferred date"),
    message: optText(LIMITS.message, "Message"),
    consent: z.literal(true, { message: "Please agree so we can contact you about this inquiry." }),
    turnstileToken: z
      .string({ message: "Please complete the verification check." })
      .min(1, "Please complete the verification check.")
      .max(2048),
    submissionId: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/).optional(),
    pagePath: z.string().trim().max(LIMITS.pagePath).optional(),
    utm: z
      .object({
        source: z.string().trim().max(LIMITS.utm).optional(),
        medium: z.string().trim().max(LIMITS.utm).optional(),
        campaign: z.string().trim().max(LIMITS.utm).optional(),
        term: z.string().trim().max(LIMITS.utm).optional(),
        content: z.string().trim().max(LIMITS.utm).optional(),
      })
      .strict()
      .optional(),
    // Bot defense honeypot field (must remain empty for human users)
    hp_company_website: z.string().max(500).optional().or(z.literal("")),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.inquiryType === "general" && (!data.message || data.message.length < 5)) {
      ctx.addIssue({ code: "custom", path: ["message"], message: "Please describe your inquiry (at least 5 characters)." });
    }
    const total = composeMessage(data).length;
    if (total > LIMITS.message) {
      ctx.addIssue({
        code: "custom",
        path: ["message"],
        message: `Please shorten your message by ${total - LIMITS.message} characters (details above count toward the ${LIMITS.message.toLocaleString("en-US")} limit).`,
      });
    }
  });

export type ValidatedInquiry = z.infer<typeof inquirySchema>;

type MessageParts = Pick<ValidatedInquiry, "inquiryType" | "storeUrl" | "garmentStyles" | "preferredDate" | "message">;

/** The single Ops `message`: labeled topic details first, then the visitor's own words. */
export function composeMessage(d: MessageParts): string {
  const details = [
    d.storeUrl ? `Store / Instagram: ${d.storeUrl}` : "",
    d.inquiryType === "pricing" && d.garmentStyles ? `Garment styles: ${d.garmentStyles}` : "",
    d.inquiryType === "demo" && d.preferredDate ? `Preferred demo time: ${d.preferredDate}` : "",
  ].filter(Boolean);
  const own = d.message?.trim() ?? "";
  return [details.join("\n"), own].filter(Boolean).join("\n\n");
}

/** Ops interest: the chosen plan for Pricing, otherwise "No plan selected". */
export function toInterest(d: Pick<ValidatedInquiry, "inquiryType" | "selectedPlan">): OpsInterest {
  return d.inquiryType === "pricing" && d.selectedPlan ? PLAN_INTEREST[d.selectedPlan] : "undecided";
}
