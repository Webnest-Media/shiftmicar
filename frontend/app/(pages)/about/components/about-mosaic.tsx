import { ImageReveal } from "@/components/animations/image-reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { assets } from "@/lib/assets";
import { aboutPageCopy } from "@/lib/about-content";

export function AboutMosaic() {
  return (
    <section className="bg-background py-section">
      <Container>
        <Grid columns={12} className="items-stretch">
          <GridItem span={12} spanMd={4}>
            <ImageReveal
              src={assets.aboutPage.mosaic1}
              alt="Shift My Car team members in the office"
              sizes="(min-width: 64rem) 28rem, 100vw"
              className="h-[25.375rem] w-full rounded-badge"
            />
          </GridItem>

          <GridItem span={12} spanMd={4}>
            <div className="flex h-full min-h-[25.375rem] flex-col justify-between rounded-badge bg-primary p-6 text-white">
              <TextReveal as="p" className="text-body opacity-90 leading-relaxed">
                {aboutPageCopy.mission.statement}
              </TextReveal>
              <div className="flex items-end justify-end gap-3 pt-4">
                <span className="text-body-sm opacity-90">Est.</span>
                <span className="text-h2 leading-none">{aboutPageCopy.mission.established}</span>
              </div>
            </div>
          </GridItem>

          <GridItem span={12} spanMd={4}>
            <ImageReveal
              src={assets.aboutPage.mosaic2}
              alt="Shift My Car operations team at work"
              sizes="(min-width: 64rem) 28rem, 100vw"
              className="h-[25.375rem] w-full rounded-badge"
              delay={0.1}
            />
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
