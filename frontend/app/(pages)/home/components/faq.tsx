"use client";

import Image from "next/image";
import { useState } from "react";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How many cars can the shared carrier transport?",
    answer:
      "Our 35-meter carrier can transport 7–8 cars per trip.",
  },
  {
    question: "What is dedicated car transport?",
    answer:
      "A dedicated carrier is reserved specifically for your vehicle, providing a more direct transportation experience.",
  },
  {
    question: "Do you offer door-to-door delivery?",
    answer:
      "Yes. We can collect your vehicle, transport it, and have a driver deliver it directly to your doorstep.",
  },
  {
    question: "Will someone drive my car from the truck to my door?",
    answer:
      "Yes. With door-to-door delivery, a driver can take your vehicle from the carrier and drive it to the final delivery location.",
  },
  {
    question: "Can I choose between shared and dedicated transport?",
    answer:
      "Yes. You can select the option that best suits your delivery requirements and budget.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Simply provide your pickup location, destination, vehicle details, and preferred service. Our team will provide the next steps.",
  },
] as const;

function FaqToggle({ open }: { open: boolean }) {
  return (
    <span
      className="relative flex size-[0.875rem] shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      <span className="h-[0.125rem] w-[0.875rem] bg-white" />
      <span
        className={cn(
          "absolute h-[0.875rem] w-[0.125rem] bg-white transition-opacity duration-200",
          open ? "opacity-0" : "opacity-100",
        )}
      />
    </span>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-foreground py-section text-white">
      <Container>
        <Grid className="gap-y-16">
          <GridItem span={8} spanMd={4} className="flex flex-col justify-between gap-16">
            <div>
              <Badge>FAQs</Badge>
              <h2 className="text-h1 mt-5 text-white">
                <TextReveal as="span" className="block">
                  Frequently Asked
                </TextReveal>
                <TextReveal as="span" className="block" delay={0.06}>
                  Questions
                </TextReveal>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <TextReveal as="p" className="text-body opacity-82" delay={0.1}>
                Got another question? Let us know
              </TextReveal>
              <ul className="flex flex-col gap-1">
                <li>
                  <a
                    href="mailto:info@shiftmycar.com"
                    className="inline-flex items-center gap-3 text-body-sm opacity-82"
                  >
                    <span className="relative size-5 shrink-0">
                      <Image src={assets.icons.mail} alt="" fill />
                    </span>
                    info@shiftmycar.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+11234567890"
                    className="inline-flex items-center gap-3 text-body-sm opacity-82"
                  >
                    <span className="relative size-5 shrink-0">
                      <Image src={assets.icons.phone} alt="" fill />
                    </span>
                    +1 123 456 7890
                  </a>
                </li>
              </ul>
            </div>
          </GridItem>
          <GridItem span={8} spanMd={4}>
            <div className="flex flex-col">
              {faqs.map((faq, faqIndex) => {
                const open = openIndex === faqIndex;
                return (
                  <div
                    key={faq.question}
                    className="border-b border-surface py-8 first:pt-0 max-md:py-6"
                  >
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-4 text-left"
                      onClick={() =>
                        setOpenIndex(open ? null : faqIndex)
                      }
                      aria-expanded={open}
                    >
                      <span className="text-s1 tracking-[-0.0375rem]">
                        {faq.question}
                      </span>
                      <FaqToggle open={open} />
                    </button>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-standard)]",
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="text-body pt-4 opacity-82">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
