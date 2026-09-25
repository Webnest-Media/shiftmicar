"use client";

import { useRef } from "react";
import { AnimatedVehicleIcon } from "@/components/ui/animated-vehicle-icon";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type WhyCardProps = {
  number: string;
  title: string;
  description: string;
  className?: string;
};

export function WhyCard({ number, title, description, className }: WhyCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const animateHover = (hovered: boolean) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const card = cardRef.current;
    const body = bodyRef.current;
    if (!card || !body) {
      return;
    }

    gsap.to(card, {
      y: hovered ? -10 : 0,
      duration: 0.45,
      ease: "power3.out",
    });
    gsap.to(body, {
      y: hovered ? -4 : 0,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => animateHover(true)}
      onMouseLeave={() => animateHover(false)}
      onFocus={() => animateHover(true)}
      onBlur={() => animateHover(false)}
      tabIndex={0}
      className={cn(
        "group flex h-(--why-card-height) flex-col justify-between",
        "rounded-badge border border-border-muted p-5",
        "transition-colors duration-300",
        "hover:border-foreground/20 hover:bg-accent/50",
        "focus-visible:border-foreground/20 focus-visible:bg-accent/50 focus-visible:outline-none",
        className,
      )}
    >
      <p className="text-label font-semibold opacity-90 transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary">
        {number}
      </p>

      {/* Centered animating vehicle icon */}
      <div className="my-auto flex items-center py-2">
        <AnimatedVehicleIcon hint={title} number={number} />
      </div>

      <div ref={bodyRef}>
        <h3 className="text-h3 tracking-[-0.05rem]">{title}</h3>
        <p className="text-body mt-4 opacity-82 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          {description}
        </p>
      </div>
    </article>
  );
}
