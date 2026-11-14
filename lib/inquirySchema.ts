import { z } from "zod";

/**
 * Strict Zod validation schema for Work With Us inquiries.
 * Enforces sanitization, strict lengths, and strips or rejects unexpected properties.
 */
export const inquirySchema = z
  .object({
    inquiryType: z.enum(["general", "pricing", "demo"]),
    brandName: z
      .string({ message: "Brand name is required." })
      .trim()
      .min(2, "Brand name must be at least 2 characters.")
      .max(100, "Brand name must be 100 characters or fewer."),
    contactEmail: z
      .string({ message: "Contact email is required." })
      .trim()
      .toLowerCase()
      .email("A valid business or contact email is required.")
      .max(254, "Email must be 254 characters or fewer."),
    contactPerson: z
      .string()
      .trim()
      .max(100, "Contact person must be 100 characters or fewer.")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .trim()
      .max(50, "Phone number must be 50 characters or fewer.")
      .optional()
      .or(z.literal("")),
    storeUrl: z
      .string()
      .trim()
      .max(500, "Store URL must be 500 characters or fewer.")
      .optional()
      .or(z.literal("")),
    selectedPlan: z
      .string()
      .trim()
      .max(100, "Selected plan name must be 100 characters or fewer.")
      .optional()
      .or(z.literal("")),
    garmentStyles: z
      .string()
      .trim()
      .max(500, "Garment styles must be 500 characters or fewer.")
      .optional()
      .or(z.literal("")),
    averagePrice: z
      .union([
        z.string().trim().max(50, "Average price string must be 50 characters or fewer."),
        z.number().positive("Average price must be positive.").max(10_000_000),
      ])
      .optional(),
    monthlyVolume: z
      .string()
      .trim()
      .max(100, "Monthly volume must be 100 characters or fewer.")
      .optional()
      .or(z.literal("")),
    preferredDate: z
      .string()
      .trim()
      .max(100, "Preferred date must be 100 characters or fewer.")
      .optional()
      .or(z.literal("")),
    garmentCategories: z
      .string()
      .trim()
      .max(500, "Garment categories must be 500 characters or fewer.")
      .optional()
      .or(z.literal("")),
    companySize: z
      .string()
      .trim()
      .max(100, "Company size must be 100 characters or fewer.")
      .optional()
      .or(z.literal("")),
    annualRevenue: z
      .string()
      .trim()
      .max(100, "Annual revenue must be 100 characters or fewer.")
      .optional()
      .or(z.literal("")),
    message: z
      .string()
      .trim()
      .max(3000, "Message cannot exceed 3000 characters.")
      .optional()
      .or(z.literal("")),
    source: z
      .string()
      .trim()
      .max(100, "Source cannot exceed 100 characters.")
      .optional()
      .or(z.literal("")),
    // Bot defense honeypot field (must remain empty for human users)
    hp_company_website: z.string().max(100).optional().or(z.literal("")),
  })
  .strict()
  .superRefine((data, ctx) => {
    // If it's a general inquiry, require at least a brief message
    if (data.inquiryType === "general") {
      if (!data.message || data.message.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["message"],
          message: "Please describe your inquiry (at least 5 characters).",
        });
      }
    }
  });

export type ValidatedInquiry = z.infer<typeof inquirySchema>;
