import { ArrowUpRight, Check } from "lucide-react";

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
        <p className="mx-auto mt-3 max-w-2xl text-[#34436f]">
          Start small, choose the best value for regular use, or talk with us about a larger or custom pilot.
        </p>
      </div>

      <ul className="mt-8 grid list-none gap-4 p-0 md:grid-cols-2 md:items-stretch xl:grid-cols-4">
        {packs.map(({ name, price, detail, description, features, selection, recommended }) => (
          <li key={name} className={`relative flex min-w-0 flex-col items-center rounded-md border bg-white p-5 text-center text-[#101b43] sm:p-6 ${recommended ? "border-2 border-[#0038ff] md:my-[-.75rem] md:py-8" : "border-[#aebce8]"}`}>
            {recommended && (
              <p className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-sm bg-[#0038ff] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                <Check size={14} aria-hidden="true" /> Best value
              </p>
            )}
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="mt-3 text-3xl font-black leading-tight tabular-nums">{price}</p>
            <p className="mt-2 text-sm font-semibold text-[#0038ff]">{detail}</p>
            <p className="mt-4 min-h-12 leading-relaxed text-[#34436f]">{description}</p>
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
              className={`mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-sm border px-3 py-2.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff] sm:text-sm ${recommended ? "border-[#0038ff] bg-[#0038ff] text-white hover:bg-[#002dcc]" : "border-[#0038ff] text-[#0038ff] hover:bg-[#eef1ff]"}`}
            >
              {recommended ? "Choose Growth" : name === "Custom" ? "Discuss custom plan" : name === "Larger business" ? "Plan larger pilot" : "Choose Starter"}
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-6 max-w-4xl text-center text-sm leading-relaxed text-[#515d82]">
        Pilot test offers from our planning guide. Starter and Growth are proposed prepaid packs with no automatic top-ups. Larger Business and Custom are planning options; Custom pricing is scoped around your expected usage and business needs. Final allowances, session rules, taxes, and billing terms must be confirmed before any paid pilot.
      </p>

      <div className="mx-auto mt-16 max-w-5xl border-t border-[#d5d5e4] pt-10 text-center sm:pt-12">
        <h3 className="text-balance text-3xl font-black italic tracking-[-0.04em] text-[#101b43] sm:text-4xl">
          Don’t have a website?
        </h3>
        <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-[#34436f]">
          We can build a website for your clothing brand and bring it together with FitCheck. We’ll shape the site around your needs and agree on its scope and monthly subscription before work begins.
        </p>

        <div className="mx-auto mt-7 grid max-w-4xl gap-5 border-y border-[#d5d5e4] py-6 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center">
            <h4 className="font-bold text-[#101b43]">Monthly website subscription</h4>
            <p className="mt-2 text-2xl font-black text-[#0038ff]">Custom monthly quote</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#34436f]">
              The monthly price is based on the website your brand needs.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center border-t border-[#d5d5e4] pt-5 md:border-l md:border-t-0 md:pt-0">
            <h4 className="font-bold text-[#101b43]">Bundle discount</h4>
            <p className="mt-2 text-2xl font-black text-[#0038ff]">Proposed 10% off</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#34436f]">
              Pair the website subscription with a paid FitCheck plan to save 10% on the monthly website fee. FitCheck previews are billed separately.
            </p>
          </div>
        </div>

        <a
          className="editorial-action mt-6"
          href="mailto:fitcheckai0@gmail.com?subject=Website%20and%20FitCheck%20bundle"
        >
          Let’s talk about your website <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-[#515d82]">
          The 10% bundle discount is a proposed offer. Website scope, monthly price, subscription terms, and discount eligibility are confirmed in your quote.
        </p>
      </div>
    </section>
  );
}
