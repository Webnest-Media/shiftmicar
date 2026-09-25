import type { MetadataRoute } from "next";
import { fetchPublicBlogs } from "@/lib/api";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site}/services`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site}/routes`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site}/blogs`, changeFrequency: "daily", priority: 0.8 },
  ];

  const blogs: MetadataRoute.Sitemap = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const result = await fetchPublicBlogs(
      new URLSearchParams({ page: String(page), limit: "100" }),
    ).catch(() => null);
    if (!result) break;
    totalPages = result.pagination.totalPages || 1;
    for (const blog of result.data) {
      blogs.push({
        url: `${site}/blogs/${blog.slug}`,
        lastModified: blog.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    page += 1;
  }

  return [...staticRoutes, ...blogs];
}
