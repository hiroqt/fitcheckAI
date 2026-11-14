"use client";

import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 32);

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 border-b ${
        isScrolled || mobileMenuOpen
          ? "border-[#d5d5e4] bg-white text-[#101b43] shadow-[0_4px_18px_rgba(16,27,67,0.08)]"
          : "border-white/15 bg-[#0038ff] text-white"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3.5 sm:px-8 sm:py-4 lg:px-12">
        <a
          href="#scene-hero"
          aria-label="FitCheck home"
          onClick={closeMenu}
          className="shrink-0 transition-opacity duration-200 hover:opacity-85"
        >
          <Image
            src="/fitcheck-wordmark.webp"
            width={112}
            height={34}
            alt=""
            className={`h-7 w-auto transition-[filter] duration-300 sm:h-8 ${
              isScrolled || mobileMenuOpen ? "brightness-0" : ""
            }`}
          />
        </a>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className={`hidden md:flex items-center justify-center gap-1 text-sm lg:gap-3 lg:text-base xl:gap-5 xl:text-lg ${
            isScrolled ? "text-[#101b43]" : "text-[#dedcf3]"
          }`}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-md px-2.5 py-1.5 transition-colors duration-200 ${
                isScrolled
                  ? "hover:bg-[#0038ff]/[0.08] hover:text-[#0038ff]"
                  : "hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Controls & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={getPilotMailto()}
            onClick={(e) => {
              closeMenu();
              if (onOpenPilotModal) {
                e.preventDefault();
                onOpenPilotModal();
              }
            }}
            className={`flex min-h-10 sm:min-h-11 shrink-0 cursor-pointer items-center gap-1.5 sm:gap-2 rounded-sm border px-3 sm:px-4 text-xs font-semibold sm:text-sm shadow-sm transition-all duration-150 active:scale-95 ${
              isScrolled || mobileMenuOpen
                ? "border-[#0038ff] bg-[#0038ff] text-white hover:border-[#002dcc] hover:bg-[#002dcc]"
                : "border-white/40 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/15"
            }`}
          >
            <span>Work with us</span>
            <ArrowUpRight size={15} aria-hidden="true" className="shrink-0" />
          </a>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`flex size-10 items-center justify-center rounded-md border md:hidden transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isScrolled || mobileMenuOpen
                ? "border-[#d5d5e4] text-[#101b43] hover:bg-zinc-100 focus-visible:outline-[#0038ff]"
                : "border-white/30 text-white hover:bg-white/10 focus-visible:outline-white"
            }`}
          >
            {mobileMenuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Panel */}
      {mobileMenuOpen && (
        <div className="border-t border-[#e2e4f0] bg-white px-4 py-4 md:hidden text-[#101b43] shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-11 items-center rounded-md px-3 py-2 text-base font-semibold text-[#101b43] transition-colors hover:bg-[#0038ff]/[0.08] hover:text-[#0038ff] active:bg-[#0038ff]/15"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
