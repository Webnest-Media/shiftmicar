import Image from "next/image";
import Link from "next/link";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { assets } from "@/lib/assets";
import type { RouteDetail } from "@/lib/routes-content";
import { transportOptions } from "@/lib/routes-content";

type RouteInformationProps = {
  route: RouteDetail;
};

const routeHighlights = [
  "Professional vehicle handling throughout the journey",
  "Flexible transport options to suit your move",
  "Clear coordination from pickup through to delivery",
] as const;

export function RouteInformation({ route }: RouteInformationProps) {
  const heading = route.isPanIndia
    ? route.title
    : `${route.origin} to ${route.destination}`;

  const body = route.isPanIndia
    ? "Nationwide vehicle transportation connecting major cities and destinations across India — with service options designed for flexibility, reliability, and premium handling."
    : `A seamless transportation option for customers moving their vehicles between ${route.origin} and ${route.destination}.`;

  return (
    <section className="border-t border-border-muted bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem] max-md:gap-12">
        <Grid className="items-start gap-y-10">
          <GridItem span={8} spanMd={5}>
            <div className="flex flex-col items-start gap-5">
              <Badge>Route Information</Badge>
              <TextReveal as="h2" className="text-h1">
                {heading}
              </TextReveal>
              <TextReveal
                as="p"
                className="text-body opacity-82"
                delay={0.08}
              >
                {body}
              </TextReveal>
            </div>

            <ul className="mt-8 flex flex-col gap-4">
              {((route.highlights && route.highlights.length > 0) ? route.highlights : routeHighlights).map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-3">
                  <span
                    className="mt-[0.45rem] size-2 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <TextReveal
                    as="span"
                    className="text-body opacity-82"
                    delay={0.12 + index * 0.04}
                  >
                    {item}
                  </TextReveal>
                </li>
              ))}
            </ul>
          </GridItem>

          <GridItem span={8} spanMd={3} startMd={6}>
            <div className="rounded-badge border border-border-muted bg-testimonial-section p-6 md:p-8">
              <h3 className="text-h3">Available transportation options</h3>
              <ul className="mt-6 flex flex-col gap-3">
                {transportOptions.map((option) => (
                  <li key={option.href}>
                    <Link
                      href={option.href}
                      scroll={false}
                      className="group flex items-center justify-between gap-4 rounded-badge border border-border-muted/60 bg-background px-4 py-4 transition-colors duration-300 hover:border-foreground/20 hover:bg-accent/40"
                    >
                      <span className="text-body font-medium">{option.title}</span>
                      <span className="relative size-4 shrink-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
                        <Image
                          src={assets.icons.external}
                          alt=""
                          fill
                          className="object-contain transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-body-sm mt-6 opacity-72">
                Service availability may vary by route. Contact us to confirm the
                best option for your move.
              </p>
            </div>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
