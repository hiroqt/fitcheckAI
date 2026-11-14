/**
 * Work With Us API - Handlers, Validation, and Notifications
 * Handles:
 *  1. General Inquiry
 *  2. Pricing & Availability
 *  3. Request a Demo
 */

export type InquiryType = "general" | "pricing" | "demo";

export interface GeneralInquiryPayload {
  type?: "general";
  brandName: string;
  contactEmail: string;
  contactPerson?: string;
  phone?: string;
  storeUrl?: string;
  message: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface PricingInquiryPayload {
  type?: "pricing";
  brandName: string;
  contactEmail: string;
  contactPerson?: string;
  phone?: string;
  storeUrl?: string;
  selectedPlan?: "499" | "1799" | "larger_business" | "enterprise" | string;
  garmentStyles?: string;
  averagePrice?: number | string;
  monthlyVolume?: string;
  message?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface DemoRequestPayload {
  type?: "demo";
  brandName: string;
  contactEmail: string;
  contactPerson?: string;
  phone?: string;
  storeUrl?: string;
  annualRevenue?: string;
  companySize?: string;
  preferredDate?: string;
  garmentCategories?: string;
  notes?: string;
  message?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface InquiryResult {
  success: boolean;
  inquiryId?: string;
  type: InquiryType;
  status: "received" | "forwarded" | "stored";
  message: string;
  receivedAt: string;
  data?: Record<string, unknown>;
  errors?: Record<string, string>;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key, X-Requested-With",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeString(val: unknown, maxLen = 1000): string {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen);
}

export function validateGeneralInquiry(payload: Partial<GeneralInquiryPayload>): {
  valid: boolean;
  errors: Record<string, string>;
  sanitized: GeneralInquiryPayload;
} {
  const errors: Record<string, string> = {};

  const brandName = sanitizeString(payload.brandName, 150);
  const contactEmail = sanitizeString(payload.contactEmail, 254).toLowerCase();
  const contactPerson = sanitizeString(payload.contactPerson, 150);
  const phone = sanitizeString(payload.phone, 50);
  const storeUrl = sanitizeString(payload.storeUrl, 500);
  const message = sanitizeString(payload.message, 3000);
  const source = sanitizeString(payload.source, 100) || "internal_system";

  if (!brandName) {
    errors.brandName = "Brand name or company name is required.";
  }

  if (!contactEmail) {
    errors.contactEmail = "Contact email is required.";
  } else if (!EMAIL_REGEX.test(contactEmail)) {
    errors.contactEmail = "A valid contact email is required.";
  }

  if (!message) {
    errors.message = "Inquiry message or questions are required.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      type: "general",
      brandName,
      contactEmail,
      contactPerson,
      phone,
      storeUrl,
      message,
      source,
      metadata: payload.metadata || {},
    },
  };
}

export function validatePricingInquiry(payload: Partial<PricingInquiryPayload>): {
  valid: boolean;
  errors: Record<string, string>;
  sanitized: PricingInquiryPayload;
} {
  const errors: Record<string, string> = {};

  const brandName = sanitizeString(payload.brandName, 150);
  const contactEmail = sanitizeString(payload.contactEmail, 254).toLowerCase();
  const contactPerson = sanitizeString(payload.contactPerson, 150);
  const phone = sanitizeString(payload.phone, 50);
  const storeUrl = sanitizeString(payload.storeUrl, 500);
  const selectedPlan = sanitizeString(payload.selectedPlan, 100) || "Starter · ₱499";
  const garmentStyles = sanitizeString(payload.garmentStyles, 500);
  const averagePrice = payload.averagePrice !== undefined ? String(payload.averagePrice).trim() : "";
  const monthlyVolume = sanitizeString(payload.monthlyVolume, 100);
  const message = sanitizeString(payload.message, 3000);
  const source = sanitizeString(payload.source, 100) || "internal_system";

  if (!brandName) {
    errors.brandName = "Brand name is required.";
  }

  if (!contactEmail) {
    errors.contactEmail = "Contact email is required.";
  } else if (!EMAIL_REGEX.test(contactEmail)) {
    errors.contactEmail = "A valid contact email is required.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      type: "pricing",
      brandName,
      contactEmail,
      contactPerson,
      phone,
      storeUrl,
      selectedPlan,
      garmentStyles,
      averagePrice: averagePrice || undefined,
      monthlyVolume: monthlyVolume || undefined,
      message: message || undefined,
      source,
      metadata: payload.metadata || {},
    },
  };
}

export function validateDemoRequest(payload: Partial<DemoRequestPayload>): {
  valid: boolean;
  errors: Record<string, string>;
  sanitized: DemoRequestPayload;
} {
  const errors: Record<string, string> = {};

  const brandName = sanitizeString(payload.brandName, 150);
  const contactEmail = sanitizeString(payload.contactEmail, 254).toLowerCase();
  const contactPerson = sanitizeString(payload.contactPerson, 150);
  const phone = sanitizeString(payload.phone, 50);
  const storeUrl = sanitizeString(payload.storeUrl, 500);
  const annualRevenue = sanitizeString(payload.annualRevenue, 100);
  const companySize = sanitizeString(payload.companySize, 100);
  const preferredDate = sanitizeString(payload.preferredDate, 100);
  const garmentCategories = sanitizeString(payload.garmentCategories, 500);
  const message = sanitizeString(payload.message || payload.notes, 3000);
  const source = sanitizeString(payload.source, 100) || "internal_system";

  if (!brandName) {
    errors.brandName = "Brand name is required.";
  }

  if (!contactEmail) {
    errors.contactEmail = "Contact email is required.";
  } else if (!EMAIL_REGEX.test(contactEmail)) {
    errors.contactEmail = "A valid contact email is required.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      type: "demo",
      brandName,
      contactEmail,
      contactPerson,
      phone,
      storeUrl,
      annualRevenue: annualRevenue || undefined,
      companySize: companySize || undefined,
      preferredDate: preferredDate || undefined,
      garmentCategories: garmentCategories || undefined,
      message: message || undefined,
      notes: message || undefined,
      source,
      metadata: payload.metadata || {},
    },
  };
}

