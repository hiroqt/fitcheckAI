/**
 * Server-only: the automatic "we received your inquiry" email to the visitor, sent through Resend
 * (https://resend.com/docs/api-reference/emails/send-email) after FitCheck Ops has stored the inquiry.
 *
 * - Off unless RESEND_API_KEY and INQUIRY_CONFIRMATION_FROM are set.
 * - Contains no visitor-typed text (only the inquiry type, chosen plan and Ops reference id), so the
 *   form can't be used to send arbitrary content to arbitrary addresses.
 * - One email per stored inquiry: the Resend Idempotency-Key is the Ops inquiry id.
 * - Never throws; a failed email never fails the inquiry.
 */
import axios from "axios";
import type { InquiryType, PlanKey } from "./inquirySchema";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
export const CONFIRMATION_TIMEOUT_MS = 5000;

export type ConfirmationConfig = { apiKey: string; from: string; replyTo?: string; endpoint: string };

const headerSafe = (v: string | undefined) => (v && !/[\r\n\x00-\x1f\x7f]/.test(v) ? v : undefined);

export function getConfirmationConfig(env: NodeJS.ProcessEnv = process.env): ConfirmationConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = headerSafe(env.INQUIRY_CONFIRMATION_FROM?.trim());
  if (!apiKey || !from) return null;
  // Test-only override; production always talks to Resend.
  const override = env.NODE_ENV !== "production" ? env.RESEND_API_URL?.trim() : undefined;
  return { apiKey, from, replyTo: headerSafe(env.INQUIRY_CONFIRMATION_REPLY_TO?.trim()), endpoint: override || RESEND_ENDPOINT };
}

const TYPE_LABEL: Record<InquiryType, string> = {
  general: "general inquiry",
  pricing: "pricing & availability inquiry",
  demo: "demo request",
};

const PLAN_LABEL: Record<PlanKey, string> = {
  "499": "Starter · ₱499 prepaid pack",
  "1799": "Growth · ₱1,799 prepaid pack",
  larger_business: "Larger business · ₱4,999/mo + metered",
  enterprise: "Custom · discovery quote",
};

export type ConfirmationDetails = { inquiryType: InquiryType; selectedPlan?: PlanKey; referenceId: string; canReply: boolean };

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function buildConfirmationEmail(d: ConfirmationDetails): { subject: string; text: string; html: string } {
  const plan = d.inquiryType === "pricing" && d.selectedPlan ? PLAN_LABEL[d.selectedPlan] : undefined;
  const what = `your ${TYPE_LABEL[d.inquiryType]}${plan ? ` for the ${plan}` : ""}`;
  const reply = d.canReply ? "If you'd like to add anything, just reply to this email." : "";
  const footer = "You're receiving this because this address was entered in the Message Us form on tryfitcheckai.online. If that wasn't you, you can ignore this email.";

  const text = [
    "Hello,",
    "",
    `Thanks for contacting FitCheck AI. We've received ${what}.`,
    "",
    `Reference ID: ${d.referenceId}`,
    "",
    `Our team will review it and get back to you at this email address.${reply ? ` ${reply}` : ""}`,
    "",
    "— The FitCheck AI team",
    "https://tryfitcheckai.online",
    "",
    footer,
  ].join("\n");

  const p = (s: string, style = "") => `<p style="margin:0 0 16px;${style}">${s}</p>`;
  const html = [
    '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6;color:#101b43;max-width:520px">',
    p("Hello,"),
    p(`Thanks for contacting FitCheck AI. We&#39;ve received ${escapeHtml(what)}.`),
    p(`Reference ID: <strong style="font-family:ui-monospace,Menlo,monospace">${escapeHtml(d.referenceId)}</strong>`, "padding:10px 12px;background:#f4f4f9;border-radius:8px"),
    p(`Our team will review it and get back to you at this email address.${reply ? ` ${escapeHtml(reply)}` : ""}`),
    p('— The FitCheck AI team<br><a href="https://tryfitcheckai.online" style="color:#0038ff">tryfitcheckai.online</a>'),
    p(escapeHtml(footer), "font-size:12px;color:#515d82"),
    "</div>",
  ].join("");

  return { subject: "We received your FitCheck AI inquiry", text, html };
}

/** Sends the confirmation. Resolves true when Resend accepted it; never throws. */
export async function sendInquiryConfirmation(to: string, details: Omit<ConfirmationDetails, "canReply">, config: ConfirmationConfig, timeoutMs = CONFIRMATION_TIMEOUT_MS): Promise<boolean> {
  const email = buildConfirmationEmail({ ...details, canReply: Boolean(config.replyTo) });
  try {
    const res = await axios.post(
      config.endpoint,
      { from: config.from, to: [to], subject: email.subject, text: email.text, html: email.html, ...(config.replyTo ? { reply_to: config.replyTo } : {}) },
      {
        timeout: timeoutMs,
        validateStatus: () => true,
        maxRedirects: 0,
        headers: {
          authorization: `Bearer ${config.apiKey}`,
          "content-type": "application/json",
          // Same inquiry → same key, so Resend sends it at most once.
          "idempotency-key": `inquiry-confirmation/${details.referenceId}`,
        },
      },
    );
    if (res.status >= 200 && res.status < 300) return true;
    const err = (res.data ?? {}) as { name?: string };
    console.error("[inquiry] confirmation email not sent", JSON.stringify({ status: res.status, name: err.name }));
    return false;
  } catch (err) {
    console.error("[inquiry] confirmation email failed", axios.isAxiosError(err) ? err.code : "unknown");
    return false;
  }
}
