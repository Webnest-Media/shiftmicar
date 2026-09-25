import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import type { ServiceDetail } from "@/lib/services-content";

type ServiceDetailHeroProps = {
  service: ServiceDetail;
};

export function ServiceDetailHero({ service }: ServiceDetailHeroProps) {
  return (
    <section className="border-b border-border-muted bg-background">
      <Container className="flex min-h-[31.125rem] flex-col justify-center pb-6 pt-[calc(var(--site-header-height)+5.625rem)]">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">
          <h1 className="text-h1">
            <TextReveal as="span" immediate>
              {service.title}
            </TextReveal>{" "}
            <span className="align-top text-label font-medium">
              /{service.index}
            </span>
          </h1>

          <TextReveal
            as="p"
            className="text-body max-w-[34.56rem] opacity-82 md:text-right"
            delay={0.1}
          >
            {service.shortDescription}
          </TextReveal>
        </div>
      </Container>
    </section>
  );
}