/**
 * Optional background dispatch to Google Apps Script or external webhook
 */
async function notifyAppsScript(action: string, data: Record<string, unknown>) {
  const scriptUrl = process.env.FITCHECK_APPS_SCRIPT_URL;
  const scriptSecret = process.env.FITCHECK_APPS_SCRIPT_SECRET;

  if (!scriptUrl || !scriptSecret) return;

  try {
    await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: scriptSecret,
        action,
        ...data,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    console.warn("[WorkWithUs] Non-blocking dispatch warning:", error);
  }
}

/**
 * Process any of the 3 Work With Us inquiries
 */
export async function processWorkWithUsInquiry(
  type: InquiryType,
  rawPayload: Record<string, unknown>
): Promise<InquiryResult> {
  const timestamp = new Date().toISOString();
  const inquiryId = `inq_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  let validatedData: Record<string, unknown> = {};

  if (type === "general") {
    const { valid, errors, sanitized } = validateGeneralInquiry(rawPayload);
    if (!valid) {
      return {
        success: false,
        type,
        status: "received",
        message: "Validation failed for General Inquiry",
        receivedAt: timestamp,
        errors,
      };
    }
    validatedData = sanitized as unknown as Record<string, unknown>;
  } else if (type === "pricing") {
    const { valid, errors, sanitized } = validatePricingInquiry(rawPayload);
    if (!valid) {
      return {
        success: false,
        type,
        status: "received",
        message: "Validation failed for Pricing & Availability Inquiry",
        receivedAt: timestamp,
        errors,
      };
    }
    validatedData = sanitized as unknown as Record<string, unknown>;
  } else if (type === "demo") {
    const { valid, errors, sanitized } = validateDemoRequest(rawPayload);
    if (!valid) {
      return {
        success: false,
        type,
        status: "received",
        message: "Validation failed for Demo Request",
        receivedAt: timestamp,
        errors,
      };
    }
    validatedData = sanitized as unknown as Record<string, unknown>;
  } else {
    return {
      success: false,
      type,
      status: "received",
      message: `Invalid inquiry type: ${type}. Expected 'general', 'pricing', or 'demo'.`,
      receivedAt: timestamp,
      errors: { type: "Inquiry type must be one of: general, pricing, demo." },
    };
  }

  // Forward asynchronously to Apps Script / notifications if configured
  await notifyAppsScript(`work_with_us_${type}`, {
    inquiryId,
    type,
    receivedAt: timestamp,
    ...validatedData,
  });

  return {
    success: true,
    inquiryId,
    type,
    status: "received",
    message: `${type === "general" ? "General inquiry" : type === "pricing" ? "Pricing & availability inquiry" : "Demo request"} received successfully.`,
    receivedAt: timestamp,
    data: validatedData,
  };
}

