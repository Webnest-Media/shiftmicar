import Link from "next/link";
import { CtaBanner } from "@/app/(pages)/home/components/cta-banner";
import { BlogArticleFaq } from "@/app/(pages)/blogs/components/blog-article-faq";
import { BlogArticleHero } from "@/app/(pages)/blogs/components/blog-article-hero";
import { BlogRelated } from "@/app/(pages)/blogs/components/blog-related";
import { Container } from "@/components/layout/container";
import { blogsListHref } from "@/lib/blog-utils";
import { asFaqItems } from "@/lib/sanitize-blog-html";
import type { BlogPost } from "@/lib/blog-types";

type BlogArticlePageProps = {
  blog: BlogPost;
  related: BlogPost[];
  safeHtml: string;
};

export function BlogArticlePage({
  blog,
  related,
  safeHtml,
}: BlogArticlePageProps) {
  const faqs = asFaqItems(blog.faqItems).filter(
    (item) => item.question.trim() && item.answer.trim(),
  );
  const tags = Array.isArray(blog.tags) ? blog.tags : [];

  return (
    <>
      <BlogArticleHero blog={blog} />

      <section className="bg-background py-section">
        <Container>
          <div
            className="prose-blog mx-auto max-w-[52.2rem]"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />

          {blog.author.bio ? (
            <div className="mx-auto mt-16 max-w-[52.2rem] border-t border-border-muted pt-10">
              <p className="text-caption uppercase tracking-[0.08em] text-muted">
                Written by
              </p>
              <p className="mt-3 text-h3 tracking-[-0.05rem]">{blog.author.name}</p>
              <p className="mt-4 text-body opacity-82">{blog.author.bio}</p>
            </div>
          ) : null}

          {tags.length > 0 ? (
            <div className="mx-auto mt-12 max-w-[52.2rem] flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-border-muted pt-8">
              <p className="text-caption uppercase tracking-[0.08em] text-muted">
                Tagged
              </p>
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={blogsListHref({ tag: tag.slug })}
                  scroll={false}
                  className="text-body-sm font-medium transition-opacity hover:opacity-70"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          ) : null}
        </Container>
      </section>

      <BlogRelated posts={related} />
      <BlogArticleFaq items={faqs} />
      <CtaBanner />
    </>
  );
}
