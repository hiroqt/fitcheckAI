import type { Metadata } from "next";
import Link from "next/link";
import { LegalNav } from "../LegalNav";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using the FitCheck website and style preview.",
};

export default function TermsPage() {
  return (
    <main className="editorial-section pb-24 text-[#101b43]">
      <div className="max-w-4xl">
        <LegalNav currentPage="terms" />
        <h1 className="text-balance font-black italic uppercase tracking-[-0.045em] text-4xl sm:text-6xl">Terms of Use</h1>
        <p className="mt-4 text-sm text-[#62627a]">Last updated: November 11, 2026</p>
        <div className="mt-10 divide-y divide-[#d5d5e4] border-y border-[#d5d5e4] leading-relaxed text-[#34436f]">
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">About the preview</h2><p className="mt-3">FitCheck provides a visual style preview for fashion discovery. Results are approximate, may be incomplete or inaccurate, and do not show garment sizing, construction, or fabric behavior. Check the seller’s size chart and product details before buying.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Try-on and third-party processing</h2><p className="mt-3">Choose either the live camera or a clear, clothed photo. Both require confirmation that you are 18 or older and agreement before processing. Your camera video or uploaded photo and selected garment image stream directly from your browser to Decart. FitCheck does not store the body media or generated video. Provider terms and data handling must be approved before public use. Each verified Google account gets one 15-second attempt per hour across both options, subject to availability; if setup fails before the preview appears, the attempt is restored.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Acceptable use</h2><p className="mt-3">Use this site lawfully and only with photos or camera video you have the right to provide. Do not use the preview to identify people, make decisions about them, or upload content that violates another person’s rights.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Availability and contact</h2><p className="mt-3">FitCheck is an evaluation experience and is provided as available. Pilot details, availability, and limits may change. For questions, <a className="text-[#0038ff] underline underline-offset-4 hover:text-[#002bdc]" href="mailto:fitcheckai0@gmail.com">email FitCheck</a>.</p></section>
        </div>
        <p className="mt-8 text-base"><Link href="/privacy" className="text-[#0038ff] underline underline-offset-4 hover:text-[#002bdc]">Read the Privacy Notice</Link></p>
      </div>
    </main>
  );
}
