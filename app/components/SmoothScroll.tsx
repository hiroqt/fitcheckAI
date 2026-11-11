"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * SmoothScroll
 *
 * Dedicated client-side wrapper providing luxury momentum inertial scrolling via Lenis.
 * Coordinates 60fps render loop via requestAnimationFrame and manages overflow lock
 * synchronization for modals and responsive viewports.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Respect accessibility motion preference
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Initialize Lenis with custom luxury momentum dampening parameters
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential fluid ease-out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      anchors: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      autoRaf: false, // We control the RAF loop explicitly
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      window.__lenis = lenis;
    }

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Watch for modal dialog overflow locks (e.g., Radix UI / PilotModal)
    const syncOverflowLock = () => {
      const isLocked =
        document.body.classList.contains("overflow-hidden") ||
        document.documentElement.classList.contains("overflow-hidden") ||
        document.body.style.overflow === "hidden" ||
        document.documentElement.style.overflow === "hidden" ||
        document.body.hasAttribute("data-scroll-locked");

      if (isLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const observer = new MutationObserver(syncOverflowLock);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style", "data-scroll-locked"],
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== "undefined") {
        window.__lenis = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;

    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          lenisRef.current.scrollTo(target as HTMLElement, {
            offset: 0,
            duration: 1.25,
            force: true,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
          return;
        }
      }
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
