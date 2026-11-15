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

export type ConfirmationDetails = {
  inquiryType: InquiryType;
  selectedPlan?: PlanKey;
  referenceId: string;
  /** Visitor-typed; only a safe first name is ever used (see `safeFirstName`). */
  contactName?: string;
  canReply: boolean;
};

const SITE_URL = "https://tryfitcheckai.online";
const LOGO_URL = `${SITE_URL}/email/fitcheck-wordmark.png`;
const TAGLINE = "AI-powered digital wardrobe and clothing brand integration.";
/** Same links as the website footer (app/components/Footer.tsx). */
const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61596346923689" },
  { label: "Instagram", href: "https://www.instagram.com/fitcheck.startup/" },
  { label: "Threads", href: "https://www.threads.com/@fitcheck.startup" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/145435214/" },
];
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const INK = "#101b43";

const NAME_WORD = /^\p{L}[\p{L}\p{M}'’-]*$/u;

/**
 * First name for the greeting, or undefined. The name is visitor-typed, so the WHOLE name must look
 * like a name (at most 5 words of letters in any language, apostrophes and hyphens; first word at
 * most 30 characters). Anything with digits, dots, slashes or symbols (links, offers, spam) falls
 * back to a plain "Hello,", so no part of it is ever sent.
 */
export function safeFirstName(contactName: string | undefined): string | undefined {
  const words = contactName?.normalize("NFC").trim().split(/\s+/).filter(Boolean) ?? [];
  if (words.length === 0 || words.length > 5 || words[0].length > 30) return undefined;
  return words.every((w) => NAME_WORD.test(w)) ? words[0] : undefined;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function buildConfirmationEmail(d: ConfirmationDetails): { subject: string; text: string; html: string } {
  const plan = d.inquiryType === "pricing" && d.selectedPlan ? PLAN_LABEL[d.selectedPlan] : undefined;
  const what = `your ${TYPE_LABEL[d.inquiryType]}${plan ? ` for the ${plan}` : ""}`;
  const name = safeFirstName(d.contactName);
  const greeting = name ? `Hello ${name},` : "Hello,";
  const reply = d.canReply ? "If you'd like to add anything, just reply to this email." : "";
  const year = new Date().getFullYear();
  const copyright = `© ${year} FitCheck AI. All rights reserved.`;
  const notice = "You're receiving this because this address was entered in the Message Us form on tryfitcheckai.online. If that wasn't you, you can ignore this email.";

  const text = [
    greeting,
    "",
    `Thanks for contacting FitCheck AI. We've received ${what}.`,
    "",
    `Reference ID: ${d.referenceId}`,
    "",
    `Our team will review it and get back to you at this email address.${reply ? ` ${reply}` : ""}`,
    "",
    "The FitCheck AI team",
    SITE_URL,
    "",
    "--",
    `FitCheck AI. ${TAGLINE}`,
    ...SOCIAL_LINKS.map((l) => `${l.label}: ${l.href}`),
    "",
    copyright,
    notice,
  ].join("\n");

  const p = (s: string, style = "") => `<p style="margin:0 0 16px;${style}">${s}</p>`;
  const link = (href: string, label: string, color: string) =>
    `<a href="${escapeHtml(href)}" style="color:${color};text-decoration:underline">${escapeHtml(label)}</a>`;
  const socials = SOCIAL_LINKS.map((l) => link(l.href, l.label, "#ffffff")).join('<span style="color:#7d86ad"> &middot; </span>');

  const html = [
    "<!doctype html>",
    '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>We received your FitCheck AI inquiry</title></head>',
    `<body style="margin:0;padding:0;background:#f4f4f9;font-family:${FONT}">`,
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f9">',
    '<tr><td align="center" style="padding:24px 12px">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">',
    // Body
    `<tr><td style="padding:32px 28px 12px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK}">`,
    p(escapeHtml(greeting)),
    p(`Thanks for contacting FitCheck AI. We&#39;ve received ${escapeHtml(what)}.`),
    p(`Reference ID: <strong style="font-family:ui-monospace,Menlo,Consolas,monospace">${escapeHtml(d.referenceId)}</strong>`, "padding:10px 12px;background:#f4f4f9;border-radius:8px"),
    p(`Our team will review it and get back to you at this email address.${reply ? ` ${escapeHtml(reply)}` : ""}`),
    p(`The FitCheck AI team<br>${link(SITE_URL, "tryfitcheckai.online", "#0038ff")}`),
    "</td></tr>",
    // Branded footer (matches the website footer)
    `<tr><td style="background:${INK};padding:28px;font-family:${FONT};font-size:13px;line-height:1.6;color:#c9cbe0">`,
    `<a href="${SITE_URL}" style="text-decoration:none"><img src="${LOGO_URL}" width="130" height="40" alt="FitCheck AI" style="display:block;border:0;outline:none;height:40px;width:130px"></a>`,
    p(escapeHtml(TAGLINE), "margin-top:12px;font-size:14px;color:#ffffff"),
    p(socials, "margin-bottom:8px"),
    p(link(SITE_URL, "tryfitcheckai.online", "#c9cbe0")),
    p(escapeHtml(copyright), "margin-bottom:6px;font-size:12px;color:#9aa1c2"),
    p(escapeHtml(notice), "margin:0;font-size:11px;color:#9aa1c2"),
    "</td></tr>",
    "</table></td></tr></table></body></html>",
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
