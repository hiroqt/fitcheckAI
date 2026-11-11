import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms | FitCheck", description: "Terms for using the FitCheck website and style preview." };

export default function TermsPage() {
  return (
    <main className="editorial-section text-[#101b43]">
      <div className="max-w-4xl">
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0038ff]">FitCheck / Policies</p>
        <h1 className="text-balance font-black italic uppercase tracking-[-0.045em] text-4xl sm:text-6xl">Terms of Use</h1>
        <p className="mt-4 text-sm text-[#62627a]">Last updated: November 11, 2026</p>
        <div className="mt-10 divide-y divide-[#d5d5e4] border-y border-[#d5d5e4] leading-relaxed text-[#34436f]">
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">About the preview</h2><p className="mt-3">FitCheck provides a visual style preview for fashion discovery. Results are approximate, may be incomplete or inaccurate, and do not show garment sizing, construction, or fabric behavior. Check the seller’s size chart and product details before buying.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Camera and third-party processing</h2><p className="mt-3">The live preview is optional and requires camera permission and your agreement before starting. Camera video and the selected garment image are sent to the external AI service identified in the preview flow to generate the result. Your microphone is not used. The service may be unavailable or change during this evaluation.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Acceptable use</h2><p className="mt-3">Use this site lawfully and only with images and camera access you have the right to provide. Do not use the preview to identify people, make decisions about them, or upload content that violates another person’s rights.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Availability and contact</h2><p className="mt-3">FitCheck is an evaluation experience and is provided as available. Pilot details, availability, and limits may change. For questions, <a className="text-[#0038ff] underline underline-offset-4" href="mailto:fitcheckai0@gmail.com">email FitCheck</a>.</p></section>
        </div>
        <p className="mt-8 text-base"><Link href="/privacy" className="text-[#0038ff] underline underline-offset-4">Read the Privacy Notice</Link></p>
      </div>
    </main>
  );
}
