import { CtaBanner } from "@/app/(pages)/home/components/cta-banner";
import { BlogsHero } from "@/app/(pages)/blogs/components/blogs-hero";
import { BlogsListing } from "@/app/(pages)/blogs/components/blogs-listing";
import type { BlogCategory, PaginatedBlogs } from "@/lib/blog-types";

type BlogsPageProps = {
  blogs: PaginatedBlogs | null;
  categories: BlogCategory[];
  category?: string;
  tag?: string;
  search?: string;
  loadError?: boolean;
};

export function BlogsPage({
  blogs,
  categories,
  category,
  tag,
  search,
  loadError = false,
}: BlogsPageProps) {
  return (
    <>
      <BlogsHero />
      <BlogsListing
        posts={blogs?.data ?? []}
        categories={categories}
        pagination={blogs?.pagination}
        category={category}
        tag={tag}
        search={search}
        loadError={loadError}
      />
      <CtaBanner />
    </>
  );
}
