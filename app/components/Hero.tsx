"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onOpenPilotModal?: () => void;
}

export function Hero({ onOpenPilotModal }: HeroProps = {}) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Official Tagline & Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-5xl leading-[1.04]"
      >
        See it on you.
      </motion.h1>

      {/* Subheading from Strategy Document */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-6 text-xl sm:text-2xl lg:text-3xl font-medium text-slate-200 max-w-3xl leading-snug tracking-tight"
      >
        The live style mirror in your browser.
      </motion.p>

      {/* Seller Pitch & Pilot Scope */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed"
      >
        FitCheck helps high-intent shoppers preview how a selected garment looks on them while moving—before purchasing. We are accepting 3–5 approved Philippine fashion brands for a controlled, seller-assisted pilot.
      </motion.p>

      {/* Mandatory Scope Boundary Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.1] bg-[#111318] text-xs text-slate-300 font-mono"
      >
        <span className="w-2 h-2 rounded-full bg-[#0038FF]" />
        <span>A visual inspiration & decision aid — not a sizing guarantee or fabric simulation.</span>
      </motion.div>

      {/* Conversion Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
      >
        <Button
          size="lg"
          onClick={() => {
            if (onOpenPilotModal) {
              onOpenPilotModal();
            } else {
              scrollTo("pilot-intake");
            }
          }}
          className="w-full sm:w-auto h-13 px-8 bg-[#0038FF] hover:bg-[#1A4CFF] text-white font-medium text-base rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(0,56,255,0.4)] cursor-pointer"
        >
          <span>Apply for Philippine Brand Pilot</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto h-13 px-8 border-white/[0.14] bg-[#111318] hover:bg-white/[0.06] text-slate-200 font-medium text-base rounded-xl transition duration-200 cursor-pointer flex items-center gap-2"
          onClick={() => scrollTo("mirror-demo")}
        >
          <Eye className="w-4 h-4 text-[#0038FF]" />
          <span>Try 30-Sec Mirror Simulator</span>
        </Button>
      </motion.div>

      {/* Honest Micro-Metrics Strip (Philippine Pilot Parameters) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 pt-8 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 w-full max-w-4xl text-left sm:text-center"
      >
        <div>
          <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tracking-tight tabular-nums">
            30 Sec
          </div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">
            Capped Previews
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tracking-tight tabular-nums">
            ₱499
          </div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">
            Prepaid Pilot Pack (5x)
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tracking-tight tabular-nums">
            0 App
          </div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">
            Runs in Browser Link
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tracking-tight tabular-nums">
            RA 10173
          </div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">
            Data Privacy Act Compliant
          </div>
        </div>
      </motion.div>
    </section>
  );
}
