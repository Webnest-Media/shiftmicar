import type { Metadata } from "next";
import { BlogsPage } from "@/app/(pages)/blogs/blogs-page";
import { fetchPublicBlogs, fetchPublicCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog | Shift My Car",
  description:
    "Insights on premium car transportation, vehicle logistics, and moving cars across India.",
};

import { Suspense } from "react";

export const dynamic = "force-static";

export default async function BlogsRoute() {
  const query = new URLSearchParams({ page: "1", limit: "10" });

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
    <Suspense fallback={<div className="p-12 text-center text-zinc-400">Loading blogs...</div>}>
      <BlogsPage
        blogs={blogs}
        categories={categories}
        loadError={loadError}
      />
    </Suspense>
  );
}
