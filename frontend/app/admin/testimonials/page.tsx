"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  Edit2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  AdminCard,
  AdminPageHeader,
  adminBtnDanger,
  adminBtnGhost,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/admin-ui";
import { api } from "@/lib/api";
import type { Testimonial } from "@/lib/blog-types";
import { assets } from "@/lib/assets";

const PRESET_LOGOS = [
  { label: "Default Logo 1", url: "/assets/testimonial-logo-1.svg" },
  { label: "Default Logo 2", url: "/assets/testimonial-logo-2.svg" },
  { label: "Default Logo 3", url: "/assets/testimonial-logo-3.svg" },
  { label: "Default Logo 4", url: "/assets/testimonial-logo-4.svg" },
];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [logo, setLogo] = useState("");
  const [rating, setRating] = useState(5);
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await api.testimonials();
      setTestimonials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setRole("");
    setQuote("");
    setLogo("");
    setRating(5);
    setOrder(testimonials.length + 1);
    setIsActive(true);
    setError("");
  }

  function startEdit(item: Testimonial) {
    setEditingId(item.id);
    setName(item.name);
    setRole(item.role);
    setQuote(item.quote);
    setLogo(item.logo || "");
    setRating(item.rating || 5);
    setOrder(item.order || 0);
    setIsActive(item.isActive !== false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleFileUpload(file: File) {
    try {
      setUploading(true);
      setError("");
      const media = await api.uploadMedia(file);
      setLogo(media.url);
      setSuccessMsg("Logo uploaded successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !role.trim() || !quote.trim()) {
      setError("Name, role, and quote are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        name: name.trim(),
        role: role.trim(),
        quote: quote.trim(),
        logo: logo.trim() || null,
        rating: Number(rating) || 5,
        order: Number(order) || 0,
        isActive,
      };

      if (editingId) {
        await api.updateTestimonial(editingId, payload);
        setSuccessMsg("Testimonial updated successfully!");
      } else {
        await api.createTestimonial(payload);
        setSuccessMsg("Testimonial created successfully!");
      }

      resetForm();
      await load();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, authorName: string) {
    if (!window.confirm(`Delete testimonial from “${authorName}”?`)) return;
    try {
      await api.deleteTestimonial(id);
      if (editingId === id) resetForm();
      await load();
      setSuccessMsg("Testimonial deleted");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete testimonial");
    }
  }

  async function toggleStatus(item: Testimonial) {
    try {
      await api.updateTestimonial(item.id, { isActive: !item.isActive });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Add and manage customer testimonials displayed in the home page carousel."
      />

      {error ? (
        <div className="cms-card cms-card-pad cms-error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      ) : null}

      {successMsg ? (
        <div
          className="cms-card cms-card-pad"
          style={{
            marginBottom: "1rem",
            background: "var(--cms-success-soft)",
            color: "var(--cms-success)",
            fontWeight: 500,
          }}
        >
          {successMsg}
        </div>
      ) : null}

      <div className="cms-split" style={{ gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1.8fr)" }}>
        {/* Form Card */}
        <AdminCard>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600 }}>
              {editingId ? "Edit Testimonial" : "Add Testimonial"}
            </h2>
            {editingId ? (
              <button
                type="button"
                className={adminBtnGhost}
                onClick={resetForm}
                style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem" }}
              >
                <X size={14} /> Cancel edit
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="cms-field">
              <span>Customer Name *</span>
              <input
                required
                className={adminInputClass}
                placeholder="e.g. Jan Fierri"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="cms-field">
              <span>Role / Designation / Company *</span>
              <input
                required
                className={adminInputClass}
                placeholder="e.g. Dealership Manager or Car Owner"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div className="cms-field">
              <span>Quote / Testimonial Text *</span>
              <textarea
                required
                className={adminTextareaClass}
                placeholder="Write the customer's quote here..."
                rows={4}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
              />
            </div>

            {/* Logo / Brand Image */}
            <div className="cms-field">
              <span>Logo or Avatar Image</span>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  className={adminInputClass}
                  placeholder="/assets/testimonial-logo-1.svg or image URL"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                />
                <label
                  className={adminBtnSecondary}
                  style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}
                >

                  <Upload size={14} />
                  <span>{uploading ? "Uploading…" : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleFileUpload(file);
                    }}
                  />
                </label>
              </div>

              {/* Presets quick-select */}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
                <span className="cms-hint" style={{ alignSelf: "center", marginRight: "0.2rem" }}>Quick select:</span>
                {PRESET_LOGOS.map((preset, idx) => (
                  <button
                    key={preset.url}
                    type="button"
                    className="cms-btn cms-btn-ghost"
                    style={{
                      padding: "0.15rem 0.5rem",
                      fontSize: "0.72rem",
                      border: logo === preset.url ? "1px solid var(--cms-accent)" : "1px solid var(--cms-border)",
                    }}
                    onClick={() => setLogo(preset.url)}
                  >
                    Logo {idx + 1}
                  </button>
                ))}
              </div>

              {/* Preview */}
              {logo ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.6rem 0.75rem",
                    background: "#fafafa",
                    borderRadius: "8px",
                    border: "1px solid var(--cms-border)",
                    marginTop: "0.4rem",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "6rem",
                      height: "2rem",
                      background: "#fff",
                      borderRadius: "4px",
                      padding: "4px",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo}
                      alt="Logo preview"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <span className="cms-hint" style={{ fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {logo}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLogo("")}
                    className="cms-btn cms-btn-ghost"
                    style={{ marginLeft: "auto", padding: "0.2rem" }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Rating and Order Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <div className="cms-field">
                <span>Rating (1-5 stars)</span>
                <select
                  className={adminInputClass}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {"★".repeat(r)} ({r} Stars)
                    </option>
                  ))}
                </select>
              </div>

              <div className="cms-field">
                <span>Display Order</span>
                <input
                  type="number"
                  className={adminInputClass}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.25rem" }}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isActive}
                className={`cms-check ${isActive ? "is-checked" : ""}`}
                onClick={() => setIsActive(!isActive)}
              >
                <span className="cms-check-box">{isActive ? <Check size={12} /> : null}</span>
                <span style={{ fontWeight: 500 }}>Active (Visible on home page)</span>
              </button>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
              <button type="submit" disabled={saving} className={adminBtnPrimary} style={{ flex: 1 }}>
                {saving ? "Saving…" : editingId ? "Update Testimonial" : "Add Testimonial"}
              </button>
              {editingId ? (
                <button type="button" onClick={resetForm} className={adminBtnSecondary}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </AdminCard>

        {/* Testimonials List */}
        <AdminCard padded={false}>
          <div
            style={{
              padding: "0.95rem 1.25rem",
              borderBottom: "1px solid var(--cms-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <strong style={{ fontSize: "1rem" }}>All Testimonials</strong>
              <span className="cms-hint" style={{ marginLeft: "0.5rem" }}>
                ({testimonials.length} {testimonials.length === 1 ? "item" : "items"})
              </span>
            </div>
            <button
              type="button"
              className={adminBtnGhost}
              onClick={() => void load()}
              style={{ fontSize: "0.8rem" }}
            >
              Refresh
            </button>
          </div>

          {loading && testimonials.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--cms-muted)" }}>
              Loading testimonials…
            </div>
          ) : testimonials.length === 0 ? (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--cms-muted)" }}>
              <p>No testimonials found. Add your first testimonial using the form on the left.</p>
            </div>
          ) : (
            <div className="cms-table-wrap">
              <table className="cms-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Customer</th>
                    <th>Quote</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        background: editingId === item.id ? "var(--cms-accent-soft)" : undefined,
                      }}
                    >
                      <td style={{ width: "85px" }}>
                        {item.logo ? (
                          <div
                            style={{
                              position: "relative",
                              width: "70px",
                              height: "26px",
                              background: "#f7f7f8",
                              borderRadius: "4px",
                              padding: "2px",
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.logo}
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "70px",
                              height: "26px",
                              borderRadius: "4px",
                              background: "var(--cms-fill)",
                              display: "grid",
                              placeItems: "center",
                              color: "var(--cms-muted)",
                              fontSize: "0.7rem",
                            }}
                          >
                            No logo
                          </div>
                        )}
                      </td>
                      <td style={{ minWidth: "140px" }}>
                        <strong style={{ display: "block" }}>{item.name}</strong>
                        <span className="cms-hint">{item.role}</span>
                        <div style={{ color: "#f59e0b", fontSize: "0.75rem", marginTop: "2px" }}>
                          {"★".repeat(item.rating || 5)}
                        </div>
                      </td>
                      <td style={{ maxWidth: "260px" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.82rem",
                            lineHeight: 1.35,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          “{item.quote}”
                        </p>
                      </td>
                      <td>
                        <span className="cms-badge" style={{ background: "var(--cms-fill)", fontWeight: 600 }}>
                          #{item.order ?? 0}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => void toggleStatus(item)}
                          className={`cms-badge ${item.isActive ? "cms-badge-published" : "cms-badge-draft"}`}
                          style={{ cursor: "pointer", border: 0 }}
                          title="Click to toggle status"
                        >
                          {item.isActive ? "Active" : "Hidden"}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.35rem" }}>
                          <button
                            type="button"
                            className={adminBtnGhost}
                            onClick={() => startEdit(item)}
                            title="Edit testimonial"
                            style={{ padding: "0.35rem 0.5rem" }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className={adminBtnDanger}
                            onClick={() => handleDelete(item.id, item.name)}
                            title="Delete testimonial"
                            style={{ padding: "0.35rem 0.5rem" }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
