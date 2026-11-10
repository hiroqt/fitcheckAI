"use client";

import React from "react";
import { Check, X, ShieldAlert, ShieldCheck } from "lucide-react";

export function TrustGuardrails() {
  return (
    <section id="trust-guardrails" className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="max-w-3xl mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
          Trust guardrails and Philippine Data Privacy compliance
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
          E-commerce shoppers trust brands that respect their privacy. We enforce clear legal guardrails and transparent disclosures before any camera session begins.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Required Safeguards Column */}
        <div className="rounded-2xl border border-[#10B981]/20 bg-[#10B981]/[0.03] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-[#10B981]/15 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  What FitCheck Strictly Enforces
                </h3>
                <span className="text-xs font-mono text-[#10B981]">Mandatory Pilot Standards</span>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Explicit Camera Consent: </span>
                  Shoppers must affirmatively opt in to video capture before any browser preview starts.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Third-Party Processing Disclosure: </span>
                  We transparently disclose that video frames are processed in cloud GPU clusters in real time.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Microphone Strictly Disabled: </span>
                  Audio is permanently turned off. No sound or conversational data is ever accessed.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Technical Failure Credit Policy: </span>
                  If a session fails due to network dropouts or model timeouts, the preview credit is refunded instantly to the seller pack.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Philippine Data Privacy Act (RA 10173): </span>
                  Adheres to National Privacy Commission (NPC) data minimization and retention principles.
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-[#10B981]/15 text-[11px] font-mono text-[#10B981]">
            Source: Section 10 Privacy & Guardrail Protocol
          </div>
        </div>

        {/* Prohibitions Column */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-red-500/15 mb-6">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  What FitCheck Never Does
                </h3>
                <span className="text-xs font-mono text-red-400">Absolute Prohibitions</span>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">No False &quot;On-Device&quot; Claims: </span>
                  We never deceive brands by claiming cloud generative inference is fully on-device.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">No Guaranteed Sizing or Fit: </span>
                  We never claim the mirror acts as a digital tape measure or guarantees physical sizing.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">No Unverified Return Reductions: </span>
                  We never make unbacked claims that our tool slashes returns by arbitrary percentages without verified pilot data.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">No Stealth Video Recording: </span>
                  No camera stream is ever initiated in the background without clear viewfinder UI.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">No Unverified Competitor Slander: </span>
                  We respect local peers (Sukat, HoloBox, Shopee) and require verified data before making comparisons.
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-red-500/15 text-[11px] font-mono text-red-400">
            Source: Section 13 Claims & Validation Register
          </div>
        </div>
      </div>
    </section>
  );
}
