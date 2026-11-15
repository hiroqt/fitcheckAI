"use client";

import { useId, useRef, useState } from "react";
import axios from "axios";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getInquiryMailto, type InquiryType } from "@/app/lib/pilotEmail";
import { inquirySchema, LIMITS, normalizePlanKey, type PlanKey } from "@/lib/inquirySchema";
import { TurnstileWidget, type TurnstileHandle } from "./TurnstileWidget";

interface WorkWithUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

const inquiries: { type: InquiryType; title: string; description: string }[] = [
  { type: "general", title: "General inquiry", description: "Questions about FitCheck or working together." },
  { type: "pricing", title: "Pricing & availability", description: "Pilot plans, pricing, and availability." },
  { type: "demo", title: "Request a demo", description: "See how FitCheck could work for your brand." },
];

const PLAN_OPTIONS: { value: PlanKey; label: string }[] = [
  { value: "499", label: "Starter · ₱499 prepaid pack" },
  { value: "1799", label: "Growth · ₱1,799 prepaid pack" },
  { value: "larger_business", label: "Larger business · ₱4,999/mo + metered" },
  { value: "enterprise", label: "Custom · discovery quote" },
];

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const inputClass =
  "mt-1 w-full rounded-md border border-[#d5d5e4] bg-white px-3 py-2 text-sm text-[#101b43] placeholder-[#9090aa] focus:border-[#0038ff] focus:outline-none focus:ring-1 focus:ring-[#0038ff] aria-[invalid=true]:border-red-500";

function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function captureContext(): { pagePath?: string; utm?: Record<string, string> } {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["source", "medium", "campaign", "term", "content"]) {
    const value = params.get(`utm_${key}`)?.trim();
    if (value) utm[key] = value.slice(0, LIMITS.utm);
  }
  return { pagePath: window.location.pathname.slice(0, LIMITS.pagePath) || "/", ...(Object.keys(utm).length ? { utm } : {}) };
}

