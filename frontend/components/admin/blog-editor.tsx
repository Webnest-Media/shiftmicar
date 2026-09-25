"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { getSiteUrl } from "@/lib/site-url";
import {
  AdminCard,
  AdminField,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/admin-ui";
import {
  CmsCheckboxGroup,
  CmsDatePicker,
  CmsFilePicker,
  CmsSelect,
} from "@/components/admin/cms-controls";
import { api } from "@/lib/api";
import type { BlogCategory, BlogPost, BlogStatus, BlogTag, FaqItem } from "@/lib/blog-types";
import { toSlug } from "@/lib/blog-utils";
import { analyzeSeoClient, seoHealthLabel } from "@/lib/seo-checklist";

type BlogEditorProps = {
  mode: "create" | "edit";
  blogId?: string;
};

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentJson: unknown;
  featuredImage: string;
  featuredImageAlt: string;
  status: BlogStatus;
  publishedAt: string;
  scheduledAt: string;
  categoryId: string;
  authorName: string;
  authorBio: string;
  tagIds: string[];
  relatedBlogIds: string[];
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

type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

const emptyForm: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  contentJson: null,
  featuredImage: "",
  featuredImageAlt: "",
  status: "DRAFT",
  publishedAt: "",
  scheduledAt: "",
  categoryId: "",
  authorName: "",
  authorBio: "",
  tagIds: [],
  relatedBlogIds: [],
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
};

function toLocalInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromBlog(blog: BlogPost): FormState {
  return {
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt || "",
    content: blog.content || "",
    contentJson: blog.contentJson ?? null,
    featuredImage: blog.featuredImage || "",
    featuredImageAlt: blog.featuredImageAlt || "",
    status: blog.status,
    publishedAt: toLocalInput(blog.publishedAt),
    scheduledAt: toLocalInput(blog.scheduledAt),
    categoryId: blog.categoryId || "",
    authorName: blog.authorName || blog.author?.name || "",
    authorBio: blog.authorBio || blog.author?.bio || "",
    tagIds: blog.tags.map((tag) => tag.id),
    relatedBlogIds: blog.relatedBlogIds || blog.relatedBlogs?.map((b) => b.id) || [],
    focusKeyword: blog.focusKeyword || "",
    secondaryKeywords: (blog.secondaryKeywords || []).join(", "),
    metaTitle: blog.metaTitle || "",
    metaDescription: blog.metaDescription || "",
    canonicalUrl: blog.canonicalUrl || "",
    robotsIndex: blog.robotsIndex ?? blog.status === "PUBLISHED",
    robotsFollow: blog.robotsFollow ?? blog.status === "PUBLISHED",
    ogTitle: blog.ogTitle || "",
    ogDescription: blog.ogDescription || "",
    ogImage: blog.ogImage || "",
    twitterTitle: blog.twitterTitle || "",
    twitterDescription: blog.twitterDescription || "",
    twitterImage: blog.twitterImage || "",
    faqItems: blog.faqItems || [],
  };
}

function charTone(length: number, idealMin: number, idealMax: number) {
  if (length === 0) return "cms-count-muted";
  if (length >= idealMin && length <= idealMax) return "cms-count-good";
  return "cms-count-warn";
}

