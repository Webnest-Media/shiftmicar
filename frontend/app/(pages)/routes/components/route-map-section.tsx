import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { RouteMap } from "@/app/(pages)/routes/components/route-map";
import type { RouteDetail } from "@/lib/routes-content";

type RouteMapSectionProps = {
  route: RouteDetail;
};

export function RouteMapSection({ route }: RouteMapSectionProps) {
  return (
    <section className="bg-background py-section">
      <Container className="flex flex-col gap-10 max-md:gap-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex max-w-[33.88rem] flex-col items-start gap-5">
            <Badge>Route Map</Badge>
            <TextReveal as="h2" className="text-h1">
              {route.isPanIndia
                ? "Nationwide coverage"
                : "Your route visualized"}
            </TextReveal>
          </div>
          <TextReveal
            as="p"
            className="text-body max-w-[28rem] opacity-82"
            delay={0.08}
          >
            {route.isPanIndia
              ? "Major city hubs connected across India — with flexible transport options for every move."
              : `See the journey from ${route.origin} to ${route.destination}. The route shown follows available road paths for visual reference.`}
          </TextReveal>
        </div>
        <RouteMap route={route} />
      </Container>
    </section>
  );
}
