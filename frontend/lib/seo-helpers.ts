import type { Metadata } from "next";
import { fetchPublicPageSeo, fetchPublicRoute, fetchPublicService } from "@/lib/api";
import type { FaqItem } from "@/lib/blog-types";

type FallbackMeta = {
  title: string;
  description: string;
  image?: string;
};

export async function getDynamicPageMetadata(
  path: string,
  fallback: FallbackMeta,
): Promise<Metadata> {
  const seo = await fetchPublicPageSeo(path).catch(() => null);

  if (!seo) {
    return {
      title: fallback.title,
      description: fallback.description,
      openGraph: fallback.image
        ? { images: [{ url: fallback.image }] }
        : undefined,
    };
  }

  const title = seo.metaTitle || fallback.title;
  const description = seo.metaDescription || fallback.description;
  const image = seo.ogImage || fallback.image;

  return {
    title,
    description,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
    },
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || title,
      description: seo.twitterDescription || seo.ogDescription || description,
      ...(seo.twitterImage || image ? { images: [seo.twitterImage || image!] } : {}),
    },
  };
}

export async function getDynamicServiceMetadata(
  slug: string,
  fallback: FallbackMeta,
): Promise<Metadata> {
  const service = await fetchPublicService(slug).catch(() => null);

  if (!service) {
    return {
      title: fallback.title,
      description: fallback.description,
    };
  }

  const title = service.metaTitle || `${service.title} | Shift My Car`;
  const description = service.metaDescription || service.shortDescription || fallback.description;
  const image = service.ogImage || service.image || fallback.image;

  return {
    title,
    description,
    alternates: service.canonicalUrl ? { canonical: service.canonicalUrl } : undefined,
    robots: {
      index: service.robotsIndex,
      follow: service.robotsFollow,
    },
    openGraph: {
      title: service.ogTitle || title,
      description: service.ogDescription || description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: service.twitterTitle || service.ogTitle || title,
      description: service.twitterDescription || service.ogDescription || description,
      ...(service.twitterImage || image ? { images: [service.twitterImage || image!] } : {}),
    },
  };
}

export async function getDynamicRouteMetadata(
  slug: string,
  fallback: FallbackMeta,
): Promise<Metadata> {
  const route = await fetchPublicRoute(slug).catch(() => null);

  if (!route) {
    return {
      title: fallback.title,
      description: fallback.description,
    };
  }

  const title = route.metaTitle || `Car Transport from ${route.fromCity} to ${route.toCity} | Shift My Car`;
  const description =
    route.metaDescription ||
    `Safe car shipping service from ${route.fromCity} to ${route.toCity}. Distance ${route.distanceKm} km.`;
  const image = route.ogImage || fallback.image;

  return {
    title,
    description,
    alternates: route.canonicalUrl ? { canonical: route.canonicalUrl } : undefined,
    robots: {
      index: route.robotsIndex,
      follow: route.robotsFollow,
    },
    openGraph: {
      title: route.ogTitle || title,
      description: route.ogDescription || description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: route.twitterTitle || route.ogTitle || title,
      description: route.twitterDescription || route.ogDescription || description,
      ...(route.twitterImage || image ? { images: [route.twitterImage || image!] } : {}),
    },
  };
}

export function generateFaqJsonLd(faqItems?: FaqItem[] | null) {
  if (!faqItems || faqItems.length === 0) return null;
  const valid = faqItems.filter((f) => f.question?.trim() && f.answer?.trim());
  if (valid.length === 0) return null;

  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: valid.map((item) => ({
        "@type": "Question",
        name: item.question.trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer.trim(),
        },
      })),
    }),
  };
}
