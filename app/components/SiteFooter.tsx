import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon } from "@hugeicons/core-free-icons";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/fitcheck.startup/", icon: <Image src="/social-icons/instagram.svg" width={27} height={27} alt="" /> },
  { label: "Threads", href: "https://www.threads.com/@fitcheck.startup", icon: <Image src="/social-icons/threads.svg" width={27} height={27} alt="" /> },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61596346923689", icon: <Image src="/social-icons/facebook.svg" width={32} height={32} alt="" /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/145435214/", icon: <Image src="/social-icons/linkedin.svg" width={27} height={27} alt="" /> },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[#d4d2e1] bg-[#101b43] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
        <div>
          <Link href="/#scene-hero" aria-label="FitCheck home" className="inline-block">
            <Image src="/fitcheck-wordmark.webp" width={130} height={40} alt="FitCheck" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#c7cbe0]">
            A visual style preview for fashion discovery. Check the seller’s size chart for fit.
          </p>
        </div>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aeb6dc]">Explore</h2>
          <nav aria-label="Explore FitCheck" className="mt-4 flex flex-col items-start gap-3 text-base">
            <Link href="/#scene-showroom" className="underline-offset-4 hover:underline focus-visible:underline">Showroom</Link>
            <Link href="/#how-it-works" className="underline-offset-4 hover:underline focus-visible:underline">How it works</Link>
            <Link href="/#scene-pricing" className="underline-offset-4 hover:underline focus-visible:underline">Pricing</Link>
            <Link href="/#faq" className="underline-offset-4 hover:underline focus-visible:underline">FAQ</Link>
          </nav>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aeb6dc]">Information</h2>
          <nav aria-label="Legal information" className="mt-4 flex flex-col items-start gap-3 text-base">
            <Link href="/terms" className="underline-offset-4 hover:underline focus-visible:underline">Terms</Link>
            <Link href="/privacy" className="underline-offset-4 hover:underline focus-visible:underline">Privacy</Link>
          </nav>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aeb6dc]">Contact</h2>
          <a href="mailto:fitcheckai0@gmail.com" aria-label="Email FitCheck" className="mt-4 inline-flex min-h-12 min-w-12 items-center justify-center text-white transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <HugeiconsIcon icon={Mail01Icon} size={24} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </section>
      </div>
      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-8 text-center sm:px-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aeb6dc]">Follow us</h2>
          <nav aria-label="Social media" className="flex gap-4">
            {socials.map(({ label, href, icon }) => (
              <a key={label} aria-label={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 min-w-12 items-center justify-center p-2.5 text-white transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                {icon}
              </a>
            ))}
          </nav>
          <p className="text-sm font-medium text-[#c7cbe0]">© 2026 FitCheck. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
