import type { ReactNode } from "react";

// Single source of truth for the FAQ: rendered by FaqAccordion and serialized into
// server-side consumers. Answers stay JSX so they can contain links.
export type Faq = { question: string; answer: ReactNode };

export const shopperFaqs: Faq[] = [
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
    question: "How are my photo and camera video used?",
    answer: (
      <p>
        If you agree to continue, your live camera video or uploaded photo and the selected garment image stream from your browser to Decart. FitCheck does not save your media or generated video. Decart’s media handling must be approved before the preview is enabled. The <a href="/privacy" className="text-[#0038ff] underline hover:text-[#002bdc]">Privacy Notice</a> explains the survey and account data FitCheck stores.
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
        The previews are available only after setup and provider approval. If enabled, choose an option and follow the steps on screen. If you still have trouble with your photo, camera, or connection, <a href="mailto:fitcheckai0@gmail.com" className="text-[#0038ff] underline hover:text-[#002bdc]">email FitCheck</a> and we’ll help you understand what to try next.
      </p>
    ),
  },
];

export const brandFaqs: Faq[] = [
  {
    question: "Could FitCheck help my customers decide whether a style suits them?",
    answer: (
      <p>
        That’s what the retailer pilot is designed to explore: an optional visual preview for shoppers who want help evaluating a style. It isn’t a sizing tool, and we can’t promise more sales or fewer returns. We’d be glad to discuss whether it fits your customer conversations.
      </p>
    ),
  },
  {
    question: "Which brands is FitCheck designed for?",
    answer: (
      <p>
        FitCheck is aimed at Philippine fashion brands selling curated, tailored, or distinctive clothing. If you’re unsure whether your catalog is a good match, tell us about your brand and the garments you’d like to showcase by <a href="mailto:fitcheckai0@gmail.com" className="text-[#0038ff] underline hover:text-[#002bdc]">emailing us</a>.
      </p>
    ),
  },
  {
    question: "Are the prices and packages final?",
    answer: (
      <p>
        The prices shown represent introductory plan tiers. Final allowances and billing terms are confirmed directly with your team. If you’re interested, send us an email and we’ll walk through your requirements together.
      </p>
    ),
  },
  {
    question: "Does contacting you obligate or enroll my business?",
    answer: (
      <p>
        No. &ldquo;Work with us&rdquo; opens choices for a general inquiry, pricing and availability, or a demo request. Choosing one opens a prepared email draft for you to review and send. There is no automatic commitment or obligation.
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

// Direct, definition-style answers to the questions people ask search and AI assistants.
// Every statement here is already stated elsewhere on the site.
export const aboutFaqs: Faq[] = [
  {
    question: "What is FitCheck?",
    answer: (
      <p>
        FitCheck (FitCheck AI) is a browser-based virtual try-on pilot for Philippine fashion brands. Shoppers pick a featured garment, then use their live camera or upload a photo to see a 15-second AI-generated preview of how the look could appear on them. There is no app to install. It is a visual guide only and does not confirm size or fit.
      </p>
    ),
  },
  {
    question: "How much does FitCheck cost for brands?",
    answer: (
      <p>
        Brand plans start at ₱499 for a one-time Starter pack of 5 previews (up to 30 seconds each). Growth is ₱1,799 for 20 previews, Larger business is ₱4,999 per month plus metered usage, and Custom plans are quoted after a discovery call. These are introductory tiers; final allowances and billing terms are confirmed with your team. See the <a href="#scene-pricing" className="text-[#0038ff] underline hover:text-[#002bdc]">pricing section</a> for details.
      </p>
    ),
  },
];

export const allFaqs: { audience: string; faqs: Faq[] }[] = [
  { audience: "About FitCheck", faqs: aboutFaqs },
  { audience: "For shoppers", faqs: shopperFaqs },
  { audience: "For brand owners", faqs: brandFaqs },
];

