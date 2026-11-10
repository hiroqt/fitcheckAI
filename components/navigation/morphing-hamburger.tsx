"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMagnetic } from "./use-magnetic";

interface MorphingHamburgerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function MorphingHamburger({
  isOpen,
  onToggle,
  className = "",
}: MorphingHamburgerProps) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic({
    strength: 0.3,
    stiffness: 300,
    damping: 24,
  });

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
      className={`pointer-events-auto relative group flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-xl border border-white/15 hover:border-[#0038FF]/60 text-white transition-colors duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.45)] cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] ${className}`}
      data-cursor={isOpen ? "CLOSE" : "MENU"}
    >
      {/* Background Pulse Glow on Hover */}
      <span className="absolute inset-0 rounded-full bg-[#0038FF]/0 group-hover:bg-[#0038FF]/10 transition-colors duration-300 pointer-events-none" />

      {/* Kinetic Text Label (Menu / Close) */}
      <div className="relative h-4 overflow-hidden w-12 font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close-label"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="absolute inset-0 flex items-center justify-start text-[#60A5FA]"
            >
              CLOSE
            </motion.span>
          ) : (
            <motion.span
              key="menu-label"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="absolute inset-0 flex items-center justify-start"
            >
              MENU
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* High-Performance Morphing SVG Icon */}
      <div className="relative w-6 h-6 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 overflow-visible"
        >
          {/* Top Line: Morphs into the diagonal (\) */}
          <motion.line
            x1="3"
            x2="21"
            y1="6"
            y2="6"
            animate={
              isOpen
                ? {
                    y1: 12,
                    y2: 12,
                    rotate: 45,
                    stroke: "#0038FF",
                  }
                : {
                    y1: 6,
                    y2: 6,
                    rotate: 0,
                    stroke: "#FFFFFF",
                  }
            }
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 26,
            }}
            style={{ originX: "50%", originY: "50%" }}
          />

          {/* Center Line: Shrinks and disappears with spring exit */}
          <motion.line
            x1="3"
            x2="21"
            y1="12"
            y2="12"
            animate={
              isOpen
                ? {
                    scaleX: 0,
                    opacity: 0,
                  }
                : {
                    scaleX: 1,
                    opacity: 1,
                    stroke: "#FFFFFF",
                  }
            }
            transition={{
              type: "spring",
              stiffness: 460,
              damping: 28,
            }}
            style={{ originX: "50%", originY: "50%" }}
          />

          {/* Bottom Line: Morphs into the diagonal (/) */}
          <motion.line
            x1="3"
            x2="21"
            y1="18"
            y2="18"
            animate={
              isOpen
                ? {
                    y1: 12,
                    y2: 12,
                    rotate: -45,
                    stroke: "#0038FF",
                  }
                : {
                    y1: 18,
                    y2: 18,
                    rotate: 0,
                    stroke: "#FFFFFF",
                  }
            }
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 26,
            }}
            style={{ originX: "50%", originY: "50%" }}
          />
        </svg>
      </div>
    </motion.button>
  );
}
