"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const variants = {
  accent: "bg-accent text-foreground",
  surface: "bg-surface text-background",
  primary: "bg-primary text-white",
} as const;

type ButtonRevealProps = {
  children: string;
  href: string;
  className?: string;
  variant?: keyof typeof variants;
};

export function ButtonReveal({
  children,
  href,
  className,
  variant = "accent",
}: ButtonRevealProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const hoverLabelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const label = labelRef.current;
      const hoverLabel = hoverLabelRef.current;

      if (!root || !label || !hoverLabel) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(hoverLabel, { display: "none" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const splitOut = SplitText.create(label, {
          type: "chars",
          mask: "chars",
          aria: "auto",
        });
        const splitIn = SplitText.create(hoverLabel, {
          type: "chars",
          mask: "chars",
          aria: "hidden",
        });

        gsap.set(hoverLabel, { opacity: 1 });
        gsap.set(splitIn.chars, { yPercent: 110 });

        const animateIn = () => {
          gsap.killTweensOf([...splitOut.chars, ...splitIn.chars]);
          gsap
            .timeline()
            .to(
              splitOut.chars,
              {
                yPercent: -110,
                duration: 0.5,
                ease: "power3.inOut",
                stagger: { each: 0.025, from: "start" },
              },
              0,
            )
            .to(
              splitIn.chars,
              {
                yPercent: 0,
                duration: 0.5,
                ease: "power3.inOut",
                stagger: { each: 0.025, from: "start" },
              },
              0,
            );
        };

        const animateOut = () => {
          gsap.killTweensOf([...splitOut.chars, ...splitIn.chars]);
          gsap
            .timeline()
            .to(
              splitIn.chars,
              {
                yPercent: 110,
                duration: 0.45,
                ease: "power3.inOut",
                stagger: { each: 0.02, from: "end" },
              },
              0,
            )
            .to(
              splitOut.chars,
              {
                yPercent: 0,
                duration: 0.45,
                ease: "power3.inOut",
                stagger: { each: 0.02, from: "end" },
              },
              0,
            );
        };

        root.addEventListener("mouseenter", animateIn);
        root.addEventListener("mouseleave", animateOut);
        root.addEventListener("focus", animateIn);
        root.addEventListener("blur", animateOut);

        return () => {
          root.removeEventListener("mouseenter", animateIn);
          root.removeEventListener("mouseleave", animateOut);
          root.removeEventListener("focus", animateIn);
          root.removeEventListener("blur", animateOut);
          splitOut.revert();
          splitIn.revert();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [children] },
  );

  return (
    <Link
      ref={rootRef}
      href={href}
      scroll={false}
      className={cn(
        "inline-flex items-center px-4 py-2 text-button rounded-badge",
        variants[variant],
        className,
      )}
    >
      <span className="relative inline-block overflow-hidden leading-[var(--button-label-line-height)]">
        <span ref={labelRef} className="inline-block whitespace-nowrap">
          {children}
        </span>
        <span
          ref={hoverLabelRef}
          className="absolute inset-x-0 top-0 inline-block whitespace-nowrap opacity-0"
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    </Link>
  );
}
