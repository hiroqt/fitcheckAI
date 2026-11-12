"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle, Send, ArrowRight, Loader2 } from "lucide-react";
import { FITCHECK_PILOT_EMAIL } from "@/app/lib/pilotEmail";

interface WorkWithUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle?: string;
  defaultMessage?: string;
}

export function WorkWithUsModal({
  isOpen,
  onClose,
  defaultTitle = "",
  defaultMessage = "",
}: WorkWithUsModalProps) {
  // Key based reset or controlled modal wrapper
  return (
    <WorkWithUsModalContent
      key={isOpen ? `${defaultTitle}-${defaultMessage}` : "closed"}
      isOpen={isOpen}
      onClose={onClose}
      initialTitle={defaultTitle}
      initialMessage={defaultMessage}
    />
  );
}

function WorkWithUsModalContent({
  isOpen,
  onClose,
  initialTitle,
  initialMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTitle: string;
  initialMessage: string;
}) {
  // Form fields
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState(initialTitle);
  const [message, setMessage] = useState(initialMessage);

  // Modal UI state
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmailDraft, setShowEmailDraft] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const draftSubject = title.trim().replace(/[\r\n\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, " ");
  const draftBody = `From: ${email.trim()}\n\n${message.trim()}`.replace(/\r\n|\r|\n/g, "\r\n");
  const emailDraftUrl = `mailto:${FITCHECK_PILOT_EMAIL}?${new URLSearchParams({ subject: draftSubject, body: draftBody }).toString().replace(/\+/g, "%20")}`;

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setShowEmailDraft(false);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!title.trim()) {
      setErrorMessage("Please enter an email title / subject.");
      return;
    }
    if (!message.trim()) {
      setErrorMessage("Please enter your message.");
      return;
    }

    // Move to confirmation step
    setShowEmailDraft(false);
    setShowConfirm(true);
  };

  const handleConfirmedSend = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    setShowEmailDraft(false);
    let canOfferDraft = true;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          title: title.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => null);
      canOfferDraft = res.status === 429 || res.status >= 500 || (res.ok && data?.success !== true);

      if (!res.ok || data?.success !== true) {
        throw new Error(typeof data?.error === "string" ? data.error : "Failed to send email. Please try again.");
      }

      setIsSuccess(true);
      setShowConfirm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      setShowEmailDraft(canOfferDraft);
      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const fieldStyle =
  "mt-1.5 block w-full rounded-md border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-[#101b43] placeholder-zinc-400 transition-colors duration-150 focus:border-[#0038ff] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0";

  return (
    <>
      {/* Primary Work With Us Modal */}
      <Dialog open={isOpen && !showConfirm} onOpenChange={(open) => { if (!open) handleModalClose(); }}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-white p-6 sm:p-9 text-[#101b43] sm:max-w-xl border border-zinc-200/80 shadow-2xl">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-[#101b43]">
                Message submitted
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                Your message was accepted for processing. We can’t confirm inbox delivery.
              </DialogDescription>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#101b43] px-6 text-xs font-semibold text-white transition-all hover:bg-black active:scale-95 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <DialogTitle className="text-2xl font-bold tracking-tight text-[#101b43]">
                  Work with us
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Send a direct inquiry to <span className="text-zinc-700 font-medium">fitcheckai0@gmail.com</span>
                </DialogDescription>
              </div>

              {errorMessage && (
                <div role="alert" className="mb-4 rounded-lg bg-rose-50 border border-rose-100 p-2.5 text-xs text-rose-600">
                  <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" /><span>{errorMessage}</span></div>
                  {showEmailDraft && <a href={emailDraftUrl} className="mt-2 inline-flex min-h-9 items-center font-semibold underline underline-offset-2">Open email draft</a>}
                </div>
              )}

              <form onSubmit={handleInitialSubmit} className="space-y-4">
                <div>
                  <label htmlFor="user-email" className="block text-xs font-medium text-zinc-600">
                    Your email address
                  </label>
                  <input
                    id="user-email"
                    type="email"
                    required
                    placeholder="name@brand.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldStyle}
                    autoComplete="email"
                    maxLength={254}
                  />
                </div>

                <div>
                  <label htmlFor="email-title" className="block text-xs font-medium text-zinc-600">
                    Subject
                  </label>
                  <input
                    id="email-title"
                    type="text"
                    required
                    placeholder="Subject or brand name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                    className={fieldStyle}
                  />
                </div>

                <div>
                  <label htmlFor="email-message" className="block text-xs font-medium text-zinc-600">
                    Message
                  </label>
                  <textarea
                    id="email-message"
                    required
                    rows={8}
                    placeholder="Tell us about your brand or questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={4000}
                    className={`${fieldStyle} resize-none min-h-[180px] sm:min-h-[210px] leading-relaxed`}
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-xs font-medium text-zinc-600 transition-all hover:bg-zinc-50 active:scale-95 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#101b43] px-5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-black active:scale-95 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirm} onOpenChange={(open) => { if (!open && !isSubmitting) setShowConfirm(false); }}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 text-[#101b43] sm:max-w-lg border border-zinc-200/80 shadow-2xl">
          <div className="mb-4">
            <DialogTitle className="text-xl font-bold tracking-tight text-[#101b43]">
              Send message?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-zinc-500 mt-1">
              Confirm your message before delivering to <strong className="text-zinc-800">fitcheckai0@gmail.com</strong>
            </DialogDescription>
          </div>

          {/* Email Preview Card */}
          <div className="my-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 text-xs sm:text-sm space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-zinc-400 w-16 shrink-0">From:</span>
              <span className="text-zinc-800 font-medium truncate">{email}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-zinc-400 w-16 shrink-0">Subject:</span>
              <span className="text-zinc-800 font-medium truncate">{title}</span>
            </div>
            <div className="pt-2.5 border-t border-zinc-200">
              <p className="text-zinc-700 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                {message}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowConfirm(false)}
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3.5 text-xs font-medium text-zinc-600 transition-all hover:bg-zinc-50 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmedSend}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-[#101b43] px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-black active:scale-95 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Sending…</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Send now</span>
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
