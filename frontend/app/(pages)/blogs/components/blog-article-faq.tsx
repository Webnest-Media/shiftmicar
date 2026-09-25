"use client";

import { useState } from "react";
import { ButtonReveal } from "@/components/animations/button-reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import type { FaqItem } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

type BlogArticleFaqProps = {
  items: FaqItem[];
};

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

export function BlogArticleFaq({ items }: BlogArticleFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="bg-foreground py-section text-white">
      <Container>
        <Grid className="gap-y-16">
          <GridItem span={8} spanMd={4} className="flex flex-col justify-between gap-16">
            <div>
              <Badge>FAQs</Badge>
              <h2 className="text-h1 mt-5 text-white">
                <TextReveal as="span" className="block">
                  Questions in
                </TextReveal>
                <TextReveal as="span" className="block" delay={0.06}>
                  this guide
                </TextReveal>
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              <TextReveal as="p" className="text-body opacity-82" delay={0.1}>
                Planning a move? We can take it from here.
              </TextReveal>
              <ButtonReveal href="/contact" variant="accent">
                Get a Quote
              </ButtonReveal>
            </div>
          </GridItem>
          <GridItem span={8} spanMd={4}>
            <div className="flex flex-col">
              {items.map((faq, faqIndex) => {
                const open = openIndex === faqIndex;
                return (
                  <div
                    key={faq.question}
                    className="border-b border-surface py-8 first:pt-0 max-md:py-6"
                  >
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-4 text-left"
                      onClick={() => setOpenIndex(open ? null : faqIndex)}
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
