import Image from "next/image";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { TeamMemberCard } from "@/app/(pages)/about/components/team-member-card";
import { founders, leadership } from "@/lib/about-content";
import { assets } from "@/lib/assets";

export function AboutTeam() {
  return (
    <section id="team" className="relative bg-foreground text-white">
      <Image
        src={assets.aboutPage.teamBg}
        alt=""
        fill
        className="object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-foreground from-48% to-transparent"
        aria-hidden="true"
      />

      <Container className="relative py-section">
        <div className="flex flex-col gap-[6.25rem]">
          <div className="flex max-w-[41.76rem] flex-col gap-5">
            <Badge className="bg-accent text-foreground">Team</Badge>
            <TextReveal as="h2" className="text-h1 text-white">
              Introducing people
            </TextReveal>
            <TextReveal as="h2" className="text-h1 text-white" delay={0.06}>
              behind Shift My Car
            </TextReveal>
          </div>

          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-12">
              <h3 className="border-b border-border-muted pb-4 text-h3 text-white">
                The Founder
              </h3>
              <Grid columns={12} className="gap-5">
                {founders.map((member, index) => (
                  <GridItem key={member.name} span={6} spanMd={6}>
                    <TeamMemberCard
                      {...member}
                      imageClassName="h-[28.125rem] max-md:h-[14rem]"
                      className={index === 1 ? "md:max-w-[22.5rem] md:justify-self-end" : "md:max-w-[22.5rem]"}
                    />
                  </GridItem>
                ))}
              </Grid>
            </div>

            <div className="flex flex-col gap-12">
              <h3 className="border-b border-border-muted pb-4 text-h3 text-white">
                The Head
              </h3>
              <Grid columns={12} className="gap-5">
                {leadership.map((member) => (
                  <GridItem key={member.name} span={6} spanMd={3}>
                    <TeamMemberCard
                      {...member}
                      imageClassName="h-[26rem] max-md:h-[12rem]"
                    />
                  </GridItem>
                ))}
              </Grid>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
