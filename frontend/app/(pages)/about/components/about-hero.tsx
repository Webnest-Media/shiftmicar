import Image from "next/image";
import Link from "next/link";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { founders, aboutPageCopy } from "@/lib/about-content";

export function AboutHero() {
  return (
    <section className="border-b border-border-muted bg-background">
      <Container className="flex min-h-[31.125rem] flex-col justify-between pb-6 pt-[calc(var(--site-header-height)+5.625rem)]">
        <div className="max-w-[48rem]">
          <Badge>{aboutPageCopy.hero.badge}</Badge>
          <TextReveal as="h1" className="text-h1 mt-4">
            {aboutPageCopy.hero.title}
          </TextReveal>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="flex flex-col items-start gap-3">
            <Badge>Amazing Team</Badge>
            <Link
              href="#team"
              className="flex w-[22.62rem] max-w-full items-center justify-between rounded-badge bg-foreground p-2 pr-3 transition-opacity hover:opacity-90"
            >
              <div className="flex gap-2">
                {founders.map((founder) => (
                  <div
                    key={founder.name}
                    className="relative h-[4.6875rem] w-[3.75rem] overflow-hidden rounded-badge"
                  >
                    <Image
                      src={founder.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              <span className="text-body-sm font-medium text-accent">
                See a Full Team
              </span>
            </Link>
          </div>

          <div className="flex max-w-[32rem] flex-col gap-5">
            <TextReveal
              as="p"
              className="text-body opacity-88 leading-relaxed"
              delay={0.1}
            >
              {aboutPageCopy.hero.intro}
            </TextReveal>
            <TextReveal
              as="p"
              className="text-body opacity-82 leading-relaxed"
              delay={0.16}
            >
              {aboutPageCopy.hero.subtext}
            </TextReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
