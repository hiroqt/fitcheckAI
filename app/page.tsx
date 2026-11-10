import React from "react";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { Hero } from "./components/Hero";
import { SocialProof } from "./components/SocialProof";
import { ProblemSolution } from "./components/ProblemSolution";
import { InteractiveDemo } from "./components/InteractiveDemo";
import { FeatureGrid } from "./components/FeatureGrid";
import { CodeSnippet } from "./components/CodeSnippet";
import { Pricing } from "./components/Pricing";
import { FaqAccordion } from "./components/FaqAccordion";
import { FinalCta } from "./components/FinalCta";
import { ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  return (
    <AmbientBackground>
      {/* Editorial Luxury Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#090A0D]/70 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#090A0D] font-bold text-xs tracking-tighter">
              FC
            </div>
            <span className="font-sans font-semibold tracking-wider text-sm text-white">
              FITCHECK<span className="text-slate-400 font-normal">.AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-slate-400">
            <a href="#interactive-demo" className="hover:text-white transition">
              Live Demo
            </a>
            <a href="#pricing" className="hover:text-white transition">
              Pricing
            </a>
            <a href="#final-cta" className="hover:text-white transition">
              Integrations
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#final-cta"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-200 text-[#090A0D] text-xs font-medium transition cursor-pointer"
            >
              <span>Get API Key</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Landing Page Sections */}
      <main>
        <Hero />
        <SocialProof />
        <ProblemSolution />
        <InteractiveDemo />
        <FeatureGrid />
        <CodeSnippet />
        <Pricing />
        <FaqAccordion />
        <FinalCta />
      </main>

      {/* Modern Fashion-Tech Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07080A] py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">FitCheck AI Systems Inc.</span>
            <span>—</span>
            <span>Enterprise Fashion Fit Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition">
              Security & Compliance
            </a>
            <a href="#" className="hover:text-white transition">
              API Status (99.99%)
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </AmbientBackground>
  );
}
