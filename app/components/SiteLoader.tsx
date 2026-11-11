"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function SiteLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Check if user prefers reduced motion for immediate dismiss
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const immediateTimer = setTimeout(() => setIsLoading(false), 0);
      return () => clearTimeout(immediateTimer);
    }

    let minTimerDone = false;
    let windowLoaded = typeof document !== "undefined" && document.readyState === "complete";

    const maybeFinish = () => {
      if (minTimerDone && windowLoaded) {
        setIsLoading(false);
      }
    };

    // Paced display time allowing users to comfortably absorb the logo and tagline (~1800ms)
    const minTimer = setTimeout(() => {
      minTimerDone = true;
      maybeFinish();
    }, 1800);

    // Hard fallback timeout (~2600ms) ensuring users are never blocked
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2600);

    const handleLoad = () => {
      windowLoaded = true;
      maybeFinish();
    };

    if (!windowLoaded) {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence onExitComplete={() => setIsMounted(false)}>
      {isLoading && (
        <motion.div
          key="site-loader-overlay"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1], // Cinematic high-end easing
            },
          }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#090A0D] text-white will-change-transform"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {/* Subtle Viewfinder Framing Corners (Signature FitCheck Brand Motif) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 0.45, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pointer-events-none absolute inset-6 sm:inset-12"
            aria-hidden="true"
          >
            <span className="viewfinder-bracket viewfinder-top-left text-white" />
            <span className="viewfinder-bracket viewfinder-top-right text-white" />
            <span className="viewfinder-bracket viewfinder-bottom-left text-white" />
            <span className="viewfinder-bracket viewfinder-bottom-right text-white" />
          </motion.div>

          {/* Central Branded Content */}
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-7 px-4 text-center"
          >
            {/* Prominent, Larger FitCheck Wordmark */}
            <div className="relative">
              <Image
                src="/fitcheck-wordmark.webp"
                width={220}
                height={68}
                alt="FitCheck"
                priority
                className="w-[190px] sm:w-[250px] h-auto brightness-110 drop-shadow-[0_0_32px_rgba(0,56,255,0.45)]"
              />
            </div>

            {/* Minimalist Liquid Progress Meter */}
            <div className="w-48 sm:w-60 h-[2px] rounded-full bg-white/10 overflow-hidden relative">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{
                  duration: 1.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-y-0 left-0 w-full bg-[#0038FF] shadow-[0_0_14px_#0038FF]"
              />
            </div>

            {/* Spaced Sub-Label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-mono text-xs uppercase tracking-[0.34em] text-[#c7cbe0]"
            >
              STYLE, IN MOTION
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
