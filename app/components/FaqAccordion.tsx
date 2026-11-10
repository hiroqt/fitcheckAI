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
    question: "How does FitCheck AI predict fit without awkward camera scans or photo uploads?",
    answer:
      "Modern luxury shoppers bounce when asked to download an app or upload personal photos. Instead, FitCheck AI uses an intelligent sizing model trained on millions of anthropometric profiles cross-referenced with your garment's actual tech packs, graded spec measurements, and fabric elastane/GSM stretch ratings. The customer provides basic biometrics in 3 seconds, achieving 99%+ sizing precision.",
  },
  {
    question: "Will the widget degrade our Core Web Vitals or Shopify Lighthouse score?",
    answer:
      "Not by a millisecond. The FitCheck embed is under 15KB gzipped, executes asynchronously off the main thread, and reserves its exact DOM bounding box to ensure absolute 0.00 Cumulative Layout Shift (CLS). Your storefront remains blistering fast.",
  },
  {
    question: "Can we match our brand's exact luxury typography and visual identity?",
    answer:
      "Yes. We reject generic third-party badges. FitCheck AI is completely headless-ready and CSS-variable driven. You can inject your custom serif or sans-serif typefaces, tailor border radii, calibrate padding, and toggle monochromatic or bespoke color tokens to ensure it looks natively custom-crafted by your in-house design studio.",
  },
  {
    question: "How quickly can our engineering team deploy this on Shopify Plus or Headless Next.js?",
    answer:
      "On Shopify Plus, deployment takes less than 15 minutes using our certified Theme 2.0 App Block with zero code modifications. For Headless Next.js, Remix, or Hydrogen setups, our React hook (`useFitCheck`) and lightweight Web Component integrate in under an hour.",
  },
  {
    question: "How does FitCheck AI detect manufacturing and supplier pattern variance?",
    answer:
      "Our Merchant Analytics engine cross-correlates customer returns data with manufacturer PO numbers and batch tags. If an overseas batch was cut 1cm narrower at the chest than specification, FitCheck AI flags the anomaly immediately and auto-adjusts customer recommendations in real time until restocked.",
  },
  {
    question: "What is your pricing model, and is there a performance trial?",
    answer:
      "We operate on predictable monthly or annual tiers based on recommendation volume—no unexpected percentage cuts of your gross revenue. We also offer qualified fashion brands a 14-day zero-risk pilot to benchmark return reduction against a controlled A/B test holdout group.",
  },
];

export function FaqAccordion() {
  return (
    <section className="py-24 sm:py-32 px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
          Direct Answers
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Frequently Answered Inquiries
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Everything store managers, digital directors, and frontend leads need to know before deployment.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {FAQS.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border border-white/[0.08] bg-white/[0.02] rounded-xl px-6 transition duration-200 data-[state=open]:border-white/20 data-[state=open]:bg-white/[0.04]"
          >
            <AccordionTrigger className="text-left text-base sm:text-lg font-medium text-white hover:no-underline py-5 cursor-pointer">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-slate-300 text-sm sm:text-base leading-relaxed pb-5 font-normal">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

