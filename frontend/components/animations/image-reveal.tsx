"use client";

import Image, { type ImageProps } from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ImageRevealProps = {
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
  alt: string;
  src: ImageProps["src"];
  sizes: string;
  priority?: boolean;
  unoptimized?: boolean;
  delay?: number;
  /** Play on mount instead of when scrolled into view. */
  immediate?: boolean;
  /** ScrollTrigger start position. */
  start?: string;
};

export function ImageReveal({
  className,
  imageClassName,
  overlayClassName,
  alt,
  src,
  sizes,
  priority = false,
  unoptimized = false,
  delay = 0,
  immediate = false,
  start = "top 88%",
}: ImageRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const media = mediaRef.current;
      if (!root || !media) {
        return;
      }

      let tween: gsap.core.Tween | null = null;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(media, { clipPath: "inset(0 0 0% 0)" });
        media.dataset.reveal = "ready";
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(media, { clipPath: "inset(0 0 100% 0)" });
        media.dataset.reveal = "pending";

        tween = gsap.to(media, {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.2,
          ease: "power3.inOut",
          delay,
          onStart: () => {
            media.dataset.reveal = "ready";
          },
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: root,
                  start,
                  once: true,
                  toggleActions: "play none none none",
                  invalidateOnRefresh: true,
                },
              }),
        });
      });

      return () => {
        tween?.kill();
        tween?.scrollTrigger?.kill();
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [delay, immediate, start] },
  );

  return (
    <div ref={rootRef} className={cn("relative overflow-hidden", className)}>
      <div
        ref={mediaRef}
        data-reveal="pending"
        className="relative size-full overflow-hidden [clip-path:inset(0_0_100%_0)]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={unoptimized}
          className={cn("object-cover", imageClassName)}
        />
        {overlayClassName ? (
          <div
            className={cn("absolute inset-0", overlayClassName)}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  );
}
