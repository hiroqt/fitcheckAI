"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { NavMenuItem } from "./types";
import { useMagnetic } from "./use-magnetic";

interface MenuLinkItemProps {
  item: NavMenuItem;
  index: number;
  isActive: boolean;
  onHover: (item: NavMenuItem) => void;
  onSelect: (id: string) => void;
}

export const linkItemVariants: Variants = {
  closed: {
    y: "115%",
    opacity: 0,
    rotateX: 20,
    transition: {
      duration: 0.3,
      ease: [0.32, 0, 0.67, 0],
    },
  },
  open: {
    y: "0%",
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export function MenuLinkItem({
  item,
  index: _index,
  isActive,
  onHover,
  onSelect,
}: MenuLinkItemProps) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic({
    strength: 0.18,
    stiffness: 280,
    damping: 22,
  });

  return (
    <div className="overflow-hidden py-0.5">
      <motion.div variants={linkItemVariants}>
        <motion.button
          ref={ref as React.RefObject<HTMLButtonElement>}
          style={{ x, y }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => onHover(item)}
          onFocus={() => onHover(item)}
          onClick={() => onSelect(item.id)}
          className="group relative w-full text-left flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-5 py-1 sm:py-1.5 cursor-pointer select-none focus:outline-none"
          data-cursor={item.label.toUpperCase()}
        >
          {/* Ordinal Numeral with Active Indicator */}
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500 group-hover:text-[#60A5FA] transition-colors duration-200">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-[#0038FF] shadow-[0_0_8px_#0038FF] scale-125"
                  : "bg-white/20 group-hover:bg-[#0038FF]"
              }`}
            />
            <span className="font-semibold tracking-wider">{item.num}</span>
          </div>

          {/* Kinetic Typography Label: Solid to High-Contrast Outline & Indentation */}
          <div className="flex items-center gap-3 transition-transform duration-300 ease-out group-hover:translate-x-2.5 sm:group-hover:translate-x-4">
            <span
              className={`text-2xl sm:text-4xl lg:text-5xl font-serif italic tracking-tight transition-all duration-300 ${
                isActive
                  ? "text-white text-stroke-highlight"
                  : "text-slate-300 group-hover:text-white"
              }`}
            >
              {item.label}
            </span>

            {/* Kinetic Arrow Slide-In */}
            <motion.span
              animate={{
                opacity: isActive ? 1 : 0,
                x: isActive ? 0 : -6,
                scale: isActive ? 1 : 0.8,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="text-[#60A5FA] hidden sm:inline-block"
            >
              <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.span>
          </div>

          {/* Micro Category Subtitle */}
          <div className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-slate-500 group-hover:text-slate-300 transition-colors sm:ml-auto">
            <span>{item.sub}</span>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
