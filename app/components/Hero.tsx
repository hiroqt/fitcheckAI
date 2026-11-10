"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ArrowDown, Compass, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroWordmark } from "./HeroWordmark";
import { useMagnetic } from "@/components/navigation/use-magnetic";

interface HeroProps {
  onOpenPilotModal?: () => void;
}

function MagneticTourButton({ onClick }: { onClick: () => void }) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic({
    strength: 0.25,
    stiffness: 280,
    damping: 22,
  });

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="TOUR 3D"
      className="w-full sm:w-auto"
    >
      <Button
        size="lg"
        onClick={onClick}
        className="w-full sm:w-auto h-13 sm:h-14 px-7 sm:px-8 bg-[#0038FF] hover:bg-[#1A4CFF] text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-[0_0_35px_rgba(0,56,255,0.45)] flex items-center justify-center gap-3 cursor-pointer group active:scale-98"
      >
        <Compass className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300 text-white" />
        <span>Start Website Tour</span>
        <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" />
      </Button>
    </motion.div>
  );
}

function MagneticPilotButton({ onClick }: { onClick?: () => void }) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic({
    strength: 0.25,
    stiffness: 280,
    damping: 22,
  });

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="PILOT INTAKE"
      className="w-full sm:w-auto"
    >
      <Button
        variant="outline"
        size="lg"
        onClick={onClick}
        className="w-full sm:w-auto h-13 sm:h-14 px-7 sm:px-8 border-white/20 bg-black/40 hover:bg-white/[0.08] hover:border-white/40 text-slate-200 font-mono text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer active:scale-98 flex items-center justify-center gap-2 group"
      >
        <span>Apply for Brand Pilot</span>
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Button>
    </motion.div>
  );
}

/**
 * Centered Hero Section with Dynamic Elevation & Letter-by-Letter Wave
 *
 * Initial State (Scroll = 0):
 * - ONLY the text "FITCHECK" is visible, positioned at the exact dead center of the viewport.
 * - Interactive letter-by-letter hover wave: each letter lifts, scales, and turns electric cobalt.
 * - All other elements (Navbar, status line, tagline, descriptions, buttons, stickers) are hidden at 0 opacity.
 *
 * On Scroll:
 * - Descriptions, tagline, status line, and buttons pop up and are placed in the center of the page.
 * - As they pop up, the entire group adjusts a little bit higher in the viewport (-36px) for an elevated stance.
 * - Zoom-out scales smoothly from 1.38x down to baseline 1.00x layout with spring momentum.
 * - Fully centered and composed before scrolling into Scene 2 (InteractiveShowroom).
 */
