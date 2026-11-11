"use client";

import React, { useSyncExternalStore } from "react";
import { motion, type Variants } from "framer-motion";

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

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  margin?: string;
}

/**
 * ScrollReveal
 *
 * Smooth scroll-triggered floating reveal wrapper.
 * Fades in and slides up by default as elements enter the viewport.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.65,
  yOffset = 24,
  once = true,
  margin = "-80px",
}: ScrollRevealProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: margin as `${number}px` }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Natural deceleration curve
      }}
      className={`will-change-[transform,opacity] ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  margin?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = { stagger: 0.1, delayChildren: 0.05 }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.stagger,
      delayChildren: custom.delayChildren,
    },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * ScrollStagger
 *
 * Choreographed container that triggers child items sequentially in a wave-like rhythm.
 */
export function ScrollStagger({
  children,
  className = "",
  stagger = 0.1,
  delayChildren = 0.05,
  once = true,
  margin = "-80px",
}: ScrollStaggerProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      custom={{ stagger, delayChildren }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: margin as `${number}px` }}
      className={`will-change-[transform,opacity] ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollStaggerItem
 *
 * Individual item inside a ScrollStagger container.
 */
export function ScrollStaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={`will-change-[transform,opacity] ${className}`}>
      {children}
    </motion.div>
  );
}

