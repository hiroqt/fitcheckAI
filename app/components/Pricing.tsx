"use client";

import React, { useState } from "react";
import { Check, ShieldCheck, ArrowRight, HelpCircle, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingProps {
  onOpenPilotModal?: () => void;
}

const PACKAGES = [
  {
    name: "Small Brand Pilot",
    price: "₱499",
    billing: "One-time prepaid pack",
    previews: "5 × 30-sec live previews",
    costPerPreview: "~₱100 / preview",
    modelCost: "₱189 model usage",
    remaining: "₱310 margin & operations",
    highlight: false,
    description: "Designed for small boutique labels wanting to test assisted mirror previews on 5 high-intent DM inquiries.",
    features: [
      "5 single-use 30-second browser links",
      "Camera consent & viewfinder framing",
      "Fixed allowance — zero automatic overages",
      "Manual stop control on all sessions",
      "Anonymous shopper outcome telemetry",
      "1 supervised onboarding walkthrough",
    ],
    cta: "Request Small Pilot (₱499)",
  },
  {
    name: "Growing Brand Pack",
    price: "₱1,799",
    billing: "Prepaid refill pack",
    previews: "20 × 30-sec live previews",
    costPerPreview: "~₱90 / preview",
    modelCost: "₱756 model usage",
    remaining: "₱1,043 operations & reserve",
    highlight: true,
    description: "Our recommended test tier for active Instagram & Shopify stores with weekly DM style inquiries.",
    features: [
      "20 single-use 30-second browser links",
      "Direct Instagram DM / WhatsApp link generator",
      "Dedicated brand logo badge on mirror",
      "Zero auto-bill — seller repurchases deliberately",
      "Session failure retry credit guarantee",
      "Bi-weekly conversion & attribution review",
    ],
    cta: "Apply for Growing Pack (₱1,799)",
  },
  {
    name: "Larger Merchant",
    price: "₱4,999",
    billing: "Monthly platform + metered usage",
    previews: "100 × 30-sec (est.)",
    costPerPreview: "Metered wholesale rate",
    modelCost: "₱3,780 est. model cost",
    remaining: "Platform access & priority queuing",
    highlight: false,
    description: "For multi-brand boutiques or department retail teams needing volume controls and multi-seller seats.",
    features: [
      "Centralized usage caps & staff permissions",
      "Embeddable PDP widget script tag",
      "Multi-agent seat management for DM teams",
      "Custom size chart integration drawer",
      "Priority GPU queue with sub-second handoff",
      "Subject to Phase 5 expansion evidence gate",
    ],
    cta: "Inquire for Phase 5",
  },
];

export function Pricing({ onOpenPilotModal }: PricingProps = {}) {
  // Interactive Breakeven Calculator
  const [marginPerOrder, setMarginPerOrder] = useState<number>(600);

  // Calculate extra orders needed to cover ₱1,799 pack
  const extraOrdersNeeded = Math.ceil(1799 / marginPerOrder);

  return (
    <section id="pricing" className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      <div className="max-w-3xl mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
          Prepaid pilot packages with zero surprise billings
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
          FitCheck operates on fixed prepaid packs with transparent model economics. Previews cost ~₱37.80 in GPU generation per 30-second session. No recurring auto-renewals; repurchases are strictly deliberate.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.name}
            className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all border ${
              pkg.highlight
                ? "bg-[#0E152D] border-[#0038FF] shadow-[0_0_36px_rgba(0,56,255,0.28)] relative"
                : "bg-[#111318] border-white/[0.08]"
            }`}
          >
            {pkg.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0038FF] text-white text-[10px] font-mono tracking-widest uppercase font-semibold">
                RECOMMENDED PILOT PACK
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  {pkg.name}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {pkg.previews}
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl sm:text-5xl font-bold font-mono text-white tracking-tight tabular-nums">
                  {pkg.price}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {pkg.billing}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {pkg.description}
              </p>

              {/* Economic transparency strip */}
              <div className="bg-black/40 border border-white/[0.06] rounded-xl p-3 mb-6 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Seller Pack Cost:</span>
                  <span className="text-slate-200">{pkg.costPerPreview}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Model Usage (est.):</span>
                  <span className="text-slate-300">{pkg.modelCost}</span>
                </div>
                <div className="flex justify-between text-[#60A5FA] pt-1 border-t border-white/[0.04]">
                  <span>Operational Buffer:</span>
                  <span>{pkg.remaining}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-2 text-xs text-slate-300">
                {pkg.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span className="leading-normal">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-white/[0.06]">
              <Button
                onClick={() => {
                  if (onOpenPilotModal) {
                    onOpenPilotModal();
                  } else {
                    document.getElementById("pilot-intake")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`w-full h-11 text-xs font-medium rounded-xl transition cursor-pointer ${
                  pkg.highlight
                    ? "bg-[#0038FF] hover:bg-[#1A4CFF] text-white shadow-[0_0_16px_rgba(0,56,255,0.4)]"
                    : "bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.1]"
                }`}
              >
                {pkg.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Seller ROI Breakeven Calculator (From Section 08) */}
      <div className="mt-16 rounded-2xl border border-white/[0.1] bg-[#111318] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#60A5FA]">
              <Calculator className="w-4 h-4" />
              <span>Section 08 Seller Return-on-Investment</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Extra orders needed to cover the ₱1,799 Growing Pack
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Incremental contribution matters—not vanity impressions. Adjust your average garment contribution margin below to calculate your breakeven threshold.
            </p>

            {/* Slider */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Garment Contribution Margin:</span>
                <span className="text-white font-bold text-sm tabular-nums">
                  ₱{marginPerOrder.toLocaleString()} per order
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="1200"
                step="50"
                value={marginPerOrder}
                onChange={(e) => setMarginPerOrder(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0038FF]"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>₱200 (Low Margin)</span>
                <span>₱600 (Contemporary)</span>
                <span>₱1,200 (Luxury / Tailored)</span>
              </div>
            </div>
          </div>

          {/* Calculator Output Card */}
          <div className="w-full lg:w-72 bg-[#0A0D15] border border-white/[0.1] p-6 rounded-xl text-center shrink-0">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Breakeven Threshold
            </span>
            <div className="text-5xl font-bold font-mono text-white my-2 tabular-nums">
              {extraOrdersNeeded}{" "}
              <span className="text-lg font-normal text-slate-400">orders</span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              Across 20 shopper previews, securing just{" "}
              <span className="text-white font-semibold">{extraOrdersNeeded} incremental order{extraOrdersNeeded > 1 ? "s" : ""}</span>{" "}
              completely recovers your ₱1,799 investment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
