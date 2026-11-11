import { ChevronDown } from "lucide-react";

const shopperFaqs = [
  {
    question: "Can FitCheck help me choose my size?",
    answer: (
      <p>
        FitCheck can give you a visual idea of how a style might look while you move, but it can’t confirm your size or guarantee how a garment will fit. For sizing, check the brand’s size chart. If you’re unsure how to read it, ask the seller before ordering.
      </p>
    ),
  },
  {
    question: "Do I have to use my camera?",
    answer: (
      <p>
        No. The live preview is optional, and you can browse without granting camera access. If you choose to try it, your browser will ask permission first. Your microphone stays off, and you can stop the preview at any time.
      </p>
    ),
  },
  {
    question: "How is my camera video used?",
    answer: (
      <p>
        If you start a live preview, your camera video and the selected garment image are processed to create the visual result. FitCheck’s evaluation database does not store those media files. The <a href="/privacy" className="text-[#0038ff] underline hover:text-[#002bdc]">Privacy Notice</a> explains what evaluation information is stored.
      </p>
    ),
  },
  {
    question: "The preview doesn’t look right. What should I do?",
    answer: (
      <p>
        Results are approximate and may be incomplete or inaccurate. They do not show exact fit, measurements, or fabric behavior. Please check the seller’s product details and size chart before deciding. If you have a question about the garment, the seller can help with its fit and sizing information.
      </p>
    ),
  },
  {
    question: "I can’t start or finish a preview. Can you help?",
    answer: (
      <p>
        The live preview is available only in a configured evaluation, so it may not be available to every visitor. If you’re taking part and still have trouble after checking camera permission and your connection, <a href="mailto:fitcheckai0@gmail.com" className="text-[#0038ff] underline hover:text-[#002bdc]">email FitCheck</a> and we’ll help you understand what to try next.
      </p>
    ),
  },
];

const brandFaqs = [
  {
    question: "Could FitCheck help my customers decide whether a style suits them?",
    answer: (
      <p>
        That’s what the retailer pilot is designed to explore: an optional visual preview for shoppers who want help evaluating a style. It isn’t a sizing tool, and we can’t promise more sales or fewer returns. We’d be glad to discuss whether it fits your customer conversations.
      </p>
    ),
  },
  {
    question: "Which brands is the pilot intended for?",
    answer: (
      <p>
        The pilot is aimed at Philippine fashion brands selling curated or higher-margin clothing through assisted sales. If you’re unsure whether your products are a fit, tell us about your brand and the garments you’d like to preview by <a href="mailto:fitcheckai0@gmail.com" className="text-[#0038ff] underline hover:text-[#002bdc]">emailing FitCheck</a>.
      </p>
    ),
  },
  {
    question: "Are the pilot prices and packages final?",
    answer: (
      <p>
        The prices shown are proposed pilot offers, not confirmed checkout packages. Final allowances and billing terms still need to be agreed. If you’re interested, email us and we can talk through your needs before any pilot offer is confirmed.
      </p>
    ),
  },
  {
    question: "Does the brand pilot form enroll my business?",
    answer: (
      <p>
        No. The form currently runs demo checks only; it does not save your details or confirm enrollment. Please don’t use it to send an actual application. To discuss a pilot, <a href="mailto:fitcheckai0@gmail.com" className="text-[#0038ff] underline hover:text-[#002bdc]">contact FitCheck by email</a>.
      </p>
    ),
  },
  {
    question: "How does the website subscription work?",
    answer: (
      <p>
        We create a website for your clothing brand and bill it monthly. We’ll agree on the website scope and monthly fee with you before work begins.
      </p>
    ),
  },
  {
    question: "Can I get a discount if I use FitCheck too?",
    answer: (
      <p>
        We’re proposing 10% off the monthly website fee when you pair the website subscription with a paid FitCheck plan. FitCheck previews are billed separately, and the offer’s eligibility and terms will be confirmed in your quote.
      </p>
    ),
  },
];

const faqs = [
  ...shopperFaqs.map((faq) => ({ ...faq, audience: "For shoppers" })),
  ...brandFaqs.map((faq) => ({ ...faq, audience: "For brand owners" })),
];

const faqColumns = [
  faqs.filter((_, index) => index % 2 === 0),
  faqs.filter((_, index) => index % 2 === 1),
];

export function FaqAccordion() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="editorial-section scroll-mt-8 text-[#101b43]">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2 id="faq-title" className="editorial-heading italic faq-scroll-heading">
          Questions, answered.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg sm:text-xl font-medium italic tracking-[-0.025em] leading-relaxed text-[#253360]">
          Whether you’re exploring a look or considering a brand pilot, we’re here to help you understand what FitCheck can do.
        </p>
      </div>
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
                <div className="max-w-3xl px-2 pb-5 text-sm sm:text-base font-normal italic tracking-[-0.015em] leading-7 text-[#253360]">
                  {answer}
                </div>
              </details>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