export function Hero({ onOpenPilotModal }: HeroProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll Progress linked to physical track height
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Heavy, friction-damped spring physics responding dynamically to scroll velocity
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.5,
    restDelta: 0.0005,
  });

  // 1. Zoom-Out Transformation:
  // Starts enlarged (1.38x) and smoothly scales down to baseline (1.0x) over 0 -> 0.70 scroll
  const smoothScale = useTransform(smoothProgress, [0, 0.7, 1.0], [1.38, 1.0, 1.0]);

  // 2. Reveal Opacity for Descriptions, Status, Tagline, and Buttons:
  const revealOpacity = useTransform(smoothProgress, [0.015, 0.18], [0, 1]);

  // 3. Dynamic Vertical Positioning:
  // At scroll = 0: +88px shift places FITCHECK in the exact center of the screen.
  // Once elements pop up: smoothly adjusts to +18px, resting slightly lower and comfortably centered in the viewport.
  const groupShiftY = useTransform(smoothProgress, [0.015, 0.22], [88, 18]);

  // Subtle pop-up lift for secondary elements as they reveal
  const elementsPopY = useTransform(smoothProgress, [0.015, 0.18], [14, 0]);

  // Pointer events: buttons only clickable once revealed
  const revealPointerEvents = useTransform(smoothProgress, (p) =>
    p > 0.04 ? "auto" : "none"
  );

  // 4. Ambient Stickers & Background Watermark (hidden at scroll=0, revealed on scroll)
  const ambientExtrasOpacity = useTransform(smoothProgress, [0.02, 0.22], [0, 1]);
  const watermarkX = useTransform(smoothProgress, [0, 1.0], [0, -140]);

  // 5. Smooth exit transition into subsequent showroom section (0.84 -> 1.0)
  const exitOpacity = useTransform(smoothProgress, [0.84, 1.0], [1.0, 0.15]);
  const exitY = useTransform(smoothProgress, [0.84, 1.0], [0, -45]);

  // Combined vertical translation: elevation adjustment + exit transition
  const containerY = useTransform(
    [groupShiftY, exitY],
    ([shift, exit]) => (shift as number) + (exit as number)
  );

  const startWebsiteTour = () => {
    const el = document.getElementById("scene-showroom");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="scene-hero"
      ref={trackRef}
      className="relative w-full h-[160vh] sm:h-[170vh] select-none"
    >
      {/* Sticky Viewport: Remains locked in screen view as user scrolls down the track */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-8 lg:px-12 pointer-events-none">
        {/* Massive Kinetic Background Watermark (Transforms & drifts underneath hero elements) */}
        <motion.div
          style={{ x: watermarkX, opacity: ambientExtrasOpacity }}
          className="absolute top-1/2 -translate-y-1/2 left-0 font-serif italic text-[18vw] font-bold text-white/[0.025] select-none pointer-events-none whitespace-nowrap leading-none z-0"
        >
          SEE IT ON YOU
        </motion.div>

        {/* 
          Centered Hero Composition:
          - At scroll = 0: FITCHECK is at the exact center of the page.
          - On scroll: Descriptions and other elements pop up and the entire group 
            adjusts a little bit higher in the center of the page before the second page.
        */}
        <motion.div
          style={{
            scale: smoothScale,
            opacity: exitOpacity,
            y: containerY,
          }}
          className="pointer-events-auto relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center will-change-transform transform-gpu px-4"
        >
          {/* Top Status Line: Positioned above FITCHECK, reveals and pops up on scroll */}
          <motion.div
            style={{ opacity: revealOpacity, y: elementsPopY }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-slate-400 mb-2 sm:mb-4 pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#0038FF] animate-pulse shrink-0" />
            <span className="uppercase tracking-widest text-[#0038FF] font-semibold">
              PHILIPPINE BOUTIQUE PILOT
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="hidden sm:inline">ACCEPTING 3–5 APPROVED BRANDS</span>
            <span className="text-white/20 hidden md:inline">•</span>
            <span className="hidden md:inline">MANILA // 2026</span>
          </motion.div>

          {/* 
            1. Monolithic "FITCHECK" Wordmark:
            - Interactive letter-by-letter hover wave with magnetic spring physics
          */}
          <HeroWordmark />

          {/* Bottom Content Group: Tagline, Descriptions & Buttons placed in the center once revealed */}
          <motion.div
            style={{
              opacity: revealOpacity,
              y: elementsPopY,
              pointerEvents: revealPointerEvents,
            }}
            className="w-full flex flex-col items-center"
          >
            {/* Editorial Signature Tagline with Kinetic Stroke Hover */}
            <div className="mt-1 sm:mt-2.5 group cursor-default">
              <span className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-slate-200 tracking-tight transition-all duration-300 group-hover:text-stroke-highlight">
                See it on you.
              </span>
            </div>

            {/* Responsive Minimal Subhead / Descriptions */}
            <p className="mt-2.5 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl font-light leading-relaxed text-center px-4">
              The 30-second live style mirror in your browser. Zero app downloads. Pure visual confidence before checkout.
            </p>

            {/* 2. Interactive Magnetic Action Triggers */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full sm:w-auto px-4">
              <MagneticTourButton onClick={startWebsiteTour} />
              <MagneticPilotButton onClick={onOpenPilotModal} />
            </div>

            {/* Tour & Scroll Prompt */}
            <div className="mt-5 sm:mt-6 flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-slate-500">
              <span className="text-[#0038FF] animate-pulse">●</span>
              <span>SCROLL DOWN TO EXPLORE 3D STAGE</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
