"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceEditor } from "@/components/admin/service-editor";
import { api } from "@/lib/api";
import type { ServiceItem } from "@/lib/blog-types";

export function EditServiceClient({ id }: { id: string }) {
  const router = useRouter();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || id === "placeholder") return;
    api
      .service(id)
      .then(setService)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Service not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-sm text-zinc-400">
        Loading service details…
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-6 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/50">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {error || "Service not found"}
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="mt-4 text-xs font-semibold text-zinc-700 dark:text-zinc-300 underline"
        >
          Return to Services
        </button>
      </div>
    );
  }

  return <ServiceEditor mode="edit" initialService={service} />;
}
