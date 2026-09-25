export function getSiteUrl() {
  // Runtime: read from /env.js (Hostinger static file)
  if (typeof window !== "undefined" && window.__ENV__?.SITE_URL) {
    return window.__ENV__.SITE_URL.replace(/\/+$/, "");
  }
  // Build-time / SSR fallback
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function blogCanonicalPath(slug: string) {
  return `/blogs/${slug}`;
}

export function blogCanonicalUrl(slug: string, override?: string | null) {
  if (override) return override;
  return `${getSiteUrl()}${blogCanonicalPath(slug)}`;
}
