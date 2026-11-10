"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity } from "framer-motion";

interface ScrollHorizontalTickerProps {
  row1Text?: string[];
  row2Text?: string[];
  className?: string;
}

const DEFAULT_ROW_1 = [
  "SEE IT ON YOU",
  "ZERO APP DOWNLOAD",
  "30-SECOND MOVING MIRROR",
  "CURATED PHILIPPINE FASHION",
  "SEE IT ON YOU",
  "ZERO APP DOWNLOAD",
];

const DEFAULT_ROW_2 = [
  "INSTAGRAM DM SALES",
  "₱499 FIXED PILOT",
  "REPUBLIC ACT 10173",
  "AUDIO DISABLED",
  "INSTAGRAM DM SALES",
  "₱499 FIXED PILOT",
];

export function ScrollHorizontalTicker({
  row1Text = DEFAULT_ROW_1,
  row2Text = DEFAULT_ROW_2,
  className = "",
}: ScrollHorizontalTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Dual opposing horizontal scroll tracks
  // Row 1 drifts left as user scrolls down
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  // Row 2 drifts right as user scrolls down
  const x2 = useTransform(scrollYProgress, [0, 1], ["-35%", "0%"]);

  const smoothX1 = useSpring(x1, { damping: 25, stiffness: 90 });
  const smoothX2 = useSpring(x2, { damping: 25, stiffness: 90 });

  return (
    <div
      ref={containerRef}
      className={`relative w-full py-6 sm:py-8 overflow-hidden select-none pointer-events-none z-10 ${className}`}
    >
      {/* Subtle border framing */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Row 1: Massive Italic Serif & Clean Sans (Drifts Left) */}
      <motion.div
        style={{ x: smoothX1 }}
        className="flex items-center gap-8 whitespace-nowrap will-change-transform mb-4 sm:mb-6"
      >
        {row1Text.concat(row1Text).map((phrase, i) => (
          <div key={`r1-${i}`} className="flex items-center gap-8 shrink-0">
            <span
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase ${
                i % 2 === 0
                  ? "font-serif italic text-white/80 font-normal lowercase tracking-normal"
                  : "font-sans font-bold text-transparent stroke-text"
              }`}
              style={{
                WebkitTextStroke: i % 2 !== 0 ? "1px rgba(255, 255, 255, 0.35)" : undefined,
              }}
            >
              {phrase}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0038FF] shrink-0" />
          </div>
        ))}
      </motion.div>

      {/* Row 2: Opposing Direction Monospace & Outline (Drifts Right) */}
      <motion.div
        style={{ x: smoothX2 }}
        className="flex items-center gap-8 whitespace-nowrap will-change-transform"
      >
        {row2Text.concat(row2Text).map((phrase, i) => (
          <div key={`r2-${i}`} className="flex items-center gap-8 shrink-0">
            <span
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase ${
                i % 2 === 1
                  ? "font-serif italic text-[#0038FF] font-normal lowercase"
                  : "font-mono font-light text-white/40"
              }`}
            >
              {phrase}
            </span>
            <span className="font-mono text-xs text-white/30 shrink-0">⌜ ⌟</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
