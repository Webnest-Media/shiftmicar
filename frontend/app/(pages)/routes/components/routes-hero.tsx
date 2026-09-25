import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { routesCopy } from "@/lib/about-content";

export function RoutesHero() {
  return (
    <section className="border-b border-border-muted bg-background">
      <Container className="flex min-h-[31.125rem] flex-col justify-center pb-6 pt-[calc(var(--site-header-height)+5.625rem)]">
        <div className="flex max-w-[48rem] flex-col items-start gap-5">
          <Badge>Car Transportation Routes</Badge>
          <h1 className="text-h1">
            <TextReveal as="span" immediate className="block">
              {routesCopy.headline.line1}
            </TextReveal>
            <TextReveal as="span" immediate className="block" delay={0.06}>
              {routesCopy.headline.line2}
            </TextReveal>
          </h1>
          <TextReveal
            as="p"
            className="text-body max-w-[36rem] opacity-82"
            delay={0.1}
          >
            {routesCopy.intro}
          </TextReveal>
        </div>
      </Container>
    </section>
  );
}
