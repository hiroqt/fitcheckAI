import type { Metadata } from "next";
import Link from "next/link";
import { LegalNav } from "../LegalNav";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How FitCheck handles survey answers, account access, try-on photos, and email inquiries.",
};

export default function PrivacyPage() {
  return (
    <main className="editorial-section pb-24 text-[#101b43]">
      <div className="max-w-4xl">
        <LegalNav currentPage="privacy" />
        <h1 className="w-full text-balance font-black italic uppercase tracking-[-0.045em] text-3xl sm:text-5xl lg:text-6xl">Privacy Notice</h1>
        <p className="mt-4 text-sm text-[#62627a]">Last updated: November 12, 2026</p>
        <div className="mt-10 divide-y divide-[#d5d5e4] border-y border-[#d5d5e4] leading-relaxed text-[#34436f]">
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Questionnaire and sign-in</h2><p className="mt-3">After you complete the questionnaire and sign in with Google, FitCheck sends your name, optional contact email, survey answers, and submission time to a private Google Sheet for market research. Your verified Google email is used to enforce the one-hour cooldown per account. FitCheck stores a keyed hash of that email and the preview status in a private control tab; the email itself is not added to the survey response sheet. The survey and access records remain until the pilot operator deletes them.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Try-on preview</h2><p className="mt-3">If you choose a preview, your live camera video or uploaded photo and the selected garment image are streamed directly from your browser to Decart. FitCheck does not send the body media to its server, store it in Google Sheets, or save the generated video. The page stops the camera and clears its in-memory photo and preview when you stop, finish, or close it. This does not delete media already sent to Decart. Public processing stays disabled until the provider’s terms and data handling are approved.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Work With Us inquiries</h2><p className="mt-3">When you choose an inquiry type, FitCheck opens a prefilled email draft addressed to fitcheckai0@gmail.com in your email app. The website does not submit or store the draft. Review and send it yourself; your email app and email provider then handle the message.</p></section>
          <section className="py-7"><h2 className="text-2xl font-bold tracking-tight text-[#101b43]">Your choices and contact</h2><p className="mt-3">Either preview is optional and requires you to confirm that you are 18 or older and agree to send the selected body media to Decart. You can remove a photo before starting and stop an active preview at any time. For questions about survey records or privacy, <a className="text-[#0038ff] underline underline-offset-4 hover:text-[#002bdc]" href="mailto:fitcheckai0@gmail.com">email FitCheck</a>.</p></section>
        </div>
        <p className="mt-8 text-base"><Link href="/terms" className="text-[#0038ff] underline underline-offset-4 hover:text-[#002bdc]">Read the Terms of Use</Link></p>
      </div>
    </main>
  );
}
