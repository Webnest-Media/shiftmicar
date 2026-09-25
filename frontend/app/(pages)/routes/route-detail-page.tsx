import { notFound } from "next/navigation";
import { RelatedRoutes } from "@/app/(pages)/routes/components/related-routes";
import { RouteCta } from "@/app/(pages)/routes/components/route-cta";
import { RouteDetailHero } from "@/app/(pages)/routes/components/route-detail-hero";
import { RouteInformation } from "@/app/(pages)/routes/components/route-information";
import { RouteMapSection } from "@/app/(pages)/routes/components/route-map-section";
import { RouteProcess } from "@/app/(pages)/routes/components/route-process";
import { getRouteBySlug, type RouteDetail } from "@/lib/routes-content";
import type { RouteItem } from "@/lib/blog-types";

type RouteDetailPageProps = {
  slug: string;
  initialRoute?: RouteItem | null;
};

export function RouteDetailPage({ slug, initialRoute }: RouteDetailPageProps) {
  const staticRoute = getRouteBySlug(slug);

  const route: RouteDetail | null = initialRoute
    ? {
        slug: initialRoute.slug || slug,
        number: initialRoute.number || staticRoute?.number || "01",
        origin: initialRoute.origin || initialRoute.fromCity || staticRoute?.origin || "Origin",
        destination: initialRoute.destination || initialRoute.toCity || staticRoute?.destination || "Destination",
        title:
          initialRoute.title ||
          staticRoute?.title ||
          `${initialRoute.origin || initialRoute.fromCity} to ${initialRoute.destination || initialRoute.toCity}`,
        description: initialRoute.description || staticRoute?.description || "",
        detailDescription:
          initialRoute.detailDescription || initialRoute.content || staticRoute?.detailDescription || "",
        image: initialRoute.image || staticRoute?.image || "/assets/routes/route-01.jpg",
        alt: initialRoute.alt || staticRoute?.alt || "Vehicle transportation corridor",
        isPanIndia: initialRoute.isPanIndia ?? staticRoute?.isPanIndia ?? false,
        featured: initialRoute.featured ?? staticRoute?.featured ?? false,
        originCoords: {
          lat: initialRoute.originLat ?? (initialRoute.fromLat != null ? Number(initialRoute.fromLat) : undefined) ?? staticRoute?.originCoords?.lat ?? 28.6139,
          lng: initialRoute.originLng ?? (initialRoute.fromLng != null ? Number(initialRoute.fromLng) : undefined) ?? staticRoute?.originCoords?.lng ?? 77.2090,
        },
        destinationCoords:
          (initialRoute.destinationLat != null && initialRoute.destinationLng != null)
            ? { lat: Number(initialRoute.destinationLat), lng: Number(initialRoute.destinationLng) }
            : (initialRoute.toLat != null && initialRoute.toLng != null)
            ? { lat: Number(initialRoute.toLat), lng: Number(initialRoute.toLng) }
            : staticRoute?.destinationCoords,
        highlights:
          initialRoute.highlights && initialRoute.highlights.length > 0
            ? initialRoute.highlights
            : staticRoute?.highlights,
      }
    : staticRoute || null;

  if (!route) {
    notFound();
  }

  return (
    <>
      <RouteDetailHero route={route} />
      <RouteMapSection route={route} />
      <RouteInformation route={route} />
      <RouteProcess />
      <RelatedRoutes currentSlug={route.slug} />
      <RouteCta route={route} />
    </>
  );
}
