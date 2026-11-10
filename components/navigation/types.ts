export interface NavMenuItem {
  id: string;
  num: string;
  label: string;
  sub: string;
  category: string;
  badge: string;
  specs: string;
  image: string;
  color?: string;
}

export const NAV_MENU_ITEMS: NavMenuItem[] = [
  {
    id: "scene-hero",
    num: "01",
    label: "Overview",
    sub: "The 30s Live Mirror",
    category: "OPTICAL ENGINE",
    badge: "CAMERA 60FPS",
    specs: "Zero-Download • Ephemeral In-Memory Pipeline",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    color: "#0038FF",
  },
  {
    id: "scene-showroom",
    num: "02",
    label: "Showroom Stage",
    sub: "3D Orbit & Webcam Mirror",
    category: "THREE.JS MESH",
    badge: "360° TEXTURE",
    specs: "Piña-Silk & Inabel • Real-Time Normal Maps",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
    color: "#60A5FA",
  },
  {
    id: "scene-specs",
    num: "03",
    label: "Specifications",
    sub: "Text-Focused Telemetry",
    category: "SYSTEM SPECS",
    badge: "0.84S LATENCY",
    specs: "0 Bytes Biometrics • 14.2KB SDK • ₱499 Unit Cost",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1000&q=80",
    color: "#38BDF8",
  },
  {
    id: "scene-workflow",
    num: "04",
    label: "Assisted Flow",
    sub: "Instagram & TikTok DM Sales",
    category: "DM COMMERCE",
    badge: "3-STEP JOURNEY",
    specs: "Send FitLink • 30s Try-On • GCash / Maya Direct",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80",
    color: "#818CF8",
  },
  {
    id: "scene-pricing",
    num: "05",
    label: "Pilot Economics",
    sub: "₱499 & ₱1,799 Fixed Packs",
    category: "TRANSPARENT ROI",
    badge: "ZERO OVERAGES",
    specs: "Prepaid Packs • 100% Filipino Boutique Focus",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80",
    color: "#38BDF8",
  },
  {
    id: "scene-intake",
    num: "06",
    label: "Brand Intake",
    sub: "3–5 Launch Partners Only",
    category: "METRO MANILA",
    badge: "ACTIVE INTAKE",
    specs: "High-Touch Onboarding • Dedicated Fashion Lead",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80",
    color: "#60A5FA",
  },
  {
    id: "scene-community",
    num: "07",
    label: "Community Hub",
    sub: "Social Network Carousel",
    category: "SOCIAL RADAR",
    badge: "7 CHANNELS",
    specs: "LinkedIn • Threads • IG • Facebook • Gmail • TikTok • WhatsApp",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    color: "#0038FF",
  },
];
