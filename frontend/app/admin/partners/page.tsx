"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Award,
  Check,
  Edit2,
  Eye,
  EyeOff,
  Maximize2,
  Minus,
  Monitor,
  Plus,
  RotateCcw,
  Search,
  Smartphone,
  Sparkles,
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
} from "@/components/admin/admin-ui";
import { CmsSelect, type CmsOption } from "@/components/admin/cms-controls";
import { BrandLogo } from "@/components/ui/brand-logo";
import { DraggableMarquee } from "@/components/ui/draggable-marquee";
import { api } from "@/lib/api";
import type { PartnerItem } from "@/lib/blog-types";

type BrandPreset = {
  name: string;
  logo: string;
  widthDesktop: number;
  heightDesktop: number;
  widthMobile: number;
  heightMobile: number;
};

const POPULAR_BRAND_PRESETS: BrandPreset[] = [
  { name: "Toyota", logo: "/assets/brands/toyota.svg", widthDesktop: 150, heightDesktop: 40, widthMobile: 105, heightMobile: 28 },
  { name: "Kia", logo: "/assets/brands/kia.svg", widthDesktop: 140, heightDesktop: 38, widthMobile: 98, heightMobile: 26 },
  { name: "Maruti Suzuki", logo: "/assets/brands/maruti.svg", widthDesktop: 160, heightDesktop: 44, widthMobile: 115, heightMobile: 32 },
  { name: "Mahindra", logo: "/assets/brands/mahindra.svg", widthDesktop: 155, heightDesktop: 42, widthMobile: 110, heightMobile: 30 },
  { name: "Tata Motors", logo: "/assets/brands/tata.svg", widthDesktop: 150, heightDesktop: 40, widthMobile: 105, heightMobile: 28 },
  { name: "MIDHANI", logo: "/assets/brands/midhani.svg", widthDesktop: 165, heightDesktop: 44, widthMobile: 120, heightMobile: 32 },
  { name: "Hyundai", logo: "/assets/brands/hyundai.svg", widthDesktop: 155, heightDesktop: 42, widthMobile: 110, heightMobile: 30 },
  { name: "Honda", logo: "/assets/brands/honda.svg", widthDesktop: 145, heightDesktop: 40, widthMobile: 100, heightMobile: 28 },
  { name: "Mercedes-Benz", logo: "/assets/brands/mercedes.svg", widthDesktop: 165, heightDesktop: 44, widthMobile: 120, heightMobile: 32 },
  { name: "BMW", logo: "/assets/brands/bmw.svg", widthDesktop: 135, heightDesktop: 42, widthMobile: 95, heightMobile: 30 },
  { name: "Audi", logo: "/assets/brands/audi.svg", widthDesktop: 145, heightDesktop: 40, widthMobile: 105, heightMobile: 28 },
  { name: "Porsche", logo: "/assets/brands/porsche.svg", widthDesktop: 155, heightDesktop: 42, widthMobile: 110, heightMobile: 30 },
  { name: "Ferrari", logo: "/assets/brands/ferrari.svg", widthDesktop: 150, heightDesktop: 42, widthMobile: 105, heightMobile: 30 },
  { name: "Lamborghini", logo: "/assets/brands/lamborghini.svg", widthDesktop: 170, heightDesktop: 44, widthMobile: 125, heightMobile: 32 },
];

const DESKTOP_SIZE_OPTIONS: CmsOption[] = [
  { value: "150x42", label: "Balanced Standard (150 × 42 px)" },
  { value: "120x34", label: "Compact (120 × 34 px)" },
  { value: "140x38", label: "Medium (140 × 38 px)" },
  { value: "165x46", label: "Large (165 × 46 px)" },
  { value: "190x52", label: "Extra Large / Hero (190 × 52 px)" },
  { value: "220x46", label: "Wide Wordmark (220 × 46 px)" },
  { value: "custom", label: "Custom Desktop Sizing" },
];

const MOBILE_SIZE_OPTIONS: CmsOption[] = [
  { value: "105x30", label: "Balanced Standard (105 × 30 px)" },
  { value: "85x24", label: "Compact (85 × 24 px)" },
  { value: "95x28", label: "Medium (95 × 28 px)" },
  { value: "120x34", label: "Large (120 × 34 px)" },
  { value: "135x38", label: "Extra Large (135 × 38 px)" },
  { value: "custom", label: "Custom Mobile Sizing" },
];

const VISIBILITY_OPTIONS: CmsOption[] = [
  { value: "active", label: "Active (Visible on homepage)" },
  { value: "hidden", label: "Draft (Hidden from public)" },
];

