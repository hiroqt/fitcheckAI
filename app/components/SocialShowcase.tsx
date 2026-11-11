"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";

interface SocialChannel {
  name: string;
  handle: string;
  solidColor: string;
  detail: string;
  actionText: string;
  href: string;
  iconSrc: string;
  iconBgClass: string;
  isMail?: boolean;
}

const CHANNELS: SocialChannel[] = [
  {
    name: "Instagram",
    handle: "@fitcheck.startup",
    solidColor: "#E1306C",
    detail: "Short-form clips of 15-second virtual style previews, garment simulations, and lookbook releases.",
    actionText: "Follow",
    href: "https://www.instagram.com/fitcheck.startup/",
    iconSrc: "/social-icons/instagram.svg",
    iconBgClass: "bg-transparent",
  },
  {
    name: "Threads",
    handle: "@fitcheck.startup",
    solidColor: "#000000",
    detail: "Candid engineering dispatches, browser camera tech notes, and weekly boutique onboarding updates.",
    actionText: "Join",
    href: "https://www.threads.com/@fitcheck.startup",
    iconSrc: "/social-icons/threads.svg",
    iconBgClass: "bg-black",
  },
  {
    name: "Facebook",
    handle: "FitCheck AI",
    solidColor: "#0866FF",
    detail: "Philippine fashion brand spotlights, Manila pop-up previews, and regional partner announcements.",
    actionText: "Connect",
    href: "https://www.facebook.com/profile.php?id=61596346923689",
    iconSrc: "/social-icons/facebook.svg",
    iconBgClass: "bg-transparent",
  },
  {
    name: "LinkedIn",
    handle: "FitCheck AI",
    solidColor: "#0A66C2",
    detail: "Fashion tech intelligence, B2B pilot case studies, retail conversion data, and company milestones.",
    actionText: "Connect",
    href: "https://www.linkedin.com/company/145435214/",
    iconSrc: "/social-icons/linkedin.svg",
    iconBgClass: "bg-transparent",
  },
  {
    name: "Founder Desk",
    handle: "fitcheckai0@gmail.com",
    solidColor: "#EA4335",
    detail: "Custom pilot quotas, boutique catalog onboarding, or technical integration questions for our core team.",
    actionText: "Contact",
    href: "mailto:fitcheckai0@gmail.com",
    iconSrc: "/social-icons/gmail-icon.svg",
    iconBgClass: "bg-white border border-[#d5d5e4]",
    isMail: true,
  },
];

export function SocialShowcase() {
  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="editorial-section scroll-mt-8 text-[#101b43]"
    >
      {/* Section Header */}
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2 id="community-title" className="editorial-heading">
          Connect with FitCheck
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg sm:text-xl font-medium tracking-[-0.025em] leading-relaxed text-[#253360]">
          Follow virtual style previews, read product updates, or get in touch across our official channels.
        </p>
      </div>

      {/* Editorial List (Clean, unified sans-serif typography with thin dividers, no cards, no gradients) */}
      <div className="divide-y divide-[#d5d5e4] border-y border-[#d5d5e4]">
        {CHANNELS.map((channel) => (
          <a
            key={channel.name}
            href={channel.href}
            {...(channel.isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="group flex flex-col gap-4 py-6 sm:py-7 transition-colors duration-200 hover:bg-[#0038ff]/[0.03] px-3 sm:px-6 rounded-sm sm:flex-row sm:items-center sm:justify-between focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff]"
          >
            {/* Channel Identity */}
            <div className="flex items-center gap-4 sm:w-[35%] min-w-0">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl overflow-hidden transition-transform duration-200 group-hover:scale-105 ${channel.iconBgClass}`}
              >
                <Image
                  src={channel.iconSrc}
                  alt={channel.name}
                  width={28}
                  height={28}
                  className="size-7 object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="block text-lg sm:text-xl font-bold tracking-[-0.02em] text-[#101b43]">
                  {channel.name}
                </span>
                <span className="block text-sm font-medium text-[#66739a] truncate">
                  {channel.handle}
                </span>
              </div>
            </div>

            {/* Detail / Description */}
            <div className="sm:w-[48%] text-sm sm:text-base font-normal tracking-[-0.015em] leading-relaxed text-[#253360]">
              {channel.detail}
            </div>

            {/* Action Link */}
            <div
              className="flex items-center gap-1.5 text-sm font-semibold tracking-[-0.01em] sm:w-[17%] sm:justify-end shrink-0 transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: channel.solidColor }}
            >
              <span>{channel.actionText}</span>
              {channel.isMail ? (
                <Mail className="size-4 shrink-0" />
              ) : (
                <ArrowUpRight className="size-4 shrink-0" />
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
