"use client";

import { LiveTryOn } from "./showroom/LiveTryOn";
import { ScrollHeading } from "./ScrollReveal";

export function InteractiveShowroom() {
  return (
    <section
      id="scene-showroom"
      aria-labelledby="showroom-title"
      className="editorial-section scroll-mt-8 text-[#101b43]"
    >
      <div className="flex flex-col justify-between gap-6 border-b border-[#d5d5e4] pb-6 sm:flex-row sm:items-end">
        <ScrollHeading margin="-80px" className="w-full">
          <h2
            id="showroom-title"
            className="w-full text-balance font-black italic uppercase tracking-[-0.045em] text-4xl sm:text-6xl"
          >
            Explore the showroom.
          </h2>
        </ScrollHeading>
      </div>

      <div className="mt-6">
        <LiveTryOn />
      </div>
    </section>
  );
}
