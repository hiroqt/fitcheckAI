"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const LETTERS = ["F", "I", "T", "C", "H", "E", "C", "K"];

export function HeroWordmark() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const letterIndex = element?.getAttribute("data-letter-index");
    if (letterIndex !== null && letterIndex !== undefined) {
      setHoveredIndex(parseInt(letterIndex, 10));
    }
  };

  return (
    <div
      onMouseLeave={() => setHoveredIndex(null)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setHoveredIndex(null)}
      data-cursor="FITCHECK"
      className="w-full flex items-center justify-center cursor-default select-none py-2 px-2"
    >
      <div className="flex items-center justify-center font-black uppercase tracking-[-0.035em] leading-none text-white text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[140px]">
        {LETTERS.map((letter, index) => {
          const dist = hoveredIndex !== null ? Math.abs(hoveredIndex - index) : null;

          let targetY = 0;
          let targetScale = 1;
          let targetColor = "#FFFFFF";
          let targetShadow = "0 0 0px rgba(0, 0, 0, 0)";

          if (dist === 0) {
            // Hovered Letter: Pops up with electric cobalt burst and deep neon glow
            targetY = -22;
            targetScale = 1.15;
            targetColor = "#0038FF";
            targetShadow =
              "0 0 30px rgba(0, 56, 255, 0.95), 0 0 55px rgba(0, 56, 255, 0.6)";
          } else if (dist === 1) {
            // Immediate Neighbors: Harmonic arch wave
            targetY = -10;
            targetScale = 1.07;
            targetColor = "#60A5FA";
            targetShadow = "0 0 20px rgba(0, 56, 255, 0.55)";
          } else if (dist === 2) {
            // Secondary Neighbors: Subtle lift and soft chromatic tint
            targetY = -4;
            targetScale = 1.02;
            targetColor = "#BFDBFE";
            targetShadow = "0 0 10px rgba(0, 56, 255, 0.28)";
          }

          return (
            <motion.span
              key={`${letter}-${index}`}
              data-letter-index={index}
              onMouseEnter={() => setHoveredIndex(index)}
              animate={{
                y: targetY,
                scale: targetScale,
                color: targetColor,
                textShadow: targetShadow,
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 17,
                mass: 0.55,
              }}
              className="inline-block cursor-pointer select-none will-change-transform transform-gpu px-[0.012em]"
              style={{
                fontFamily:
                  "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontWeight: 900,
              }}
            >
              {letter}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
