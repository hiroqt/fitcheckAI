"use client";

import React from "react";
import { 
  Smartphone, 
  SlidersHorizontal, 
  FileCheck2, 
  ArrowRight, 
  ArrowDown 
} from "lucide-react";

export interface HowItWorksStep {
  /** Step number (e.g., 1, 2, 3 or "1") */
  step: string | number;
  /** Primary title of the step */
  title: string;
  /** Detailed description of the step */
  description: string;
  /** Lucide or custom icon component */
  icon: React.ComponentType<{ className?: string }>;
}

export interface HowItWorksProps {
  /** Optional section HTML id for navigation anchors */
  id?: string;
  /** Optional custom title for the section (defaults to "How does it work") */
  title?: string;
  /** Optional custom subtitle description underneath the header */
  subtitle?: string;
  /** Array of 3 sequential steps */
  steps?: HowItWorksStep[];
  /** Optional additional CSS classes for section wrapper */
  className?: string;
}

const DEFAULT_STEPS: HowItWorksStep[] = [
  {
    step: "1",
    title: "Discovery & Device Setup",
    description:
      "Open the style link directly in your mobile browser or desktop. No app downloads or complex onboarding required.",
    icon: Smartphone,
  },
  {
    step: "2",
    title: "Configure Your Profile",
    description:
      "Select your preferred garment and configure your quick style preferences or snap a single instant photo.",
    icon: SlidersHorizontal,
  },
  {
    step: "3",
    title: "Generate Style Result",
    description:
      "Receive your high-fidelity moving preview immediately with verified size guidance ready for seamless checkout.",
    icon: FileCheck2,
  },
];

