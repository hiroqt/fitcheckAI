import type { NextRequest } from "next/server";
import { handleInquiryRequest } from "@/lib/opsInquiry";

/** "Message Us" modal → FitCheck Ops Inquiries. Same-origin only (no CORS). */
export async function POST(request: NextRequest) {
  return handleInquiryRequest(request);
}
