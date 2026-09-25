import { ButtonReveal } from "@/components/animations/button-reveal";
import { HeroHeadline } from "./hero-headline";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { assets } from "@/lib/assets";
import { aboutCopy } from "@/lib/about-content";

const bodyCopy = aboutCopy.body;

export function Hero() {
  return (
    <section className="h-hero relative bg-surface text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 size-full object-cover"
        aria-hidden="true"
      >
        <source src={assets.heroVideo} type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-gradient-hero-photo"
        aria-hidden="true"
      />
      <Container className="relative flex h-full flex-col justify-end pb-6 pt-(--site-header-height)">
        <div className="flex flex-col gap-4">
          <HeroHeadline />
          <div className="border-t border-border-muted pt-3">
            <TextReveal
              as="p"
              className="text-body max-w-[34rem] opacity-85 leading-relaxed"
              delay={0.35}
              immediate
            >
              {bodyCopy}
            </TextReveal>
            <div className="mt-8">
              <ButtonReveal href="/contact" variant="accent">
                Get a Quote
              </ButtonReveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
