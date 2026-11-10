"use client";

import React, { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Emerging Atelier",
    tagline: "For boutique fashion labels and independent designers establishing their DTC storefront.",
    monthlyPrice: 490,
    annualPrice: 390,
    volume: "Up to 2,000 recommendations / mo",
    features: [
      "Drop-in Shopify Plus / 2.0 App Block",
      "Core 2D & 3D silhouette drape analysis",
      "Standard Dark & Light luxury theme presets",
      "Real-time return prevention dashboard",
      "Email & async developer support",
      "Sub-100ms global edge CDN",
    ],
    cta: "Start 14-Day Pilot",
    popular: false,
  },
  {
    name: "Growth Label",
    tagline: "For high-velocity DTC apparel brands scaling between $2M and $15M in annual GMV.",
    monthlyPrice: 1490,
    annualPrice: 1190,
    volume: "Up to 15,000 recommendations / mo",
    features: [
      "Everything in Emerging Atelier",
      "Headless SDK (Next.js, Hydrogen, Remix)",
      "Bespoke brand typography & CSS token mapping",
      "Garment pattern defect & batch deviation alerts",
      "Shopper fit memory & cross-device persistence",
      "Dedicated integration engineer & private Slack",
      "Bi-weekly margin recovery audit reports",
    ],
    cta: "Deploy Growth Suite",
    popular: true,
  },
  {
    name: "Enterprise House",
    tagline: "For multi-brand luxury conglomerates and global retail operations requiring custom SLAs.",
    monthlyPrice: 3800,
    annualPrice: 3100,
    volume: "Unlimited volume & custom throughput",
    features: [
      "Everything in Growth Label",
      "Custom drape engine trained on brand pattern library",
      "Multi-storefront, multi-region & multi-currency",
      "99.99% uptime SLA with dedicated infrastructure",
      "ERP & warehouse reverse logistics webhook sync",
      "Dedicated Retail Solutions Partner",
      "Enterprise SOC-2 Type II & GDPR compliance",
    ],
    cta: "Schedule Architecture Review",
    popular: false,
  },
];

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  return (
    <section id="pricing" className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
          Transparent Investment
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Recaptured margin that easily pays for itself
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Preventing just 40 returns per month covers your entire subscription. Zero hidden transaction cuts or gross margin surprises.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className="mt-8 inline-flex items-center p-1 rounded-xl border border-white/[0.1] bg-white/[0.03]">
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition cursor-pointer ${
              billingCycle === "annual"
                ? "bg-white text-black font-semibold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Annual Billing <span className="text-emerald-500 font-bold ml-1">Save 20%</span>
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-white text-black font-semibold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {TIERS.map((tier) => {
          const price = billingCycle === "annual" ? tier.annualPrice : tier.monthlyPrice;

          return (
            <div
              key={tier.name}
              className={`rounded-2xl border p-8 flex flex-col justify-between transition duration-200 relative ${
                tier.popular
                  ? "border-emerald-500/40 bg-[#12161F] shadow-[0_0_40px_rgba(16,185,129,0.08)]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-[#090A0D] text-[11px] font-mono font-semibold uppercase tracking-wider">
                  Recommended for Scaling DTC
                </div>
              )}

              <div>
                <h3 className="text-xl font-medium text-white">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-2 min-h-[36px]">{tier.tagline}</p>

                <div className="mt-6 pb-6 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold font-mono text-white">${price}</span>
                    <span className="text-slate-400 text-sm font-mono">/ month</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 mt-2">
                    {tier.volume}
                  </div>
                </div>

                <div className="mt-6 space-y-3.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                    Included Capabilities
                  </span>
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.08]">
                <Button
                  className={`w-full h-11 rounded-xl text-xs font-medium cursor-pointer transition ${
                    tier.popular
                      ? "bg-white hover:bg-slate-200 text-[#090A0D] font-semibold"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  onClick={() => {
                    document.getElementById("final-cta")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {tier.cta}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-6 rounded-2xl border border-white/[0.08] bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Need a customized pilot agreement with an explicit return reduction KPI guarantee?</span>
        </div>
        <button
          type="button"
          onClick={() => {
            document.getElementById("final-cta")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-white underline underline-offset-4 hover:text-slate-200 font-mono cursor-pointer"
        >
          Speak with Enterprise Solutions &rarr;
        </button>
      </div>
    </section>
  );
}

