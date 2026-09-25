"use client";

import dynamic from "next/dynamic";
import type { RouteDetail } from "@/lib/routes-content";

const RouteMapClient = dynamic(
  () =>
    import("@/app/(pages)/routes/components/route-map-client").then(
      (mod) => mod.RouteMapClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[22rem] w-full animate-pulse rounded-badge bg-accent md:h-[34rem]"
        aria-hidden="true"
      />
    ),
  },
);

type RouteMapProps = {
  route: RouteDetail;
};

export function RouteMap({ route }: RouteMapProps) {
  return <RouteMapClient route={route} />;
}
