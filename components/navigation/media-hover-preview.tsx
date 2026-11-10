"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavMenuItem } from "./types";

interface MediaHoverPreviewProps {
  activeItem: NavMenuItem;
  items: NavMenuItem[];
  onItemSelect: (item: NavMenuItem) => void;
  onItemClick: (id: string) => void;
}

export function MediaHoverPreview({
  activeItem,
  items,
  onItemSelect,
  onItemClick,
}: MediaHoverPreviewProps) {
  return (
    <div className="relative w-full flex flex-col justify-between gap-4 pointer-events-auto">
      {/* 1. Large Hero Viewfinder Preview Container */}
      <div className="relative w-full aspect-[16/10] max-h-[260px] xl:max-h-[300px] rounded-2xl overflow-hidden bg-[#111318] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Optical Viewfinder Corner Brackets */}
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none font-mono text-[10px] text-white/50 select-none">
          ⌜
        </div>
        <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none font-mono text-[10px] text-white/50 select-none">
          ⌝
        </div>
        <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none font-mono text-[10px] text-white/50 select-none">
          ⌞
        </div>
        <div className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none font-mono text-[10px] text-white/50 select-none">
          ⌟
        </div>

        {/* Live HUD Floating Badges */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF] animate-pulse" />
            <span className="font-mono text-[9px] font-semibold tracking-widest uppercase text-slate-200">
              {activeItem.category}
            </span>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-[#0038FF]/20 backdrop-blur-md border border-[#0038FF]/40">
            <span className="font-mono text-[9px] font-semibold tracking-wider text-[#60A5FA]">
              {activeItem.badge}
            </span>
          </div>
        </div>

        {/* Cross-Fading Media Image Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={() => onItemClick(activeItem.id)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.image}
              alt={activeItem.label}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />

            {/* Cinematic Vignette & Ambient Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0D] via-[#090A0D]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090A0D]/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Bottom Metadata Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-1 pointer-events-none">
          <div>
            <div className="font-mono text-[9px] text-[#60A5FA] tracking-wider uppercase">
              {activeItem.num} // {activeItem.sub}
            </div>
            <div className="text-xs sm:text-sm font-sans font-semibold text-white tracking-tight">
              {activeItem.label}
            </div>
          </div>
          <div className="font-mono text-[9px] text-slate-400 tracking-wider">
            {activeItem.specs}
          </div>
        </div>
      </div>

      {/* 2. Linked Media Cross-Highlighting Thumbnail Grid */}
      <div className="w-full">
        <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-slate-500 uppercase pb-1.5">
          <span>SCENE INDEX</span>
          <span>HOVER TO PREVIEW</span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {items.map((item) => {
            const isHovered = item.id === activeItem.id;
            return (
              <button
                key={item.id}
                onMouseEnter={() => onItemSelect(item)}
                onFocus={() => onItemSelect(item)}
                onClick={() => onItemClick(item.id)}
                className={`group relative aspect-[16/10] rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer focus:outline-none ${
                  isHovered
                    ? "border-[#0038FF] shadow-[0_0_15px_rgba(0,56,255,0.45)] scale-105 z-10 opacity-100"
                    : "border-white/10 opacity-40 hover:opacity-80 scale-95 grayscale-[30%] hover:scale-100 hover:grayscale-0"
                }`}
                aria-label={`Preview ${item.label}`}
              >
                {/* Thumbnail Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Number Badge */}
                <span
                  className={`absolute bottom-1 left-1.5 font-mono text-[9px] font-bold tracking-wider transition-colors ${
                    isHovered ? "text-white" : "text-slate-400"
                  }`}
                >
                  {item.num}
                </span>

                {/* Active Indicator Top Dot & Viewfinder Brackets */}
                {isHovered && (
                  <>
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#0038FF] shadow-[0_0_8px_#0038FF]" />
                    <span className="absolute top-1 left-1 text-[8px] text-[#60A5FA] font-mono leading-none">⌜</span>
                    <span className="absolute bottom-1 right-1 text-[8px] text-[#60A5FA] font-mono leading-none">⌟</span>
                  </>
                )}

                {/* Subtitle / Category on Active Hover */}
                <span
                  className={`absolute top-1 left-2.5 font-mono text-[8px] tracking-wider uppercase transition-opacity ${
                    isHovered ? "opacity-100 text-[#93C5FD]" : "opacity-0"
                  }`}
                >
                  {item.category.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
