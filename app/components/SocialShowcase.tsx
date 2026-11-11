"use client";

import React from "react";
import { ArrowUpRight, Mail } from "lucide-react";

// Clean custom SVG icons
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 192 192" width="20" height="20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.194 47.292 9.642 32.788 28.08 19.882 44.485 13.224 67.315 13.001 95.932L13 96v.067c.224 28.617 6.882 51.447 19.788 67.854C47.292 182.358 68.882 191.806 96.957 192h.113c24.96-.173 42.554-6.708 57.048-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.945-24.723-24.553ZM98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.114 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.802 29.274Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

interface SocialChannel {
  name: string;
  handle: string;
  solidColor: string;
  detail: string;
  actionText: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
    icon: InstagramIcon,
  },
  {
    name: "Threads",
    handle: "@fitcheck.startup",
    solidColor: "#000000",
    detail: "Candid engineering dispatches, browser camera tech notes, and weekly boutique onboarding updates.",
    actionText: "Join",
    href: "https://www.threads.com/@fitcheck.startup",
    icon: ThreadsIcon,
  },
  {
    name: "Facebook",
    handle: "FitCheck AI",
    solidColor: "#0866FF",
    detail: "Philippine fashion brand spotlights, Manila pop-up previews, and regional partner announcements.",
    actionText: "Connect",
    href: "https://www.facebook.com/profile.php?id=61596346923689",
    icon: FacebookIcon,
  },
  {
    name: "LinkedIn",
    handle: "FitCheck AI",
    solidColor: "#0A66C2",
    detail: "Fashion tech intelligence, B2B pilot case studies, retail conversion data, and company milestones.",
    actionText: "Connect",
    href: "https://www.linkedin.com/company/145435214/",
    icon: LinkedInIcon,
  },
  {
    name: "Founder Desk",
    handle: "fitcheckai0@gmail.com",
    solidColor: "#EA4335",
    detail: "Custom pilot quotas, boutique catalog onboarding, or technical integration questions for our core team.",
    actionText: "Contact",
    href: "mailto:fitcheckai0@gmail.com",
    icon: GmailIcon,
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

      {/* Editorial List (Clean, unified sans-serif typography with thin dividers) */}
      <div className="divide-y divide-[#d5d5e4] border-y border-[#d5d5e4]">
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;
          return (
            <a
              key={channel.name}
              href={channel.href}
              {...(channel.isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="group flex flex-col gap-4 py-6 sm:py-7 transition-colors duration-200 hover:bg-[#0038ff]/[0.03] px-3 sm:px-6 rounded-sm sm:flex-row sm:items-center sm:justify-between focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff]"
            >
              {/* Channel Identity */}
              <div className="flex items-center gap-4 sm:w-[35%] min-w-0">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-md text-white transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: channel.solidColor }}
                >
                  <Icon />
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
                );
        })}
              </div>
            </section>
          );
        }
