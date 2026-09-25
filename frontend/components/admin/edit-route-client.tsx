"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RouteEditor } from "@/components/admin/route-editor";
import { api } from "@/lib/api";
import type { RouteItem } from "@/lib/blog-types";

export function EditRouteClient({ id }: { id: string }) {
  const router = useRouter();
  const [route, setRoute] = useState<RouteItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || id === "placeholder") return;
    api
      .route(id)
      .then(setRoute)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Route not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-sm text-zinc-400">
        Loading route details…
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-6 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/50">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {error || "Route not found"}
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin/routes")}
          className="mt-4 text-xs font-semibold text-zinc-700 dark:text-zinc-300 underline"
        >
          Return to Routes
        </button>
      </div>
    );
  }

  return <RouteEditor mode="edit" initialRoute={route} />;
}
