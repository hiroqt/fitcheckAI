import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, processWorkWithUsInquiry, type InquiryType } from "@/app/lib/workWithUs";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  return NextResponse.json(
    {
      service: "FitCheck AI - Work With Us API",
      version: "1.0.0",
      description: "Internal and external endpoints for Work With Us inquiries",
      endpoints: {
        unified: {
          path: "/api/work-with-us",
          method: "POST",
          description: "Unified endpoint. Requires 'type' field ('general' | 'pricing' | 'demo')",
        },
        generalInquiry: {
          path: "/api/work-with-us/general",
          method: "POST",
          description: "Submit a general inquiry",
        },
        pricingAvailability: {
          path: "/api/work-with-us/pricing",
          method: "POST",
          description: "Submit pricing & availability inquiry",
        },
        requestDemo: {
          path: "/api/work-with-us/demo",
          method: "POST",
          description: "Submit request for a brand demo",
        },
      },
    },
    { headers: corsHeaders }
  );
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body",
          receivedAt: new Date().toISOString(),
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const type = (raw.type as InquiryType) || "general";
    const result = await processWorkWithUsInquiry(type, raw);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("[API: Work With Us - Unified Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred.",
        receivedAt: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

