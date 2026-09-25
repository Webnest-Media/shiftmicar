import { RouteCard } from "@/app/(pages)/routes/components/route-card";
import { Grid, GridItem } from "@/components/layout/grid";
import type { RouteDetail } from "@/lib/routes-content";

type RouteGridProps = {
  routes: readonly RouteDetail[];
  columns?: 8 | 12;
  variant?: "default" | "featured" | "pan-india";
};

export function RouteGrid({
  routes,
  columns = 12,
  variant = "default",
}: RouteGridProps) {
  return (
    <Grid columns={columns}>
      {routes.map((route) => (
        <GridItem
          key={route.slug}
          span={columns === 12 ? 12 : 8}
          spanMd={columns === 12 ? 4 : 4}
        >
          <RouteCard
            route={route}
            variant={route.isPanIndia ? "pan-india" : variant}
          />
        </GridItem>
      ))}
    </Grid>
  );
}
