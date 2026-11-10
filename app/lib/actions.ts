"use server";

export interface DemoRequestState {
  success?: boolean;
  message?: string;
  errors?: {
    email?: string[];
    brandName?: string[];
    storeUrl?: string[];
    annualRevenue?: string[];
  };
}

export async function submitDemoRequest(
  prevState: DemoRequestState | null,
  formData: FormData
): Promise<DemoRequestState> {
  const email = formData.get("email") as string;
  const brandName = formData.get("brandName") as string;
  const storeUrl = formData.get("storeUrl") as string;
  const annualRevenue = formData.get("annualRevenue") as string;

  const errors: DemoRequestState["errors"] = {};

  if (!email || !email.includes("@")) {
    errors.email = ["A valid business email is required."];
  }

  if (!brandName || brandName.trim().length === 0) {
    errors.brandName = ["Brand name is required."];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the errors in the form.",
      errors,
    };
  }

  // Simulate server processing (e.g. database save or webhook dispatch)
  void storeUrl;
  void annualRevenue;
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    success: true,
    message: "Thank you! Our retail solutions director will reach out within 2 hours with sandbox credentials.",
  };
}

export async function subscribeNewsletter(
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "Please provide a valid brand email address.",
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    message: "You're subscribed to FitCheck quarterly retail sizing intelligence.",
  };
}

