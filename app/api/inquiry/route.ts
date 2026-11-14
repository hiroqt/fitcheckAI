import { NextResponse, type NextRequest } from "next/server";
import axios, { AxiosError } from "axios";
import { inquirySchema, type ValidatedInquiry } from "@/lib/inquirySchema";
import { checkRateLimit } from "@/lib/rateLimit";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

/**
 * Security Layer 1: HTTPS Enforcement for Internal System API URL
 */
function getValidatedInternalUrl(): string | null {
  const rawUrl = process.env.INTERNAL_SYSTEM_API_URL;
  if (!rawUrl || !rawUrl.trim()) return null;

  const trimmed = rawUrl.trim();
  let parsed: URL;

  try {
    parsed = new URL(trimmed);
  } catch {
    console.error("[SECURITY CONFIG ERROR] INTERNAL_SYSTEM_API_URL is not a valid URL.");
    throw new Error("Invalid internal system URL configuration.");
  }

  const isProduction = process.env.NODE_ENV === "production";
  const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);

  // Strictly enforce HTTPS in production
  if (parsed.protocol !== "https:") {
    if (isProduction || !isLocalhost) {
      console.error(
        `[SECURITY ALERT] INTERNAL_SYSTEM_API_URL rejected: Must strictly use HTTPS in production. Protocol: ${parsed.protocol}`
      );
      throw new Error("Internal system URL must use HTTPS.");
    }
  }

  return parsed.toString();
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  // Extract client IP address for rate limiting
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // ---------------------------------------------------------------------------
  // Security Layer 3: Rate Limiting (Upstash Redis with Fallback)
  // Max 3 submissions per IP per 1 hour
  // ---------------------------------------------------------------------------
  try {
    const rateLimit = await checkRateLimit(clientIp);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many inquiry requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Retry-After": String(rateLimit.retryAfter || 3600),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.reset),
          },
        }
      );
    }
  } catch (rateLimitErr) {
    // Non-blocking fallback if rate limiter fails
    console.warn("[RateLimit Check Error]:", rateLimitErr);
  }

  // Read JSON body safely
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON request format.",
      },
      { status: 400, headers: corsHeaders }
    );
  }

  // ---------------------------------------------------------------------------
  // Security Layer 2: Strict Input Validation (Zod)
  // ---------------------------------------------------------------------------
  const validation = inquirySchema.safeParse(rawBody);

  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0] ? String(issue.path[0]) : "general";
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Validation failed. Please correct the highlighted errors.",
        errors: fieldErrors,
      },
      { status: 400, headers: corsHeaders }
    );
  }

  const data: ValidatedInquiry = validation.data;

  // ---------------------------------------------------------------------------
  // Security Layer 4: Bot Defense via Honeypot
  // If the hidden honeypot field is populated, silently drop the submission
  // ---------------------------------------------------------------------------
  if (data.hp_company_website && data.hp_company_website.trim().length > 0) {
    console.warn(`[Security Alert] Honeypot triggered by suspected bot. IP: ${clientIp}`);
    // Return silent 200 OK so bots assume success without doing any real work
    return NextResponse.json(
      {
        success: true,
        message: "Inquiry received successfully.",
      },
      { status: 200, headers: corsHeaders }
    );
  }

  // Strip honeypot from forwarded payload
  const { hp_company_website, ...cleanPayload } = data;
  const inquiryId = `inq_${data.inquiryType}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const receivedAt = new Date().toISOString();

  // ---------------------------------------------------------------------------
  // Security Layer 1: Server-Side Secret Key & Axios Dispatch with HTTPS
  // ---------------------------------------------------------------------------
  try {
    const internalUrl = getValidatedInternalUrl();
    const apiKey = process.env.INTERNAL_API_KEY;

    if (internalUrl) {
      await axios.post(
        internalUrl,
        {
          inquiryId,
          receivedAt,
          ...cleanPayload,
        },
        {
          timeout: 8000,
          headers: {
            "Content-Type": "application/json",
            // Strictly server-side secret key
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          },
        }
      );
    } else {
      // In dev or until internal system URL is set up, log payload safely
      console.info("[Inquiry Stored Locally]:", {
        inquiryId,
        type: data.inquiryType,
        brand: data.brandName,
        email: data.contactEmail,
      });
    }

    return NextResponse.json(
      {
        success: true,
        inquiryId,
        type: data.inquiryType,
        message: "Your inquiry has been received. Our team will contact you shortly.",
        receivedAt,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    // ---------------------------------------------------------------------------
    // Security Layer 4: Safe Error Handling
    // Never leak internal URLs, authorization details, or stack traces to client
    // ---------------------------------------------------------------------------
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError;
      console.error("[Axios Upstream Error]:", {
        status: axiosErr.response?.status,
        message: axiosErr.message,
        code: axiosErr.code,
      });
    } else {
      console.error("[Inquiry Processing Error]:", error);
    }

    // Generic safe error message returned to browser
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while processing your request. Please try again later.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

