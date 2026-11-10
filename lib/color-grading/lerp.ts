import { ColorGradePreset, RadialLight, RGBColor } from "./types";

/**
 * Linear interpolation between two numbers
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Clamp a number between min and max
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Interpolate RGB color
 */
export function lerpRGB(a: RGBColor, b: RGBColor, t: number): RGBColor {
  return {
    r: Math.round(lerp(a.r, b.r, t)),
    g: Math.round(lerp(a.g, b.g, t)),
    b: Math.round(lerp(a.b, b.b, t)),
  };
}

/**
 * Interpolate Radial Light node
 */
export function lerpRadialLight(a: RadialLight, b: RadialLight, t: number): RadialLight {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    color: lerpRGB(a.color, b.color, t),
    opacity: lerp(a.opacity, b.opacity, t),
    radius: lerp(a.radius, b.radius, t),
  };
}

/**
 * Format RGBColor to CSS rgb string
 */
export function toRgbString(c: RGBColor): string {
  return `${c.r}, ${c.g}, ${c.b}`;
}

/**
 * Format RGBColor and opacity to CSS rgba string
 */
export function toRgbaString(c: RGBColor, alpha: number): string {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha.toFixed(3)})`;
}

/**
 * Deep interpolation between two presets
 */
export function lerpPreset(
  a: ColorGradePreset,
  b: ColorGradePreset,
  t: number
): ColorGradePreset {
  const clampedT = clamp(t, 0, 1);

  return {
    id: clampedT < 0.5 ? a.id : b.id,
    label: clampedT < 0.5 ? a.label : b.label,
    subtitle: clampedT < 0.5 ? a.subtitle : b.subtitle,
    orbs: [
      lerpRGB(a.orbs[0], b.orbs[0], clampedT),
      lerpRGB(a.orbs[1], b.orbs[1], clampedT),
      lerpRGB(a.orbs[2], b.orbs[2], clampedT),
    ],
    filamentColor: lerpRGB(a.filamentColor, b.filamentColor, clampedT),
    spotlight: lerpRadialLight(a.spotlight, b.spotlight, clampedT),
    fillLight: lerpRadialLight(a.fillLight, b.fillLight, clampedT),
    washLight: {
      color: lerpRGB(a.washLight.color, b.washLight.color, clampedT),
      opacity: lerp(a.washLight.opacity, b.washLight.opacity, clampedT),
    },
    baseTint: lerpRGB(a.baseTint, b.baseTint, clampedT),
  };
}
