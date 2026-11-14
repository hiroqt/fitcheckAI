import axios, { AxiosError } from "axios";

/**
 * FitCheck AI - Work With Us API Client (Axios)
 * Use this client to connect to FitCheck's Work With Us API endpoints.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_FITCHECK_API_BASE ||
  process.env.VITE_FITCHECK_API_BASE ||
  "https://tryfitcheckai.online";

export const fitcheckClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

export interface GeneralInquiryPayload {
  brandName: string;
  contactEmail: string;
  message: string;
  contactPerson?: string;
  phone?: string;
  storeUrl?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface PricingInquiryPayload {
  brandName: string;
  contactEmail: string;
  selectedPlan?: "Starter · ₱499" | "Growth · ₱1,799" | "Larger business · ₱4,999/mo" | "Custom" | string;
  garmentStyles?: string;
  averagePrice?: number | string;
  monthlyVolume?: string;
  contactPerson?: string;
  phone?: string;
  storeUrl?: string;
  message?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface DemoRequestPayload {
  brandName: string;
  contactEmail: string;
  preferredDate?: string;
  garmentCategories?: string;
  companySize?: string;
  annualRevenue?: string;
  contactPerson?: string;
  phone?: string;
  storeUrl?: string;
  message?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  inquiryId: string;
  type: "general" | "pricing" | "demo";
  status: string;
  message: string;
  receivedAt: string;
  data: T;
  errors?: Record<string, string>;
}

/**
 * 1. General Inquiry API
 * POST /api/work-with-us/general
 */
export async function sendGeneralInquiry(payload: GeneralInquiryPayload) {
  const { data } = await fitcheckClient.post<ApiResponse<GeneralInquiryPayload>>(
    "/api/work-with-us/general",
    payload
  );
  return data;
}

/**
 * 2. Pricing & Availability API
 * POST /api/work-with-us/pricing
 */
export async function sendPricingInquiry(payload: PricingInquiryPayload) {
  const { data } = await fitcheckClient.post<ApiResponse<PricingInquiryPayload>>(
    "/api/work-with-us/pricing",
    payload
  );
  return data;
}

/**
 * 3. Request a Demo API
 * POST /api/work-with-us/demo
 */
export async function sendDemoRequest(payload: DemoRequestPayload) {
  const { data } = await fitcheckClient.post<ApiResponse<DemoRequestPayload>>(
    "/api/work-with-us/demo",
    payload
  );
  return data;
}

/**
 * Formats server errors from Axios into a clean readable string
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string; errors?: Record<string, string> }>;
    const serverErrors = err.response?.data?.errors;
    if (serverErrors && typeof serverErrors === "object") {
      return Object.values(serverErrors).join(", ");
    }
    return err.response?.data?.message || err.message;
  }
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

