"use client";

import Image from "next/image";
import { forwardRef, useRef } from "react";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { assets } from "@/lib/assets";
import { services as serviceContent } from "@/lib/services-content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const services = serviceContent.map((service) => ({
  index: service.index,
  title: service.title,
  description: service.shortDescription,
  image: service.image,
  alt: service.alt,
}));

function getStickyTopPx() {
  const styles = getComputedStyle(document.documentElement);
  const remPx = parseFloat(styles.fontSize) || 16;
  const headerRem = parseFloat(styles.getPropertyValue("--site-header-height")) || 0;
  return headerRem * remPx + 1.5 * remPx;
}

const ServiceCard = forwardRef<
  HTMLElement,
  { service: (typeof services)[number]; className?: string }
>(function ServiceCard({ service, className }, ref) {
  return (
    <article
      ref={ref}
      className={cn(
        "relative w-full origin-top overflow-hidden rounded-badge will-change-transform",
        className,
      )}
    >
      <Image
        src={service.image}
        alt={service.alt}
        fill
        sizes="(min-width: 64rem) 90rem, 100vw"
        quality={90}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 from-5% via-transparent to-black/35" aria-hidden="true" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-body-lg font-semibold tracking-[-0.0375rem]">
            / {service.index}
          </p>
          <p className="inline-flex items-center gap-2 text-body-sm">
            <span
              className="size-2 rounded-full bg-primary"
              aria-hidden="true"
            />
            {service.title}
          </p>
        </div>
        <p className="ml-auto max-w-[25.2rem] text-body opacity-86">
          {service.description}
        </p>
      </div>
    </article>
  );
});

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const faceRefs = useRef<(HTMLElement | null)[]>([]);

  useGSAP(
    () => {
      const slots = slotRefs.current.filter(Boolean) as HTMLDivElement[];
      const faces = faceRefs.current.filter(Boolean) as HTMLElement[];
      if (!slots.length || slots.length !== faces.length) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(faces, { clearProps: "all" });
        return;
      }

      const stickyTop = () => getStickyTopPx();

      slots.forEach((slot, index) => {
        const face = faces[index];

        gsap.set(face, {
          scale: 1,
          opacity: 1,
          filter: "brightness(1) blur(0px)",
          transformOrigin: "50% 0%",
          zIndex: index + 1,
        });

        ScrollTrigger.create({
          trigger: slot,
          start: () => `top top+=${stickyTop()}`,
          end: () => `bottom top+=${stickyTop()}`,
          pin: face,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            gsap.set(face, { zIndex: index + 1 });
          },
        });

        if (index >= slots.length - 1) {
          return;
        }

        const nextSlot = slots[index + 1];

        gsap.to(face, {
          scale: 0.92,
          opacity: 0,
          filter: "brightness(0.7) blur(10px)",
          ease: "none",
          scrollTrigger: {
            trigger: nextSlot,
            start: "top bottom",
            end: () => `top ${stickyTop()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-foreground py-section text-white"
    >
      <Container>
        <div className="mx-auto flex max-w-[41.76rem] flex-col items-center gap-5 text-center">
          <Badge>Service Provided</Badge>
          <TextReveal as="h2" className="text-h1 text-white">
            Transportation That Fits Your Journey
          </TextReveal>
        </div>

        <div className="relative mt-[6.25rem]">
          {services.map((service, index) => {
            const isLast = index === services.length - 1;

            return (
              <div
                key={service.index}
                ref={(el) => {
                  slotRefs.current[index] = el;
                }}
                className="relative"
                style={{
                  height: isLast
                    ? "var(--service-panel-height)"
                    : "var(--service-stack-slot)",
                  zIndex: index + 1,
                }}
              >
                <ServiceCard
                  ref={(el) => {
                    faceRefs.current[index] = el;
                  }}
                  service={service}
                  className="h-service-panel"
                />
              </div>
            );
          })}

          <div className="h-[70vh] md:h-[75vh]" aria-hidden />
        </div>
      </Container>
    </section>
  );
}
