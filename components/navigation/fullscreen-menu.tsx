"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_MENU_ITEMS, NavMenuItem } from "./types";
import { MenuLinkItem } from "./menu-link-item";
import { MediaHoverPreview } from "./media-hover-preview";

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScene: (id: string) => void;
  onOpenPilotModal: () => void;
}

// Hardware-accelerated dynamic clip-path expansion variant
const overlayVariants: Variants = {
  closed: {
    clipPath: "circle(0% at calc(100% - 70px) 44px)",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 38,
      when: "afterChildren",
    },
  },
  open: {
    clipPath: "circle(150% at calc(100% - 70px) 44px)",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 26,
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const subBarVariants: Variants = {
  closed: { opacity: 0, y: -12 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.1 },
  },
};

const bottomBarVariants: Variants = {
  closed: { opacity: 0, y: 12 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.2 },
  },
};

const menuContainerVariants: Variants = {
  closed: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.1,
    },
  },
};

const mediaColumnVariants: Variants = {
  closed: { opacity: 0, scale: 0.95, y: 15 },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
  },
};

export function FullscreenMenu({
  isOpen,
  onClose,
  onSelectScene,
  onOpenPilotModal,
}: FullscreenMenuProps) {
  const [activeItem, setActiveItem] = useState<NavMenuItem>(NAV_MENU_ITEMS[0]);

  // Completely lock page scroll (both body & documentElement) and prevent wheel leaking
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("overflow-hidden");
      document.body.classList.add("overflow-hidden");
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  // Keyboard accessibility: ESC key closes the menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleLinkClick = (id: string) => {
    onClose();
    setTimeout(() => {
      onSelectScene(id);
    }, 180);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-0 z-40 h-screen h-[100dvh] max-h-screen overflow-hidden bg-[#090A0D]/98 backdrop-blur-3xl flex flex-col justify-between pt-20 sm:pt-24 px-6 sm:px-10 lg:px-14 pb-5 sm:pb-7 select-none"
        >
          {/* Subtle Cybernetic Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

          {/* Ambient Cobalt Radial Bloom */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#0038FF]/10 rounded-full blur-[120px] pointer-events-none" />

          {/* 1. Directory Sub-Bar (Safely positioned below the fixed top header so Close button has zero overlap) */}
          <motion.div
            variants={subBarVariants}
            className="relative z-10 w-full shrink-0 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/[0.08] pb-3"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0038FF] animate-pulse" />
              <span className="tracking-widest uppercase font-semibold text-slate-200">
                DIRECTORY
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-[#0038FF]" />
                <span>INDEX 01-06</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>MANILA, PH • REPUBLIC ACT 10173</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-slate-400">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  ESC
                </kbd>
                <span>TO CLOSE</span>
              </div>
            </div>
          </motion.div>

          {/* 2. Main Stage: Split Kinetic Navigation & Linked Media Preview (Fit to viewport, zero scrolling) */}
          <div className="relative z-10 my-auto py-2 sm:py-3 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Left: Kinetic Typography Menu Links with Staggered Cascading Reveal */}
            <motion.div
              variants={menuContainerVariants}
              className="lg:col-span-7 flex flex-col justify-center space-y-1 sm:space-y-1.5 lg:space-y-2"
            >
              {NAV_MENU_ITEMS.map((item, idx) => (
                <MenuLinkItem
                  key={item.id}
                  item={item}
                  index={idx}
                  isActive={activeItem.id === item.id}
                  onHover={(hoveredItem) => setActiveItem(hoveredItem)}
                  onSelect={handleLinkClick}
                />
              ))}
            </motion.div>

            {/* Right: Dynamic Linked Media Hover Grid & Viewfinder Stage */}
            <motion.div
              variants={mediaColumnVariants}
              className="lg:col-span-5 hidden md:block max-h-full"
            >
              <MediaHoverPreview
                activeItem={activeItem}
                items={NAV_MENU_ITEMS}
                onItemSelect={(hoveredItem) => setActiveItem(hoveredItem)}
                onItemClick={handleLinkClick}
              />
            </motion.div>
          </div>

          {/* 3. Bottom Bar: Compliance & Primary CTA */}
          <motion.div
            variants={bottomBarVariants}
            className="relative z-10 w-full shrink-0 pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-mono text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#0038FF] shrink-0" />
              <span className="truncate">
                Philippine DPA 10173 • Client-Side Camera • Audio Permanently Muted
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                onClick={() => {
                  onClose();
                  onOpenPilotModal();
                }}
                className="h-10 px-5 bg-[#0038FF] hover:bg-[#1A4CFF] text-white font-mono text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,56,255,0.4)] flex items-center justify-center gap-2 group cursor-pointer transition-all duration-200"
              >
                <span>Apply for Brand Pilot</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
