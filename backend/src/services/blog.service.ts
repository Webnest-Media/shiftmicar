import { BlogStatus, Prisma, type Prisma as PrismaNS } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { slugify } from "../utils/slug.js";
import { analyzeSeo, type FaqItem } from "../utils/seo-analysis.js";
import { sanitizeHtml } from "../utils/sanitize-html.js";
import {
  serializeBlog,
  serializePublicBlog,
  type BlogWithRelations,
} from "../utils/serializers.js";

const blogInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      avatarUrl: true,
    },
  },
  category: {
    select: { id: true, name: true, slug: true, description: true },
  },
  tags: {
    include: {
      tag: {
        select: { id: true, name: true, slug: true },
      },
    },
  },
  relatedFrom: {
    include: {
      toBlog: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              bio: true,
              avatarUrl: true,
            },
          },
          category: {
            select: { id: true, name: true, slug: true, description: true },
          },
          tags: {
            include: {
              tag: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.BlogPostInclude;

// List cards do not need the post body or nested related posts.
// The full include turns one list into dozens of Tokyo round-trips.
const blogCardInclude = {
  author: blogInclude.author,
  category: blogInclude.category,
  tags: blogInclude.tags,
} satisfies Prisma.BlogPostInclude;

let lastScheduledPublishAt = 0;

async function publishDueScheduledPostsIfStale() {
  const now = Date.now();
  if (now - lastScheduledPublishAt < 60_000) return;
  lastScheduledPublishAt = now;
  await publishDueScheduledPosts();
}

async function uniqueBlogSlug(base: string, excludeId?: string, strict = false) {
  let candidate = slugify(base) || "post";

  if (strict) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (existing && existing.id !== excludeId) {
      throw new AppError("Slug is already in use", 409);
    }
    return candidate;
  }

  let suffix = 0;

  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    suffix += 1;
    candidate = `${slugify(base) || "post"}-${suffix}`;
  }
}

function publicWhere(): Prisma.BlogPostWhereInput {
  return {
    status: BlogStatus.PUBLISHED,
    publishedAt: { lte: new Date() },
  };
}

export type BlogInput = {
  title: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  contentJson?: PrismaNS.InputJsonValue | null;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  status?: BlogStatus;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
  categoryId?: string | null;
  authorId?: string;
  authorName?: string | null;
  authorBio?: string | null;
  tagIds?: string[];
  relatedBlogIds?: string[];
  focusKeyword?: string | null;
  secondaryKeywords?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  faqItems?: FaqItem[] | null;
};

function normalizeStatusFields(input: BlogInput) {
  const status = input.status ?? BlogStatus.DRAFT;
  let publishedAt = input.publishedAt ?? null;
  let scheduledAt = input.scheduledAt ?? null;
  let robotsIndex = input.robotsIndex;
  let robotsFollow = input.robotsFollow;

  if (status === BlogStatus.PUBLISHED) {
    publishedAt = publishedAt ?? new Date();
    scheduledAt = null;
    robotsIndex = robotsIndex ?? true;
    robotsFollow = robotsFollow ?? true;
  }

  if (status === BlogStatus.DRAFT) {
    publishedAt = null;
    scheduledAt = null;
    robotsIndex = false;
    robotsFollow = false;
  }

  if (status === BlogStatus.SCHEDULED) {
    if (!scheduledAt) {
      throw new AppError("scheduledAt is required for SCHEDULED status", 422);
    }
    publishedAt = null;
    robotsIndex = false;
    robotsFollow = false;
  }

  return { status, publishedAt, scheduledAt, robotsIndex, robotsFollow };
}

function computeSeoHealth(input: {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  focusKeyword?: string | null;
  secondaryKeywords?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  faqItems?: FaqItem[] | null;
}) {
  return analyzeSeo(input).health;
}

