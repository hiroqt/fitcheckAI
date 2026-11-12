export const FITCHECK_PILOT_EMAIL = "fitcheckai0@gmail.com";

const PLAN_LABELS: Record<string, string> = {
  "499": "Starter · ₱499",
  "1799": "Growth · ₱1,799",
  "larger_business": "Larger business · ₱4,999/mo + metered usage",
  "enterprise": "Custom · discovery quote",
};

export type InquiryType = "general" | "pricing" | "demo";

const INQUIRY_COPY: Record<InquiryType, { subject: string; message: string }> = {
  general: {
    subject: "General inquiry about FitCheck",
    message: "I have a general question about FitCheck or working together.",
  },
  pricing: {
    subject: "FitCheck pilot pricing and availability",
    message: "I’d like to discuss FitCheck pilot pricing, allowances, and availability.",
  },
  demo: {
    subject: "Request a FitCheck demo",
    message: "I’d like to discuss a FitCheck demo for my brand.",
  },
};

export function getInquiryMailto(type: InquiryType, planKey?: string): string {
  const planName = planKey ? PLAN_LABELS[planKey] : undefined;
  const { subject: baseSubject, message } = INQUIRY_COPY[type];
  const subject = type === "pricing" && planName ? `${baseSubject} — ${planName}` : baseSubject;
  const body = [
    "Hello FitCheck AI Team,",
    "",
    message,
    "",
    "Brand details:",
    "- Brand Name: ",
    "- Instagram or Store link: ",
    "- Contact person / phone: ",
    `- Selected Plan / Interest: ${planName || ""}`,
    "- Garment styles or categories: ",
    "- Questions or notes: ",
    "",
    "Thank you!",
  ].join("\n");

  return `mailto:${FITCHECK_PILOT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getPilotMailto(planKey?: string): string {
  return getInquiryMailto("pricing", planKey);
}

