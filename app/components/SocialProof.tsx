"use client";

import React from "react";
import { Marquee } from "@/components/ui/marquee";

const BRAND_LOGOS = [
  { name: "ATELIER ÉTOILE", descriptor: "PARIS" },
  { name: "KINETIC APPAREL", descriptor: "STOCKHOLM" },
  { name: "VERVE & CO", descriptor: "NEW YORK" },
  { name: "AURA LUXE", descriptor: "MILAN" },
  { name: "MONOLITH ESSENTIALS", descriptor: "TOKYO" },
  { name: "CYPHER TECHNICAL", descriptor: "LONDON" },
  { name: "EQUINOX STUDIO", descriptor: "COPENHAGEN" },
  { name: "SOLSTICE WEAR", descriptor: "LOS ANGELES" },
];

export function SocialProof() {
  return (
    <section className="py-16 border-y border-white/[0.08] bg-white/[0.01] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
          Powering virtual fit intelligence for modern apparel brands & Shopify Plus merchants
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Left and right fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-r from-[#090A0D] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-l from-[#090A0D] to-transparent z-10 pointer-events-none" />

        <Marquee pauseOnHover className="[--duration:35s]">
          {BRAND_LOGOS.map((brand, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center px-8 py-3 group cursor-default"
            >
              <span className="font-sans font-semibold tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors duration-200 text-sm sm:text-base">
                {brand.name}
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-slate-400 mt-1">
                {brand.descriptor}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

