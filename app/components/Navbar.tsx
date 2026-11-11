"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const NAV_ITEMS = [
  { label: "Showroom", href: "#scene-showroom" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#scene-pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar({ onOpenPilotModal }: { onOpenPilotModal: () => void }) {
  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-white/15 px-5 py-4 sm:px-9 lg:px-12">
      <a
        href="#scene-hero"
        aria-label="FitCheck home"
        className="transition-opacity duration-200 hover:opacity-85"
      >
        <Image
          src="/fitcheck-wordmark.webp"
          width={104}
          height={32}
          alt=""
        />
      </a>
      <nav
        aria-label="Main navigation"
        className="order-last flex w-full items-center justify-between gap-1 text-sm text-[#dedcf3] sm:order-0 sm:w-auto sm:justify-center sm:gap-2"
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-1.5 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        onClick={onOpenPilotModal}
        className="flex min-h-10 cursor-pointer items-center gap-2 rounded-sm border border-white/40 bg-white/5 px-4 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-white hover:bg-white/15 active:scale-[0.98]"
      >
        <span>Brand pilot</span>
        <ArrowUpRight size={15} aria-hidden="true" />
      </button>
    </header>
  );
}
