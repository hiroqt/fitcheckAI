import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";

export default function LegalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="mx-auto max-w-[1600px] px-2.5 pt-2.5 sm:px-4 sm:pt-4">
        <header className="campaign-hero">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-9 lg:px-12">
            <Link href="/" aria-label="FitCheck home" className="inline-flex">
              <Image src="/fitcheck-wordmark.webp" width={130} height={40} alt="FitCheck" />
            </Link>
            <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white sm:gap-8">
              <Link href="/#scene-showroom" className="hover:underline">Showroom</Link>
              <Link href="/#how-it-works" className="hover:underline">How it works</Link>
              <Link href="/#scene-pricing" className="hover:underline">Pricing</Link>
            </nav>
            <Link href="/" className="inline-flex min-h-10 items-center border border-white/60 px-3.5 text-sm font-medium text-white hover:bg-white/10">
              Back to FitCheck
            </Link>
          </div>
        </header>
        {children}
      </div>
      <SiteFooter />
    </>
  );
}
