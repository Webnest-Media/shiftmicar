import { API_URL } from "@/lib/api";
import { assets } from "@/lib/assets";

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function isOptimizableBlogImage(url: string) {
  return url.startsWith("/") || url.startsWith(`${API_URL}/uploads/`);
}

export function blogCoverSrc(featuredImage?: string | null) {
  return featuredImage?.trim() || assets.processSteps[2];
}

export function blogCoverAlt(
  title: string,
  featuredImageAlt?: string | null,
  featuredImage?: string | null,
) {
  if (featuredImageAlt?.trim()) return featuredImageAlt;
  if (featuredImage?.trim()) return title;
  return "Car being loaded onto a professional vehicle carrier";
}

export function blogsListHref(params: {
  page?: number | string;
  category?: string;
  tag?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.tag) query.set("tag", params.tag);
  if (params.search) query.set("search", params.search);
  if (params.page && String(params.page) !== "1") {
    query.set("page", String(params.page));
  }
  const qs = query.toString();
  return qs ? `/blogs?${qs}` : "/blogs";
}
