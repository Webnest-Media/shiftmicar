import type { Metadata } from "next";
import { ServicesPage } from "@/app/(pages)/services/services-page";
import { fetchPublicPageSeo } from "@/lib/api";
import { generateFaqJsonLd, getDynamicPageMetadata } from "@/lib/seo-helpers";

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicPageMetadata("/services", {
    title: "Car Shifting Services | Shift My Car",
    description:
      "Reliable door-to-door car transport, dedicated car transport, car transportation by truck, and express vehicle delivery services across India.",
  });
}

export default async function Page() {
  const pageSeo = await fetchPublicPageSeo("/services").catch(() => null);
  const faqLd = generateFaqJsonLd(pageSeo?.faqItems);

  return (
    <>
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={faqLd}
        />
      )}
      <ServicesPage />
    </>
  );
}
