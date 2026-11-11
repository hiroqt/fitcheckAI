"use client";

import React from "react";
import { motion } from "framer-motion";
import { SiteFooter } from "../components/SiteFooter";

export default function LegalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="mx-auto max-w-[1600px] px-2.5 pt-2.5 sm:px-4 sm:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {children}
        </motion.div>
      </div>
      <SiteFooter />
    </>
  );
}
