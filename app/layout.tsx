import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const editorialDisplay = Barlow_Condensed({
  variable: "--font-campaign",
  subsets: ["latin"],
  weight: "900",
});

const description = "Explore Floating Brand’s showroom and FitCheck’s live virtual try-on pilot.";

export const metadata: Metadata = {
  title: {
    default: "FitCheck",
    template: "%s | FitCheck",
  },
  description,
  authors: [{ name: "FitCheck" }],
  openGraph: {
    title: {
      default: "FitCheck",
      template: "%s | FitCheck",
    },
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "FitCheck",
      template: "%s | FitCheck",
    },
    description,
  },
  icons: {
    icon: [
      { url: "/favicon-fitcheck.png" },
      { url: "/icon.png" },
    ],
    shortcut: "/favicon-fitcheck.png",
    apple: "/favicon-fitcheck.png",
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
      className={`${geistSans.variable} ${geistMono.variable} ${editorialDisplay.variable}`}
    >
      <body className="min-h-screen overflow-x-clip bg-[#f7f8ff] font-sans text-[#101b43] antialiased selection:bg-[#0038ff] selection:text-white">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
