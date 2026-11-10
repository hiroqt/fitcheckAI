"use client";

import React, { useState, useEffect } from "react";
import { codeToHtml } from "shiki";
import { Check, Copy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SNIPPETS = {
  shopify: `<!-- snippets/fitcheck-widget.liquid -->
<script 
  src="https://cdn.fitcheck.ai/v1/sdk.js" 
  data-brand-key="{{ settings.fitcheck_api_key }}" 
  async
></script>

<div 
  id="fitcheck-pdp-container"
  data-sku="{{ product.selected_or_first_available_variant.sku }}"
  data-product-title="{{ product.title | escape }}"
  data-garment-type="{{ product.type | default: 'top' }}"
  data-fit-profile="contemporary-oversized"
></div>

<script>
  window.addEventListener('fitcheck:recommendation', function(e) {
    const { recommendedSize, confidence } = e.detail;
    // Auto-select corresponding size radio button in Shopify theme
    const sizeRadio = document.querySelector(\`input[name="Size"][value="\${recommendedSize}"]\`);
    if (sizeRadio) sizeRadio.click();
  });
</script>`,

  react: `// components/FitCheckWidget.tsx
'use client';

import { useEffect } from 'react';
import { useFitCheck } from '@fitcheck/react';

interface Props {
  sku: string;
  onSizeRecommend?: (size: string) => void;
}

export function FitCheckWidget({ sku, onSizeRecommend }: Props) {
  const { recommendation, isReady } = useFitCheck({
    brandKey: process.env.NEXT_PUBLIC_FITCHECK_KEY!,
    sku,
    theme: 'dark-luxury',
    onRecommend: (result) => {
      onSizeRecommend?.(result.size);
    }
  });

  if (!isReady) return null;

  return (
    <div className="fitcheck-badge border border-white/10 rounded-lg p-3 bg-white/5">
      <span className="font-mono text-xs text-emerald-400">⚡ {recommendation.confidence}% Match</span>
      <p className="text-sm font-medium">Recommended: Size {recommendation.size}</p>
    </div>
  );
}`,

  headless: `// Server-side Headless Node.js / Next.js Route Handler
import { FitCheckClient } from '@fitcheck/sdk';

const fitcheck = new FitCheckClient({
  apiKey: process.env.FITCHECK_SECRET_KEY,
});

export async function POST(req: Request) {
  const { customerMeasurements, sku } = await req.json();

  const fitAnalysis = await fitcheck.drape.calculate({
    sku,
    user: {
      heightCm: customerMeasurements.height,
      weightKg: customerMeasurements.weight,
      drapePreference: 'relaxed',
    },
    includeTensionMap: true,
  });

  return Response.json({
    recommendedSize: fitAnalysis.size,
    easeCm: fitAnalysis.chestEase,
    returnRisk: fitAnalysis.estimatedReturnProbability, // e.g. 0.024 (2.4%)
  });
}`
};

export function CodeSnippet() {
  const [activeTab, setActiveTab] = useState<"shopify" | "react" | "headless">("shopify");
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<Record<string, string>>({});

  useEffect(() => {
    async function highlightAll() {
      try {
        const [shopifyHtml, reactHtml, headlessHtml] = await Promise.all([
          codeToHtml(SNIPPETS.shopify, { lang: "html", theme: "github-dark" }),
          codeToHtml(SNIPPETS.react, { lang: "typescript", theme: "github-dark" }),
          codeToHtml(SNIPPETS.headless, { lang: "typescript", theme: "github-dark" }),
        ]);

        setHighlightedCode({
          shopify: shopifyHtml,
          react: reactHtml,
          headless: headlessHtml,
        });
      } catch (err) {
        console.error("Shiki highlight error:", err);
      }
    }

    highlightAll();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(SNIPPETS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
          Developer Experience
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Drop-in ready in less than 5 minutes
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Clean TypeScript ergonomics, zero render blocking, and native event bindings designed for agency developers and in-house e-commerce engineering teams.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.12] bg-[#0E1015] overflow-hidden shadow-2xl">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "shopify" | "react" | "headless")}
          className="w-full"
        >
          {/* Header bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-white/[0.08] px-4 py-3 bg-[#13161D]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-white/20" />
                <span className="w-3 h-3 rounded-full bg-white/20" />
                <span className="w-3 h-3 rounded-full bg-white/20" />
              </div>
              <TabsList className="bg-transparent border border-white/[0.08] p-1 h-9 rounded-lg gap-1">
                <TabsTrigger
                  value="shopify"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs font-mono px-3 py-1 rounded"
                >
                  Shopify Liquid
                </TabsTrigger>
                <TabsTrigger
                  value="react"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs font-mono px-3 py-1 rounded"
                >
                  React / Next.js
                </TabsTrigger>
                <TabsTrigger
                  value="headless"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs font-mono px-3 py-1 rounded"
                >
                  Headless REST API
                </TabsTrigger>
              </TabsList>
            </div>

            <button
              onClick={handleCopy}
              type="button"
              className="mt-2 sm:mt-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>

          {/* Code display with Shiki */}
          <div className="p-4 sm:p-6 overflow-x-auto text-sm font-mono leading-relaxed bg-[#0A0C10]">
            {highlightedCode[activeTab] ? (
              <div
                className="[&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: highlightedCode[activeTab] }}
              />
            ) : (
              <pre className="text-slate-300">
                <code>{SNIPPETS[activeTab]}</code>
              </pre>
            )}
          </div>
        </Tabs>

        {/* Integration guarantees strip */}
        <div className="bg-[#11141B] border-t border-white/[0.08] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>NPM & CDN Verified</span>
          </div>
          <div>Strict Type Definitions Included</div>
          <div>Async Non-Blocking Execution</div>
          <div>CORS & ISO27001 Certified</div>
        </div>
      </div>
    </section>
  );
}

