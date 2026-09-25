import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BlogArticlePage } from "@/app/(pages)/blogs/blog-article-page";
import { fetchPublicBlog, fetchRedirect, fetchPublishedBlogUrls } from "@/lib/api";
import { asFaqItems, sanitizeBlogHtml } from "@/lib/sanitize-blog-html";
import { blogCanonicalUrl, getSiteUrl } from "@/lib/site-url";
import { buildBlogJsonLd } from "@/lib/blog-jsonld";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const blogs = await fetchPublishedBlogUrls();
    if (blogs && blogs.length > 0) {
      return blogs.map((b) => ({ slug: b.slug }));
    }
  } catch {
    // offline or static build fallback
  }
  return [{ slug: "welcome" }];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchPublicBlog(slug).catch(() => null);
  if (!data) {
    return {
      title: "Blog | Shift My Car",
      robots: { index: false, follow: false },
    };
  }

  const { blog } = data;
  const title = blog.metaTitle || blog.title;
  const description =
    blog.metaDescription || blog.excerpt || "Premium car transportation insights.";
  const image = blog.ogImage || blog.featuredImage || undefined;
  const twitterImage = blog.twitterImage || image;
  const canonical = blogCanonicalUrl(blog.slug, blog.canonicalUrl);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: { canonical },
    robots: {
      index: blog.robotsIndex !== false,
      follow: blog.robotsFollow !== false,
    },
    openGraph: {
      title: blog.ogTitle || title,
      description: blog.ogDescription || description,
      url: canonical,
      images: image ? [{ url: image }] : undefined,
      type: "article",
      publishedTime: blog.publishedAt || undefined,
      modifiedTime: blog.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.twitterTitle || blog.ogTitle || title,
      description: blog.twitterDescription || blog.ogDescription || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await fetchPublicBlog(slug).catch(() => null);

  if (!data) {
    const redirect = await fetchRedirect(`/blogs/${slug}`);
    if (redirect?.toPath) {
      permanentRedirect(redirect.toPath);
    }
    notFound();
  }

  const { blog, related } = data;
  const safeHtml = sanitizeBlogHtml(blog.content || "");
  const faqItems = asFaqItems(blog.faqItems);
  const jsonLd = buildBlogJsonLd({ ...blog, faqItems });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticlePage
        blog={{ ...blog, faqItems, tags: Array.isArray(blog.tags) ? blog.tags : [] }}
        related={Array.isArray(related) ? related : []}
        safeHtml={safeHtml}
      />
    </>
  );
}
