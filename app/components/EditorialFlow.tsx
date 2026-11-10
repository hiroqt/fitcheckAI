"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Eye, ShoppingBag, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    label: "CONSULT IN DM",
    title: "Send direct preview link",
    description:
      "Drop a one-tap link in your Instagram, TikTok, or WhatsApp customer consultation.",
    icon: Send,
    telemetry: "LATENCY: <120MS • EPHEMERAL FITLINK",
    previewDetail: "Generates private secure token for customer's Instagram DM session.",
  },
  {
    number: "02",
    label: "30S LIVE PREVIEW",
    title: "Shopper sees it in motion",
    description:
      "Zero app install. A 30-second moving visual mirror opens directly in their browser.",
    icon: Eye,
    telemetry: "CLIENT CAMERA • 60 FPS • AUDIO MUTED",
    previewDetail: "Zero recording saved. Sizing verified alongside seller size guide.",
  },
  {
    number: "03",
    label: "CONFIDENT CHECKOUT",
    title: "Eliminate hesitation",
    description:
      "Shopper verifies style, refers to your size chart, and completes the purchase.",
    icon: ShoppingBag,
    telemetry: "GCASH / MAYA • 2.4X CONVERSION LIFT",
    previewDetail: "Instant return to chat with chosen SKU and confirmed size variant.",
  },
];

export function EditorialFlow() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  return (
    <section
      id="scene-workflow"
      className="relative w-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden py-12 sm:py-16 select-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mb-8 sm:mb-10 border-b border-white/[0.08] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <span className="font-mono text-xs text-[#0038FF] uppercase tracking-widest block mb-2 font-semibold">
            03 / THE ASSISTED WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif italic text-white tracking-tight">
            How it works in boutique retail.
          </h2>
        </div>

        <div className="font-mono text-xs text-slate-500">
          <span>HOVER STEP TO CROSS-HIGHLIGHT</span>
        </div>
      </motion.div>

      {/* 3-Step Typographic Grid with Kinetic & Cross-Highlighting Hover */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        onMouseLeave={() => setHoveredStep(null)}
      >
        {STEPS.map((step, idx) => {
          const isHovered = hoveredStep === step.number;
          const isDimmed = hoveredStep !== null && !isHovered;
          const StepIcon = step.icon;

          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              onMouseEnter={() => setHoveredStep(step.number)}
              onFocus={() => setHoveredStep(step.number)}
              data-cursor={`STEP ${step.number}`}
              className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 transition-all duration-300 cursor-pointer ${
                isHovered
                  ? "bg-[#111318] border-[#0038FF] shadow-[0_0_35px_rgba(0,56,255,0.3)] scale-[1.02] z-10 opacity-100"
                  : isDimmed
                  ? "border-white/[0.06] bg-transparent opacity-40 scale-[0.98]"
                  : "border-white/[0.1] bg-transparent opacity-90 hover:border-white/30"
              }`}
            >
              {/* Corner Viewfinder Optical Brackets on Hover */}
              {isHovered && (
                <>
                  <span className="absolute top-2 left-2.5 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                    ⌜
                  </span>
                  <span className="absolute top-2 right-2.5 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                    ⌝
                  </span>
                  <span className="absolute bottom-2 left-2.5 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                    ⌞
                  </span>
                  <span className="absolute bottom-2 right-2.5 font-mono text-[9px] text-[#0038FF] pointer-events-none select-none">
                    ⌟
                  </span>
                </>
              )}

              {/* Minimal Monospace Index with Kinetic Stroke Morph */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-4xl sm:text-5xl font-light tracking-tight transition-all duration-300 ${
                      isHovered
                        ? "text-stroke-highlight scale-105"
                        : "text-slate-500"
                    }`}
                  >
                    {step.number}
                  </span>
                  {isHovered && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF] shadow-[0_0_8px_#0038FF] animate-pulse" />
                  )}
                </div>

                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                    isHovered
                      ? "bg-[#0038FF] border-[#0038FF] text-white shadow-[0_0_15px_rgba(0,56,255,0.5)] rotate-6"
                      : "bg-white/5 border-white/10 text-slate-400"
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                </div>
              </div>

              {/* Kinetic Indentation on Title */}
              <div className="transition-transform duration-300 ease-out group-hover:translate-x-2">
                <span className="font-mono text-[10px] tracking-widest text-[#0038FF] uppercase font-semibold block mb-2">
                  {step.label}
                </span>

                <h3 className="text-xl sm:text-2xl font-serif italic text-white mb-3 tracking-tight flex items-center justify-between">
                  <span>{step.title}</span>
                  <ArrowRight
                    className={`w-4 h-4 text-[#60A5FA] transition-all duration-300 ${
                      isHovered ? "opacity-100 translate-x-1" : "opacity-0 -translate-x-2"
                    }`}
                  />
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed mb-6">
                {step.description}
              </p>

              {/* Live Step Telemetry Reveal */}
              <div
                className={`mt-auto pt-4 border-t transition-all duration-300 font-mono text-[10px] ${
                  isHovered
                    ? "border-white/15 text-[#60A5FA]"
                    : "border-white/5 text-slate-500"
                }`}
              >
                <span>{step.telemetry}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Telemetry Status Footer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={hoveredStep || "idle"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="mt-8 px-6 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-400 gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0038FF] animate-pulse" />
            <span className="text-slate-300 uppercase">
              {hoveredStep
                ? `ACTIVE INSPECTION: STAGE ${hoveredStep}`
                : "THREE-BEAT ASSISTED WORKFLOW"}
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            {hoveredStep
              ? STEPS.find((s) => s.number === hoveredStep)?.previewDetail
              : "Zero technical setup • Integrates with existing boutique DM chats"}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
