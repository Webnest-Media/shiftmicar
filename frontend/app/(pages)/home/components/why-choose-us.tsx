import { TextReveal } from "@/components/animations/text-reveal";
import { WhyCard } from "./why-card";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { whyUsCopy } from "@/lib/about-content";

const reasons = [
  {
    number: "01.",
    title: "Professional Handling",
    description:
      "Your vehicle is handled with care throughout every stage of its journey.",
  },
  {
    number: "02.",
    title: "Flexible Options",
    description:
      "Choose the transportation service that fits your needs and timeline.",
  },
  {
    number: "03.",
    title: "Seamless Delivery",
    description:
      "From pickup to final delivery, we coordinate the entire process.",
  },
  {
    number: "04.",
    title: "Clear Communication",
    description:
      "Stay informed throughout your vehicle's journey with reliable updates.",
  },
] as const;

export function WhyChooseUs() {
  return (
    <section className="bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem]">
        <div className="mx-auto flex max-w-[52.2rem] flex-col items-center gap-6 text-center">
          <Badge>Why Us</Badge>
          <h2 className="text-h1">
            <TextReveal as="span" className="block">
              {whyUsCopy.headline.line1}
            </TextReveal>
            <TextReveal as="span" className="block" delay={0.06}>
              {whyUsCopy.headline.line2}
            </TextReveal>
          </h2>
          <TextReveal as="p" className="text-body opacity-82 max-w-[42.2rem]" delay={0.1}>
            {whyUsCopy.subtitle}
          </TextReveal>
        </div>
        <div
          className="scrollbar-none -mx-[var(--grid-margin)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--grid-margin)] pb-2 md:hidden"
          data-lenis-prevent-horizontal
        >
          {reasons.map((reason) => (
            <div
              key={reason.number}
              className="w-[18.75rem] shrink-0 snap-start"
            >
              <WhyCard
                number={reason.number}
                title={reason.title}
                description={reason.description}
                className="h-[22rem]"
              />
            </div>
          ))}
        </div>
        <Grid className="max-md:hidden">
          {reasons.map((reason) => (
            <GridItem key={reason.number} span={8} spanMd={2}>
              <WhyCard
                number={reason.number}
                title={reason.title}
                description={reason.description}
              />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
