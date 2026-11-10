"use client";

import React from "react";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";

export function ArchitectureBento() {
  return (
    <section
      id="scene-specs"
      className="relative w-full py-12 sm:py-16 px-4 sm:px-8 lg:px-12 z-20 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Minimal Header */}
        <div className="flex items-center justify-between pb-4 mb-8 sm:mb-10 border-b border-white/[0.12]">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#60A5FA]">
            <span className="w-2 h-2 rounded-full bg-[#0038FF] animate-pulse" />
            <span>03 // TELEMETRY</span>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
            SYSTEM METRICS
          </div>
        </div>

        {/* Text-Only Grid: No cards, raw typography sliding in from sides */}
        <BentoGrid className="gap-6 sm:gap-8 lg:gap-10">
          {/* Item 1: Slides from Left */}
          <BentoCard
            variant="text"
            colSpan="lg:col-span-7"
            direction="left"
            delay={0.05}
            indexCode="01 // SPEED"
            tag="60 FPS"
            metric="0.84s"
            label="BROWSER MIRROR"
          />

          {/* Item 2: Slides from Right */}
          <BentoCard
            variant="text"
            colSpan="lg:col-span-5"
            direction="right"
            delay={0.1}
            indexCode="02 // PRIVACY"
            tag="RA 10173"
            metric="0 B"
            label="SAVED BIOMETRICS"
          />

          {/* Item 3: Slides from Left */}
          <BentoCard
            variant="text"
            colSpan="lg:col-span-4"
            direction="left"
            delay={0.15}
            indexCode="03 // SOCIAL"
            tag="DM COMMERCE"
            metric="+34%"
            label="DM CLOSE RATE"
          />

          {/* Item 4: Slides up from Bottom */}
          <BentoCard
            variant="text"
            colSpan="lg:col-span-4"
            direction="bottom"
            delay={0.2}
            indexCode="04 // SIZE"
            tag="0.00 CLS"
            metric="14.2 KB"
            label="SDK PAYLOAD"
          />

          {/* Item 5: Slides from Right */}
          <BentoCard
            variant="text"
            colSpan="lg:col-span-4"
            direction="right"
            delay={0.25}
            indexCode="05 // COST"
            tag="PREPAID"
            metric="₱499"
            label="STARTER PACK"
          />
        </BentoGrid>
      </div>
    </section>
  );
}