export function BlogEditor({ mode, blogId }: BlogEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [suggestions, setSuggestions] = useState<BlogPost[]>([]);
  const [error, setError] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loading, setLoading] = useState(mode === "edit");
  const [currentId, setCurrentId] = useState(blogId);
  const hydrated = useRef(false);
  const skipAutosave = useRef(true);

  const seo = useMemo(
    () =>
      analyzeSeoClient({
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        featuredImage: form.featuredImage,
        featuredImageAlt: form.featuredImageAlt,
        focusKeyword: form.focusKeyword,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        canonicalUrl: form.canonicalUrl,
      }),
    [form],
  );

  const previewTitle = form.metaTitle || form.title || "SEO title preview";
  const previewUrl = `${getSiteUrl().replace(/^https?:\/\//, "")}/blogs/${form.slug || "your-slug"}`;
  const previewDesc =
    form.metaDescription ||
    form.excerpt ||
    "Meta description preview appears here as you type.";

  const ogTitle = form.ogTitle || previewTitle;
  const ogDesc = form.ogDescription || previewDesc;
  const ogImage = form.ogImage || form.featuredImage;
  const twTitle = form.twitterTitle || ogTitle;
  const twDesc = form.twitterDescription || ogDesc;
  const twImage = form.twitterImage || ogImage;

  const relatedOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: { value: string; label: string }[] = [];
    for (const blog of [...suggestions, ...allBlogs]) {
      if (!blog.id || blog.id === currentId || seen.has(blog.id)) continue;
      seen.add(blog.id);
      options.push({ value: blog.id, label: blog.title });
    }
    return options;
  }, [allBlogs, suggestions, currentId]);

  const h1Count = (form.content.match(/<h1\b/gi) || []).length;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (hydrated.current) {
      setSaveStatus("unsaved");
      skipAutosave.current = false;
    }
  }

  function buildPayload(statusOverride?: BlogStatus) {
    const status = statusOverride ?? form.status;
    return {
      title: form.title,
      slug: form.slug || toSlug(form.title),
      excerpt: form.excerpt || null,
      content: form.content,
      contentJson: form.contentJson,
      featuredImage: form.featuredImage || null,
      featuredImageAlt: form.featuredImageAlt || null,
      status,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
      categoryId: form.categoryId || null,
      authorName: form.authorName.trim() || null,
      authorBio: form.authorBio.trim() || null,
      tagIds: form.tagIds,
      relatedBlogIds: form.relatedBlogIds,
      focusKeyword: form.focusKeyword || null,
      secondaryKeywords: form.secondaryKeywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      canonicalUrl: form.canonicalUrl || null,
      robotsIndex: status === "PUBLISHED" ? form.robotsIndex : false,
      robotsFollow: status === "PUBLISHED" ? form.robotsFollow : false,
      ogTitle: form.ogTitle || null,
      ogDescription: form.ogDescription || null,
      ogImage: form.ogImage || null,
      twitterTitle: form.twitterTitle || null,
      twitterDescription: form.twitterDescription || null,
      twitterImage: form.twitterImage || null,
      faqItems: form.faqItems.filter((item) => item.question.trim() && item.answer.trim()),
    };
  }

  const persist = useCallback(
    async (statusOverride?: BlogStatus, soft = false) => {
      if (!form.title.trim()) {
        if (!soft) setError("Title is required");
        return null;
      }

      setSaveStatus("saving");
      if (!soft) setError("");

      const payload = buildPayload(statusOverride);

      try {
        if (!currentId) {
          const created = await api.createBlog(payload);
          setCurrentId(created.id);
          setForm(fromBlog(created));
          setSaveStatus("saved");
          skipAutosave.current = true;
          router.replace(`/admin/blogs/${created.id}/edit`);
          return created;
        }

        const updated = await api.updateBlog(currentId, payload);
        setForm(fromBlog(updated));
        setSaveStatus("saved");
        skipAutosave.current = true;
        return updated;
      } catch (err) {
        setSaveStatus("error");
        setError(err instanceof Error ? err.message : "Save failed");
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentId, form, router],
  );

  useEffect(() => {
    Promise.all([
      api.categories(),
      api.tags(),
      api.adminBlogs(new URLSearchParams({ limit: "100", sort: "updated" })),
    ])
      .then(([categoryResult, tagResult, blogResult]) => {
        setCategories(categoryResult);
        setTags(tagResult);
        setAllBlogs(blogResult.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, []);

  useEffect(() => {
    if (mode !== "create") return;
    api
      .me()
      .then((user) => {
        setForm((current) => {
          if (current.authorName) return current;
          return {
            ...current,
            authorName: user.name,
            authorBio: current.authorBio || user.bio || "",
          };
        });
      })
      .catch(() => undefined);
  }, [mode]);

  useEffect(() => {
    if (mode !== "edit" || !blogId) {
      hydrated.current = true;
      return;
    }

    Promise.all([
      api.adminBlog(blogId),
      api.relatedSuggestions(blogId).catch(() => []),
    ])
      .then(([blog, suggestionRows]) => {
        setForm(fromBlog(blog));
        setSlugTouched(true);
        setCurrentId(blog.id);
        setSuggestions(suggestionRows);
        hydrated.current = true;
        skipAutosave.current = true;
        setSaveStatus("saved");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load blog"))
      .finally(() => setLoading(false));
  }, [mode, blogId]);

  useEffect(() => {
    if (!currentId || skipAutosave.current || saveStatus !== "unsaved") return;
    const timer = setTimeout(() => {
      void persist(undefined, true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [form, currentId, saveStatus, persist]);

  useEffect(() => {
    if (!seoOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSeoOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [seoOpen]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (saveStatus === "unsaved" || saveStatus === "saving") {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [saveStatus]);

  async function onUpload(file: File) {
    const media = await api.uploadMedia(file);
    update("featuredImage", media.url);
    if (!form.featuredImageAlt && media.alt) {
      update("featuredImageAlt", media.alt);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await persist();
  }

  async function saveDraft() {
    await persist("DRAFT");
  }

  async function publishNow() {
    await persist("PUBLISHED");
  }

  async function schedulePost() {
    if (!form.scheduledAt) {
      setError("Choose a schedule date before scheduling");
      return;
    }
    await persist("SCHEDULED");
  }

  async function preview() {
    const saved = currentId ? await persist() : await persist("DRAFT");
    const id = currentId || saved?.id;
    if (id) router.push(`/admin/blogs/${id}/preview`);
  }

  if (loading) {
    return <p className="cms-hint">Loading editor…</p>;
  }

  const saveLabel =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "saved"
        ? "Saved"
        : saveStatus === "unsaved"
          ? "Unsaved"
          : saveStatus === "error"
            ? "Save failed"
            : "";

  return (
    <form className="cms-composer" onSubmit={onSubmit}>
      <div className="cms-composer-bar">
        <div className="cms-composer-bar-left">
          <Link href="/admin/blogs" className="cms-back">
            ← Blogs
          </Link>
          <span className="cms-save-status" data-status={saveStatus}>
            {saveLabel}
          </span>
        </div>
        <div className="cms-composer-actions">
          <button type="button" className={adminBtnSecondary} onClick={() => void saveDraft()}>
            Save draft
          </button>
          <button type="button" className={adminBtnSecondary} onClick={() => void preview()}>
            Preview
          </button>
          <button
            type="button"
            className="cms-seo-trigger"
            data-health={seo.health}
            onClick={() => setSeoOpen(true)}
          >
            <span>SEO</span>
            <strong>{seoHealthLabel(seo.health)}</strong>
          </button>
          <button type="button" className={adminBtnPrimary} onClick={() => void publishNow()}>
            Publish
          </button>
        </div>
      </div>

      {error ? <p className="cms-error">{error}</p> : null}
      {h1Count > 0 ? (
        <p className="cms-warn">
          The article title is the public H1. Prefer H2 in the editor body.
        </p>
      ) : null}

      <nav className="cms-composer-jump">
        <a href="#write">Write</a>
        <a href="#setup">Setup</a>
        <a href="#cover">Cover</a>
        <a href="#extras">Extras</a>
      </nav>

      <div className="cms-composer-frame">
        <div className="cms-editor-layout">
          <div className="cms-editor-main" id="write">
            <div className="cms-write-card">
              <input
                required
                className="cms-title-input"
                placeholder="How to Transport Your Car..."
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  update("title", title);
                  if (!slugTouched) update("slug", toSlug(title));
                }}
              />
              <RichTextEditor
                value={form.content}
                onChange={(html, json) => {
                  update("content", html);
                  update("contentJson", json);
                }}
              />
            </div>
          <details id="extras" className="cms-composer-more">
            <summary>Social, FAQ & extras</summary>
            <div className="cms-composer-more-body">
              <div className="cms-extras-grid">
          <AdminField label="Publish date">
            <CmsDatePicker
              includeTime
              value={form.publishedAt}
              placeholder="Publish date & time"
              onChange={(next) => update("publishedAt", next)}
            />
          </AdminField>
          <AdminField label="Secondary keywords" hint="Comma-separated. Guidance only.">
            <input
              className={adminInputClass}
              value={form.secondaryKeywords}
              onChange={(e) => update("secondaryKeywords", e.target.value)}
            />
          </AdminField>
          <AdminField label="Canonical URL">
            <input
              className={adminInputClass}
              value={form.canonicalUrl}
              onChange={(e) => update("canonicalUrl", e.target.value)}
            />
          </AdminField>
          <AdminField label="Robots Index">
            <CmsSelect
              value={form.robotsIndex ? "index" : "noindex"}
              onChange={(next) => update("robotsIndex", next === "index")}
              options={[
                { value: "index", label: "index" },
                { value: "noindex", label: "noindex" },
              ]}
            />
          </AdminField>
          <AdminField label="Robots Follow">
            <CmsSelect
              value={form.robotsFollow ? "follow" : "nofollow"}
              onChange={(next) => update("robotsFollow", next === "follow")}
              options={[
                { value: "follow", label: "follow" },
                { value: "nofollow", label: "nofollow" },
              ]}
            />
          </AdminField>
          <AdminField label="OG Title">
            <input className={adminInputClass} value={form.ogTitle} onChange={(e) => update("ogTitle", e.target.value)} />
          </AdminField>
          <AdminField label="OG Description">
            <textarea rows={3} className={adminTextareaClass} value={form.ogDescription} onChange={(e) => update("ogDescription", e.target.value)} />
          </AdminField>
          <AdminField label="OG Image">
            <input className={adminInputClass} value={form.ogImage} onChange={(e) => update("ogImage", e.target.value)} />
          </AdminField>
          <AdminField label="Twitter Title">
            <input className={adminInputClass} value={form.twitterTitle} onChange={(e) => update("twitterTitle", e.target.value)} />
          </AdminField>
          <AdminField label="Twitter Description">
            <textarea rows={3} className={adminTextareaClass} value={form.twitterDescription} onChange={(e) => update("twitterDescription", e.target.value)} />
          </AdminField>
          <AdminField label="Twitter Image">
            <input className={adminInputClass} value={form.twitterImage} onChange={(e) => update("twitterImage", e.target.value)} />
          </AdminField>
              </div>
          <div>
            <h2 className="cms-section-title">FAQ</h2>
            {form.faqItems.map((item, index) => (
              <div key={index} className="cms-faq-row">
                <input
                  className={adminInputClass}
                  placeholder="Question"
                  value={item.question}
                  onChange={(e) => {
                    const next = [...form.faqItems];
                    next[index] = { ...next[index], question: e.target.value };
                    update("faqItems", next);
                  }}
                />
                <textarea
                  className={adminTextareaClass}
                  rows={2}
                  placeholder="Answer"
                  value={item.answer}
                  onChange={(e) => {
                    const next = [...form.faqItems];
                    next[index] = { ...next[index], answer: e.target.value };
                    update("faqItems", next);
                  }}
                />
                <button
                  type="button"
                  className="cms-btn cms-btn-ghost"
                  onClick={() =>
                    update(
                      "faqItems",
                      form.faqItems.filter((_, i) => i !== index),
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className={adminBtnSecondary}
              onClick={() =>
                update("faqItems", [...form.faqItems, { question: "", answer: "" }])
              }
            >
              Add FAQ
            </button>
          </div>
          <div>
            <h2 className="cms-section-title">Related Blogs</h2>
            <CmsCheckboxGroup
              className="cms-check-list"
              values={form.relatedBlogIds}
              onChange={(next) => update("relatedBlogIds", next)}
              options={relatedOptions}
            />
          </div>
          {ogImage || twImage ? (
            <div className="cms-social-grid">
              <div className="cms-social-card">
                <p className="cms-hint">Open Graph</p>
                {ogImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ogImage} alt="" />
                ) : (
                  <div className="cms-social-placeholder">No image</div>
                )}
                <strong>{ogTitle}</strong>
                <p>{ogDesc}</p>
              </div>
              <div className="cms-social-card">
                <p className="cms-hint">Twitter / X</p>
                {twImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={twImage} alt="" />
                ) : (
                  <div className="cms-social-placeholder">No image</div>
                )}
                <strong>{twTitle}</strong>
                <p>{twDesc}</p>
              </div>
            </div>
          ) : null}
            </div>
          </details>
          </div>

        <aside className="cms-editor-side">
          <AdminCard className="cms-side-card" padded={false}>
            <div className="cms-side-card-body" id="setup">
              <h2 className="cms-side-title">Publish</h2>
              <AdminField label="Status">
                <CmsSelect
                  value={form.status}
                  onChange={(next) => update("status", next as BlogStatus)}
                  options={[
                    { value: "DRAFT", label: "Draft" },
                    { value: "PUBLISHED", label: "Published" },
                    { value: "SCHEDULED", label: "Scheduled" },
                  ]}
                />
              </AdminField>
              <AdminField label="Schedule">
                <CmsDatePicker
                  includeTime
                  value={form.scheduledAt}
                  placeholder="Pick date & time"
                  onChange={(next) => update("scheduledAt", next)}
                />
              </AdminField>
              <button type="button" className={adminBtnSecondary} onClick={() => void schedulePost()}>
                Schedule
              </button>
            </div>
          </AdminCard>

          <AdminCard className="cms-side-card" padded={false}>
            <div className="cms-side-card-body">
              <h2 className="cms-side-title">Post setup</h2>
              <AdminField label="Author" hint="Name shown on the published article">
                <input
                  className={adminInputClass}
                  value={form.authorName}
                  placeholder="Author name"
                  onChange={(e) => update("authorName", e.target.value)}
                />
              </AdminField>
              <AdminField label="Author bio">
                <textarea
                  rows={3}
                  className={adminTextareaClass}
                  value={form.authorBio}
                  placeholder="Optional short bio"
                  onChange={(e) => update("authorBio", e.target.value)}
                />
              </AdminField>
              <AdminField label="Category">
                <CmsSelect
                  value={form.categoryId}
                  placeholder="Select category"
                  searchable
                  onChange={(next) => update("categoryId", next)}
                  options={[
                    { value: "", label: "Select category" },
                    ...categories.map((category) => ({
                      value: category.id,
                      label: category.name,
                    })),
                  ]}
                />
              </AdminField>
              <div>
                <p className="cms-field-label">Tags</p>
                <CmsCheckboxGroup
                  values={form.tagIds}
                  onChange={(next) => update("tagIds", next)}
                  options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
                />
              </div>
              <AdminField label="Slug" hint="Used in /blogs/[slug]">
                <input
                  required
                  className={adminInputClass}
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    update("slug", toSlug(e.target.value));
                  }}
                />
              </AdminField>
              <AdminField label="Excerpt">
                <textarea
                  rows={3}
                  className={adminTextareaClass}
                  value={form.excerpt}
                  onChange={(e) => update("excerpt", e.target.value)}
                />
              </AdminField>
            </div>
          </AdminCard>

          <AdminCard className="cms-side-card" padded={false}>
            <div className="cms-side-card-body" id="cover">
              <h2 className="cms-side-title">Cover image</h2>
              <AdminField label="Upload">
                <CmsFilePicker
                  accept="image/*"
                  label="Choose image"
                  onChange={(file) => {
                    if (file) onUpload(file).catch((err) => setError(err.message));
                  }}
                />
              </AdminField>
              <AdminField label="Image URL">
                <input
                  className={adminInputClass}
                  value={form.featuredImage}
                  onChange={(e) => update("featuredImage", e.target.value)}
                />
              </AdminField>
              <AdminField label="Alt text">
                <input
                  className={adminInputClass}
                  value={form.featuredImageAlt}
                  onChange={(e) => update("featuredImageAlt", e.target.value)}
                />
              </AdminField>
              {form.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.featuredImage}
                  alt={form.featuredImageAlt || ""}
                  className="cms-cover-thumb"
                />
              ) : null}
            </div>
          </AdminCard>
        </aside>
      </div>


      </div>

      {seoOpen
        ? createPortal(
            <div className="cms-modal">
          <button
            type="button"
            className="cms-modal-backdrop"
            aria-label="Close SEO"
            onClick={() => setSeoOpen(false)}
          />
          <div
            className="cms-modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cms-seo-title"
          >
            <div className="cms-modal-head">
              <h2 id="cms-seo-title">SEO · {seoHealthLabel(seo.health)}</h2>
              <button
                type="button"
                className="cms-modal-close"
                aria-label="Close"
                onClick={() => setSeoOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="cms-modal-body">
              <AdminField label="Focus keyword">
                <input
                  className={adminInputClass}
                  value={form.focusKeyword}
                  onChange={(e) => update("focusKeyword", e.target.value)}
                  placeholder="car transportation from Delhi to Bangalore"
                />
              </AdminField>
              <AdminField label="SEO title">
                <input
                  className={adminInputClass}
                  value={form.metaTitle}
                  onChange={(e) => update("metaTitle", e.target.value)}
                />
                <span className={charTone(form.metaTitle.length, 50, 60)}>
                  {form.metaTitle.length}/60
                </span>
              </AdminField>
              <AdminField label="Meta description">
                <textarea
                  rows={3}
                  className={adminTextareaClass}
                  value={form.metaDescription}
                  onChange={(e) => update("metaDescription", e.target.value)}
                />
                <span className={charTone(form.metaDescription.length, 150, 160)}>
                  {form.metaDescription.length}/160
                </span>
              </AdminField>
              <div className="cms-serp">
                <p className="cms-serp-title">{previewTitle}</p>
                <p className="cms-serp-url">{previewUrl}</p>
                <p className="cms-serp-desc">{previewDesc}</p>
              </div>
              <ul className="cms-checklist">
                {seo.items.map((item) => (
                  <li key={item.id} data-status={item.status}>
                    <span>{item.status === "good" ? "✓" : item.status === "attention" ? "!" : "○"}</span>
                    {item.label}
                    <em>
                      {item.status === "good"
                        ? "Good"
                        : item.status === "attention"
                          ? "Needs Attention"
                          : "Missing"}
                    </em>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>,
            document.body,
          )
        : null}
    </form>
  );
}
