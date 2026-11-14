"use client";

import { ChevronDown } from "lucide-react";
import { ScrollHeading, ScrollText, ScrollReveal } from "./ScrollReveal";
import { allFaqs } from "@/app/lib/faqs";

const faqs = allFaqs.flatMap(({ audience, faqs: group }) => group.map((faq) => ({ ...faq, audience })));

const faqColumns = [
  faqs.filter((_, index) => index % 2 === 0),
  faqs.filter((_, index) => index % 2 === 1),
];

export function FaqAccordion() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="editorial-section scroll-mt-8 text-[#101b43]">
      <div className="mx-auto mb-10 max-w-3xl text-center">
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
        <div className="grid gap-x-10 border-t border-[#c9d4ff] md:grid-cols-2">
          {faqColumns.map((column, index) => (
            <div key={`faq-column-${index}`} className="flex flex-col">
              {column.map(({ question, answer, audience }) => (
                <details key={question} name="fitcheck-faq" className="border-b border-[#d5d5e4]">
                  <summary
                    className="faq-summary flex cursor-pointer list-none items-start justify-between gap-4 py-4 px-2.5 text-left text-base font-semibold text-[#101b43] transition-colors duration-200 hover:bg-[#0038ff]/[0.04] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038ff] sm:text-lg"
                  >
                    <span>
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#0038ff]">{audience}</span>
                      <span className="block">{question}</span>
                    </span>
                    <ChevronDown
                      size={20}
                      aria-hidden="true"
                      className="faq-chevron shrink-0 pt-0.5 text-[#66739a]"
                    />
                  </summary>
                  <div className="max-w-3xl px-2 pb-5 text-sm sm:text-base font-normal tracking-[-0.015em] leading-7 text-[#253360]">
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
