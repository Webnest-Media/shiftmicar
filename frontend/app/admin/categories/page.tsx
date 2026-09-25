"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  adminBtnDanger,
  adminBtnPrimary,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/admin-ui";
import { api } from "@/lib/api";
import type { BlogCategory } from "@/lib/blog-types";
import { toSlug } from "@/lib/blog-utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setCategories(await api.categories());
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await api.createCategory({
        name,
        slug: slug || toSlug(name),
        description: description || null,
      });
      setName("");
      setSlug("");
      setDescription("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    }
  }

  async function onDelete(id: string, label: string) {
    if (!window.confirm(`Delete category “${label}”?`)) return;
    try {
      await api.deleteCategory(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Group posts into clear topics for browsing and filtering."
      />
      {error ? <p className="cms-error" style={{ marginBottom: "1rem" }}>{error}</p> : null}

      <div className="cms-split">
        <AdminCard>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1rem" }}>New category</h2>
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
            <textarea
              className={adminTextareaClass}
              placeholder="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td><strong>{category.name}</strong></td>
                    <td>{category.slug}</td>
                    <td>{category._count?.blogs ?? 0}</td>
                    <td>
                      <button
                        type="button"
                        className={adminBtnDanger}
                        onClick={() => onDelete(category.id, category.name)}
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
