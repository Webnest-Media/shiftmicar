import { ButtonReveal } from "@/components/animations/button-reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { assets } from "@/lib/assets";
import { ctaCopy } from "@/lib/about-content";

export function CtaBanner() {
  return (
    <section className="relative h-(--cta-height) bg-surface text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 size-full object-cover"
        aria-hidden="true"
      >
        <source src={assets.ctaVideo} type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-gradient-to-t from-foreground from-10% via-foreground/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-foreground from-10% to-transparent"
        aria-hidden="true"
      />
      <Container className="relative flex h-full flex-col justify-between py-section">
        <div className="flex flex-col gap-1">
          <TextReveal as="h2" className="text-h1 text-white">
            Start Delivering
          </TextReveal>
          <TextReveal as="h2" className="text-h1 text-white" delay={0.1}>
            Your Cars
          </TextReveal>
          <TextReveal
            as="h2"
            className="text-h1 text-display-emphasis text-white"
            delay={0.2}
          >
            Effortlessly
          </TextReveal>
        </div>
        <Grid className="items-end">
          <GridItem span={8} spanMd={3} className="md:col-start-6">
            <TextReveal as="p" className="text-body opacity-80" delay={0.25}>
              {ctaCopy.subtitle}
            </TextReveal>
            <div className="mt-8">
              <ButtonReveal href="/contact" variant="primary">
                Start with Shift My Car
              </ButtonReveal>
            </div>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
