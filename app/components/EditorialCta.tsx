"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMagnetic } from "@/components/navigation/use-magnetic";

interface EditorialCtaProps {
  onOpenPilotModal?: () => void;
}

function MagneticPilotCtaButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic({
    strength: 0.25,
    stiffness: 280,
    damping: 22,
  });

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="PILOT INTAKE"
      className="shrink-0"
    >
      <Button
        size="lg"
        onClick={onClick}
        className="h-14 px-8 bg-[#0038FF] hover:bg-[#1A4CFF] text-white font-mono text-xs uppercase tracking-wider rounded-xl transition duration-200 shadow-[0_0_30px_rgba(0,56,255,0.4)] flex items-center gap-3 cursor-pointer group active:scale-98"
      >
        <span>Apply for Brand Pilot</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
}

export function EditorialCta({ onOpenPilotModal }: EditorialCtaProps) {
  return (
    <section
      id="scene-intake"
      className="relative w-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden py-12 sm:py-16 select-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10"
      >
        <div className="max-w-2xl">
          <span className="font-mono text-xs text-[#0038FF] uppercase tracking-widest block mb-3 font-semibold">
            05 / CONTROLLED PILOT INTAKE
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif italic text-white tracking-tight leading-[1.05]">
            Accepting 3–5 Philippine boutique partners.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-slate-400 font-light leading-relaxed">
            FitCheck is onboarding high-intent Philippine fashion labels selling curated
            statement pieces via social channels. Zero tech integration or app setup required.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0038FF]" />
              <span>Philippine DPA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF]" />
              <span>Zero-Download Web Camera</span>
            </div>
          </div>
        </div>

        <MagneticPilotCtaButton onClick={onOpenPilotModal} />
      </motion.div>
    </section>
  );
}
