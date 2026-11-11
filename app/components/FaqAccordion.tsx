const shopperFaqs = [
  {
    question: "Can FitCheck help me choose my size?",
    answer: (
      <p>
        FitCheck can give you a visual idea of how a style might look, but it can’t confirm your size or guarantee how a garment will fit. For sizing, check the brand’s size chart. If you’re unsure how to read it, ask the seller before ordering.
      </p>
    ),
  },
  {
    question: "Can I use a photo instead of my camera?",
    answer: (
      <p>
        Yes. Choose live camera or upload a photo. The camera is used only if you choose that option and agree; audio stays off. You get one 15-second preview per hour per verified Google account across both options.
      </p>
    ),
  },
  {
    question: "How is my photo used?",
    answer: (
      <p>
        If you agree to continue, your live camera video or uploaded photo and the selected garment image stream from your browser to Decart. FitCheck does not save your media or generated video. Decart’s media handling must be approved before the preview is enabled. The <a href="/privacy" className="text-[#0038ff]">Privacy Notice</a> explains the survey and account data FitCheck stores.
      </p>
    ),
  },
  {
    question: "How many previews can I use?",
    answer: (
      <p>
        Choose live camera or photo, complete the questionnaire, and sign in with a verified Gmail or Google Workspace account. Each account can use one 15-second preview per hour across both options. If setup fails before the preview appears, the try is restored.
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
        The previews are available only after setup and provider approval. If enabled, choose an option and follow the steps on screen. If you still have trouble with your photo, camera, or connection, <a href="mailto:fitcheckai0@gmail.com" className="text-[#0038ff]">email FitCheck</a> and we’ll help you understand what to try next.
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
        The pilot is aimed at Philippine fashion brands selling curated or higher-margin clothing through assisted sales. If you’re unsure whether your products are a fit, tell us about your brand and the garments you’d like to preview by <a href="mailto:fitcheckai0@gmail.com" className="text-[#0038ff]">emailing FitCheck</a>.
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
        The form prepares an email inquiry with the details you provide. Review and send it from your email app; this does not enroll your business or confirm a pilot.
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
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <h2 id="faq-title" className="editorial-heading italic faq-scroll-heading">
          Questions, answered.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#34436f]">
          Whether you’re exploring a look or considering a brand pilot, we’re here to help you understand what FitCheck can do.
        </p>
      </div>
      <div className="grid gap-x-8 border-t border-[#c9d4ff] md:grid-cols-2">
        {faqColumns.map((column, index) => (
          <div key={`faq-column-${index}`} className="flex flex-col">
            {column.map(({ question, answer, audience }) => (
              <details key={question} name="fitcheck-faq" className="border-b border-[#d5d5e4]">
                <summary className="faq-summary flex cursor-pointer list-none items-start justify-between gap-4 py-3 text-left text-base font-semibold text-[#101b43] sm:text-lg">
                  <span>
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#0038ff]">{audience}</span>
                    <span className="block">{question}</span>
                  </span>
                  <span aria-hidden="true" className="faq-chevron shrink-0 pt-1 text-[#66739a]">⌄</span>
                </summary>
                <div className="max-w-3xl pb-4 text-sm leading-7 text-[#34436f] sm:text-base">
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
