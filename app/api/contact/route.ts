import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { renderInquiryEmailHtml } from "@/app/lib/emailTemplates";

const FITCHECK_RECIPIENT = "fitcheckai0@gmail.com";

interface ContactRequestBody {
  email?: string;
  title?: string;
  message?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactRequestBody;
    const email = body.email?.trim() || "";
    const title = body.title?.trim() || "";
    const message = body.message?.trim() || "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!title || title.length > 200) {
      return NextResponse.json(
        { success: false, error: "Please provide a subject / title (max 200 characters)." },
        { status: 400 }
      );
    }

    if (!message || message.length > 4000) {
      return NextResponse.json(
        { success: false, error: "Please write a message (max 4,000 characters)." },
        { status: 400 }
      );
    }

    // Check if SMTP or Resend credentials exist in process.env
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = (process.env.SMTP_USER || process.env.GMAIL_USER || "").trim();
    const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
    const resendApiKey = process.env.RESEND_API_KEY;

    const emailSubject = title;
    const emailText = [
      `New "Work with us" message submitted through fitcheck website:`,
      ``,
      `From: ${email}`,
      `Subject / Title: ${title}`,
      `Date: ${new Date().toISOString()}`,
      ``,
      `Message:`,
      `----------------------------------------`,
      message,
      `----------------------------------------`,
    ].join("\n");

    const emailHtml = renderInquiryEmailHtml({
      senderEmail: email,
      title,
      message,
    });

    // Strategy 1: Resend HTTP API (if configured)
    if (resendApiKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "FitCheck Web <onboarding@resend.dev>",
          to: [FITCHECK_RECIPIENT],
          reply_to: email,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
        }),
      });

      if (resendRes.ok) {
        return NextResponse.json({ success: true, method: "resend" });
      }
    }

    // Strategy 2: Direct SMTP / Gmail App Password (if configured)
    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost || "smtp.gmail.com",
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"${email}" <${smtpUser}>`,
          replyTo: email,
          to: FITCHECK_RECIPIENT,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
        });

        return NextResponse.json({ success: true, method: "smtp" });
      } catch (smtpErr) {
        console.warn("SMTP attempt failed, falling back to mailto client:", smtpErr);
        // Fall back gracefully so the user never gets an unhandled error
        return NextResponse.json({
          success: true,
          needsMailtoFallback: true,
          mailtoUrl: `mailto:${FITCHECK_RECIPIENT}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailText)}`,
          recipient: FITCHECK_RECIPIENT,
        });
      }
    }

    // Strategy 3: Forward to Apps Script if available or fallback
    // If no direct server credentials are set yet, return structured response
    // indicating mailto backup or queued transmission
    return NextResponse.json({
      success: true,
      needsMailtoFallback: true,
      mailtoUrl: `mailto:${FITCHECK_RECIPIENT}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailText)}`,
      recipient: FITCHECK_RECIPIENT,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

