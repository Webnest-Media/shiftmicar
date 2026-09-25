import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { analyzeSeo } from "../utils/seo-analysis.js";
import { slugify } from "../utils/slug.js";

function makeSlug(value: string) {
  return slugify(value);
}

export async function listServicesAdmin() {
  return prisma.service.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function listServicesPublic() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new AppError("Service not found", 404);
  return service;
}

export async function getServiceBySlug(slug: string) {
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) throw new AppError("Service not found", 404);
  return service;
}

export async function createService(input: any) {
  let slug = input.slug ? makeSlug(input.slug) : makeSlug(input.title);

  const existingSlug = await prisma.service.findUnique({ where: { slug } });
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const seo = analyzeSeo({
    title: input.metaTitle || input.title,
    slug,
    content: input.shortDescription,
    focusKeyword: input.focusKeyword,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    canonicalUrl: input.canonicalUrl,
    featuredImage: input.image,
    featuredImageAlt: input.alt,
  });

  return prisma.service.create({
    data: {
      ...input,
      slug,
      seoHealth: seo.health,
    },
  });
}

export async function updateService(id: string, input: any) {
  await getServiceById(id);

  let slug = input.slug ? makeSlug(input.slug) : undefined;
  if (slug) {
    const existingSlug = await prisma.service.findFirst({
      where: { slug, id: { not: id } },
    });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
  }

  const existing = await prisma.service.findUnique({ where: { id } });
  const mergedTitle = input.metaTitle ?? input.title ?? existing?.metaTitle ?? existing?.title ?? "";
  const mergedSlug = slug ?? existing?.slug ?? "";
  const mergedDesc = input.metaDescription ?? input.shortDescription ?? existing?.metaDescription ?? existing?.shortDescription ?? "";
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

  return prisma.service.update({
    where: { id },
    data: {
      ...input,
      ...(slug ? { slug } : {}),
      seoHealth: seo.health,
    },
  });
}

export async function deleteService(id: string) {
  await getServiceById(id);
  return prisma.service.delete({ where: { id } });
}
