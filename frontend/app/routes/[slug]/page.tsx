import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RouteDetailPage } from "@/app/(pages)/routes/route-detail-page";
import { getAllRouteSlugs, getRouteBySlug } from "@/lib/routes-content";

import { fetchPublicRoute } from "@/lib/api";
import { generateFaqJsonLd, getDynamicRouteMetadata } from "@/lib/seo-helpers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllRouteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const staticRoute = getRouteBySlug(slug);

  return getDynamicRouteMetadata(slug, {
    title: staticRoute ? `${staticRoute.title} | Shift My Car` : "Intercity Car Relocation",
    description: staticRoute?.description || "Reliable, insured car shipping services across India.",
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const staticRoute = getRouteBySlug(slug);
  const dynamicRoute = await fetchPublicRoute(slug).catch(() => null);

  if (!staticRoute && !dynamicRoute) {
    notFound();
  }

  const faqLd = generateFaqJsonLd(dynamicRoute?.faqItems);

  return (
    <>
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={faqLd}
        />
      )}
      <RouteDetailPage slug={slug} initialRoute={dynamicRoute} />
    </>
  );
}
