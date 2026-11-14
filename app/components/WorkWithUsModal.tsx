"use client";

import { useState, useId } from "react";
import axios, { AxiosError } from "axios";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getInquiryMailto, type InquiryType } from "@/app/lib/pilotEmail";

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

export function WorkWithUsModal({ isOpen, onClose, selectedPlan }: WorkWithUsModalProps) {
  const [activeType, setActiveType] = useState<InquiryType | null>(selectedPlan ? "pricing" : null);
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
  const [plan, setPlan] = useState(selectedPlan || "Growth · ₱1,799");
  const [garmentStyles, setGarmentStyles] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");

  // Honeypot field for bot defense (must remain untouched by humans)
  const [honeypot, setHoneypot] = useState("");

  const honeypotId = useId();

  function resetState() {
    setActiveType(selectedPlan ? "pricing" : null);
    setLoading(false);
    setSuccessResponse(null);
    setFormErrors({});
    setGeneralError(null);
    setBrandName("");
    setContactEmail("");
    setContactPerson("");
    setPhone("");
    setStoreUrl("");
    setGarmentStyles("");
    setPreferredDate("");
    setMessage("");
    setHoneypot("");
  }

  function handleClose() {
    resetState();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeType) return;

    setLoading(true);
    setFormErrors({});
    setGeneralError(null);

    const payload = {
      inquiryType: activeType,
      brandName: brandName.trim(),
      contactEmail: contactEmail.trim(),
      contactPerson: contactPerson.trim() || undefined,
      phone: phone.trim() || undefined,
      storeUrl: storeUrl.trim() || undefined,
      selectedPlan: activeType === "pricing" ? plan : undefined,
      garmentStyles: activeType === "pricing" ? garmentStyles.trim() || undefined : undefined,
      preferredDate: activeType === "demo" ? preferredDate.trim() || undefined : undefined,
      garmentCategories: activeType === "demo" ? garmentStyles.trim() || undefined : undefined,
      message: message.trim() || undefined,
      source: "website_work_with_us_modal",
      // Hidden honeypot field
      hp_company_website: honeypot,
    };

    try {
      const response = await axios.post("/api/inquiry", payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      if (response.data?.success) {
        setSuccessResponse({
          inquiryId: response.data.inquiryId,
          message: response.data.message || "Thank you! Your inquiry has been safely received.",
        });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string; errors?: Record<string, string> }>;
        if (axiosErr.response?.data?.errors) {
          setFormErrors(axiosErr.response.data.errors);
        } else if (axiosErr.response?.data?.message) {
          setGeneralError(axiosErr.response.data.message);
        } else if (axiosErr.response?.status === 429) {
          setGeneralError("Too many inquiries sent from your network. Please wait a bit before retrying.");
        } else {
          setGeneralError("Unable to submit right now. Please try again or open an email draft below.");
        }
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const selectedInquiryMeta = inquiries.find((i) => i.type === activeType);

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
          /* Step 3: Success Confirmation */
          <div className="py-4 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-8" />
            </div>
            <DialogTitle className="mt-4 text-xl font-bold text-[#101b43]">
              Inquiry Received
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
              className="mt-6 w-full rounded-full bg-[#0038ff] py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#002bdc]"
            >
              Done
            </button>
          </div>
        ) : (
          /* Step 2: Interactive Secure Form */
          <div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setActiveType(null);
                  setFormErrors({});
                  setGeneralError(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#515d82] hover:text-[#0038ff]"
              >
                <ArrowLeft className="size-3.5" /> Back to choices
              </button>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0038ff]">
                {selectedInquiryMeta?.title}
              </span>
            </div>

            <DialogTitle className="mt-3 text-xl font-bold text-[#101b43]">
              {selectedInquiryMeta?.title}
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs text-[#515d82]">
              {selectedInquiryMeta?.description}
            </DialogDescription>

            {generalError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5" noValidate>
              {/* Bot defense honeypot field - invisible to human users */}
              <div
                aria-hidden="true"
                style={{
                  opacity: 0,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: 0,
                  width: 0,
                  zIndex: -1,
                  pointerEvents: "none",
                }}
              >
                <label htmlFor={honeypotId}>Company Website</label>
                <input
                  id={honeypotId}
                  type="text"
                  name="hp_company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-xs font-medium text-[#101b43]">
                  Brand or Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Aura Studio Manila"
                  className="mt-1 w-full rounded-md border border-[#d5d5e4] px-3 py-2 text-sm text-[#101b43] placeholder-[#9090aa] focus:border-[#0038ff] focus:outline-none focus:ring-1 focus:ring-[#0038ff]"
                />
                {formErrors.brandName && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.brandName}</p>
                )}
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-xs font-medium text-[#101b43]">
                  Work / Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@brand.com"
                  className="mt-1 w-full rounded-md border border-[#d5d5e4] px-3 py-2 text-sm text-[#101b43] placeholder-[#9090aa] focus:border-[#0038ff] focus:outline-none focus:ring-1 focus:ring-[#0038ff]"
                />
                {formErrors.contactEmail && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.contactEmail}</p>
                )}
              </div>

              {/* Store URL / Instagram */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#101b43]">
                    Contact Person (optional)
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Full name"
                    className="mt-1 w-full rounded-md border border-[#d5d5e4] px-3 py-2 text-sm text-[#101b43] placeholder-[#9090aa] focus:border-[#0038ff] focus:outline-none focus:ring-1 focus:ring-[#0038ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#101b43]">
                    Store / Instagram (optional)
                  </label>
                  <input
                    type="text"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    placeholder="@brand or https://..."
                    className="mt-1 w-full rounded-md border border-[#d5d5e4] px-3 py-2 text-sm text-[#101b43] placeholder-[#9090aa] focus:border-[#0038ff] focus:outline-none focus:ring-1 focus:ring-[#0038ff]"
                  />
                </div>
              </div>

              {/* Topic-specific fields */}
              {activeType === "pricing" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[#101b43]">
                      Preferred Pilot Pack
                    </label>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      className="mt-1 w-full rounded-md border border-[#d5d5e4] bg-white px-3 py-2 text-sm text-[#101b43] focus:border-[#0038ff] focus:outline-none focus:ring-1 focus:ring-[#0038ff]"
                    >
                      <option value="Starter · ₱499">Starter · ₱499 prepaid pack</option>
                      <option value="Growth · ₱1,799">Growth · ₱1,799 prepaid pack</option>
                      <option value="Larger business · ₱4,999/mo">Larger business · ₱4,999/mo + metered</option>
                      <option value="Custom · discovery quote">Custom · discovery quote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#101b43]">
                      Garment styles to showcase (optional)
                    </label>
                    <input
                      type="text"
                      value={garmentStyles}
                      onChange={(e) => setGarmentStyles(e.target.value)}
                      placeholder="e.g. Linen shirts, barong, tailored dresses"
                      className="mt-1 w-full rounded-md border border-[#d5d5e4] px-3 py-2 text-sm text-[#101b43] placeholder-[#9090aa] focus:border-[#0038ff] focus:outline-none focus:ring-1 focus:ring-[#0038ff]"
                    />
                  </div>
                </>
              )}

              {activeType === "demo" && (
                <div>
                  <label className="block text-xs font-medium text-[#101b43]">
                    Preferred Demo Date & Time (optional)
                  </label>
                  <input
                    type="text"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    placeholder="e.g. Next Tuesday 2:00 PM PHT"
                    className="mt-1 w-full rounded-md border border-[#d5d5e4] px-3 py-2 text-sm text-[#101b43] placeholder-[#9090aa] focus:border-[#0038ff] focus:outline-none focus:ring-1 focus:ring-[#0038ff]"
                  />
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-[#101b43]">
                  {activeType === "general" ? (
                    <>
                      Message / Questions <span className="text-red-500">*</span>
                    </>
                  ) : (
                    "Additional Notes or Questions (optional)"
                  )}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    activeType === "general"
                      ? "Tell us about your brand and what you would like to ask or explore..."
                      : "Any specific notes, expected volume, or timeline requirements..."
                  }
                  className="mt-1 w-full rounded-md border border-[#d5d5e4] px-3 py-2 text-sm text-[#101b43] placeholder-[#9090aa] focus:border-[#0038ff] focus:outline-none focus:ring-1 focus:ring-[#0038ff]"
                />
                {formErrors.message && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0038ff] py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#002bdc] disabled:opacity-60"
                >
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  {loading ? "Submitting securely..." : "Submit Inquiry"}
                </button>
              </div>

              <div className="pt-2 text-center">
                <a
                  href={getInquiryMailto(activeType, selectedPlan)}
                  className="text-xs text-[#515d82] underline hover:text-[#0038ff]"
                >
                  Prefer your desktop email client? Open as email draft instead &rarr;
                </a>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
