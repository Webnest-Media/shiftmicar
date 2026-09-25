import { RouteGrid } from "@/app/(pages)/routes/components/route-grid";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { standardRoutes } from "@/lib/routes-content";

export function AllRoutes() {
  return (
    <section className="bg-background py-section">
      <Container className="flex flex-col gap-[6.25rem] max-md:gap-12">
        <div className="flex flex-col items-start gap-5">
          <Badge>All Routes</Badge>
          <TextReveal as="h2" className="text-h1">
            Every destination we serve
          </TextReveal>
        </div>
        <RouteGrid routes={standardRoutes} />
      </Container>
    </section>
  );
}
