import slugify from "slugify";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { analyzeSeo } from "../utils/seo-analysis.js";

function makeSlug(value: string) {
  return slugify(value, { lower: true, strict: true, trim: true });
}

export async function listRoutesAdmin() {
  return prisma.route.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function listRoutesPublic() {
  return prisma.route.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getRouteById(id: string) {
  const route = await prisma.route.findUnique({ where: { id } });
  if (!route) throw new AppError("Route not found", 404);
  return route;
}

export async function getRouteBySlug(slug: string) {
  const route = await prisma.route.findUnique({ where: { slug } });
  if (!route) throw new AppError("Route not found", 404);
  return route;
}

export async function createRoute(input: any) {
  let slug = input.slug
    ? makeSlug(input.slug)
    : makeSlug(`${input.origin}-to-${input.destination}`);

  const existingSlug = await prisma.route.findUnique({ where: { slug } });
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const seo = analyzeSeo({
    title: input.metaTitle || input.title,
    slug,
    content: input.detailDescription || input.description,
    focusKeyword: input.focusKeyword,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    canonicalUrl: input.canonicalUrl,
    featuredImage: input.image,
    featuredImageAlt: input.alt,
  });

  return prisma.route.create({
    data: {
      ...input,
      slug,
      seoHealth: seo.health,
    },
  });
}

export async function updateRoute(id: string, input: any) {
  await getRouteById(id);

  let slug = input.slug ? makeSlug(input.slug) : undefined;
  if (slug) {
    const existingSlug = await prisma.route.findFirst({
      where: { slug, id: { not: id } },
    });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
  }

  const existing = await prisma.route.findUnique({ where: { id } });
  const mergedTitle = input.metaTitle ?? input.title ?? existing?.metaTitle ?? existing?.title ?? "";
  const mergedSlug = slug ?? existing?.slug ?? "";
  const mergedDesc = input.metaDescription ?? input.detailDescription ?? existing?.metaDescription ?? existing?.detailDescription ?? "";
  const mergedKeyword = input.focusKeyword ?? existing?.focusKeyword;

  const seo = analyzeSeo({
    title: mergedTitle,
    slug: mergedSlug,
    content: mergedDesc,
    focusKeyword: mergedKeyword,
    metaTitle: input.metaTitle ?? existing?.metaTitle,
    metaDescription: input.metaDescription ?? existing?.metaDescription,
    canonicalUrl: input.canonicalUrl ?? existing?.canonicalUrl,
    featuredImage: input.image ?? existing?.image,
    featuredImageAlt: input.alt ?? existing?.alt,
  });

  return prisma.route.update({
    where: { id },
    data: {
      ...input,
      ...(slug ? { slug } : {}),
      seoHealth: seo.health,
    },
  });
}

export async function deleteRoute(id: string) {
  await getRouteById(id);
  return prisma.route.delete({ where: { id } });
}
