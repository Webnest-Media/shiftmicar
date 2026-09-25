"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  AdminPageHeader,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/components/admin/admin-ui";
import { api } from "@/lib/api";
import type { BlogPost } from "@/lib/blog-types";
import { formatDate } from "@/lib/blog-utils";
import { sanitizeBlogHtml } from "@/lib/sanitize-blog-html";

export default function PreviewBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .previewBlog(id)
      .then(setBlog)
      .catch((err) => setError(err instanceof Error ? err.message : "Preview failed"));
  }, [id]);

  if (error) {
    return <p className="cms-error">{error}</p>;
  }

  if (!blog) {
    return <p className="cms-hint">Loading preview…</p>;
  }

  const safeHtml = sanitizeBlogHtml(blog.content || "");

  return (
    <div>
      <AdminPageHeader
        title="Preview"
        description="Authenticated preview — drafts stay private and are never publicly indexable."
        actions={
          <>
            <Link href={`/admin/blogs/${blog.id}/edit`} className={adminBtnSecondary}>
              Back to editor
            </Link>
            {blog.status === "PUBLISHED" ? (
              <Link href={`/blogs/${blog.slug}`} className={adminBtnPrimary}>
                Open public page
              </Link>
            ) : null}
          </>
        }
      />

      <article className="cms-card cms-card-pad" style={{ maxWidth: "48rem", marginInline: "auto" }}>
        {blog.category ? (
          <p className="cms-hint" style={{ fontWeight: 700, color: "var(--cms-accent)" }}>
            {blog.category.name}
          </p>
        ) : null}
        <h1 style={{ margin: "0.5rem 0 0", fontSize: "2rem", letterSpacing: "-0.03em" }}>
          {blog.title}
        </h1>
        {blog.excerpt ? (
          <p style={{ marginTop: "1rem", color: "var(--cms-muted)", fontSize: "1.05rem" }}>
            {blog.excerpt}
          </p>
        ) : null}
        <p className="cms-hint" style={{ marginTop: "1rem" }}>
          {blog.author.name} · {formatDate(blog.publishedAt || blog.updatedAt)} · {blog.status}
        </p>
        {blog.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.featuredImage}
            alt={blog.featuredImageAlt || blog.title}
            style={{ marginTop: "1.5rem", aspectRatio: "16 / 9", width: "100%", objectFit: "cover", borderRadius: "12px" }}
          />
        ) : null}
        <div
          className="prose-blog"
          style={{ marginTop: "1.5rem" }}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
        {(blog.faqItems || []).length > 0 ? (
          <section style={{ marginTop: "2rem" }}>
            <h2>FAQ</h2>
            {(blog.faqItems || []).map((item) => (
              <div key={item.question} style={{ marginTop: "1rem" }}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </section>
        ) : null}
      </article>
    </div>
  );
}
