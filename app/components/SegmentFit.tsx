"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

const SEGMENTS = [
  {
    tier: "High Fit (100%)",
    name: "Higher-Margin Boutiques & Assisted Sales",
    badge: "Primary Target",
    badgeColor: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
    barWidth: "100%",
    barColor: "bg-[#10B981]",
    garments: "Tops, jackets, evening wear, modern barongs, curated dresses (₱1,800–₱6,500+)",
    channels: "Instagram DMs, TikTok consultation, private atelier appointments",
    rationale: "High contribution margin comfortably absorbs ₱90–₱100 preview cost. Resolving a single customer hesitation secures a substantial sale.",
    recommended: true,
  },
  {
    tier: "Medium Fit (70%)",
    name: "Growing D2C Labels with Repeat Shoppers",
    badge: "Secondary Target",
    badgeColor: "bg-[#0038FF]/15 text-[#60A5FA] border-[#0038FF]/30",
    barWidth: "70%",
    barColor: "bg-[#0038FF]",
    garments: "Seasonal capsule drops, artisanal linen, outerwear (₱1,200–₱2,800)",
    channels: "Shopify storefronts with active live chat, Viber communities",
    rationale: "Solid margins and strong repeat buyer loyalty. Useful for testing optional shopper-paid previews (₱99 or ₱149 credited to order).",
    recommended: false,
  },
  {
    tier: "Test First (50%)",
    name: "Larger Multi-Brand Department Merchants",
    badge: "Phase 5 Consideration",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    barWidth: "50%",
    barColor: "bg-amber-500",
    garments: "Diverse multi-category catalogs",
    channels: "Enterprise e-commerce needing ERP and reporting integrations",
    rationale: "Requires deep technical integration and centralized usage limits. Only suitable after controlled pilot unit economics are proven.",
    recommended: false,
  },
  {
    tier: "Low Fit (20% — Avoid)",
    name: "Low-Price Basics & Unrestricted Free Browsing",
    badge: "Do Not Deploy",
    badgeColor: "bg-red-500/15 text-red-400 border-red-500/30",
    barWidth: "20%",
    barColor: "bg-red-500",
    garments: "₱199–₱399 graphic tees, socks, daily basics",
    channels: "High-volume open storefront traffic without human assistance",
    rationale: "Negative unit economics: GPU generation cost (~₱37.80/preview) exceeds typical product contribution margin. High financial leakage risk.",
    recommended: false,
  },
];

export function SegmentFit() {
  return (
    <section id="target-segments" className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="max-w-3xl mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
          Who should (and should not) buy FitCheck
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
          FitCheck is intentionally engineered for brands with sufficient product contribution margin to justify paid visual previews. Here is our strategic prioritization from internal source documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.tier}
            className={`rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-all ${
              seg.recommended
                ? "bg-[#0E1322] border-[#0038FF] shadow-[0_0_24px_rgba(0,56,255,0.2)]"
                : "bg-[#111318] border-white/[0.08]"
            }`}
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${seg.badgeColor}`}>
                  {seg.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">{seg.tier}</span>
              </div>

              {/* Strategic Fit Bar */}
              <div className="w-full h-1.5 rounded-full bg-white/[0.06] mb-5 overflow-hidden">
                <div className={`h-full rounded-full ${seg.barColor}`} style={{ width: seg.barWidth }} />
              </div>

              <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
                {seg.name}
              </h3>

              <div className="space-y-3 my-4 text-xs">
                <div>
                  <span className="text-slate-400 font-mono block">Garment Focus:</span>
                  <span className="text-slate-200">{seg.garments}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono block">Sales Workflow:</span>
                  <span className="text-slate-200">{seg.channels}</span>
                </div>
                <div className="pt-2 border-t border-white/[0.06]">
                  <span className="text-slate-400 font-mono block mb-1">Economic Rationale:</span>
                  <p className="text-slate-300 leading-relaxed">{seg.rationale}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className={seg.recommended ? "text-[#60A5FA]" : "text-slate-400"}>
                {seg.recommended ? "Primary Pilot Candidate" : "Secondary or Restricted"}
              </span>
              {seg.recommended ? (
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              ) : (
                <span className="text-slate-400">§03 Strategy</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