export async function listPublicBlogs(query: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  tag?: string;
}) {
  const where: Prisma.BlogPostWhereInput = {
    ...publicWhere(),
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { excerpt: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(query.category ? { category: { slug: query.category } } : {}),
    ...(query.tag ? { tags: { some: { tag: { slug: query.tag } } } } : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      include: blogCardInclude,
      orderBy: { publishedAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ]);

  return {
    data: (rows as BlogWithRelations[]).map((blog) =>
      serializePublicBlog(blog, { includeContent: false }),
    ),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 0,
    },
  };
}

export async function getPublicBlogBySlug(slug: string) {
  const blog = await prisma.blogPost.findFirst({
    where: {
      slug,
      ...publicWhere(),
    },
    include: blogInclude,
  });

  if (!blog) {
    throw new AppError("Blog post not found", 404);
  }

  return serializePublicBlog(blog as BlogWithRelations);
}

export async function getRelatedPublicBlogs(blogId: string, categoryId?: string | null) {
  const related = await prisma.blogRelation.findMany({
    where: { fromBlogId: blogId },
    include: {
      toBlog: { include: blogCardInclude },
    },
    take: 6,
  });

  if (related.length > 0) {
    return related
      .filter((rel) => {
        const published =
          rel.toBlog.status === BlogStatus.PUBLISHED &&
          rel.toBlog.publishedAt &&
          rel.toBlog.publishedAt <= new Date();
        return published;
      })
      .map((rel) =>
        serializePublicBlog(rel.toBlog as BlogWithRelations, {
          includeContent: false,
        }),
      );
  }

  const rows = await prisma.blogPost.findMany({
    where: {
      ...publicWhere(),
      id: { not: blogId },
      ...(categoryId ? { categoryId } : {}),
    },
    include: blogCardInclude,
    orderBy: { publishedAt: "desc" },
    take: 6,
  });

  return (rows as BlogWithRelations[]).map((blog) =>
    serializePublicBlog(blog, { includeContent: false }),
  );
}

export async function listAdminBlogs(query: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  tag?: string;
  status?: BlogStatus;
  author?: string;
  sort?: "newest" | "oldest" | "updated";
  from?: string;
  to?: string;
}) {
  await publishDueScheduledPostsIfStale();

  const where: Prisma.BlogPostWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.author ? { authorId: query.author } : {}),
    ...(query.from || query.to
      ? {
          updatedAt: {
            ...(query.from ? { gte: new Date(query.from) } : {}),
            ...(query.to ? { lte: new Date(`${query.to}T23:59:59.999Z`) } : {}),
          },
        }
      : {}),
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { excerpt: { contains: query.search, mode: "insensitive" } },
            { slug: { contains: query.search, mode: "insensitive" } },
            { focusKeyword: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(query.category ? { category: { slug: query.category } } : {}),
    ...(query.tag ? { tags: { some: { tag: { slug: query.tag } } } } : {}),
  };

  const orderBy: Prisma.BlogPostOrderByWithRelationInput =
    query.sort === "oldest"
      ? { createdAt: "asc" }
      : query.sort === "updated"
        ? { updatedAt: "desc" }
        : { createdAt: "desc" };

  const [total, rows] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      include: blogCardInclude,
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ]);

  return {
    data: (rows as BlogWithRelations[]).map((blog) =>
      serializeBlog(blog, { includeContent: false }),
    ),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 0,
    },
  };
}

export async function getAdminBlogById(id: string) {
  await publishDueScheduledPostsIfStale();

  const blog = await prisma.blogPost.findUnique({
    where: { id },
    include: blogInclude,
  });

  if (!blog) {
    throw new AppError("Blog post not found", 404);
  }

  return serializeBlog(blog as BlogWithRelations, { includeChecklist: true });
}

export async function getAdminBlogPreview(id: string) {
  const blog = await prisma.blogPost.findUnique({
    where: { id },
    include: blogInclude,
  });

  if (!blog) {
    throw new AppError("Blog post not found", 404);
  }

  return serializeBlog(blog as BlogWithRelations, { includeChecklist: true });
}

