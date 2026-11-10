"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Orbit } from "lucide-react";
import { Button } from "@/components/ui/button";

const GarmentCanvas = dynamic(() => import("./showroom/GarmentCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#0038FF] animate-spin" />
      <span>INITIALIZING 3D ENGINE...</span>
    </div>
  ),
});

interface Swatch {
  id: string;
  name: string;
  collection: string;
  color: string;
  price: string;
  roughness: number;
  metalness: number;
}

const SWATCHES: Swatch[] = [
  {
    id: "pina-silk",
    name: "Modern Piña-Silk Barong",
    collection: "Heritage Evening",
    color: "#E8DFC8",
    price: "₱3,800",
    roughness: 0.35,
    metalness: 0.2,
  },
  {
    id: "resort-linen",
    name: "Tailored Resort Blazer",
    collection: "Tropical Summer",
    color: "#BDB09E",
    price: "₱2,850",
    roughness: 0.8,
    metalness: 0.05,
  },
  {
    id: "terracotta-silk",
    name: "Sandwashed Terracotta Dress",
    collection: "Curated Boutique",
    color: "#BD5B3C",
    price: "₱2,600",
    roughness: 0.25,
    metalness: 0.35,
  },
  {
    id: "inabel-weave",
    name: "Handwoven Inabel Overshirt",
    collection: "Artisanal Studio",
    color: "#1F2B37",
    price: "₱3,400",
    roughness: 0.7,
    metalness: 0.1,
  },
];

