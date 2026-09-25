import { BlogStatus, Role } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  status: z.nativeEnum(BlogStatus).optional(),
  author: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.enum(["newest", "oldest", "updated"]).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(160).optional(),
  description: z.string().max(500).optional().nullable(),
});

export const tagSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().min(1).max(120).optional(),
});

const optionalUrl = z
  .union([
    z.string().url(),
    z.string().regex(/^\/[A-Za-z0-9\-/_]*$/),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform((value) => (value === "" || value === undefined ? null : value));

const faqItemSchema = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(2000),
});

export const blogCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(220).optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().optional().default(""),
  contentJson: z.any().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  featuredImageAlt: z.string().max(200).optional().nullable(),
  status: z.nativeEnum(BlogStatus).optional().default(BlogStatus.DRAFT),
  publishedAt: z.coerce.date().optional().nullable(),
  scheduledAt: z.coerce.date().optional().nullable(),
  categoryId: z.string().cuid().optional().nullable(),
  authorId: z.string().cuid().optional(),
  authorName: z.string().max(120).optional().nullable(),
  authorBio: z.string().max(500).optional().nullable(),
  tagIds: z.array(z.string().cuid()).optional().default([]),
  relatedBlogIds: z.array(z.string().cuid()).optional().default([]),
  focusKeyword: z.string().max(120).optional().nullable(),
  secondaryKeywords: z.array(z.string().max(120)).optional().default([]),
  metaTitle: z.string().max(120).optional().nullable(),
  metaDescription: z.string().max(320).optional().nullable(),
  canonicalUrl: optionalUrl,
  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
  ogTitle: z.string().max(120).optional().nullable(),
  ogDescription: z.string().max(320).optional().nullable(),
  ogImage: z.string().optional().nullable(),
  twitterTitle: z.string().max(120).optional().nullable(),
  twitterDescription: z.string().max(320).optional().nullable(),
  twitterImage: z.string().optional().nullable(),
  faqItems: z.array(faqItemSchema).optional().nullable(),
});

export const blogUpdateSchema = blogCreateSchema.partial();

export const scheduleSchema = z.object({
  scheduledAt: z.coerce.date().refine((date) => date.getTime() > Date.now(), {
    message: "scheduledAt must be in the future",
  }),
});

export const profileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  bio: z.string().max(500).optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
});

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role).optional(),
  bio: z.string().max(500).optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
});

export const redirectSchema = z.object({
  fromPath: z.string().min(1),
  toPath: z.string().min(1),
  statusCode: z.number().int().optional().default(301),
});

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  role: z.string().min(1, "Role is required").max(120),
  quote: z.string().min(1, "Quote is required").max(2000),
  logo: z.string().max(500).optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5).optional().default(5),
  order: z.coerce.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const testimonialUpdateSchema = testimonialSchema.partial();

export const partnerSchema = z.object({
  name: z.string().min(1).max(120),
  logo: z.string().min(1),
  alt: z.string().max(250).optional().nullable(),
  order: z.coerce.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
  widthDesktop: z.coerce.number().int().min(20).max(800).optional().nullable(),
  heightDesktop: z.coerce.number().int().min(10).max(300).optional().nullable(),
  widthMobile: z.coerce.number().int().min(15).max(500).optional().nullable(),
  heightMobile: z.coerce.number().int().min(10).max(200).optional().nullable(),
});

export const partnerUpdateSchema = partnerSchema.partial();

const serviceFeatureSchema = z.object({
  number: z.string().default("01."),
  title: z.string().min(1).max(140),
  description: z.string().min(1).max(500),
});

export const serviceSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(220).optional(),
  index: z.string().max(20).optional().default("01"),
  shortDescription: z.string().min(1).max(2500),
  fullDescription: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  image: z.string().min(1).default("/assets/services-page/dedicated-transport-hd.jpg"),
  alt: z.string().max(250).optional().default("Car Transportation Service"),
  overview: z.array(z.string()).optional().default([]),
  features: z.array(serviceFeatureSchema).optional().default([]),
  isActive: z.boolean().optional().default(true),
  order: z.coerce.number().int().optional().default(0),

  focusKeyword: z.string().max(120).optional().nullable(),
  secondaryKeywords: z.array(z.string().max(120)).optional().default([]),
  metaTitle: z.string().max(120).optional().nullable(),
  metaDescription: z.string().max(320).optional().nullable(),
  canonicalUrl: optionalUrl,
  robotsIndex: z.boolean().optional().default(true),
  robotsFollow: z.boolean().optional().default(true),
  ogTitle: z.string().max(120).optional().nullable(),
  ogDescription: z.string().max(320).optional().nullable(),
  ogImage: z.string().optional().nullable(),
  twitterTitle: z.string().max(120).optional().nullable(),
  twitterDescription: z.string().max(320).optional().nullable(),
  twitterImage: z.string().optional().nullable(),
  faqItems: z.array(faqItemSchema).optional().nullable(),
});

export const serviceUpdateSchema = serviceSchema.partial();

