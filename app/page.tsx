"use client";

import { useState } from "react";
import { Hero } from "./components/Hero";
import { InteractiveShowroom } from "./components/InteractiveShowroom";
import { DemoPreviewVideo } from "./components/DemoPreviewVideo";
import { MinimalPricing } from "./components/MinimalPricing";
import { FaqAccordion } from "./components/FaqAccordion";
import { PilotModal } from "./components/PilotModal";
import { SiteFooter } from "./components/SiteFooter";
import { ScrollReveal } from "./components/ScrollReveal";

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

        <ScrollReveal margin="-60px">
          <InteractiveShowroom />
        </ScrollReveal>

        <ScrollReveal margin="-80px">
          <section id="how-it-works" className="editorial-section scroll-mt-8">
            <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] md:gap-12">
              <div
                className="group relative overflow-hidden rounded-md border border-[#2b2b52] bg-[#15152f] shadow-lg transition-all duration-300 hover:border-[#0038ff]/70"
              >
                {/* Viewfinder corner brackets */}
                <span className="viewfinder-bracket viewfinder-top-left text-white/50" />
                <span className="viewfinder-bracket viewfinder-top-right text-white/50" />
                <span className="viewfinder-bracket viewfinder-bottom-left text-white/50" />
                <span className="viewfinder-bracket viewfinder-bottom-right text-white/50" />

                <DemoPreviewVideo />
              </div>
              <div className="space-y-4">
                <h2 className="text-balance font-black italic uppercase tracking-[-0.045em] text-4xl sm:text-6xl">
                  See it in motion.
                </h2>
                <p className="text-base font-bold tracking-[-0.025em] text-[#0038ff]">
                  Preview a look using your camera or an uploaded photo.
                </p>
                <p className="text-xl sm:text-2xl font-bold tracking-[-0.035em] text-[#101b43]">
                  Choose a preview, answer the questionnaire, then see one look for 15 seconds.
                </p>
                <p className="text-base font-medium tracking-[-0.02em] text-[#34436f]">
                  Sign in with Google for one try per hour per verified account. Audio stays off, and you can stop anytime.
                </p>
                <p className="border-t border-[#d5d5e4] pt-4 text-sm font-bold tracking-[-0.02em] text-[#101b43]">
                  Visual guide only. Check the seller’s size chart for fit.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal margin="-80px">
          <MinimalPricing onOpenPilotModal={openPilot} />
        </ScrollReveal>

        <ScrollReveal margin="-80px">
          <FaqAccordion />
        </ScrollReveal>
      </main>

      <ScrollReveal margin="-40px">
        <SiteFooter onOpenPilotModal={openPilot} />
      </ScrollReveal>

      <PilotModal isOpen={isPilotModalOpen} selectedPack={pilotPack} returnFocusTo={pilotTrigger} onClose={() => setIsPilotModalOpen(false)} />
    </>
  );
}
