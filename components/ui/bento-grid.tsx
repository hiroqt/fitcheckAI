"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * BentoGrid
 * Container for the text-only architectural telemetry matrix.
 */
export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 max-w-7xl mx-auto w-full",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  className?: string;
  colSpan?: string;
  direction?: "left" | "right" | "bottom";
  delay?: number;
  variant?: "text" | "card";
  indexCode?: string;
  tag?: string;
  badge?: string;
  icon?: React.ReactNode;
  metric?: string;
  label?: string;
  highlightColor?: string; // default cobalt "0, 56, 255"
  header?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

/**
 * BentoCard / TextBentoItem
 * Pure text-only architectural component (no card boxes) that slides in
 * dynamically from the sides when scrolled into view.
 */
export function BentoCard({
  className,
  colSpan = "lg:col-span-4",
  direction = "left",
  delay = 0,
  variant = "text",
  indexCode,
  tag,
  badge,
  icon,
  metric,
  label,
  highlightColor = "0, 56, 255",
  header,
  title,
  description,
  children,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const initialOffset = {
    opacity: 0,
    x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
    y: direction === "bottom" ? 70 : 0,
    scale: 0.95,
  };

  // Pure Text-Only Mode (No Card Boxes)
  if (variant === "text") {
    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={initialOffset}
        whileInView={{
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 170,
            damping: 24,
            mass: 0.85,
            delay,
          },
        }}
        viewport={{ once: false, amount: 0.2 }}
        whileHover={{
          x: direction === "left" ? 8 : direction === "right" ? -8 : 0,
          y: -4,
          transition: { type: "spring", stiffness: 360, damping: 22 },
        }}
        className={cn("col-span-1 group cursor-pointer select-none relative", colSpan, className)}
      >
        <div className="relative flex flex-col justify-between pt-6 pb-6 border-t border-white/[0.1]">
          {/* Top Micro Telemetry Row */}
          <div className="flex items-center justify-between gap-3 pb-3">
            {indexCode && (
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF] group-hover:shadow-[0_0_10px_#0038FF] transition-shadow" />
                <span className="font-mono text-xs font-semibold text-slate-400 group-hover:text-[#60A5FA] tracking-widest uppercase transition-colors">
                  {indexCode}
                </span>
              </div>
            )}

            {(tag || badge) && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-[#93C5FD] transition-colors">
                [{tag || badge}]
              </span>
            )}
          </div>

          {header && <div className="my-1">{header}</div>}

          {/* Giant Raw Typographic Metric (Poster Scale) - Brilliant White with Blue Aura */}
          {metric && (
            <div className="py-2 sm:py-4">
              <span className="font-mono text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter text-white/70 group-hover:text-white group-hover:drop-shadow-[0_0_30px_rgba(0,56,255,0.5)] tabular-nums transition-all duration-300 block">
                {metric}
              </span>
            </div>
          )}

          {/* Bottom Essential Minimal Label */}
          {(label || title) && (
            <div className="pt-3 flex items-center justify-between font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
              <span>{label || title}</span>
              <span className="text-slate-500 group-hover:text-[#60A5FA] transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                ↗
              </span>
            </div>
          )}

          {description && <div className="sr-only">{description}</div>}
          {children}
        </div>
      </motion.div>
    );
  }

  // Classic Card Mode (Fallback if explicitly requested)
  return (
    <motion.div
      initial={initialOffset}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 180,
          damping: 24,
          mass: 0.9,
          delay,
        },
      }}
      viewport={{ once: false, amount: 0.2 }}
      whileHover={{
        y: -8,
        scale: 1.015,
        transition: { type: "spring", stiffness: 380, damping: 22 },
      }}
      className={cn("col-span-1", colSpan)}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0C0E14]/85 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 lg:p-10 select-none shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:border-white/25 hover:shadow-[0_24px_60px_rgba(0,56,255,0.22)] transition-colors duration-300 min-h-[220px] sm:min-h-[250px] w-full",
          className
        )}
      >
        {/* Reactive Hover Radial Border Spotlight Glow */}
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: isHovered
              ? `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${highlightColor}, 0.55), rgba(255, 255, 255, 0.2) 35%, transparent 70%)`
              : "none",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />

        {/* Reactive Inner Ambient Spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: isHovered
              ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${highlightColor}, 0.1), transparent 75%)`
              : "none",
          }}
        />

        {/* Top Micro Index & Tag */}
        <div className="relative z-20 flex items-center justify-between gap-3 pb-3">
          {indexCode && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF] group-hover:shadow-[0_0_8px_#0038FF] transition-shadow" />
              <span className="font-mono text-xs font-semibold text-slate-400 group-hover:text-[#60A5FA] tracking-widest uppercase transition-colors">
                {indexCode}
              </span>
            </div>
          )}

          {(tag || badge) && (
            <span className="px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider bg-white/[0.05] text-slate-300 border border-white/10 group-hover:border-[#0038FF]/40 transition-colors">
              {tag || badge}
            </span>
          )}

          {icon && !(tag || badge) && (
            <div className="text-slate-500 group-hover:text-white transition-colors">
              {icon}
            </div>
          )}
        </div>

        {header && <div className="relative z-20 my-1">{header}</div>}

        {/* Metric */}
        {metric && (
          <div className="relative z-20 py-3 sm:py-5 my-auto">
            <div className="font-mono text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-white tabular-nums group-hover:text-white transition-colors">
              {metric}
            </div>
          </div>
        )}

        {/* Label */}
        {(label || title) && (
          <div className="relative z-20 pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
              {label || title}
            </span>
            <span className="font-mono text-[10px] text-slate-500 group-hover:text-[#60A5FA] transition-colors">
              ↗
            </span>
          </div>
        )}

        {description && <div className="sr-only">{description}</div>}
        {children}
      </div>
    </motion.div>
  );
}
