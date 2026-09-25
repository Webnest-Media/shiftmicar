import { TextReveal } from "@/components/animations/text-reveal";
import { ServicePageCard } from "@/app/(pages)/services/components/service-page-card";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { pageServices } from "@/lib/services-content";
import { servicesCopy } from "@/lib/about-content";

export function ServicesGrid() {
  return (
    <section className="bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem]">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="flex max-w-[33.88rem] flex-col items-start gap-5">
            <Badge>Services</Badge>
            <TextReveal as="h2" className="text-h1">
              {servicesCopy.headline.line1}
            </TextReveal>
            <TextReveal as="h2" className="text-h1" delay={0.06}>
              {servicesCopy.headline.line2}
            </TextReveal>
          </div>

          <TextReveal
            as="p"
            className="text-body max-w-[28rem] opacity-82"
            delay={0.1}
          >
            {servicesCopy.description}
          </TextReveal>
        </div>

        <Grid columns={12} className="gap-4">
          {pageServices.map((service, index) => (
            <GridItem key={service.title} span={12} spanMd={6}>
              <ServicePageCard
                {...service}
                delay={index * 0.08}
              />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
