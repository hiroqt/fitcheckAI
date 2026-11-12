"use client";

import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";

const defaultGarments = [
  { name: "Floating Brand Bomber", src: "/floating-jacket.webp", alt: "Illustrative cobalt bomber" },
  { name: "Embroidered Shirt", src: "/floating-shirt.png", alt: "Illustrative ivory shirt with cobalt embroidery" },
  { name: "Midnight Barong", src: "/floating-barong.png", alt: "Illustrative ivory embroidered barong" },
];

type LaptopMockupProps = {
  scenario: "shopper" | "brand";
  garments?: Array<{ name: string; src: string; alt: string }>;
};

export function LaptopMockup({ scenario, garments = defaultGarments }: LaptopMockupProps) {
  const displayGarments = garments.length > 0 ? garments : defaultGarments;

  return (
    <div
      role="group"
      aria-label="FitCheck browser preview displayed on a laptop"
      className="mx-auto w-full max-w-[44rem] px-2 py-4 sm:py-5 transform-gpu [backface-visibility:hidden] [transform-style:preserve-3d] [transform:rotate(0deg)] [outline:1px_solid_transparent] transition-transform duration-500 ease-out will-change-transform motion-safe:hover:[transform:rotate(-4deg)] motion-reduce:transition-none"
    >
        <div className="isolate mx-auto w-[92%] sm:w-[86%] overflow-hidden rounded-t-[1.1rem] bg-[#181c24] p-1.5 sm:p-2.5 ring-1 ring-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.38)] transform-gpu [backface-visibility:hidden]">
          {/* Subtle camera dot in the top bezel */}
          <div className="mb-1.5 flex items-center justify-center">
            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-[#0a0d14] ring-1 ring-white/15 sm:size-1.5"
            />
          </div>

          {/* Laptop screen display */}
          <div className="relative grid aspect-[1.6] grid-rows-[1.5rem_minmax(0,1fr)] overflow-hidden rounded-t-md bg-[#f7f8ff] text-[#101b43] sm:grid-rows-[2rem_minmax(0,1fr)] transform-gpu [backface-visibility:hidden]">
            <div className="flex min-w-0 items-center gap-1.5 bg-[#eef1f7] px-2 sm:px-3 border-b border-[#dfe3ec]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#f87171] sm:size-2" />
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#fbbf24] sm:size-2" />
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#34d399] sm:size-2" />
              <span className="ml-2 flex h-[70%] flex-1 items-center rounded bg-[#f0f2f8] px-2 text-[7px] text-[#64708a] sm:text-[9px]">
                tryfitcheckai.online
              </span>
            </div>

            <div className="grid min-h-0 min-w-0 grid-cols-[0.95fr_1.05fr]">
              {/* Left side: Floating Brand Horizontal Moving Carousel */}
              <div className="relative flex min-h-0 min-w-0 h-full w-full items-center overflow-hidden bg-[#101633] p-1 sm:p-2">
                <span className="absolute left-2 top-2 z-20 text-[6px] font-bold tracking-wider text-white/85 sm:left-3 sm:top-3 sm:text-[8px]">
                  FLOATING BRAND
                </span>

                {/* Soft edge fade masks for smooth carousel enter/exit */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-3 bg-gradient-to-r from-[#101633] to-transparent sm:w-5" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-3 bg-gradient-to-l from-[#101633] to-transparent sm:w-5" />

                <Marquee className="w-full [--duration:12s] [--gap:0.75rem] sm:[--gap:1rem] p-0" pauseOnHover={false}>
                  {displayGarments.map((g, i) => (
                    <div
                      key={i}
                      className="relative flex h-20 w-16 shrink-0 items-center justify-center sm:h-32 sm:w-24"
                    >
                      <Image
                        src={g.src}
                        alt={g.alt}
                        fill
                        sizes="(max-width: 640px) 64px, 96px"
                        className="object-contain p-1 drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                  ))}
                </Marquee>
              </div>

              {/* Right side: Interactive Style Action Panel */}
              <div className="flex min-h-0 min-w-0 flex-col justify-center overflow-hidden p-2.5 sm:p-5">
                <span className="text-[7px] font-semibold uppercase tracking-wider text-[#0038ff] sm:text-[10px]">
                  {scenario === "shopper" ? "Instant Try-On" : "Brand Showroom"}
                </span>
                <h3 className="truncate text-[10px] font-black text-[#101b43] sm:text-base">
                  {scenario === "shopper" ? "Curated Collection" : "Social Commerce Pilot"}
                </h3>
                <p className="mt-0.5 truncate text-[6px] text-[#596581] sm:text-[10px]">
                  {scenario === "shopper"
                    ? "Live camera & photo style preview"
                    : "Zero code or native app required"}
                </p>

                {scenario === "shopper" ? (
                  <div className="mt-2 space-y-1 sm:mt-3 sm:space-y-1.5">
                    <div className="flex items-center justify-between rounded-md bg-[#0038ff] px-2 py-1 text-[7px] font-medium text-white sm:px-2.5 sm:py-1.5 sm:text-[10px]">
                      <span>Camera Mirror</span>
                      <span className="text-[5px] uppercase opacity-85 sm:text-[8px]">15s Live</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md border border-[#d9deed] bg-white px-2 py-1 text-[7px] font-medium text-[#101b43] sm:px-2.5 sm:py-1.5 sm:text-[10px]">
                      <span>Upload Photo</span>
                      <span className="text-[5px] uppercase text-[#718096] sm:text-[8px]">Static</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 space-y-1 sm:mt-3 sm:space-y-1.5">
                    <div className="flex items-center gap-1.5 rounded-md border border-[#d9deed] bg-white px-2 py-1 text-[7px] font-medium text-[#101b43] sm:px-2.5 sm:py-1.5 sm:text-[10px]">
                      <span className="text-[#0038ff]">✓</span> Runs inside Instagram DMs & Web
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md border border-[#d9deed] bg-white px-2 py-1 text-[7px] font-medium text-[#101b43] sm:px-2.5 sm:py-1.5 sm:text-[10px]">
                      <span className="text-[#0038ff]">✓</span> Fixed prepaid trial credits
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative -mt-1 h-3 w-full overflow-hidden rounded-b-xl border border-t-0 border-[#586474] bg-gradient-to-b from-[#8290a0] via-[#6d7989] to-[#596575] shadow-[0_18px_28px_rgba(0,0,0,0.28)] sm:h-4 transform-gpu [backface-visibility:hidden]"
        />
      </div>
      );
}
