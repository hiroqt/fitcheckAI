import { NextResponse, type NextRequest } from "next/server";
import { handleInquiryRequest } from "@/lib/opsInquiry";

/** Legacy unified path, kept for one release. Prefer `POST /api/inquiry`. */
export async function GET() {
  return NextResponse.json({
    service: "FitCheck AI - Message Us API",
    version: "2.0.0",
    description: "Inquiries are stored in FitCheck Ops. Every submission needs consent: true and a Turnstile token (action \"inquiry\").",
    endpoints: {
      inquiry: { path: "/api/inquiry", method: "POST", description: "Preferred. Requires 'inquiryType' ('general' | 'pricing' | 'demo')." },
      legacyUnified: { path: "/api/work-with-us", method: "POST", description: "Deprecated. Uses 'type'; same rules as /api/inquiry." },
      legacyGeneral: { path: "/api/work-with-us/general", method: "POST", description: "Deprecated." },
      legacyPricing: { path: "/api/work-with-us/pricing", method: "POST", description: "Deprecated." },
      legacyDemo: { path: "/api/work-with-us/demo", method: "POST", description: "Deprecated." },
    },
  });
}

export async function POST(request: NextRequest) {
  return handleInquiryRequest(request, {});
}
