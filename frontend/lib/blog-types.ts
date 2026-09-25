export type BlogStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";
export type UserRole = "ADMIN" | "EDITOR";
export type SeoHealth = "GOOD" | "NEEDS_ATTENTION" | "INCOMPLETE";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string | null;
  avatarUrl?: string | null;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { blogs: number };
};

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
  _count?: { blogs: number };
};

export type BlogAuthor = {
  id: string;
  name: string;
  email?: string;
  role?: UserRole;
  bio?: string | null;
  avatarUrl?: string | null;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SeoChecklistItem = {
  id: string;
  label: string;
  status: "good" | "attention" | "missing";
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  contentJson?: unknown;
  featuredImage: string | null;
  featuredImageAlt?: string | null;
  status: BlogStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  categoryId: string | null;
  authorId?: string;
  authorName?: string | null;
  authorBio?: string | null;
  focusKeyword?: string | null;
  secondaryKeywords?: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  faqItems?: FaqItem[] | null;
  seoHealth?: SeoHealth;
  seoChecklist?: SeoChecklistItem[];
  relatedBlogIds?: string[];
  relatedBlogs?: BlogPost[];
  createdAt: string;
  updatedAt: string;
  author: BlogAuthor;
  category: BlogCategory | null;
  tags: BlogTag[];
};

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt?: string | null;
  createdAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedBlogs = {
  data: BlogPost[];
  pagination: Pagination;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  logo?: string | null;
  rating: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PartnerItem = {
  id: string;
  name: string;
  logo: string;
  alt?: string | null;
  order: number;
  isActive: boolean;
  widthDesktop?: number | null;
  heightDesktop?: number | null;
  widthMobile?: number | null;
  heightMobile?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ServiceFeature = {
  number?: string;
  title: string;
  description: string;
};

export type ServiceItem = {
  id: string;
  index: string;
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  alt: string;
  icon?: string | null;
  overview?: string[];
  features: ServiceFeature[];
  order: number;
  isActive: boolean;
  focusKeyword?: string | null;
  secondaryKeywords?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  faqItems?: FaqItem[] | null;
  seoHealth?: SeoHealth;
  createdAt: string;
  updatedAt: string;
};

export type RouteItem = {
  id: string;
  slug: string;
  number: string;
  origin: string;
  destination: string;
  fromCity?: string;
  toCity?: string;
  title: string;
  description: string;
  detailDescription: string;
  image: string;
  alt: string;
  originLat: number;
  originLng: number;
  destinationLat?: number | null;
  destinationLng?: number | null;
  fromLat?: number | null;
  fromLng?: number | null;
  toLat?: number | null;
  toLng?: number | null;
  distanceKm?: number | null;
  transitDays?: string | null;
  highlights?: string[];
  isPanIndia?: boolean;
  featured?: boolean;
  content?: string | null;
  isActive: boolean;
  order: number;
  focusKeyword?: string | null;
  secondaryKeywords?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  faqItems?: FaqItem[] | null;
  seoHealth?: SeoHealth;
  createdAt: string;
  updatedAt: string;
};

export type PageSeoItem = {
  id: string;
  pagePath: string;
  pageName: string;
  focusKeyword?: string | null;
  secondaryKeywords?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  faqItems?: FaqItem[] | null;
  seoHealth?: SeoHealth;
  createdAt: string;
  updatedAt: string;
};

