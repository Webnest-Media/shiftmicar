import { notFound } from "next/navigation";
import { CtaBanner } from "@/app/(pages)/home/components/cta-banner";
import { RelatedServices } from "@/app/(pages)/services/components/related-services";
import { ServiceDetailContent } from "@/app/(pages)/services/components/service-detail-content";
import { ServiceDetailHero } from "@/app/(pages)/services/components/service-detail-hero";
import { getServiceBySlug, type ServiceDetail } from "@/lib/services-content";
import type { ServiceItem } from "@/lib/blog-types";

type ServiceDetailPageProps = {
  slug: string;
  initialService?: ServiceItem | null;
};

export function ServiceDetailPage({ slug, initialService }: ServiceDetailPageProps) {
  const staticService = getServiceBySlug(slug);

  const service: ServiceDetail | null = initialService
    ? {
        slug: initialService.slug || slug,
        index: initialService.index || staticService?.index || "01",
        title: initialService.title || staticService?.title || "",
        shortDescription: initialService.shortDescription || staticService?.shortDescription || "",
        image: initialService.image || staticService?.image || "/assets/services-page/dedicated-transport-hd.jpg",
        alt: initialService.alt || staticService?.alt || initialService.title || "Car transportation",
        overview:
          initialService.overview && initialService.overview.length > 0
            ? initialService.overview
            : staticService?.overview || [initialService.shortDescription],
        features:
          initialService.features && initialService.features.length > 0
            ? initialService.features.map((f, i) => ({
                number: f.number || `0${i + 1}.`,
                title: f.title,
                description: f.description,
              }))
            : staticService?.features || [],
      }
    : staticService || null;

  if (!service) {
    notFound();
  }

  return (
    <>
      <ServiceDetailHero service={service} />
      <ServiceDetailContent service={service} />
      <RelatedServices currentSlug={service.slug} />
      <CtaBanner />
    </>
  );
}
