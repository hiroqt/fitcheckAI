"use client";

import React, { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { MorphingHamburger } from "@/components/navigation/morphing-hamburger";
import { FullscreenMenu } from "@/components/navigation/fullscreen-menu";

interface NavbarProps {
  onOpenPilotModal: () => void;
}

export function Navbar({ onOpenPilotModal }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 30);
  });

  const scrollTo = (id: string) => {
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <>
      {/* Minimal Top Header Bar (Hides at scroll=0 so only FITCHECK is visible, reveals on scroll) */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-6 flex items-center justify-between transition-all duration-500 ease-out",
          isScrolled || isOpen
            ? "opacity-100 translate-y-0 pointer-events-none"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        {/* Brand Logo Mark */}
        <button
          onClick={() => scrollTo("scene-hero")}
          aria-label="FitCheck Home"
          className="pointer-events-auto flex items-center gap-3 group cursor-pointer text-left focus:outline-none"
          data-cursor="FITCHECK"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0038FF] flex items-center justify-center text-white relative shadow-[0_0_20px_rgba(0,56,255,0.4)] transition-transform duration-300 group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-white"
            >
              <path d="M4 8V5a1 1 0 0 1 1-1h3" />
              <path d="M16 4h3a1 1 0 0 1 1 1v3" />
              <path d="M4 16v3a1 1 0 0 0 1 1h3" />
              <path d="M16 20h3a1 1 0 0 0 1-1v-3" />
              <path
                d="M9 12a3 3 0 0 1 6 0v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1Z"
                strokeWidth="1.8"
              />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-bold tracking-tight text-base sm:text-lg text-white">
              FitCheck
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider bg-[#0038FF]/20 text-[#60A5FA] border border-[#0038FF]/30 hidden sm:inline-block">
              PH PILOT
            </span>
          </div>
        </button>

        {/* 1. Animated Morphing SVG Hamburger Toggle (Lando Norris Inspired) */}
        <MorphingHamburger
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
        />
      </header>

      {/* 2. Fullscreen Immersive Overlay Navigation with Media Cross-Highlighting */}
      <FullscreenMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelectScene={scrollTo}
        onOpenPilotModal={onOpenPilotModal}
      />
    </>
  );
}
