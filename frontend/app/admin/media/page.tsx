"use client";

import { useEffect, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  adminBtnDanger,
  adminBtnGhost,
} from "@/components/admin/admin-ui";
import { CmsFilePicker } from "@/components/admin/cms-controls";
import { api } from "@/lib/api";
import type { MediaItem } from "@/lib/blog-types";
import { formatDate } from "@/lib/blog-utils";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function load() {
    setMedia(await api.media());
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function onUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      await api.uploadMedia(file);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this media item?")) return;
    await api.deleteMedia(id);
    await load();
  }

  return (
    <div>
      <AdminPageHeader
        title="Media"
        description="Upload featured images. URLs are stored in the database; files stay on disk for now."
      />
      {error ? <p className="cms-error" style={{ marginBottom: "1rem" }}>{error}</p> : null}

      <AdminCard className="mb-4">
        <CmsFilePicker
          accept="image/*"
          disabled={uploading}
          label={uploading ? "Uploading…" : "Upload image"}
          onChange={(file) => {
            if (file) void onUpload(file);
          }}
        />
      </AdminCard>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {media.map((item) => (
          <AdminCard key={item.id} className="overflow-hidden" padded={false}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt="" style={{ aspectRatio: "16 / 10", width: "100%", objectFit: "cover" }} />
            <div className="cms-card-pad">
              <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.filename}
              </strong>
              <p className="cms-hint" style={{ marginTop: "0.35rem" }}>
                {formatDate(item.createdAt)} · {Math.round(item.size / 1024)} KB
              </p>
              <div className="cms-actions" style={{ marginTop: "0.75rem" }}>
                <button
                  type="button"
                  className={adminBtnGhost}
                  onClick={() => navigator.clipboard.writeText(item.url)}
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  className={adminBtnDanger}
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
