import { LandingPage } from "./components/LandingPage";
import { homePageSchema, jsonLd } from "./lib/structured-data";

// Server entry for "/": emits homepage structured data (WebPage, Service + plans, FAQPage)
// in the server HTML, then renders the interactive client landing page unchanged.
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(homePageSchema())} />
      <LandingPage />
    </>
  );
}
