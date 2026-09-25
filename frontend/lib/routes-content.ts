export type Coordinates = {
  lat: number;
  lng: number;
};

export type RouteDetail = {
  slug: string;
  number: string;
  origin: string;
  destination: string;
  title: string;
  description: string;
  detailDescription: string;
  image: string;
  alt: string;
  isPanIndia?: boolean;
  featured?: boolean;
  originCoords: Coordinates;
  destinationCoords?: Coordinates;
  highlights?: string[];
};

export const transportOptions = [
  {
    title: "Dedicated Car Transportation",
    href: "/services/dedicated-car-transport",
  },
  {
    title: "Car Transportation by Truck",
    href: "/services/car-transportation-by-truck",
  },
  {
    title: "Door-to-Door Car Delivery",
    href: "/services/door-to-door-car-delivery",
  },
  {
    title: "Express Car Delivery",
    href: "/services/express-car-delivery",
  },
] as const;

export const routeProcessSteps = [
  {
    number: "01",
    title: "Book",
    description: "Share your vehicle and pickup details.",
  },
  {
    number: "02",
    title: "Pickup",
    description: "Your vehicle is collected from the agreed location.",
  },
  {
    number: "03",
    title: "Transport",
    description:
      "Your car is professionally loaded and transported toward its destination.",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "Your vehicle is delivered to the agreed destination. For door-to-door service, it can be driven from the carrier directly to your doorstep.",
  },
] as const;

