"use client";

import React, { useEffect, useState } from "react";
import { scrollGradingController } from "@/lib/color-grading/scroll-grading-controller";
import { ColorGradePreset } from "@/lib/color-grading/types";
import { HERO_PRESET } from "@/lib/color-grading/presets";
import { cn } from "@/lib/utils";

interface ColorGradingTelemetryProps {
  className?: string;
  collapsible?: boolean;
}

/**
 * ColorGradingTelemetry
 * 
 * Sleek, monospace optical telemetry badge inspired by Lando Norris telemetry UI.
 * Displays the active atmospheric lighting preset, viewport color grade,
 * and live RGB swatch nodes as the user scrolls.
 */
export function ColorGradingTelemetry({
  className,
  collapsible = true,
}: ColorGradingTelemetryProps) {
  const [preset, setPreset] = useState<ColorGradePreset>(HERO_PRESET);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const unsubscribe = scrollGradingController.subscribe((newPreset) => {
      setPreset(newPreset);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <aside
      aria-label="Atmospheric color grading telemetry"
      className={cn(
        "fixed bottom-6 left-6 z-40 hidden lg:flex flex-col gap-1.5 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-left select-none pointer-events-auto transition-opacity duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)]",
        !isVisible && "opacity-25 hover:opacity-100",
        className
      )}
    >
      {/* Top Header / Viewfinder Brackets */}
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-1.5">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0038FF] animate-pulse" />
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-medium">
            LIGHT STAGE // {preset.label}
          </span>
        </div>
        {collapsible && (
          <button
            onClick={() => setIsVisible((v) => !v)}
            className="text-[10px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle telemetry"
          >
            {isVisible ? "–" : "+"}
          </button>
        )}
      </div>

      {/* Expanded Live Telemetry Details */}
      {isVisible && (
        <div className="flex items-center justify-between gap-6 pt-0.5">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">
              {preset.subtitle}
            </span>
            <span className="font-mono text-[9px] text-slate-400/80">
              60FPS Continuous Lerp
            </span>
          </div>

          {/* Realtime Color Nodes */}
          <div className="flex items-center gap-1.5">
            {preset.orbs.map((c, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-white/20 transition-colors duration-300"
                style={{
                  backgroundColor: `rgb(${c.r}, ${c.g}, ${c.b})`,
                  boxShadow: `0 0 8px rgba(${c.r}, ${c.g}, ${c.b}, 0.6)`,
                }}
                title={`Orb ${i + 1}: rgb(${c.r}, ${c.g}, ${c.b})`}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
