export const FITCHECK_PILOT_EMAIL = "fitcheckai0@gmail.com";

const PLAN_LABELS: Record<string, string> = {
  "499": "Starter · ₱499",
  "1799": "Growth · ₱1,799",
  "larger_business": "Larger business · ₱4,999/mo + metered usage",
  "enterprise": "Custom · discovery quote",
};

export function getPilotMailto(planKey?: string): string {
  const planName = planKey && PLAN_LABELS[planKey] ? PLAN_LABELS[planKey] : "General inquiry";
  const subject = `Work with FitCheck: ${planName}`;
  const body = [
    "Hello FitCheck AI Team,",
    "",
    "I would like to explore working with FitCheck for my clothing brand.",
    "",
    "Brand details:",
    "- Brand Name: ",
    "- Instagram or Store link: ",
    "- Contact person / phone: ",
    `- Selected Plan / Interest: ${planName}`,
    "- Garment styles or categories: ",
    "- Questions or notes: ",
    "",
    "Thank you!",
  ].join("\n");

  return `mailto:${FITCHECK_PILOT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

