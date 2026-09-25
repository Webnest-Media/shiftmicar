import type {
  PaginatedBlogs,
  BlogPost,
  BlogCategory,
  BlogTag,
  MediaItem,
  ApiUser,
  Testimonial,
  PartnerItem,
  ServiceItem,
  RouteItem,
  PageSeoItem,
} from "@/lib/blog-types";

// Reads from window.__ENV__ (runtime, set by /env.js on Hostinger)
// Falls back to NEXT_PUBLIC_API_URL (build-time, for local dev)
// Falls back to localhost for local development
function getApiUrl(): string {
  if (typeof window !== "undefined" && window.__ENV__?.API_URL) {
    return window.__ENV__.API_URL.replace(/\/+$/, "");
  }
  return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "");
}

const API_URL = getApiUrl();

type ApiSuccess<T> = { success: true; data: T };
type ApiFail = { success: false; message: string; errors?: unknown };

export class ApiError extends Error {
  status: number;
  errors?: unknown;

  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("smc_admin_token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem("smc_admin_token", token);
  else window.localStorage.removeItem("smc_admin_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const json = (await response.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiFail
    | (PaginatedBlogs & { success: true })
    | null;

  if (!response.ok || !json || ("success" in json && json.success === false)) {
    const message =
      json && "message" in json && json.message
        ? json.message
        : "Request failed";
    throw new ApiError(message, response.status, json && "errors" in json ? json.errors : undefined);
  }

  if ("data" in json && "pagination" in json) {
    return json as T;
  }

  if ("data" in json) {
    return (json as ApiSuccess<T>).data;
  }

  return json as T;
}

export const api = {
  login(email: string, password: string) {
    return request<{ token: string; user: ApiUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  logout() {
    return request<{ message: string }>("/api/auth/logout", { method: "POST" }, true);
  },
  me() {
    return request<ApiUser>("/api/auth/me", {}, true);
  },
  updateMe(body: { name?: string; bio?: string | null; avatarUrl?: string | null }) {
    return request<ApiUser>("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }, true);
  },
  dashboard() {
    return request<{
      totals: { total: number; published: number; drafts: number; scheduled: number };
      recent: BlogPost[];
    }>("/api/admin/blogs/dashboard", {}, true);
  },
  adminBlogs(params: URLSearchParams) {
    return request<PaginatedBlogs & { success: true }>(
      `/api/admin/blogs?${params.toString()}`,
      {},
      true,
    );
  },
  adminBlog(id: string) {
    return request<BlogPost>(`/api/admin/blogs/${id}`, {}, true);
  },
  previewBlog(id: string) {
    return request<BlogPost>(`/api/admin/blogs/${id}/preview`, {}, true);
  },
  createBlog(body: Record<string, unknown>) {
    return request<BlogPost>("/api/admin/blogs", {
      method: "POST",
      body: JSON.stringify(body),
    }, true);
  },
  updateBlog(id: string, body: Record<string, unknown>) {
    return request<BlogPost>(`/api/admin/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }, true);
  },
  deleteBlog(id: string) {
    return request<{ id: string }>(`/api/admin/blogs/${id}`, { method: "DELETE" }, true);
  },
  publishBlog(id: string) {
    return request<BlogPost>(`/api/admin/blogs/${id}/publish`, { method: "POST" }, true);
  },
  unpublishBlog(id: string) {
    return request<BlogPost>(`/api/admin/blogs/${id}/unpublish`, { method: "POST" }, true);
  },
  scheduleBlog(id: string, scheduledAt: string) {
    return request<BlogPost>(`/api/admin/blogs/${id}/schedule`, {
      method: "POST",
      body: JSON.stringify({ scheduledAt }),
    }, true);
  },
  authors() {
    return request<ApiUser[]>("/api/admin/blogs/authors", {}, true);
  },
  blogRevisions(id: string) {
    return request<
      Array<{
        id: string;
        title: string;
        slug: string;
        createdAt: string;
        editor?: { id: string; name: string } | null;
      }>
    >(`/api/admin/blogs/${id}/revisions`, {}, true);
  },
  relatedSuggestions(id: string) {
    return request<BlogPost[]>(`/api/admin/blogs/${id}/related-suggestions`, {}, true);
  },
  linkSearch(q: string) {
    return request<{
      blogs: Array<{ label: string; href: string; status: string }>;
      routes: Array<{ label: string; href: string }>;
      services: Array<{ label: string; href: string }>;
      pages: Array<{ label: string; href: string }>;
    }>(`/api/admin/blogs/link-search?q=${encodeURIComponent(q)}`, {}, true);
  },
  categories() {
    return request<BlogCategory[]>("/api/admin/categories", {}, true);
  },
  createCategory(body: Record<string, unknown>) {
    return request<BlogCategory>("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify(body),
    }, true);
  },
  updateCategory(id: string, body: Record<string, unknown>) {
    return request<BlogCategory>(`/api/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }, true);
  },
  deleteCategory(id: string) {
    return request<{ id: string }>(`/api/admin/categories/${id}`, { method: "DELETE" }, true);
  },
  tags() {
    return request<BlogTag[]>("/api/admin/tags", {}, true);
  },
  createTag(body: Record<string, unknown>) {
    return request<BlogTag>("/api/admin/tags", {
      method: "POST",
      body: JSON.stringify(body),
    }, true);
  },
  updateTag(id: string, body: Record<string, unknown>) {
    return request<BlogTag>(`/api/admin/tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }, true);
  },
  deleteTag(id: string) {
    return request<{ id: string }>(`/api/admin/tags/${id}`, { method: "DELETE" }, true);
  },
  media() {
    return request<MediaItem[]>("/api/admin/media", {}, true);
  },
  uploadMedia(file: File) {
    const form = new FormData();
    form.append("file", file);
    return request<MediaItem>("/api/admin/media", {
      method: "POST",
      body: form,
    }, true);
  },
  deleteMedia(id: string) {
    return request<{ id: string }>(`/api/admin/media/${id}`, { method: "DELETE" }, true);
  },
  testimonials() {
    return request<Testimonial[]>("/api/admin/testimonials", {}, true);
  },
  testimonial(id: string) {
    return request<Testimonial>(`/api/admin/testimonials/${id}`, {}, true);
  },
  createTestimonial(body: Record<string, unknown>) {
    return request<Testimonial>("/api/admin/testimonials", {
      method: "POST",
      body: JSON.stringify(body),
    }, true);
  },
  updateTestimonial(id: string, body: Record<string, unknown>) {
    return request<Testimonial>(`/api/admin/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }, true);
  },
  deleteTestimonial(id: string) {
    return request<{ id: string }>(`/api/admin/testimonials/${id}`, { method: "DELETE" }, true);
  },

  // Partners / Brand Logos
  partners() {
    return request<PartnerItem[]>("/api/admin/partners", {}, true);
  },
  partner(id: string) {
    return request<PartnerItem>(`/api/admin/partners/${id}`, {}, true);
  },
  createPartner(body: Record<string, unknown>) {
    return request<PartnerItem>("/api/admin/partners", {
      method: "POST",
      body: JSON.stringify(body),
    }, true);
  },
  updatePartner(id: string, body: Record<string, unknown>) {
    return request<PartnerItem>(`/api/admin/partners/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }, true);
  },
  deletePartner(id: string) {
    return request<{ id: string }>(`/api/admin/partners/${id}`, { method: "DELETE" }, true);
  },

  // Services
  services() {
    return request<ServiceItem[]>("/api/admin/services", {}, true);
  },
  service(id: string) {
    return request<ServiceItem>(`/api/admin/services/${id}`, {}, true);
  },
  createService(body: Record<string, unknown>) {
    return request<ServiceItem>("/api/admin/services", {
      method: "POST",
      body: JSON.stringify(body),
    }, true);
  },
  updateService(id: string, body: Record<string, unknown>) {
    return request<ServiceItem>(`/api/admin/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }, true);
  },
  deleteService(id: string) {
    return request<{ id: string }>(`/api/admin/services/${id}`, { method: "DELETE" }, true);
  },

  // Routes
  routes() {
    return request<RouteItem[]>("/api/admin/routes", {}, true);
  },
  route(id: string) {
    return request<RouteItem>(`/api/admin/routes/${id}`, {}, true);
  },
  createRoute(body: Record<string, unknown>) {
    return request<RouteItem>("/api/admin/routes", {
      method: "POST",
      body: JSON.stringify(body),
    }, true);
  },
  updateRoute(id: string, body: Record<string, unknown>) {
    return request<RouteItem>(`/api/admin/routes/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }, true);
  },
  deleteRoute(id: string) {
    return request<{ id: string }>(`/api/admin/routes/${id}`, { method: "DELETE" }, true);
  },

  // Page SEO
  pageSeos() {
    return request<PageSeoItem[]>("/api/admin/page-seo", {}, true);
  },
  pageSeo(id: string) {
    return request<PageSeoItem>(`/api/admin/page-seo/${id}`, {}, true);
  },
  createPageSeo(body: Record<string, unknown>) {
    return request<PageSeoItem>("/api/admin/page-seo", {
      method: "POST",
      body: JSON.stringify(body),
    }, true);
  },
  updatePageSeo(id: string, body: Record<string, unknown>) {
    return request<PageSeoItem>(`/api/admin/page-seo/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }, true);
  },
};

export async function fetchPublicBlogs(params: URLSearchParams = new URLSearchParams()) {
  const response = await fetch(`${API_URL}/api/blogs?${params.toString()}`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    throw new Error("Failed to load blogs");
  }
  return (await response.json()) as PaginatedBlogs & { success: true };
}

export async function fetchPublicBlog(slug: string) {
  const response = await fetch(`${API_URL}/api/blogs/${slug}`, {
    next: { revalidate: 60 },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Failed to load blog");
  const json = (await response.json()) as {
    success: true;
    data: { blog: BlogPost; related: BlogPost[] };
  };
  return json.data;
}

export async function fetchRedirect(fromPath: string) {
  const response = await fetch(
    `${API_URL}/api/redirects?from=${encodeURIComponent(fromPath)}`,
    { next: { revalidate: 60 } },
  );
  if (response.status === 404) return null;
  if (!response.ok) return null;
  const json = (await response.json()) as {
    success: true;
    data: { fromPath: string; toPath: string; statusCode: number };
  };
  return json.data;
}

export async function fetchPublishedBlogUrls() {
  const response = await fetch(`${API_URL}/api/blogs?limit=100&page=1`, {
    next: { revalidate: 300 },
  });
  if (!response.ok) return [] as BlogPost[];
  const json = (await response.json()) as PaginatedBlogs & { success: true };
  return json.data;
}

export async function fetchPublicCategories() {
  const response = await fetch(`${API_URL}/api/categories`, {
    next: { revalidate: 300 },
  });
  if (!response.ok) return [] as BlogCategory[];
  const json = (await response.json()) as { success: true; data: BlogCategory[] };
  return json.data;
}

export async function fetchPublicTestimonials() {
  try {
    const response = await fetch(`${API_URL}/api/testimonials`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [] as Testimonial[];
    const json = (await response.json()) as { success: true; data: Testimonial[] };
    return json.data || [];
  } catch {
    return [] as Testimonial[];
  }
}

export async function fetchPublicPartners() {
  try {
    const response = await fetch(`${API_URL}/api/partners`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [] as PartnerItem[];
    const json = (await response.json()) as { success: true; data: PartnerItem[] };
    return json.data || [];
  } catch {
    return [] as PartnerItem[];
  }
}

export async function fetchPublicServices() {
  try {
    const response = await fetch(`${API_URL}/api/services`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [] as ServiceItem[];
    const json = (await response.json()) as { success: true; data: ServiceItem[] };
    return json.data || [];
  } catch {
    return [] as ServiceItem[];
  }
}

export async function fetchPublicService(slug: string) {
  try {
    const response = await fetch(`${API_URL}/api/services/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const json = (await response.json()) as { success: true; data: ServiceItem };
    return json.data || null;
  } catch {
    return null;
  }
}

export async function fetchPublicRoutes() {
  try {
    const response = await fetch(`${API_URL}/api/routes`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [] as RouteItem[];
    const json = (await response.json()) as { success: true; data: RouteItem[] };
    return json.data || [];
  } catch {
    return [] as RouteItem[];
  }
}

export async function fetchPublicRoute(slug: string) {
  try {
    const response = await fetch(`${API_URL}/api/routes/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const json = (await response.json()) as { success: true; data: RouteItem };
    return json.data || null;
  } catch {
    return null;
  }
}

export async function fetchPublicPageSeo(path: string) {
  try {
    const response = await fetch(`${API_URL}/api/page-seo?path=${encodeURIComponent(path)}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const json = (await response.json()) as { success: true; data: PageSeoItem };
    return json.data || null;
  } catch {
    return null;
  }
}

export { API_URL };

