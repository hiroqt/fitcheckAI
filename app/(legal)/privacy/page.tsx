import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy | FitCheck", description: "How FitCheck handles information during the style preview evaluation." };

export default function PrivacyPage() {
  return (
    <main className="editorial-section text-[#101b43]">
      <div className="max-w-4xl">
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0038ff]">FitCheck / Policies</p>
        <h1 className="text-balance font-black italic uppercase tracking-[-0.045em] text-4xl sm:text-6xl">Privacy Notice</h1>
        <p className="mt-4 text-sm text-[#62627a]">Last updated: November 11, 2026</p>
        <div className="mt-10 divide-y divide-[#d5d5e4] border-y border-[#d5d5e4] leading-relaxed text-[#34436f]">
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Information the evaluation stores</h2><p className="mt-3">When the configured showroom evaluation is available, FitCheck stores your selected preview goal, garment, and optional feedback rating, along with a random browser identifier used to enforce trial limits. The identifier is held in a first-party, HTTP-only cookie for up to 30 days. The evaluation database does not store camera video, images, audio, your name, or your email.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Camera preview</h2><p className="mt-3">If you choose to start a preview, your camera video and the selected garment image are sent to Decart, an external AI service, to generate the live visual result. FitCheck does not store the camera video or generated frames in its evaluation database. Decart processes submitted media under its own terms and privacy practices; review those before using the preview. Your microphone stays off.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Why and how long</h2><p className="mt-3">The browser identifier and trial answers support access limits and evaluation feedback. The evaluation database is kept in a private local file and has no automatic deletion schedule; its operator should delete it when the evaluation no longer needs it. The cookie expires after 30 days.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Your choices and contact</h2><p className="mt-3">You can decline camera permission and still browse the site. You can stop an active preview at any time. For questions about this evaluation’s stored trial answers or privacy, <a className="text-[#0038ff] underline underline-offset-4" href="mailto:fitcheckai0@gmail.com">email FitCheck</a>.</p></section>
        </div>
        <p className="mt-8 text-base"><Link href="/terms" className="text-[#0038ff] underline underline-offset-4">Read the Terms of Use</Link></p>
      </div>
    </main>
  );
}
