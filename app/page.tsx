"use client";

import React, { useState } from "react";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { InteractiveShowroom } from "./components/InteractiveShowroom";
import { ArchitectureBento } from "./components/ArchitectureBento";
import { ScrollHorizontalTicker } from "@/components/ui/scroll-horizontal-ticker";
import { EditorialFlow } from "./components/EditorialFlow";
import { MinimalPricing } from "./components/MinimalPricing";
import { EditorialCta } from "./components/EditorialCta";
import { CommunityHub } from "./components/CommunityHub";
import { Footer } from "./components/Footer";
import { PilotModal } from "./components/PilotModal";

export default function LandingPage() {
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);

  const handleOpenPilotModal = () => {
    setIsPilotModalOpen(true);
  };

  const handleClosePilotModal = () => {
    setIsPilotModalOpen(false);
  };

  return (
    <AmbientBackground>
      {/* 1. Floating Burger Menu Header (Lando Norris Inspired) */}
      <Navbar onOpenPilotModal={handleOpenPilotModal} />

      {/* 2. 1-Page Cinematic Scene Sequence with Scroll-Driven Horizontal Text */}
      <main className="relative">
        {/* Scene 1: Monolithic Hero */}
        <Hero onOpenPilotModal={handleOpenPilotModal} />

        {/* Scene 2: 3D Garment Orbit & Live Mirror Showroom */}
        <InteractiveShowroom />

        {/* Signature Lando Norris Horizontal Text Scrub (Row 1 left, Row 2 right) */}
        <ScrollHorizontalTicker
          row1Text={[
            "SEE IT ON YOU",
            "ZERO DOWNLOAD",
            "30S LIVE PREVIEW",
            "OPTICAL STYLE MIRROR",
            "SEE IT ON YOU",
          ]}
          row2Text={[
            "INSTAGRAM DM SALES",
            "₱499 PILOT PACK",
            "PHILIPPINE DPA 10173",
            "AUDIO STRICTLY MUTED",
            "INSTAGRAM DM SALES",
          ]}
        />

        {/* Scene 3: Text-Focused Information Bento Grid (Pure Telemetry & Metrics) */}
        <ArchitectureBento />

        {/* Scene 4: 3-Beat Assisted Sales Journey */}
        <EditorialFlow />

        {/* Second Opposing Horizontal Kinetic Marquee */}
        <ScrollHorizontalTicker
          row1Text={[
            "PIÑA-SILK BARONG",
            "RESORT LINEN",
            "TERRACOTTA SATIN",
            "INABEL WEAVE",
            "PIÑA-SILK BARONG",
          ]}
          row2Text={[
            "FIXED PREPAID PACKS",
            "ZERO OVERAGES",
            "3–5 LAUNCH PARTNERS",
            "MANILA / PH",
            "FIXED PREPAID PACKS",
          ]}
        />

        {/* Scene 4: Transparent Unit Economics (₱499 & ₱1,799) */}
        <MinimalPricing onOpenPilotModal={handleOpenPilotModal} />

        {/* Scene 5: Controlled Pilot Intake */}
        <EditorialCta onOpenPilotModal={handleOpenPilotModal} />

        {/* Scene 6: Second-to-Last Section - Lando Norris Community & Social Media Hub */}
        <CommunityHub />
      </main>

      {/* 3. Docked Immersive Bottom Console / Footer */}
      <Footer onOpenPilotModal={handleOpenPilotModal} />

      {/* 4. Brand Pilot Intake Modal */}
      <PilotModal isOpen={isPilotModalOpen} onClose={handleClosePilotModal} />
    </AmbientBackground>
  );
}
