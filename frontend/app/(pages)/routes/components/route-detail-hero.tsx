import Image from "next/image";
import { ImageReveal } from "@/components/animations/image-reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { ButtonReveal } from "@/components/animations/button-reveal";
import { LinkReveal } from "@/components/animations/link-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { assets } from "@/lib/assets";
import type { RouteDetail } from "@/lib/routes-content";

type RouteDetailHeroProps = {
  route: RouteDetail;
};

export function RouteDetailHero({ route }: RouteDetailHeroProps) {
  return (
    <section className="border-b border-border-muted bg-background">
      <Container className="flex flex-col gap-10 pb-6 pt-[calc(var(--site-header-height)+5.625rem)] max-md:gap-8">
        <Grid className="items-end gap-y-10">
          <GridItem span={8} spanMd={5}>
            <div className="flex flex-col items-start gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Car Transportation</Badge>
                <span className="text-label font-semibold text-primary">
                  / {route.number}
                </span>
              </div>
              <h1 className="text-h1">
                {route.isPanIndia ? (
                  <TextReveal as="span" immediate>
                    {route.title}
                  </TextReveal>
                ) : (
                  <>
                    <TextReveal as="span" immediate className="block">
                      {route.title}
                    </TextReveal>
                    <TextReveal
                      as="span"
                      immediate
                      className="block"
                      delay={0.06}
                    >
                      Car Transportation
                    </TextReveal>
                  </>
                )}
              </h1>
              <TextReveal
                as="p"
                className="text-body max-w-[28rem] opacity-82"
                delay={0.1}
              >
                {route.detailDescription}
              </TextReveal>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <ButtonReveal href="/contact" variant="primary">
                  Get a Quote
                </ButtonReveal>
                <LinkReveal
                  href="/routes"
                  className="text-body font-medium text-foreground"
                >
                  Explore Other Routes
                </LinkReveal>
              </div>
            </div>
          </GridItem>

          <GridItem span={8} spanMd={3} startMd={6}>
            <ImageReveal
              src={route.image}
              alt={route.alt}
              immediate
              sizes="(min-width: 64rem) 42rem, 100vw"
              className="h-[18rem] w-full rounded-badge md:h-[24rem]"
            />
          </GridItem>
        </Grid>

        {!route.isPanIndia ? (
          <div className="flex flex-col gap-4 rounded-badge border border-border-muted bg-testimonial-section p-5 md:flex-row md:items-center md:justify-between md:px-8 md:py-6">
            <div className="flex flex-col gap-1">
              <p className="text-caption uppercase tracking-[0.08em] text-muted">
                Origin
              </p>
              <p className="text-h3 tracking-[-0.05rem]">{route.origin}</p>
            </div>
            <div className="hidden items-center gap-3 md:flex" aria-hidden="true">
              <span className="h-px w-16 bg-border-muted" />
              <span className="relative size-4 shrink-0">
                <Image
                  src={assets.icons.external}
                  alt=""
                  fill
                  className="rotate-90 object-contain opacity-50"
                />
              </span>
              <span className="h-px w-16 bg-border-muted" />
            </div>
            <p className="text-body-lg text-primary md:hidden" aria-hidden="true">
              ↓
            </p>
            <div className="flex flex-col gap-1 md:text-right">
              <p className="text-caption uppercase tracking-[0.08em] text-muted">
                Destination
              </p>
              <p className="text-h3 tracking-[-0.05rem]">{route.destination}</p>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
