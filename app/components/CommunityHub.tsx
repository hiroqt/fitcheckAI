"use client";

import React, { useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";

// Platform vector marks for pixel-perfect fidelity
function LinkedInIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function ThreadsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.186 24C5.467 24 0 18.533 0 11.814 0 5.094 5.467 0 12.186 0c6.643 0 11.979 5.234 11.979 11.814 0 .584-.044 1.155-.128 1.713a.936.936 0 0 1-.926.797.936.936 0 0 1-.933-.895c.08-.507.12-1.02.12-1.615 0-5.59-4.526-10.026-10.112-10.026-5.586 0-10.298 4.436-10.298 10.026 0 5.59 4.712 10.298 10.298 10.298 3.738 0 7.026-2.04 8.794-5.462a.935.935 0 0 1 1.25-.407.935.935 0 0 1 .407 1.25C20.354 21.666 16.518 24 12.186 24zm4.846-13.822a7.195 7.195 0 0 0-2.31-1.285c-1.396-.46-2.835-.386-4.043.208-1.468.72-2.378 2.062-2.5 3.682-.143 1.905.748 3.616 2.38 4.577 1.282.753 2.784.86 4.116.294 1.16-.494 2.06-1.393 2.535-2.533l-1.67-.803c-.347.834-1.006 1.487-1.854 1.848-.962.409-2.044.331-2.966-.21-.973-.573-1.503-1.593-1.417-2.73.08-1.063.685-1.942 1.66-2.42 1.056-.519 2.377-.487 3.623.088a5.534 5.534 0 0 1 1.62.996c.64.604.996 1.395.996 2.228 0 1.94-1.378 3.486-3.431 3.848-1.455.257-2.883-.17-3.918-1.173a.937.937 0 1 1 1.306-1.341c.642.624 1.547.886 2.483.72 1.189-.21 2.016-1.127 2.016-2.234 0-.41-.18-.804-.52-1.126z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function GmailIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.491l8.073-5.998C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

function TikTokIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.48 6.31 6.31 0 0 0 1.94-4.57V8.75a8.16 8.16 0 0 0 4.83 1.57v-3.5a4.85 4.85 0 0 1-1-.13z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.838 11.838 0 0 0 5.715 1.464h.005c6.554 0 11.89-5.335 11.893-11.892a11.82 11.82 0 0 0-3.475-8.408" />
    </svg>
  );
}

interface SocialChannel {
  id: string;
  num: string;
  name: string;
  handle: string;
  href: string;
  color: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: "linkedin",
    num: "01",
    name: "LINKEDIN",
    handle: "fitcheck-ai",
    href: "https://linkedin.com",
    color: "#0A66C2",
    glowColor: "rgba(10, 102, 194, 0.65)",
    icon: LinkedInIcon,
  },
  {
    id: "threads",
    num: "02",
    name: "THREADS",
    handle: "@fitcheck.ai",
    href: "https://threads.net",
    color: "#FFFFFF",
    glowColor: "rgba(255, 255, 255, 0.55)",
    icon: ThreadsIcon,
  },
  {
    id: "instagram",
    num: "03",
    name: "INSTAGRAM",
    handle: "@fitcheck.ai",
    href: "https://instagram.com",
    color: "#E1306C",
    glowColor: "rgba(225, 48, 108, 0.65)",
    icon: InstagramIcon,
  },
  {
    id: "facebook",
    num: "04",
    name: "FACEBOOK",
    handle: "fitcheck.ph",
    href: "https://facebook.com",
    color: "#1877F2",
    glowColor: "rgba(24, 119, 242, 0.65)",
    icon: FacebookIcon,
  },
  {
    id: "gmail",
    num: "05",
    name: "GMAIL",
    handle: "pilot@fitcheck.ai",
    href: "mailto:pilot@fitcheck.ai",
    color: "#EA4335",
    glowColor: "rgba(234, 67, 53, 0.65)",
    icon: GmailIcon,
  },
  {
    id: "tiktok",
    num: "06",
    name: "TIKTOK",
    handle: "@fitcheck.ai",
    href: "https://tiktok.com",
    color: "#00F2FE",
    glowColor: "rgba(0, 242, 254, 0.65)",
    icon: TikTokIcon,
  },
  {
    id: "whatsapp",
    num: "07",
    name: "WHATSAPP",
    handle: "+63 917 FITCHECK",
    href: "https://wa.me/639170000000",
    color: "#25D366",
    glowColor: "rgba(37, 211, 102, 0.65)",
    icon: WhatsAppIcon,
  },
];

