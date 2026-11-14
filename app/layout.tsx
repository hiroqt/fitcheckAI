import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";
import {
  BRAND_COLOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_PROFILES,
} from "./lib/site";
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Mono is only used below the fold (HowItWorks, footer, legal nav), so don't let its
// preload compete with the hero image for bandwidth.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const ogImage = {
  url: "/opengraph.jpg",
  width: 1672,
  height: 941,
  alt: "FitCheck - Virtual Style Preview",
};

// Icons come from the file conventions: app/favicon.ico, app/icon.png, app/apple-icon.png.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "virtual try-on",
    "AI fitting room",
    "try on clothes online",
    "fashion e-commerce",
    "Philippine fashion brands",
    "FitCheck",
  ],
  category: "fashion",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_PH",
    url: "/",
    siteName: SITE_NAME,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [ogImage],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLOR,
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      email: "fitcheckai0@gmail.com",
      sameAs: SOCIAL_PROFILES,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen overflow-x-clip bg-[#f7f8ff] font-sans text-[#101b43] antialiased selection:bg-[#0038ff] selection:text-white">
        <script
          type="application/ld+json"
          // JSON.stringify output is static and server-controlled; escape "<" defensively.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
