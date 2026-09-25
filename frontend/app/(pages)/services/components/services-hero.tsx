import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { servicesCopy } from "@/lib/about-content";

export function ServicesHero() {
  return (
    <section className="border-b border-border-muted bg-background">
      <Container className="flex min-h-[31.125rem] flex-col justify-center pb-6 pt-[calc(var(--site-header-height)+5.625rem)]">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">
          <h1 className="text-h1">
            <TextReveal as="span" immediate>
              Services
            </TextReveal>{" "}
            <span className="align-top text-label font-medium">[04]</span>
          </h1>

          <TextReveal
            as="p"
            className="text-body max-w-[34.56rem] opacity-82 md:text-right"
            delay={0.1}
          >
            {servicesCopy.intro}
          </TextReveal>
        </div>
      </Container>
    </section>
  );
}
