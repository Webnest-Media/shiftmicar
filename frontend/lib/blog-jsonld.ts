import type { BlogPost, FaqItem } from "@/lib/blog-types";
import { asFaqItems } from "@/lib/sanitize-blog-html";
import { blogCanonicalUrl, getSiteUrl } from "@/lib/site-url";

export function buildBlogJsonLd(blog: BlogPost) {
  const site = getSiteUrl();
  const url = blogCanonicalUrl(blog.slug, blog.canonicalUrl);
  const description = blog.metaDescription || blog.excerpt || undefined;
  const image = blog.ogImage || blog.featuredImage || undefined;
  const faqs: FaqItem[] = asFaqItems(blog.faqItems).filter(
    (item) => item.question.trim() && item.answer.trim(),
  );

  const blogPosting = {
    "@type": "BlogPosting",
    headline: blog.metaTitle || blog.title,
    description,
    image: image ? [image] : undefined,
    datePublished: blog.publishedAt || undefined,
    dateModified: blog.updatedAt,
    author: blog.author
      ? {
          "@type": "Person",
          name: blog.author.name,
          description: blog.author.bio || undefined,
          image: blog.author.avatarUrl || undefined,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Shift My Car",
      url: site,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site}/blogs` },
      { "@type": "ListItem", position: 3, name: blog.title, item: url },
    ],
  };

  const graph: Record<string, unknown>[] = [blogPosting, breadcrumb];

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
