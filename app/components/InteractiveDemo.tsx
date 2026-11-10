"use client";

import React, { useState } from "react";
import { Sparkles, SlidersHorizontal, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InteractiveDemo() {
  const [height, setHeight] = useState(180); // cm
  const [weight, setWeight] = useState(78); // kg
  const [fitPreference, setFitPreference] = useState<"fitted" | "regular" | "oversized">("regular");

  // Dynamic calculation for recommendation
  const calculateRecommendation = () => {
    let size = "M";
    let confidence = 98;
    let drape = "Relaxed drape, sits square on shoulders with 2.2\" chest ease.";

    if (height > 185 || weight > 84) {
      size = fitPreference === "fitted" ? "L" : "XL";
      confidence = 96;
      drape = "Length hits mid-hip; shoulder drop calibrated for structured streetwear drape.";
    } else if (height >= 176 && height <= 185) {
      if (fitPreference === "oversized") size = "XL";
      else if (fitPreference === "fitted") size = "M";
      else size = "L";
      confidence = 99;
      drape = "Natural silhouette. Fabric falls cleanly without tension pulling at chest seams.";
    } else {
      if (fitPreference === "oversized") size = "L";
      else if (fitPreference === "fitted") size = "S";
      else size = "M";
      confidence = 97;
      drape = "Ideal proportions for contemporary tailoring. Sleeve length rests cleanly at wrist.";
    }

    return { size, confidence, drape };
  };

  const rec = calculateRecommendation();

  return (
    <section id="interactive-demo" className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
          Live Storefront Sandbox
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Experience the embedded PDP widget
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Test the exact micro-interaction your shoppers experience. Adjust customer biometric inputs below to observe real-time size computation and drape telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mock E-commerce PDP Interface */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.12] bg-[#101217] p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs font-mono text-slate-400">store.atelier-etoile.com/products/heavyweight-overshirt</span>
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest hidden sm:inline-block">Shopify Plus Storefront</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Mock Product Photography / Silhouette */}
            <div className="rounded-xl border border-white/[0.06] bg-[#161920] p-6 flex flex-col items-center justify-between min-h-[360px] relative overflow-hidden">
              <div className="w-full flex justify-between items-center text-xs font-mono text-slate-400">
                <span>SKU: AT-9022</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> In Stock
                </span>
              </div>

              {/* Minimalist Architectural Garment Wireframe representation */}
              <div className="relative my-auto flex flex-col items-center justify-center">
                <svg className="w-44 h-52 text-slate-200 stroke-current fill-none stroke-[1.2]" viewBox="0 0 100 120">
                  {/* Modern Tailored Overshirt / Jacket Line Art */}
                  <path d="M35 15 L50 25 L65 15 L85 35 L75 48 L68 42 L70 105 L30 105 L32 42 L25 48 L15 35 Z" />
                  <line x1="50" y1="25" x2="50" y2="105" strokeDasharray="2 2" stroke="rgba(255,255,255,0.4)" />
                  <path d="M38 45 L62 45" stroke="rgba(255,255,255,0.3)" />
                  <circle cx="50" cy="50" r="1.5" fill="currentColor" />
                  <circle cx="50" cy="65" r="1.5" fill="currentColor" />
                  <circle cx="50" cy="80" r="1.5" fill="currentColor" />
                </svg>

                <div className="absolute bottom-0 text-center">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                    480 GSM Heavy French Terry
                  </span>
                </div>
              </div>

              <div className="w-full flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-white/[0.06]">
                <span>Color: Raw Obsidian</span>
                <span className="font-mono text-white font-medium">$290 USD</span>
              </div>
            </div>

            {/* Product Options & Integrated FitCheck AI Widget */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-medium text-white tracking-tight">Structured Wool Overshirt</h3>
                <p className="text-sm text-slate-400 mt-1">Pre-washed virgin wool & cashgora blend.</p>

                {/* SIZES */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono uppercase tracking-wider text-slate-300">Select Size</span>
                    <span className="text-slate-400">Standard EU/US Fit</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {["S", "M", "L", "XL"].map((s) => {
                      const isRecommended = rec.size === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          className={`py-2.5 rounded-lg border text-sm font-medium transition duration-150 relative cursor-pointer ${
                            isRecommended
                              ? "border-emerald-400 bg-emerald-500/10 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                              : "border-white/[0.1] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200"
                          }`}
                        >
                          {s}
                          {isRecommended && (
                            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-black font-bold">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* THE FITCHECK AI NATIVE PDP WIDGET EMBED */}
                <div className="mt-5 p-4 rounded-xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-white">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>FitCheck AI Recommendation</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {rec.confidence}% Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Recommended: <strong className="text-white">Size {rec.size}</strong>. {rec.drape}
                  </p>
                </div>
              </div>

              {/* Add to Cart Simulation */}
              <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <Button className="w-full h-12 bg-white hover:bg-slate-200 text-[#090A0D] font-medium text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Size {rec.size} to Bag</span>
                </Button>
                <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-slate-400 font-mono">
                  <span>Free Global Shipping</span>
                  <span>•</span>
                  <span>Zero-Hassle Exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry & Merchant Controls */}
        <div className="lg:col-span-5 rounded-2xl border border-white/[0.1] bg-[#12151D] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-white/[0.08] mb-6">
              <SlidersHorizontal className="w-4 h-4 text-slate-300" />
              <h3 className="text-sm font-mono uppercase tracking-wider text-white">Shopper Biometrics Control</h3>
            </div>

            {/* Height slider */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Customer Height</span>
                <span className="font-mono text-white bg-white/[0.05] px-2 py-1 rounded border border-white/[0.08]">
                  {height} cm ({Math.floor(height / 30.48)}&apos;{Math.round((height % 30.48) / 2.54)}&quot;)
                </span>
              </div>
              <input
                type="range"
                min="160"
                max="200"
                value={height}
                onChange={(e) => {
                  setHeight(Number(e.target.value));
                }}
                className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Weight slider */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Customer Weight</span>
                <span className="font-mono text-white bg-white/[0.05] px-2 py-1 rounded border border-white/[0.08]">
                  {weight} kg ({Math.round(weight * 2.20462)} lbs)
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="110"
                value={weight}
                onChange={(e) => {
                  setWeight(Number(e.target.value));
                }}
                className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Drape Preference buttons */}
            <div className="space-y-2 mb-8">
              <label className="text-xs text-slate-300 font-medium block">Garment Drape Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {(["fitted", "regular", "oversized"] as const).map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => {
                      setFitPreference(pref);
                    }}
                    className={`py-2 text-xs font-mono capitalize rounded-lg border transition cursor-pointer ${
                      fitPreference === pref
                        ? "border-white bg-white text-black font-semibold"
                        : "border-white/[0.1] bg-white/[0.03] text-slate-400 hover:text-white"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time telemetry readouts */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-black/40 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Inference Latency:</span>
              <span className="text-emerald-400 font-semibold">38ms (Edge Cache)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Calculated Return Probability:</span>
              <span className="text-emerald-400 font-semibold">2.8% (Down from 31%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Margin Preserved this SKU:</span>
              <span className="text-white font-semibold">+$34.80 net</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

