import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/app/(pages)/services/service-detail-page";
import { getAllServiceSlugs, getServiceBySlug } from "@/lib/services-content";

import { fetchPublicService } from "@/lib/api";
import { generateFaqJsonLd, getDynamicServiceMetadata } from "@/lib/seo-helpers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const staticService = getServiceBySlug(slug);

  return getDynamicServiceMetadata(slug, {
    title: staticService ? `${staticService.title} | Shift My Car` : "Car Relocation Service",
    description: staticService?.shortDescription || "Safe, insured vehicle transport services across India.",
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const staticService = getServiceBySlug(slug);
  const dynamicService = await fetchPublicService(slug).catch(() => null);

  if (!staticService && !dynamicService) {
    notFound();
  }

  const faqLd = generateFaqJsonLd(dynamicService?.faqItems);

  return (
    <>
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={faqLd}
        />
      )}
      <ServiceDetailPage slug={slug} initialService={dynamicService} />
    </>
  );
}
