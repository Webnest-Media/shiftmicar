import { RouteGrid } from "@/app/(pages)/routes/components/route-grid";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { getRelatedRoutes } from "@/lib/routes-content";

type RelatedRoutesProps = {
  currentSlug: string;
};

export function RelatedRoutes({ currentSlug }: RelatedRoutesProps) {
  const related = getRelatedRoutes(currentSlug);

  if (!related.length) {
    return null;
  }

  return (
    <section className="border-t border-border-muted bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem] max-md:gap-12">
        <div className="flex flex-col items-start gap-5">
          <Badge>Related Routes</Badge>
          <TextReveal as="h2" className="text-h1">
            Explore other routes
          </TextReveal>
        </div>
        <RouteGrid routes={related} />
      </Container>
    </section>
  );
}
