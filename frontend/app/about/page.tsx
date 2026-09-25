import type { Metadata } from "next";
import { AboutPage } from "@/app/(pages)/about/about-page";
import { fetchPublicPageSeo } from "@/lib/api";
import { generateFaqJsonLd, getDynamicPageMetadata } from "@/lib/seo-helpers";

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicPageMetadata("/about", {
    title: "About Us | Shift My Car",
    description:
      "Shift My Car is your premier partner for insured vehicle relocation, enclosed auto transport, and door-to-door carrier services across India.",
  });
}

export default async function Page() {
  const pageSeo = await fetchPublicPageSeo("/about").catch(() => null);
  const faqLd = generateFaqJsonLd(pageSeo?.faqItems);

  return (
    <>
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={faqLd}
        />
      )}
      <AboutPage />
    </>
  );
}
