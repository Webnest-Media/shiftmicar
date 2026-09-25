"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { getRoutePath, type LatLngTuple } from "@/lib/route-geometry";
import type { RouteDetail } from "@/lib/routes-content";
import { indiaHubCities } from "@/lib/routes-content";
import "leaflet/dist/leaflet.css";

const tileUrl =
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

const tileAttribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

function createMarkerIcon(label: string, variant: "origin" | "destination" | "hub") {
  return L.divIcon({
    className: "",
    html: `<div class="route-map-marker route-map-marker--${variant}" role="presentation"><span class="route-map-marker__pulse" aria-hidden="true"></span><span class="route-map-marker__dot" aria-hidden="true"></span><span class="route-map-marker__label">${label}</span></div>`,
    iconSize: [140, 56],
    iconAnchor: [70, 28],
  });
}

function FitRouteBounds({
  positions,
  fallbackRoute,
}: {
  positions: LatLngTuple[] | null;
  fallbackRoute: RouteDetail;
}) {
  const map = useMap();

  useEffect(() => {
    if (fallbackRoute.isPanIndia) {
      map.setView(
        [fallbackRoute.originCoords.lat, fallbackRoute.originCoords.lng],
        5,
      );
      return;
    }

    if (positions?.length) {
      map.fitBounds(L.latLngBounds(positions).pad(0.12));
      return;
    }

    if (fallbackRoute.destinationCoords) {
      map.fitBounds(
        L.latLngBounds(
          [fallbackRoute.originCoords.lat, fallbackRoute.originCoords.lng],
          [
            fallbackRoute.destinationCoords.lat,
            fallbackRoute.destinationCoords.lng,
          ],
        ).pad(0.15),
      );
    }
  }, [map, positions, fallbackRoute]);

  return null;
}

function RoutePathLayer({
  route,
  onLoadingChange,
}: {
  route: RouteDetail;
  onLoadingChange: (loading: boolean) => void;
}) {
  const [positions, setPositions] = useState<LatLngTuple[] | null>(null);

  useEffect(() => {
    if (route.isPanIndia || !route.destinationCoords) {
      onLoadingChange(false);
      return;
    }

    let cancelled = false;
    onLoadingChange(true);

    getRoutePath(route.originCoords, route.destinationCoords)
      .then((path) => {
        if (!cancelled) {
          setPositions(path);
        }
      })
      .finally(() => {
        if (!cancelled) {
          onLoadingChange(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [route, onLoadingChange]);

  if (route.isPanIndia) {
    return (
      <>
        {indiaHubCities.map((hub) => (
          <Marker
            key={hub.name}
            position={[hub.coords.lat, hub.coords.lng]}
            icon={createMarkerIcon(hub.name, "hub")}
          >
            <Popup>
              <strong>{hub.name}</strong>
            </Popup>
          </Marker>
        ))}
        <FitRouteBounds positions={null} fallbackRoute={route} />
      </>
    );
  }

  if (!route.destinationCoords) {
    return null;
  }

  return (
    <>
      <FitRouteBounds positions={positions} fallbackRoute={route} />

      <Marker
        position={[route.originCoords.lat, route.originCoords.lng]}
        icon={createMarkerIcon(route.origin, "origin")}
      >
        <Popup>
          <strong>Origin</strong>
          <br />
          {route.origin}
        </Popup>
      </Marker>
      <Marker
        position={[route.destinationCoords.lat, route.destinationCoords.lng]}
        icon={createMarkerIcon(route.destination, "destination")}
      >
        <Popup>
          <strong>Destination</strong>
          <br />
          {route.destination}
        </Popup>
      </Marker>

      {positions ? (
        <>
          <Polyline
            positions={positions}
            pathOptions={{
              color: "#003995",
              weight: 8,
              opacity: 0.14,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          <Polyline
            positions={positions}
            pathOptions={{
              color: "#003995",
              weight: 4,
              opacity: 0.95,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </>
      ) : null}
    </>
  );
}

type RouteMapClientProps = {
  route: RouteDetail;
};

export function RouteMapClient({ route }: RouteMapClientProps) {
  const [loading, setLoading] = useState(!route.isPanIndia);
  const center: [number, number] = [
    route.originCoords.lat,
    route.originCoords.lng,
  ];

  return (
    <div className="route-map-shell relative overflow-hidden rounded-badge border border-border-muted shadow-[0_1rem_3rem_color-mix(in_srgb,var(--color-foreground)_8%,transparent)]">
      {loading ? (
        <div className="route-map-loading pointer-events-none absolute inset-x-0 top-4 z-[500] mx-auto w-fit rounded-badge bg-background/92 px-4 py-2 text-body-sm shadow-sm">
          Loading route…
        </div>
      ) : null}
      <MapContainer
        center={center}
        zoom={route.isPanIndia ? 5 : 6}
        scrollWheelZoom={false}
        className="route-map h-[22rem] w-full md:h-[34rem]"
        aria-label={
          route.isPanIndia
            ? "Map of India showing nationwide car transportation coverage"
            : `Driving route from ${route.origin} to ${route.destination}`
        }
      >
        <TileLayer url={tileUrl} attribution={tileAttribution} maxZoom={19} />
        <RoutePathLayer route={route} onLoadingChange={setLoading} />
      </MapContainer>

      {!route.isPanIndia ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[400] bg-gradient-to-t from-background/90 to-transparent px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-body-sm">
            <span className="inline-flex items-center gap-2 font-medium">
              <span className="route-map-legend route-map-legend--origin" />
              {route.origin}
            </span>
            <span className="text-primary" aria-hidden="true">
              →
            </span>
            <span className="inline-flex items-center gap-2 font-medium">
              <span className="route-map-legend route-map-legend--destination" />
              {route.destination}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
