"use client";

import React, { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onOpenPilotModal: () => void;
}

export function Navbar({ onOpenPilotModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // Account for fixed navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#090A0D]/85 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* FitCheck Official Brand Identity */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 group cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0038FF] flex items-center justify-center text-white relative shadow-[0_0_16px_rgba(0,56,255,0.4)] transition-transform group-hover:scale-105">
            {/* Viewfinder brackets inside icon */}
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
              <path d="M9 12a3 3 0 0 1 6 0v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1Z" strokeWidth="1.8" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-bold tracking-tight text-base text-white">
              FitCheck
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider bg-[#0038FF]/20 text-[#60A5FA] border border-[#0038FF]/30">
              PH PILOT
            </span>
          </div>
        </button>

        {/* Navigation links (Desktop) - In exact page order */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-mono tracking-wider uppercase text-slate-300">
          <button
            onClick={() => scrollTo("assisted-flow")}
            className="hover:text-white transition cursor-pointer text-left"
          >
            Assisted Flow
          </button>
          <button
            onClick={() => scrollTo("mirror-demo")}
            className="hover:text-white transition cursor-pointer text-left"
          >
            Live Mirror
          </button>
          <button
            onClick={() => scrollTo("target-segments")}
            className="hover:text-white transition cursor-pointer text-left"
          >
            Brand Fit
          </button>
          <button
            onClick={() => scrollTo("pricing")}
            className="hover:text-white transition cursor-pointer text-left"
          >
            Pilot Packs (₱)
          </button>
          <button
            onClick={() => scrollTo("trust-guardrails")}
            className="hover:text-white transition cursor-pointer text-left"
          >
            Privacy & DPA
          </button>
        </nav>

        {/* Call to action */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            size="sm"
            onClick={onOpenPilotModal}
            className="h-9 px-4 rounded-lg bg-[#0038FF] hover:bg-[#1A4CFF] text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-[0_0_16px_rgba(0,56,255,0.3)]"
          >
            <span>Apply for Pilot (3–5 Brands)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer - In exact page order */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0E1015] px-6 py-4 space-y-3 animate-in fade-in duration-150">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollTo("assisted-flow");
            }}
            className="block w-full text-left text-sm text-slate-300 hover:text-white py-1 font-mono uppercase text-xs"
          >
            Assisted Flow
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollTo("mirror-demo");
            }}
            className="block w-full text-left text-sm text-slate-300 hover:text-white py-1 font-mono uppercase text-xs"
          >
            Live Mirror
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollTo("target-segments");
            }}
            className="block w-full text-left text-sm text-slate-300 hover:text-white py-1 font-mono uppercase text-xs"
          >
            Brand Fit
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollTo("pricing");
            }}
            className="block w-full text-left text-sm text-slate-300 hover:text-white py-1 font-mono uppercase text-xs"
          >
            Pilot Packs (₱)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollTo("trust-guardrails");
            }}
            className="block w-full text-left text-sm text-slate-300 hover:text-white py-1 font-mono uppercase text-xs"
          >
            Privacy & DPA
          </button>
          <div className="pt-2">
            <Button
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPilotModal();
              }}
              className="w-full h-10 bg-[#0038FF] hover:bg-[#1A4CFF] text-white text-xs font-medium rounded-lg"
            >
              Apply for Pilot (3–5 Brands)
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
