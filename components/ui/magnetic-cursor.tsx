"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function MagneticCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isPointer, setIsPointer] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for high-end fluid follow physics
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

      // Check if hovering an element with custom cursor metadata
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        setCursorText(cursorTarget.getAttribute("data-cursor") || "");
        setIsPointer(true);
      } else {
        setCursorText("");
        const interactive = target.closest("button, a, input, [role='button']");
        setIsPointer(!!interactive);
      }
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
      {cursorText ? (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="px-3.5 py-1.5 rounded-full bg-[#0038FF] text-white text-[10px] font-mono tracking-widest uppercase font-semibold shadow-[0_0_24px_rgba(0,56,255,0.6)] border border-white/20 whitespace-nowrap"
        >
          {cursorText}
        </motion.div>
      ) : (
        <motion.div
          animate={{
            scale: isPointer ? 1.4 : 1,
            borderColor: isPointer ? "rgba(0, 56, 255, 0.8)" : "rgba(255, 255, 255, 0.4)",
            backgroundColor: isPointer ? "rgba(0, 56, 255, 0.2)" : "rgba(255, 255, 255, 0.08)",
          }}
          transition={{ duration: 0.15 }}
          className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-[1px]"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </motion.div>
      )}
    </motion.div>
  );
}