const cityCoords = {
  delhi: { lat: 28.6139, lng: 77.209 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  malappuram: { lat: 11.051, lng: 76.0711 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  surat: { lat: 21.1702, lng: 72.8311 },
  vapi: { lat: 20.3893, lng: 72.9106 },
  gurgaon: { lat: 28.4595, lng: 77.0266 },
  gujarat: { lat: 23.2156, lng: 72.6369 },
  guwahati: { lat: 26.1445, lng: 91.7362 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  india: { lat: 22.3511, lng: 78.6677 },
} as const satisfies Record<string, Coordinates>;

export const indiaHubCities = [
  { name: "Delhi", coords: cityCoords.delhi },
  { name: "Mumbai", coords: cityCoords.mumbai },
  { name: "Bangalore", coords: cityCoords.bangalore },
  { name: "Kolkata", coords: cityCoords.kolkata },
  { name: "Ahmedabad", coords: cityCoords.ahmedabad },
  { name: "Kochi", coords: cityCoords.kochi },
  { name: "Guwahati", coords: cityCoords.guwahati },
] as const;

const routeImages = {
  route01: "/assets/routes/route-01.jpg",
  route02: "/assets/routes/route-02.jpg",
  route03: "/assets/routes/route-03.jpg",
  route04: "/assets/routes/route-04.jpg",
  route05: "/assets/routes/route-05.jpg",
  route06: "/assets/routes/route-06.jpg",
  route07: "/assets/routes/route-07.jpg",
  highway01: "/assets/routes/highway-01.jpg",
  highway02: "/assets/routes/highway-02.jpg",
  carrier: "/assets/routes/carrier-01.jpg",
  panIndia: "/assets/routes/pan-india.jpg",
} as const;

export const routes = [
  {
    slug: "delhi-to-bangalore",
    number: "01",
    origin: "Delhi",
    destination: "Bangalore",
    title: "Delhi to Bangalore",
    description: "Car transportation from Delhi to Bangalore.",
    detailDescription:
      "Move your car between Delhi and Bangalore with a transportation service designed around reliable handling, flexible transport options, and a seamless delivery experience.",
    image: routeImages.route01,
    alt: "Premium car on an open highway between Delhi and Bangalore",
    featured: true,
    originCoords: cityCoords.delhi,
    destinationCoords: cityCoords.bangalore,
  },
  {
    slug: "delhi-to-mumbai-pune",
    number: "02",
    origin: "Delhi",
    destination: "Mumbai / Pune",
    title: "Delhi to Mumbai / Pune",
    description: "Car transportation from Delhi to Mumbai and Pune.",
    detailDescription:
      "Move your car from Delhi toward Mumbai and Pune with professional vehicle transportation designed for reliable handling and a smooth delivery experience.",
    image: routeImages.route02,
    alt: "Car carrier transporting vehicles from Delhi to Mumbai and Pune",
    featured: true,
    originCoords: cityCoords.delhi,
    destinationCoords: cityCoords.mumbai,
  },
  {
    slug: "delhi-to-kochi-malappuram",
    number: "03",
    origin: "Delhi",
    destination: "Kochi / Malappuram",
    title: "Delhi to Kochi / Malappuram",
    description: "Car transportation from Delhi to Kochi and Malappuram.",
    detailDescription:
      "Transport your vehicle from Delhi to Kochi and Malappuram with a service built around careful handling, dependable coordination, and flexible delivery options.",
    image: routeImages.route03,
    alt: "Vehicle transportation route from Delhi to Kochi and Malappuram",
    originCoords: cityCoords.delhi,
    destinationCoords: cityCoords.kochi,
  },
  {
    slug: "malappuram-to-delhi",
    number: "04",
    origin: "Malappuram",
    destination: "Delhi",
    title: "Malappuram to Delhi",
    description: "Car transportation from Malappuram to Delhi.",
    detailDescription:
      "Move your car from Malappuram to Delhi with a premium transportation experience focused on professional handling and reliable delivery.",
    image: routeImages.route04,
    alt: "Premium vehicle transportation from Malappuram to Delhi",
    originCoords: cityCoords.malappuram,
    destinationCoords: cityCoords.delhi,
  },
  {
    slug: "bangalore-to-pune-mumbai",
    number: "05",
    origin: "Bangalore",
    destination: "Pune / Mumbai",
    title: "Bangalore to Pune / Mumbai",
    description: "Car transportation from Bangalore to Pune and Mumbai.",
    detailDescription:
      "Transport your vehicle from Bangalore toward Pune and Mumbai with dependable coordination and premium automotive handling throughout the journey.",
    image: routeImages.route05,
    alt: "Car transportation from Bangalore to Pune and Mumbai",
    originCoords: cityCoords.bangalore,
    destinationCoords: cityCoords.pune,
  },
  {
    slug: "bangalore-to-delhi",
    number: "06",
    origin: "Bangalore",
    destination: "Delhi",
    title: "Bangalore to Delhi",
    description: "Car transportation from Bangalore to Delhi.",
    detailDescription:
      "Move your car between Bangalore and Delhi with a transportation service designed around reliable handling, flexible transport options, and a seamless delivery experience.",
    image: routeImages.route06,
    alt: "Interstate car transport between Bangalore and Delhi",
    featured: true,
    originCoords: cityCoords.bangalore,
    destinationCoords: cityCoords.delhi,
  },
  {
    slug: "bangalore-to-guwahati",
    number: "07",
    origin: "Bangalore",
    destination: "Guwahati",
    title: "Bangalore to Guwahati",
    description: "Car transportation from Bangalore to Guwahati.",
    detailDescription:
      "Transport your vehicle from Bangalore to Guwahati with professional handling, certified carrier tracking, and secure transit protection across the northeastern corridor.",
    image: routeImages.route07,
    alt: "Vehicle carrier route from Bangalore to Guwahati",
    originCoords: cityCoords.bangalore,
    destinationCoords: cityCoords.guwahati,
  },
  {
    slug: "delhi-to-ahmedabad",
    number: "08",
    origin: "Delhi",
    destination: "Ahmedabad",
    title: "Delhi to Ahmedabad",
    description: "Car transportation from Delhi to Ahmedabad.",
    detailDescription:
      "Move your car between Delhi and Ahmedabad with reliable vehicle transportation and flexible service options to suit your move.",
    image: routeImages.highway01,
    alt: "Car transportation from Delhi to Ahmedabad",
    originCoords: cityCoords.delhi,
    destinationCoords: cityCoords.ahmedabad,
  },
  {
    slug: "delhi-to-surat-vapi",
    number: "09",
    origin: "Delhi",
    destination: "Surat / Vapi",
    title: "Delhi to Surat / Vapi",
    description: "Car transportation from Delhi to Surat and Vapi.",
    detailDescription:
      "Transport your vehicle from Delhi toward Surat and Vapi with professional coordination and premium automotive care throughout the journey.",
    image: routeImages.highway02,
    alt: "Car transportation from Delhi to Surat and Vapi",
    originCoords: cityCoords.delhi,
    destinationCoords: cityCoords.surat,
  },
  {
    slug: "gurugram-to-guwahati",
    number: "10",
    origin: "Gurugram",
    destination: "Guwahati",
    title: "Gurugram to Guwahati",
    description: "Car transportation from Gurugram (Gurgaon) to Guwahati.",
    detailDescription:
      "Move your car from Gurugram and Delhi NCR to Guwahati with a dedicated transportation service built around dependable carrier handling, live GPS tracking, and doorstep handover.",
    image: routeImages.carrier,
    alt: "Premium car transport from Gurugram to Guwahati",
    originCoords: cityCoords.gurgaon,
    destinationCoords: cityCoords.guwahati,
  },
  {
    slug: "bangalore-to-ahmedabad",
    number: "11",
    origin: "Bangalore",
    destination: "Ahmedabad",
    title: "Bangalore to Ahmedabad",
    description: "Car transportation from Bangalore to Ahmedabad.",
    detailDescription:
      "Transport your vehicle from Bangalore to Ahmedabad with reliable handling, flexible transport options, and professional coordination.",
    image: routeImages.route01,
    alt: "Vehicle transportation from Bangalore to Ahmedabad",
    originCoords: cityCoords.bangalore,
    destinationCoords: cityCoords.ahmedabad,
  },
  {
    slug: "gurgaon-to-kolkata",
    number: "12",
    origin: "Gurgaon",
    destination: "Kolkata",
    title: "Gurgaon to Kolkata",
    description: "Car transportation from Gurgaon to Kolkata.",
    detailDescription:
      "Move your car between Gurgaon and Kolkata with a premium transportation experience focused on careful handling and dependable delivery.",
    image: routeImages.route03,
    alt: "Long-distance car transportation from Gurgaon to Kolkata",
    originCoords: cityCoords.gurgaon,
    destinationCoords: cityCoords.kolkata,
  },
  {
    slug: "bangalore-to-kolkata",
    number: "13",
    origin: "Bangalore",
    destination: "Kolkata",
    title: "Bangalore to Kolkata",
    description: "Car transportation from Bangalore to Kolkata.",
    detailDescription:
      "Transport your vehicle from Bangalore to Kolkata with professional automotive handling and a service experience designed for confidence and ease.",
    image: routeImages.route05,
    alt: "Interstate vehicle transport from Bangalore to Kolkata",
    originCoords: cityCoords.bangalore,
    destinationCoords: cityCoords.kolkata,
  },
  {
    slug: "pan-india-car-transportation",
    number: "PAN-INDIA",
    origin: "India",
    destination: "Nationwide",
    title: "Pan-India Car Transportation",
    description:
      "Reliable vehicle transportation across major cities and destinations throughout India.",
    detailDescription:
      "Shift My Car connects major cities and destinations across India with premium vehicle transportation — dedicated carriers, shared transport, door-to-door delivery, and express options tailored to your move.",
    image: routeImages.panIndia,
    alt: "Pan-India premium car transportation across major Indian cities",
    isPanIndia: true,
    featured: true,
    originCoords: cityCoords.india,
  },
] as const;

export const routesList: RouteDetail[] = [...routes];

export type RouteSlug = (typeof routes)[number]["slug"];

export const featuredRoutes = routesList.filter(
  (route) => route.featured && !route.isPanIndia,
);

export const standardRoutes = routesList.filter((route) => !route.isPanIndia);

export function getRouteBySlug(slug: string) {
  if (slug === "gurgaon-to-guwahati" || slug === "gurgaon-to-gujarat") {
    return routesList.find((route) => route.slug === "gurugram-to-guwahati");
  }
  if (slug === "bangalore-to-gujarat") {
    return routesList.find((route) => route.slug === "bangalore-to-guwahati");
  }
  return routesList.find((route) => route.slug === slug);
}

export function getAllRouteSlugs() {
  const slugs = routesList.map((route) => route.slug);
  return [...slugs, "gurgaon-to-guwahati"];
}

function normalizeCity(value: string) {
  return value.split("/")[0]?.trim().toLowerCase() ?? value.toLowerCase();
}

export function getRelatedRoutes(slug: string, limit = 4) {
  const current = getRouteBySlug(slug);
  if (!current) {
    return [];
  }

  if (current.isPanIndia) {
    return routesList
      .filter((route) => route.featured && route.slug !== slug)
      .slice(0, limit);
  }

  const origin = normalizeCity(current.origin);
  const destination = normalizeCity(current.destination);

  return routesList
    .filter((route) => route.slug !== slug && !route.isPanIndia)
    .map((route) => {
      const routeOrigin = normalizeCity(route.origin);
      const routeDestination = normalizeCity(route.destination);
      let score = 0;

      if (routeOrigin === origin || routeDestination === origin) {
        score += 2;
      }
      if (routeOrigin === destination || routeDestination === destination) {
        score += 2;
      }
      if (
        route.origin === current.destination &&
        route.destination === current.origin
      ) {
        score += 3;
      }

      return { route, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.route)
    .slice(0, limit);
}
