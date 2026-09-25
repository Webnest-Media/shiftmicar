"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LinkReveal } from "@/components/animations/link-reveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, isNavLinkActive } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Routes", href: "/routes" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
] as const;

type SiteMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function SiteMenu({ open, onClose }: SiteMenuProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) {
      return;
    }

    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) {
      return;
    }

    gsap.set(panel, { xPercent: 100 });
    gsap.set(backdrop, { autoAlpha: 0 });
  }, [mounted]);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      if (!mounted || !panel || !backdrop) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(panel, { xPercent: open ? 0 : 100 });
        gsap.set(backdrop, { autoAlpha: open ? 1 : 0 });
        return;
      }

      if (!open && !hasOpenedRef.current) {
        gsap.set(panel, { xPercent: 100 });
        gsap.set(backdrop, { autoAlpha: 0 });
        return;
      }

      if (open) {
        hasOpenedRef.current = true;
        gsap.set(panel, { xPercent: 100 });
        gsap.set(backdrop, { autoAlpha: 0 });
        gsap
          .timeline()
          .to(backdrop, { autoAlpha: 1, duration: 0.35, ease: "power2.out" }, 0)
          .to(panel, { xPercent: 0, duration: 0.55, ease: "power3.inOut" }, 0);
      } else {
        gsap
          .timeline()
          .to(panel, { xPercent: 100, duration: 0.45, ease: "power3.inOut" }, 0)
          .to(
            backdrop,
            { autoAlpha: 0, duration: 0.3, ease: "power2.in" },
            0.1,
          );
      }
    },
    { scope: rootRef, dependencies: [open, mounted] },
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      ref={rootRef}
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        ref={panelRef}
        id="site-menu"
        aria-label="Primary"
        className="absolute top-0 right-0 flex h-full w-[25vw] min-w-56 flex-col bg-background px-8 py-8 pt-(--site-header-height) shadow-[0_0_3rem_rgba(0,0,0,0.12)]"
      >
        <ul className="flex flex-col gap-8">
          {navLinks.map((link) => {
            const isActive = isNavLinkActive(pathname, link.href);

            return (
              <li key={link.label}>
                <LinkReveal
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "text-h3 text-foreground transition-opacity duration-300",
                    isActive
                      ? "opacity-100 font-medium"
                      : "opacity-40 hover:opacity-100",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </LinkReveal>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>,
    document.body,
  );
}
