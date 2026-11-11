"use client";

import { useState } from "react";
import { Hero } from "./components/Hero";
import { InteractiveShowroom } from "./components/InteractiveShowroom";
import { DemoPreviewVideo } from "./components/DemoPreviewVideo";
import { MinimalPricing } from "./components/MinimalPricing";
import { FaqAccordion } from "./components/FaqAccordion";
import { PilotModal } from "./components/PilotModal";
import { SiteFooter } from "./components/SiteFooter";

export default function LandingPage() {
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);
  const [pilotTrigger, setPilotTrigger] = useState<HTMLElement | null>(null);
  const [pilotPack, setPilotPack] = useState("499");
  const openPilot = (pack = "499") => {
    setPilotTrigger(document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setPilotPack(pack);
    setIsPilotModalOpen(true);
  };

  return (
    <>
      <main className="mx-auto max-w-[1600px] px-2.5 pt-2.5 sm:px-4 sm:pt-4">
        <Hero onOpenPilotModal={openPilot} />
        <InteractiveShowroom />
        <section id="how-it-works" className="editorial-section scroll-mt-8">
          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] md:gap-12">
            <div className="overflow-hidden border border-[#d5d5e4] bg-[#15152f]">
              <DemoPreviewVideo />
            </div>
            <div className="space-y-4">
              <h2 className="text-balance font-black italic uppercase tracking-[-0.045em] text-4xl sm:text-6xl">
                See it in motion.
              </h2>
              <p className="text-[#34436f]">A short look at the live style preview.</p>
              <p className="text-xl font-semibold text-[#101b43]">
                Choose a garment and preview it live for up to 20 seconds.
              </p>
              <p className="text-[#34436f]">Audio stays off. Stop the preview whenever you like.</p>
              <p className="border-t border-[#d5d5e4] pt-4 text-sm font-medium text-[#101b43]">
                Visual guide only. Check the seller’s size chart for fit.
              </p>
            </div>
          </div>
        </section>
        <MinimalPricing onOpenPilotModal={openPilot} />
        <FaqAccordion />
      </main>
      <SiteFooter />
      <PilotModal isOpen={isPilotModalOpen} selectedPack={pilotPack} returnFocusTo={pilotTrigger} onClose={() => setIsPilotModalOpen(false)} />
    </>
  );
}
