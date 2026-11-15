"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollHeading, ScrollText, ScrollReveal } from "./ScrollReveal";
import { allFaqs } from "@/app/lib/faqs";

// One column, one audience at a time, so the section stays short.
// Inactive panels are still rendered (with `hidden`), so every question and answer
// remains in the server HTML for search engines and AI crawlers.
export function FaqAccordion() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    const next = (index + allFaqs.length) % allFaqs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") focusTab(index + 1);
    else if (event.key === "ArrowLeft") focusTab(index - 1);
    else if (event.key === "Home") focusTab(0);
    else if (event.key === "End") focusTab(allFaqs.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="editorial-section scroll-mt-8 text-[#101b43]">
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <ScrollHeading margin="-80px">
          <h2 id="faq-title" className="editorial-heading italic faq-scroll-heading">
            Questions, answered.
          </h2>
        </ScrollHeading>
        <ScrollText delay={0.1} margin="-80px">
          <p className="mx-auto mt-4 max-w-2xl text-lg sm:text-xl font-medium tracking-[-0.025em] leading-relaxed text-[#253360]">
            Whether you’re exploring a look or considering working with us, we’re here to help you understand what FitCheck can do.
          </p>
        </ScrollText>
      </div>
      <ScrollReveal delay={0.15} margin="-80px">
        {/* pb clears the footer CTA card, which overlaps upward with a negative margin. */}
        <div className="mx-auto max-w-3xl pb-14 sm:pb-16">
          <div
            role="tablist"
            aria-label="FAQ topics"
            className="mb-4 flex justify-center gap-2"
          >
            {allFaqs.map(({ audience, tab }, index) => {
              const selected = index === active;
              return (
                <button
                  key={audience}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`faq-tab-${index}`}
                  aria-selected={selected}
                  aria-controls={`faq-panel-${index}`}
                  title={audience}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff] sm:text-base ${
                    selected
                      ? "border-[#0038ff] bg-[#0038ff] text-white"
                      : "border-[#c9d4ff] bg-white text-[#253360] hover:border-[#0038ff] hover:text-[#0038ff]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {allFaqs.map(({ audience, faqs }, index) => (
            <div
              key={audience}
              role="tabpanel"
              id={`faq-panel-${index}`}
              aria-labelledby={`faq-tab-${index}`}
              hidden={index !== active}
              className="border-t border-[#c9d4ff]"
            >
              {faqs.map(({ question, answer }) => (
                <details key={question} name="fitcheck-faq" className="border-b border-[#d5d5e4]">
                  <summary
                    className="faq-summary flex cursor-pointer list-none items-start justify-between gap-4 py-4 px-2.5 text-left text-base font-semibold text-[#101b43] transition-colors duration-200 hover:bg-[#0038ff]/[0.04] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff] sm:text-lg"
                  >
                    <span>{question}</span>
                    <ChevronDown
                      size={20}
                      aria-hidden="true"
                      className="faq-chevron shrink-0 pt-0.5 text-[#66739a]"
                    />
                  </summary>
                  <div className="px-2.5 pb-5 text-sm sm:text-base font-normal tracking-[-0.015em] leading-7 text-[#253360]">
                    {answer}
                  </div>
                </details>
              ))}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
