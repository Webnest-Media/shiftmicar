"use client";

import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { DraggableMarquee } from "@/components/ui/draggable-marquee";
import { HoverTooltip } from "@/components/ui/hover-tooltip";
import { BrandLogo } from "@/components/ui/brand-logo";
import { partners as defaultPartners } from "@/lib/partners-content";
import type { PartnerItem } from "@/lib/blog-types";

type PartnerDisplay = {
  readonly id?: string;
  readonly name: string;
  readonly logo: string;
  readonly alt?: string | null;
  readonly widthDesktop?: number | null;
  readonly heightDesktop?: number | null;
  readonly widthMobile?: number | null;
  readonly heightMobile?: number | null;
};

export function Trust({ initialPartners }: { initialPartners?: PartnerItem[] }) {
  const items: readonly PartnerDisplay[] =
    initialPartners && initialPartners.length > 0
      ? initialPartners.filter((p) => p.isActive)
      : defaultPartners;

  return (
    <section className="overflow-hidden bg-background py-section">
      <Container className="flex flex-col items-center gap-8">
        <TextReveal as="h2" className="text-s1 text-center text-foreground">
          Trusted by Businesses & Car Owners
        </TextReveal>
      </Container>

      <div className="mt-8 md:mt-10">
        <DraggableMarquee
          speed={38}
          pauseOnHover
          gradient
          gradientColor="#ffffff"
          gradientWidth="9rem"
        >
          {items.map((partner) => (
            <HoverTooltip
              key={partner.name}
              label={partner.name}
              className="mx-6 sm:mx-8 md:mx-10 shrink-0"
            >
              <div className="flex items-center justify-center text-foreground/80 transition-all duration-300 hover:text-foreground hover:scale-105">
                <BrandLogo
                  name={partner.name}
                  logoUrl={partner.logo}
                  widthDesktop={partner.widthDesktop}
                  heightDesktop={partner.heightDesktop}
                  widthMobile={partner.widthMobile}
                  heightMobile={partner.heightMobile}
                />
              </div>
            </HoverTooltip>
          ))}
        </DraggableMarquee>
      </div>
    </section>
  );
}

