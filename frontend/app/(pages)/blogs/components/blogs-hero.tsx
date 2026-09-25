import { ButtonReveal } from "@/components/animations/button-reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

export function BlogsHero() {
  return (
    <section className="border-b border-border-muted bg-background">
      <Container className="flex min-h-[31.125rem] flex-col justify-center pb-6 pt-[calc(var(--site-header-height)+5.625rem)]">
        <div className="flex max-w-[48rem] flex-col items-start gap-5">
          <Badge>Insights</Badge>
          <h1 className="text-h1">
            <TextReveal as="span" immediate className="block">
              Insights on
            </TextReveal>
            <TextReveal as="span" immediate className="block" delay={0.06}>
              Moving Cars.
            </TextReveal>
          </h1>
          <TextReveal
            as="p"
            className="text-body max-w-[34rem] opacity-82"
            delay={0.1}
          >
            Practical guidance on premium car transportation, vehicle logistics,
            and delivery across India.
          </TextReveal>
          <div className="pt-2">
            <ButtonReveal href="/contact" variant="primary">
              Get a Quote
            </ButtonReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
