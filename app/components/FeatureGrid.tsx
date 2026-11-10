"use client";

import React from "react";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { Cpu, Gauge, LineChart, Code2 } from "lucide-react";

export function FeatureGrid() {
  return (
    <section className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
          Core Capabilities
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Engineered for luxury standards. <br />
          Built for high-volume scale.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Everything you need to eliminate sizing friction without diluting brand aesthetics or degrading page speed.
        </p>
      </div>

      <BentoGrid className="lg:grid-rows-2">
        {/* Card 1 - Millimeter Drape Simulation (Span 2 cols) */}
        <BentoCard
          className="md:col-span-2 min-h-[300px]"
          title="Millimeter-Precision Drape Simulation"
          description="Incorporate garment-specific fabric stretch coefficients, GSM weight, and actual seam measurements to accurately predict drape across shoulders, chest, and hips."
          badge="Inference V2"
          icon={<Cpu className="w-5 h-5 text-emerald-400" />}
          header={
            <div className="h-44 w-full rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] p-4 flex flex-col justify-between font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>PATTERN MAP #8841-A</span>
                <span className="text-emerald-400 font-semibold">TENSION: 0.14 N/cm²</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center my-auto">
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">CHEST EASE</span>
                  <span className="text-white font-semibold">+4.2 cm</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">SHOULDER DROP</span>
                  <span className="text-white font-semibold">2.1 cm</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">TORSO DRAPE</span>
                  <span className="text-white font-semibold">Neutral Flow</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                Predicts zero neckline gapping and optimal sleeve cuff resting point.
              </div>
            </div>
          }
        />

        {/* Card 2 - Zero Speed Penalty */}
        <BentoCard
          className="md:col-span-1 min-h-[300px]"
          title="Zero Performance Penalty"
          description="Sub-15kb gzipped footprint, asynchronous tree-shaking, and 0.00 Cumulative Layout Shift (CLS). Keeps your Google Lighthouse score pristine."
          badge="&lt;15KB BUNDLE"
          icon={<Gauge className="w-5 h-5 text-indigo-400" />}
          header={
            <div className="h-44 w-full rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] p-4 flex flex-col justify-center items-center">
              <div className="text-5xl font-mono font-semibold text-white tracking-tighter">
                100<span className="text-emerald-400 text-3xl">/100</span>
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-2">
                Lighthouse Performance
              </p>
              <div className="flex items-center gap-2 mt-3 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>0.00 CLS • 42ms TBT</span>
              </div>
            </div>
          }
        />

        {/* Card 3 - 3-Line Drop-In SDK */}
        <BentoCard
          className="md:col-span-1 min-h-[300px]"
          title="3-Line Universal Embed"
          description="Works out-of-the-box with Shopify App Blocks, Hydrogen, Next.js Commerce, BigCommerce, or standard custom headless storefronts."
          badge="ZERO REFACTOR"
          icon={<Code2 className="w-5 h-5 text-slate-300" />}
          header={
            <div className="h-44 w-full rounded-xl bg-black/50 border border-white/[0.06] p-3 font-mono text-[11px] text-slate-300 flex flex-col justify-center space-y-1 overflow-hidden">
              <span className="text-slate-400">&lt;!-- Shopify Liquid / Next.js --&gt;</span>
              <span className="text-indigo-300">&lt;script src=&quot;https://cdn.fitcheck.ai/v1.js&quot;&gt;&lt;/script&gt;</span>
              <span className="text-white">&lt;fitcheck-pdp</span>
              <span className="text-emerald-300 pl-4">brand-key=&quot;pk_live_89a...&quot;</span>
              <span className="text-emerald-300 pl-4">sku=&quot;{`{{ product.selected_or_first_available_variant.sku }}`}&quot;</span>
              <span className="text-white">&gt;&lt;/fitcheck-pdp&gt;</span>
            </div>
          }
        />

        {/* Card 4 - Real-time Margin & Return Telemetry (Span 2 cols) */}
        <BentoCard
          className="md:col-span-2 min-h-[300px]"
          title="Direct Return Telemetry & SKU Diagnostics"
          description="Instantly uncover which product patterns run small or have inconsistent shoulder grading. Flag supplier manufacturing anomalies before they hurt brand trust."
          badge="MERCHANT ANALYTICS"
          icon={<LineChart className="w-5 h-5 text-emerald-400" />}
          header={
            <div className="h-44 w-full rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] p-4 flex flex-col justify-between font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400 border-b border-white/[0.06] pb-2">
                <span>SKU HEALTH TELEMETRY</span>
                <span className="text-slate-300">REAL-TIME SYNC</span>
              </div>
              <div className="space-y-2 my-auto">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Heavy Twill Trench (#TT-02)</span>
                  <span className="text-emerald-400">-44% Returns (Size L Recalibrated)</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[82%]" />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Raw Selvedge Denim (#SD-14)</span>
                  <span className="text-emerald-400">-36% Returns (True Waist Match)</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[74%]" />
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                Automated alerts triggered when an offshore batch deviates &gt;0.5cm from spec sheet.
              </div>
            </div>
          }
        />
      </BentoGrid>
    </section>
  );
}

