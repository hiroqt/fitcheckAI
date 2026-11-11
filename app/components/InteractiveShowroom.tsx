"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { RotateCw, Box } from "lucide-react";
import { LiveTryOn } from "./showroom/LiveTryOn";

const GarmentCanvas = dynamic(() => import("./showroom/GarmentCanvas"), {
  ssr: false,
  loading: () => <p role="status" className="m-auto text-sm text-[#51516c]">Loading 3D preview…</p>,
});

const SWATCHES = [
  { name: "Piña silk", color: "#E8DFC8", roughness: 0.35, metalness: 0.2 },
  { name: "Resort linen", color: "#BDB09E", roughness: 0.8, metalness: 0.05 },
  { name: "Terracotta satin", color: "#BD5B3C", roughness: 0.25, metalness: 0.35 },
  { name: "Inabel weave", color: "#1F2B37", roughness: 0.7, metalness: 0.1 },
];

export function InteractiveShowroom() {
  const [mode, setMode] = useState<"live" | "3d">("live");
  const [activeSwatch, setActiveSwatch] = useState(SWATCHES[0]);
  const [wireframe, setWireframe] = useState(false);
  const [angle, setAngle] = useState(0);

  return (
    <section
      id="scene-showroom"
      aria-labelledby="showroom-title"
      className="editorial-section scroll-mt-8 text-[#101b43]"
    >
      <div className="flex flex-col justify-between gap-6 border-b border-[#d5d5e4] pb-6 sm:flex-row sm:items-end">
        <div>
          <h2
            id="showroom-title"
            className="text-balance font-black italic uppercase tracking-[-0.045em] text-4xl sm:text-6xl"
          >
            Explore the showroom.
          </h2>
        </div>

        {/* Reactive Segmented View Toggle */}
        <div
          role="group"
          aria-label="Showroom view"
          className="relative flex self-start rounded-md border border-[#a3acd2] bg-white/70 p-1 backdrop-blur-sm sm:shrink-0"
        >
          <button
            type="button"
            aria-pressed={mode === "live"}
            onClick={() => setMode("live")}
            className={`relative z-10 min-h-10 px-5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff] ${
              mode === "live" ? "text-white" : "text-[#101b43]"
            }`}
          >
            {mode === "live" && (
              <motion.div
                layoutId="activeShowroomTab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-sm bg-[#0038ff] shadow-sm"
              />
            )}
            <span className="relative z-10">Try on a look</span>
          </button>

          <button
            type="button"
            aria-pressed={mode === "3d"}
            onClick={() => setMode("3d")}
            className={`relative z-10 min-h-10 px-5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff] ${
              mode === "3d" ? "text-white" : "text-[#101b43]"
            }`}
          >
            {mode === "3d" && (
              <motion.div
                layoutId="activeShowroomTab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-sm bg-[#0038ff] shadow-sm"
              />
            )}
            <span className="relative z-10">3D materials</span>
          </button>
        </div>
      </div>

      <div className="mt-6">
        {mode === "live" ? (
          <LiveTryOn />
        ) : (
          <div
            className="group relative flex h-[380px] overflow-hidden rounded-md border border-[#2b2b52] bg-[#15152f] text-white shadow-xl sm:h-[480px] lg:h-[560px]"
          >
            {/* Viewfinder framing reticles */}
            <span className="viewfinder-bracket viewfinder-top-left text-white/50" />
            <span className="viewfinder-bracket viewfinder-top-right text-white/50" />
            <span className="viewfinder-bracket viewfinder-bottom-left text-white/50" />
            <span className="viewfinder-bracket viewfinder-bottom-right text-white/50" />

            <GarmentCanvas
              color={activeSwatch.color}
              roughness={activeSwatch.roughness}
              metalness={activeSwatch.metalness}
              wireframe={wireframe}
              angle={angle}
            />
          </div>
        )}
      </div>

      {mode === "3d" && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d5d5e4] py-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#0038ff]" />
              <h3 className="font-bold tracking-tight text-[#101b43]">{activeSwatch.name}</h3>
            </div>
            <p className="mt-0.5 text-sm font-medium italic tracking-[-0.02em] text-[#34436f]">Drag the sample in 3D or rotate using the controls.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Swatches */}
            <div role="group" aria-label="Material swatches" className="flex items-center gap-2">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() => setActiveSwatch(swatch)}
                  aria-label={swatch.name}
                  aria-pressed={activeSwatch === swatch}
                  className={`grid size-11 cursor-pointer place-items-center rounded-sm border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff] ${
                    activeSwatch === swatch
                      ? "border-[#0038ff] ring-2 ring-[#0038ff]/30 shadow-md scale-105"
                      : "border-[#d5d5e4] hover:border-[#0038ff]"
                  }`}
                >
                  <span
                    className="size-7 rounded-[2px] border border-black/15 shadow-inner"
                    style={{ backgroundColor: swatch.color }}
                  />
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAngle((current) => current + Math.PI / 6)}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border border-[#a3acd2] bg-white px-4 text-sm font-semibold text-[#101b43] transition-all duration-200 hover:border-[#0038ff] hover:bg-[#eef1ff] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff]"
              >
                <RotateCw size={15} aria-hidden="true" />
                <span>Rotate</span>
              </button>

              <button
                type="button"
                aria-pressed={wireframe}
                onClick={() => setWireframe((current) => !current)}
                className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border px-4 text-sm font-semibold transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff] ${
                  wireframe
                    ? "border-[#0038ff] bg-[#0038ff] text-white shadow-sm"
                    : "border-[#a3acd2] bg-white text-[#101b43] hover:border-[#0038ff] hover:bg-[#eef1ff]"
                }`}
              >
                <Box size={15} aria-hidden="true" />
                <span>Wireframe</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
