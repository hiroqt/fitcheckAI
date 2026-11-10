import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";
import { GlobalBackground } from "@/components/ui/global-background";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const editorialSerif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "FitCheck AI — The 30-Second Live Style Mirror in Your Browser",
  description:
    "See it on you. Browser-based moving garment style mirror for Philippine boutique fashion. Instant 30-second capped previews with zero downloads.",
  keywords: [
    "virtual style mirror",
    "boutique fashion try on",
    "Philippine fashion ecommerce",
    "live mirror preview",
    "garment drape",
  ],
  authors: [{ name: "FitCheck AI" }],
  openGraph: {
    title: "FitCheck AI — The 30-Second Live Style Mirror",
    description:
      "A moving visual preview of curated garments before purchase. Zero download. Controlled Philippine boutique pilot.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${editorialSerif.variable} dark`}
    >
      <body className="min-h-screen bg-[#090A0D] text-slate-100 antialiased font-sans selection:bg-[#0038FF]/30 selection:text-white">
        <GlobalBackground />
        <SmoothScrollProvider>
          <MagneticCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
