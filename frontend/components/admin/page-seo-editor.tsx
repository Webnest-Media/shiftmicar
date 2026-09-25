"use client";

import { useEffect, useState } from "react";
import { Check, Globe, Layout, Plus, Save, Sparkles } from "lucide-react";
import {
  AdminCard,
  AdminField,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInputClass,
} from "@/components/admin/admin-ui";
import { SeoComposer, type SeoComposerData, seoHealthBadge } from "@/components/admin/seo-composer";
import { api } from "@/lib/api";
import type { PageSeoItem } from "@/lib/blog-types";

const defaultPages = [
  { path: "/", name: "Home Page" },
  { path: "/about", name: "About Us" },
  { path: "/services", name: "All Services" },
  { path: "/routes", name: "All Relocation Routes" },
  { path: "/contact", name: "Contact & Support" },
  { path: "/privacy-policy", name: "Privacy Policy" },
  { path: "/terms-and-conditions", name: "Terms & Conditions" },
];

export function PageSeoEditor() {
  const [pageSeos, setPageSeos] = useState<PageSeoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState<string>("/");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Current page form state
  const [currentPageName, setCurrentPageName] = useState("Home Page");
  const [seo, setSeo] = useState<SeoComposerData>({
    focusKeyword: "",
    secondaryKeywords: "",
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    faqItems: [],
  });

  // Modal for adding custom page path
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customPath, setCustomPath] = useState("");
  const [customName, setCustomName] = useState("");

  async function loadAllSeo() {
    try {
      setLoading(true);
      const items = await api.pageSeos();
      setPageSeos(items);
      loadSelectedPage(selectedPath, items);
    } catch (err) {
      console.error("Failed to load page seo list", err);
    } finally {
      setLoading(false);
    }
  }

  function loadSelectedPage(path: string, items = pageSeos) {
    const existing = items.find((item) => item.pagePath === path);
    const defaultMeta = defaultPages.find((p) => p.path === path);

    if (existing) {
      setCurrentPageName(existing.pageName);
      setSeo({
        focusKeyword: existing.focusKeyword || "",
        secondaryKeywords: (existing.secondaryKeywords || []).join(", "),
        metaTitle: existing.metaTitle || "",
        metaDescription: existing.metaDescription || "",
        canonicalUrl: existing.canonicalUrl || "",
        robotsIndex: existing.robotsIndex ?? true,
        robotsFollow: existing.robotsFollow ?? true,
        ogTitle: existing.ogTitle || "",
        ogDescription: existing.ogDescription || "",
        ogImage: existing.ogImage || "",
        twitterTitle: existing.twitterTitle || "",
        twitterDescription: existing.twitterDescription || "",
        twitterImage: existing.twitterImage || "",
        faqItems: existing.faqItems || [],
      });
    } else {
      setCurrentPageName(defaultMeta?.name || path);
      setSeo({
        focusKeyword: "",
        secondaryKeywords: "",
        metaTitle: `${defaultMeta?.name || path} | Shift My Car`,
        metaDescription: "",
        canonicalUrl: "",
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        twitterTitle: "",
        twitterDescription: "",
        twitterImage: "",
        faqItems: [],
      });
    }
  }

  useEffect(() => {
    loadAllSeo();
  }, []);

  function handleSelectPage(path: string) {
    setSelectedPath(path);
    loadSelectedPage(path);
    setSuccessMsg("");
    setErrorMsg("");
  }

  function handleSeoChange<K extends keyof SeoComposerData>(field: K, value: SeoComposerData[K]) {
    setSeo((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    const payload = {
      pagePath: selectedPath,
      pageName: currentPageName.trim(),
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
      ogImage: seo.ogImage.trim() || null,
      twitterTitle: seo.twitterTitle.trim() || null,
      twitterDescription: seo.twitterDescription.trim() || null,
      twitterImage: seo.twitterImage.trim() || null,
      faqItems: seo.faqItems.filter((f) => f.question.trim() && f.answer.trim()),
    };

    try {
      const existing = pageSeos.find((item) => item.pagePath === selectedPath);
      let updated: PageSeoItem;
      if (existing) {
        updated = await api.updatePageSeo(existing.id, payload);
        setPageSeos((prev) => prev.map((p) => (p.id === existing.id ? updated : p)));
      } else {
        updated = await api.createPageSeo(payload);
        setPageSeos((prev) => [...prev, updated]);
      }
      setSuccessMsg(`SEO configuration for ${currentPageName} saved successfully!`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save Page SEO");
    } finally {
      setSaving(false);
    }
  }

  // Combine default pages with any custom paths found in the database
  const allPageOptions = [
    ...defaultPages,
    ...pageSeos
      .filter((p) => !defaultPages.some((d) => d.path === p.pagePath))
      .map((p) => ({ path: p.pagePath, name: p.pageName })),
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 text-zinc-900">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Globe className="h-6 w-6 text-indigo-600" />
            Sitewide Page SEO Studio
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Configure detailed Google SERP snippets, OpenGraph cards, Twitter cards, FAQ schema, and meta tags for every page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`${adminBtnSecondary} flex items-center gap-1.5`}
            onClick={() => setShowAddCustom(true)}
          >
            <Plus size={15} /> Add Custom URL Path
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className={`${adminBtnPrimary} flex items-center gap-2`}
          >
            <Save size={16} />
            {saving ? "Saving…" : "Save SEO Settings"}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <Check size={18} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Main Studio Layout: Left Sidebar for Pages, Right for SEO Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Pages List */}
        <div className="lg:col-span-1 space-y-3">
          <AdminCard padded={false}>
            <div className="p-3 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                Select Page
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                {allPageOptions.length} Pages
              </span>
            </div>
            <div className="divide-y divide-zinc-200 max-h-[650px] overflow-y-auto">
              {allPageOptions.map((page) => {
                const isSelected = selectedPath === page.path;
                const saved = pageSeos.find((p) => p.pagePath === page.path);
                const badge = saved?.seoHealth ? seoHealthBadge(saved.seoHealth) : null;

                return (
                  <button
                    key={page.path}
                    type="button"
                    onClick={() => handleSelectPage(page.path)}
                    className={`w-full text-left p-3.5 transition flex flex-col gap-1 ${
                      isSelected
                        ? "bg-indigo-50 border-l-4 border-indigo-600 font-semibold"
                        : "hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-bold truncate ${
                          isSelected ? "text-indigo-950" : "text-zinc-800"
                        }`}
                      >
                        {page.name}
                      </span>
                      {badge && (
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: badge.text }}
                          title={`SEO: ${badge.label}`}
                        />
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 truncate">
                      {page.path}
                    </span>
                  </button>
                );
              })}
            </div>
          </AdminCard>

          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
            <p className="font-bold flex items-center gap-1 mb-1">
              <Sparkles size={14} className="text-indigo-600" /> Full Search Engine Control
            </p>
            Each page receives custom metatags, social preview images, and FAQ structured data embedded directly into the HTML header.
          </div>
        </div>

        {/* Right Column: Active Page SEO Configuration */}
        <div className="lg:col-span-3 space-y-6">
          <AdminCard>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div>
                <div className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-zinc-900">
                    {currentPageName}
                  </h2>
                </div>
                <p className="text-xs font-mono text-zinc-500 mt-0.5">Path: {selectedPath}</p>
              </div>

              <div className="w-full sm:w-64">
                <AdminField label="Page Display Name">
                  <input
                    className={adminInputClass}
                    value={currentPageName}
                    onChange={(e) => setCurrentPageName(e.target.value)}
                  />
                </AdminField>
              </div>
            </div>

            {/* Reusable Detailed SEO Composer */}
            <div className="pt-4">
              <SeoComposer
                data={seo}
                onChange={handleSeoChange}
                context={{
                  title: currentPageName,
                  urlPath: selectedPath,
                  excerpt: seo.metaDescription,
                }}
              />
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Add Custom Page Path Modal */}
      {showAddCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-zinc-200 space-y-4 text-zinc-900">
            <h3 className="text-base font-bold text-zinc-900">
              Add Custom Page Path
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              Enter any URL path to manage its specific meta title, description, and rich snippets.
            </p>

            <AdminField label="Page Title / Name">
              <input
                className={adminInputClass}
                placeholder="e.g. Car Shipping FAQ"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </AdminField>

            <AdminField label="URL Path" hint="Must start with / (e.g. /faq or /quote)">
              <input
                className={adminInputClass}
                placeholder="/custom-page"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
              />
            </AdminField>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                className={adminBtnSecondary}
                onClick={() => setShowAddCustom(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={adminBtnPrimary}
                onClick={() => {
                  if (!customPath.trim().startsWith("/")) {
                    alert("URL path must start with a slash (e.g. /faq)");
                    return;
                  }
                  setSelectedPath(customPath.trim());
                  setCurrentPageName(customName.trim() || customPath.trim());
                  setShowAddCustom(false);
                  setCustomPath("");
                  setCustomName("");
                }}
              >
                Add Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
