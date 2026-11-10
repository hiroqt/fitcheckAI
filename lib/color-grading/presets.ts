import { ColorGradePreset } from "./types";

/**
 * FitCheck AI Dynamic Color Grading Presets
 * Inspired by landonorris.com & OFF+BRAND dark atmospheric lighting.
 * 
 * High-contrast, visceral, and filmic:
 * Exclusively orchestrated across the spectrum of curated blues:
 * Electric Royal Cobalt, Deep Ultramarine, Radiant Indigo, Aero Steel,
 * Sapphire Navy, and Luminous Glacier Cyan.
 */

export const HERO_PRESET: ColorGradePreset = {
  id: "scene-hero",
  label: "Cobalt Ignition",
  subtitle: "30s Live Mirror Initiation",
  orbs: [
    { r: 0, g: 56, b: 255 },    // FitCheck Electric Royal Cobalt
    { r: 30, g: 64, b: 175 },   // Deep Ultramarine
    { r: 14, g: 165, b: 233 },  // Luminous Cyan / Mineral
  ],
  filamentColor: { r: 0, g: 56, b: 255 },
  spotlight: {
    x: 65,
    y: 28,
    color: { r: 0, g: 56, b: 255 },
    opacity: 0.16,
    radius: 55,
  },
  fillLight: {
    x: 25,
    y: 72,
    color: { r: 14, g: 165, b: 233 },
    opacity: 0.09,
    radius: 48,
  },
  washLight: {
    color: { r: 2, g: 12, b: 45 },
    opacity: 0.22,
  },
  baseTint: { r: 9, g: 10, b: 13 },
};

export const SHOWROOM_PRESET: ColorGradePreset = {
  id: "scene-showroom",
  label: "Ultramarine Studio",
  subtitle: "3D Garment Orbit & Webcam Viewfinder",
  orbs: [
    { r: 79, g: 70, b: 229 },   // Radiant Indigo Blue
    { r: 0, g: 56, b: 255 },    // Royal Cobalt
    { r: 99, g: 102, b: 241 },  // Electric Periwinkle
  ],
  filamentColor: { r: 99, g: 102, b: 241 },
  spotlight: {
    x: 50,
    y: 42,
    color: { r: 79, g: 70, b: 229 },
    opacity: 0.20,
    radius: 60,
  },
  fillLight: {
    x: 78,
    y: 75,
    color: { r: 0, g: 56, b: 255 },
    opacity: 0.12,
    radius: 50,
  },
  washLight: {
    color: { r: 8, g: 12, b: 48 },
    opacity: 0.25,
  },
  baseTint: { r: 9, g: 10, b: 16 },
};

export const SPECS_PRESET: ColorGradePreset = {
  id: "scene-specs",
  label: "Telemetry Aero",
  subtitle: "Zero Biometrics & Architecture Bento",
  orbs: [
    { r: 56, g: 189, b: 248 },  // Cyan Sky
    { r: 30, g: 58, b: 138 },   // Deep Oceanic Navy
    { r: 2, g: 132, b: 199 },   // Aero Blue
  ],
  filamentColor: { r: 56, g: 189, b: 248 },
  spotlight: {
    x: 32,
    y: 35,
    color: { r: 2, g: 132, b: 199 },
    opacity: 0.14,
    radius: 52,
  },
  fillLight: {
    x: 80,
    y: 65,
    color: { r: 56, g: 189, b: 248 },
    opacity: 0.10,
    radius: 46,
  },
  washLight: {
    color: { r: 6, g: 18, b: 42 },
    opacity: 0.26,
  },
  baseTint: { r: 9, g: 11, b: 16 },
};

export const WORKFLOW_PRESET: ColorGradePreset = {
  id: "scene-workflow",
  label: "Sapphire Flow",
  subtitle: "Assisted DM Flow & Optical Drape",
  orbs: [
    { r: 37, g: 99, b: 235 },   // Rich Sapphire Blue
    { r: 29, g: 78, b: 216 },   // Celestial Deep Navy
    { r: 96, g: 165, b: 250 },  // Soft Ice Blue
  ],
  filamentColor: { r: 37, g: 99, b: 235 },
  spotlight: {
    x: 70,
    y: 40,
    color: { r: 37, g: 99, b: 235 },
    opacity: 0.16,
    radius: 55,
  },
  fillLight: {
    x: 25,
    y: 60,
    color: { r: 96, g: 165, b: 250 },
    opacity: 0.10,
    radius: 45,
  },
  washLight: {
    color: { r: 3, g: 15, b: 50 },
    opacity: 0.22,
  },
  baseTint: { r: 9, g: 10, b: 15 },
};

export const PRICING_PRESET: ColorGradePreset = {
  id: "scene-pricing",
  label: "Glacier Cobalt",
  subtitle: "Fixed ₱499 & Prepaid Economics",
  orbs: [
    { r: 6, g: 182, b: 212 },   // Glacier Cyan
    { r: 0, g: 56, b: 255 },    // FitCheck Royal Cobalt
    { r: 14, g: 165, b: 233 },  // Electric Sky Blue
  ],
  filamentColor: { r: 6, g: 182, b: 212 },
  spotlight: {
    x: 45,
    y: 35,
    color: { r: 6, g: 182, b: 212 },
    opacity: 0.16,
    radius: 54,
  },
  fillLight: {
    x: 82,
    y: 68,
    color: { r: 0, g: 56, b: 255 },
    opacity: 0.12,
    radius: 46,
  },
  washLight: {
    color: { r: 2, g: 18, b: 46 },
    opacity: 0.22,
  },
  baseTint: { r: 9, g: 11, b: 15 },
};

export const INTAKE_PRESET: ColorGradePreset = {
  id: "scene-intake",
  label: "Cobalt Horizon",
  subtitle: "Metro Manila Brand Intake & Finale",
  orbs: [
    { r: 0, g: 56, b: 255 },    // Electric Royal Cobalt
    { r: 96, g: 165, b: 250 },  // Horizon Ice Blue
    { r: 30, g: 64, b: 175 },   // Deep Ultramarine
  ],
  filamentColor: { r: 0, g: 56, b: 255 },
  spotlight: {
    x: 50,
    y: 52,
    color: { r: 0, g: 56, b: 255 },
    opacity: 0.20,
    radius: 64,
  },
  fillLight: {
    x: 30,
    y: 28,
    color: { r: 96, g: 165, b: 250 },
    opacity: 0.13,
    radius: 48,
  },
  washLight: {
    color: { r: 6, g: 16, b: 52 },
    opacity: 0.24,
  },
  baseTint: { r: 9, g: 10, b: 14 },
};

export const SECTION_PRESETS: ColorGradePreset[] = [
  HERO_PRESET,
  SHOWROOM_PRESET,
  SPECS_PRESET,
  WORKFLOW_PRESET,
  PRICING_PRESET,
  INTAKE_PRESET,
];
