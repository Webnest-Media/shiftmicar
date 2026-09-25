import type { BlogPost, Category, Tag, User } from "@prisma/client";
import { analyzeSeo, type FaqItem } from "./seo-analysis.js";

type AuthorSafe = Pick<User, "id" | "name" | "email" | "role" | "bio" | "avatarUrl">;
type CategorySafe = Pick<Category, "id" | "name" | "slug" | "description">;
type TagSafe = Pick<Tag, "id" | "name" | "slug">;

export type BlogWithRelations = BlogPost & {
  author: AuthorSafe;
  category: CategorySafe | null;
  tags: { tag: TagSafe }[];
  relatedFrom?: { toBlog: BlogWithRelations }[];
};

export function serializeUser(user: AuthorSafe) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio ?? null,
    avatarUrl: user.avatarUrl ?? null,
  };
}

function serializePostAuthor(blog: {
  author: AuthorSafe;
  authorName?: string | null;
  authorBio?: string | null;
}) {
  const customName = blog.authorName?.trim() || "";
  const customBio = blog.authorBio?.trim() || "";
  return {
    ...serializeUser(blog.author),
    name: customName || blog.author.name,
    bio: customBio || (customName ? null : blog.author.bio ?? null),
  };
}

export function serializeBlog(
  blog: BlogWithRelations,
  options?: { includeContent?: boolean; includeChecklist?: boolean },
) {
  const includeContent = options?.includeContent ?? true;
  const faqItems = (blog.faqItems as FaqItem[] | null) ?? null;

  const base = {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    ...(includeContent
      ? { content: blog.content, contentJson: blog.contentJson }
      : {}),
    featuredImage: blog.featuredImage,
    featuredImageAlt: blog.featuredImageAlt,
    status: blog.status,
    publishedAt: blog.publishedAt,
    scheduledAt: blog.scheduledAt,
    categoryId: blog.categoryId,
    authorId: blog.authorId,
    authorName: blog.authorName,
    authorBio: blog.authorBio,
    focusKeyword: blog.focusKeyword,
    secondaryKeywords: blog.secondaryKeywords,
    metaTitle: blog.metaTitle,
    metaDescription: blog.metaDescription,
    canonicalUrl: blog.canonicalUrl,
    robotsIndex: blog.robotsIndex,
    robotsFollow: blog.robotsFollow,
    ogTitle: blog.ogTitle,
    ogDescription: blog.ogDescription,
    ogImage: blog.ogImage,
    twitterTitle: blog.twitterTitle,
    twitterDescription: blog.twitterDescription,
    twitterImage: blog.twitterImage,
    faqItems,
    seoHealth: blog.seoHealth,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    author: serializePostAuthor(blog),
    category: blog.category
      ? {
          id: blog.category.id,
          name: blog.category.name,
          slug: blog.category.slug,
          description: blog.category.description,
        }
      : null,
    tags: blog.tags.map(({ tag }) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
    relatedBlogIds: blog.relatedFrom?.map((rel) => rel.toBlog.id) ?? [],
    relatedBlogs:
      blog.relatedFrom?.map((rel) => ({
        id: rel.toBlog.id,
        title: rel.toBlog.title,
        slug: rel.toBlog.slug,
        excerpt: rel.toBlog.excerpt,
        featuredImage: rel.toBlog.featuredImage,
        featuredImageAlt: rel.toBlog.featuredImageAlt,
        status: rel.toBlog.status,
        publishedAt: rel.toBlog.publishedAt,
        seoHealth: rel.toBlog.seoHealth,
        category: rel.toBlog.category
          ? {
              id: rel.toBlog.category.id,
              name: rel.toBlog.category.name,
              slug: rel.toBlog.category.slug,
            }
          : null,
        author: serializePostAuthor(rel.toBlog),
        tags: rel.toBlog.tags.map(({ tag }) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        })),
      })) ?? [],
  };

  if (options?.includeChecklist) {
    const analysis = analyzeSeo({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: blog.featuredImage,
      featuredImageAlt: blog.featuredImageAlt,
      focusKeyword: blog.focusKeyword,
      secondaryKeywords: blog.secondaryKeywords,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      canonicalUrl: blog.canonicalUrl,
      faqItems,
    });
    return { ...base, seoChecklist: analysis.items };
  }

  return base;
}

export function serializePublicBlog(
  blog: BlogWithRelations,
  options?: { includeContent?: boolean },
) {
  const data = serializeBlog(blog, options);
  const {
    status: _status,
    scheduledAt: _scheduledAt,
    authorId: _authorId,
    relatedBlogIds: _relatedBlogIds,
    ...publicData
  } = data as ReturnType<typeof serializeBlog> & {
    relatedBlogIds?: string[];
  };

  return {
    ...publicData,
    author: serializePostAuthor(blog),
  };
}
