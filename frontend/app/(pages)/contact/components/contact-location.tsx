import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { assets } from "@/lib/assets";
import { contactInfo, contactCopy } from "@/lib/contact-content";

function ContactDetail({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-white/12 pb-6 last:border-b-0 last:pb-0">
      <p className="text-label text-accent opacity-90">{label}</p>
      <div className="text-body text-white">{children}</div>
    </div>
  );
}

export function ContactLocation() {
  const { address } = contactInfo;

  return (
    <section className="border-t border-border-muted bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem] max-md:gap-12">
        <div className="flex flex-col items-start gap-5 max-md:gap-4">
          <Badge>Find Us</Badge>
          <TextReveal as="h2" className="text-h1">
            Visit or reach out directly
          </TextReveal>
          <TextReveal
            as="p"
            className="text-body max-w-[36rem] opacity-82"
            delay={0.08}
          >
            {contactCopy.locationIntro}
          </TextReveal>
        </div>

        <Grid columns={12} className="items-stretch gap-y-6 max-md:gap-y-8">
          <GridItem span={12} spanMd={7}>
            <div className="h-[22rem] overflow-hidden rounded-badge max-md:h-[18rem] md:h-full md:min-h-[28.75rem]">
              <iframe
                title="Shift My Car office location on Google Maps"
                src={contactInfo.mapEmbedUrl}
                className="size-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </GridItem>

          <GridItem span={12} spanMd={5}>
            <div className="flex h-full min-h-[28.75rem] flex-col justify-between rounded-badge bg-foreground p-6 text-white max-md:min-h-0 max-md:gap-8 max-md:p-5 md:p-8">
              <div className="flex flex-col gap-6">
                <ContactDetail label="Office Address">
                  <address className="not-italic">
                    <span className="block">{address.line1}</span>
                    <span className="block">{address.line2}</span>
                    <span className="block">{address.city}</span>
                    <span className="block opacity-82">{address.country}</span>
                  </address>
                  <Link
                    href={contactInfo.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-body-sm font-medium text-accent transition-opacity hover:opacity-80"
                  >
                    Get directions
                    <span className="relative size-4 shrink-0">
                      <Image src={assets.icons.external} alt="" fill />
                    </span>
                  </Link>
                </ContactDetail>

                <ContactDetail label="Phone">
                  <a
                    href={contactInfo.phoneHref}
                    className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
                  >
                    <span className="relative size-5 shrink-0">
                      <Image src={assets.icons.phone} alt="" fill />
                    </span>
                    {contactInfo.phone}
                  </a>
                </ContactDetail>

                <ContactDetail label="Email">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="inline-flex items-center gap-3 transition-opacity hover:opacity-80 max-md:max-w-full max-md:items-start max-md:break-all"
                  >
                    <span className="relative size-5 shrink-0">
                      <Image src={assets.icons.mail} alt="" fill />
                    </span>
                    {contactInfo.email}
                  </a>
                </ContactDetail>

                <ContactDetail label="Business Hours">
                  <ul className="flex flex-col gap-2">
                    {contactInfo.hours.map((slot) => (
                      <li
                        key={slot.days}
                        className="flex items-baseline justify-between gap-4 max-md:flex-col max-md:items-start max-md:gap-1"
                      >
                        <span className="opacity-82">{slot.days}</span>
                        <span className="text-body-sm font-medium">
                          {slot.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </ContactDetail>
              </div>

              <div className="mt-8 border-t border-white/12 pt-6">
                <p className="text-label text-accent opacity-90">Follow Us</p>
                <ul className="mt-4 flex flex-wrap gap-6 max-md:gap-4">
                  {contactInfo.social.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-button transition-opacity hover:opacity-80"
                      >
                        {link.label}
                        <span className="relative size-4 shrink-0">
                          <Image src={assets.icons.external} alt="" fill />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
