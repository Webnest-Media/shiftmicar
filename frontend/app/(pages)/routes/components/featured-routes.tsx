import { RouteGrid } from "@/app/(pages)/routes/components/route-grid";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import type { RouteDetail } from "@/lib/routes-content";

type FeaturedRoutesProps = {
  routes: readonly RouteDetail[];
};

export function FeaturedRoutes({ routes }: FeaturedRoutesProps) {
  return (
    <section className="bg-testimonial-section py-section">
      <Container className="flex flex-col gap-[6.25rem] max-md:gap-12">
        <div className="flex flex-col items-start gap-5">
          <Badge className="bg-background">Featured Routes</Badge>
          <TextReveal as="h2" className="text-h1">
            Popular destinations
          </TextReveal>
        </div>
        <RouteGrid routes={routes} variant="featured" />
      </Container>
    </section>
  );
}
