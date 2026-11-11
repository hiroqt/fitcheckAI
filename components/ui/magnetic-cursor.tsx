"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function MagneticCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isDarkSurface, setIsDarkSurface] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for minimal, fluid follow physics
  const springX = useSpring(cursorX, { damping: 28, stiffness: 350 });
  const springY = useSpring(cursorY, { damping: 28, stiffness: 350 });

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const moveHandler = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("button, a, input, select, textarea, [role='button'], summary");
      setIsPointer(!!interactive);

      // Check surface brightness for optimal contrast
      const darkContainer = target.closest(".campaign-hero, [data-theme='dark'], footer, .bg-\\[\\#15152f\\], .bg-\\[\\#090A0D\\]");
      setIsDarkSurface(!!darkContainer);
    };

    const leaveHandler = () => setIsVisible(false);
    const enterHandler = () => setIsVisible(true);

    window.addEventListener("mousemove", moveHandler, { passive: true });
    document.addEventListener("mouseleave", leaveHandler);
    document.addEventListener("mouseenter", enterHandler);

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseleave", leaveHandler);
      document.removeEventListener("mouseenter", enterHandler);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 will-change-transform"
      style={{
        x: springX,
        y: springY,
      }}
    >
      <motion.div
        animate={{
          scale: isPointer ? 1.5 : 1,
          borderColor: isPointer
            ? isDarkSurface ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 56, 255, 0.7)"
            : isDarkSurface ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 56, 255, 0.3)",
          backgroundColor: isPointer
            ? isDarkSurface ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 56, 255, 0.08)"
            : "transparent",
        }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className="size-5 rounded-full border flex items-center justify-center"
      >
        <div
          className={`size-1 rounded-full ${isDarkSurface ? "bg-white" : "bg-[#0038FF]"}`}
        />
      </motion.div>
    </motion.div>
  );
}
