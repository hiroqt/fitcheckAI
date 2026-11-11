"use client";

import React from "react";
import { Marquee } from "@/components/ui/marquee";

interface PartitionTickerProps {
  items: string[];
  reverse?: boolean;
  className?: string;
}

export function PartitionTicker({
  items,
  reverse = false,
  className = "",
}: PartitionTickerProps) {
  return (
    <div
      className={`my-8 sm:my-10 w-full overflow-hidden select-none border-y border-[#d5d5e4] py-3 ${className}`}
      aria-hidden="true"
    >
      <Marquee
        reverse={reverse}
        pauseOnHover
        className="[--duration:45s] [--gap:2.5rem] py-0"
      >
        {items.map((item, idx) => (
          <div key={`${item}-${idx}`} className="flex items-center gap-5 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4b5578]">
              {item}
            </span>
            <span className="text-[#a4aec8] text-xs font-light">·</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
