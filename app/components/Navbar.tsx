"use client";

import React, { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onOpenPilotModal: () => void;
}

export function Navbar({ onOpenPilotModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#090A0D]/85 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* FitCheck Official Brand Identity */}
        <a href="#" className="flex items-center gap-3 group">
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
              {/* Top-left bracket */}
              <path d="M4 8V5a1 1 0 0 1 1-1h3" />
              {/* Top-right bracket */}
              <path d="M16 4h3a1 1 0 0 1 1 1v3" />
              {/* Bottom-left bracket */}
              <path d="M4 16v3a1 1 0 0 0 1 1h3" />
              {/* Bottom-right bracket */}
              <path d="M16 20h3a1 1 0 0 0 1-1v-3" />
              {/* Stylized hanger / garment node */}
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
        </a>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-slate-300">
          <a href="#mirror-demo" className="hover:text-white transition">
            Live Mirror
          </a>
          <a href="#assisted-flow" className="hover:text-white transition">
            Assisted Flow
          </a>
          <a href="#target-segments" className="hover:text-white transition">
            Brand Fit
          </a>
          <a href="#pricing" className="hover:text-white transition">
            Pilot Packs (₱)
          </a>
          <a href="#trust-guardrails" className="hover:text-white transition">
            Privacy & DPA
          </a>
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

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0E1015] px-6 py-4 space-y-3">
          <a
            href="#mirror-demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1 font-mono uppercase text-xs"
          >
            Live Mirror
          </a>
          <a
            href="#assisted-flow"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1 font-mono uppercase text-xs"
          >
            Assisted Flow
          </a>
          <a
            href="#target-segments"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1 font-mono uppercase text-xs"
          >
            Brand Fit
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1 font-mono uppercase text-xs"
          >
            Pilot Packs (₱)
          </a>
          <a
            href="#trust-guardrails"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1 font-mono uppercase text-xs"
          >
            Privacy & DPA
          </a>
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
