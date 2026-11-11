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

// Refined easing curve: smooth, snappy, magazine-quality deceleration
const REFINED_EASE = [0.21, 0.47, 0.32, 0.98] as const;

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  margin?: string;
  as?: "div" | "span" | "h1" | "h2" | "h3" | "p" | "section" | "article" | "ul" | "li";
}

const revealVariants: Variants = {
  hidden: (custom?: { yOffset?: number }) => ({
    opacity: 0,
    y: custom?.yOffset ?? 18,
    transition: {
      duration: 0.35,
      ease: REFINED_EASE,
    },
  }),
  visible: (custom?: { delay?: number; duration?: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom?.duration ?? 0.5,
      delay: custom?.delay ?? 0,
      ease: REFINED_EASE,
    },
  }),
};

/**
 * ScrollReveal
 *
 * Smooth bi-directional scroll reveal wrapper with subtle offset (y: 18),
 * snappy duration (0.5s), and clean organic reset when scrolling out of view.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  yOffset = 18,
  once = false,
  margin = "-80px",
  as = "div",
}: ScrollRevealProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  if (reducedMotion) {
    const Tag = as as React.ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionComponent = (motion as unknown as Record<string, typeof motion.div>)[as] || motion.div;

  return (
    <MotionComponent
      variants={revealVariants}
      custom={{ delay, duration, yOffset }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: margin as `${number}px` }}
      className={`will-change-[transform,opacity] ${className}`}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * ScrollHeading
 *
 * Specialized reveal for headings that leads the scroll animation hierarchy (delay: 0).
 */
export function ScrollHeading({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  yOffset = 18,
  once = false,
  margin = "-80px",
  as = "div",
}: ScrollRevealProps) {
  return (
    <ScrollReveal
      className={className}
      delay={delay}
      duration={duration}
      yOffset={yOffset}
      once={once}
      margin={margin}
      as={as}
    >
      {children}
    </ScrollReveal>
  );
}

/**
 * ScrollText
 *
 * Specialized reveal for paragraphs and body copy, trailing the heading by 0.1s
 * for an orderly, editorial reading rhythm.
 */
export function ScrollText({
  children,
  className = "",
  delay = 0.1,
  duration = 0.5,
  yOffset = 18,
  once = false,
  margin = "-80px",
  as = "div",
}: ScrollRevealProps) {
  return (
    <ScrollReveal
      className={className}
      delay={delay}
      duration={duration}
      yOffset={yOffset}
      once={once}
      margin={margin}
      as={as}
    >
      {children}
    </ScrollReveal>
  );
}

export interface ScrollStaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  margin?: string;
}

const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
  visible: (custom = { stagger: 0.08, delayChildren: 0.05 }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.stagger,
      delayChildren: custom.delayChildren,
    },
  }),
};

const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    transition: {
      duration: 0.35,
      ease: REFINED_EASE,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: REFINED_EASE,
    },
  },
};

/**
 * ScrollStagger
 *
 * Choreographed bi-directional container for item groups, grids, and cards.
 */
export function ScrollStagger({
  children,
  className = "",
  stagger = 0.08,
  delayChildren = 0.05,
  once = false,
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
      variants={staggerContainerVariants}
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
    <motion.div variants={staggerItemVariants} className={`will-change-[transform,opacity] ${className}`}>
      {children}
    </motion.div>
  );
}
