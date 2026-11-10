"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize smooth scroll on non-touch desktop / supported clients
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Synchronize Lenis state with body/html overflow locks (e.g. fullscreen menu, dialogs)
    const checkOverflow = () => {
      const isLocked =
        document.body.classList.contains("overflow-hidden") ||
        document.documentElement.classList.contains("overflow-hidden") ||
        document.body.style.overflow === "hidden" ||
        document.documentElement.style.overflow === "hidden";

      if (isLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const observer = new MutationObserver(checkOverflow);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
