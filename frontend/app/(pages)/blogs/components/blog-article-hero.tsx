import Image from "next/image";
import Link from "next/link";
import { ButtonReveal } from "@/components/animations/button-reveal";
import { ImageReveal } from "@/components/animations/image-reveal";
import { LinkReveal } from "@/components/animations/link-reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import {
  blogCoverAlt,
  blogCoverSrc,
  formatDate,
  isOptimizableBlogImage,
} from "@/lib/blog-utils";
import type { BlogPost } from "@/lib/blog-types";

type BlogArticleHeroProps = {
  blog: BlogPost;
};

export function BlogArticleHero({ blog }: BlogArticleHeroProps) {
  const src = blogCoverSrc(blog.featuredImage);
  const alt = blogCoverAlt(blog.title, blog.featuredImageAlt, blog.featuredImage);
  const updated =
    blog.updatedAt &&
    blog.publishedAt &&
    blog.publishedAt !== blog.updatedAt
      ? `Updated ${formatDate(blog.updatedAt)}`
      : null;

  return (
    <section className="border-b border-border-muted bg-background">
      <Container className="flex flex-col gap-10 pb-6 pt-[calc(var(--site-header-height)+5.625rem)] max-md:gap-8">
        <nav className="text-caption text-muted">
          <Link href="/" scroll={false} className="transition-opacity hover:opacity-70">
            Home
          </Link>
          <span> / </span>
          <Link href="/blogs" scroll={false} className="transition-opacity hover:opacity-70">
            Blog
          </Link>
        </nav>

        <Grid className="items-end gap-y-10">
          <GridItem span={8} spanMd={5}>
            <div className="flex flex-col items-start gap-5">
              <Badge>{blog.category?.name || "Journal"}</Badge>
              <h1 className="text-h1">
                <TextReveal as="span" immediate>
                  {blog.title}
                </TextReveal>
              </h1>
              {blog.excerpt ? (
                <TextReveal
                  as="p"
                  className="text-body max-w-[32rem] opacity-82"
                  delay={0.1}
                >
                  {blog.excerpt}
                </TextReveal>
              ) : null}

              <div className="flex items-center gap-3 pt-1">
                {blog.author.avatarUrl ? (
                  <Image
                    src={blog.author.avatarUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 rounded-badge object-cover"
                    unoptimized={!isOptimizableBlogImage(blog.author.avatarUrl)}
                  />
                ) : null}
                <div className="text-body-sm">
                  <p className="font-medium">{blog.author.name}</p>
                  <p className="text-muted">
                    {formatDate(blog.publishedAt)}
                    {updated ? ` · ${updated}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <ButtonReveal href="/contact" variant="primary">
                  Get a Quote
                </ButtonReveal>
                <LinkReveal
                  href="/blogs"
                  className="text-body font-medium text-foreground"
                >
                  All articles
                </LinkReveal>
              </div>
            </div>
          </GridItem>

          <GridItem span={8} spanMd={3} startMd={6}>
            <ImageReveal
              src={src}
              alt={alt}
              immediate
              priority
              sizes="(min-width: 64rem) 42rem, 100vw"
              unoptimized={!isOptimizableBlogImage(src)}
              className="h-[18rem] w-full rounded-badge md:h-[28rem]"
            />
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
