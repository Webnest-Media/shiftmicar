import { ButtonReveal } from "@/components/animations/button-reveal";
import { ImageReveal } from "@/components/animations/image-reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { assets } from "@/lib/assets";
import { aboutCopy } from "@/lib/about-content";

export function About() {
  return (
    <section id="about" className="bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem]">
        <Grid columns={12} className="items-start">
          <GridItem span={12} spanMd={1} startMd={1}>
            <Badge>About</Badge>
          </GridItem>

          <GridItem
            span={12}
            spanMd={4}
            startMd={3}
            className="max-md:mt-6"
          >
            <h2 className="text-h1 max-w-[25.9375rem]">
              <TextReveal as="span" className="block">
                {aboutCopy.headline.line1}
              </TextReveal>
              <TextReveal as="span" className="block" delay={0.06}>
                {aboutCopy.headline.line2}
              </TextReveal>
            </h2>
          </GridItem>

          <GridItem
            span={12}
            spanMd={2}
            startMd={11}
            className="flex justify-start max-md:mt-6 md:self-end md:justify-end"
          >
            <ButtonReveal href="/about" variant="surface">
              About Us
            </ButtonReveal>
          </GridItem>
        </Grid>

        <Grid columns={12}>
          <GridItem span={12} spanMd={3} startMd={7}>
            <TextReveal as="p" className="text-body opacity-82" delay={0.1}>
              {aboutCopy.intro}
            </TextReveal>
          </GridItem>

          <GridItem span={12} spanMd={3} startMd={10}>
            <TextReveal as="p" className="text-body opacity-82" delay={0.18}>
              {aboutCopy.description}
            </TextReveal>
          </GridItem>
        </Grid>

        <ImageReveal
          src={assets.about}
          alt="Premium car carrier vehicle transport fleet"
          sizes="(min-width: 64rem) 90rem, 100vw"
          className="h-media-frame w-full"
          overlayClassName="bg-gradient-to-t from-black/30 via-transparent to-transparent"
        />
      </Container>
    </section>
  );
}
