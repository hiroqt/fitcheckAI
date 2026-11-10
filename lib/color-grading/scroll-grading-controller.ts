"use client";

import { ColorGradePreset } from "./types";
import { SECTION_PRESETS, HERO_PRESET, INTAKE_PRESET } from "./presets";
import { lerpPreset } from "./lerp";

export type GradeSubscriber = (preset: ColorGradePreset) => void;

class ScrollGradingController {
  private targetPreset: ColorGradePreset = { ...HERO_PRESET };
  private currentPreset: ColorGradePreset = { ...HERO_PRESET };
  private subscribers: Set<GradeSubscriber> = new Set();
  private rafId: number | null = null;
  private isInitialized = false;
  private isRunning = false;
  private sectionPositions: { id: string; top: number; center: number; preset: ColorGradePreset }[] = [];
  private lastUpdateTime = 0;
  private activeSectionId = HERO_PRESET.id;

  public init() {
    if (typeof window === "undefined" || this.isInitialized) return;
    this.isInitialized = true;

    this.recalculatePositions = this.recalculatePositions.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.tick = this.tick.bind(this);

    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.recalculatePositions, { passive: true });

    // Initial measurement after DOM paint
    setTimeout(() => {
      this.recalculatePositions();
      this.onScroll();
      this.startLoop();
    }, 100);
  }

  public recalculatePositions() {
    if (typeof window === "undefined") return;

    const scrollY = window.scrollY || window.pageYOffset;
    const positions: { id: string; top: number; center: number; preset: ColorGradePreset }[] = [];

    SECTION_PRESETS.forEach((preset) => {
      const el = document.getElementById(preset.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollY;
        const height = rect.height;
        positions.push({
          id: preset.id,
          top,
          center: top + height / 2,
          preset,
        });
      }
    });

    // Also account for footer if present
    const footerEl = document.getElementById("scene-footer") || document.querySelector("footer");
    if (footerEl) {
      const rect = footerEl.getBoundingClientRect();
      const top = rect.top + scrollY;
      const height = rect.height;
      positions.push({
        id: "scene-footer",
        top,
        center: top + height / 2,
        preset: INTAKE_PRESET,
      });
    }

    // Sort by vertical position
    positions.sort((a, b) => a.center - b.center);
    this.sectionPositions = positions;
  }

  public onScroll() {
    if (this.sectionPositions.length === 0) {
      this.recalculatePositions();
      if (this.sectionPositions.length === 0) return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const viewportCenter = scrollY + viewportHeight * 0.45; // slightly above vertical middle for natural reading focus

    // If above first section
    if (viewportCenter <= this.sectionPositions[0].center) {
      this.targetPreset = this.sectionPositions[0].preset;
      this.activeSectionId = this.sectionPositions[0].id;
      return;
    }

    // If below last section
    const lastIdx = this.sectionPositions.length - 1;
    if (viewportCenter >= this.sectionPositions[lastIdx].center) {
      this.targetPreset = this.sectionPositions[lastIdx].preset;
      this.activeSectionId = this.sectionPositions[lastIdx].id;
      return;
    }

    // Find the two sections we are currently between
    for (let i = 0; i < lastIdx; i++) {
      const secA = this.sectionPositions[i];
      const secB = this.sectionPositions[i + 1];

      if (viewportCenter >= secA.center && viewportCenter <= secB.center) {
        const range = secB.center - secA.center;
        const progress = range > 0 ? (viewportCenter - secA.center) / range : 0;
        
        this.targetPreset = lerpPreset(secA.preset, secB.preset, progress);
        this.activeSectionId = progress < 0.5 ? secA.id : secB.id;
        return;
      }
    }
  }

  private tick(now: number) {
    if (!this.lastUpdateTime) this.lastUpdateTime = now;
    const deltaMs = Math.min(now - this.lastUpdateTime, 40);
    this.lastUpdateTime = now;

    // Frame-rate independent exponential smoothing factor (~0.07 at 60fps)
    const factor = 1 - Math.exp((-deltaMs / 1000) * 4.5);

    // Smoothly lerp current towards target
    this.currentPreset = lerpPreset(this.currentPreset, this.targetPreset, factor);

    // Broadcast to subscribers
    this.notifySubscribers();

    this.rafId = requestAnimationFrame(this.tick);
  }

  private startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastUpdateTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  public subscribe(callback: GradeSubscriber): () => void {
    this.subscribers.add(callback);
    // Immediately emit current preset to new subscriber
    callback(this.currentPreset);

    // Ensure loop is running
    if (!this.isRunning && typeof window !== "undefined") {
      this.init();
      this.startLoop();
    }

    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    for (const sub of this.subscribers) {
      sub(this.currentPreset);
    }
  }

  public getCurrentPreset(): ColorGradePreset {
    return this.currentPreset;
  }

  public getTargetPreset(): ColorGradePreset {
    return this.targetPreset;
  }

  public getActiveSectionId(): string {
    return this.activeSectionId;
  }

  public destroy() {
    if (typeof window === "undefined") return;
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.recalculatePositions);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.subscribers.clear();
    this.isInitialized = false;
    this.isRunning = false;
  }
}

export const scrollGradingController = new ScrollGradingController();
