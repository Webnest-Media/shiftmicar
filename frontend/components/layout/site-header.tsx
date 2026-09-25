"use client";

import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { MenuToggle } from "@/components/layout/menu-toggle";
import { SiteMenu } from "@/components/layout/site-menu";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 80;

export function SiteHeader() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setVisible(true);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((current) => {
      if (current) {
        setVisible(true);
      }
      return !current;
    });
  }, []);

  useEffect(() => {
    const instance = lenis;
    if (!instance) {
      return;
    }

    const onScroll = ({
      scroll,
      direction,
    }: {
      scroll: number;
      direction: number;
    }) => {
      setScrolled(scroll > SCROLL_THRESHOLD);

      if (menuOpen) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setVisible(true);
        return;
      }

      if (scroll <= SCROLL_THRESHOLD) {
        setVisible(true);
        return;
      }

      if (direction === 1) {
        setVisible(false);
        return;
      }

      if (direction === -1) {
        setVisible(true);
      }
    };

    instance.on("scroll", onScroll);

    return () => {
      instance.off("scroll", onScroll);
    };
  }, [lenis, menuOpen]);

  useEffect(() => {
    const instance = lenis;
    if (!instance) {
      return;
    }

    if (menuOpen) {
      instance.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      instance.start();
      document.documentElement.style.overflow = "";
    }

    return () => {
      instance.start();
      document.documentElement.style.overflow = "";
    };
  }, [lenis, menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 transition-transform duration-300 ease-out motion-reduce:transition-none",
          menuOpen ? "z-[60]" : "z-(--z-sticky)",
          scrolled ? "bg-background/90 backdrop-blur-sm" : "bg-transparent",
          visible || menuOpen ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <Container className="flex h-(--site-header-height) items-center justify-between">
          <Link
            href="/"
            scroll={false}
            className="relative h-[1.94625rem] w-[14.0625rem]"
          >
            <span className="sr-only">Shift My Car home</span>
            <Image
              src={assets.logoDark}
              alt=""
              fill
              priority
              className="object-contain object-left"
            />
          </Link>
          <button
            type="button"
            className="flex size-9 items-center justify-center"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={toggleMenu}
          >
            <MenuToggle open={menuOpen} />
          </button>
        </Container>
      </header>
      <SiteMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
