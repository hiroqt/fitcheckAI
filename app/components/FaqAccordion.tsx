"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Is FitCheck a digital tape measure or sizing guarantee tool?",
    answer:
      "No. FitCheck is explicitly a visual inspiration and style-evaluation aid—not a sizing guarantee, fabric physics simulation, or promise of fewer returns. It helps shoppers see how a silhouette and cut looks on them while moving. Physical sizing must always be confirmed by checking the brand's exact centimeter/inch size chart (Step 4 in our assisted sales journey).",
  },
  {
    question: "Why are previews capped at 30 seconds per session?",
    answer:
      "To protect seller margins and deliver a focused, efficient preview. Generating live generative video costs approximately US$0.02 (~₱1.26) per second in GPU inference. A 30-second session costs approximately ₱37.80 in raw model usage. Capping sessions at 30 seconds ensures predictable pack costs (₱499 for 5 previews) and prevents unintended cost spirals.",
  },
  {
    question: "Why should low-margin basic brands avoid open free previews?",
    answer:
      "For a ₱199 or ₱299 basic t-shirt, spending ₱37.80 on GPU generation consumes almost the entire product contribution margin. Unrestricted per-visitor free try-ons on low-priced basics lead to negative unit economics. FitCheck is engineered for higher-margin curated apparel (tops, jackets, dresses, barongs) where securing even one hesitant purchase generates substantial net profit.",
  },
  {
    question: "How does FitCheck comply with the Philippine Data Privacy Act (RA 10173)?",
    answer:
      "We enforce informed, explicit consent before any camera stream is activated. Video frames are streamed to secure GPU clusters strictly for real-time visual synthesis and are not stored as identifiable shopper archives. Audio/microphone inputs are permanently turned off, and shoppers can terminate the preview immediately at any second.",
  },
  {
    question: "How do sellers share FitCheck links with shoppers?",
    answer:
      "During direct message conversations (Instagram DM, Viber, TikTok, WhatsApp) when a shopper asks appearance questions (“Bagay kaya yung silhouette sa akin?”), the seller generates a single-use 30-second preview link with one click. The buyer taps the link in Safari or Chrome, grants camera permission, and sees the live preview without downloading any mobile app.",
  },
  {
    question: "What happens if a preview session fails due to a network glitch?",
    answer:
      "Every prepaid pack includes an automatic failure-credit guarantee. If a shopper’s connection drops or our inference service encounters a timeout before delivering the visual preview, the session credit is automatically refunded back to the seller’s prepaid balance.",
  },
];

export function FaqAccordion() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Center Aligned Section Header & Badge */}
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-slate-400 mb-4 mx-auto text-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF]" />
          <span>Operational Pilot FAQs</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight text-balance">
          Frequently asked questions regarding the pilot
        </h2>
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed text-balance max-w-2xl mx-auto">
          Operational details on unit economics, privacy compliance, session limits, and seller integration.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {FAQS.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="rounded-xl border border-white/[0.08] bg-[#111318] px-6 transition duration-200 data-[state=open]:border-[#0038FF]/40 data-[state=open]:bg-[#0E121E]"
          >
            <AccordionTrigger className="text-left text-sm sm:text-base font-medium text-white hover:no-underline py-5 cursor-pointer">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-slate-300 leading-relaxed pb-5 border-t border-white/[0.04] pt-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
