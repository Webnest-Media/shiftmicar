import { AllRoutes } from "@/app/(pages)/routes/components/all-routes";
import { FeaturedRoutes } from "@/app/(pages)/routes/components/featured-routes";
import { PanIndiaSection } from "@/app/(pages)/routes/components/pan-india-section";
import { RouteCta } from "@/app/(pages)/routes/components/route-cta";
import { RoutesHero } from "@/app/(pages)/routes/components/routes-hero";
import { featuredRoutes } from "@/lib/routes-content";

export function RoutesPage() {
  return (
    <>
      <RoutesHero />
      <FeaturedRoutes routes={featuredRoutes} />
      <AllRoutes />
      <PanIndiaSection />
      <RouteCta />
    </>
  );
}
