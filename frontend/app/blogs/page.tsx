import type { Metadata } from "next";
import { BlogsPage } from "@/app/(pages)/blogs/blogs-page";
import { fetchPublicBlogs, fetchPublicCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog | Shift My Car",
  description:
    "Insights on premium car transportation, vehicle logistics, and moving cars across India.",
};

export const revalidate = 60;

type SearchParams = Promise<{
  page?: string;
  category?: string;
  search?: string;
  tag?: string;
}>;

export default async function BlogsRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  query.set("page", params.page || "1");
  query.set("limit", "10");
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.tag) query.set("tag", params.tag);

  let blogs: Awaited<ReturnType<typeof fetchPublicBlogs>> | null = null;
  let categories: Awaited<ReturnType<typeof fetchPublicCategories>> = [];
  let loadError = false;

  try {
    [blogs, categories] = await Promise.all([
      fetchPublicBlogs(query),
      fetchPublicCategories(),
    ]);
  } catch {
    loadError = true;
  }

  return (
    <BlogsPage
      blogs={blogs}
      categories={categories}
      category={params.category}
      tag={params.tag}
      search={params.search}
      loadError={loadError}
    />
  );
}
