"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AmbientCanvasBackground } from "./ambient-canvas-background";
import { ScrollColorGradingOverlay } from "./scroll-color-grading-overlay";

interface GlobalBackgroundProps {
  className?: string;
  showGrid?: boolean;
  showVignette?: boolean;
  showNoise?: boolean;
  showColorGrading?: boolean;
  particleCount?: number;
  interactive?: boolean;
}

/**
 * GlobalBackground
 * 
 * A persistent, fixed, GPU-accelerated background layer designed to live
 * in RootLayout (app/layout.tsx). It runs continuously across all client-side
 * page navigations without unmounting, resetting, or stuttering, and maintains
 * organic autonomous motion even when the user is idle.
 * 
 * Incorporates dynamic scroll-linked color grading inspired by landonorris.com,
 * subtly shifting color stops and directional light nodes as the user scrolls
 * through sections while preserving the continuous unified ambient background.
 */
export function GlobalBackground({
  className,
  showGrid = true,
  showVignette = true,
  showNoise = true,
  showColorGrading = true,
  particleCount = 55,
  interactive = true,
}: GlobalBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-50 h-screen w-screen overflow-hidden bg-[#090A0D]",
        className
      )}
      aria-hidden="true"
    >
      {/* 1. Continuous Generative WebGL/Canvas Particle & Fluid Mesh Engine with Idle Motion */}
      <AmbientCanvasBackground
        particleCount={particleCount}
        interactive={interactive}
      />

      {/* 2. Scroll-Linked Dynamic Color Grading Gradient Overlay (Section-Based Stops) */}
      {showColorGrading && <ScrollColorGradingOverlay />}

      {/* 3. Architectural Hairline Coordinate Grid */}
      {showGrid && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      )}

      {/* 4. Deep Cinematic Optical Vignette */}
      {showVignette && (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(9,10,13,0.78)_100%)]"
        />
      )}

      {/* 5. Fine Tactile Organic Grain / Micro-Texture */}
      {showNoise && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.022] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </div>
  );
}
