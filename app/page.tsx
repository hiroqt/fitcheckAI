"use client";

import { useState } from "react";
import { Hero } from "./components/Hero";
import { InteractiveShowroom } from "./components/InteractiveShowroom";
import { DemoPreviewVideo } from "./components/DemoPreviewVideo";
import { MinimalPricing } from "./components/MinimalPricing";
import { SocialShowcase } from "./components/SocialShowcase";
import { FaqAccordion } from "./components/FaqAccordion";
import { SiteFooter } from "./components/SiteFooter";
import { ScrollReveal, ScrollHeading, ScrollText } from "./components/ScrollReveal";
import { WorkWithUsModal } from "./components/WorkWithUsModal";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const openWorkWithUs = (pack = "499") => {
    const planNames: Record<string, string> = {
      "499": "Starter · ₱499",
      "1799": "Growth · ₱1,799",
      "larger_business": "Larger business · ₱4,999/mo + metered usage",
      "enterprise": "Custom · discovery quote",
    };
    const chosenPlan = planNames[pack] || "Brand collaboration";
    setModalTitle(`Work with FitCheck: ${chosenPlan}`);
    setModalMessage(
      `Hello FitCheck Team,\n\nI am interested in working with FitCheck for my clothing brand (${chosenPlan}).\n\nBrand Name:\nStore or Instagram link:\nQuestions / details:\n`
    );
    setIsModalOpen(true);
  };

  return (
    <>
      <main className="mx-auto max-w-[1600px] px-2.5 pt-2.5 sm:px-4 sm:pt-4">
        <Hero onOpenPilotModal={() => openWorkWithUs("general")} />

        <InteractiveShowroom />

        <section id="how-it-works" className="editorial-section scroll-mt-8">
          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] md:gap-12">
            <ScrollReveal delay={0.05} margin="-80px">
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
            </ScrollReveal>

            <div className="space-y-4">
              <ScrollHeading margin="-80px">
                <h2 className="text-balance font-black italic uppercase tracking-[-0.045em] text-4xl sm:text-6xl">
                  See it in motion.
                </h2>
              </ScrollHeading>

              <ScrollText delay={0.1} margin="-80px">
                <p className="text-base font-bold tracking-[-0.025em] text-[#0038ff]">
                  Preview a look using your camera or an uploaded photo.
                </p>
              </ScrollText>

              <ScrollText delay={0.16} margin="-80px">
                <p className="text-xl sm:text-2xl font-bold tracking-[-0.035em] text-[#101b43]">
                  Choose a preview, answer the questionnaire, then see one look for 15 seconds.
                </p>
              </ScrollText>

              <ScrollText delay={0.22} margin="-80px">
                <p className="text-base font-medium tracking-[-0.02em] text-[#34436f]">
                  Sign in with Google for one try per hour per verified account. Audio stays off, and you can stop anytime.
                </p>
              </ScrollText>

              <ScrollText delay={0.28} margin="-80px">
                <p className="border-t border-[#d5d5e4] pt-4 text-sm font-bold tracking-[-0.02em] text-[#101b43]">
                  Visual guide only. Check the seller’s size chart for fit.
                </p>
              </ScrollText>
            </div>
          </div>
        </section>

        <MinimalPricing onOpenPilotModal={openWorkWithUs} />

        <SocialShowcase />

        <FaqAccordion />
      </main>

      <SiteFooter onOpenPilotModal={() => openWorkWithUs("general")} />

      <WorkWithUsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTitle={modalTitle}
        defaultMessage={modalMessage}
      />
    </>
  );
}
