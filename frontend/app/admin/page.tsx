"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  FilePlus2,
  FileText,
  FolderPlus,
  ImagePlus,
  NotebookPen,
} from "lucide-react";
import {
  AdminCard,
  AdminPageHeader,
  StatusBadge,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/components/admin/admin-ui";
import { api } from "@/lib/api";
import type { BlogPost } from "@/lib/blog-types";
import { formatDate } from "@/lib/blog-utils";

type Totals = {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
};

const emptyTotals: Totals = {
  total: 0,
  published: 0,
  drafts: 0,
  scheduled: 0,
};

export default function AdminDashboardPage() {
  const [totals, setTotals] = useState<Totals>(emptyTotals);
  const [recent, setRecent] = useState<BlogPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (soft = false) => {
    if (soft) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const data = await api.dashboard();
      setTotals(data.totals);
      setRecent(data.recent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  useEffect(() => {
    function onFocus() {
      void load(true);
    }

    function onVisible() {
      if (document.visibilityState === "visible") void load(true);
    }

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const cards = [
    { label: "Total blogs", value: totals.total, icon: FileText },
    { label: "Published", value: totals.published, icon: NotebookPen },
    { label: "Drafts", value: totals.drafts, icon: FilePlus2 },
    { label: "Scheduled", value: totals.scheduled, icon: CalendarClock },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Content health, recent posts, and shortcuts."
        actions={
          <>
            {refreshing ? <span className="cms-refresh">Updating…</span> : null}
            <Link href="/admin/media" className={adminBtnSecondary}>
              Media
            </Link>
            <Link href="/admin/blogs/new" className={adminBtnPrimary}>
              Add blog
            </Link>
          </>
        }
      />

      {error ? <p className="cms-error" style={{ marginBottom: "1rem" }}>{error}</p> : null}

      <div className="cms-stats">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <AdminCard
              key={card.label}
              className={loading ? "cms-stat is-loading" : "cms-stat"}
              padded={false}
            >
              <div className="cms-stat-label">{card.label}</div>
              <div className="cms-stat-value">{loading ? "00" : card.value}</div>
              <div className="cms-stat-icon">
                <Icon />
              </div>
            </AdminCard>
          );
        })}
      </div>

      <div className="cms-grid-2">
        <AdminCard padded={false}>
          <div className="cms-panel-title">
            <span>Recent blogs</span>
            <Link href="/admin/blogs" className="cms-btn cms-btn-ghost">
              View all
            </Link>
          </div>
          <ul className="cms-list">
            {loading ? (
              <li className="cms-list-item">
                <div>
                  <strong>Loading posts…</strong>
                  <span>Fetching the latest from the API</span>
                </div>
              </li>
            ) : recent.length === 0 ? (
              <li className="cms-list-item">
                <div>
                  <strong>No blogs yet</strong>
                  <span>Create your first post to get started.</span>
                </div>
              </li>
            ) : (
              recent.map((blog) => (
                <li key={blog.id} className="cms-list-item">
                  <div>
                    <Link href={`/admin/blogs/${blog.id}/edit`}>
                      <strong>{blog.title}</strong>
                    </Link>
                    <span>
                      Updated {formatDate(blog.updatedAt)}
                      {blog.category ? ` · ${blog.category.name}` : ""}
                    </span>
                  </div>
                  <StatusBadge status={blog.status} />
                </li>
              ))
            )}
          </ul>
        </AdminCard>

        <AdminCard padded={false}>
          <div className="cms-panel-title">
            <span>Quick actions</span>
          </div>
          <div className="cms-quick">
            <Link href="/admin/blogs/new">
              <span>
                <strong>Write a blog</strong>
                <div className="cms-hint">Open the editor and start drafting</div>
              </span>
              <ArrowUpRight size={16} />
            </Link>
            <Link href="/admin/categories">
              <span>
                <strong>Organize categories</strong>
                <div className="cms-hint">Keep topics structured</div>
              </span>
              <FolderPlus size={16} />
            </Link>
            <Link href="/admin/media">
              <span>
                <strong>Upload media</strong>
                <div className="cms-hint">Featured images and assets</div>
              </span>
              <ImagePlus size={16} />
            </Link>
            <Link href="/blogs" target="_blank">
              <span>
                <strong>Open public blog</strong>
                <div className="cms-hint">Preview the live site</div>
              </span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