export function HowItWorks({
  id = "how-it-works",
  title = "How does it work",
  subtitle = "Experience high-definition style previews in three seamless steps. Built directly into your browser with zero friction.",
  steps = DEFAULT_STEPS,
  className = "",
}: HowItWorksProps) {
  return (
    <section
      id={id}
      aria-labelledby="how-it-works-title"
      className={`w-full bg-[#f8f9fd] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-y border-[#d5d5e4] scroll-mt-20 ${className}`}
    >
      {/* Scoped CSS animations for flowing broken line and traveling arrow */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flowDashHorizontal {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -24;
          }
        }

        @keyframes flowDashVertical {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -24;
          }
        }

        @keyframes arrowGlidingHorizontal {
          0%, 100% {
            transform: translateX(-7px);
          }
          50% {
            transform: translateX(7px);
          }
        }

        @keyframes arrowGlidingVertical {
          0%, 100% {
            transform: translateY(-6px);
          }
          50% {
            transform: translateY(6px);
          }
        }

        .flow-line-dash {
          animation: flowDashHorizontal 1.1s linear infinite;
          opacity: 0.45;
        }

        .flow-line-dash-vertical {
          animation: flowDashVertical 1.1s linear infinite;
          opacity: 0.45;
        }

        .flow-arrow-badge {
          animation: arrowGlidingHorizontal 1.8s ease-in-out infinite;
        }

        .flow-arrow-badge-vertical {
          animation: arrowGlidingVertical 1.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .flow-line-dash,
          .flow-line-dash-vertical,
          .flow-arrow-badge,
          .flow-arrow-badge-vertical {
            animation: none !important;
          }
        }
      `}} />

      <div className="max-w-6xl mx-auto">
        {/* Centered Section Header formatted with website's standard italic editorial heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2
            id="how-it-works-title"
            className="editorial-heading italic text-[#101b43]"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-lg sm:text-xl font-medium tracking-[-0.025em] text-[#253360]">
              {subtitle}
            </p>
          )}
        </div>

        {/* 3-Column Sequential Step Flow */}
        <ol 
          className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 list-none p-0 m-0"
          aria-label="How it works 3-step workflow"
        >
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === steps.length - 1;
            const stepNum = typeof item.step === "number" ? item.step : item.step.replace(/\D/g, "") || (index + 1);

            return (
              <li key={item.step} className="relative flex flex-col items-center text-center">
                {/* Desktop Animated Broken Line Connector with Arrow traveling towards the next step */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="hidden md:flex absolute top-10 sm:top-12 -translate-y-1/2 left-[calc(50%+40px)] sm:left-[calc(50%+48px)] w-[calc(100%+2.5rem-80px)] lg:w-[calc(100%+3rem-96px)] h-10 items-center justify-center pointer-events-none z-10"
                  >
                    {/* Animated Broken (dashed) connecting line flowing towards the next step */}
                    <svg className="absolute inset-x-0 w-full h-4 overflow-visible" fill="none">
                      <line
                        x1="0"
                        y1="8"
                        x2="100%"
                        y2="8"
                        stroke="#0038ff"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                        className="flow-line-dash"
                      />
                    </svg>

                    {/* Arrow Badge with continuous gliding motion toward the next node */}
                    <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-[#0038ff]/40 text-[#0038ff] shadow-sm flex items-center justify-center flow-arrow-badge">
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                    </div>
                  </div>
                )}

                {/* Icon enclosed in a dedicated Card with Step Number Badge sticked to upper right corner */}
                <div className="relative">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-[#d5d5e4] shadow-[0_4px_20px_rgba(16,27,67,0.06)] flex items-center justify-center text-[#0038ff]">
                    {/* Viewfinder Optical Brackets on Icon Card */}
                    <span 
                      aria-hidden="true" 
                      className="absolute top-1.5 left-2 text-[#0038ff]/30 text-[10px] font-mono select-none pointer-events-none"
                    >
                      ⌜
                    </span>
                    <span 
                      aria-hidden="true" 
                      className="absolute top-1.5 right-2 text-[#0038ff]/30 text-[10px] font-mono select-none pointer-events-none"
                    >
                      ⌝
                    </span>
                    <span 
                      aria-hidden="true" 
                      className="absolute bottom-1.5 left-2 text-[#0038ff]/30 text-[10px] font-mono select-none pointer-events-none"
                    >
                      ⌞
                    </span>
                    <span 
                      aria-hidden="true" 
                      className="absolute bottom-1.5 right-2 text-[#0038ff]/30 text-[10px] font-mono select-none pointer-events-none"
                    >
                      ⌟
                    </span>

                    {/* Step Icon */}
                    <Icon className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.8]" />

                    {/* Step Number Circle Badge Sticked to Upper Right Corner of Icon Card */}
                    <div className="absolute -top-2.5 -right-2.5 sm:-top-3 sm:-right-3 z-10">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#101b43] text-white border-2 border-white shadow-md flex items-center justify-center">
                        <span className="font-mono text-xs sm:text-sm font-bold leading-none">
                          {stepNum}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step Title (Frameless) */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101b43] mb-2.5 mt-6">
                  {item.title}
                </h3>

                {/* Step Description (Frameless) */}
                <p className="text-sm sm:text-base leading-relaxed text-[#34436f] font-normal max-w-xs mx-auto">
                  {item.description}
                </p>

                {/* Mobile Animated Broken Line Connector with Down Arrow */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="flex md:hidden flex-col items-center justify-center py-6 pointer-events-none"
                  >
                    <div className="relative flex flex-col items-center justify-center h-14 w-full">
                      {/* Animated vertical dashed line */}
                      <svg className="absolute inset-y-0 h-full w-4 overflow-visible" fill="none">
                        <line
                          x1="8"
                          y1="0"
                          x2="8"
                          y2="100%"
                          stroke="#0038ff"
                          strokeWidth="2"
                          strokeDasharray="6 6"
                          className="flow-line-dash-vertical"
                        />
                      </svg>

                      {/* Animated downward gliding arrow badge */}
                      <div className="relative z-10 w-7 h-7 rounded-full bg-white border border-[#0038ff]/40 text-[#0038ff] shadow-sm flex items-center justify-center flow-arrow-badge-vertical">
                        <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;
