"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Award,
  FilePlus2,
  FileText,
  FolderOpen,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Navigation,
  Settings,
  Tags,
  Truck,
  X,
} from "lucide-react";
import { api, setToken } from "@/lib/api";
import type { ApiUser } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/admin/services", label: "Services", icon: Truck, group: "Services & Routes" },
  { href: "/admin/routes", label: "Routes", icon: Navigation, group: "Services & Routes" },
  { href: "/admin/partners", label: "Brand Logos", icon: Award, group: "Services & Routes" },
  { href: "/admin/seo", label: "Page SEO", icon: Globe, group: "SEO & Growth" },
  { href: "/admin/blogs", label: "Blogs", icon: FileText, group: "Writing" },
  { href: "/admin/blogs/new", label: "Add blog", icon: FilePlus2, group: "Writing" },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, group: "Writing" },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen, group: "Library" },
  { href: "/admin/tags", label: "Tags", icon: Tags, group: "Library" },
  { href: "/admin/media", label: "Media", icon: ImageIcon, group: "Library" },
  { href: "/admin/settings", label: "Settings", icon: Settings, group: "System" },
] as const;

function isActive(href: string, pathname: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/partners") return pathname === "/admin/partners" || pathname.startsWith("/admin/partners/");
  if (href === "/admin/blogs/new") return pathname === "/admin/blogs/new";
  if (href === "/admin/services/new") return pathname === "/admin/services/new";
  if (href === "/admin/routes/new") return pathname === "/admin/routes/new";
  if (href === "/admin/blogs") {
    if (pathname === "/admin/blogs/new") return false;
    return pathname === "/admin/blogs" || pathname.startsWith("/admin/blogs/");
  }
  if (href === "/admin/services") {
    if (pathname === "/admin/services/new") return false;
    return pathname === "/admin/services" || pathname.startsWith("/admin/services/");
  }
  if (href === "/admin/routes") {
    if (pathname === "/admin/routes/new") return false;
    return pathname === "/admin/routes" || pathname.startsWith("/admin/routes/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function pageCopy(pathname: string) {
  if (pathname === "/admin") {
    return { title: "Dashboard", meta: "Overview of drafts and published posts" };
  }
  if (pathname === "/admin/services/new") {
    return { title: "Add Service", meta: "Create a new service with features and detailed SEO" };
  }
  if (pathname.startsWith("/admin/services") && pathname.includes("/edit")) {
    return { title: "Edit Service", meta: "Update service details, highlights, and SEO tags" };
  }
  if (pathname.startsWith("/admin/services")) {
    return { title: "Services", meta: "Manage vehicle relocation services & feature highlights" };
  }
  if (pathname === "/admin/routes/new") {
    return { title: "Add Route", meta: "Create a new intercity relocation corridor and SEO" };
  }
  if (pathname.startsWith("/admin/routes") && pathname.includes("/edit")) {
    return { title: "Edit Route", meta: "Update intercity route details, GPS, and SEO tags" };
  }
  if (pathname.startsWith("/admin/routes")) {
    return { title: "Routes", meta: "Manage intercity relocation corridors & GPS maps" };
  }
  if (pathname.startsWith("/admin/partners")) {
    return { title: "Brand Logos", meta: "Manage automotive brands and partner logos displayed on the homepage marquee" };
  }
  if (pathname.startsWith("/admin/seo")) {
    return { title: "Page SEO Studio", meta: "Sitewide search engine & social metadata optimization" };
  }
  if (pathname === "/admin/blogs/new") {
    return { title: "Add blog", meta: "Write the article, then set publish details on the right." };
  }
  if (pathname.includes("/edit")) {
    return { title: "Edit blog", meta: "Write on the left. Setup stays on the right." };
  }
  if (pathname.includes("/preview")) {
    return { title: "Preview", meta: "This is a private preview, not the live page" };
  }
  if (pathname.startsWith("/admin/blogs")) {
    return { title: "Blogs", meta: "Find a post, or add a new one" };
  }
  if (pathname.startsWith("/admin/testimonials")) {
    return { title: "Testimonials", meta: "Manage customer reviews displayed on the home page" };
  }
  if (pathname.startsWith("/admin/categories")) {
    return { title: "Categories", meta: "Topics used on blog posts" };
  }
  if (pathname.startsWith("/admin/tags")) {
    return { title: "Tags", meta: "Labels for related posts" };
  }
  if (pathname.startsWith("/admin/media")) {
    return { title: "Media", meta: "Images for covers and articles" };
  }
  if (pathname.startsWith("/admin/settings")) {
    return { title: "Settings", meta: "Your author profile" };
  }
  return { title: "CMS", meta: "Shift My Car content studio" };
}


export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const isLogin = pathname === "/admin/login";
  const copy = pageCopy(pathname);
  const showAddBlog = !pathname.startsWith("/admin/blogs/new") && !pathname.includes("/edit");

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  useEffect(() => {
    if (isLogin) {
      setLoading(false);
      return;
    }

    api
      .me()
      .then(setUser)
      .catch(() => {
        setToken(null);
        router.replace("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [isLogin, router]);

  useEffect(() => {
    if (!navOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setNavOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const groups = [
    { label: "Overview", items: nav.filter((item) => item.group === "Overview") },
    { label: "Services & Routes", items: nav.filter((item) => item.group === "Services & Routes") },
    { label: "SEO & Growth", items: nav.filter((item) => item.group === "SEO & Growth") },
    { label: "Writing", items: nav.filter((item) => item.group === "Writing") },
    { label: "Library", items: nav.filter((item) => item.group === "Library") },
    { label: "System", items: nav.filter((item) => item.group === "System") },
  ];

  const initials = (user?.name || "A")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (isLogin) {
    return <div className="cms">{children}</div>;
  }

  if (loading) {
    return (
      <div className="cms">
        <div className="cms-loading">Loading CMS…</div>
      </div>
    );
  }

  return (
    <div className="cms">
      <div className={cn("cms-shell", navOpen && "nav-open")}>
        <button
          type="button"
          className="cms-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
        />

        <aside className="cms-sidebar">
          <div className="cms-brand">
            <div className="cms-brand-mark">SM</div>
            <div className="cms-brand-copy">
              <strong>Shift My Car</strong>
              <span>CMS</span>
            </div>
            <button
              type="button"
              className="cms-sidebar-close"
              aria-label="Close menu"
              onClick={() => setNavOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="cms-nav" aria-label="CMS">
            {groups.map((group) => (
              <div key={group.label} className="cms-nav-group">
                <p className="cms-nav-label">{group.label}</p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn("cms-nav-link", isActive(item.href, pathname) && "is-active")}
                    >
                      <Icon />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="cms-sidebar-footer">
            <div className="cms-user">
              <div className="cms-avatar">{initials}</div>
              <div className="cms-user-copy">
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>
            </div>
            <button
              type="button"
              className="cms-logout"
              onClick={async () => {
                try {
                  await api.logout();
                } catch {
                  // ignore
                }
                setToken(null);
                router.replace("/admin/login");
              }}
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </aside>

        <div className="cms-main">
          <header className="cms-topbar">
            <div className="cms-topbar-left">
              <button
                type="button"
                className="cms-menu-btn"
                aria-label="Open menu"
                onClick={() => setNavOpen(true)}
              >
                <Menu size={18} />
              </button>
              <div>
                <div className="cms-topbar-title">{copy.title}</div>
                <div className="cms-topbar-meta">{copy.meta}</div>
              </div>
            </div>
            {showAddBlog ? (
              <Link href="/admin/blogs/new" className="cms-btn cms-btn-primary cms-topbar-add">
                <FilePlus2 size={16} />
                Add blog
              </Link>
            ) : null}
          </header>
          <main className="cms-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
