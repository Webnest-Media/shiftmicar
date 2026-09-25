export type SeoChecklistItem = {
  id: string;
  label: string;
  status: "good" | "attention" | "missing";
};

export type SeoHealth = "GOOD" | "NEEDS_ATTENTION" | "INCOMPLETE";

function includesKeyword(haystack: string | null | undefined, keyword: string | null | undefined) {
  if (!haystack || !keyword) return false;
  return haystack.toLowerCase().includes(keyword.toLowerCase().trim());
}

export function analyzeSeoClient(input: {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  focusKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}): { items: SeoChecklistItem[]; health: SeoHealth } {
  const html = input.content || "";
  const text = html.replace(/<[^>]+>/g, " ");
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const h2Count = (html.match(/<h2\b/gi) || []).length;
  const h3Count = (html.match(/<h3\b/gi) || []).length;
  const images = html.match(/<img\b[^>]*>/gi) || [];
  const imagesMissingAlt = images.filter((img) => !/\balt\s*=\s*["'][^"']+["']/i.test(img)).length;
  const internalLinks = (html.match(/href=["']\/[^"']+["']/gi) || []).length;
  const externalLinks = (html.match(/href=["']https?:\/\/[^"']+["']/gi) || []).length;
  const keyword = input.focusKeyword?.trim() || "";

  const items: SeoChecklistItem[] = [
    { id: "focus-keyword", label: "Focus keyword exists", status: keyword ? "good" : "missing" },
    {
      id: "keyword-title",
      label: "Focus keyword appears in title",
      status: !keyword ? "missing" : includesKeyword(input.title, keyword) ? "good" : "attention",
    },
    {
      id: "keyword-slug",
      label: "Focus keyword appears in slug",
      status: !keyword
        ? "missing"
        : includesKeyword(input.slug.replace(/-/g, " "), keyword)
          ? "good"
          : "attention",
    },
    {
      id: "keyword-meta",
      label: "Focus keyword appears in meta description",
      status: !keyword
        ? "missing"
        : includesKeyword(input.metaDescription, keyword)
          ? "good"
          : "attention",
    },
    {
      id: "h1",
      label: "Article has a single H1 (the title)",
      status: !input.title ? "missing" : h1Count > 0 ? "attention" : "good",
    },
    {
      id: "heading-hierarchy",
      label: "Heading hierarchy is coherent",
      status: h3Count > 0 && h2Count === 0 ? "attention" : h2Count + h3Count > 0 || input.title ? "good" : "attention",
    },
    {
      id: "subheadings",
      label: "Content contains H2/H3 headings",
      status: h2Count + h3Count > 0 ? "good" : "attention",
    },
    {
      id: "structure",
      label: "Content has sufficient structure",
      status:
        text.trim().length > 600 && h2Count > 0
          ? "good"
          : text.trim().length > 200
            ? "attention"
            : "missing",
    },
    {
      id: "image-alt",
      label: "Images have alt text",
      status: images.length === 0 ? "attention" : imagesMissingAlt === 0 ? "good" : "attention",
    },
    {
      id: "featured-image",
      label: "Featured image exists",
      status: input.featuredImage ? "good" : "missing",
    },
    {
      id: "featured-alt",
      label: "Featured image has alt text",
      status: input.featuredImage ? (input.featuredImageAlt ? "good" : "attention") : "missing",
    },
    {
      id: "internal-links",
      label: "Internal links exist",
      status: internalLinks > 0 ? "good" : "attention",
    },
    {
      id: "external-links",
      label: "External links exist where relevant",
      status: externalLinks > 0 ? "good" : "attention",
    },
    {
      id: "meta-title",
      label: "Meta title exists",
      status: input.metaTitle || input.title ? "good" : "missing",
    },
    {
      id: "meta-description",
      label: "Meta description exists",
      status: input.metaDescription || input.excerpt ? "good" : "missing",
    },
    {
      id: "canonical",
      label: "Canonical URL is configured",
      status: input.canonicalUrl ? "good" : "attention",
    },
    {
      id: "slug-length",
      label: "URL is reasonably short",
      status: input.slug.length <= 75 ? "good" : "attention",
    },
    {
      id: "excerpt",
      label: "Content has an excerpt",
      status: input.excerpt ? "good" : "missing",
    },
  ];

  const missing = items.filter((item) => item.status === "missing").length;
  const attention = items.filter((item) => item.status === "attention").length;
  let health: SeoHealth = "GOOD";
  if (missing >= 3 || (missing >= 1 && attention >= 4)) health = "INCOMPLETE";
  else if (missing > 0 || attention >= 3) health = "NEEDS_ATTENTION";

  return { items, health };
}

export function seoHealthLabel(health?: SeoHealth | null) {
  if (health === "GOOD") return "Good";
  if (health === "NEEDS_ATTENTION") return "Needs Attention";
  return "Incomplete";
}
