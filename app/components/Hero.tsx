"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onOpenPilotModal?: () => void;
}

export function Hero({ onOpenPilotModal }: HeroProps = {}) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Editorial Category Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.03] backdrop-blur-md mb-8"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
          Retail Infrastructure for Modern Apparel
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white max-w-5xl leading-[1.08]"
      >
        End sizing hesitation. <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500">
          Slash returns. Lift PDP conversion.
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed"
      >
        FitCheck AI embeds zero-latency virtual fitting and garment drape intelligence into your Shopify Plus or Headless storefront. Cut returns by up to 38% while elevating customer buying confidence.
      </motion.p>

      {/* Conversion Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
      >
        <Button
          size="lg"
          className="w-full sm:w-auto h-13 px-8 bg-white hover:bg-slate-200 text-[#090A0D] font-medium text-base rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,255,255,0.15)] cursor-pointer"
          onClick={() => {
            if (onOpenPilotModal) {
              onOpenPilotModal();
            } else {
              document.getElementById("interactive-demo")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <span>Try Interactive Sandbox</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto h-13 px-8 border-white/[0.14] hover:bg-white/[0.05] text-slate-200 font-medium text-base rounded-xl transition duration-200 cursor-pointer"
          onClick={() => {
            document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          View Enterprise Pricing
        </Button>
      </motion.div>

      {/* Micro Metrics Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 pt-8 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 w-full max-w-4xl text-left sm:text-center"
      >
        <div>
          <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tracking-tight">-38%</div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Size-Based Returns</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tracking-tight">+24%</div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">PDP Conversion Lift</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tracking-tight">&lt;85ms</div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Edge Latency</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tracking-tight">3-Line</div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Drop-in Integration</div>
        </div>
      </motion.div>
    </section>
  );
}