export async function createBlog(authorId: string, input: BlogInput) {
  const resolvedAuthorId = input.authorId || authorId;
  if (input.authorId) {
    const author = await prisma.user.findUnique({ where: { id: input.authorId } });
    if (!author) throw new AppError("Author not found", 404);
  }
  const slug = await uniqueBlogSlug(input.slug || input.title, undefined, Boolean(input.slug));
  const content = sanitizeHtml(input.content ?? "");
  const statusFields = normalizeStatusFields(input);

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) throw new AppError("Category not found", 404);
  }

  const tagIds = input.tagIds ?? [];
  if (tagIds.length > 0) {
    const count = await prisma.tag.count({ where: { id: { in: tagIds } } });
    if (count !== tagIds.length) throw new AppError("One or more tags were not found", 404);
  }

  const seoHealth = computeSeoHealth({
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content,
    featuredImage: input.featuredImage,
    featuredImageAlt: input.featuredImageAlt,
    focusKeyword: input.focusKeyword,
    secondaryKeywords: input.secondaryKeywords,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    canonicalUrl: input.canonicalUrl,
    faqItems: input.faqItems,
  });

  const blog = await prisma.$transaction(async (tx) => {
    const created = await tx.blogPost.create({
      data: {
        title: input.title,
        slug,
        excerpt: input.excerpt ?? null,
        content,
        contentJson: input.contentJson ?? undefined,
        featuredImage: input.featuredImage ?? null,
        featuredImageAlt: input.featuredImageAlt ?? null,
        status: statusFields.status,
        publishedAt: statusFields.publishedAt,
        scheduledAt: statusFields.scheduledAt,
        authorId: resolvedAuthorId,
        authorName: input.authorName?.trim() || null,
        authorBio: input.authorBio?.trim() || null,
        categoryId: input.categoryId ?? null,
        focusKeyword: input.focusKeyword ?? null,
        secondaryKeywords: input.secondaryKeywords ?? [],
        metaTitle: input.metaTitle ?? null,
        metaDescription: input.metaDescription ?? null,
        canonicalUrl: input.canonicalUrl ?? null,
        robotsIndex: statusFields.robotsIndex ?? true,
        robotsFollow: statusFields.robotsFollow ?? true,
        ogTitle: input.ogTitle ?? null,
        ogDescription: input.ogDescription ?? null,
        ogImage: input.ogImage ?? null,
        twitterTitle: input.twitterTitle ?? null,
        twitterDescription: input.twitterDescription ?? null,
        twitterImage: input.twitterImage ?? null,
        faqItems: input.faqItems ?? undefined,
        seoHealth,
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
    });

    const relatedBlogIds = (input.relatedBlogIds ?? []).filter((id) => id !== created.id);
    if (relatedBlogIds.length > 0) {
      await tx.blogRelation.createMany({
        data: relatedBlogIds.map((toBlogId) => ({
          fromBlogId: created.id,
          toBlogId,
        })),
      });
    }

    await tx.blogRevision.create({
      data: {
        blogId: created.id,
        editorId: resolvedAuthorId,
        title: created.title,
        slug: created.slug,
        excerpt: created.excerpt,
        content: created.content,
        contentJson: created.contentJson ?? undefined,
        seoSnapshot: {
          focusKeyword: created.focusKeyword,
          metaTitle: created.metaTitle,
          metaDescription: created.metaDescription,
          canonicalUrl: created.canonicalUrl,
        },
      },
    });

    return tx.blogPost.findUniqueOrThrow({
      where: { id: created.id },
      include: blogInclude,
    });
  });

  return serializeBlog(blog as BlogWithRelations, { includeChecklist: true });
}

