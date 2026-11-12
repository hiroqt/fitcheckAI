"use client";

import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

const HERO_GARMENTS = [
  { name: "jacket", src: "/floating-jacket.webp", alt: "Cobalt technical jacket suspended in midair" },
  { name: "shirt", src: "/floating-shirt.png", alt: "Ivory long-sleeve shirt with intricate cobalt embroidery suspended in midair" },
  { name: "barong", src: "/floating-barong.png", alt: "Ivory embroidered barong suspended in midair" },
];

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const [isHovered, setIsHovered] = useState(false);
  const [garmentIndex, setGarmentIndex] = useState(0);
  const garment = HERO_GARMENTS[garmentIndex];

  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => {
      setGarmentIndex((current) => (current + 1) % HERO_GARMENTS.length);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  // Motion values for smooth cursor physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);

  const springConfig = { damping: 25, stiffness: 180 };
  const garmentRotateX = useSpring(mouseY, springConfig);
  const garmentRotateY = useSpring(mouseX, springConfig);
  const garmentTranslateX = useSpring(mouseX, springConfig);
  const garmentTranslateY = useSpring(mouseY, springConfig);

  const wordmarkTranslateX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const wordmarkTranslateY = useSpring(mouseY, { damping: 30, stiffness: 120 });


  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Garment rotation and shift
    mouseX.set(x * 14); // degrees or px
    mouseY.set(-y * 14);

    // Spotlight percentages
    spotX.set(((e.clientX - rect.left) / rect.width) * 100);
    spotY.set(((e.clientY - rect.top) / rect.height) * 100);
  }, [reducedMotion, mouseX, mouseY, spotX, spotY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <section id="scene-hero" className="campaign-hero relative left-1/2 -ml-[50vw] -mt-2.5 w-screen text-white sm:-mt-4">
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="campaign-stage relative overflow-hidden"
      >
        {/* Cursor-driven subtle radial illumination highlight */}
        {!reducedMotion && isHovered && (
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
            style={{
              background: `radial-gradient(750px circle at ${spotX.get()}% ${spotY.get()}%, rgba(255, 255, 255, 0.12), transparent 70%)`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Viewfinder corner framing brackets (Signature FitCheck motif) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-6 z-10 hidden sm:block">
          <span className="viewfinder-bracket viewfinder-top-left text-white/40" />
          <span className="viewfinder-bracket viewfinder-top-right text-white/40" />
          <span className="viewfinder-bracket viewfinder-bottom-left text-white/40" />
          <span className="viewfinder-bracket viewfinder-bottom-right text-white/40" />
        </div>

        {/* Kinetic Depth Wordmark */}
        <motion.h1
          style={
            reducedMotion
              ? undefined
              : {
                  x: wordmarkTranslateX,
                  y: wordmarkTranslateY,
                }
          }
          className="campaign-wordmark pointer-events-none select-none will-change-transform"
        >
          STYLE, IN MOTION
        </motion.h1>

        {/* Reactive suspended garment */}
        <motion.div
          style={
            reducedMotion
              ? undefined
              : {
                  rotateX: garmentRotateX,
                  rotateY: garmentRotateY,
                  x: garmentTranslateX,
                  y: garmentTranslateY,
                  transformPerspective: 1000,
                }
          }
          className="campaign-garment pointer-events-auto cursor-grab will-change-transform active:cursor-grabbing"
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={garment.name}
              className="absolute inset-0"
              initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -20, scale: 1.02 }}
              transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={garment.src}
                fill
                preload={garmentIndex === 0}
                sizes="(max-width: 767px) 96vw, (max-width: 1400px) 64vw, 896px"
                alt={garment.alt}
                className="object-contain drop-shadow-[0_20px_45px_rgba(0,18,90,0.45)]"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Hero Editorial Copy */}
        <div className="campaign-copy relative z-10">
          <p className="campaign-tagline">
            See it<br /> on you.
          </p>
          <p className="max-w-64 text-base sm:text-lg font-semibold italic tracking-[-0.025em] leading-snug text-white/95">
            See how the featured {garment.name} could look on you.
          </p>
        </div>

        {/* Hero Action */}
        <a
          href="#scene-showroom"
          className="campaign-link relative z-10"
        >
          <span>Open the showroom</span>
          <ArrowDownRight
            size={20}
            aria-hidden="true"
            className="shrink-0"
          />
        </a>
      </div>
    </section>
  );
}