function normalizeRouteData<T extends Record<string, any>>(data: T) {
  const origin = data.origin || data.fromCity || "Origin";
  const destination = data.destination || data.toCity || "Destination";
  const title = data.title || `${origin} to ${destination}`;
  const description = data.description || `Car transportation from ${origin} to ${destination}.`;
  const detailDescription = data.detailDescription || data.content || `Move your car safely between ${origin} and ${destination} with professional carriers.`;
  const originLat = data.originLat ?? (data.fromLat != null ? Number(data.fromLat) : undefined) ?? 28.6139;
  const originLng = data.originLng ?? (data.fromLng != null ? Number(data.fromLng) : undefined) ?? 77.2090;
  const destinationLat = data.destinationLat ?? (data.toLat != null ? Number(data.toLat) : null);
  const destinationLng = data.destinationLng ?? (data.toLng != null ? Number(data.toLng) : null);

  const { fromCity, toCity, fromLat, fromLng, toLat, toLng, content, ...rest } = data;

  return {
    ...rest,
    origin,
    destination,
    title,
    description,
    detailDescription,
    originLat,
    originLng,
    destinationLat,
    destinationLng,
  };
}

export const baseRouteSchema = z.object({
  title: z.string().max(200).optional(),
  slug: z.string().min(1).max(220).optional(),
  number: z.string().max(20).optional().default("01"),
  origin: z.string().max(120).optional(),
  destination: z.string().max(120).optional(),
  fromCity: z.string().optional(),
  toCity: z.string().optional(),
  description: z.string().max(500).optional(),
  detailDescription: z.string().max(3000).optional(),
  content: z.string().optional().nullable(),
  image: z.string().optional().default("/assets/routes/route-01.jpg"),
  alt: z.string().max(250).optional().default("Car Transportation Route"),
  originLat: z.coerce.number().optional(),
  originLng: z.coerce.number().optional(),
  destinationLat: z.coerce.number().optional().nullable(),
  destinationLng: z.coerce.number().optional().nullable(),
  fromLat: z.coerce.number().optional().nullable(),
  fromLng: z.coerce.number().optional().nullable(),
  toLat: z.coerce.number().optional().nullable(),
  toLng: z.coerce.number().optional().nullable(),
  distanceKm: z.coerce.number().int().optional().default(0),
  transitDays: z.string().max(60).optional().default("3-5 Days"),
  highlights: z.array(z.string()).optional().default([]),
  isPanIndia: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  order: z.coerce.number().int().optional().default(0),

  focusKeyword: z.string().max(120).optional().nullable(),
  secondaryKeywords: z.array(z.string().max(120)).optional().default([]),
  metaTitle: z.string().max(120).optional().nullable(),
  metaDescription: z.string().max(320).optional().nullable(),
  canonicalUrl: optionalUrl,
  robotsIndex: z.boolean().optional().default(true),
  robotsFollow: z.boolean().optional().default(true),
  ogTitle: z.string().max(120).optional().nullable(),
  ogDescription: z.string().max(320).optional().nullable(),
  ogImage: z.string().optional().nullable(),
  twitterTitle: z.string().max(120).optional().nullable(),
  twitterDescription: z.string().max(320).optional().nullable(),
  twitterImage: z.string().optional().nullable(),
  faqItems: z.array(faqItemSchema).optional().nullable(),
});

export const routeSchema = baseRouteSchema.transform(normalizeRouteData);
export const routeUpdateSchema = baseRouteSchema.partial().transform((data) => {
  const result: any = { ...data };
  if (data.fromCity && !data.origin) result.origin = data.fromCity;
  if (data.toCity && !data.destination) result.destination = data.toCity;
  if (data.fromLat != null && data.originLat == null) result.originLat = Number(data.fromLat);
  if (data.fromLng != null && data.originLng == null) result.originLng = Number(data.fromLng);
  if (data.toLat != null && data.destinationLat == null) result.destinationLat = Number(data.toLat);
  if (data.toLng != null && data.destinationLng == null) result.destinationLng = Number(data.toLng);
  if (data.content && !data.detailDescription) result.detailDescription = data.content;
  delete result.fromCity;
  delete result.toCity;
  delete result.fromLat;
  delete result.fromLng;
  delete result.toLat;
  delete result.toLng;
  delete result.content;
  return result;
});

export const pageSeoSchema = z.object({
  pagePath: z.string().min(1),
  pageName: z.string().min(1).max(120),
  focusKeyword: z.string().max(120).optional().nullable(),
  secondaryKeywords: z.array(z.string().max(120)).optional().default([]),
  metaTitle: z.string().max(120).optional().nullable(),
  metaDescription: z.string().max(320).optional().nullable(),
  canonicalUrl: optionalUrl,
  robotsIndex: z.boolean().optional().default(true),
  robotsFollow: z.boolean().optional().default(true),
  ogTitle: z.string().max(120).optional().nullable(),
  ogDescription: z.string().max(320).optional().nullable(),
  ogImage: z.string().optional().nullable(),
  twitterTitle: z.string().max(120).optional().nullable(),
  twitterDescription: z.string().max(320).optional().nullable(),
  twitterImage: z.string().optional().nullable(),
  faqItems: z.array(faqItemSchema).optional().nullable(),
});

