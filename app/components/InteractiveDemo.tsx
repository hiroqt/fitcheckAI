"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  CameraOff,
  Clock,
  RotateCcw,
  ShieldCheck,
  Check,
  Ruler,
  AlertCircle,
  Eye,
  Info,
  ExternalLink,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Garment {
  id: string;
  name: string;
  price: string;
  category: string;
  fabric: string;
  colorHex: string;
  modelSilhouette: string;
  sizeChart: { size: string; chest: string; waist: string; length: string }[];
}

const SAMPLE_GARMENTS: Garment[] = [
  {
    id: "barong",
    name: "Modern Piña-Silk Barong",
    price: "₱3,800",
    category: "Formal & Heritage",
    fabric: "Raw Piña-Silk organza with point collar",
    colorHex: "#F2EBD9",
    modelSilhouette: "Contemporary relaxed fit with structured shoulder line",
    sizeChart: [
      { size: "S", chest: "38 in (96 cm)", waist: "34 in (86 cm)", length: "28 in (71 cm)" },
      { size: "M", chest: "40 in (101 cm)", waist: "36 in (91 cm)", length: "29 in (74 cm)" },
      { size: "L", chest: "42 in (106 cm)", waist: "38 in (96 cm)", length: "30 in (76 cm)" },
      { size: "XL", chest: "44 in (112 cm)", waist: "40 in (101 cm)", length: "31 in (79 cm)" },
    ],
  },
  {
    id: "linen-blazer",
    name: "Tailored Linen Resort Blazer",
    price: "₱2,850",
    category: "Contemporary Tailoring",
    fabric: "100% Breathable Tropical Linen",
    colorHex: "#C2B29F",
    modelSilhouette: "Soft deconstructed shoulder, double-vented back",
    sizeChart: [
      { size: "S", chest: "39 in (99 cm)", waist: "33 in (84 cm)", length: "28.5 in (72 cm)" },
      { size: "M", chest: "41 in (104 cm)", waist: "35 in (89 cm)", length: "29.5 in (75 cm)" },
      { size: "L", chest: "43 in (109 cm)", waist: "37 in (94 cm)", length: "30.5 in (77 cm)" },
      { size: "XL", chest: "45 in (114 cm)", waist: "39 in (99 cm)", length: "31.5 in (80 cm)" },
    ],
  },
  {
    id: "terracotta-midi",
    name: "Bias-Cut Terracotta Midi Dress",
    price: "₱2,600",
    category: "Curated Boutique",
    fabric: "Washed Sand Silk Satin",
    colorHex: "#BD5B3C",
    modelSilhouette: "Fluid drape, cowl neckline, adjustable back straps",
    sizeChart: [
      { size: "XS", chest: "32 in (81 cm)", waist: "25 in (63 cm)", length: "47 in (119 cm)" },
      { size: "S", chest: "34 in (86 cm)", waist: "27 in (68 cm)", length: "48 in (122 cm)" },
      { size: "M", chest: "36 in (91 cm)", waist: "29 in (73 cm)", length: "49 in (124 cm)" },
      { size: "L", chest: "38 in (96 cm)", waist: "31 in (78 cm)", length: "50 in (127 cm)" },
    ],
  },
  {
    id: "inabel-jacket",
    name: "Handwoven Inabel Work Jacket",
    price: "₱3,400",
    category: "Artisanal Streetwear",
    fabric: "Ilocos loom-woven cotton twill",
    colorHex: "#2C3E50",
    modelSilhouette: "Boxy silhouette with brass hardware",
    sizeChart: [
      { size: "S", chest: "41 in (104 cm)", waist: "40 in (101 cm)", length: "26 in (66 cm)" },
      { size: "M", chest: "43 in (109 cm)", waist: "42 in (106 cm)", length: "27 in (68 cm)" },
      { size: "L", chest: "45 in (114 cm)", waist: "44 in (112 cm)", length: "28 in (71 cm)" },
    ],
  },
];

type MirrorState = "idle" | "consent" | "active" | "ended";

