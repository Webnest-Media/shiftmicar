import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { analyzeSeo } from "../utils/seo-analysis.js";

export const DEFAULT_CORE_PAGES = [
  { pagePath: "/", pageName: "Home Page" },
  { pagePath: "/about", pageName: "About Us" },
  { pagePath: "/services", pageName: "Services Directory" },
  { pagePath: "/routes", pageName: "Routes Directory" },
  { pagePath: "/contact", pageName: "Contact Us" },
  { pagePath: "/privacy-policy", pageName: "Privacy Policy" },
  { pagePath: "/terms-and-conditions", pageName: "Terms & Conditions" },
] as const;

export async function listAllPageSeo() {
  const existing = await prisma.pageSeo.findMany({
    orderBy: { pagePath: "asc" },
  });

  const existingPaths = new Set(existing.map((item) => item.pagePath));
  for (const page of DEFAULT_CORE_PAGES) {
    if (!existingPaths.has(page.pagePath)) {
      const created = await prisma.pageSeo.create({
        data: {
          pagePath: page.pagePath,
          pageName: page.pageName,
          metaTitle: `${page.pageName} | Shift My Car`,
          metaDescription: `Learn more about ${page.pageName.toLowerCase()} with Shift My Car. Professional vehicle shifting and auto logistics across India.`,
        },
      });
      existing.push(created);
    }
  }

  return existing.sort((a, b) => a.pagePath.localeCompare(b.pagePath));
}

export async function getPageSeoByPath(pagePath: string) {
  const normalized = pagePath === "" ? "/" : pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  let item = await prisma.pageSeo.findUnique({ where: { pagePath: normalized } });
  if (!item) {
    const match = DEFAULT_CORE_PAGES.find((p) => p.pagePath === normalized);
    const pageName = match ? match.pageName : normalized;
    item = await prisma.pageSeo.create({
      data: {
        pagePath: normalized,
        pageName,
        metaTitle: `${pageName} | Shift My Car`,
        metaDescription: `Shift My Car vehicle logistics - ${pageName}.`,
      },
    });
  }
  return item;
}

export async function upsertPageSeo(pagePath: string, input: any) {
  const normalized = pagePath === "" ? "/" : pagePath.startsWith("/") ? pagePath : `/${pagePath}`;

  const seo = analyzeSeo({
    title: input.metaTitle || input.pageName || "",
    slug: normalized.replace(/^\//, "") || "home",
    content: input.metaDescription || "",
    focusKeyword: input.focusKeyword,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    canonicalUrl: input.canonicalUrl,
  });

  return prisma.pageSeo.upsert({
    where: { pagePath: normalized },
    update: {
      ...input,
      pagePath: normalized,
      seoHealth: seo.health,
    },
    create: {
      ...input,
      pagePath: normalized,
      seoHealth: seo.health,
    },
  });
}