export function WorkWithUsModal({ isOpen, onClose, selectedPlan }: WorkWithUsModalProps) {
  const initialPlan = normalizePlanKey(selectedPlan);
  const [activeType, setActiveType] = useState<InquiryType | null>(initialPlan ? "pricing" : null);
  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{ inquiryId?: string; message: string } | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Form fields
  const [brandName, setBrandName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [plan, setPlan] = useState<PlanKey>(initialPlan ?? "1799");
  const [garmentStyles, setGarmentStyles] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileFailed, setTurnstileFailed] = useState(false);

  // Honeypot field for bot defense (must remain untouched by humans)
  const [honeypot, setHoneypot] = useState("");

  // One id per form session: a resend after a timeout returns the stored inquiry, not a duplicate.
  // Created on the first send (not during render, which Next would prerender).
  const submissionId = useRef("");
  const turnstile = useRef<TurnstileHandle>(null);

  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  function resetState() {
    setActiveType(initialPlan ? "pricing" : null);
    setLoading(false);
    setSuccessResponse(null);
    setFormErrors({});
    setGeneralError(null);
    setBrandName("");
    setContactEmail("");
    setContactPerson("");
    setPhone("");
    setStoreUrl("");
    setPlan(initialPlan ?? "1799");
    setGarmentStyles("");
    setPreferredDate("");
    setMessage("");
    setConsent(false);
    setTurnstileToken("");
    setTurnstileFailed(false);
    setHoneypot("");
    submissionId.current = "";
  }

  function handleClose() {
    resetState();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeType || loading) return;

    setFormErrors({});
    setGeneralError(null);
    submissionId.current ||= newSubmissionId();

    const payload = {
      inquiryType: activeType,
      brandName: brandName.trim(),
      contactEmail: contactEmail.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim() || undefined,
      storeUrl: storeUrl.trim() || undefined,
      selectedPlan: activeType === "pricing" ? plan : undefined,
      garmentStyles: activeType === "pricing" ? garmentStyles.trim() || undefined : undefined,
      preferredDate: activeType === "demo" ? preferredDate.trim() || undefined : undefined,
      message: message.trim() || undefined,
      consent,
      turnstileToken,
      submissionId: submissionId.current,
      ...captureContext(),
      hp_company_website: honeypot,
    };

    // Same rules the server applies, so most mistakes are caught before sending.
    const check = inquirySchema.safeParse(payload);
    if (!check.success) {
      const errors: Record<string, string> = {};
      for (const issue of check.error.issues) {
        const field = issue.path[0] ? String(issue.path[0]) : "general";
        errors[field] ??= issue.message;
      }
      setFormErrors(errors);
      setGeneralError("Please correct the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      // No automatic retry: the verification token is single-use.
      const response = await axios.post("/api/inquiry", payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });
      if (response.data?.success) {
        setSuccessResponse({
          inquiryId: response.data.inquiryId,
          message: response.data.message || "Your inquiry has been received. Our team will contact you shortly.",
        });
      } else {
        setGeneralError("We couldn't confirm your inquiry. Please try again, or use the email draft below.");
      }
    } catch (err: unknown) {
      const data = axios.isAxiosError(err) ? (err.response?.data as { message?: string; errors?: Record<string, string> } | undefined) : undefined;
      if (data?.errors) setFormErrors(data.errors);
      if (data?.message) {
        setGeneralError(data.message);
      } else if (axios.isAxiosError(err) && err.code === "ECONNABORTED") {
        setGeneralError("We couldn't confirm your inquiry was received. You can safely send it again (it won't be duplicated), or use the email draft below.");
      } else {
        setGeneralError("Unable to send right now. Your details are still here: please try again, or use the email draft below.");
      }
      // The token was spent (or rejected); get a fresh one before the next send.
      turnstile.current?.reset();
    } finally {
      setLoading(false);
    }
  }

  const selectedInquiryMeta = inquiries.find((i) => i.type === activeType);
  const fieldError = (name: string) =>
    formErrors[name] ? (
      <p id={id(`${name}-error`)} className="mt-1 text-xs text-red-600">
        {formErrors[name]}
      </p>
    ) : null;
  const a11y = (name: string) => ({
    id: id(name),
    "aria-invalid": formErrors[name] ? true : undefined,
    "aria-describedby": formErrors[name] ? id(`${name}-error`) : undefined,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto border border-[#d5d5e4] bg-white p-5 text-[#101b43] shadow-2xl sm:max-w-lg sm:p-8">
        {!activeType ? (
          /* Step 1: Topic Selection */
          <div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-[#101b43]">
                Work with us
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-relaxed text-[#515d82]">
                Choose how you’d like to collaborate with FitCheck AI.
              </DialogDescription>
            </div>

            <nav aria-label="Choose an inquiry type" className="mt-5 divide-y divide-[#d5d5e4] border-y border-[#d5d5e4]">
              {inquiries.map(({ type, title, description }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setActiveType(type);
                    setFormErrors({});
                    setGeneralError(null);
                  }}
                  className="group flex w-full min-h-20 items-center justify-between gap-5 py-4 text-left outline-none transition-colors hover:text-[#0038ff] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0038ff]"
                >
                  <span>
                    <span className="block text-base font-semibold text-[#101b43] group-hover:text-[#0038ff]">
                      {title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[#515d82]">
                      {description}
                    </span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-[#0038ff] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              ))}
            </nav>
          </div>
        ) : successResponse ? (
          /* Step 3: Success Confirmation (shown only after FitCheck Ops stored the inquiry) */
          <div className="py-4 text-center" role="status">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 aria-hidden="true" className="size-8" />
            </div>
            <DialogTitle className="mt-4 text-xl font-bold text-[#101b43]">
              Inquiry received
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed text-[#515d82]">
              {successResponse.message}
            </DialogDescription>

            {successResponse.inquiryId && (
              <div className="mt-4 rounded-lg bg-[#f4f4f9] px-3 py-2 text-xs font-mono text-[#515d82]">
                Reference ID: <span className="font-semibold text-[#101b43]">{successResponse.inquiryId}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full rounded-full bg-[#0038ff] py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#002bdc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038ff] focus-visible:ring-offset-2"
            >
              Done
            </button>
          </div>
        ) : (
          /* Step 2: Form */
          <div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setActiveType(null);
                  setFormErrors({});
                  setGeneralError(null);
                }}
                className="inline-flex min-h-8 items-center gap-1.5 text-xs font-medium text-[#515d82] hover:text-[#0038ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038ff]"
              >
                <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to choices
              </button>
            </div>

            <DialogTitle className="mt-3 text-xl font-bold text-[#101b43]">
              {selectedInquiryMeta?.title}
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs text-[#515d82]">
              {selectedInquiryMeta?.description}
            </DialogDescription>

            <div aria-live="assertive" role="alert">
              {generalError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {generalError}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5" noValidate>
              {/* Bot defense honeypot field - invisible to human users */}
              <div
                aria-hidden="true"
                style={{ opacity: 0, position: "absolute", top: 0, left: 0, height: 0, width: 0, zIndex: -1, pointerEvents: "none" }}
              >
                <label htmlFor={id("hp")}>Company Website</label>
                <input
                  id={id("hp")}
                  type="text"
                  name="hp_company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor={id("brandName")} className="block text-xs font-medium text-[#101b43]">
                  Brand or company name <span aria-hidden="true" className="text-red-500">*</span>
                </label>
                <input {...a11y("brandName")} type="text" required maxLength={LIMITS.brandName} autoComplete="organization" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Aura Studio Manila" className={inputClass} />
                {fieldError("brandName")}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={id("contactPerson")} className="block text-xs font-medium text-[#101b43]">
                    Contact name <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input {...a11y("contactPerson")} type="text" required maxLength={LIMITS.contactName} autoComplete="name" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Full name" className={inputClass} />
                  {fieldError("contactPerson")}
                </div>
                <div>
                  <label htmlFor={id("contactEmail")} className="block text-xs font-medium text-[#101b43]">
                    Work or contact email <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input {...a11y("contactEmail")} type="email" inputMode="email" required maxLength={LIMITS.email} autoComplete="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="name@brand.com" className={inputClass} />
                  {fieldError("contactEmail")}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={id("phone")} className="block text-xs font-medium text-[#101b43]">
                    Phone (optional)
                  </label>
                  <input {...a11y("phone")} type="tel" inputMode="tel" maxLength={LIMITS.phone} autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 9xx xxx xxxx" className={inputClass} />
                  {fieldError("phone")}
                </div>
                <div>
                  <label htmlFor={id("storeUrl")} className="block text-xs font-medium text-[#101b43]">
                    Store or Instagram (optional)
                  </label>
                  <input {...a11y("storeUrl")} type="text" maxLength={LIMITS.storeUrl} value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} placeholder="@brand or https://..." className={inputClass} />
                  {fieldError("storeUrl")}
                </div>
              </div>

              {activeType === "pricing" && (
                <>
                  <div>
                    <label htmlFor={id("selectedPlan")} className="block text-xs font-medium text-[#101b43]">
                      Preferred pilot pack
                    </label>
                    <select {...a11y("selectedPlan")} value={plan} onChange={(e) => setPlan(e.target.value as PlanKey)} className={inputClass}>
                      {PLAN_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {fieldError("selectedPlan")}
                  </div>
                  <div>
                    <label htmlFor={id("garmentStyles")} className="block text-xs font-medium text-[#101b43]">
                      Garment styles to showcase (optional)
                    </label>
                    <input {...a11y("garmentStyles")} type="text" maxLength={LIMITS.garmentStyles} value={garmentStyles} onChange={(e) => setGarmentStyles(e.target.value)} placeholder="e.g. Linen shirts, barong, tailored dresses" className={inputClass} />
                    {fieldError("garmentStyles")}
                  </div>
                </>
              )}

              {activeType === "demo" && (
                <div>
                  <label htmlFor={id("preferredDate")} className="block text-xs font-medium text-[#101b43]">
                    Preferred demo date and time (optional)
                  </label>
                  <input {...a11y("preferredDate")} type="text" maxLength={LIMITS.preferredDate} value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} placeholder="e.g. Next Tuesday 2:00 PM PHT" className={inputClass} />
                  {fieldError("preferredDate")}
                </div>
              )}

              <div>
                <label htmlFor={id("message")} className="block text-xs font-medium text-[#101b43]">
                  {activeType === "general" ? (
                    <>
                      Message or questions <span aria-hidden="true" className="text-red-500">*</span>
                    </>
                  ) : (
                    "Additional notes or questions (optional)"
                  )}
                </label>
                <textarea
                  {...a11y("message")}
                  rows={3}
                  maxLength={LIMITS.message}
                  required={activeType === "general"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    activeType === "general"
                      ? "Tell us about your brand and what you would like to ask or explore..."
                      : "Any specific notes, expected volume, or timeline requirements..."
                  }
                  className={inputClass}
                />
                {fieldError("message")}
              </div>

              <div>
                <label htmlFor={id("consent")} className="flex items-start gap-2.5 text-xs leading-relaxed text-[#515d82]">
                  <input
                    {...a11y("consent")}
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-[#0038ff]"
                  />
                  <span>
                    I agree that FitCheck AI may store these details and contact me about this inquiry, as described in the{" "}
                    <a href="/privacy" target="_blank" rel="noopener" className="underline hover:text-[#0038ff]">privacy notice</a>.
                  </span>
                </label>
                {fieldError("consent")}
              </div>

              <div>
                {TURNSTILE_SITE_KEY ? (
                  <TurnstileWidget
                    ref={turnstile}
                    siteKey={TURNSTILE_SITE_KEY}
                    onToken={(token) => {
                      setTurnstileToken(token);
                      setTurnstileFailed(false);
                    }}
                    onExpire={() => setTurnstileToken("")}
                    onError={() => {
                      setTurnstileToken("");
                      setTurnstileFailed(true);
                    }}
                  />
                ) : null}
                {!TURNSTILE_SITE_KEY || turnstileFailed ? (
                  <p className="mt-1 text-xs text-red-600">The verification check couldn’t load. Please use the email draft below.</p>
                ) : (
                  fieldError("turnstileToken")
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  aria-disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0038ff] py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#002bdc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038ff] focus-visible:ring-offset-2 disabled:opacity-60"
                >
                  {loading && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                  {loading ? "Sending..." : "Send inquiry"}
                </button>
              </div>

              <div className="pt-2 text-center">
                <a
                  href={getInquiryMailto(activeType, activeType === "pricing" ? plan : undefined)}
                  className="text-xs text-[#515d82] underline hover:text-[#0038ff]"
                >
                  Prefer email? Open an email draft instead &rarr;
                </a>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
