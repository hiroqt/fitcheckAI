"use client";

import React, { useState } from "react";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProblemSolution } from "./components/ProblemSolution";
import { InteractiveDemo } from "./components/InteractiveDemo";
import { SegmentFit } from "./components/SegmentFit";
import { Pricing } from "./components/Pricing";
import { TrustGuardrails } from "./components/TrustGuardrails";
import { FaqAccordion } from "./components/FaqAccordion";
import { FinalCta } from "./components/FinalCta";
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
      {/* Navigation Header */}
      <Navbar onOpenPilotModal={handleOpenPilotModal} />

      {/* Main Landing Page Experience */}
      <main className="relative">
        {/* 1. Hero: See it on you. The live style mirror in your browser */}
        <Hero onOpenPilotModal={handleOpenPilotModal} />

        {/* 2. Problem & 5-Step Assisted Sales Journey */}
        <ProblemSolution />

        {/* 3. The Live Optical Style Mirror Simulator (30s Capped Session) */}
        <InteractiveDemo />

        {/* 4. Strategic Customer Segment Prioritization */}
        <SegmentFit />

        {/* 5. Prepaid Pilot Pricing (₱499 & ₱1,799) & Interactive ROI Breakeven Calculator */}
        <Pricing onOpenPilotModal={handleOpenPilotModal} />

        {/* 6. Legal Trust Guardrails & Philippine Data Privacy Act */}
        <TrustGuardrails />

        {/* 7. Operational FAQs */}
        <FaqAccordion />

        {/* 8. Controlled Pilot Intake & Criteria Checklist */}
        <FinalCta onOpenPilotModal={handleOpenPilotModal} />
      </main>

      {/* Footer & Mandatory Legal Disclaimers */}
      <Footer />

      {/* Brand Pilot Application Modal */}
      <PilotModal isOpen={isPilotModalOpen} onClose={handleClosePilotModal} />
    </AmbientBackground>
  );
}
