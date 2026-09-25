"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AdminCard,
  AdminField,
  AdminPageHeader,
  adminBtnPrimary,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/admin-ui";
import { api } from "@/lib/api";
import type { ApiUser } from "@/lib/blog-types";

export default function AdminSettingsPage() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    api
      .me()
      .then((current) => {
        setUser(current);
        setName(current.name);
        setBio(current.bio || "");
        setAvatarUrl(current.avatarUrl || "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile"));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaved("");
    try {
      const updated = await api.updateMe({
        name,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      });
      setUser(updated);
      setSaved("Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Author profile used on published articles."
      />
      <form onSubmit={onSubmit}>
        <AdminCard>
          <div className="flex flex-col gap-5" style={{ maxWidth: "36rem" }}>
            <AdminField label="Name">
              <input className={adminInputClass} value={name} onChange={(e) => setName(e.target.value)} />
            </AdminField>
            <AdminField label="Email">
              <input className={adminInputClass} value={user?.email || ""} disabled />
            </AdminField>
            <AdminField label="Profile image URL">
              <input className={adminInputClass} value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            </AdminField>
            <AdminField label="Bio">
              <textarea
                rows={4}
                className={adminTextareaClass}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </AdminField>
            {error ? <p className="cms-error">{error}</p> : null}
            {saved ? <p className="cms-hint">{saved}</p> : null}
            <button type="submit" className={adminBtnPrimary}>
              Save profile
            </button>
          </div>
        </AdminCard>
      </form>
      <AdminCard className="mt-4">
        <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "grid", gap: "0.7rem", color: "var(--cms-muted)" }}>
          <li>API URL is configured via `NEXT_PUBLIC_API_URL`.</li>
          <li>Backend secrets live in `backend/.env` and are never exposed to the browser.</li>
          <li>Media uploads currently use local disk storage under `backend/uploads`.</li>
        </ul>
      </AdminCard>
    </div>
  );
}