export async function updateBlog(id: string, input: BlogInput, editorId?: string) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError("Blog post not found", 404);

  const nextTitle = input.title ?? existing.title;
  const slug =
    input.slug !== undefined
      ? await uniqueBlogSlug(input.slug || nextTitle, id, true)
      : existing.slug;
  const nextContent =
    input.content !== undefined ? sanitizeHtml(input.content) : existing.content;

  const statusFields = normalizeStatusFields({
    title: nextTitle,
    status: input.status ?? existing.status,
    publishedAt:
      input.publishedAt !== undefined ? input.publishedAt : existing.publishedAt,
    scheduledAt:
      input.scheduledAt !== undefined ? input.scheduledAt : existing.scheduledAt,
    robotsIndex:
      input.robotsIndex !== undefined ? input.robotsIndex : existing.robotsIndex,
    robotsFollow:
      input.robotsFollow !== undefined ? input.robotsFollow : existing.robotsFollow,
  });

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) throw new AppError("Category not found", 404);
  }

  if (input.authorId) {
    const author = await prisma.user.findUnique({ where: { id: input.authorId } });
    if (!author) throw new AppError("Author not found", 404);
  }

  const seoHealth = computeSeoHealth({
    title: nextTitle,
    slug,
    excerpt: input.excerpt !== undefined ? input.excerpt : existing.excerpt,
    content: nextContent,
    featuredImage:
      input.featuredImage !== undefined ? input.featuredImage : existing.featuredImage,
    featuredImageAlt:
      input.featuredImageAlt !== undefined
        ? input.featuredImageAlt
        : existing.featuredImageAlt,
    focusKeyword:
      input.focusKeyword !== undefined ? input.focusKeyword : existing.focusKeyword,
    secondaryKeywords:
      input.secondaryKeywords ?? existing.secondaryKeywords,
    metaTitle: input.metaTitle !== undefined ? input.metaTitle : existing.metaTitle,
    metaDescription:
      input.metaDescription !== undefined
        ? input.metaDescription
        : existing.metaDescription,
    canonicalUrl:
      input.canonicalUrl !== undefined ? input.canonicalUrl : existing.canonicalUrl,
    faqItems:
      input.faqItems !== undefined
        ? input.faqItems
        : ((existing.faqItems as FaqItem[] | null) ?? null),
  });

  const blog = await prisma.$transaction(async (tx) => {
    if (existing.slug !== slug && existing.status === BlogStatus.PUBLISHED) {
      await tx.redirect.upsert({
        where: { fromPath: `/blogs/${existing.slug}` },
        update: {
          toPath: `/blogs/${slug}`,
          statusCode: 301,
        },
        create: {
          fromPath: `/blogs/${existing.slug}`,
          toPath: `/blogs/${slug}`,
          statusCode: 301,
        },
      });
    }

    if (input.tagIds) {
      await tx.blogTag.deleteMany({ where: { blogId: id } });
      if (input.tagIds.length > 0) {
        const count = await tx.tag.count({ where: { id: { in: input.tagIds } } });
        if (count !== input.tagIds.length) {
          throw new AppError("One or more tags were not found", 404);
        }
        await tx.blogTag.createMany({
          data: input.tagIds.map((tagId) => ({ blogId: id, tagId })),
        });
      }
    }

    if (input.relatedBlogIds) {
      await tx.blogRelation.deleteMany({ where: { fromBlogId: id } });
      const related = input.relatedBlogIds.filter((relatedId) => relatedId !== id);
      if (related.length > 0) {
        await tx.blogRelation.createMany({
          data: related.map((toBlogId) => ({ fromBlogId: id, toBlogId })),
        });
      }
    }

    const updated = await tx.blogPost.update({
      where: { id },
      data: {
        title: input.title ?? undefined,
        slug,
        excerpt: input.excerpt === undefined ? undefined : input.excerpt,
        content: input.content === undefined ? undefined : nextContent,
        contentJson:
          input.contentJson === undefined
            ? undefined
            : input.contentJson === null
              ? Prisma.JsonNull
              : input.contentJson,
        featuredImage:
          input.featuredImage === undefined ? undefined : input.featuredImage,
        featuredImageAlt:
          input.featuredImageAlt === undefined
            ? undefined
            : input.featuredImageAlt,
        status: statusFields.status,
        publishedAt: statusFields.publishedAt,
        scheduledAt: statusFields.scheduledAt,
        categoryId: input.categoryId === undefined ? undefined : input.categoryId,
        authorId: input.authorId === undefined ? undefined : input.authorId,
        authorName:
          input.authorName === undefined
            ? undefined
            : input.authorName?.trim() || null,
        authorBio:
          input.authorBio === undefined
            ? undefined
            : input.authorBio?.trim() || null,
        focusKeyword:
          input.focusKeyword === undefined ? undefined : input.focusKeyword,
        secondaryKeywords: input.secondaryKeywords ?? undefined,
        metaTitle: input.metaTitle === undefined ? undefined : input.metaTitle,
        metaDescription:
          input.metaDescription === undefined ? undefined : input.metaDescription,
        canonicalUrl:
          input.canonicalUrl === undefined ? undefined : input.canonicalUrl,
        robotsIndex: statusFields.robotsIndex,
        robotsFollow: statusFields.robotsFollow,
        ogTitle: input.ogTitle === undefined ? undefined : input.ogTitle,
        ogDescription:
          input.ogDescription === undefined ? undefined : input.ogDescription,
        ogImage: input.ogImage === undefined ? undefined : input.ogImage,
        twitterTitle:
          input.twitterTitle === undefined ? undefined : input.twitterTitle,
        twitterDescription:
          input.twitterDescription === undefined
            ? undefined
            : input.twitterDescription,
        twitterImage:
          input.twitterImage === undefined ? undefined : input.twitterImage,
        faqItems:
          input.faqItems === undefined
            ? undefined
            : input.faqItems === null
              ? Prisma.JsonNull
              : input.faqItems,
        seoHealth,
      },
    });

    await tx.blogRevision.create({
      data: {
        blogId: id,
        editorId: editorId ?? existing.authorId,
        title: updated.title,
        slug: updated.slug,
        excerpt: updated.excerpt,
        content: updated.content,
        contentJson: updated.contentJson ?? undefined,
        seoSnapshot: {
          focusKeyword: updated.focusKeyword,
          metaTitle: updated.metaTitle,
          metaDescription: updated.metaDescription,
          canonicalUrl: updated.canonicalUrl,
          seoHealth: updated.seoHealth,
        },
      },
    });

    return tx.blogPost.findUniqueOrThrow({
      where: { id },
      include: blogInclude,
    });
  });

  return serializeBlog(blog as BlogWithRelations, { includeChecklist: true });
}

