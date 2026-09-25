"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit2, ExternalLink, Plus, Search, Trash2, Truck } from "lucide-react";
import {
  AdminCard,
  adminBtnPrimary,
  adminInputClass,
} from "@/components/admin/admin-ui";
import { api } from "@/lib/api";
import type { ServiceItem } from "@/lib/blog-types";
import { seoHealthBadge } from "@/components/admin/seo-composer";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadServices() {
    try {
      setLoading(true);
      const data = await api.services();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load services", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      setDeletingId(id);
      await api.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  const query = search.trim().toLowerCase();
  const filtered = (Array.isArray(services) ? services : []).filter((s) => {
    if (!s) return false;
    const title = (s.title || "").toLowerCase();
    const slug = (s.slug || "").toLowerCase();
    const desc = (s.shortDescription || "").toLowerCase();
    return title.includes(query) || slug.includes(query) || desc.includes(query);
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Truck className="h-6 w-6 text-indigo-600" />
            Services Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your car relocation offerings, feature highlights, and on-page SEO settings.
          </p>
        </div>

        <Link href="/admin/services/new" className={`${adminBtnPrimary} flex items-center gap-2`}>
          <Plus size={16} /> Add New Service
        </Link>
      </div>

      {/* Filter / Search card */}
      <AdminCard>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-zinc-400" />
          <input
            className={`${adminInputClass} pl-9`}
            placeholder="Search services by title, slug, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </AdminCard>

      {/* Services List Table / Grid */}
      <AdminCard padded={false}>
        {loading ? (
          <div className="p-12 text-center text-sm text-zinc-400">Loading services…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-zinc-500">
            {search ? "No services match your search query." : "No services found. Click Add New Service to create your first one!"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-700">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">SEO Health</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filtered.map((service) => {
                  const badge = seoHealthBadge(service.seoHealth || "NEEDS_ATTENTION");
                  return (
                    <tr key={service.id} className="hover:bg-zinc-50/70 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {service.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={service.image}
                              alt=""
                              className="h-10 w-12 rounded-lg object-cover border border-zinc-200"
                            />
                          ) : (
                            <div className="flex h-10 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 text-xs font-bold">
                              {service.icon || "SMC"}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-zinc-900">
                                {service.title}
                              </span>
                              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 font-bold">
                                /{service.index || "01"}
                              </span>
                            </div>
                            <span className="text-xs text-zinc-500 line-clamp-1 font-normal">
                              {service.shortDescription}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-zinc-600">
                        /services/{service.slug}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            service.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                          }`}
                        >
                          {service.isActive ? "Active" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border"
                          style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.bg }}
                        >
                          ● {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-zinc-700">
                        #{service.order}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/services/${service.slug}`}
                            target="_blank"
                            className="p-1.5 text-zinc-500 hover:text-zinc-800 transition"
                            title="Preview Public Page"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <Link
                            href={`/admin/services/${service.id}/edit`}
                            className="p-1.5 text-zinc-500 hover:text-indigo-600 transition"
                            title="Edit Service"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            type="button"
                            disabled={deletingId === service.id}
                            onClick={() => handleDelete(service.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-600 transition"
                            title="Delete Service"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
