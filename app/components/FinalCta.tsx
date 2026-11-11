"use client";

import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinalCtaProps {
  onOpenPilotModal?: () => void;
}

export function FinalCta({ onOpenPilotModal }: FinalCtaProps = {}) {
  return (
    <section id="pilot-intake" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Center Aligned Section Header & Badge */}
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full border border-[#0038FF]/30 bg-[#0038FF]/10 text-[#60A5FA] text-xs font-mono uppercase tracking-wider mb-4 mx-auto text-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF] animate-pulse" />
          <span>Controlled Philippine Pilot (3–5 Brands)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight text-balance text-center">
          Test live moving style previews with your high-intent shoppers
        </h2>
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed text-balance max-w-2xl mx-auto text-center">
          We are inviting 3–5 Philippine clothing brands to evaluate 30-second live mirror sessions in their assisted sales workflows before broader release.
        </p>
      </div>

      <div className="rounded-3xl border border-white/[0.12] bg-[#0E121E] p-6 sm:p-10 lg:p-16 relative overflow-hidden shadow-2xl">
        {/* Subtle royal cobalt accent edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0038FF] to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Pilot Invitation */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white leading-snug">
              Guaranteed pilot safeguards & transparent billing
            </h3>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>Fixed prepaid allowances (₱499 and ₱1,799 packs) — zero automatic renewal traps</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>Supervised 20-second test preview before committing to any paid pack</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>Anonymous shopper outcome tracking & incremental contribution review</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Button
                size="lg"
                onClick={() => {
                  if (onOpenPilotModal) {
                    onOpenPilotModal();
                  }
                }}
                className="w-full sm:w-auto h-12 px-8 bg-[#0038FF] hover:bg-[#1A4CFF] text-white font-medium text-sm rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(0,56,255,0.4)] cursor-pointer"
              >
                <span>Submit Brand for Pilot Approval</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Column: Pilot Qualification Box */}
          <div className="lg:col-span-5 bg-[#090B10] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono uppercase tracking-wider text-white">
              <ShieldCheck className="w-4 h-4 text-[#0038FF]" />
              <span>Pilot Intake Criteria</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="font-semibold text-white mb-0.5">1. Higher-Margin Garments</div>
                <div className="text-slate-400">Targeting curated dresses, tops, jackets, and barongs with AOV &gt; ₱1,200.</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="font-semibold text-white mb-0.5">2. Assisted Sales Workflow</div>
                <div className="text-slate-400">Active customer conversations on Instagram DMs, Viber, or scheduled fittings.</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="font-semibold text-white mb-0.5">3. Transparent Shopper Guidance</div>
                <div className="text-slate-400">Commitment to disclaiming that mirror previews are illustrative style aids, not size guarantees.</div>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-white/[0.06]">
              <span>Location: Metro Manila / PH</span>
              <span>Slots: 3–5 Brands Max</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}