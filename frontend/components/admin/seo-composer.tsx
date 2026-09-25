"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Globe, Plus, Trash2, X } from "lucide-react";
import {
  AdminCard,
  AdminField,
  adminBtnSecondary,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/admin-ui";
import { CmsFilePicker, CmsSelect } from "@/components/admin/cms-controls";
import { api } from "@/lib/api";
import type { FaqItem, SeoChecklistItem, SeoHealth } from "@/lib/blog-types";
import { getSiteUrl } from "@/lib/site-url";

export type SeoComposerData = {
  focusKeyword: string;
  secondaryKeywords: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  faqItems: FaqItem[];
};

export type SeoContextInput = {
  title?: string;
  slug?: string;
  urlPath?: string;
  content?: string;
  excerpt?: string;
  image?: string;
};

type SeoComposerProps = {
  data: SeoComposerData;
  onChange: <K extends keyof SeoComposerData>(field: K, value: SeoComposerData[K]) => void;
  context?: SeoContextInput;
  mode?: "inline" | "drawer" | "modal";
  onClose?: () => void;
};

function includesKeyword(haystack: string | null | undefined, keyword: string | null | undefined) {
  if (!haystack || !keyword) return false;
  return haystack.toLowerCase().includes(keyword.toLowerCase().trim());
}

export function computeSeoAnalysis(data: SeoComposerData, ctx?: SeoContextInput): {
  items: SeoChecklistItem[];
  health: SeoHealth;
} {
  const keyword = data.focusKeyword.trim();
  const text = (ctx?.content || "").replace(/<[^>]+>/g, " ");
  const title = data.metaTitle || ctx?.title || "";
  const desc = data.metaDescription || ctx?.excerpt || "";
  const slugOrPath = ctx?.slug || ctx?.urlPath || "";

  const items: SeoChecklistItem[] = [
    {
      id: "focus-kw-exists",
      label: "Focus keyword defined",
      status: keyword ? "good" : "missing",
    },
    {
      id: "focus-kw-title",
      label: "Focus keyword in Meta Title / Page Title",
      status: !keyword ? "missing" : includesKeyword(title, keyword) ? "good" : "attention",
    },
    {
      id: "focus-kw-slug",
      label: "Focus keyword in URL / Slug",
      status: !keyword
        ? "missing"
        : includesKeyword(slugOrPath.replace(/[-/_]/g, " "), keyword)
          ? "good"
          : "attention",
    },
    {
      id: "focus-kw-desc",
      label: "Focus keyword in Meta Description",
      status: !keyword ? "missing" : includesKeyword(desc, keyword) ? "good" : "attention",
    },
    {
      id: "meta-title-len",
      label: "Meta Title optimal length (40–65 chars)",
      status:
        data.metaTitle.length >= 40 && data.metaTitle.length <= 65
          ? "good"
          : data.metaTitle.length > 0
            ? "attention"
            : "missing",
    },
    {
      id: "meta-desc-len",
      label: "Meta Description optimal length (120–165 chars)",
      status:
        data.metaDescription.length >= 120 && data.metaDescription.length <= 165
          ? "good"
          : data.metaDescription.length > 0
            ? "attention"
            : "missing",
    },
    {
      id: "social-og-image",
      label: "Social Open Graph image configured",
      status: data.ogImage || ctx?.image ? "good" : "attention",
    },
    {
      id: "faq-schema",
      label: "FAQ schema items (helps SERP rich snippet)",
      status: data.faqItems.length >= 2 ? "good" : data.faqItems.length === 1 ? "attention" : "missing",
    },
    {
      id: "canonical",
      label: "Canonical URL configured",
      status: data.canonicalUrl ? "good" : "attention",
    },
  ];

  if (ctx?.content) {
    items.push({
      id: "content-depth",
      label: "Content depth (> 300 words)",
      status: text.trim().length > 1200 ? "good" : text.trim().length > 400 ? "attention" : "missing",
    });
  }

  const missing = items.filter((i) => i.status === "missing").length;
  const attention = items.filter((i) => i.status === "attention").length;

  let health: SeoHealth = "GOOD";
  if (missing >= 3 || (missing >= 1 && attention >= 4)) health = "INCOMPLETE";
  else if (missing > 0 || attention >= 2) health = "NEEDS_ATTENTION";

  return { items, health };
}

export function seoHealthBadge(health: SeoHealth) {
  switch (health) {
    case "GOOD":
      return { label: "Good", color: "cms-health-good", bg: "rgba(34,197,94,0.12)", text: "#15803d" };
    case "NEEDS_ATTENTION":
      return { label: "Needs Attention", color: "cms-health-warn", bg: "rgba(234,179,8,0.18)", text: "#b45309" };
    case "INCOMPLETE":
      return { label: "Incomplete", color: "cms-health-missing", bg: "rgba(239,68,68,0.12)", text: "#b91c1c" };
  }
}

function charTone(length: number, idealMin: number, idealMax: number) {
  if (length === 0) return "text-zinc-400 text-xs";
  if (length >= idealMin && length <= idealMax) return "text-emerald-700 font-bold text-xs";
  return "text-amber-700 font-semibold text-xs";
}

export function SeoComposer({ data, onChange, context, mode = "inline", onClose }: SeoComposerProps) {
  const [activeTab, setActiveTab] = useState<"search" | "social" | "faq" | "audit">("search");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const siteUrl = getSiteUrl();
  const path = context?.urlPath || (context?.slug ? `/${context.slug}` : "/");
  const previewUrl = `${siteUrl.replace(/^https?:\/\//, "")}${path}`;

  const previewTitle = data.metaTitle || context?.title || "Page Title · Shift My Car";
  const previewDesc =
    data.metaDescription ||
    context?.excerpt ||
    "Professional car transportation services across India. Safe container carriers, instant online quote, and live GPS tracking.";

  const ogTitle = data.ogTitle || previewTitle;
  const ogDesc = data.ogDescription || previewDesc;
  const ogImg = data.ogImage || context?.image || "";

  const twTitle = data.twitterTitle || ogTitle;
  const twDesc = data.twitterDescription || ogDesc;
  const twImg = data.twitterImage || ogImg;

  const analysis = useMemo(() => computeSeoAnalysis(data, context), [data, context]);
  const badge = seoHealthBadge(analysis.health);

  const content = (
    <div className="space-y-6 text-zinc-900">
      {/* Header bar with tabs and SEO health score */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-bold text-zinc-900">SEO & Social Meta Studio</h3>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border"
            style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.bg }}
          >
            ● {badge.label}
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 text-xs border border-zinc-200">
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`rounded px-3 py-1 font-semibold transition ${
              activeTab === "search"
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Search (SERP)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`rounded px-3 py-1 font-semibold transition ${
              activeTab === "social"
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Social Cards
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("faq")}
            className={`rounded px-3 py-1 font-semibold transition ${
              activeTab === "faq"
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            FAQ Schema ({data.faqItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`rounded px-3 py-1 font-semibold transition ${
              activeTab === "audit"
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            SEO Health Checklist
          </button>
        </div>
      </div>

      {/* TAB 1: Search / SERP */}
      {activeTab === "search" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminField label="Focus Keyword" hint="Primary search query target (e.g. car transport delhi to mumbai)">
              <input
                className={adminInputClass}
                placeholder="e.g. car transportation service"
                value={data.focusKeyword}
                onChange={(e) => onChange("focusKeyword", e.target.value)}
              />
            </AdminField>

            <AdminField label="Secondary Keywords" hint="Comma-separated secondary search terms">
              <input
                className={adminInputClass}
                placeholder="e.g. car carrier, auto relocation, safe vehicle transit"
                value={data.secondaryKeywords}
                onChange={(e) => onChange("secondaryKeywords", e.target.value)}
              />
            </AdminField>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Meta Title
              </label>
              <span className={charTone(data.metaTitle.length, 50, 60)}>
                {data.metaTitle.length}/60 chars (ideal: 50–60)
              </span>
            </div>
            <input
              className={adminInputClass}
              placeholder="e.g. Best Car Transport Service in India | Shift My Car"
              value={data.metaTitle}
              onChange={(e) => onChange("metaTitle", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Meta Description
              </label>
              <span className={charTone(data.metaDescription.length, 140, 160)}>
                {data.metaDescription.length}/160 chars (ideal: 140–160)
              </span>
            </div>
            <textarea
              rows={3}
              className={adminTextareaClass}
              placeholder="Provide an enticing summary for Google searchers with benefits and CTA..."
              value={data.metaDescription}
              onChange={(e) => onChange("metaDescription", e.target.value)}
            />
          </div>

          {/* Live Google SERP Snippet Preview */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-600">
              Live Google Search Preview
            </p>
            <div className="rounded-lg bg-white p-4 shadow-sm border border-zinc-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-4 w-4 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] text-white font-bold">
                  S
                </div>
                <div className="text-xs text-zinc-600 truncate font-mono">
                  {previewUrl}
                </div>
              </div>
              <h4 className="text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer truncate">
                {previewTitle}
              </h4>
              <p className="text-sm text-[#4d5156] mt-1 line-clamp-2 leading-relaxed">
                {previewDesc}
              </p>
            </div>
          </div>

          {/* Advanced robots & Canonical */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-zinc-200">
            <AdminField label="Canonical URL" hint="Leave empty to default to current page path">
              <input
                className={adminInputClass}
                placeholder="https://shiftmycar.com/..."
                value={data.canonicalUrl}
                onChange={(e) => onChange("canonicalUrl", e.target.value)}
              />
            </AdminField>

            <AdminField label="Robots Index" hint="Allow search engines to index this page">
              <CmsSelect
                value={data.robotsIndex ? "index" : "noindex"}
                onChange={(val) => onChange("robotsIndex", val === "index")}
                options={[
                  { value: "index", label: "Index (Allowed in Search)" },
                  { value: "noindex", label: "NoIndex (Hide from Search)" },
                ]}
              />
            </AdminField>

            <AdminField label="Robots Follow" hint="Follow links on this page">
              <CmsSelect
                value={data.robotsFollow ? "follow" : "nofollow"}
                onChange={(val) => onChange("robotsFollow", val === "follow")}
                options={[
                  { value: "follow", label: "Follow Links" },
                  { value: "nofollow", label: "NoFollow Links" },
                ]}
              />
            </AdminField>
          </div>
        </div>
      )}

      {/* TAB 2: Social Cards (Open Graph / Twitter) */}
      {activeTab === "social" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OpenGraph Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2">
                OpenGraph (Facebook, LinkedIn, WhatsApp)
              </h4>
              <AdminField label="OG Title" hint="Defaults to Meta Title if blank">
                <input
                  className={adminInputClass}
                  placeholder={previewTitle}
                  value={data.ogTitle}
                  onChange={(e) => onChange("ogTitle", e.target.value)}
                />
              </AdminField>

              <AdminField label="OG Description" hint="Defaults to Meta Description if blank">
                <textarea
                  rows={2}
                  className={adminTextareaClass}
                  placeholder={previewDesc}
                  value={data.ogDescription}
                  onChange={(e) => onChange("ogDescription", e.target.value)}
                />
              </AdminField>

              <AdminField label="OG Image" hint="Image URL or upload (1200x630px recommended)">
                <div className="space-y-2">
                  <input
                    className={adminInputClass}
                    placeholder="https://.../og-image.jpg"
                    value={data.ogImage}
                    onChange={(e) => onChange("ogImage", e.target.value)}
                  />
                  <CmsFilePicker
                    accept="image/*"
                    label="Upload OG image"
                    onChange={async (file) => {
                      if (file) {
                        try {
                          const media = await api.uploadMedia(file);
                          onChange("ogImage", media.url);
                        } catch (err) {
                          console.error("Failed to upload OG image", err);
                        }
                      }
                    }}
                  />
                </div>
              </AdminField>
            </div>

            {/* Twitter Card Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2">
                Twitter / X Card
              </h4>
              <AdminField label="Twitter Title" hint="Defaults to OG Title">
                <input
                  className={adminInputClass}
                  placeholder={ogTitle}
                  value={data.twitterTitle}
                  onChange={(e) => onChange("twitterTitle", e.target.value)}
                />
              </AdminField>

              <AdminField label="Twitter Description" hint="Defaults to OG Description">
                <textarea
                  rows={2}
                  className={adminTextareaClass}
                  placeholder={ogDesc}
                  value={data.twitterDescription}
                  onChange={(e) => onChange("twitterDescription", e.target.value)}
                />
              </AdminField>

              <AdminField label="Twitter Image" hint="Image URL or upload">
                <div className="space-y-2">
                  <input
                    className={adminInputClass}
                    placeholder="https://.../twitter-image.jpg"
                    value={data.twitterImage}
                    onChange={(e) => onChange("twitterImage", e.target.value)}
                  />
                  <CmsFilePicker
                    accept="image/*"
                    label="Upload Twitter image"
                    onChange={async (file) => {
                      if (file) {
                        try {
                          const media = await api.uploadMedia(file);
                          onChange("twitterImage", media.url);
                        } catch (err) {
                          console.error("Failed to upload Twitter image", err);
                        }
                      }
                    }}
                  />
                </div>
              </AdminField>
            </div>
          </div>

          {/* Social Live Previews */}
          <div className="pt-4 border-t border-zinc-200">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-600">
              Live Social Share Previews
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Facebook / OpenGraph Preview */}
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="bg-zinc-100 p-2 text-xs font-bold text-zinc-700 border-b border-zinc-200">
                  OpenGraph Share Card
                </div>
                {ogImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ogImg} alt="OpenGraph preview" className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-zinc-100 text-xs font-medium text-zinc-500">
                    No OpenGraph Image Selected
                  </div>
                )}
                <div className="p-3">
                  <div className="text-[11px] uppercase tracking-wide text-zinc-400 font-semibold">shiftmycar.com</div>
                  <h5 className="font-bold text-zinc-900 truncate mt-0.5">{ogTitle}</h5>
                  <p className="text-xs text-zinc-600 line-clamp-2 mt-1">{ogDesc}</p>
                </div>
              </div>

              {/* Twitter Card Preview */}
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="bg-zinc-100 p-2 text-xs font-bold text-zinc-700 border-b border-zinc-200">
                  Twitter / X Large Card
                </div>
                {twImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={twImg} alt="Twitter card preview" className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-zinc-100 text-xs font-medium text-zinc-500">
                    No Twitter Image Selected
                  </div>
                )}
                <div className="p-3">
                  <div className="text-[11px] text-zinc-400 font-semibold">From shiftmycar.com</div>
                  <h5 className="font-bold text-zinc-900 truncate mt-0.5">{twTitle}</h5>
                  <p className="text-xs text-zinc-600 line-clamp-2 mt-1">{twDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FAQ Schema Builder */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-zinc-900">
                Structured FAQ Schema (JSON-LD)
              </h4>
              <p className="text-xs text-zinc-500 mt-0.5">
                Questions and answers generate Google-recognized FAQ rich snippets directly in search results.
              </p>
            </div>
            <button
              type="button"
              className={adminBtnSecondary}
              onClick={() => {
                const next = [...data.faqItems, { question: "", answer: "" }];
                onChange("faqItems", next);
                setExpandedFaq(next.length - 1);
              }}
            >
              <Plus size={14} className="mr-1 inline" />
              Add Question
            </button>
          </div>

          {data.faqItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center bg-zinc-50">
              <p className="text-sm font-medium text-zinc-600">
                No FAQ items yet. Add frequently asked questions to earn Google rich snippets!
              </p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                onClick={() => {
                  onChange("faqItems", [{ question: "", answer: "" }]);
                  setExpandedFaq(0);
                }}
              >
                <Plus size={14} /> Add First FAQ
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {data.faqItems.map((item, index) => {
                const isExpanded = expandedFaq === index || (!item.question && !item.answer);
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm"
                  >
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition"
                      onClick={() => setExpandedFaq(isExpanded ? null : index)}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold text-zinc-900 truncate">
                          {item.question || <span className="italic text-zinc-400">Untitled question...</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-zinc-400 hover:text-red-600 transition p-1"
                          aria-label="Remove FAQ"
                          onClick={(e) => {
                            e.stopPropagation();
                            const next = data.faqItems.filter((_, i) => i !== index);
                            onChange("faqItems", next);
                            if (expandedFaq === index) setExpandedFaq(null);
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 space-y-3 border-t border-zinc-200 bg-white">
                        <AdminField label="Question">
                          <input
                            className={adminInputClass}
                            placeholder="e.g. How much does it cost to shift a car?"
                            value={item.question}
                            onChange={(e) => {
                              const next = [...data.faqItems];
                              next[index] = { ...next[index], question: e.target.value };
                              onChange("faqItems", next);
                            }}
                          />
                        </AdminField>
                        <AdminField label="Answer">
                          <textarea
                            rows={3}
                            className={adminTextareaClass}
                            placeholder="Detailed, clear answer..."
                            value={item.answer}
                            onChange={(e) => {
                              const next = [...data.faqItems];
                              next[index] = { ...next[index], answer: e.target.value };
                              onChange("faqItems", next);
                            }}
                          />
                        </AdminField>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SEO Health Audit */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4 border border-zinc-200">
            <div>
              <h4 className="text-sm font-bold text-zinc-900">Overall SEO Health</h4>
              <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                Automated on-page checks inspecting keywords, meta tags, and rich content.
              </p>
            </div>
            <div className="text-right">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border"
                style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.bg }}
              >
                ● {badge.label}
              </span>
            </div>
          </div>

          <ul className="space-y-2">
            {analysis.items.map((item) => {
              const isGood = item.status === "good";
              const isAttention = item.status === "attention";
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 text-xs shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                        isGood
                          ? "bg-emerald-100 text-emerald-800"
                          : isAttention
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isGood ? "✓" : isAttention ? "!" : "✕"}
                    </span>
                    <span className="font-semibold text-zinc-900">{item.label}</span>
                  </div>
                  <span
                    className={`font-bold uppercase tracking-wider text-[10px] ${
                      isGood
                        ? "text-emerald-700"
                        : isAttention
                          ? "text-amber-700"
                          : "text-red-700"
                    }`}
                  >
                    {isGood ? "Good" : isAttention ? "Attention" : "Missing"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );

  if (mode === "modal" || mode === "drawer") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-zinc-200 text-zinc-900">
          <button
            type="button"
            className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-800 transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <AdminCard className="cms-seo-composer-card">
      {content}
    </AdminCard>
  );
}
