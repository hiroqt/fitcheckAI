"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Store } from "lucide-react";
import { LaptopMockup } from "./LaptopMockup";

type Scenario = "shopper" | "brand";

interface BrowserScenarioProps {
  onOpenPilotModal?: () => void;
}

function AbstractDrawingsBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Soft atmospheric gradient washes on electric blue */}
      <div className="absolute -left-36 -top-24 size-[36rem] rounded-full bg-blue-400/[0.18] blur-[100px]" />
      <div className="absolute -right-36 -bottom-24 size-[40rem] rounded-full bg-indigo-950/[0.30] blur-[120px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[42rem] rounded-full bg-blue-300/[0.12] blur-[110px]" />

      {/* Minimal abstract contour line art in crisp white/cyan strokes */}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <pattern
            id="abstract-grid-pattern"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.5"
              strokeOpacity="0.08"
            />
            <circle cx="24" cy="24" r="1.2" fill="#ffffff" fillOpacity="0.12" />
          </pattern>

          <linearGradient id="minimal-curve-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="minimal-curve-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Minimal architectural dot grid */}
        <rect width="100%" height="100%" fill="url(#abstract-grid-pattern)" />

        {/* Clean, minimal fluid contour curves */}
        <path
          d="M -100 160 C 350 70, 700 380, 1200 220 C 1500 120, 1800 260, 2200 180"
          stroke="url(#minimal-curve-1)"
          strokeWidth="1.5"
        />
        <path
          d="M -50 220 C 400 130, 750 440, 1250 280 C 1550 180, 1850 320, 2250 240"
          stroke="url(#minimal-curve-1)"
          strokeWidth="1"
          strokeDasharray="6 6"
          strokeOpacity="0.30"
        />

        <path
          d="M -100 500 C 420 620, 850 230, 1350 450 C 1650 570, 1950 410, 2250 510"
          stroke="url(#minimal-curve-2)"
          strokeWidth="1.5"
        />
        <path
          d="M -50 560 C 470 680, 900 290, 1400 510 C 1700 630, 2000 470, 2300 570"
          stroke="url(#minimal-curve-2)"
          strokeWidth="1"
          strokeDasharray="5 7"
          strokeOpacity="0.25"
        />
      </svg>
    </div>
  );
}

const REFINED_EASE = [0.21, 0.47, 0.32, 0.98] as const;

const sectionVariant = {
  hidden: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 0.35,
      ease: REFINED_EASE,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: REFINED_EASE,
    },
  },
};

const textSlideVariant = {
  hidden: (custom?: { x?: number }) => ({
    opacity: 0,
    x: custom?.x ?? -60,
    transition: {
      duration: 0.3,
      ease: REFINED_EASE,
    },
  }),
  visible: (custom?: { delay?: number; duration?: number }) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: custom?.duration ?? 0.65,
      delay: custom?.delay ?? 0,
      ease: REFINED_EASE,
    },
  }),
};

const laptopVariant = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 24,
    transition: {
      duration: 0.35,
      ease: REFINED_EASE,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: REFINED_EASE,
    },
  },
};

