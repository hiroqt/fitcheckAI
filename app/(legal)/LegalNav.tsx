"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface LegalNavProps {
  currentPage: "privacy" | "terms";
}

export function LegalNav({ currentPage }: LegalNavProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleHeroNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isTransitioning) return;
    setIsTransitioning(true);

    const navigate = () => {
      router.push("/#scene-hero");
    };

    // Use native View Transition API for fluid cross-page animation where supported
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        navigate();
      });
      return;
    }

    // Fallback: smooth transition before routing
    setTimeout(() => {
      navigate();
    }, 200);
  };

  return (
    <motion.nav
      animate={isTransitioning ? { opacity: 0.4, y: -6 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
      aria-label="Legal navigation"
      className="mb-4 flex flex-wrap items-center gap-x-2 font-mono text-xs font-semibold uppercase tracking-[0.2em]"
    >
      {/* Inactive on legal pages: Black, hoverable to blue */}
      <Link
        href="/#scene-hero"
        onClick={handleHeroNavigation}
        className="text-black transition-all duration-150 hover:text-[#0038ff] hover:underline cursor-pointer active:scale-95"
      >
        FITCHECK
      </Link>

      <span className="text-black/30 select-none" aria-hidden="true">
        /
      </span>

      {
    currentPage === "privacy" ? (
      // Active on Privacy page: Blue & Bold
      <span className="text-[#0038ff] font-bold" aria-current="page">
        PRIVACY POLICY
      </span>
    ) : (
    // Inactive: Black, hoverable to blue
    <Link
      href="/privacy"
      className="text-black transition-all duration-150 hover:text-[#0038ff] hover:underline active:scale-95 cursor-pointer"
    >
      PRIVACY POLICY
    </Link>
  )
  }

  <span className="text-black/30 select-none" aria-hidden="true">
    /
  </span>

  {
    currentPage === "terms" ? (
      // Active on Terms page: Blue & Bold
      <span className="text-[#0038ff] font-bold" aria-current="page">
        TERMS OF SERVICE
      </span>
    ) : (
    // Inactive: Black, hoverable to blue
    <Link
      href="/terms"
      className="text-black transition-all duration-150 hover:text-[#0038ff] hover:underline active:scale-95 cursor-pointer"
    >
      TERMS OF SERVICE
    </Link>
  )
  }
    </motion.nav >
  );
}

