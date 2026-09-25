"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  adminBtnDanger,
  adminBtnPrimary,
  adminInputClass,
} from "@/components/admin/admin-ui";
import { api } from "@/lib/api";
import type { BlogTag } from "@/lib/blog-types";
import { toSlug } from "@/lib/blog-utils";

export default function AdminTagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setTags(await api.tags());
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await api.createTag({ name, slug: slug || toSlug(name) });
      setName("");
      setSlug("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    }
  }

  async function onDelete(id: string, label: string) {
    if (!window.confirm(`Delete tag “${label}”?`)) return;
    try {
      await api.deleteTag(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Tags"
        description="Reusable labels for filtering and related content."
      />
      {error ? <p className="cms-error" style={{ marginBottom: "1rem" }}>{error}</p> : null}

      <div className="cms-split">
        <AdminCard>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1rem" }}>New tag</h2>
          <form style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }} onSubmit={onCreate}>
            <input
              required
              className={adminInputClass}
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) setSlug(toSlug(e.target.value));
              }}
            />
            <input
              className={adminInputClass}
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(toSlug(e.target.value))}
            />
            <button type="submit" className={adminBtnPrimary}>
              Create
            </button>
          </form>
        </AdminCard>

        <AdminCard padded={false}>
          <div className="cms-table-wrap">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Posts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => (
                  <tr key={tag.id}>
                    <td><strong>{tag.name}</strong></td>
                    <td>{tag.slug}</td>
                    <td>{tag._count?.blogs ?? 0}</td>
                    <td>
                      <button
                        type="button"
                        className={adminBtnDanger}
                        onClick={() => onDelete(tag.id, tag.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
