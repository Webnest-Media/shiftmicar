import { TextReveal } from "@/components/animations/text-reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { contactHighlights, quoteChecklist, contactCopy } from "@/lib/contact-content";

export function ContactFormSection() {
  return (
    <section className="bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem] max-md:gap-12">
        <Grid className="items-end max-md:items-start max-md:gap-8">
          <GridItem span={8} spanMd={5}>
            <h2 className="text-h1">
              <TextReveal as="span" className="block">
                Ready to
              </TextReveal>
              <TextReveal as="span" className="block" delay={0.1}>
                Move Your Car?
              </TextReveal>
            </h2>
          </GridItem>
          <GridItem span={8} spanMd={3} className="md:col-start-7">
            <TextReveal as="p" className="text-body opacity-82" delay={0.1}>
              {contactCopy.readyDescription}
            </TextReveal>
          </GridItem>
        </Grid>

        <Grid columns={12} className="items-start gap-y-12 max-md:gap-y-10">
          <GridItem span={12} spanMd={5}>
            <div className="flex flex-col gap-10 max-md:gap-8">
              <div className="flex flex-col items-start gap-5">
                <Badge>Get a Quote</Badge>
                <TextReveal as="h3" className="text-h2">
                  Tell us about your move
                </TextReveal>
                <TextReveal
                  as="p"
                  className="text-body max-w-[28rem] opacity-82"
                  delay={0.08}
                >
                  {contactCopy.formSubtext}
                </TextReveal>
              </div>

              <ul className="flex flex-col gap-4">
                {quoteChecklist.map((item, index) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-[0.45rem] size-2 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    <TextReveal
                      as="span"
                      className="text-body opacity-82"
                      delay={0.1 + index * 0.05}
                    >
                      {item}
                    </TextReveal>
                  </li>
                ))}
              </ul>

              <div
                className="scrollbar-none -mx-[var(--grid-margin)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--grid-margin)] pb-2 md:hidden"
                data-lenis-prevent-horizontal
              >
                {contactHighlights.map((item) => (
                  <div
                    key={item.number}
                    className="flex h-[14rem] w-[16.5rem] shrink-0 snap-start flex-col gap-3 rounded-badge border border-border-muted p-5"
                  >
                    <span className="text-label font-semibold text-primary">
                      {item.number}
                    </span>
                    <h4 className="text-h4">{item.title}</h4>
                    <p className="text-body-sm opacity-82">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="hidden gap-4 md:grid md:grid-cols-1 lg:grid-cols-3">
                {contactHighlights.map((item) => (
                  <div
                    key={item.number}
                    className="flex flex-col gap-3 rounded-badge border border-border-muted p-5"
                  >
                    <span className="text-label font-semibold text-primary">
                      {item.number}
                    </span>
                    <h4 className="text-h4">{item.title}</h4>
                    <p className="text-body-sm opacity-82">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </GridItem>

          <GridItem span={12} spanMd={6} startMd={7} className="max-md:order-first">
            <div className="md:sticky md:top-[calc(var(--site-header-height)+1.5rem)]">
              <ContactForm className="w-full rounded-badge bg-white p-6 shadow-[var(--contact-form-shadow)] max-md:p-5 md:p-8" />
            </div>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
