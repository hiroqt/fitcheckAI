"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { ScrollStagger, ScrollStaggerItem } from "./ScrollReveal";
import { StorefrontShowcase } from "./StorefrontShowcase";

const packs = [
  {
    name: "Starter",
    price: "₱499",
    detail: "5 previews · up to 30 seconds each",
    description: "A simple way to try FitCheck with one collection.",
    features: ["One-time prepaid pack", "About ₱100 per preview", "No automatic top-ups"],
    selection: "499",
  },
  {
    name: "Growth",
    price: "₱1,799",
    detail: "20 previews · up to 30 seconds each",
    description: "For brands handling regular preview requests.",
    features: ["One-time prepaid pack", "About ₱90 per preview", "Around 10% less per preview than Starter", "No automatic top-ups"],
    selection: "1799",
    recommended: true,
  },
  {
    name: "Larger business",
    price: "₱4,999 / month",
    detail: "Plus metered usage",
    description: "For multi-brand retailers planning a higher-volume pilot.",
    features: ["Monthly plan with metered usage", "Usage and allowances tailored to the pilot", "Confirm session limits before launch"],
    selection: "larger_business",
  },
  {
    name: "Custom",
    price: "Custom",
    detail: "Quote after discovery",
    description: "A tailored quote based on preview volume, number of brands, team access, and reporting or integration needs.",
    features: ["Scope expected preview volume and session limits", "Plan for the number of brands and team access", "Discuss reporting or integration needs", "Final features and usage rates agreed before the pilot"],
    selection: "enterprise",
  },
];

export function MinimalPricing({ onOpenPilotModal }: { onOpenPilotModal: (pack?: string) => void }) {
  return (
    <section id="scene-pricing" className="editorial-section scroll-mt-8" aria-labelledby="pricing-title">
      <div className="text-center">
        <h2 id="pricing-title" className="editorial-heading italic">Choose the right pilot for your brand</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg sm:text-xl font-medium tracking-[-0.025em] text-[#253360]">
          Start small, choose the best value for regular use, or talk with us about a larger or custom pilot.
        </p>
      </div>

      <ScrollStagger
        stagger={0.08}
        margin="-60px"
        className="mt-10 grid list-none gap-5 p-0 md:grid-cols-2 md:items-stretch xl:grid-cols-4"
      >
        {packs.map(({ name, price, detail, description, features, selection, recommended }) => (
          <ScrollStaggerItem key={name} className="flex">
            <li
              className={`relative flex min-w-0 w-full flex-col items-center rounded-md border bg-white p-6 text-center text-[#101b43] transition-all duration-200 hover:border-[#0038ff] hover:shadow-md ${
                recommended
                  ? "border-2 border-[#0038ff] md:my-[-.75rem] md:py-8"
                  : "border-[#c4cee9]"
              }`}
            >
              {recommended && (
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#0038ff]">
                  Best value
                </p>
              )}

              <h3 className="text-lg font-bold tracking-tight">{name}</h3>
              <p className="mt-3 text-3xl font-black leading-tight tabular-nums tracking-tight">{price}</p>
              <p className="mt-2 text-sm font-bold tracking-[-0.015em] text-[#0038ff]">{detail}</p>
              <p className="mt-4 min-h-12 text-sm font-medium tracking-[-0.015em] leading-relaxed text-[#34436f]">{description}</p>

              <ul className="mt-5 w-full grow list-none space-y-3 border-t border-[#d5d5e4] p-0 pt-4 text-sm leading-relaxed text-[#34436f]">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start justify-center gap-2.5">
                    <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-[#0038ff]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onOpenPilotModal(selection)}
                className={`mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-sm border px-4 py-2.5 text-xs font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff] sm:text-sm ${
                  recommended
                    ? "border-[#0038ff] bg-[#0038ff] text-white hover:bg-[#002bdc]"
                    : "border-[#0038ff] text-[#0038ff] hover:bg-[#eef1ff]"
                }`}
              >
                <span>{recommended ? "Choose Growth" : name === "Custom" ? "Discuss custom plan" : name === "Larger business" ? "Plan larger pilot" : "Choose Starter"}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            </li>
          </ScrollStaggerItem>
        ))}
      </ScrollStagger>

      <p className="mx-auto mt-8 max-w-4xl text-center text-sm font-medium tracking-[-0.015em] leading-relaxed text-[#515d82]">
        Pilot test offers from our planning guide. Starter and Growth are proposed prepaid packs with no automatic top-ups. Larger Business and Custom are planning options; Custom pricing is scoped around your expected usage and business needs. Final allowances, session rules, taxes, and billing terms must be confirmed before any paid pilot.
      </p>

      {/* Interactive Website & Storefront Showcase */}
      <StorefrontShowcase onOpenPilotModal={onOpenPilotModal} />
    </section>
  );
}
