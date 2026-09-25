import { ImageReveal } from "@/components/animations/image-reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { WhyCard } from "@/app/(pages)/home/components/why-card";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import type { ServiceDetail } from "@/lib/services-content";

type ServiceDetailContentProps = {
  service: ServiceDetail;
};

export function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  return (
    <section className="bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem]">
        <ImageReveal
          src={service.image}
          alt={service.alt}
          sizes="(min-width: 64rem) 90rem, 100vw"
          className="h-[28.75rem] w-full rounded-badge"
        />

        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="flex max-w-[33.88rem] flex-col items-start gap-5">
            <Badge>Overview</Badge>
            <TextReveal as="h2" className="text-h1">
              How this service works
            </TextReveal>
          </div>

          <div className="flex max-w-[28rem] flex-col gap-6">
            {service.overview.map((paragraph, index) => (
              <TextReveal
                key={paragraph}
                as="p"
                className="text-body opacity-82"
                delay={index * 0.08}
              >
                {paragraph}
              </TextReveal>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[6.25rem]">
          <div className="mx-auto flex max-w-[52.2rem] flex-col items-center gap-6 text-center">
            <Badge>Benefits</Badge>
            <TextReveal as="h2" className="text-h1">
              What you can expect
            </TextReveal>
          </div>
          <div
            className="scrollbar-none -mx-[var(--grid-margin)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--grid-margin)] pb-2 md:hidden"
            data-lenis-prevent-horizontal
          >
            {service.features.map((feature) => (
              <div
                key={feature.number}
                className="w-[18.75rem] shrink-0 snap-start"
              >
                <WhyCard
                  number={feature.number}
                  title={feature.title}
                  description={feature.description}
                  className="h-[22rem]"
                />
              </div>
            ))}
          </div>
          <Grid className="max-md:hidden">
            {service.features.map((feature) => (
              <GridItem key={feature.number} span={8} spanMd={2}>
                <WhyCard
                  number={feature.number}
                  title={feature.title}
                  description={feature.description}
                />
              </GridItem>
            ))}
          </Grid>
        </div>
      </Container>
    </section>
  );
}
