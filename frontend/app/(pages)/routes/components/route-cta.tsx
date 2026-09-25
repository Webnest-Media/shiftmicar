import { TextReveal } from "@/components/animations/text-reveal";
import { ButtonReveal } from "@/components/animations/button-reveal";
import { LinkReveal } from "@/components/animations/link-reveal";
import { Container } from "@/components/layout/container";
import type { RouteDetail } from "@/lib/routes-content";

type RouteCtaProps = {
  route?: RouteDetail;
};

export function RouteCta({ route }: RouteCtaProps) {
  return (
    <section className="border-t border-border-muted bg-foreground py-section text-white">
      <Container className="flex flex-col items-start gap-8 md:max-w-[48rem]">
        <TextReveal as="h2" className="text-h1 text-white">
          Ready to Move Your Car?
        </TextReveal>
        <TextReveal as="p" className="text-body text-white/82" delay={0.08}>
          {route && !route.isPanIndia
            ? `Choose your preferred transportation option for ${route.origin} to ${route.destination} and let us handle the journey.`
            : "Choose your preferred transportation option and let us handle the journey."}
        </TextReveal>
        <div className="flex flex-wrap items-center gap-4">
          <ButtonReveal href="/contact" variant="primary">
            Get a Quote
          </ButtonReveal>
          <LinkReveal href="/routes" className="text-body font-medium text-white">
            View All Routes
          </LinkReveal>
        </div>
      </Container>
    </section>
  );
}
