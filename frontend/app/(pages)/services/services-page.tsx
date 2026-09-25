import { CtaBanner } from "@/app/(pages)/home/components/cta-banner";
import { ServicesGrid } from "@/app/(pages)/services/components/services-grid";
import { ServicesHero } from "@/app/(pages)/services/components/services-hero";

export function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <CtaBanner />
    </>
  );
}
