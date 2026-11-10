"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  HelpCircle,
  Eye,
  Ruler,
  ShoppingBag,
  ShieldCheck,
  Check,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    step: "01",
    title: "Discover Garment",
    channel: "Instagram, TikTok, or Storefront",
    description: "Shopper finds a curated dress, modern barong, or blazer and is drawn to the design.",
    detail: {
      heading: "Garment Discovery Phase",
      shopperAction: "Browses brand catalog on Instagram or Shopify",
      systemAction: "High-margin item identified with AOV > ₱1,200",
      chatExample: "Shopper saves post: 'Terracotta Silk Midi Dress — ₱2,600'",
    },
  },
  {
    step: "02",
    title: "Ask About Style",
    channel: "Direct Message or Assisted Chat",
    description: "Buyer hesitates on appearance: “Bagay kaya sa akin yung silhouette? How does it drape?”",
    detail: {
      heading: "Appearance Hesitation Trigger",
      shopperAction: "Shopper sends DM: 'Gusto ko ito pero baka hindi bumagay sa shoulder width ko...'",
      systemAction: "Seller identifies visual hesitation and offers optional FitCheck session",
      chatExample: "Seller replies: 'Hi sis! You can see it moving on your browser in 30 seconds. Here is your private mirror link!'",
    },
  },
  {
    step: "03",
    title: "FitCheck Live Mirror",
    channel: "Single-Use 30s Browser Link",
    description: "Seller sends an optional preview link. Shopper grants camera consent and sees the moving look.",
    highlight: true,
    detail: {
      heading: "30-Second Style Evaluation",
      shopperAction: "Shopper grants informed camera consent in Safari/Chrome (no app needed)",
      systemAction: "Model generates real-time moving visual drape with 30s countdown and stop control",
      chatExample: "Shopper previews moving silhouette: 'Ang ganda pala nung bagsak sa waist!'",
    },
  },
  {
    step: "04",
    title: "Check Real Size Chart",
    channel: "Brand Tech Specs & Measurements",
    description: "Shopper verifies actual garment dimensions (bust, waist, length in cm/in) against their measurements.",
    detail: {
      heading: "Physical Measurement Verification",
      shopperAction: "Shopper opens brand's spec table and compares chest/waist measurements",
      systemAction: "FitCheck reminds buyer that mirror is for style only, not a sizing guarantee",
      chatExample: "Shopper confirms: 'My bust is 34 in, so Size S is perfect based on the chart.'",
    },
  },
  {
    step: "05",
    title: "Confident Decision",
    channel: "Assisted Checkout / GCash / Maya",
    description: "Buyer completes payment without unresolved visual hesitation or speculative size ordering.",
    detail: {
      heading: "Informed Purchase & Checkout",
      shopperAction: "Sends GCash / Maya payment receipt or checks out on website",
      systemAction: "Incremental order captured without return-bracketing behavior",
      chatExample: "Seller confirms order: 'Order confirmed! Shipping tomorrow via Lalamove/J&T.'",
    },
  },
];

export function ProblemSolution() {
  const [activeStepIndex, setActiveStepIndex] = useState(1); // Default to Step 02 ("Ask About Style")

  const activeStep = STEPS[activeStepIndex];

  return (
    <section id="assisted-flow" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Center Aligned Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-[#0038FF]/30 bg-[#0038FF]/10 text-xs font-mono uppercase tracking-widest text-[#60A5FA] mb-4 mx-auto text-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF]" />
          <span>Section 04 Assisted Sales Sequence</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight text-balance">
          How FitCheck fits inside the real Philippine sales journey
        </h2>
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed text-balance max-w-2xl mx-auto">
          Shoppers struggle to visualize garments from flat photos or studio models alone. Click through each step below to inspect how local sellers resolve DM hesitation.
        </p>
      </div>

      {/* 5-Step Customer Decision Journey Flow (Interactive Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {STEPS.map((item, idx) => {
          const isSelected = activeStepIndex === idx;

          return (
            <button
              key={item.step}
              onClick={() => setActiveStepIndex(idx)}
              className={`rounded-2xl p-6 flex flex-col justify-between text-left transition-all duration-200 border cursor-pointer relative overflow-hidden ${
                isSelected
                  ? "bg-[#0E1530] border-[#0038FF] shadow-[0_0_28px_rgba(0,56,255,0.3)] ring-1 ring-[#0038FF]"
                  : item.highlight
                  ? "bg-[#111624] border-[#0038FF]/40 hover:border-[#0038FF]"
                  : "bg-[#111318] border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.03]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038FF]" />
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected
                        ? "bg-[#0038FF] text-white"
                        : "bg-white/[0.06] text-slate-400"
                    }`}
                  >
                    STEP {item.step}
                  </span>
                  {item.highlight && (
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#60A5FA] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF] animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1 mb-3">
                  {item.channel}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className={isSelected ? "text-[#60A5FA] font-semibold" : ""}>
                  {isSelected ? "Active Step View" : "Click to Inspect"}
                </span>
                <ArrowRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isSelected ? "translate-x-1 text-[#60A5FA]" : "text-slate-400"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Step Detail Panel */}
      <div className="mt-8 rounded-2xl border border-white/[0.12] bg-[#0E1016] p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#60A5FA]">
              <span>INSPECTING STEP {activeStep.step}</span>
              <span>•</span>
              <span>{activeStep.channel}</span>
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight">
              {activeStep.detail.heading}
            </h4>
          </div>

          {activeStepIndex === 2 ? (
            <Button
              size="sm"
              onClick={() => {
                document.getElementById("mirror-demo")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#0038FF] hover:bg-[#1A4CFF] text-white text-xs font-mono px-4 h-9"
            >
              <span>Scroll to Live Mirror Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Next step:</span>
              <button
                onClick={() => setActiveStepIndex((prev) => (prev + 1) % STEPS.length)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer"
              >
                <span>Advance to Step 0{((activeStepIndex + 1) % STEPS.length) + 1}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Step Simulation Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Assisted Sales Protocol
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white">Shopper Action: </span>
                {activeStep.detail.shopperAction}
              </div>
              <div className="text-xs text-slate-300 pt-2 border-t border-white/[0.04]">
                <span className="font-semibold text-[#60A5FA]">Seller / System Action: </span>
                {activeStep.detail.systemAction}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#0038FF]" />
              <span>Real Philippine Customer Conversation</span>
            </div>
            <div className="p-4 rounded-xl bg-[#090C14] border border-[#0038FF]/30 space-y-2">
              <div className="text-xs text-slate-200 italic font-sans leading-relaxed">
                “{activeStep.detail.chatExample}”
              </div>
              <div className="text-[11px] font-mono text-[#60A5FA] pt-1">
                Context: Manila boutique assisted DM checkout
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Scope & Transparency Notice */}
      <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#111318] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#0038FF]" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">The preview is an optional step — </span>
            not a replacement for product photos, physical measurements, pricing, shipping, or brand return policies.
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest shrink-0">
          Source: FitCheck Strategy Doc §01
        </span>
      </div>
    </section>
  );
}
