import React from "react";
import { SiteFooter } from "../components/SiteFooter";

// Server component: the entrance fade is pure CSS (tw-animate-css), so the page text
// paints from the server HTML without waiting for JavaScript to hydrate.
export default function LegalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="mx-auto max-w-[1600px] px-2.5 pt-2.5 sm:px-4 sm:pt-4">
        <div className="animate-in fade-in slide-in-from-bottom-2.5 duration-350 ease-[cubic-bezier(0.21,0.47,0.32,0.98)] motion-reduce:animate-none">
          {children}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
