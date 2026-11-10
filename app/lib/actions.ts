"use server";

export interface PilotApplicationState {
  success?: boolean;
  message?: string;
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
  const brandName = formData.get("brandName") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const storeUrl = formData.get("storeUrl") as string;
  const garmentCategory = formData.get("garmentCategory") as string;
  const averagePrice = formData.get("averagePrice") as string;
  const selectedPack = formData.get("selectedPack") as string;

  const errors: PilotApplicationState["errors"] = {};

  if (!brandName || brandName.trim().length === 0) {
    errors.brandName = ["Brand name is required."];
  }

  if (!contactEmail || !contactEmail.includes("@")) {
    errors.contactEmail = ["A valid contact email is required."];
  }

  if (!storeUrl || storeUrl.trim().length === 0) {
    errors.storeUrl = ["Instagram handle or store link is required."];
  }

  if (!averagePrice || Number(averagePrice) < 500) {
    errors.averagePrice = ["Pilot is restricted to garments with contribution margins > ₱500."];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please review the pilot application criteria below.",
      errors,
    };
  }

  // Simulate server processing (database registration or webhook dispatch)
  void garmentCategory;
  void selectedPack;
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    message: "Application received! Our Philippine pilot lead will review your garment catalog and contact you within 24 hours.",
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
