import { RouteCard } from "@/app/(pages)/routes/components/route-card";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { getRouteBySlug } from "@/lib/routes-content";

export function PanIndiaSection() {
  const panIndiaRoute = getRouteBySlug("pan-india-car-transportation");

  if (!panIndiaRoute) {
    return null;
  }

  return (
    <section className="bg-background py-section">
      <Container className="flex flex-col gap-10 max-md:gap-8">
        <div className="flex flex-col items-start gap-5">
          <Badge>Nationwide</Badge>
          <TextReveal as="h2" className="text-h1">
            Pan-India transportation
          </TextReveal>
        </div>
        <RouteCard route={panIndiaRoute} variant="pan-india" />
      </Container>
    </section>
  );
}
