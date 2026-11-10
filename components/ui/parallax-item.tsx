"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxItemProps {
  children: React.ReactNode;
  speed?: number; // subtle vertical float
  rotateFactor?: number;
  horizontalFactor?: number;
  className?: string;
}

/**
 * ParallaxItem: Adds restrained, luxury floating motion without breaking user ergonomics.
 * Buttons and interactive elements remain grounded and easy to interact with.
 */
export function ParallaxItem({
  children,
  speed = 20,
  rotateFactor = 0,
  horizontalFactor = 0,
  className = "",
}: ParallaxItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Keep motion subtle and ergonomic so content doesn't stray or hinder clicking
  const rawY = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const y = useSpring(rawY, { damping: 25, stiffness: 100 });

  const rawRotate = useTransform(scrollYProgress, [0, 1], [-rotateFactor, rotateFactor]);
  const rotate = useSpring(rawRotate, { damping: 25, stiffness: 100 });

  const rawX = useTransform(scrollYProgress, [0, 1], [-horizontalFactor, horizontalFactor]);
  const x = useSpring(rawX, { damping: 25, stiffness: 100 });

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        x,
        rotate,
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * FloatingSticker: Ambient editorial badge that floats gently in the margins
 */
export function FloatingSticker({
  label,
  sublabel,
  speed = 40,
  rotate = 2,
  className = "",
}: {
  label: string;
  sublabel?: string;
  speed?: number;
  rotate?: number;
  className?: string;
}) {
  return (
    <ParallaxItem
      speed={speed}
      rotateFactor={rotate}
      className={`absolute pointer-events-none select-none z-10 ${className}`}
    >
      <div className="px-3.5 py-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-md text-white font-mono text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF]" />
        <span className="text-slate-200 font-semibold">{label}</span>
        {sublabel && <span className="text-slate-500 hidden sm:inline">{sublabel}</span>}
      </div>
    </ParallaxItem>
  );
}
