import Link from "next/link";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import type { LegalDocument } from "@/lib/legal-content";
import { cn } from "@/lib/utils";

function LegalBlock({ block }: { block: LegalDocument["sections"][number]["blocks"][number] }) {
  if (block.type === "paragraph") {
    return <p className="text-body opacity-82">{block.text}</p>;
  }

  return (
    <ul className="flex list-disc flex-col gap-3 pl-5">
      {block.items.map((item) => (
        <li key={item} className="text-body opacity-82">
          {item}
        </li>
      ))}
    </ul>
  );
}

type LegalDocumentPageProps = {
  document: LegalDocument;
};

export function LegalDocumentPage({ document }: LegalDocumentPageProps) {
  return (
    <>
      <section className="border-b border-border-muted bg-background">
        <Container className="flex min-h-[31.125rem] flex-col justify-center pb-6 pt-[calc(var(--site-header-height)+5.625rem)]">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div className="flex flex-col items-start gap-5">
              <Badge>Legal</Badge>
              <TextReveal as="h1" className="text-h1" immediate>
                {document.title}
              </TextReveal>
            </div>

            <div className="flex max-w-[34.56rem] flex-col gap-4 md:text-right">
              <TextReveal as="p" className="text-body opacity-82" delay={0.08}>
                {document.description}
              </TextReveal>
              <TextReveal
                as="p"
                className="text-body-sm text-muted"
                delay={0.12}
              >
                {`Last updated: ${document.lastUpdated}`}
              </TextReveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-section">
        <Container>
          <Grid columns={12} className="items-start gap-y-12">
            <GridItem span={12} spanMd={3}>
              <nav
                aria-label="On this page"
                className="md:sticky md:top-[calc(var(--site-header-height)+1.5rem)]"
              >
                <p className="text-label font-semibold uppercase tracking-[0.08em] opacity-70">
                  On this page
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {document.sections.map((section) => (
                    <li key={section.id}>
                      <Link
                        href={`#${section.id}`}
                        className="text-body-sm opacity-82 transition-opacity hover:opacity-100"
                      >
                        {section.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </GridItem>

            <GridItem span={12} spanMd={8} startMd={5}>
              <div className="flex flex-col gap-16">
                {document.sections.map((section, index) => (
                  <article
                    key={section.id}
                    id={section.id}
                    className={cn(
                      "scroll-mt-[calc(var(--site-header-height)+1.5rem)]",
                      index > 0 && "border-t border-border-muted pt-16",
                    )}
                  >
                    <h2 className="text-h2">{section.title}</h2>
                    <div className="mt-6 flex flex-col gap-5">
                      {section.blocks.map((block, blockIndex) => (
                        <LegalBlock key={`${section.id}-${blockIndex}`} block={block} />
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </GridItem>
          </Grid>
        </Container>
      </section>
    </>
  );
}
