"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { scrollGradingController } from "@/lib/color-grading/scroll-grading-controller";

interface Particle {
  x: number;
  y: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
  phaseSpeed: number;
  depth: number; // 0.3 (far) to 1.0 (near)
  colorType: "blue" | "white" | "cyan";
}

interface GlowingOrb {
  xRate: number;
  yRate: number;
  xPhase: number;
  yPhase: number;
  radiusBase: number;
  radiusPulseSpeed: number;
  radiusPulseAmp: number;
  colorRgba?: string;
  currentRgb: { r: number; g: number; b: number };
  targetRgb: { r: number; g: number; b: number };
  parallaxFactor: number;
}

interface AmbientCanvasBackgroundProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
  showConstellations?: boolean;
}

export function AmbientCanvasBackground({
  className,
  particleCount = 55,
  interactive = true,
  showConstellations = true,
}: AmbientCanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = motionQuery.matches;
    setIsReducedMotion(prefersReducedMotion);

    let animationFrameId: number | null = null;
    let isTabVisible = document.visibilityState === "visible";
    let isIntersecting = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Spring damping cursor & continuous idle state engine
    const cursor = {
      targetX: width / 2,
      targetY: height / 2,
      currentX: width / 2,
      currentY: height / 2,
      isHovered: false,
    };

    let lastInteractionTime = performance.now();
    let idleBlend = 1; // 0 = active user interaction, 1 = full ambient idle mode

    // Dynamic color grading subscription state
    let currentFilament = { r: 0, g: 56, b: 255 };
    let targetFilament = { r: 0, g: 56, b: 255 };

    // 1. Configure Persistent Ambient Drifting Radiant Orbs
    const orbs: GlowingOrb[] = [
      {
        xRate: 0.00028,
        yRate: 0.00035,
        xPhase: 0,
        yPhase: 1.2,
        radiusBase: 520,
        radiusPulseSpeed: 0.0007,
        radiusPulseAmp: 80,
        currentRgb: { r: 0, g: 56, b: 255 },
        targetRgb: { r: 0, g: 56, b: 255 },
        parallaxFactor: 0.08,
      },
      {
        xRate: 0.00033,
        yRate: 0.00022,
        xPhase: 2.8,
        yPhase: 0.5,
        radiusBase: 440,
        radiusPulseSpeed: 0.0009,
        radiusPulseAmp: 60,
        currentRgb: { r: 30, g: 64, b: 175 },
        targetRgb: { r: 30, g: 64, b: 175 },
        parallaxFactor: 0.05,
      },
      {
        xRate: 0.00019,
        yRate: 0.00041,
        xPhase: 4.1,
        yPhase: 3.3,
        radiusBase: 380,
        radiusPulseSpeed: 0.0006,
        radiusPulseAmp: 50,
        currentRgb: { r: 14, g: 165, b: 233 },
        targetRgb: { r: 14, g: 165, b: 233 },
        parallaxFactor: 0.03,
      },
    ];

    // Subscribe to dynamic scroll color grading
    const unsubscribeGrading = scrollGradingController.subscribe((preset) => {
      for (let i = 0; i < orbs.length && i < preset.orbs.length; i++) {
        const orb = orbs[i];
        const target = preset.orbs[i];
        if (orb && target) {
          orb.targetRgb = { ...target };
        }
      }
      targetFilament = { ...preset.filamentColor };
    });

    // 2. Initialize Micro-Particles
    const particles: Particle[] = [];
    const colorPalette: Array<"blue" | "white" | "cyan"> = [
      "blue",
      "blue",
      "white",
      "white",
      "cyan",
    ];

    for (let i = 0; i < particleCount; i++) {
      const depth = 0.3 + Math.random() * 0.7; // 0.3 to 1.0
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx: (Math.random() - 0.5) * 0.28 * depth,
        baseVy: (Math.random() - 0.5) * 0.28 * depth,
        radius: (0.8 + Math.random() * 1.6) * depth,
        alpha: 0.2 + Math.random() * 0.6,
        baseAlpha: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.008 + Math.random() * 0.012,
        depth,
        colorType: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      });
    }

    // 3. Handle Clamped Device Pixel Ratio Resize
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // 4. Input Listeners with Spring Damping Target & Activity Telemetry
    const registerInteraction = () => {
      lastInteractionTime = performance.now();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      registerInteraction();
      cursor.targetX = e.clientX;
      cursor.targetY = e.clientY;
      cursor.isHovered = true;
    };

    const handlePointerLeave = () => {
      cursor.isHovered = false;
      registerInteraction();
      cursor.targetX = width / 2;
      cursor.targetY = height / 2;
    };

    const handleScroll = () => {
      registerInteraction();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", registerInteraction, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave, { passive: true });
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // 5. Visibility & Intersection Observers (Battery & GPU saver)
    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
      if (isTabVisible && isIntersecting && !prefersReducedMotion) {
        lastTime = performance.now();
        startLoop();
      } else {
        stopLoop();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting = entry?.isIntersecting ?? true;
        if (isIntersecting && isTabVisible && !prefersReducedMotion) {
          lastTime = performance.now();
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    // 6. Animation Render Loop (Continuous 60FPS Ambient & Idle-independent)
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      // Clamp delta time to avoid large jumps when tab resumes
      const rawDelta = currentTime - lastTime;
      const dt = Math.min(rawDelta, 50); // Clamped to max 50ms
      lastTime = currentTime;

      // Update continuous idle blend transition
      const isIdleNow = currentTime - lastInteractionTime > 2200;
      if (isIdleNow) {
        idleBlend = Math.min(1, idleBlend + (dt / 1000) * 0.8);
      } else {
        idleBlend = Math.max(0, idleBlend - (dt / 1000) * 3.0);
      }

      // Continuous harmonic autonomous wandering waypoint during idle
      const autonomousTargetX =
        width * 0.5 +
        Math.sin(currentTime * 0.00032) * (width * 0.28) +
        Math.cos(currentTime * 0.00017) * (width * 0.12);
      const autonomousTargetY =
        height * 0.45 +
        Math.cos(currentTime * 0.00026) * (height * 0.22) +
        Math.sin(currentTime * 0.00019) * (height * 0.09);

      const effectiveTargetX = cursor.isHovered
        ? cursor.targetX * (1 - idleBlend) + autonomousTargetX * idleBlend
        : autonomousTargetX;
      const effectiveTargetY = cursor.isHovered
        ? cursor.targetY * (1 - idleBlend) + autonomousTargetY * idleBlend
        : autonomousTargetY;

      // Spring damping interpolation towards effective target
      const springFactor = 0.045;
      cursor.currentX += (effectiveTargetX - cursor.currentX) * springFactor;
      cursor.currentY += (effectiveTargetY - cursor.currentY) * springFactor;

      // Normalized coordinates (-1 to 1) for parallax calculation
      const normMouseX = (cursor.currentX / width - 0.5) * 2;
      const normMouseY = (cursor.currentY / height - 0.5) * 2;

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      // Idle respiration pulse multiplier
      const idleBreathingScale = 1 + Math.sin(currentTime * 0.0009) * 0.12 * idleBlend;

      // --- DYNAMIC COLOR GRADING LERP ---
      const colorLerpSpeed = Math.min(1, (dt / 1000) * 4.0);
      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        if (!o) continue;
        o.currentRgb.r += (o.targetRgb.r - o.currentRgb.r) * colorLerpSpeed;
        o.currentRgb.g += (o.targetRgb.g - o.currentRgb.g) * colorLerpSpeed;
        o.currentRgb.b += (o.targetRgb.b - o.currentRgb.b) * colorLerpSpeed;
      }
      currentFilament.r += (targetFilament.r - currentFilament.r) * colorLerpSpeed;
      currentFilament.g += (targetFilament.g - currentFilament.g) * colorLerpSpeed;
      currentFilament.b += (targetFilament.b - currentFilament.b) * colorLerpSpeed;

      // Primary and accent color references for particles
      const orb0 = orbs[0];
      const orb2 = orbs[2] ?? orbs[0];
      const orb0R = orb0 ? Math.round(orb0.currentRgb.r) : 0;
      const orb0G = orb0 ? Math.round(orb0.currentRgb.g) : 56;
      const orb0B = orb0 ? Math.round(orb0.currentRgb.b) : 255;
      const orb2R = orb2 ? Math.round(orb2.currentRgb.r) : 14;
      const orb2G = orb2 ? Math.round(orb2.currentRgb.g) : 165;
      const orb2B = orb2 ? Math.round(orb2.currentRgb.b) : 233;

      // --- LAYER 1: Ambient Fluid Gradient Mesh Orbs (Continuous Motion) ---
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        if (!orb) continue;
        // Organic wandering motion driven by time and harmonic frequencies
        const driftX =
          width * 0.5 +
          Math.sin(currentTime * orb.xRate + orb.xPhase) * (width * 0.38) +
          normMouseX * (width * orb.parallaxFactor);

        const driftY =
          height * 0.45 +
          Math.cos(currentTime * orb.yRate + orb.yPhase) * (height * 0.32) +
          normMouseY * (height * orb.parallaxFactor);

        const pulseRadius =
          (orb.radiusBase +
            Math.sin(currentTime * orb.radiusPulseSpeed) * orb.radiusPulseAmp) *
          idleBreathingScale;

        const grad = ctx.createRadialGradient(
          driftX,
          driftY,
          0,
          driftX,
          driftY,
          pulseRadius
        );

        const r = Math.round(orb.currentRgb.r);
        const g = Math.round(orb.currentRgb.g);
        const b = Math.round(orb.currentRgb.b);

        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.13)`);
        grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.06)`);
        grad.addColorStop(0.85, `rgba(${r}, ${g}, ${b}, 0.012)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(driftX, driftY, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- LAYER 2: Constellation Filaments (Delicate Proximity Lines) ---
      if (showConstellations) {
        const maxDist = 125;
        ctx.lineWidth = 0.65;
        const fr = Math.round(currentFilament.r);
        const fg = Math.round(currentFilament.g);
        const fb = Math.round(currentFilament.b);

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDist * maxDist) {
              const dist = Math.sqrt(distSq);
              const linkAlpha =
                (1 - dist / maxDist) * 0.15 * (p1.depth * p2.depth);

              ctx.strokeStyle = `rgba(${fr}, ${fg}, ${fb}, ${linkAlpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // --- LAYER 3: Micro-Particles (Continuous Brownian Float & Cursor Reactivity) ---
      const timeScale = dt / 16.67; // Normalized to 60fps standard

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Natural idle ambient drift + micro-sine wobble
        p.phase += p.phaseSpeed * timeScale;
        const wobbleX = Math.cos(p.phase) * 0.18 * p.depth;
        const wobbleY = Math.sin(p.phase * 0.8) * 0.18 * p.depth;

        p.x += (p.baseVx + wobbleX) * timeScale;
        p.y += (p.baseVy + wobbleY) * timeScale;

        // 2. Interactive mouse repulsion / gentle spring nudge
        if (cursor.isHovered) {
          const mDx = p.x - cursor.currentX;
          const mDy = p.y - cursor.currentY;
          const mouseDist = Math.hypot(mDx, mDy);
          const mouseRadius = 140;

          if (mouseDist < mouseRadius && mouseDist > 0) {
            const force = (1 - mouseDist / mouseRadius) * 0.6 * p.depth;
            p.x += (mDx / mouseDist) * force * timeScale;
            p.y += (mDy / mouseDist) * force * timeScale;
          }
        }

        // 3. Screen Wrap with soft padding
        const pad = 20;
        if (p.x < -pad) p.x = width + pad;
        if (p.x > width + pad) p.x = -pad;
        if (p.y < -pad) p.y = height + pad;
        if (p.y > height + pad) p.y = -pad;

        // 4. Dynamic breathing alpha
        const currentAlpha =
          p.baseAlpha * (0.75 + Math.sin(p.phase) * 0.25);

        // 5. Draw Particle with soft luminous corona
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.colorType === "blue") {
          ctx.fillStyle = `rgba(${orb0R}, ${orb0G}, ${orb0B}, ${currentAlpha * 0.95})`;
        } else if (p.colorType === "cyan") {
          ctx.fillStyle = `rgba(${orb2R}, ${orb2G}, ${orb2B}, ${currentAlpha * 0.85})`;
        } else {
          ctx.fillStyle = `rgba(248, 250, 252, ${currentAlpha * 0.65})`;
        }

        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!animationFrameId && isTabVisible && isIntersecting) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    // If reduced motion is requested by OS, render a single elegant static frame and exit
    if (prefersReducedMotion) {
      render(0);
      stopLoop();
    } else {
      startLoop();
    }

    // Teardown
    return () => {
      stopLoop();
      unsubscribeGrading();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", registerInteraction);
      document.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [particleCount, interactive, showConstellations]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 h-full w-full overflow-hidden select-none",
        className
      )}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        style={{
          transform: "translateZ(0)",
          willChange: isReducedMotion ? "auto" : "transform",
        }}
      />
    </div>
  );
}
