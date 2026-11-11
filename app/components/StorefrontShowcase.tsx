"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal, ScrollHeading, ScrollText } from "./ScrollReveal";

interface StorefrontShowcaseProps {
  onOpenPilotModal?: (pack?: string) => void;
}

export function StorefrontShowcase({ onOpenPilotModal }: StorefrontShowcaseProps) {
  return (
    <div className="mx-auto mt-16 max-w-3xl border-t border-[#d5d5e4] pt-12 text-center sm:pt-16">
      <ScrollHeading margin="-80px">
        <h3 className="editorial-heading italic text-3xl sm:text-4xl text-[#101b43]">
          Don’t have a website?
        </h3>
      </ScrollHeading>

      <ScrollText delay={0.1} margin="-80px">
        <p className="mx-auto mt-3 max-w-xl text-base sm:text-lg font-medium tracking-[-0.02em] text-[#253360]">
          We can build a modern e-commerce website for your clothing brand, pre-integrated with FitCheck virtual try-ons.
        </p>
      </ScrollText>

      {/* Simplified, card-free divider columns */}
      <ScrollReveal delay={0.16} margin="-80px">
        <div className="mx-auto my-7 grid max-w-xl grid-cols-1 divide-y divide-[#d5d5e4] border-y border-[#d5d5e4] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="py-4 px-3 sm:py-5">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#0038ff]">
              Website build
            </span>
            <p className="mt-1 text-xl font-bold text-[#101b43]">Custom monthly quote</p>
            <p className="mt-1 text-xs text-[#515d82]">
              Scoped to your brand’s catalog and needs.
            </p>
          </div>

          <div className="py-4 px-3 sm:py-5">
            <span className="block text-xs font-bold uppercase tracking-wider text-emerald-600">
              Bundle discount
            </span>
            <p className="mt-1 text-xl font-bold text-[#101b43]">10% off website fee</p>
            <p className="mt-1 text-xs text-[#515d82]">
              When paired with any paid FitCheck plan.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Actions */}
      <ScrollReveal delay={0.22} margin="-80px">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            className="editorial-action"
            href="mailto:fitcheckai0@gmail.com?subject=Website%20and%20FitCheck%20bundle"
          >
            <span>Let’s talk about your website</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => onOpenPilotModal?.("enterprise")}
            className="text-sm font-bold text-[#0038ff] hover:underline underline-offset-4 cursor-pointer px-3 py-2"
          >
            Apply for pilot &rarr;
          </button>
        </div>
      </ScrollReveal>

      <ScrollText delay={0.28} margin="-80px">
        <p className="mt-4 text-[11px] font-medium text-[#66739a]">
          The 10% bundle discount is a proposed offer. Website scope, monthly subscription, and discount eligibility are confirmed in your discovery quote.
        </p>
      </ScrollText>
    </div>
  );
}
