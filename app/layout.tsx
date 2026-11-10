import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitCheck AI — Enterprise Virtual Fitting & Sizing Intelligence for Apparel",
  description:
    "High-converting virtual fitting and intelligent garment drape integration for fashion e-commerce brands and Shopify Plus merchants. Slash returns by 38% and lift PDP conversions.",
  keywords: [
    "virtual fitting",
    "sizing intelligence",
    "fashion tech",
    "Shopify Plus sizing",
    "apparel return reduction",
    "garment drape simulation",
    "e-commerce conversion",
  ],
  authors: [{ name: "FitCheck AI" }],
  openGraph: {
    title: "FitCheck AI — Enterprise Virtual Fitting & Sizing Intelligence",
    description:
      "End sizing hesitation, slash returns by 38%, and lift PDP conversion with sub-100ms virtual drape intelligence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-[#090A0D] text-slate-100 antialiased font-sans selection:bg-white/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
