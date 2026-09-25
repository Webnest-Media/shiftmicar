import { AboutHero } from "@/app/(pages)/about/components/about-hero";
import { AboutMosaic } from "@/app/(pages)/about/components/about-mosaic";
import { AboutTeam } from "@/app/(pages)/about/components/about-team";
import { WhyChooseUs } from "@/app/(pages)/home/components/why-choose-us";

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutMosaic />
      <WhyChooseUs />
      <AboutTeam />
    </>
  );
}