export async function deleteBlog(id: string) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError("Blog post not found", 404);

  await prisma.blogPost.delete({ where: { id } });
  return { id };
}

export async function publishBlog(id: string) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError("Blog post not found", 404);

  const blog = await prisma.blogPost.update({
    where: { id },
    data: {
      status: BlogStatus.PUBLISHED,
      publishedAt: existing.publishedAt ?? new Date(),
      scheduledAt: null,
      robotsIndex: true,
      robotsFollow: true,
    },
    include: blogInclude,
  });

  return serializeBlog(blog as BlogWithRelations, { includeChecklist: true });
}

export async function unpublishBlog(id: string) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError("Blog post not found", 404);

  const blog = await prisma.blogPost.update({
    where: { id },
    data: {
      status: BlogStatus.DRAFT,
      publishedAt: null,
      scheduledAt: null,
      robotsIndex: false,
      robotsFollow: false,
    },
    include: blogInclude,
  });

  return serializeBlog(blog as BlogWithRelations, { includeChecklist: true });
}

export async function scheduleBlog(id: string, scheduledAt: Date) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError("Blog post not found", 404);

  if (scheduledAt.getTime() <= Date.now()) {
    throw new AppError("scheduledAt must be in the future", 422);
  }

  const blog = await prisma.blogPost.update({
    where: { id },
    data: {
      status: BlogStatus.SCHEDULED,
      scheduledAt,
      publishedAt: null,
      robotsIndex: false,
      robotsFollow: false,
    },
    include: blogInclude,
  });

  return serializeBlog(blog as BlogWithRelations, { includeChecklist: true });
}

export async function publishDueScheduledPosts() {
  const now = new Date();
  await prisma.blogPost.updateMany({
    where: {
      status: BlogStatus.SCHEDULED,
      scheduledAt: { lte: now },
    },
    data: {
      status: BlogStatus.PUBLISHED,
      publishedAt: now,
      scheduledAt: null,
      robotsIndex: true,
      robotsFollow: true,
    },
  });
}

export async function getDashboardStats() {
  await publishDueScheduledPostsIfStale();

  const [total, published, drafts, scheduled, recent] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: BlogStatus.PUBLISHED } }),
    prisma.blogPost.count({ where: { status: BlogStatus.DRAFT } }),
    prisma.blogPost.count({ where: { status: BlogStatus.SCHEDULED } }),
    prisma.blogPost.findMany({
      include: blogInclude,
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    totals: { total, published, drafts, scheduled },
    recent: (recent as BlogWithRelations[]).map((blog) =>
      serializeBlog(blog, { includeContent: false }),
    ),
  };
}