export function BrowserScenario({ onOpenPilotModal }: BrowserScenarioProps = {}) {
  const [scenario, setScenario] = useState<Scenario>("shopper");

  return (
    <motion.section
      id="browser-scenario"
      aria-labelledby="browser-scenario-title"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15, margin: "-40px" }}
      className="relative left-1/2 -ml-[50vw] w-screen isolate overflow-hidden border-y border-white/20 bg-[#0038ff] px-5 py-14 text-white shadow-[0_12px_40px_rgba(0,56,255,0.25)] sm:px-8 sm:py-18 lg:px-12 lg:py-24"
    >
      <AbstractDrawingsBackground />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        {/* Left Column: Direct Encouraging CTA with Slide-From-Left Text Animation (Bi-directional) */}
        <div className="max-w-xl">
          <motion.div
            variants={textSlideVariant}
            custom={{ x: -70, delay: 0.1, duration: 0.65 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mb-5"
          >
            <Image
              src="/fitcheck-wordmark.webp"
              alt="FitCheck"
              width={140}
              height={42}
              className="h-8 w-auto sm:h-9"
              priority
            />
          </motion.div>

          <motion.h2
            id="browser-scenario-title"
            variants={textSlideVariant}
            custom={{ x: -80, delay: 0.18, duration: 0.75 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-balance text-3xl font-black italic tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl uppercase"
          >
            See It on You Today!
          </motion.h2>

          <motion.p
            variants={textSlideVariant}
            custom={{ x: -70, delay: 0.26, duration: 0.7 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base font-medium"
          >
            {scenario === "shopper"
              ? "Scan your look or upload a photo on the FitCheck app to preview curated fashion pieces — fast, secure, and hassle-free."
              : "Partner with FitCheck to let shoppers preview your collection right in their browser — fast, secure, and hassle-free."}
          </motion.p>

          {/* Scenario Tabs */}
          <motion.div
            variants={textSlideVariant}
            custom={{ x: -60, delay: 0.34, duration: 0.65 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mt-6 flex flex-wrap gap-2.5"
            role="group"
            aria-label="Choose a scenario"
          >
            <button
              type="button"
              aria-pressed={scenario === "shopper"}
              onClick={() => setScenario("shopper")}
              className={`inline-flex min-h-10 items-center gap-2 rounded-sm px-4 text-xs font-semibold transition-all sm:text-sm cursor-pointer ${scenario === "shopper"
                  ? "bg-white text-[#0038ff] shadow-md font-bold"
                  : "border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50"
                }`}
            >
              <Camera aria-hidden="true" className="size-4" />
              For Shoppers
            </button>

            <button
              type="button"
              aria-pressed={scenario === "brand"}
              onClick={() => setScenario("brand")}
              className={`inline-flex min-h-10 items-center gap-2 rounded-sm px-4 text-xs font-semibold transition-all sm:text-sm cursor-pointer ${scenario === "brand"
                  ? "bg-white text-[#0038ff] shadow-md font-bold"
                  : "border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50"
                }`}
            >
              <Store aria-hidden="true" className="size-4" />
              For Brands
            </button>
          </motion.div>

          {/* Action CTA */}
          <motion.div
            variants={textSlideVariant}
            custom={{ x: -40, delay: 0.42, duration: 0.65 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mt-7"
          >
            {scenario === "shopper" ? (
              <a
                href="#scene-showroom"
                className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-sm bg-white px-7 text-sm font-bold text-[#0038ff] shadow-[0_4px_24px_rgba(0,0,0,0.22)] transition-all hover:bg-blue-50 hover:shadow-[0_6px_30px_rgba(0,0,0,0.30)] active:scale-98 text-center"
              >
                <span>Try It on You Now</span>
                <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onOpenPilotModal) {
                    onOpenPilotModal();
                  } else {
                    const el = document.getElementById("scene-pricing");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-sm bg-white px-7 text-sm font-bold text-[#0038ff] shadow-[0_4px_24px_rgba(0,0,0,0.22)] transition-all hover:bg-blue-50 hover:shadow-[0_6px_30px_rgba(0,0,0,0.30)] active:scale-98 cursor-pointer text-center"
              >
                <span>Apply for Brand Pilot</span>
                <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
              </button>
            )}
          </motion.div>
        </div>

        {/* Right Column: Clean Laptop Visual with Bi-directional Smooth Entry */}
        <motion.div
          variants={laptopVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="relative mx-auto w-full max-w-[46rem]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-12 top-10 -z-10 h-3/4 rounded-full bg-white/10 blur-3xl"
          />

          <LaptopMockup scenario={scenario} />

          <p className="mt-3 text-center text-[11px] text-white/80 font-medium sm:text-xs">
            Visual style aid only. 15-second sessions per verified shopper.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
