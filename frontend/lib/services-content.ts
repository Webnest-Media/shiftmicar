export type ServiceFeature = {
  number: string;
  title: string;
  description: string;
};

export type ServiceDetail = {
  slug: string;
  index: string;
  title: string;
  shortDescription: string;
  image: string;
  alt: string;
  overview: readonly string[];
  features: readonly ServiceFeature[];
};

export const services = [
  {
    slug: "dedicated-car-transport",
    index: "01",
    title: "Dedicated Car Transportation",
    shortDescription:
      "Our Dedicated Car Transportation service is suitable for customers who want their vehicle transported with dedicated handling and scheduling. Your car is assigned to a suitable carrier based on the route, vehicle type, and transportation requirements.",
    image: "/assets/services-page/dedicated-transport-hd.jpg",
    alt: "A single premium vehicle secured on a dedicated carrier",
    overview: [
      "Our Dedicated Car Transportation service is suitable for customers who want their vehicle transported with dedicated handling and scheduling. Your car is assigned to a suitable carrier based on the route, vehicle type, and transportation requirements.",
      "Whether it's a luxury car or a high-value model, we prioritize the safety and timely delivery of your vehicle, providing dedicated route coordination and comprehensive insurance coverage for added peace of mind.",
    ],
    features: [
      {
        number: "01.",
        title: "Dedicated Handling",
        description:
          "Your car is assigned to an optimal carrier based on route, vehicle type, and custom requirements.",
      },
      {
        number: "02.",
        title: "Tailored Scheduling",
        description:
          "Custom dispatch and transit timetables arranged around your specific moving deadlines.",
      },
      {
        number: "03.",
        title: "Comprehensive Insurance",
        description:
          "Complete insurance protection covering your vehicle throughout the transit process.",
      },
      {
        number: "04.",
        title: "Live GPS & Updates",
        description:
          "Track your vehicle's location and receive regular transit status updates at every stage.",
      },
    ],
  },
  {
    slug: "car-transportation-by-truck",
    index: "02",
    title: "Car Transportation by Truck",
    shortDescription:
      "Car transportation by truck is a practical solution where multiple cars are transported on a specialized 18.5m vehicle carrier truck. You can simply book a slot for your vehicle, and it will be safely delivered alongside multiple cars across cities and long-distance routes, protecting it from unnecessary road mileage during the journey.",
    image: "/assets/services-page/truck-carrier-18m-hd.jpg",
    alt: "Specialized 18.5m truck carrier transporting multiple vehicles securely across cities",
    overview: [
      "Car transportation by truck is a practical solution for moving vehicles across cities and long-distance routes using specialized 18.5-meter multi-car carrier trucks. Instead of driving hundreds of kilometers, multiple cars are loaded and transported together securely.",
      "You can simply book an individual slot for your vehicle on our 18.5m truck. Your car is secured by trained operators and delivered alongside other cars, protecting your vehicle from unnecessary road mileage, highway wear, and stone chips.",
    ],
    features: [
      {
        number: "01.",
        title: "18.5m Carrier Truck",
        description:
          "Specialized 18.5-meter vehicle carriers designed for multi-car capacity and long-haul safety.",
      },
      {
        number: "02.",
        title: "Book by Slot",
        description:
          "Book an individual slot for your car, making long-distance transit economical and straightforward.",
      },
      {
        number: "03.",
        title: "Zero Road Mileage",
        description:
          "Protects your vehicle from unnecessary tire wear, engine mileage, and highway hazards.",
      },
      {
        number: "04.",
        title: "Multi-Car Security",
        description:
          "Each vehicle is individually secured with heavy-duty wheel straps and monitored throughout transit.",
      },
    ],
  },
  {
    slug: "door-to-door-car-delivery",
    index: "03",
    title: "Door-to-Door Car Delivery",
    shortDescription:
      "With our door-to-door car delivery service, convenience is at the center of the transportation process. Instead of requiring you to take your car to a distant transport terminal, we coordinate pickup as close as practical to your preferred location and arrange delivery near your destination.",
    image: "/assets/services-page/door-delivery-hd.jpg",
    alt: "Vehicle being picked up and delivered directly at doorstep location",
    overview: [
      "With our door-to-door car delivery service, convenience is at the center of the transportation process. Instead of requiring you to take your car to a distant transport terminal, we coordinate pickup as close as practical to your preferred location and arrange delivery near your destination.",
      "You don't have to worry about driving your car hundreds of kilometers yourself or traveling to faraway depots. Shift My Car coordinates the entire pickup and drop-off process to make vehicle shifting effortless.",
    ],
    features: [
      {
        number: "01.",
        title: "Convenient Pickup",
        description:
          "Pickup coordinated directly from your home, office, or preferred local address.",
      },
      {
        number: "02.",
        title: "No Terminal Trips",
        description:
          "Skip stressful trips to distant cargo depots or industrial transport yards.",
      },
      {
        number: "03.",
        title: "Direct Delivery",
        description:
          "Your car is handed over safely as close as practical to your destination address.",
      },
      {
        number: "04.",
        title: "Safe & Insured",
        description:
          "Comprehensive insurance coverage and trained drivers ensure maximum vehicle protection.",
      },
    ],
  },
  {
    slug: "express-car-delivery",
    index: "04",
    title: "Express Car Delivery",
    shortDescription:
      "When time matters, Express Car Delivery provides a faster transportation option subject to route availability and scheduling. This service is designed for customers who need their vehicle delivered within a shorter timeframe than standard transportation options.",
    image: "/assets/services-page/express-transit-hd.jpg",
    alt: "Priority vehicle transportation for urgent car delivery",
    overview: [
      "When time matters, Express Car Delivery provides a faster transportation option subject to route availability and scheduling. This service is designed for customers who need their vehicle delivered within a shorter timeframe than standard transportation options.",
      "Ideal for urgent job relocations, immediate vehicle purchases, or critical deadlines, our express logistics team prioritizes your carrier booking and optimizes routing without cutting corners on safety.",
    ],
    features: [
      {
        number: "01.",
        title: "Priority Scheduling",
        description:
          "Fast-tracked dispatch and expedited carrier placement on earliest departure slots.",
      },
      {
        number: "02.",
        title: "Shorter Timeframe",
        description:
          "Optimized direct transit routes minimize transit time between pickup and drop points.",
      },
      {
        number: "03.",
        title: "Route Availability",
        description:
          "Subject to route availability and scheduling, offering flexible expedited solutions.",
      },
      {
        number: "04.",
        title: "Full Inspection & Insurance",
        description:
          "Speed never compromises safety — thorough inspections and full insurance are standard.",
      },
    ],
  },
] as const satisfies readonly ServiceDetail[];

export type ServiceSlug = (typeof services)[number]["slug"];

export const pageServices = services.map(({ slug, title, image, alt }) => ({
  title,
  image,
  alt,
  href: `/services/${slug}`,
}));

const legacySlugMap: Record<string, ServiceSlug> = {
  "premium-shared-transport": "car-transportation-by-truck",
  "door-to-door-delivery": "door-to-door-car-delivery",
};

export function getServiceBySlug(slug: string) {
  const resolvedSlug = legacySlugMap[slug] || slug;
  return services.find((service) => service.slug === resolvedSlug);
}

export function getAllServiceSlugs() {
  const baseSlugs = services.map((service) => service.slug);
  const legacySlugs = Object.keys(legacySlugMap);
  return [...baseSlugs, ...legacySlugs];
}

export function getRelatedServices(slug: string) {
  const resolvedSlug = legacySlugMap[slug] || slug;
  return services.filter((service) => service.slug !== resolvedSlug);
}
