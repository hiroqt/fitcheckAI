"use client";

import React from "react";
import { XCircle, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export function ProblemSolution() {
  return (
    <section className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
          Margin Preservation Engine
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Why apparel brands bleed 30% margin on sizing guesswork
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Static size charts haven&apos;t evolved in 25 years. Shoppers bracket purchases, shipping costs compound, and returns destroy unit economics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* The Incumbent Problem */}
        <div className="rounded-2xl border border-red-500/20 bg-red-950/[0.05] p-8 lg:p-10 relative overflow-hidden">
          <div className="flex items-center justify-between pb-6 border-b border-red-500/15 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">The Incumbent Experience</h3>
                <p className="text-xs font-mono text-red-400/80">Static Charts & High Returns</p>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              Legacy Approach
            </span>
          </div>

          <ul className="space-y-5 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Aggressive Cart Abandonment:</span> 58% of apparel shoppers bounce from the PDP because they are unsure how the fabric fits their silhouette.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Costly Size &quot;Bracketing&quot;:</span> Customers purchase sizes M, L, and XL with explicit intent to return two, multiplying reverse shipping and warehouse re-bagging costs.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Clunky Popups:</span> Rigid PDF modals and confusing chest/waist tables break mobile checkout momentum and kill site speed.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Eroded Brand Equity:</span> Disappointed customers receiving ill-fitting garments rarely order a second time.
              </div>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-red-500/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Average return rate:</span>
            <span className="text-red-400 font-semibold">32% - 41% of orders</span>
          </div>
        </div>

        {/* The FitCheck AI Solution */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/[0.08] p-8 lg:p-10 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.05)]">
          <div className="flex items-center justify-between pb-6 border-b border-emerald-500/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">The FitCheck AI Integration</h3>
                <p className="text-xs font-mono text-emerald-400/90">Editorial Sizing Intelligence</p>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Modern Standard
            </span>
          </div>

          <ul className="space-y-5 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Zero-Hesitation Add-to-Cart:</span> Instant recommendation badge renders directly above size selector with 99.2% fit confidence.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Millimeter Drape Simulation:</span> Predicts garment tension across chest, shoulder, waist, and length based on actual pattern cut data.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Sub-100ms Native Feel:</span> Lightweight headless script loads asynchronously with zero cumulative layout shift (CLS).
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Measurable Bottom-Line ROI:</span> Merchants recapture up to $42,000 per $1M GMV in avoided reverse logistics and restock fees.
              </div>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-emerald-500/15 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Average return reduction:</span>
            <span className="text-emerald-400 font-semibold">-38% net returns</span>
          </div>
        </div>
      </div>
    </section>
  );
}

