export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface RadialLight {
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  color: RGBColor;
  opacity: number;
  radius: number; // percentage
}

export interface ColorGradePreset {
  id: string;
  label: string;
  subtitle: string;
  // Canvas background generative drifting orbs [orb1, orb2, orb3]
  orbs: [RGBColor, RGBColor, RGBColor];
  // Constellation filament stroke color
  filamentColor: RGBColor;
  // Directional primary spotlight
  spotlight: RadialLight;
  // Ambient secondary fill light
  fillLight: RadialLight;
  // Ambient horizon / rim wash
  washLight: {
    color: RGBColor;
    opacity: number;
  };
  // Base canvas background tint
  baseTint: RGBColor;
}

export interface SectionGradeConfig {
  id: string;
  preset: ColorGradePreset;
}
