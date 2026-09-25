import type { Metadata } from "next";
import { RoutesPage } from "@/app/(pages)/routes/routes-page";
import { fetchPublicPageSeo } from "@/lib/api";
import { generateFaqJsonLd, getDynamicPageMetadata } from "@/lib/seo-helpers";

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicPageMetadata("/routes", {
    title: "Car Transportation Routes Across India | Shift My Car",
    description:
      "Explore Shift My Car's nationwide shipping network with verified distances, transit times, live GPS tracking, and insurance protection.",
  });
}

export default async function Page() {
  const pageSeo = await fetchPublicPageSeo("/routes").catch(() => null);
  const faqLd = generateFaqJsonLd(pageSeo?.faqItems);

  return (
    <>
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={faqLd}
        />
      )}
      <RoutesPage />
    </>
  );
}
