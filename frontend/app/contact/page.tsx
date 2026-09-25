import type { Metadata } from "next";
import { ContactPage } from "@/app/(pages)/contact/contact-page";
import { fetchPublicPageSeo } from "@/lib/api";
import { generateFaqJsonLd, getDynamicPageMetadata } from "@/lib/seo-helpers";

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicPageMetadata("/contact", {
    title: "Contact Us & Instant Car Shipping Quote | Shift My Car",
    description:
      "Get in touch with Shift My Car for a quote on dedicated transport, shared carriers, door-to-door delivery, or express car delivery across India.",
  });
}

export default async function Page() {
  const pageSeo = await fetchPublicPageSeo("/contact").catch(() => null);
  const faqLd = generateFaqJsonLd(pageSeo?.faqItems);

  return (
    <>
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={faqLd}
        />
      )}
      <ContactPage />
    </>
  );
}
