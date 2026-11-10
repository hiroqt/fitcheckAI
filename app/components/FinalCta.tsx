"use client";

import React, { useActionState } from "react";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitDemoRequest, DemoRequestState } from "@/app/lib/actions";

const initialState: DemoRequestState = {
  success: false,
  message: "",
};

interface FinalCtaProps {
  onOpenPilotModal?: () => void;
}

export function FinalCta({ onOpenPilotModal }: FinalCtaProps = {}) {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, initialState);
  void onOpenPilotModal;

  return (
    <section id="final-cta" className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="rounded-3xl border border-white/[0.12] bg-gradient-to-b from-[#141822] via-[#0E1118] to-[#090A0D] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
        {/* Subtle architectural accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Pilot Admissions Open Q4
            </div>

            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Ready to recover your apparel margins?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Join leading fashion brands using FitCheck AI to protect brand equity, eliminate sizing bracket orders, and lift checkout conversion.
            </p>

            <div className="space-y-3 pt-4 border-t border-white/[0.08] text-sm text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>14-day risk-free storefront pilot</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dedicated e-commerce solutions engineer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Custom pattern spec sheet ingestion</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Form */}
          <div className="lg:col-span-6 rounded-2xl border border-white/[0.1] bg-[#0E1015]/90 p-6 sm:p-8 backdrop-blur-xl">
            {state.success ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium text-white">Pilot Request Received</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {state.message}
                </p>
                <div className="pt-4">
                  <span className="text-xs font-mono text-slate-400">
                    A dedicated retail partner will prepare your brand sandbox within 2 hours.
                  </span>
                </div>
              </div>
            ) : (
              <form action={formAction} className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Request Sandbox Access</h3>
                  <p className="text-xs text-slate-400">
                    Receive your customized brand widget preview & sizing ROI model.
                  </p>
                </div>

                {state.message && !state.success && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                    {state.message}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Business Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="founder@yourfashionbrand.com"
                    className="w-full h-11 px-3.5 rounded-lg border border-white/[0.12] bg-white/[0.03] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
                  />
                  {state.errors?.email && (
                    <p className="text-xs text-red-400 mt-1">{state.errors.email[0]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                      Brand / Label Name
                    </label>
                    <input
                      type="text"
                      name="brandName"
                      required
                      placeholder="e.g. Atelier Noir"
                      className="w-full h-11 px-3.5 rounded-lg border border-white/[0.12] bg-white/[0.03] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
                    />
                    {state.errors?.brandName && (
                      <p className="text-xs text-red-400 mt-1">{state.errors.brandName[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                      Store URL
                    </label>
                    <input
                      type="text"
                      name="storeUrl"
                      placeholder="e.g. yourbrand.com"
                      className="w-full h-11 px-3.5 rounded-lg border border-white/[0.12] bg-white/[0.03] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Annual E-Commerce Apparel GMV
                  </label>
                  <select
                    name="annualRevenue"
                    className="w-full h-11 px-3 rounded-lg border border-white/[0.12] bg-[#141720] text-white text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition cursor-pointer"
                  >
                    <option value="under-1m">&lt; $1,000,000 GMV</option>
                    <option value="1m-5m">$1,000,000 – $5,000,000 GMV</option>
                    <option value="5m-20m">$5,000,000 – $20,000,000 GMV</option>
                    <option value="20m-plus">$20,000,000+ GMV (Enterprise)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 bg-white hover:bg-slate-200 text-[#090A0D] font-medium text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2 transition"
                >
                  {isPending ? (
                    <span>Allocating Sandbox Environment...</span>
                  ) : (
                    <>
                      <span>Initialize 14-Day Free Pilot</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-mono text-slate-400">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Zero credit card required. Encrypted & GDPR compliant.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

