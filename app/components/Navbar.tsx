"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getPilotMailto } from "@/app/lib/pilotEmail";

const NAV_ITEMS = [
  { label: "Showroom", href: "#scene-showroom" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#scene-pricing" },
  { label: "FAQs", href: "#faq" },
];

export function Navbar({ onOpenPilotModal }: { onOpenPilotModal?: () => void }) {
  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-white/15 px-5 py-4 sm:px-9 lg:px-12">
      <a
        href="#scene-hero"
        aria-label="FitCheck home"
        className="shrink-0 transition-opacity duration-200 hover:opacity-85"
      >
        <Image
          src="/fitcheck-wordmark.webp"
          width={112}
          height={34}
          alt=""
          className="h-7 w-auto sm:h-8"
        />
      </a>

      {/* Expanded navigation spanning across the navbar with larger font size */}
      <nav
        aria-label="Main navigation"
        className="order-last flex w-full items-center justify-between text-sm sm:order-none sm:mx-6 sm:flex-1 sm:max-w-3xl sm:justify-around sm:text-lg md:text-xl lg:max-w-4xl text-[#dedcf3]"
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-md px-2 py-1.5 transition-all duration-200 hover:text-white hover:bg-white/10"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a
        href={getPilotMailto()}
        onClick={(e) => {
          if (onOpenPilotModal) {
            e.preventDefault();
            onOpenPilotModal();
          }
        }}
        className="flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-sm border border-white/40 bg-white/5 px-4 text-sm sm:text-base font-medium text-white shadow-sm backdrop-blur-sm transition-all duration-150 hover:border-white hover:bg-white/15 active:scale-95"
      >
        <span>Work with us</span>
        <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </header>
  );
}
