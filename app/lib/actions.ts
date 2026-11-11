"use server";

export interface PilotApplicationState {
  success?: boolean;
  message?: string;
  emailDraft?: string;
  errors?: {
    brandName?: string[];
    contactEmail?: string[];
    storeUrl?: string[];
    averagePrice?: string[];
    email?: string[];
    annualRevenue?: string[];
  };
}

export type DemoRequestState = PilotApplicationState;

export async function submitPilotApplication(
  prevState: PilotApplicationState | null,
  formData: FormData
): Promise<PilotApplicationState> {
  const value = (name: string) => String(formData.get(name) ?? "").trim();
  const brandName = value("brandName");
  const contactEmail = value("contactEmail");
  const storeUrl = value("storeUrl");
  const garmentCategory = value("garmentCategory");
  const averagePrice = value("averagePrice");
  const selectedPack = value("selectedPack");

  const errors: PilotApplicationState["errors"] = {};

  if (!brandName) {
    errors.brandName = ["Brand name is required."];
  } else if (brandName.length > 120) {
    errors.brandName = ["Brand name must be 120 characters or fewer."];
  }

  if (contactEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    errors.contactEmail = ["A valid contact email is required."];
  }

  if (!storeUrl) {
    errors.storeUrl = ["Instagram handle or store link is required."];
  } else if (storeUrl.length > 500) {
    errors.storeUrl = ["Store link must be 500 characters or fewer."];
  }

  if (!averagePrice || !Number.isFinite(Number(averagePrice)) || Number(averagePrice) < 500 || Number(averagePrice) > 1_000_000) {
    errors.averagePrice = ["Pilot is restricted to garments with contribution margins > ₱500."];
  }

  if (!["dresses", "barong", "tailored", "capsule"].includes(garmentCategory) ||
      !["499", "1799", "larger_business", "enterprise"].includes(selectedPack)) {
    return { success: false, message: "Please choose a valid category and pilot plan." };
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please review the pilot application criteria below.",
      errors,
    };
  }

  const subject = `FitCheck brand pilot inquiry: ${brandName}`;
  const body = [
    "I’m interested in discussing a FitCheck brand pilot.",
    "",
    `Brand: ${brandName}`,
    `Contact email: ${contactEmail}`,
    `Store or Instagram: ${storeUrl}`,
    `Main category: ${garmentCategory}`,
    `Average item price: ₱${averagePrice}`,
    `Preferred plan: ${selectedPack}`,
  ].join("\n");

  return {
    success: true,
    message: "Your email draft is ready. Review it and send it to submit your inquiry.",
    emailDraft: `mailto:fitcheckai0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

export async function submitDemoRequest(
  prevState: DemoRequestState | null,
  formData: FormData
): Promise<DemoRequestState> {
  const brandName = formData.get("brandName") as string;
  const email = (formData.get("email") || formData.get("contactEmail")) as string;
  const storeUrl = formData.get("storeUrl") as string;
  const annualRevenue = formData.get("annualRevenue") as string;

  const errors: DemoRequestState["errors"] = {};

  if (!brandName || brandName.trim().length === 0) {
    errors.brandName = ["Brand name is required."];
  }

  if (!email || !email.includes("@")) {
    errors.email = ["A valid business or contact email is required."];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please review the form criteria below.",
      errors,
    };
  }

  void storeUrl;
  void annualRevenue;
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    message: "Pilot request received! Our pilot lead will review your brand details and contact you within 24 hours.",
  };
}