export function InteractiveShowroom() {
  const [mode, setMode] = useState<"3d" | "mirror">("3d");
  const [activeSwatch, setActiveSwatch] = useState<Swatch>(SWATCHES[0]);
  const [wireframe, setWireframe] = useState(false);

  // Live Mirror Simulator & Camera Stream
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 30-Second Capped Countdown Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === "mirror" && isCameraActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleStopCamera();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, isCameraActive, countdown]);

  const handleStartCamera = async () => {
    try {
      setCameraError(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      setCountdown(30);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError(true);
      setIsCameraActive(true);
      setCountdown(30);
    }
  };

  const handleStopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  return (
    <section
      id="scene-showroom"
      className="relative w-full flex flex-col justify-center px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto py-12 sm:py-16"
    >
      {/* Top Header & Mode Switcher: Grounded, Clean, High Contrast */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 pb-6 border-b border-white/[0.08] relative z-10"
      >
        <div>
          <span className="font-mono text-[11px] sm:text-xs text-[#0038FF] uppercase tracking-widest block mb-1.5 font-semibold">
            02 / THE INTERACTIVE STAGE
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-white tracking-tight">
            Inspect the drape. Feel the fit.
          </h2>
        </div>

        {/* Dual Mode Switcher: Responsive & Grounded */}
        <div className="inline-flex p-1 rounded-full bg-white/[0.04] border border-white/[0.1] self-start sm:self-auto backdrop-blur-md">
          <button
            onClick={() => {
              setMode("3d");
              handleStopCamera();
            }}
            className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              mode === "3d"
                ? "bg-[#0038FF] text-white shadow-[0_0_20px_rgba(0,56,255,0.4)] font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>3D Garment Orbit</span>
          </button>
          <button
            onClick={() => {
              setMode("mirror");
              if (!isCameraActive) handleStartCamera();
            }}
            className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              mode === "mirror"
                ? "bg-[#0038FF] text-white shadow-[0_0_20px_rgba(0,56,255,0.4)] font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Style Mirror</span>
          </button>
        </div>
      </motion.div>

      {/* Main Full-Bleed Interactive Stage: Scaled responsively */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        data-cursor={mode === "3d" ? "DRAG TO ORBIT" : "LIVE PREVIEW"}
        className="group/stage relative w-full h-[480px] sm:h-[580px] lg:h-[660px] mt-6 sm:mt-8 bg-gradient-to-b from-[#0F1116] to-[#090A0D] rounded-2xl border border-white/[0.08] hover:border-[#0038FF]/40 overflow-hidden select-none flex items-center justify-center shadow-2xl z-10 transition-colors duration-300"
      >
        {/* Optical Viewfinder Corner Brackets with Hover Illumination */}
        <div className="absolute top-4 left-4 text-white/30 group-hover/stage:text-[#0038FF] font-mono text-sm leading-none pointer-events-none z-20 transition-colors duration-300">
          ⌜
        </div>
        <div className="absolute top-4 right-4 text-white/30 group-hover/stage:text-[#0038FF] font-mono text-sm leading-none pointer-events-none z-20 transition-colors duration-300">
          ⌝
        </div>
        <div className="absolute bottom-4 left-4 text-white/30 group-hover/stage:text-[#0038FF] font-mono text-sm leading-none pointer-events-none z-20 transition-colors duration-300">
          ⌞
        </div>
        <div className="absolute bottom-4 right-4 text-white/30 group-hover/stage:text-[#0038FF] font-mono text-sm leading-none pointer-events-none z-20 transition-colors duration-300">
          ⌟
        </div>

        {/* Viewfinder Telemetry Overlay (Top HUD) */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 pointer-events-none z-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-2 h-2 rounded-full bg-[#0038FF] animate-pulse" />
            <span className="tracking-widest uppercase font-semibold text-slate-300">
              {mode === "3d" ? "REALTIME 3D ORBIT" : "WEBCAM MIRROR STREAM"}
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="hidden sm:inline text-slate-500">RES: 1080P</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-slate-500 hidden md:inline">PHILIPPINES DPA ENCRYPTED</span>
            <span className="px-2 sm:px-2.5 py-0.5 rounded bg-white/[0.06] text-white border border-white/[0.1] text-[10px] font-mono">
              {mode === "3d" ? activeSwatch.collection : `SESSION: 00:${countdown < 10 ? `0${countdown}` : countdown}`}
            </span>
          </div>
        </div>

        {/* Mode 1: 3D Garment Showcase */}
        {mode === "3d" && (
          <div className="w-full h-full relative">
            <GarmentCanvas
              color={activeSwatch.color}
              roughness={activeSwatch.roughness}
              metalness={activeSwatch.metalness}
              wireframe={wireframe}
            />

            {/* Bottom HUD: Swatch Picker & Garment Info - Fully Responsive */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3 z-20 pointer-events-none">
              {/* Garment Title & Price */}
              <div className="pointer-events-auto bg-black/80 backdrop-blur-md px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-white/[0.1]">
                <h3 className="text-white font-medium text-xs sm:text-base tracking-tight">
                  {activeSwatch.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs sm:text-sm text-[#0038FF] font-semibold">
                    {activeSwatch.price}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400">· Curated Boutique Drop</span>
                </div>
              </div>

              {/* Swatch Selector Strip - Touch Ergonomic & Kinetic Hover */}
              <div className="pointer-events-auto flex items-center justify-between sm:justify-start gap-2 bg-black/85 backdrop-blur-md p-1.5 sm:p-2 rounded-xl sm:rounded-full border border-white/[0.12] shadow-lg">
                <div className="flex items-center gap-2">
                  {SWATCHES.map((swatch) => (
                    <button
                      key={swatch.id}
                      onClick={() => setActiveSwatch(swatch)}
                      title={swatch.name}
                      data-cursor={swatch.name.toUpperCase()}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center ${
                        activeSwatch.id === swatch.id
                          ? "scale-110 border-white ring-2 ring-[#0038FF] shadow-[0_0_12px_rgba(0,56,255,0.6)]"
                          : "border-white/20 hover:scale-110 opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: swatch.color }}
                    >
                      {activeSwatch.id === swatch.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="w-px h-5 bg-white/20 mx-1" />

                <button
                  onClick={() => setWireframe((prev) => !prev)}
                  className={`px-2.5 sm:px-3 py-1 text-[10px] font-mono rounded-full uppercase transition cursor-pointer ${
                    wireframe
                      ? "bg-white text-black font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {wireframe ? "Wire" : "Solid"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Live Optical Style Mirror */}
        {mode === "mirror" && (
          <div className="w-full h-full relative flex items-center justify-center bg-black">
            {isCameraActive && !cameraError ? (
              <div className="w-full h-full relative flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />

                {/* Garment Draped Alignment Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
                  <div className="w-[260px] h-[340px] sm:w-[360px] sm:h-[480px] rounded-3xl border border-dashed border-[#0038FF]/60 flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#0038FF]/5 to-transparent backdrop-blur-[0.5px]">
                    <div className="w-full flex justify-between text-[10px] font-mono text-[#0038FF]">
                      <span>GARMENT ALIGNMENT</span>
                      <span className="truncate max-w-[140px] text-right">{activeSwatch.name}</span>
                    </div>

                    <div className="text-center">
                      <p className="text-[11px] sm:text-xs font-mono text-slate-300 bg-black/70 px-3 py-1.5 rounded-full border border-white/10">
                        Stand 3–4 feet back • Move naturally
                      </p>
                    </div>

                    <div className="w-full flex justify-between text-[10px] font-mono text-slate-400">
                      <span>AUDIO: MUTED</span>
                      <span>FPS: 60</span>
                    </div>
                  </div>
                </div>

                {/* Live Session Countdown & Stop Control */}
                <div className="absolute bottom-4 sm:bottom-6 flex items-center gap-3 sm:gap-4 z-30">
                  <div className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/85 backdrop-blur border border-white/20 text-white font-mono text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>00:{countdown < 10 ? `0${countdown}` : countdown}</span>
                  </div>
                  <Button
                    onClick={handleStopCamera}
                    variant="outline"
                    className="rounded-full bg-black/85 border-white/20 text-white hover:bg-white/15 text-xs font-mono cursor-pointer"
                  >
                    Stop Preview
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 max-w-md">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0038FF]/10 border border-[#0038FF]/30 flex items-center justify-center text-[#0038FF] mb-5">
                  <Camera className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h4 className="text-xl sm:text-2xl font-serif italic text-white mb-2">
                  Launch the 30-Second Style Mirror
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 font-normal mb-6 leading-relaxed">
                  Experience a moving visual preview in your browser. Audio is disabled by default. No photos or video recordings are saved.
                </p>
                <Button
                  onClick={handleStartCamera}
                  className="bg-[#0038FF] hover:bg-[#1A4CFF] text-white px-6 sm:px-8 py-3 rounded-xl font-mono text-xs uppercase tracking-wider shadow-[0_0_24px_rgba(0,56,255,0.5)] cursor-pointer active:scale-98"
                >
                  Enable Camera Mirror
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Mandatory Regulatory Notice */}
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 px-1 gap-1 relative z-10">
        <span>* Illustrative visual style preview only. Sizing must be verified on seller size chart.</span>
        <span className="hidden sm:inline">Zero app downloads required.</span>
      </div>
    </section>
  );
}
