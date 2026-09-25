"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { assets } from "@/lib/assets";
import { processCopy } from "@/lib/about-content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "1",
    title: "Book",
    description: "Tell us where your car is and where it needs to go.",
    image: assets.processSteps[0],
    alt: "Customer booking car transportation online on smartphone with vehicle parked in driveway",
  },
  {
    number: "2",
    title: "Pickup",
    description: "Our team collects your vehicle from the agreed location.",
    image: assets.processSteps[1],
    alt: "Car owner handing over car keys to vehicle logistics driver for transport pickup",
  },
  {
    number: "3",
    title: "Transport",
    description:
      "Your car is securely loaded and transported toward its destination.",
    image: assets.processSteps[2],
    alt: "Specialized multi-tier car carrier transporter truck hauling vehicles on the highway",
  },
  {
    number: "4",
    title: "Deliver",
    description:
      "Choose standard delivery or let us take your car directly to your doorstep.",
    image: assets.processSteps[3],
    alt: "Auto delivery driver handing over car keys to happy owner in front of delivered car",
  },
] as const;

function getScrollDistance() {
  return Math.round(window.innerHeight * 0.55);
}

function getHeaderOffset() {
  const styles = getComputedStyle(document.documentElement);
  const remPx = parseFloat(styles.fontSize) || 16;
  const headerRem = parseFloat(styles.getPropertyValue("--site-header-height")) || 0;
  return headerRem * remPx;
}

function getPinStart() {
  return `top top+=${getHeaderOffset()}`;
}

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const pin = pinRef.current;
      const fill = fillRef.current;
      const track = trackRef.current;
      if (!pin || !fill || !track) {
        return;
      }

      const mm = gsap.matchMedia();

      const setStep = (progress: number) => {
        const index = Math.min(
          steps.length - 1,
          Math.max(0, Math.floor(progress * steps.length)),
        );
        setActiveIndex(index);
        gsap.set(fill, { height: `${progress * 100}%` });
      };

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(fill, { height: "100%" });
        setActiveIndex(0);
      });

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 48rem)",
        () => {
          const trigger = ScrollTrigger.create({
            trigger: pin,
            start: getPinStart,
            end: () => `+=${getScrollDistance() * (steps.length - 1)}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.35,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => setStep(self.progress),
          });

          setStep(0);

          return () => trigger.kill();
        },
      );

      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 47.9375rem)",
        () => {
          const trigger = ScrollTrigger.create({
            trigger: pin,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.35,
            invalidateOnRefresh: true,
            onUpdate: (self) => setStep(self.progress),
          });

          setStep(0);

          return () => trigger.kill();
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section ref={sectionRef} id="process" className="bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem]">
        <Grid className="items-end">
          <GridItem span={8} spanMd={5}>
            <Badge>Efficient Process</Badge>
            <TextReveal as="h2" className="text-h1 mt-5">
              HOW IT WORKS
            </TextReveal>
          </GridItem>
          <GridItem span={8} spanMd={3}>
            <TextReveal as="p" className="text-body opacity-82" delay={0.1}>
              {processCopy.subtitle}
            </TextReveal>
          </GridItem>
        </Grid>

        <div
          ref={pinRef}
          className="md:flex md:min-h-[calc(100dvh-var(--site-header-height))] md:items-center"
        >
          <Grid className="w-full items-center">
            <GridItem span={8} spanMd={4}>
              <div className="relative">
                <div
                  ref={trackRef}
                  className="absolute top-[1.5625rem] bottom-[1.5625rem] left-[1.5625rem] z-0 w-1 -translate-x-1/2 bg-accent"
                  aria-hidden="true"
                >
                  <div
                    ref={fillRef}
                    className="h-0 w-full origin-top bg-primary"
                  />
                </div>
                <ol className="relative flex flex-col gap-10">
                  {steps.map((step, index) => {
                    const isActive = index === activeIndex;
                    const isComplete = index < activeIndex;

                    return (
                      <li key={step.number} className="flex gap-8">
                        <span
                          className={cn(
                            "relative z-10 flex size-[3.125rem] shrink-0 items-center justify-center text-body-lg text-white rounded-badge transition-colors duration-300",
                            isActive || isComplete
                              ? "bg-primary"
                              : "bg-primary-step",
                          )}
                        >
                          {step.number}
                        </span>
                        <div
                          className={cn(
                            "transition-opacity duration-300",
                            isActive ? "opacity-100" : "opacity-60",
                          )}
                        >
                          <h3 className="text-process-step">{step.title}</h3>
                          <p className="text-body mt-1 opacity-82">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </GridItem>

            <GridItem span={8} spanMd={4}>
              <div className="relative h-[33.6175rem] w-full overflow-hidden rounded-badge">
                {steps.map((step, index) => (
                  <Image
                    key={step.number}
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(min-width: 64rem) 42.875rem, 100vw"
                    unoptimized
                    className={cn(
                      "object-cover transition-opacity duration-500",
                      index === activeIndex ? "opacity-100" : "opacity-0",
                    )}
                    priority={index === 0}
                  />
                ))}
              </div>
            </GridItem>
          </Grid>
        </div>
      </Container>
    </section>
  );
}
