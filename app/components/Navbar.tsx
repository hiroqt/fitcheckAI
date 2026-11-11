"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function Navbar({ onOpenPilotModal }: { onOpenPilotModal: () => void }) {
  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-white/15 px-5 py-4 sm:px-9 lg:px-12">
      <a href="#scene-hero" aria-label="FitCheck home">
        <Image src="/fitcheck-wordmark.webp" width={104} height={32} alt="" />
      </a>
      <nav aria-label="Main navigation" className="order-last flex w-full items-center justify-between gap-5 text-sm text-[#dedcf3] sm:order-0 sm:w-auto sm:justify-center sm:gap-8">
        <a className="hover:underline" href="#scene-showroom">Showroom</a>
        <a className="hover:underline" href="#how-it-works">How it works</a>
        <a className="hover:underline" href="#scene-pricing">Pricing</a>
        <a className="hover:underline" href="#faq">FAQ</a>
      </nav>
      <button type="button" onClick={onOpenPilotModal} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-sm border border-white/40 px-3.5 text-sm hover:bg-white/10">
        Brand pilot <ArrowUpRight size={15} aria-hidden="true" />
      </button>
    </header>
  );
}
