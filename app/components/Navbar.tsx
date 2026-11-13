"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getPilotMailto } from "@/app/lib/pilotEmail";

const NAV_ITEMS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Showroom", href: "#scene-showroom" },
  { label: "Pricing", href: "#scene-pricing" },
  { label: "Socials", href: "#community" },
  { label: "FAQs", href: "#faq" },
];

export function Navbar({ onOpenPilotModal }: { onOpenPilotModal?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 32);

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  return (
    <header className={`sticky top-0 z-50 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b px-5 py-4 transition-colors duration-300 sm:px-9 lg:px-12 ${isScrolled
        ? "border-[#d5d5e4] bg-white text-[#101b43] shadow-[0_4px_18px_rgba(16,27,67,0.08)]"
        : "border-white/15 bg-[#0038ff] text-white"
      }`}>
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
          className={`h-7 w-auto transition-[filter] duration-300 sm:h-8 ${isScrolled ? "brightness-0" : ""}`}
        />
      </a>

      <nav
        aria-label="Main navigation"
        className={`order-last flex w-full items-center justify-center gap-1 text-sm sm:order-none sm:mx-6 sm:flex-1 sm:gap-3 sm:text-lg md:gap-5 md:text-xl ${isScrolled ? "text-[#101b43]" : "text-[#dedcf3]"}`}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-md px-2 py-1.5 transition-colors duration-200 ${isScrolled ? "hover:bg-[#0038ff]/[0.08] hover:text-[#0038ff]" : "hover:bg-white/10 hover:text-white"}`}
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
        className={`flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-sm border px-4 text-sm font-medium shadow-sm transition-all duration-150 active:scale-95 sm:text-base ${isScrolled ? "border-[#0038ff] bg-[#0038ff] text-white hover:border-[#002dcc] hover:bg-[#002dcc]" : "border-white/40 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/15"}`}
      >
        <span>Work with us</span>
        <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </header>
  );
}