const MARQUEE_VIEW_OPTIONS: CmsOption[] = [
  { value: "desktop", label: "Desktop View (Large Marquee)" },
  { value: "mobile", label: "Mobile View (Phone Width 375px)" },
];

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");

  // Top Marquee preview device mode
  const [marqueeViewMode, setMarqueeViewMode] = useState<"desktop" | "mobile">("desktop");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [alt, setAlt] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Responsive Width & Height controls
  const [widthDesktop, setWidthDesktop] = useState(150);
  const [heightDesktop, setHeightDesktop] = useState(42);
  const [widthMobile, setWidthMobile] = useState(105);
  const [heightMobile, setHeightMobile] = useState(30);

  // Modal Live Preview device toggle
  const [modalPreviewDevice, setModalPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  async function load() {
    try {
      setLoading(true);
      const data = await api.partners();
      setPartners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load brand logos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setName("");
    setLogo("");
    setAlt("");
    setOrder(partners.length + 1);
    setIsActive(true);
    setWidthDesktop(150);
    setHeightDesktop(42);
    setWidthMobile(105);
    setHeightMobile(30);
    setModalPreviewDevice("desktop");
    setError("");
    setSuccessMsg("");
    setIsModalOpen(true);
  }

  function openEdit(item: PartnerItem) {
    setEditingId(item.id);
    setName(item.name);
    setLogo(item.logo);
    setAlt(item.alt || "");
    setOrder(item.order);
    setIsActive(item.isActive);
    setWidthDesktop(item.widthDesktop && item.widthDesktop > 0 ? item.widthDesktop : 150);
    setHeightDesktop(item.heightDesktop && item.heightDesktop > 0 ? item.heightDesktop : 42);
    setWidthMobile(item.widthMobile && item.widthMobile > 0 ? item.widthMobile : 105);
    setHeightMobile(item.heightMobile && item.heightMobile > 0 ? item.heightMobile : 30);
    setModalPreviewDevice("desktop");
    setError("");
    setSuccessMsg("");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
  }

  function applyPreset(preset: BrandPreset) {
    setName(preset.name);
    setLogo(preset.logo);
    setAlt(`${preset.name} brand logo`);
    setWidthDesktop(preset.widthDesktop);
    setHeightDesktop(preset.heightDesktop);
    setWidthMobile(preset.widthMobile);
    setHeightMobile(preset.heightMobile);
  }

  function handleDesktopPresetChange(val: string) {
    if (val === "custom") return;
    const [w, h] = val.split("x").map(Number);
    if (w && h) {
      setWidthDesktop(w);
      setHeightDesktop(h);
    }
  }

  function handleMobilePresetChange(val: string) {
    if (val === "custom") return;
    const [w, h] = val.split("x").map(Number);
    if (w && h) {
      setWidthMobile(w);
      setHeightMobile(h);
    }
  }

  const currentDesktopPresetKey = useMemo(() => {
    const key = `${widthDesktop}x${heightDesktop}`;
    return DESKTOP_SIZE_OPTIONS.some((o) => o.value === key) ? key : "custom";
  }, [widthDesktop, heightDesktop]);

  const currentMobilePresetKey = useMemo(() => {
    const key = `${widthMobile}x${heightMobile}`;
    return MOBILE_SIZE_OPTIONS.some((o) => o.value === key) ? key : "custom";
  }, [widthMobile, heightMobile]);

  // Stepper adjuster
  function adjust(setter: React.Dispatch<React.SetStateAction<number>>, delta: number, min = 10, max = 500) {
    setter((prev) => Math.min(max, Math.max(min, prev + delta)));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      const media = await api.uploadMedia(file);
      setLogo(media.url);
      if (!name) {
        setName(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload logo file");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a brand or partner name.");
      return;
    }
    if (!logo.trim()) {
      setError("Please specify a logo vector or upload an image.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: name.trim(),
        logo: logo.trim(),
        alt: alt.trim() || `${name.trim()} logo`,
        order: Number(order) || 0,
        isActive,
        widthDesktop: Number(widthDesktop) || 150,
        heightDesktop: Number(heightDesktop) || 42,
        widthMobile: Number(widthMobile) || 105,
        heightMobile: Number(heightMobile) || 30,
      };

      if (editingId) {
        const updated = await api.updatePartner(editingId, payload);
        setPartners((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        setSuccessMsg(`Updated "${updated.name}" successfully.`);
      } else {
        const created = await api.createPartner(payload);
        setPartners((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        setSuccessMsg(`Added "${created.name}" successfully.`);
      }

      closeModal();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save brand logo");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: PartnerItem) {
    try {
      const updated = await api.updatePartner(item.id, { isActive: !item.isActive });
      setPartners((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to toggle status");
    }
  }

  async function handleDelete(id: string, brandName: string) {
    if (!confirm(`Are you sure you want to remove "${brandName}" from the logos marquee?`)) {
      return;
    }

    try {
      await api.deletePartner(id);
      setPartners((prev) => prev.filter((p) => p.id !== id));
      setSuccessMsg(`Deleted "${brandName}".`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete brand logo");
    }
  }

  const query = search.trim().toLowerCase();
  const filtered = partners.filter((p) => p.name.toLowerCase().includes(query));
  const activePartners = partners.filter((p) => p.isActive);

  const brandPresetOptions: CmsOption[] = useMemo(() => {
    return [
      { value: "", label: "Select a brand preset to auto-fill..." },
      ...POPULAR_BRAND_PRESETS.map((p) => ({
        value: p.name,
        label: `${p.name} (Balanced: ${p.widthDesktop}×${p.heightDesktop}px)`,
      })),
    ];
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 text-zinc-900">
      <AdminPageHeader
        title="Brand & Partner Logos"
        description="Configure automotive brands and partner logos with responsive desktop and mobile width & height sizing"
        actions={
          <button
            type="button"
            onClick={openCreate}
            className={`${adminBtnPrimary} flex items-center gap-2`}
          >
            <Plus size={16} /> Add Brand Logo
          </button>
        }
      />

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 flex items-center gap-2">
          <Check size={16} className="text-emerald-600" />
          {successMsg}
        </div>
      )}

      {error && !isModalOpen && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Top Live Marquee Preview Card */}
      <AdminCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-200">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" /> Live Marquee Preview
            </h3>
            <p className="text-xs text-zinc-500">
              Check visual harmony and sizing across all active logos on Desktop and Mobile
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 hidden sm:inline">Preview Mode:</span>
            <div className="w-56">
              <CmsSelect
                value={marqueeViewMode}
                onChange={(val) => setMarqueeViewMode(val as "desktop" | "mobile")}
                options={MARQUEE_VIEW_OPTIONS}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-2">
          <div
            className={`w-full transition-all duration-300 rounded-xl border border-zinc-200 bg-white py-4 overflow-hidden shadow-2xs ${
              marqueeViewMode === "mobile" ? "max-w-[390px] border-indigo-300 ring-2 ring-indigo-50" : "max-w-full"
            }`}
          >
            {marqueeViewMode === "mobile" && (
              <div className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase text-center pb-2 border-b border-zinc-100 mb-2 flex items-center justify-center gap-1.5">
                <Smartphone size={12} /> Mobile Viewport (375px - 390px)
              </div>
            )}

            {activePartners.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-400">
                No active brand logos. Add or enable logos below to see the live marquee.
              </div>
            ) : (
              <DraggableMarquee speed={36} pauseOnHover gradient gradientColor="#ffffff" gradientWidth="6rem">
                {activePartners.map((p) => (
                  <div key={p.id} className="mx-6 sm:mx-8 md:mx-10 shrink-0 flex items-center justify-center">
                    <BrandLogo
                      name={p.name}
                      logoUrl={p.logo}
                      widthDesktop={p.widthDesktop}
                      heightDesktop={p.heightDesktop}
                      widthMobile={p.widthMobile}
                      heightMobile={p.heightMobile}
                      previewMode={marqueeViewMode}
                    />
                  </div>
                ))}
              </DraggableMarquee>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Filter / Search Card */}
      <AdminCard>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-zinc-400" />
          <input
            className={`${adminInputClass} pl-9`}
            placeholder="Search brand or partner logos by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </AdminCard>

      {/* Brand Logos Table */}
      <AdminCard padded={false}>
        {loading ? (
          <div className="p-12 text-center text-sm text-zinc-400">Loading brand logos…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-zinc-500">
            {search
              ? "No brand logos match your search."
              : "No logos configured. Click 'Add Brand Logo' to add your first one!"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-700">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th className="px-5 py-3">Brand / Client</th>
                  <th className="px-4 py-3">Live Marquee Preview</th>
                  <th className="px-4 py-3">Desktop Size</th>
                  <th className="px-4 py-3">Mobile Size</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/70 transition">
                    <td className="px-5 py-4 font-bold text-zinc-900">
                      <div>{item.name}</div>
                      <div className="text-[11px] font-mono text-zinc-400 font-normal truncate max-w-[180px]">{item.logo}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="h-12 px-3 py-1 rounded-lg border border-zinc-200 bg-white flex items-center justify-center min-w-[8rem] max-w-[12rem] text-zinc-800 shadow-2xs">
                        <BrandLogo
                          name={item.name}
                          logoUrl={item.logo}
                          widthDesktop={item.widthDesktop}
                          heightDesktop={item.heightDesktop}
                          widthMobile={item.widthMobile}
                          heightMobile={item.heightMobile}
                          previewMode="desktop"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs font-mono text-zinc-600">
                      <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-semibold">
                        {item.widthDesktop || 150} × {item.heightDesktop || 42} px
                      </span>
                    </td>

                    <td className="px-4 py-4 text-xs font-mono text-zinc-600">
                      <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-semibold">
                        {item.widthMobile || 105} × {item.heightMobile || 30} px
                      </span>
                    </td>

                    <td className="px-4 py-4 text-xs font-semibold text-zinc-700">
                      #{item.order}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleActive(item)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border transition ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200"
                        }`}
                        title="Click to toggle display status"
                      >
                        {item.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        {item.isActive ? "Active" : "Hidden"}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className={`${adminBtnGhost} flex items-center gap-1 text-xs`}
                          onClick={() => openEdit(item)}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          className={`${adminBtnDanger} p-1.5`}
                          aria-label="Delete logo"
                          onClick={() => handleDelete(item.id, item.name)}
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

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                {editingId ? `Edit Brand Logo: ${name}` : "Add Brand Logo"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-zinc-400 hover:text-zinc-700 p-1 transition"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick Brand Selector with CmsSelect Custom Dropdown */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-indigo-600" /> Quick Automotive Brand Presets:
                  </span>
                  <span className="text-[11px] text-indigo-600 font-medium">Auto-fills logo & calibrated dimensions</span>
                </div>

                <CmsSelect
                  value={name}
                  onChange={(val) => {
                    const preset = POPULAR_BRAND_PRESETS.find((p) => p.name === val);
                    if (preset) applyPreset(preset);
                  }}
                  options={brandPresetOptions}
                  searchable
                  placeholder="Choose or search brand (Toyota, Kia, Maruti, Mahindra, MIDHANI...)"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {POPULAR_BRAND_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition shadow-2xs ${
                        name === preset.name
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white border-indigo-200 text-zinc-700 hover:bg-indigo-50 hover:border-indigo-300"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Logo Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Brand or Partner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    className={adminInputClass}
                    placeholder="e.g. Toyota, Mahindra, MIDHANI"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    className={adminInputClass}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Logo Asset Path or URL <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    className={`${adminInputClass} font-mono text-xs flex-1`}
                    placeholder="/assets/brands/toyota.svg or https://..."
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                  />
                  <label className={`${adminBtnSecondary} cursor-pointer shrink-0 inline-flex items-center gap-1.5 text-xs`}>
                    <Upload size={13} />
                    {uploading ? "Uploading…" : "Upload"}
                    <input
                      type="file"
                      accept="image/*,.svg"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              {/* Responsive Sizing Section: Desktop & Mobile Controls */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Maximize2 size={13} className="text-indigo-600" /> Logo Dimensions & Scaling
                  </span>
                  <span className="text-[11px] text-zinc-500">Fine-tune to make all logos look balanced & even</span>
                </div>

                {/* Desktop Sizing Controls */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                      <Monitor size={14} className="text-indigo-600" /> Desktop Dimensions
                    </label>
                    <div className="w-56">
                      <CmsSelect
                        value={currentDesktopPresetKey}
                        onChange={handleDesktopPresetChange}
                        options={DESKTOP_SIZE_OPTIONS}
                        placeholder="Desktop Size Presets"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Desktop Width */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-zinc-600">Width (px)</span>
                        <span className="text-[11px] font-mono font-bold text-indigo-600">{widthDesktop}px</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjust(setWidthDesktop, -5, 40, 500)}
                          className="p-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 transition"
                          title="Decrease desktop width by 5px"
                        >
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          className={`${adminInputClass} text-center font-mono`}
                          value={widthDesktop}
                          onChange={(e) => setWidthDesktop(Math.max(20, Number(e.target.value)))}
                          min={20}
                          max={500}
                        />
                        <button
                          type="button"
                          onClick={() => adjust(setWidthDesktop, 5, 40, 500)}
                          className="p-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 transition"
                          title="Increase desktop width by 5px"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Desktop Height */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-zinc-600">Height (px)</span>
                        <span className="text-[11px] font-mono font-bold text-indigo-600">{heightDesktop}px</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjust(setHeightDesktop, -2, 16, 200)}
                          className="p-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 transition"
                          title="Decrease desktop height by 2px"
                        >
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          className={`${adminInputClass} text-center font-mono`}
                          value={heightDesktop}
                          onChange={(e) => setHeightDesktop(Math.max(10, Number(e.target.value)))}
                          min={10}
                          max={200}
                        />
                        <button
                          type="button"
                          onClick={() => adjust(setHeightDesktop, 2, 16, 200)}
                          className="p-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 transition"
                          title="Increase desktop height by 2px"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Sizing Controls */}
                <div className="space-y-2 pt-3 border-t border-zinc-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                      <Smartphone size={14} className="text-indigo-600" /> Mobile Dimensions
                    </label>
                    <div className="w-56">
                      <CmsSelect
                        value={currentMobilePresetKey}
                        onChange={handleMobilePresetChange}
                        options={MOBILE_SIZE_OPTIONS}
                        placeholder="Mobile Size Presets"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Mobile Width */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-zinc-600">Width (px)</span>
                        <span className="text-[11px] font-mono font-bold text-indigo-600">{widthMobile}px</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjust(setWidthMobile, -5, 30, 350)}
                          className="p-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 transition"
                          title="Decrease mobile width by 5px"
                        >
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          className={`${adminInputClass} text-center font-mono`}
                          value={widthMobile}
                          onChange={(e) => setWidthMobile(Math.max(15, Number(e.target.value)))}
                          min={15}
                          max={350}
                        />
                        <button
                          type="button"
                          onClick={() => adjust(setWidthMobile, 5, 30, 350)}
                          className="p-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 transition"
                          title="Increase mobile width by 5px"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Mobile Height */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-zinc-600">Height (px)</span>
                        <span className="text-[11px] font-mono font-bold text-indigo-600">{heightMobile}px</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjust(setHeightMobile, -2, 12, 150)}
                          className="p-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 transition"
                          title="Decrease mobile height by 2px"
                        >
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          className={`${adminInputClass} text-center font-mono`}
                          value={heightMobile}
                          onChange={(e) => setHeightMobile(Math.max(8, Number(e.target.value)))}
                          min={8}
                          max={150}
                        />
                        <button
                          type="button"
                          onClick={() => adjust(setHeightMobile, 2, 12, 150)}
                          className="p-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 transition"
                          title="Increase mobile height by 2px"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visibility with Custom CmsSelect Dropdown */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Homepage Visibility
                </label>
                <CmsSelect
                  value={isActive ? "active" : "hidden"}
                  onChange={(val) => setIsActive(val === "active")}
                  options={VISIBILITY_OPTIONS}
                />
              </div>

              {/* Interactive Live Preview with Desktop / Mobile Switcher */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Eye size={14} className="text-indigo-600" /> Interactive Logo Preview:
                  </label>

                  {/* Device Preview Toggle */}
                  <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-0.5">
                    <button
                      type="button"
                      onClick={() => setModalPreviewDevice("desktop")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                        modalPreviewDevice === "desktop"
                          ? "bg-white text-zinc-900 shadow-2xs"
                          : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      <Monitor size={12} /> Desktop ({widthDesktop}×{heightDesktop}px)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalPreviewDevice("mobile")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                        modalPreviewDevice === "mobile"
                          ? "bg-white text-zinc-900 shadow-2xs"
                          : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      <Smartphone size={12} /> Mobile ({widthMobile}×{heightMobile}px)
                    </button>
                  </div>
                </div>

                <div className="h-24 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center p-3 text-zinc-800 relative">
                  {name ? (
                    <BrandLogo
                      name={name}
                      logoUrl={logo}
                      widthDesktop={widthDesktop}
                      heightDesktop={heightDesktop}
                      widthMobile={widthMobile}
                      heightMobile={heightMobile}
                      previewMode={modalPreviewDevice}
                    />
                  ) : (
                    <span className="text-xs text-zinc-400 italic">Select a brand preset or enter a name to preview</span>
                  )}

                  <div className="absolute bottom-1 right-2 text-[10px] font-mono text-zinc-400">
                    {modalPreviewDevice === "desktop" ? `${widthDesktop} × ${heightDesktop} px` : `${widthMobile} × ${heightMobile} px`}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className={adminBtnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className={adminBtnPrimary}
                >
                  {saving ? "Saving…" : editingId ? "Update Brand Logo" : "Save Brand Logo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

