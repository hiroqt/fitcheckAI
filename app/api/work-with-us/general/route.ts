import type { NextRequest } from "next/server";
import { handleInquiryRequest } from "@/lib/opsInquiry";

/** Legacy path, kept for one release. Same handler and rules as `/api/inquiry` (consent + Turnstile required). */
export async function POST(request: NextRequest) {
  return handleInquiryRequest(request, { inquiryType: "general" });
}
