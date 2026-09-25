"use client";

import { useCallback, useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  children: string;
  delay?: number;
  /** Play on mount instead of when scrolled into view (use in hero). */
  immediate?: boolean;
  /** ScrollTrigger start position. Default reveals as the text enters the viewport. */
  start?: string;
};

async function loadElementFont(element: HTMLElement) {
  if (!("fonts" in document)) {
    return;
  }

  const style = getComputedStyle(element);
  const { fontStyle, fontWeight, fontSize, fontFamily } = style;
  const descriptor = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;

  try {
    await document.fonts.load(descriptor);
    if (fontStyle !== "italic") {
      await document.fonts.load(
        `italic ${fontWeight} ${fontSize} ${fontFamily}`,
      );
    }
    await document.fonts.ready;
  } catch {
    // Font loading is best-effort; animation still runs with fallbacks.
  }
}

export function TextReveal({
  as: Tag = "p",
  className,
  children,
  delay = 0,
  immediate = false,
  start = "top 88%",
}: TextRevealProps) {
  const rootRef = useRef<HTMLElement>(null);

  const setRootRef = useCallback((element: HTMLElement | null) => {
    rootRef.current = element;
    if (element && element.dataset.reveal !== "ready") {
      element.dataset.reveal = "pending";
      element.style.visibility = "hidden";
    }
  }, []);

  useGSAP(
    () => {
      const element = rootRef.current;
      if (!element) {
        return;
      }

      let split: SplitText | null = null;
      let tween: gsap.core.Tween | null = null;
      let cancelled = false;

      const markPending = () => {
        element.dataset.reveal = "pending";
        element.style.visibility = "hidden";
      };

      const markReady = () => {
        element.dataset.reveal = "ready";
        element.style.removeProperty("visibility");
      };

      const setup = async () => {
        if (cancelled) {
          return;
        }

        markPending();
        await loadElementFont(element);

        if (cancelled) {
          return;
        }

        split = SplitText.create(element, {
          type: "lines",
          mask: "lines",
          aria: "auto",
        });

        gsap.set(split.lines, { yPercent: 110 });

        tween = gsap.to(split.lines, {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          delay,
          onStart: () => {
            if (!cancelled) {
              markReady();
            }
          },
          ...(immediate
            ? {}
            : {
              scrollTrigger: {
                trigger: element,
                start,
                once: true,
                toggleActions: "play none none none",
                invalidateOnRefresh: true,
              },
            }),
        });
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        markReady();
        gsap.set(element, { autoAlpha: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        void setup();
      });

      return () => {
        cancelled = true;
        tween?.kill();
        tween?.scrollTrigger?.kill();

        if (split) {
          markPending();
          split.revert();
          split = null;
        }
      };
    },
    { scope: rootRef, dependencies: [children, delay, immediate, start] },
  );

  const sharedProps = {
    ref: setRootRef as never,
    className: cn("text-reveal", className),
    "data-reveal": "pending",
    children,
  };

  switch (Tag) {
    case "h1":
      return <h1 {...sharedProps} />;
    case "h2":
      return <h2 {...sharedProps} />;
    case "h3":
      return <h3 {...sharedProps} />;
    case "h4":
      return <h4 {...sharedProps} />;
    case "span":
      return <span {...sharedProps} />;
    default:
      return <p {...sharedProps} />;
  }
}
