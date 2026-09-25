import { TextReveal } from "@/components/animations/text-reveal";
import { ServicePageCard } from "@/app/(pages)/services/components/service-page-card";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { getRelatedServices } from "@/lib/services-content";

type RelatedServicesProps = {
  currentSlug: string;
};

export function RelatedServices({ currentSlug }: RelatedServicesProps) {
  const related = getRelatedServices(currentSlug);

  return (
    <section className="border-t border-border-muted bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem]">
        <div className="flex flex-col items-start gap-5">
          <Badge>More Services</Badge>
          <TextReveal as="h2" className="text-h1">
            Explore other options
          </TextReveal>
        </div>

        <Grid columns={12} className="gap-4">
          {related.map((service, index) => (
            <GridItem key={service.slug} span={12} spanMd={4}>
              <ServicePageCard
                title={service.title}
                image={service.image}
                alt={service.alt}
                href={`/services/${service.slug}`}
                delay={index * 0.08}
              />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
