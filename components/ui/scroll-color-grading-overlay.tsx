"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { scrollGradingController } from "@/lib/color-grading/scroll-grading-controller";
import { ColorGradePreset } from "@/lib/color-grading/types";
import { toRgbaString } from "@/lib/color-grading/lerp";

interface ScrollColorGradingOverlayProps {
  className?: string;
  showBlendLayer?: boolean;
}

/**
 * ScrollColorGradingOverlay
 * 
 * Hardware-accelerated dynamic color grading overlay inspired by landonorris.com.
 * Smoothly interpolates directional spotlights, atmospheric fill lights, and
 * chromatic washes based on scroll position without triggering React re-renders.
 * 
 * Sits inside GlobalBackground, harmonizing seamlessly with the generative
 * WebGL/canvas particle background underneath.
 */
export function ScrollColorGradingOverlay({
  className,
  showBlendLayer = true,
}: ScrollColorGradingOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Apply color grade updates via direct CSS variables for 60fps GPU compositing
    const handleGradeUpdate = (preset: ColorGradePreset) => {
      if (!el) return;

      const spot = preset.spotlight;
      const fill = preset.fillLight;
      const wash = preset.washLight;
      const base = preset.baseTint;

      el.style.setProperty("--scg-spot-x", `${spot.x.toFixed(1)}%`);
      el.style.setProperty("--scg-spot-y", `${spot.y.toFixed(1)}%`);
      el.style.setProperty("--scg-spot-radius", `${spot.radius.toFixed(1)}%`);
      el.style.setProperty("--scg-spot-rgba", toRgbaString(spot.color, spot.opacity));

      el.style.setProperty("--scg-fill-x", `${fill.x.toFixed(1)}%`);
      el.style.setProperty("--scg-fill-y", `${fill.y.toFixed(1)}%`);
      el.style.setProperty("--scg-fill-radius", `${fill.radius.toFixed(1)}%`);
      el.style.setProperty("--scg-fill-rgba", toRgbaString(fill.color, fill.opacity));

      el.style.setProperty("--scg-wash-rgba", toRgbaString(wash.color, wash.opacity));
      el.style.setProperty("--scg-base-tint", `rgb(${base.r}, ${base.g}, ${base.b})`);
    };

    const unsubscribe = scrollGradingController.subscribe(handleGradeUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 transition-colors duration-1000",
        className
      )}
      style={{
        // Default initial fallback values
        ["--scg-spot-x" as string]: "65%",
        ["--scg-spot-y" as string]: "28%",
        ["--scg-spot-radius" as string]: "55%",
        ["--scg-spot-rgba" as string]: "rgba(0, 56, 255, 0.16)",
        ["--scg-fill-x" as string]: "25%",
        ["--scg-fill-y" as string]: "72%",
        ["--scg-fill-radius" as string]: "48%",
        ["--scg-fill-rgba" as string]: "rgba(14, 165, 233, 0.09)",
        ["--scg-wash-rgba" as string]: "rgba(2, 12, 45, 0.22)",
        ["--scg-base-tint" as string]: "rgb(9, 10, 13)",
      }}
      aria-hidden="true"
    >
      {/* 1. Underlying Atmospheric Base Tint (subtle ambient shadow tone) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-colors duration-700"
        style={{
          backgroundColor: "var(--scg-base-tint)",
        }}
      />

      {/* 2. Primary Atmospheric Spotlight & Secondary Fill Light Layer */}
      <div
        className="pointer-events-none absolute inset-0 transform-gpu will-change-transform"
        style={{
          background: `
            radial-gradient(
              circle at var(--scg-spot-x) var(--scg-spot-y),
              var(--scg-spot-rgba) 0%,
              transparent var(--scg-spot-radius)
            ),
            radial-gradient(
              circle at var(--scg-fill-x) var(--scg-fill-y),
              var(--scg-fill-rgba) 0%,
              transparent var(--scg-fill-radius)
            )
          `,
        }}
      />

      {/* 3. Horizon Wash / Environmental Rim Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, var(--scg-wash-rgba) 0%, transparent 75%)`,
        }}
      />

      {/* 4. Film Contrast & Highlight Bloom (Screen Blend Mode) */}
      {showBlendLayer && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen opacity-50 transform-gpu will-change-transform"
          style={{
            background: `
              radial-gradient(
                circle at var(--scg-spot-x) var(--scg-spot-y),
                var(--scg-spot-rgba) 0%,
                transparent calc(var(--scg-spot-radius) * 0.7)
              )
            `,
          }}
        />
      )}
    </div>
  );
}
