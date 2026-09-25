import Link from "next/link";
import { BlogCoverCard } from "@/app/(pages)/blogs/components/blog-cover-card";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { blogsListHref } from "@/lib/blog-utils";
import type { BlogCategory, BlogPost, Pagination } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

type BlogsListingProps = {
  posts: BlogPost[];
  categories: BlogCategory[];
  pagination?: Pagination;
  category?: string;
  tag?: string;
  search?: string;
  loadError?: boolean;
};

function CategoryNav({
  categories,
  category,
  tag,
  search,
}: {
  categories: BlogCategory[];
  category?: string;
  tag?: string;
  search?: string;
}) {
  if (categories.length === 0 && !tag && !search) return null;

  return (
    <nav aria-label="Blog topics" className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <Link
        href={blogsListHref({ search })}
        scroll={false}
        className={cn(
          "inline-flex items-center gap-2 text-body-sm font-medium transition-opacity hover:opacity-70",
          !category && !tag ? "text-primary" : "text-foreground",
        )}
        aria-current={!category && !tag ? "page" : undefined}
      >
        <span
          className={cn(
            "size-2 shrink-0 rounded-full",
            !category && !tag ? "bg-primary" : "bg-border-muted",
          )}
          aria-hidden="true"
        />
        All
      </Link>
      {categories.map((item) => {
        const active = category === item.slug;
        return (
          <Link
            key={item.id}
            href={blogsListHref({ category: item.slug, search })}
            scroll={false}
            className={cn(
              "inline-flex items-center gap-2 text-body-sm font-medium transition-opacity hover:opacity-70",
              active ? "text-primary" : "text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                active ? "bg-primary" : "bg-border-muted",
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

function BlogPagination({
  pagination,
  category,
  tag,
  search,
}: {
  pagination: Pagination;
  category?: string;
  tag?: string;
  search?: string;
}) {
  if (pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-muted pt-10">
      <p className="text-caption uppercase tracking-[0.08em] text-muted">
        {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
      </p>
      <div className="flex items-center gap-6">
        {page > 1 ? (
          <Link
            href={blogsListHref({ page: page - 1, category, tag, search })}
            scroll={false}
            className="text-body-sm font-medium transition-opacity hover:opacity-70"
          >
            Previous
          </Link>
        ) : (
          <span className="text-body-sm text-muted">Previous</span>
        )}
        {page < totalPages ? (
          <Link
            href={blogsListHref({ page: page + 1, category, tag, search })}
            scroll={false}
            className="text-body-sm font-medium transition-opacity hover:opacity-70"
          >
            Next
          </Link>
        ) : (
          <span className="text-body-sm text-muted">Next</span>
        )}
      </div>
    </div>
  );
}

export function BlogsListing({
  posts,
  categories,
  pagination,
  category,
  tag,
  search,
  loadError = false,
}: BlogsListingProps) {
  const page = pagination?.page ?? 1;
  const featured = page === 1 ? posts[0] : undefined;
  const latest = featured ? posts.slice(1) : posts;
  const selectedCategory = categories.find((item) => item.slug === category);

  return (
    <>
      <section className="bg-testimonial-section py-section">
        <Container className="flex flex-col gap-12 md:gap-16">
          <div className="flex flex-col items-start gap-5">
            <Badge className="bg-background">Journal</Badge>
            <TextReveal as="h2" className="text-h1">
              {selectedCategory
                ? selectedCategory.name
                : tag
                  ? "Tagged stories"
                  : "From the road"}
            </TextReveal>
            <CategoryNav
              categories={categories}
              category={category}
              tag={tag}
              search={search}
            />
          </div>

          {loadError ? (
            <p className="text-body opacity-82">
              Blog content is temporarily unavailable. Start the API and database
              to load published posts.
            </p>
          ) : null}

          {!loadError && posts.length === 0 ? (
            <p className="text-body opacity-82">
              No published articles yet. Create and publish posts from the CMS.
            </p>
          ) : null}

          {featured ? (
            <BlogCoverCard blog={featured} variant="featured" priority />
          ) : null}
        </Container>
      </section>

      {latest.length > 0 ? (
        <section className="bg-background py-section">
          <Container className="flex flex-col gap-[6.25rem] max-md:gap-12">
            <div className="flex flex-col items-start gap-5">
              <Badge>Latest</Badge>
              <TextReveal as="h2" className="text-h1">
                {featured ? "More stories" : "Stories"}
              </TextReveal>
            </div>

            <Grid columns={12}>
              {latest.map((blog, index) => (
                <GridItem key={blog.id} span={12} spanMd={4}>
                  <BlogCoverCard blog={blog} delay={index * 0.08} />
                </GridItem>
              ))}
            </Grid>

            {pagination ? (
              <BlogPagination
                pagination={pagination}
                category={category}
                tag={tag}
                search={search}
              />
            ) : null}
          </Container>
        </section>
      ) : pagination && pagination.totalPages > 1 ? (
        <section className="bg-background pb-section">
          <Container>
            <BlogPagination
              pagination={pagination}
              category={category}
              tag={tag}
              search={search}
            />
          </Container>
        </section>
      ) : null}
    </>
  );
}
