"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080B] py-16 px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0038FF] flex items-center justify-center text-white text-xs font-bold shadow-[0_0_12px_rgba(0,56,255,0.4)]">
              FC
            </div>
            <div>
              <span className="font-sans font-bold tracking-tight text-white text-sm">
                FitCheck
              </span>
              <span className="ml-2 text-[10px] font-mono text-slate-400">
                • “See it on you.”
              </span>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Controlled Philippine Clothing Brand Pilot • Manila, PH
          </div>
        </div>

        {/* Legal & Mandatory Disclaimers */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0E1015] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#0038FF]" />
            <span>Official Legal & Product Boundary Disclaimers</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            FitCheck provides an illustrative visual style preview. Results may vary and do not guarantee physical sizing, material behavior, or garment fit. FitCheck is not a sizing guarantee, fabric simulation, or promise of fewer returns. All sizing decisions must be verified on the seller&apos;s physical measurement size chart.
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Data Privacy Act of 2012 (RA 10173): FitCheck requires explicit camera consent before each session. Audio is permanently disabled. Live video streams are processed temporarily on cloud infrastructure to generate the 30-second moving style preview and are not stored as identifiable shopper biometrics.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-[11px] font-mono text-slate-400">
          <div>© 2026 FitCheck. Strategy & Pilot Planning Release.</div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="#assisted-flow" className="hover:text-white transition">Assisted Flow</a>
            <a href="#mirror-demo" className="hover:text-white transition">Live Mirror</a>
            <a href="#target-segments" className="hover:text-white transition">Brand Fit</a>
            <a href="#pricing" className="hover:text-white transition">Pilot Pricing (₱)</a>
            <a href="#trust-guardrails" className="hover:text-white transition">Privacy & DPA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
