import React from "react";
import { cn } from "@/lib/utils";

export function AmbientBackground({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full bg-[#090A0D] text-slate-100 overflow-hidden",
        className
      )}
    >
      {/* Precision hairline grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Architectural subtle ambient light - restrained, luxury monochrome */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Subtle radial center vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

