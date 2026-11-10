"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowRight, ShieldCheck, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FooterProps {
  onOpenPilotModal?: () => void;
}

const NAV_LINKS = [
  { num: "01", label: "Overview", targetId: "scene-hero" },
  { num: "02", label: "3D Showroom", targetId: "scene-showroom" },
  { num: "03", label: "Specifications", targetId: "scene-specs" },
  { num: "04", label: "Assisted Flow", targetId: "scene-workflow" },
  { num: "05", label: "Pilot Pricing", targetId: "scene-pricing" },
  { num: "06", label: "Brand Intake", targetId: "scene-intake" },
  { num: "07", label: "Community Hub", targetId: "scene-community" },
];

const SOCIAL_CHANNELS = [
  { label: "Instagram DM", href: "https://instagram.com", icon: Send },
  { label: "WhatsApp Desk", href: "https://whatsapp.com", icon: MessageCircle },
  { label: "TikTok Channel", href: "https://tiktok.com", icon: ArrowRight },
];

const MARQUEE_ITEMS = [
  "FITCHECK AI",
  "SEE IT ON YOU",
  "30-SECOND MOVING MIRROR",
  "ZERO APP DOWNLOAD",
  "PHILIPPINE BOUTIQUE PILOT",
  "FIXED PREPAID ₱499",
  "DPA 10173 ENCRYPTED",
  "MANILA // 2026",
];

export function Footer({ onOpenPilotModal }: FooterProps) {
  const [phTime, setPhTime] = useState("");

  // Live Philippine Standard Time (PST/UTC+8) Clock Ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setPhTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="scene-footer" className="relative w-full pt-16 sm:pt-24 pb-0 select-none z-20 overflow-hidden">
      {/* Main Page Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-14 sm:pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Brand, Headline, Value Prop & Action Buttons */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div>
              {/* Brand Insignia & Scope */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#0038FF] flex items-center justify-center text-white text-xs font-bold shadow-[0_0_20px_rgba(0,56,255,0.6)]">
                  FC
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-sans font-bold tracking-tight text-white text-xl">
                    FitCheck
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest bg-[#0038FF]/20 text-[#60A5FA] border border-[#0038FF]/40">
                    PH PILOT
                  </span>
                </div>
              </div>

              {/* Left-Aligned Headline Statement */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase leading-[0.95]">
                See it on you. <br />
                <span className="font-serif italic font-normal lowercase tracking-normal text-slate-300">
                  the live browser mirror.
                </span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-slate-400 font-light leading-relaxed max-w-lg">
                The 30-second live style mirror for curated boutique fashion. Giving high-intent shoppers a moving visual preview before purchase.
              </p>
            </div>

            {/* Action Buttons: Primary CTA & Consultation Desks */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Button
                  size="lg"
                  onClick={onOpenPilotModal}
                  className="h-12 px-7 bg-[#0038FF] hover:bg-[#1A4CFF] text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-[0_0_24px_rgba(0,56,255,0.4)] flex items-center gap-2.5 cursor-pointer group active:scale-98"
                >
                  <span>Apply for Brand Pilot</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block font-medium">
                  DIRECT CONSULTATION DESK
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  {SOCIAL_CHANNELS.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer hover:border-white/30 hover:text-white active:scale-95 flex items-center gap-2"
                      >
                        <span className="absolute inset-0 bg-[#0038FF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative z-10 flex items-center gap-2 font-semibold">
                          <span>{social.label}</span>
                          <Icon className="w-3.5 h-3.5 text-[#0038FF] group-hover:text-white transition-colors duration-200" />
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Navigation Index, Live Clock & Back to Top */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 lg:pl-6">
            {/* Navigation Index Links */}
            <div>
              <span className="font-mono text-[11px] text-[#0038FF] uppercase tracking-widest block font-semibold mb-4">
                NAVIGATION INDEX
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs sm:text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollTo(link.targetId)}
                      className="group flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors cursor-pointer py-1"
                    >
                      <span className="text-slate-500 text-xs font-semibold group-hover:text-[#0038FF] transition-colors">
                        {link.num}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200 uppercase tracking-wider text-xs">
                        {link.label}
                      </span>
                      <ArrowRight className="w-3 h-3 text-[#0038FF] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Back to Top & Live Clock */}
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-[#0038FF]" />
                <span className="text-slate-400">MANILA:</span>
                <span className="text-white tabular-nums font-semibold">{phTime || "11:58:00 PM"} PHT</span>
              </div>

              <button
                onClick={scrollToTop}
                className="group relative overflow-hidden px-5 py-2.5 rounded-xl border border-white/20 bg-white/[0.04] text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer hover:border-[#0038FF] active:scale-98 flex items-center gap-2 shadow-lg"
              >
                <span className="absolute inset-0 bg-[#0038FF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2 font-semibold">
                  <span>Back to Top</span>
                  <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Regulatory & Philippine DPA Compliance Line */}
        <div className="mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0038FF]" />
            <span>PHILIPPINE DATA PRIVACY ACT OF 2012 (RA 10173) COMPLIANT</span>
          </div>
          <div>AUDIO PERMANENTLY DISABLED • ZERO BIOMETRIC RETENTION</div>
        </div>
      </div>

      {/* Infinite Horizontal Running Marquee: Spanning the Absolute Bottom Edge of the Page */}
      <div className="relative w-full py-3.5 overflow-hidden">
        <div className="flex overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 24,
              repeat: Infinity,
            }}
            className="flex items-center gap-8 whitespace-nowrap will-change-transform shrink-0"
          >
            {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((phrase, i) => (
              <div key={`fm1-${i}`} className="flex items-center gap-8 shrink-0">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-300 font-medium">
                  {phrase}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF] shadow-[0_0_10px_rgba(0,56,255,0.8)] shrink-0" />
              </div>
            ))}
          </motion.div>

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 24,
              repeat: Infinity,
            }}
            className="flex items-center gap-8 whitespace-nowrap will-change-transform shrink-0"
            aria-hidden="true"
          >
            {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((phrase, i) => (
              <div key={`fm2-${i}`} className="flex items-center gap-8 shrink-0">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-300 font-medium">
                  {phrase}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF] shadow-[0_0_10px_rgba(0,56,255,0.8)] shrink-0" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