export function InteractiveDemo() {
  const [selectedGarment, setSelectedGarment] = useState<Garment>(SAMPLE_GARMENTS[0]);
  const [activeTab, setActiveTab] = useState<"mirror" | "size-chart">("mirror");
  const [mirrorState, setMirrorState] = useState<MirrorState>("idle");
  const [timeLeft, setTimeLeft] = useState(30);
  const [motionSimulationAngle, setMotionSimulationAngle] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle 30-second countdown session
  useEffect(() => {
    if (mirrorState === "active") {
      const id = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setMirrorState("ended");
            return 0;
          }
          return prev - 1;
        });
        setMotionSimulationAngle((prev) => (prev + 12) % 360);
      }, 1000);
      timerRef.current = id;
      return () => clearInterval(id);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mirrorState]);

  const handleStartSession = () => {
    setTimeLeft(30);
    setMirrorState("active");
  };

  const handleStopSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setMirrorState("ended");
  };

  const handleReset = () => {
    setMirrorState("idle");
    setTimeLeft(30);
  };

  return (
    <section id="mirror-demo" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Target anchor alias */}
      <div id="interactive-demo" className="scroll-mt-24" />

      {/* Center Aligned Section Header & Badge */}
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-[#0038FF]/30 bg-[#0038FF]/10 text-xs font-mono uppercase tracking-widest text-[#60A5FA] mb-4 mx-auto text-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF]" />
          <span>Interactive Browser Mirror</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight text-balance">
          Experience the 30-second browser style mirror
        </h2>
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed text-balance max-w-2xl mx-auto">
          This is the exact browser sandbox experienced by high-intent shoppers. Test the 30-second capped session, camera consent requirements, and mandatory size chart verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Garment Selector & Physical Size Chart */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111318] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Garment Catalog (Philippine Pilot)
              </span>
              <span className="text-xs font-mono text-[#60A5FA]">
                4 Styles Ready
              </span>
            </div>

            {/* Garment Selector */}
            <div className="space-y-2.5">
              {SAMPLE_GARMENTS.map((garment) => (
                <button
                  key={garment.id}
                  onClick={() => {
                    setSelectedGarment(garment);
                    if (mirrorState === "ended") handleReset();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    selectedGarment.id === garment.id
                      ? "border-[#0038FF] bg-[#0038FF]/10 text-white"
                      : "border-white/[0.06] bg-white/[0.02] text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: garment.colorHex }}
                    />
                    <div>
                      <div className="text-sm font-medium text-white">{garment.name}</div>
                      <div className="text-xs font-mono text-slate-400">{garment.fabric}</div>
                    </div>
                  </div>
                  <div className="text-sm font-mono font-semibold text-slate-200 tabular-nums">
                    {garment.price}
                  </div>
                </button>
              ))}
            </div>

            {/* Tab: Mirror vs Size Chart */}
            <div className="pt-4 border-t border-white/[0.08]">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/40 border border-white/[0.06]">
                <button
                  onClick={() => setActiveTab("mirror")}
                  className={`py-2 text-xs font-mono rounded-lg transition cursor-pointer ${
                    activeTab === "mirror"
                      ? "bg-[#0038FF] text-white font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Mirror Viewport
                </button>
                <button
                  onClick={() => setActiveTab("size-chart")}
                  className={`py-2 text-xs font-mono rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === "size-chart"
                      ? "bg-[#0038FF] text-white font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart (Step 4)</span>
                </button>
              </div>
            </div>

            {/* Active Garment Context */}
            <div className="text-xs space-y-2 text-slate-400 bg-black/30 p-4 rounded-xl border border-white/[0.04]">
              <div className="flex justify-between">
                <span>Selected Silhouette:</span>
                <span className="text-slate-200">{selectedGarment.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Intended Fit:</span>
                <span className="text-slate-200">{selectedGarment.modelSilhouette}</span>
              </div>
              <div className="flex justify-between text-[#60A5FA]">
                <span>Session Allowance:</span>
                <span>30 Seconds Max</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The Optical Viewfinder Live Mirror Viewport */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-white/[0.12] bg-[#0E1015] p-6 sm:p-8 relative shadow-2xl overflow-hidden">
            {/* Viewfinder Header Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0038FF] animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
                  FitCheck Optical Viewfinder
                </span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Audio Muted</span>
                </div>
                {mirrorState === "active" && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-semibold tabular-nums">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Viewport Screen */}
            {activeTab === "size-chart" ? (
              /* Physical Size Chart View (Step 4 in Customer Decision Journey) */
              <div className="min-h-[380px] rounded-xl bg-black/60 border border-white/[0.08] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {selectedGarment.name} — Spec Measurement Chart
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Brand Standard Sizing (cm & inches)
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded border border-[#10B981]/20">
                      Step 4 Verification
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/[0.08] text-slate-400">
                          <th className="py-2.5 px-3">Size</th>
                          <th className="py-2.5 px-3">Chest / Bust</th>
                          <th className="py-2.5 px-3">Waist</th>
                          <th className="py-2.5 px-3">Garment Length</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-slate-200">
                        {selectedGarment.sizeChart.map((row) => (
                          <tr key={row.size} className="hover:bg-white/[0.02]">
                            <td className="py-2.5 px-3 font-bold text-white">{row.size}</td>
                            <td className="py-2.5 px-3">{row.chest}</td>
                            <td className="py-2.5 px-3">{row.waist}</td>
                            <td className="py-2.5 px-3">{row.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                  <p>
                    Measurements represent finished garment dimensions with garment laying flat.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("mirror")}
                    className="h-8 text-xs font-mono cursor-pointer"
                  >
                    Return to Mirror
                  </Button>
                </div>
              </div>
            ) : (
              /* The Live Optical Mirror Display */
              <div className="relative min-h-[380px] rounded-xl bg-black/80 border border-white/[0.08] overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                {/* Cobalt Blue Camera Viewfinder Brackets */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#0038FF] pointer-events-none" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#0038FF] pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#0038FF] pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#0038FF] pointer-events-none" />

                {/* Sub-State: Idle (Before consent) */}
                {mirrorState === "idle" && (
                  <div className="max-w-md space-y-4 py-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#0038FF]/15 border border-[#0038FF]/30 mx-auto flex items-center justify-center text-[#60A5FA]">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white tracking-tight">
                        Live Style Preview Sandbox
                      </h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Test how the <span className="text-white font-medium">{selectedGarment.name}</span> looks while moving in browser. Preview is capped at exactly 30 seconds.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button
                        size="lg"
                        onClick={() => setMirrorState("consent")}
                        className="h-11 px-6 bg-[#0038FF] hover:bg-[#1A4CFF] text-white text-xs font-mono uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(0,56,255,0.4)] cursor-pointer"
                      >
                        Request Camera Preview (30s)
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400 pt-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>RA 10173 Compliant • Audio Disabled • No Face Saved</span>
                    </div>
                  </div>
                )}

                {/* Sub-State: Informed Consent Modal */}
                {mirrorState === "consent" && (
                  <div className="max-w-md space-y-4 py-4 text-left bg-[#141822] p-6 rounded-xl border border-white/[0.12] shadow-xl">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                      <ShieldCheck className="w-5 h-5 text-[#0038FF]" />
                      <h4 className="text-sm font-semibold text-white">
                        Camera Consent & Processing Notice
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      To generate your 30-second moving style preview, FitCheck temporarily streams video frames to our generative model.
                    </p>

                    <div className="space-y-2 text-xs font-mono text-slate-400 bg-black/40 p-3 rounded-lg border border-white/[0.04]">
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
                        <span>Preview duration: strictly capped at 30 seconds</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
                        <span>Microphone / audio is completely disabled</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
                        <span>Stop preview button available at every second</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setMirrorState("idle")}
                        className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleStartSession}
                        className="bg-[#0038FF] hover:bg-[#1A4CFF] text-white text-xs font-mono rounded cursor-pointer"
                      >
                        Grant Consent & Begin (30s)
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sub-State: Active 30-Second Streaming Mirror */}
                {mirrorState === "active" && (
                  <div className="w-full h-full flex flex-col justify-between py-2 relative">
                    {/* Simulated Generative Motion Canvas */}
                    <div className="my-auto relative flex flex-col items-center justify-center">
                      {/* Generative drape silhouette moving smoothly */}
                      <div
                        className="w-48 h-64 rounded-2xl relative transition-transform duration-700 ease-out border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-inner"
                        style={{
                          backgroundColor: `${selectedGarment.colorHex}25`,
                          transform: `rotate(${Math.sin((motionSimulationAngle * Math.PI) / 180) * 3}deg) translateY(${Math.cos((motionSimulationAngle * Math.PI) / 180) * 4}px)`,
                        }}
                      >
                        {/* Garment Drape Visualization Overlay */}
                        <div
                          className="w-36 h-48 rounded-xl border border-white/20 shadow-2xl flex flex-col items-center justify-center p-3 relative"
                          style={{ backgroundColor: selectedGarment.colorHex }}
                        >
                          <span className="text-[10px] font-mono font-bold tracking-wider text-black/80 uppercase">
                            LIVE STYLE PREVIEW
                          </span>
                          <span className="text-xs font-semibold text-black/90 text-center mt-1">
                            {selectedGarment.name}
                          </span>
                          <div className="mt-3 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px] tracking-wider">
                            MOVING DRAPE SIMULATION
                          </div>
                        </div>

                        {/* Motion tracking nodes */}
                        <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>POSE TRACKED</span>
                        </div>
                      </div>

                      <div className="mt-4 text-xs font-mono text-slate-300">
                        Move or turn gently to preview silhouette flow
                      </div>
                    </div>

                    {/* Viewport Floating Controls */}
                    <div className="pt-4 flex items-center justify-between w-full border-t border-white/[0.08] text-xs font-mono">
                      <div className="text-slate-400">
                        Remaining: <span className="text-white font-bold tabular-nums">00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                      </div>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleStopSession}
                        className="h-8 px-3 text-xs font-mono bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 rounded cursor-pointer"
                      >
                        <CameraOff className="w-3.5 h-3.5" />
                        <span>Stop Preview Now</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sub-State: Session Ended Cleanly */}
                {mirrorState === "ended" && (
                  <div className="max-w-md space-y-4 py-8">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 mx-auto flex items-center justify-center text-slate-300">
                      <Clock className="w-6 h-6" />
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-white">
                        30-Second Style Session Finished
                      </h4>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        Camera stream disconnected. Shopper is prompted to verify exact dimensions against the brand&apos;s physical size chart before placing an order.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleReset}
                        className="text-xs font-mono text-slate-300 border-white/10 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        Restart Demo
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setActiveTab("size-chart")}
                        className="bg-[#0038FF] hover:bg-[#1A4CFF] text-white text-xs font-mono cursor-pointer"
                      >
                        Check Size Chart (Step 4)
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 14 Customer-Facing Disclaimer (Mandatory) */}
            <div className="mt-4 rounded-lg bg-black/40 border border-white/[0.06] p-3 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#0038FF] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-normal">
                <span className="font-semibold text-slate-200">FitCheck Official Disclaimer: </span>
                FitCheck provides an illustrative visual style preview. Results may vary and do not guarantee physical sizing, material behavior, or garment fit. Always check the physical size chart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