// Pure Floating Text Social Element (No Box / No Card)
function FloatingSocialLink({
  item,
}: {
  item: SocialChannel;
}) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      style={
        {
          "--accent": item.color,
          "--glow": item.glowColor,
        } as React.CSSProperties
      }
      className="group/item inline-flex items-center gap-3 sm:gap-5 px-4 sm:px-8 py-3 transition-transform duration-300 ease-out hover:-translate-y-1 cursor-pointer select-none"
    >
      {/* Index marker */}
      <span className="font-mono text-xs sm:text-sm text-slate-500 group-hover/item:text-[var(--accent)] transition-colors duration-300">
        ⌜{item.num}⌟
      </span>

      {/* Platform vector icon */}
      <span className="text-slate-400 group-hover/item:text-[var(--accent)] transition-all duration-300 group-hover/item:scale-110 group-hover/item:drop-shadow-[0_0_16px_var(--glow)]">
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
      </span>

      {/* Big Monolithic Floating Typography */}
      <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white/40 group-hover/item:text-white transition-all duration-300 group-hover/item:drop-shadow-[0_0_30px_var(--glow)] font-sans">
        {item.name}
      </span>

      {/* Handle tag */}
      <span className="font-mono text-xs sm:text-sm uppercase tracking-wider text-slate-500 group-hover/item:text-[var(--accent)] transition-colors duration-300 hidden md:inline-block">
        {item.handle}
      </span>

      {/* Dynamic diagonal arrow */}
      <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/15 group-hover/item:border-[var(--accent)] group-hover/item:bg-[var(--accent)] flex items-center justify-center text-slate-400 group-hover/item:text-white transition-all duration-300 group-hover/item:shadow-[0_0_20px_var(--glow)]">
        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
      </span>

      {/* Aesthetic delimiter between channels */}
      <span className="text-slate-700/80 font-mono text-2xl sm:text-4xl pl-4 sm:pl-8 select-none">
        {"//"}
      </span>
    </a>
  );
}

export function CommunityHub() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section
      id="scene-community"
      className="relative w-full py-10 sm:py-14 select-none overflow-hidden"
    >
      {/* Background radial ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(0,56,255,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl -z-10" />

      {/* 1. Header with Editorial Telemetry and Motion Control */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-[#0038FF] font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#0038FF] animate-ping" />
              <span>06 // FLOATING SOCIAL CAROUSEL</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">7 OFFICIAL CHANNELS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase leading-[0.95]">
              Connected <br />
              <span className="font-serif italic font-normal lowercase tracking-normal text-slate-300">
                direct touchpoints.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] font-mono text-xs text-slate-400">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? "bg-[#10B981] animate-pulse" : "bg-slate-500"
                }`}
              />
              <span className="text-[11px] uppercase tracking-wider">
                {isPlaying ? "HOVER TEXT TO PAUSE" : "PAUSED"}
              </span>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause Carousel Motion" : "Resume Carousel Motion"}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/[0.04] text-white font-mono text-xs uppercase tracking-wider hover:border-[#0038FF] hover:bg-[#0038FF]/10 transition-all cursor-pointer active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#0038FF]" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#10B981] fill-current" />
                  <span>Resume</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Pure Floating Text Moving Carousel Track (Zero Cards / Pure Typography) */}
      <div className="relative w-full overflow-hidden group py-4">
        {/* Soft edge gradient fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-[#090A0D] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-[#090A0D] to-transparent z-10" />

        {/* Marquee gliding track */}
        <div
          className="flex whitespace-nowrap will-change-transform animate-marquee group-hover:[animation-play-state:paused]"
          style={
            {
              "--duration": "42s",
              "--gap": "2rem",
              animationPlayState: isPlaying ? undefined : "paused",
            } as React.CSSProperties
          }
        >
          {/* Tripled list for seamless infinite wrap */}
          {SOCIAL_CHANNELS.concat(SOCIAL_CHANNELS).concat(SOCIAL_CHANNELS).map((channel, idx) => (
            <FloatingSocialLink
              key={`${channel.id}-${idx}`}
              item={channel}
            />
          ))}
        </div>
      </div>

      {/* 3. Bottom Narrative Transition Divider leading into Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-12 sm:mt-16 flex items-center justify-between text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF] animate-pulse" />
          <span>7/7 CHANNELS CONNECTED // TAP ANY LINK TO OPEN</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>COORDINATES: MANILA PH</span>
          <span>•</span>
          <span className="text-slate-400">PROCEED TO TERMINAL INTAKE</span>
        </div>
      </div>
    </section>
  );
}