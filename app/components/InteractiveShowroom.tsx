"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LiveTryOn } from "./showroom/LiveTryOn";

const GarmentCanvas = dynamic(() => import("./showroom/GarmentCanvas"), {
  ssr: false,
  loading: () => <p role="status" className="m-auto text-sm">Loading 3D preview…</p>,
});

const SWATCHES = [
  { name: "Piña silk", color: "#E8DFC8", roughness: 0.35, metalness: 0.2 },
  { name: "Resort linen", color: "#BDB09E", roughness: 0.8, metalness: 0.05 },
  { name: "Terracotta satin", color: "#BD5B3C", roughness: 0.25, metalness: 0.35 },
  { name: "Inabel weave", color: "#1F2B37", roughness: 0.7, metalness: 0.1 },
];

const CONTROL = "min-h-11 cursor-pointer px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff]";

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
          <h2 id="showroom-title" className="text-balance font-black italic uppercase tracking-[-0.045em] text-4xl sm:text-6xl">
            Explore the showroom.
          </h2>
        </div>
        <div role="group" aria-label="Showroom view" className="flex self-start border border-[#a3acd2] sm:shrink-0">
          <button
            type="button"
            aria-pressed={mode === "live"}
            onClick={() => setMode("live")}
            className={`${CONTROL} aria-pressed:bg-[#0038ff] aria-pressed:text-white`}
          >
            Live try-on
          </button>
          <button
            type="button"
            aria-pressed={mode === "3d"}
            onClick={() => setMode("3d")}
            className={`${CONTROL} aria-pressed:bg-[#0038ff] aria-pressed:text-white`}
          >
            3D materials
          </button>
        </div>
      </div>

      <div className="mt-4">
        {mode === "live" ? (
          <LiveTryOn />
        ) : (
          <div className="flex h-[360px] overflow-hidden bg-[#15152f] text-white sm:h-[460px] lg:h-[540px]">
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
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d5d5e4] py-4">
          <div>
            <h3 className="font-semibold">{activeSwatch.name}</h3>
            <p className="text-sm text-[#51516c]">Drag the sample or use the rotate button.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Material swatches" className="flex gap-1">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() => setActiveSwatch(swatch)}
                  aria-label={swatch.name}
                  aria-pressed={activeSwatch === swatch}
                  className="grid size-11 cursor-pointer place-items-center border border-transparent aria-pressed:border-[#0038ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff]"
                >
                  <span className="size-7 border border-[#101b43]/30" style={{ backgroundColor: swatch.color }} />
                </button>
              ))}
            </div>
            <div className="flex">
              <button type="button" onClick={() => setAngle((current) => current + Math.PI / 6)} className={CONTROL}>
                Rotate
              </button>
              <button
                type="button"
                aria-pressed={wireframe}
                onClick={() => setWireframe((current) => !current)}
                className={`${CONTROL} aria-pressed:bg-[#0038ff] aria-pressed:text-white`}
              >
                Wireframe
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
