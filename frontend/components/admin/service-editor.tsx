"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Trash2, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import {
  AdminCard,
  AdminField,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/admin-ui";
import { CmsFilePicker, CmsSelect } from "@/components/admin/cms-controls";
import { SeoComposer, type SeoComposerData } from "@/components/admin/seo-composer";
import { api } from "@/lib/api";
import type { ServiceFeature, ServiceItem } from "@/lib/blog-types";
import { toSlug } from "@/lib/blog-utils";

type ServiceEditorProps = {
  mode: "create" | "edit";
  initialService?: ServiceItem;
};

export function ServiceEditor({ mode, initialService }: ServiceEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  // Core Service fields
  const [title, setTitle] = useState(initialService?.title || "");
  const [slug, setSlug] = useState(initialService?.slug || "");
  const [index, setIndex] = useState(initialService?.index || "01");
  const [shortDescription, setShortDescription] = useState(initialService?.shortDescription || "");
  const [image, setImage] = useState(initialService?.image || "/assets/services-page/dedicated-transport-hd.jpg");
  const [alt, setAlt] = useState(initialService?.alt || "Vehicle transportation service");
  const [order, setOrder] = useState<number>(initialService?.order ?? 0);
  const [isActive, setIsActive] = useState<boolean>(initialService?.isActive ?? true);

  // Overview Paragraphs ("How this service works" section)
  const [overview, setOverview] = useState<string[]>(
    initialService?.overview && initialService.overview.length > 0
      ? initialService.overview
      : [
          "Our dedicated transportation service is designed for customers who want their vehicle transported with dedicated handling and custom scheduling.",
          "Whether it is a luxury car or a high-value model, we prioritize the safety and timely delivery of your vehicle, providing dedicated route coordination and comprehensive insurance coverage for complete peace of mind.",
        ]
  );

  // Key Features / Benefits ("What you can expect" section)
  const [features, setFeatures] = useState<ServiceFeature[]>(
    initialService?.features && initialService.features.length > 0
      ? initialService.features
      : [
          { number: "01.", title: "Dedicated Handling", description: "Your car is assigned to an optimal carrier based on route and custom requirements." },
          { number: "02.", title: "Tailored Scheduling", description: "Custom dispatch and transit timetables arranged around your moving deadlines." },
          { number: "03.", title: "Comprehensive Insurance", description: "Complete transit protection covering your vehicle throughout the transport process." },
          { number: "04.", title: "Live GPS & Updates", description: "Track your vehicle location and receive milestone transit updates at every stage." },
        ]
  );

  // SEO fields
  const [seo, setSeo] = useState<SeoComposerData>({
    focusKeyword: initialService?.focusKeyword || `${title || "car transport"} service`,
    secondaryKeywords: (initialService?.secondaryKeywords || []).join(", "),
    metaTitle: initialService?.metaTitle || (title ? `${title} | Shift My Car` : ""),
    metaDescription: initialService?.metaDescription || shortDescription || "",
    canonicalUrl: initialService?.canonicalUrl || "",
    robotsIndex: initialService?.robotsIndex ?? true,
    robotsFollow: initialService?.robotsFollow ?? true,
    ogTitle: initialService?.ogTitle || "",
    ogDescription: initialService?.ogDescription || "",
    ogImage: initialService?.ogImage || image || "",
    twitterTitle: initialService?.twitterTitle || "",
    twitterDescription: initialService?.twitterDescription || "",
    twitterImage: initialService?.twitterImage || image || "",
    faqItems: initialService?.faqItems || [
      {
        question: `How does ${title || "this service"} work?`,
        answer: "We arrange dedicated vehicle pickup, secure multi-point wheel strapping, live GPS tracking, and doorstep handover.",
      },
      {
        question: "Is vehicle transit insurance included?",
        answer: "Yes, complete comprehensive transit insurance with digital pre-trip inspection is provided.",
      },
    ],
  });

  function handleSeoChange<K extends keyof SeoComposerData>(field: K, value: SeoComposerData[K]) {
    setSeo((prev) => ({ ...prev, [field]: value }));
  }

  // Overview handlers
  function addOverviewParagraph() {
    setOverview([...overview, ""]);
  }

  function updateOverviewParagraph(idx: number, text: string) {
    const next = [...overview];
    next[idx] = text;
    setOverview(next);
  }

  function removeOverviewParagraph(idx: number) {
    setOverview(overview.filter((_, i) => i !== idx));
  }

  function moveOverviewParagraph(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= overview.length) return;
    const next = [...overview];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    setOverview(next);
  }

  // Feature handlers
  function addFeature() {
    const nextNum = `0${features.length + 1}.`;
    setFeatures([...features, { number: nextNum, title: "", description: "" }]);
  }

  function updateFeature(idx: number, patch: Partial<ServiceFeature>) {
    const next = [...features];
    next[idx] = { ...next[idx], ...patch };
    setFeatures(next);
  }

  function removeFeature(idx: number) {
    setFeatures(features.filter((_, i) => i !== idx));
  }

  function moveFeature(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= features.length) return;
    const next = [...features];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    setFeatures(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a service title.");
      return;
    }
    const finalSlug = slug.trim() || toSlug(title);

    setSaving(true);
    setError("");

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      index: index.trim() || "01",
      shortDescription: shortDescription.trim(),
      image: image.trim() || "/assets/services-page/dedicated-transport-hd.jpg",
      alt: alt.trim() || `${title.trim()} illustration`,
      overview: overview.map((p) => p.trim()).filter(Boolean),
      features: features
        .filter((f) => f.title.trim())
        .map((f, i) => ({
          number: f.number?.trim() || `0${i + 1}.`,
          title: f.title.trim(),
          description: f.description.trim(),
        })),
      order: Number(order) || 0,
      isActive,
      focusKeyword: seo.focusKeyword.trim() || null,
      secondaryKeywords: seo.secondaryKeywords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      metaTitle: seo.metaTitle.trim() || null,
      metaDescription: seo.metaDescription.trim() || null,
      canonicalUrl: seo.canonicalUrl.trim() || null,
      robotsIndex: seo.robotsIndex,
      robotsFollow: seo.robotsFollow,
      ogTitle: seo.ogTitle.trim() || null,
      ogDescription: seo.ogDescription.trim() || null,
      ogImage: seo.ogImage.trim() || image.trim() || null,
      twitterTitle: seo.twitterTitle.trim() || null,
      twitterDescription: seo.twitterDescription.trim() || null,
      twitterImage: seo.twitterImage.trim() || image.trim() || null,
      faqItems: seo.faqItems.filter((f) => f.question.trim() && f.answer.trim()),
    };

    try {
      if (mode === "create") {
        await api.createService(payload);
      } else if (initialService?.id) {
        await api.updateService(initialService.id, payload);
      }
      router.push("/admin/services");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto pb-16 text-zinc-900">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 bg-white/95 backdrop-blur-md py-3 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition"
          >
            <ArrowLeft size={16} /> All Services
          </Link>
          <span className="text-zinc-300">/</span>
          <h1 className="text-lg font-bold text-zinc-900">
            {mode === "create" ? "Add New Service" : `Edit Service: ${title || initialService?.title}`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={adminBtnSecondary}
            onClick={() => router.push("/admin/services")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`${adminBtnPrimary} flex items-center gap-2`}
          >
            {saving ? "Saving…" : mode === "create" ? "Create Service" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard>
            <h2 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Service Identity & Hero Header
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <AdminField label="Service Name / Heading" hint="Rendered as main H1 title on the service page">
                    <input
                      required
                      className={adminInputClass}
                      placeholder="e.g. Dedicated Car Transportation"
                      value={title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTitle(val);
                        if (!slugTouched) setSlug(toSlug(val));
                      }}
                    />
                  </AdminField>
                </div>

                <div>
                  <AdminField label="Index Number" hint="e.g. 01, 02, 03">
                    <input
                      required
                      className={adminInputClass}
                      placeholder="01"
                      value={index}
                      onChange={(e) => setIndex(e.target.value)}
                    />
                  </AdminField>
                </div>
              </div>

              <AdminField label="URL Slug" hint="Used in web address: /services/[slug]">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-2 text-xs font-mono text-zinc-500 bg-zinc-100 border border-r-0 border-zinc-200 rounded-l-lg">
                    /services/
                  </span>
                  <input
                    required
                    className={`${adminInputClass} rounded-l-none font-mono text-xs`}
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(toSlug(e.target.value));
                    }}
                  />
                </div>
              </AdminField>

              <AdminField
                label="Hero Short Description"
                hint="Displayed next to the H1 heading in the hero section"
              >
                <textarea
                  rows={3}
                  required
                  className={adminTextareaClass}
                  placeholder="Our Dedicated Car Transportation service is suitable for customers who want their vehicle transported with dedicated handling..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </AdminField>
            </div>
          </AdminCard>

          {/* Overview Paragraphs ("How this service works") */}
          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900">
                  Overview Paragraphs ("How this service works")
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  Add and edit narrative paragraphs explaining this service in detail.
                </p>
              </div>
              <button
                type="button"
                className={adminBtnSecondary}
                onClick={addOverviewParagraph}
              >
                <Plus size={14} className="mr-1 inline" /> Add Paragraph
              </button>
            </div>

            <div className="space-y-3">
              {overview.map((paragraph, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start p-3 rounded-xl border border-zinc-200 bg-zinc-50"
                >
                  <div className="flex flex-col items-center pt-1 gap-1">
                    <span className="text-[11px] font-bold text-zinc-400 font-mono">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveOverviewParagraph(idx, -1)}
                      className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 p-1"
                      title="Move up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === overview.length - 1}
                      onClick={() => moveOverviewParagraph(idx, 1)}
                      className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 p-1"
                      title="Move down"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>

                  <div className="flex-1">
                    <textarea
                      rows={3}
                      className={adminTextareaClass}
                      placeholder={`Paragraph ${idx + 1} content...`}
                      value={paragraph}
                      onChange={(e) => updateOverviewParagraph(idx, e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="text-zinc-400 hover:text-red-600 transition p-2"
                    aria-label="Remove paragraph"
                    onClick={() => removeOverviewParagraph(idx)}
                    title="Delete paragraph"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Key Features / Benefits Builder ("What you can expect") */}
          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900">
                  Key Benefits & Features ("What you can expect")
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  Rendered as modern benefit cards with numbers (e.g. 01., 02., etc.).
                </p>
              </div>
              <button
                type="button"
                className={adminBtnSecondary}
                onClick={addFeature}
              >
                <Plus size={14} className="mr-1 inline" /> Add Benefit Card
              </button>
            </div>

            <div className="space-y-4">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row gap-3 items-start p-4 rounded-xl border border-zinc-200 bg-zinc-50"
                >
                  <div className="flex items-center md:flex-col gap-1 pt-1 shrink-0">
                    <input
                      className={`${adminInputClass} w-16 text-center font-mono font-bold text-xs`}
                      value={feat.number || `0${idx + 1}.`}
                      onChange={(e) => updateFeature(idx, { number: e.target.value })}
                      placeholder="01."
                      title="Feature badge number"
                    />
                    <div className="flex md:flex-col gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveFeature(idx, -1)}
                        className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 p-1"
                        title="Move up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === features.length - 1}
                        onClick={() => moveFeature(idx, 1)}
                        className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 p-1"
                        title="Move down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      className={adminInputClass}
                      placeholder="Benefit Title (e.g. Dedicated Handling)"
                      value={feat.title}
                      onChange={(e) => updateFeature(idx, { title: e.target.value })}
                    />
                    <textarea
                      rows={2}
                      className={adminTextareaClass}
                      placeholder="Detailed benefit description..."
                      value={feat.description}
                      onChange={(e) => updateFeature(idx, { description: e.target.value })}
                    />
                  </div>

                  <button
                    type="button"
                    className="text-zinc-400 hover:text-red-600 transition p-2 self-start"
                    aria-label="Remove benefit"
                    onClick={() => removeFeature(idx)}
                    title="Delete benefit"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Detailed SEO Studio Section */}
          <SeoComposer
            data={seo}
            onChange={handleSeoChange}
            context={{
              title,
              slug,
              urlPath: `/services/${slug || "service-slug"}`,
              content: overview.join("\n\n"),
              excerpt: shortDescription,
              image,
            }}
          />
        </div>

        {/* Right 1 Col: Publishing Settings & Media */}
        <div className="space-y-6">
          <AdminCard>
            <h3 className="text-sm font-bold text-zinc-900 mb-4">
              Status & Display Settings
            </h3>
            <div className="space-y-4">
              <AdminField label="Visibility">
                <CmsSelect
                  value={isActive ? "active" : "inactive"}
                  onChange={(val) => setIsActive(val === "active")}
                  options={[
                    { value: "active", label: "Active & Published" },
                    { value: "inactive", label: "Draft / Hidden" },
                  ]}
                />
              </AdminField>

              <AdminField label="Sort Order" hint="Lower numbers appear first">
                <input
                  type="number"
                  className={adminInputClass}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                />
              </AdminField>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-sm font-bold text-zinc-900 mb-4">
              Service Cover Image & Media
            </h3>
            <div className="space-y-4">
              <AdminField label="Image URL">
                <input
                  className={adminInputClass}
                  placeholder="/assets/services-page/dedicated-transport-hd.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </AdminField>

              <AdminField label="Alt Text" hint="Descriptive text for accessibility & SEO">
                <input
                  className={adminInputClass}
                  placeholder="e.g. Single premium vehicle secured on dedicated carrier"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                />
              </AdminField>

              <AdminField label="Or Upload New Image">
                <CmsFilePicker
                  accept="image/*"
                  label="Upload Service Image"
                  onChange={async (file) => {
                    if (file) {
                      try {
                        const media = await api.uploadMedia(file);
                        setImage(media.url);
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Upload failed");
                      }
                    }
                  }}
                />
              </AdminField>

              {image && (
                <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={alt || "Service preview"} className="w-full h-44 object-cover" />
                </div>
              )}
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-sm font-bold text-zinc-900 mb-2">
              Live Preview Reference
            </h3>
            <p className="text-xs text-zinc-500 mb-3 font-medium">
              This service will be accessible live at:
            </p>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-700 break-all">
              /services/{slug || "slug"}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mt-3">
              <Check size={14} /> Ready for Google SERP & OpenGraph cards
            </div>
          </AdminCard>
        </div>
      </div>
    </form>
  );
}