export async function listRevisions(blogId: string) {
  const existing = await prisma.blogPost.findUnique({ where: { id: blogId } });
  if (!existing) throw new AppError("Blog post not found", 404);

  return prisma.blogRevision.findMany({
    where: { blogId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      editor: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function suggestRelated(blogId: string) {
  const blog = await prisma.blogPost.findUnique({
    where: { id: blogId },
    include: { tags: true },
  });
  if (!blog) throw new AppError("Blog post not found", 404);

  const rows = await prisma.blogPost.findMany({
    where: {
      id: { not: blogId },
      OR: [
        blog.categoryId ? { categoryId: blog.categoryId } : undefined,
        blog.tags.length
          ? { tags: { some: { tagId: { in: blog.tags.map((t) => t.tagId) } } } }
          : undefined,
        blog.focusKeyword
          ? { focusKeyword: { contains: blog.focusKeyword, mode: "insensitive" } }
          : undefined,
      ].filter(Boolean) as Prisma.BlogPostWhereInput[],
    },
    include: blogInclude,
    take: 8,
    orderBy: { updatedAt: "desc" },
  });

  return (rows as BlogWithRelations[]).map((item) =>
    serializeBlog(item, { includeContent: false }),
  );
}

export async function searchLinkTargets(query: string) {
  const q = query.trim();
  const blogs = await prisma.blogPost.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: { id: true, title: true, slug: true, status: true },
    take: 12,
    orderBy: { updatedAt: "desc" },
  });

  return {
    blogs: blogs.map((blog) => ({
      label: blog.title,
      href: `/blogs/${blog.slug}`,
      status: blog.status,
    })),
    routes: [
      { label: "Delhi to Bangalore", href: "/routes/delhi-to-bangalore" },
      { label: "Delhi to Mumbai / Pune", href: "/routes/delhi-to-mumbai-pune" },
      { label: "Delhi to Kochi / Malappuram", href: "/routes/delhi-to-kochi-malappuram" },
      { label: "Malappuram to Delhi", href: "/routes/malappuram-to-delhi" },
      { label: "Bangalore to Pune / Mumbai", href: "/routes/bangalore-to-pune-mumbai" },
      { label: "Bangalore to Delhi", href: "/routes/bangalore-to-delhi" },
      { label: "Bangalore to Guwahati", href: "/routes/bangalore-to-guwahati" },
      { label: "Delhi to Ahmedabad", href: "/routes/delhi-to-ahmedabad" },
      { label: "Delhi to Surat / Vapi", href: "/routes/delhi-to-surat-vapi" },
      { label: "Gurugram to Guwahati", href: "/routes/gurugram-to-guwahati" },
      { label: "Bangalore to Ahmedabad", href: "/routes/bangalore-to-ahmedabad" },
      { label: "Gurgaon to Kolkata", href: "/routes/gurgaon-to-kolkata" },
      { label: "Bangalore to Kolkata", href: "/routes/bangalore-to-kolkata" },
      { label: "Pan-India Car Transportation", href: "/routes/pan-india-car-transportation" },
    ].filter((item) => !q || item.label.toLowerCase().includes(q.toLowerCase()) || item.href.includes(q.toLowerCase())),
    services: [
      { label: "Dedicated Car Transport", href: "/services/dedicated-car-transport" },
      { label: "Premium Shared Transport", href: "/services/premium-shared-transport" },
      { label: "Door-to-Door Delivery", href: "/services/door-to-door-delivery" },
      { label: "Express Car Delivery", href: "/services/express-car-delivery" },
    ].filter((item) => !q || item.label.toLowerCase().includes(q.toLowerCase())),
    pages: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Services", href: "/services" },
      { label: "Routes", href: "/routes" },
      { label: "Blog", href: "/blogs" },
    ].filter((item) => !q || item.label.toLowerCase().includes(q.toLowerCase())),
  };
}

export async function resolveRedirect(fromPath: string) {
  return prisma.redirect.findUnique({ where: { fromPath } });
}

export async function listAuthors() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      avatarUrl: true,
    },
    orderBy: { name: "asc" },
  });
}
