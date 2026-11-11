"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowRight, Sparkles } from "lucide-react";

interface FooterProps {
  onOpenPilotModal?: () => void;
  className?: string;
}

// Clean inline SVGs for high-end fashion/tech social icons
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

  function ThreadsIcon({ className }: { className?: string }) {
    return (
      <svg viewBox="0 0 192 192" width="16" height="16" fill="currentColor" className={className} aria-hidden="true">
        <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.194 47.292 9.642 32.788 28.08 19.882 44.485 13.224 67.315 13.001 95.932L13 96v.067c.224 28.617 6.882 51.447 19.788 67.854C47.292 182.358 68.882 191.806 96.957 192h.113c24.96-.173 42.554-6.708 57.048-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.945-24.723-24.553ZM98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.114 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.802 29.274Z" />
      </svg>
    );
  }

    function GmailIcon({ className }: { className?: string }) {
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={className} aria-hidden="true">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
        </svg>
      );
    }

      function LinkedInIcon({ className }: { className?: string }) {
        return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={className} aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
  );
      }

        function InstagramIcon({ className }: { className?: string }) {
          return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
  );
        }

        const SOCIAL_LINKS = [
          { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61596346923689", icon: FacebookIcon },
          { label: "Threads", href: "https://www.threads.com/@fitcheck.startup", icon: ThreadsIcon },
          { label: "Gmail", href: "mailto:fitcheckai0@gmail.com", icon: GmailIcon },
          { label: "LinkedIn", href: "https://www.linkedin.com/company/145435214/", icon: LinkedInIcon },
          { label: "Instagram", href: "https://www.instagram.com/fitcheck.startup/", icon: InstagramIcon },
        ];

            const NAVIGATION_COLUMNS = [
              {
                title: "Product",
                links: [
                  { label: "Overview", href: "/#scene-hero" },
                  { label: "Showroom", href: "/#scene-showroom" },
                  { label: "Style Preview", href: "/#how-it-works" },
                  { label: "Pilot Pricing", href: "/#scene-pricing" },
                  { label: "FAQ", href: "/#faq" },
                ],
              },
  {
                title: "Platform",
                links: [
                  { label: "Brand Pilot Intake", href: "/#scene-pricing", isPilotAction: true },
                  { label: "Floating Brand", href: "/#scene-showroom" },
                  { label: "Garment Specs", href: "/#how-it-works" },
                  { label: "Retail Integration", href: "mailto:fitcheckai0@gmail.com" },
                ],
              },
  {
                title: "Legal & Safety",
                links: [
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ],
              },
];

          export function Footer({ onOpenPilotModal, className = "" }: FooterProps) {
            const scrollToTop = () => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            };

                        return (
                        <footer
                          aria-label="Site Footer"
                          className={`relative w-full border-t border-white/10 bg-[#0E121E] text-white ${className}`}
                        >
                          {/* "See what works for you" Floating Action Card */}
                          <section className="relative z-10 mx-auto -mt-14 mb-4 grid max-w-6xl gap-6 overflow-hidden rounded-xl border border-white/20 bg-[#0038ff] px-6 py-7 shadow-xl sm:-mt-16 sm:mb-6 sm:grid-cols-[1fr_auto] sm:items-center sm:px-10 sm:py-9">
                            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 size-64 rounded-full border border-white/10" />
                            <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 left-1/3 size-72 rounded-full border border-white/10" />
                            <div className="relative">
                              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                                See what works for you
                              </p>
                              <h2 className="mt-2 text-balance text-4xl font-black italic tracking-[0.01em] text-white sm:text-5xl lg:text-6xl">
                                Curious about FitCheck?
                              </h2>
                              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90">
                                Try a style preview or send us a message. We’re happy to help you get started.
                              </p>
                            </div>
                            <div className="relative flex flex-wrap gap-3">
                              <Link
                                href="/#scene-showroom"
                                className="inline-flex min-h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-[#101b43] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0038ff]"
                              >
                                Try a look
                              </Link>
                              <a
                                href="mailto:fitcheckai0@gmail.com"
                                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                              >
                                Message us
                              </a>
                            </div>
                          </section>

                          {/* Main Footer Container - comfortably positioned upward relative to the card */}
                          <div className="relative z-10 mx-auto max-w-7xl px-6 pt-6 pb-14 sm:px-10 sm:pt-8 sm:pb-16 lg:px-12 lg:pt-10 lg:pb-18">
                            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                              {/* Brand Info (Left Asymmetric Column: 5 of 12 cols) */}
                              <div className="flex flex-col justify-between space-y-8 lg:col-span-5">
                                <div className="space-y-4">
                                  {/* Wordmark */}
                                  <div>
                                    <Link
                                      href="/#scene-hero"
                                      aria-label="FitCheck home"
                                      className="inline-block transition-opacity duration-200 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038ff]"
                                    >
                                      <Image
                                        src="/fitcheck-wordmark.webp"
                                        width={138}
                                        height={38}
                                        alt="FitCheck AI"
                                        className="h-auto w-auto brightness-110"
                                        priority={false}
                                      />
                                    </Link>
                                  </div>

                                {/* Tagline */}
                                <p className="text-balance text-base font-medium tracking-tight text-zinc-300 sm:text-lg">
                                  AI-powered digital wardrobe and clothing brand integration.
                                </p>

                              {/* Supporting Editorial Microcopy */}
                              <p className="max-w-md text-xs font-normal leading-relaxed text-zinc-400">
                                A browser-based style preview and moving mirror for curated fashion labels. Audio-off capture with zero biometric retention.
                              </p>
                            </div>
                          </div>

                                    {/* Navigation Columns (Right Multi-Column Grid: 7 of 12 cols) */ }
                                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:pl-6">
                                      {NAVIGATION_COLUMNS.map((col) => (
                                        <div key={col.title} className="space-y-4">
                                          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                                            {col.title}
                                          </h3>
                                          <nav aria-label={col.title} className="flex flex-col space-y-2.5">
                                            {col.links.map((link) => {
                                              if (link.isPilotAction && onOpenPilotModal) {
                                                return (
                                                  <button
                                                    key={link.label}
                                                    type="button"
                                                    onClick={onOpenPilotModal}
                                                    className="group inline-flex items-center gap-1.5 text-left text-sm text-zinc-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038ff]"
                                                  >
                                                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                                                      {link.label}
                                                    </span>
                                                    <Sparkles className="h-3 w-3 text-[#0038ff] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                                  </button>
                                                );
                                              }

                    const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto:");
                            return (
                            <Link
                              key={link.label}
                              href={link.href}
                              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className="group inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038ff]"
                            >
                              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                                {link.label}
                              </span>
                              <ArrowRight className="h-3 w-3 text-[#0038ff] opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                            </Link>
                            );
                  })}
                          </nav>
                      </div>
            ))}
                    </div>
                  </div>

                      {/* Divider */}
                      <div className="mt-12 border-t border-white/10 pt-8 sm:mt-14 sm:pt-10">
                        <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row">
                          {/* Copyright & Disclaimer */}
                          <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
                            <p className="text-xs text-zinc-400">
                              © 2026 FitCheck AI. All rights reserved.
                            </p>
                            <p className="text-[11px] text-zinc-400">
                              Style preview for fashion discovery. Refer to brand sizing charts for physical garments.
                            </p>
                          </div>

                            {/* Social Icons & Back to Top */}
                            <div className="flex flex-wrap items-center gap-4">
                              {/* Social Channels */}
                              <nav aria-label="Social media" className="flex items-center gap-2">
                                {SOCIAL_LINKS.map(({ label, href, icon: IconComponent }) => (
                                  <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038ff]"
                                  >
                                    <IconComponent className="h-4 w-4" />
                                  </a>
                                ))}
                              </nav>

                              <div className="hidden h-5 w-px bg-white/10 sm:block" />

                    {/* Back to top button */}
                    <button
                      type="button"
                      onClick={scrollToTop}
                      aria-label="Scroll back to top"
                      className="group inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 text-xs font-medium text-zinc-300 transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038ff]"
                    >
                      <span>Back to top</span>
                      <ArrowUp className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
              </div>
      </div >
    </footer >
  );
          }
