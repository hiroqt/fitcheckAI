"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { GlobalBackground } from "./global-background";

export interface AmbientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  /**
   * If true, renders a local instance of the GlobalBackground.
   * Useful when using this component in isolation outside the RootLayout.
   * Defaults to false because RootLayout already hosts the persistent GlobalBackground.
   */
  standalone?: boolean;
}

export function AmbientBackground({
  className,
  children,
  standalone = false,
}: AmbientBackgroundProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full text-slate-100 overflow-x-clip selection:bg-[#0038FF]/30 selection:text-white",
        className
      )}
    >
      {standalone && <GlobalBackground />}

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
