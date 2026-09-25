import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { routeProcessSteps } from "@/lib/routes-content";

export function RouteProcess() {
  return (
    <section className="bg-testimonial-section py-section">
      <Container className="flex flex-col gap-[6.25rem] max-md:gap-12">
        <div className="mx-auto flex max-w-[52.2rem] flex-col items-center gap-6 text-center">
          <Badge className="bg-background">How It Works</Badge>
          <TextReveal as="h2" className="text-h1">
            Your journey, step by step
          </TextReveal>
        </div>

        <div
          className="scrollbar-none -mx-[var(--grid-margin)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--grid-margin)] pb-2 md:hidden"
          data-lenis-prevent-horizontal
        >
          {routeProcessSteps.map((step) => (
            <div
              key={step.number}
              className="w-[18.75rem] shrink-0 snap-start"
            >
              <div className="flex h-[18rem] flex-col gap-4 rounded-badge border border-border-muted/60 bg-background p-5">
                <p className="text-label font-semibold text-primary">
                  {step.number}
                </p>
                <h3 className="text-h3">{step.title}</h3>
                <p className="text-body opacity-82">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Grid className="max-md:hidden">
          {routeProcessSteps.map((step, index) => (
            <GridItem key={step.number} span={8} spanMd={2}>
              <div className="flex h-full flex-col gap-4 rounded-badge border border-border-muted/60 bg-background p-5">
                <p className="text-label font-semibold text-primary">
                  {step.number}
                </p>
                <TextReveal as="h3" className="text-h3" delay={index * 0.05}>
                  {step.title}
                </TextReveal>
                <TextReveal
                  as="p"
                  className="text-body opacity-82"
                  delay={0.08 + index * 0.05}
                >
                  {step.description}
                </TextReveal>
              </div>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
