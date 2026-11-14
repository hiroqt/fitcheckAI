import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, processWorkWithUsInquiry } from "@/app/lib/workWithUs";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
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

    const result = await processWorkWithUsInquiry("general", raw);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("[API: Work With Us - General Inquiry Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while processing general inquiry.",
        receivedAt: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

