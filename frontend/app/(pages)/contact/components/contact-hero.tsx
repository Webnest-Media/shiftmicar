import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { contactCopy } from "@/lib/contact-content";

export function ContactHero() {
  return (
    <section className="border-b border-border-muted bg-background">
      <Container className="flex min-h-[31.125rem] flex-col justify-center pb-6 pt-[calc(var(--site-header-height)+5.625rem)] max-md:min-h-0 max-md:gap-6 max-md:pb-8 max-md:pt-[calc(var(--site-header-height)+2.5rem)]">
        <div className="flex flex-col justify-between gap-10 max-md:gap-6 md:flex-row md:items-center">
          <TextReveal as="h1" className="text-h1" immediate>
            Contact
          </TextReveal>

          <TextReveal
            as="p"
            className="text-body max-w-[34.56rem] opacity-82 md:text-right"
            delay={0.1}
          >
            {contactCopy.hero}
          </TextReveal>
        </div>
      </Container>
    </section>
  );
}
