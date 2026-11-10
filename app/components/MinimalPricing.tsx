"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMagnetic } from "@/components/navigation/use-magnetic";

interface MinimalPricingProps {
  onOpenPilotModal?: () => void;
}

function MagneticActionButton({
  label,
  variant = "primary",
  onClick,
}: {
  label: string;
  variant?: "primary" | "outline";
  onClick?: () => void;
}) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic({
    strength: 0.22,
    stiffness: 280,
    damping: 22,
  });

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block w-full sm:w-auto"
    >
      <Button
        onClick={onClick}
        variant={variant === "outline" ? "outline" : "default"}
        className={`w-full sm:w-auto h-13 px-8 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer group transition-all duration-200 active:scale-98 ${
          variant === "primary"
            ? "bg-[#0038FF] hover:bg-[#1A4CFF] text-white shadow-[0_0_24px_rgba(0,56,255,0.4)]"
            : "border-white/20 bg-black/40 text-white hover:bg-white/10"
        }`}
      >
        <span>{label}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
}

export function MinimalPricing({ onOpenPilotModal }: MinimalPricingProps) {
  const [hoveredPack, setHoveredPack] = useState<"starter" | "growth" | null>(null);

  return (
    <section
      id="scene-pricing"
      className="relative w-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden py-12 sm:py-16 select-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10 border-b border-white/[0.08] pb-6"
      >
        <div>
          <span className="font-mono text-xs text-[#0038FF] uppercase tracking-widest block mb-2 font-semibold">
            04 / TRANSPARENT PILOT PACKS
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif italic text-white tracking-tight">
            Fixed prepaid packs. Zero overages.
          </h2>
        </div>
        <div className="text-left md:text-right font-mono text-xs text-slate-400">
          <span className="text-[#0038FF]">●</span> Philippine Retail Pilot Economics
        </div>
      </motion.div>

      {/* Linked Cross-Highlighting Pricing Columns */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-stretch"
        onMouseLeave={() => setHoveredPack(null)}
      >
        {/* Pack 1: Starter Drop Pack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onMouseEnter={() => setHoveredPack("starter")}
          onFocus={() => setHoveredPack("starter")}
          data-cursor="₱499 PACK"
          className={`relative rounded-2xl border p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
            hoveredPack === "starter"
              ? "bg-[#111318] border-[#0038FF] shadow-[0_0_35px_rgba(0,56,255,0.3)] scale-[1.02] z-10 opacity-100"
              : hoveredPack === "growth"
              ? "border-white/[0.06] bg-transparent opacity-45 scale-[0.98]"
              : "border-white/[0.1] bg-black/20 opacity-90 hover:border-white/30"
          }`}
        >
          {hoveredPack === "starter" && (
            <>
              <span className="absolute top-2.5 left-3 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                ⌜
              </span>
              <span className="absolute top-2.5 right-3 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                ⌝
              </span>
              <span className="absolute bottom-2.5 left-3 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                ⌞
              </span>
              <span className="absolute bottom-2.5 right-3 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                ⌟
              </span>
            </>
          )}

          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold">
                STARTER DROP PACK
              </span>
              <span className="font-mono text-xs text-slate-500">₱9.98 / preview</span>
            </div>

            {/* Kinetic Typography Price Morph */}
            <div
              className={`font-mono text-5xl sm:text-6xl font-light tracking-tight mb-4 transition-all duration-300 ${
                hoveredPack === "starter" ? "text-stroke-highlight scale-105" : "text-white"
              }`}
            >
              ₱499
            </div>

            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              50 live 30-second previews. Designed for single-drop boutique collections and
              Instagram DM sales.
            </p>

            <ul className="space-y-3 font-mono text-xs text-slate-400 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#0038FF]" />
                <span>50 capped 30-second live previews</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#0038FF]" />
                <span>Zero auto-renewals or unexpected charges</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#0038FF]" />
                <span>Philippine DPA compliance disclaimer included</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/[0.08]">
            <MagneticActionButton
              label="Apply for Starter Pack"
              variant="outline"
              onClick={onOpenPilotModal}
            />
          </div>
        </motion.div>

        {/* Pack 2: Growth Boutique Pack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onMouseEnter={() => setHoveredPack("growth")}
          onFocus={() => setHoveredPack("growth")}
          data-cursor="₱1,799 PACK"
          className={`relative rounded-2xl border-2 p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
            hoveredPack === "growth"
              ? "bg-[#111318] border-[#0038FF] shadow-[0_0_40px_rgba(0,56,255,0.4)] scale-[1.02] z-10 opacity-100"
              : hoveredPack === "starter"
              ? "border-[#0038FF]/40 bg-transparent opacity-45 scale-[0.98]"
              : "border-[#0038FF]/80 bg-[#0038FF]/[0.03] opacity-95 hover:border-[#0038FF]"
          }`}
        >
          {hoveredPack === "growth" && (
            <>
              <span className="absolute top-2.5 left-3 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                ⌜
              </span>
              <span className="absolute top-2.5 right-3 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                ⌝
              </span>
              <span className="absolute bottom-2.5 left-3 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                ⌞
              </span>
              <span className="absolute bottom-2.5 right-3 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                ⌟
              </span>
            </>
          )}

          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#60A5FA] font-semibold flex items-center gap-2">
                <span>GROWTH BOUTIQUE PACK</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF] animate-pulse" />
              </span>
              <span className="font-mono text-xs text-slate-400">₱7.19 / preview</span>
            </div>

            {/* Kinetic Typography Price Morph */}
            <div
              className={`font-mono text-5xl sm:text-6xl font-light tracking-tight mb-4 transition-all duration-300 ${
                hoveredPack === "growth" ? "text-stroke-highlight scale-105" : "text-white"
              }`}
            >
              ₱1,799
            </div>

            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              250 live 30-second previews. For high-volume boutique labels handling daily DM
              inquiries and fittings.
            </p>

            <ul className="space-y-3 font-mono text-xs text-slate-400 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#0038FF]" />
                <span>250 capped 30-second live previews</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#0038FF]" />
                <span>Priority boutique onboarding & DM playbook</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#0038FF]" />
                <span>Direct size chart link integration</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/[0.08]">
            <MagneticActionButton
              label="Apply for Growth Pack"
              variant="primary"
              onClick={onOpenPilotModal}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
