"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "@/components/animations/image-reveal";
import { assets } from "@/lib/assets";
import {
  blogCoverAlt,
  blogCoverSrc,
  formatDate,
  isOptimizableBlogImage,
} from "@/lib/blog-utils";
import type { BlogPost } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

type BlogCoverCardProps = {
  blog: BlogPost;
  variant?: "featured" | "grid";
  delay?: number;
  priority?: boolean;
};

export function BlogCoverCard({
  blog,
  variant = "grid",
  delay = 0,
  priority = false,
}: BlogCoverCardProps) {
  const featured = variant === "featured";
  const src = blogCoverSrc(blog.featuredImage);
  const alt = blogCoverAlt(blog.title, blog.featuredImageAlt, blog.featuredImage);

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      scroll={false}
      className={cn(
        "group relative block overflow-hidden rounded-badge focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        featured
          ? "h-[28rem] md:h-[36.5rem]"
          : "h-[22rem] md:h-[28.75rem]",
      )}
    >
      <ImageReveal
        src={src}
        alt={alt}
        sizes={
          featured
            ? "(min-width: 64rem) 90rem, 100vw"
            : "(min-width: 64rem) 28rem, 100vw"
        }
        delay={delay}
        priority={priority}
        unoptimized={!isOptimizableBlogImage(src)}
        className="absolute inset-0 size-full"
        imageClassName="transition-transform duration-700 ease-out group-hover:scale-105"
        overlayClassName="bg-gradient-to-t from-foreground from-[18%] via-foreground/55 to-foreground/15"
      />
      <div
        className="absolute inset-0 bg-foreground/10 transition-colors duration-300 group-hover:bg-foreground/0"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-body-sm">
            <span
              className="size-2 shrink-0 rounded-full bg-primary"
              aria-hidden="true"
            />
            {blog.category?.name || "Journal"}
          </span>
          <span className="relative size-4 shrink-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
            <Image
              src={assets.icons.external}
              alt=""
              fill
              className="object-contain transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h3
            className={cn(
              "tracking-[-0.05rem]",
              featured ? "text-h2 max-w-[34rem]" : "text-h3",
            )}
          >
            {blog.title}
          </h3>
          {featured && blog.excerpt ? (
            <p className="text-body max-w-[34rem] text-white/82 line-clamp-3">
              {blog.excerpt}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-caption text-white/70">
              {blog.author.name} · {formatDate(blog.publishedAt)}
            </p>
            <span className="text-body-sm font-medium text-white transition-colors duration-300 group-hover:text-accent">
              Read article →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
