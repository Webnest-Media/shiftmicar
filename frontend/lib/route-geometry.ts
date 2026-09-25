import type { Coordinates } from "@/lib/routes-content";

export type LatLngTuple = [number, number];

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

export async function fetchDrivingRoute(
  origin: Coordinates,
  destination: Coordinates,
): Promise<LatLngTuple[]> {
  const url = `${OSRM_BASE}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Route request failed");
  }

  const data = (await response.json()) as {
    code?: string;
    routes?: Array<{
      geometry?: { coordinates?: Array<[number, number]> };
    }>;
  };

  const coordinates = data.routes?.[0]?.geometry?.coordinates;
  if (data.code !== "Ok" || !coordinates?.length) {
    throw new Error("Route not found");
  }

  return coordinates.map(([lng, lat]) => [lat, lng]);
}

function interpolateCurve(
  origin: Coordinates,
  destination: Coordinates,
  segments = 48,
): LatLngTuple[] {
  const points: LatLngTuple[] = [];
  const midLat = (origin.lat + destination.lat) / 2;
  const midLng = (origin.lng + destination.lng) / 2;
  const latDelta = destination.lat - origin.lat;
  const lngDelta = destination.lng - origin.lng;
  const distance = Math.hypot(latDelta, lngDelta) || 1;
  const curveLat = midLat - (lngDelta / distance) * distance * 0.12;
  const curveLng = midLng + (latDelta / distance) * distance * 0.12;

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const inverse = 1 - t;
    const lat =
      inverse * inverse * origin.lat +
      2 * inverse * t * curveLat +
      t * t * destination.lat;
    const lng =
      inverse * inverse * origin.lng +
      2 * inverse * t * curveLng +
      t * t * destination.lng;
    points.push([lat, lng]);
  }

  return points;
}

export async function getRoutePath(
  origin: Coordinates,
  destination: Coordinates,
): Promise<LatLngTuple[]> {
  try {
    return await fetchDrivingRoute(origin, destination);
  } catch {
    return interpolateCurve(origin, destination);
  }
}
