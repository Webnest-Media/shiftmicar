"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit2, ExternalLink, MapPin, Navigation, Plus, Search, Trash2 } from "lucide-react";
import {
  AdminCard,
  adminBtnPrimary,
  adminInputClass,
} from "@/components/admin/admin-ui";
import { api } from "@/lib/api";
import type { RouteItem } from "@/lib/blog-types";
import { seoHealthBadge } from "@/components/admin/seo-composer";

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadRoutes() {
    try {
      setLoading(true);
      const data = await api.routes();
      setRoutes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load routes", err);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoutes();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      setDeletingId(id);
      await api.deleteRoute(id);
      setRoutes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  const query = search.trim().toLowerCase();
  const filtered = (Array.isArray(routes) ? routes : []).filter((r) => {
    if (!r) return false;
    const from = (r.origin || r.fromCity || "").toLowerCase();
    const to = (r.destination || r.toCity || "").toLowerCase();
    const slug = (r.slug || "").toLowerCase();
    const title = (r.title || "").toLowerCase();
    return from.includes(query) || to.includes(query) || slug.includes(query) || title.includes(query);
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Navigation className="h-6 w-6 text-indigo-600" />
            Intercity Relocation Routes
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your intercity shipping corridors, distances, transit times, GPS maps, and route SEO.
          </p>
        </div>

        <Link href="/admin/routes/new" className={`${adminBtnPrimary} flex items-center gap-2`}>
          <Plus size={16} /> Add New Route
        </Link>
      </div>

      {/* Filter / Search card */}
      <AdminCard>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-zinc-400" />
          <input
            className={`${adminInputClass} pl-9`}
            placeholder="Search routes by origin city, destination, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </AdminCard>

      {/* Routes List Table */}
      <AdminCard padded={false}>
        {loading ? (
          <div className="p-12 text-center text-sm text-zinc-400">Loading routes…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-zinc-500">
            {search ? "No routes match your search query." : "No routes found. Click Add New Route to create your first route!"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-700">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th className="px-5 py-3">Route Corridors</th>
                  <th className="px-4 py-3">Distance & Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">SEO Health</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filtered.map((route) => {
                  const badge = seoHealthBadge(route.seoHealth || "NEEDS_ATTENTION");
                  return (
                    <tr key={route.id} className="hover:bg-zinc-50/70 transition">
                      <td className="px-5 py-4">
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                            <span>{route.origin || route.fromCity || "Origin"}</span>
                            <span className="text-zinc-400">→</span>
                            <span className="text-indigo-600 font-bold">{route.destination || route.toCity || "Destination"}</span>
                            {route.isPanIndia && (
                              <span className="ml-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                Pan-India
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-mono text-zinc-500 mt-0.5">
                            <MapPin size={11} /> /routes/{route.slug}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs">
                        <span className="font-semibold text-zinc-900">
                          {(route.distanceKm ?? 0).toLocaleString()} km
                        </span>
                        <span className="text-zinc-500 block mt-0.5 font-medium">{route.transitDays || "3-5 Days"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            route.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                          }`}
                        >
                          {route.isActive ? "Active" : "Draft"}
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
                        #{route.order}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/routes/${route.slug}`}
                            target="_blank"
                            className="p-1.5 text-zinc-500 hover:text-zinc-800 transition"
                            title="Preview Public Route Page"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <Link
                            href={`/admin/routes/${route.id}/edit`}
                            className="p-1.5 text-zinc-500 hover:text-indigo-600 transition"
                            title="Edit Route"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            type="button"
                            disabled={deletingId === route.id}
                            onClick={() => handleDelete(route.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-600 transition"
                            title="Delete Route"
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
