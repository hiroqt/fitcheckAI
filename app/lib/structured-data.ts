// schema.org JSON-LD for search engines and AI answer engines (AEO/GEO).
// Built from the same data the page renders, so the markup cannot drift from visible content.
import { allFaqs, faqAnswerText } from "./faqs";
import { packs } from "./pricing";
import {
  CONTACT_EMAIL,
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
} from "./site";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SERVICE_ID = `${SITE_URL}/#virtual-try-on`;

/** Site-wide entities, rendered in the root layout. */
export function siteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png`, width: 512, height: 512 },
        image: `${SITE_URL}/opengraph.jpg`,
        description: SITE_DESCRIPTION,
        email: CONTACT_EMAIL,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: CONTACT_EMAIL,
          areaServed: "PH",
          availableLanguage: ["en"],
        },
        areaServed: { "@type": "Country", name: "Philippines" },
        knowsAbout: ["virtual try-on", "AI fashion preview", "fashion e-commerce", "Philippine fashion brands"],
        sameAs: SOCIAL_PROFILES,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/** Homepage entities: the page itself, the service and its plans, and the FAQ. */
export function homePageSchema() {
  const faqEntities = allFaqs.flatMap(({ faqs }) =>
    faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerText(faq) },
    }))
  );

  const offers = packs.map((pack) => ({
    "@type": "Offer",
    name: `${pack.name} plan`,
    description: `${pack.detail}. ${pack.description}`,
    url: `${SITE_URL}/#scene-pricing`,
    seller: { "@id": ORG_ID },
    ...(pack.amountPhp !== undefined
      ? {
          price: pack.amountPhp,
          priceCurrency: "PHP",
          ...(pack.billing === "monthly"
            ? {
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: pack.amountPhp,
                  priceCurrency: "PHP",
                  unitCode: "MON",
                  referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
                },
              }
            : {}),
        }
      : {}),
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${SITE_NAME}: Live Virtual Try-On for Fashion Brands`,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": SERVICE_ID },
        publisher: { "@id": ORG_ID },
        primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/opengraph.jpg` },
      },
      {
        "@type": "Service",
        "@id": SERVICE_ID,
        name: "FitCheck virtual try-on",
        serviceType: "AI virtual try-on for fashion e-commerce",
        description:
          "A browser-based virtual try-on pilot: shoppers choose a featured garment and use their live camera or a photo to see a 15-second AI-generated preview of the look on them. No app install.",
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "Philippines" },
        audience: { "@type": "BusinessAudience", audienceType: "Philippine fashion brands and retailers" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "FitCheck plans",
          itemListElement: offers,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        isPartOf: { "@id": `${SITE_URL}/#webpage` },
        mainEntity: faqEntities,
      },
    ],
  };
}

/** Serializes JSON-LD safely for an inline <script> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
