import { TextReveal } from "@/components/animations/text-reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { cn } from "@/lib/utils";
import { contactCopy } from "@/lib/contact-content";

type ContactSectionProps = {
  className?: string;
  withTopPadding?: boolean;
};

export function ContactSection({
  className,
  withTopPadding = false,
}: ContactSectionProps) {
  return (
    <section
      id="contact"
      className={cn(
        "bg-background py-section",
        withTopPadding &&
          "pt-[calc(var(--site-header-height)+5.625rem)]",
        className,
      )}
    >
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
        <div className="flex justify-center max-md:px-0">
          <ContactForm className="w-full max-w-[35.125rem] rounded-badge bg-white p-6 shadow-[var(--contact-form-shadow)] max-md:max-w-none max-md:p-5" />
        </div>
      </Container>
    </section>
  );
}
