import type { Metadata } from "next";
import { HomePage } from "@/app/(pages)/home/home-page";
import { fetchPublicPageSeo } from "@/lib/api";
import { generateFaqJsonLd, getDynamicPageMetadata } from "@/lib/seo-helpers";

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicPageMetadata("/", {
    title: "Shift My Car | Reliable Car Transport & Relocation Services Across India",
    description:
      "Safe, insured, and verified car transportation services across India. Dedicated carriers, door-to-door delivery, live GPS tracking, and instant quotes.",
  });
}

export default async function Page() {
  const pageSeo = await fetchPublicPageSeo("/").catch(() => null);
  const faqLd = generateFaqJsonLd(pageSeo?.faqItems);

  return (
    <>
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={faqLd}
        />
      )}
      <HomePage />
    </>
  );
}
