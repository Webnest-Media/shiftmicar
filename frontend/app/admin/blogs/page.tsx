"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  SeoStatusBadge,
  StatusBadge,
  adminBtnGhost,
  adminBtnPrimary,
  adminInputClass,
} from "@/components/admin/admin-ui";
import { CmsDatePicker, CmsSelect } from "@/components/admin/cms-controls";
import { api } from "@/lib/api";
import type { ApiUser, BlogCategory, BlogPost, BlogTag, Pagination } from "@/lib/blog-types";
import { formatDate } from "@/lib/blog-utils";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [authors, setAuthors] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [author, setAuthor] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const params = useMemo(() => {
    const next = new URLSearchParams();
    next.set("limit", "20");
    next.set("page", String(page));
    next.set("sort", sort);
    if (search) next.set("search", search);
    if (status) next.set("status", status);
    if (category) next.set("category", category);
    if (tag) next.set("tag", tag);
    if (author) next.set("author", author);
    if (from) next.set("from", from);
    if (to) next.set("to", to);
    return next;
  }, [search, status, category, tag, author, from, to, sort, page]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [blogResult, categoryResult, tagResult, authorResult] = await Promise.all([
        api.adminBlogs(params),
        api.categories(),
        api.tags(),
        api.authors(),
      ]);
      setBlogs(blogResult.data);
      setPagination(blogResult.pagination);
      setCategories(categoryResult);
      setTags(tagResult);
      setAuthors(authorResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 180);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") void load();
    }
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  async function onPublish(id: string) {
    await api.publishBlog(id);
    await load();
  }

  async function onUnpublish(id: string) {
    await api.unpublishBlog(id);
    await load();
  }

  async function onDelete(id: string, title: string) {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    await api.deleteBlog(id);
    await load();
  }

  return (
    <div>
      <AdminPageHeader
        title="Blogs"
        description="Open a post to edit it, or add a new one."
        actions={
          <Link href="/admin/blogs/new" className={adminBtnPrimary}>
            Add blog
          </Link>
        }
      />

      <AdminCard className="mb-4" padded={false}>
        <div className="cms-filters cms-filters-wide">
          <input
            className={adminInputClass}
            placeholder="Search blogs…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <CmsSelect
            value={status}
            placeholder="All statuses"
            onChange={(next) => {
              setPage(1);
              setStatus(next);
            }}
            options={[
              { value: "", label: "All statuses" },
              { value: "DRAFT", label: "Draft" },
              { value: "PUBLISHED", label: "Published" },
              { value: "SCHEDULED", label: "Scheduled" },
            ]}
          />
          <CmsSelect
            value={category}
            placeholder="All categories"
            searchable
            onChange={(next) => {
              setPage(1);
              setCategory(next);
            }}
            options={[
              { value: "", label: "All categories" },
              ...categories.map((item) => ({ value: item.slug, label: item.name })),
            ]}
          />
          <CmsSelect
            value={tag}
            placeholder="All tags"
            searchable
            onChange={(next) => {
              setPage(1);
              setTag(next);
            }}
            options={[
              { value: "", label: "All tags" },
              ...tags.map((item) => ({ value: item.slug, label: item.name })),
            ]}
          />
          <CmsSelect
            value={author}
            placeholder="All authors"
            searchable
            onChange={(next) => {
              setPage(1);
              setAuthor(next);
            }}
            options={[
              { value: "", label: "All authors" },
              ...authors.map((item) => ({ value: item.id, label: item.name })),
            ]}
          />
          <CmsDatePicker
            value={from}
            placeholder="From date"
            onChange={(next) => {
              setPage(1);
              setFrom(next);
            }}
          />
          <CmsDatePicker
            value={to}
            placeholder="To date"
            onChange={(next) => {
              setPage(1);
              setTo(next);
            }}
          />
          <CmsSelect
            value={sort}
            onChange={(next) => {
              setPage(1);
              setSort(next);
            }}
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
              { value: "updated", label: "Recently updated" },
            ]}
          />
        </div>
      </AdminCard>

      {error ? <p className="cms-error" style={{ marginBottom: "1rem" }}>{error}</p> : null}

      <AdminCard padded={false}>
        <div className="cms-table-wrap">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Author</th>
                <th>Published</th>
                <th>Updated</th>
                <th>SEO</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ color: "var(--cms-muted)" }}>
                    Loading…
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="cms-empty">
                      <strong>{search || status || category || tag || author || from || to ? "No matching blogs" : "No blogs yet"}</strong>
                      <p className="cms-hint">
                        {search || status || category || tag || author || from || to
                          ? "Try clearing a filter."
                          : "Add a blog to start writing."}
                      </p>
                      {!search && !status && !category && !tag && !author && !from && !to ? (
                        <Link href="/admin/blogs/new" className={adminBtnPrimary}>
                          Add blog
                        </Link>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <strong>{blog.title}</strong>
                      <div className="cms-hint">/{blog.slug}</div>
                    </td>
                    <td>
                      <StatusBadge status={blog.status} />
                    </td>
                    <td>{blog.category?.name || "—"}</td>
                    <td>{blog.author.name}</td>
                    <td>{formatDate(blog.publishedAt)}</td>
                    <td>{formatDate(blog.updatedAt)}</td>
                    <td>
                      <SeoStatusBadge health={blog.seoHealth} />
                    </td>
                    <td>
                      <div className="cms-actions">
                        <Link href={`/admin/blogs/${blog.id}/edit`} className={adminBtnGhost}>
                          Edit
                        </Link>
                        <Link href={`/admin/blogs/${blog.id}/preview`} className={adminBtnGhost}>
                          Preview
                        </Link>
                        {blog.status !== "PUBLISHED" ? (
                          <button type="button" className={adminBtnGhost} onClick={() => onPublish(blog.id)}>
                            Publish
                          </button>
                        ) : (
                          <button type="button" className={adminBtnGhost} onClick={() => onUnpublish(blog.id)}>
                            Unpublish
                          </button>
                        )}
                        <button
                          type="button"
                          className="cms-btn cms-btn-danger"
                          onClick={() => onDelete(blog.id, blog.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination && pagination.totalPages > 1 ? (
          <div className="cms-pagination">
            <button
              type="button"
              className="cms-btn cms-btn-ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="cms-hint">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              className="cms-btn cms-btn-ghost"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        ) : null}
      </AdminCard>
    </div>
  );
}
