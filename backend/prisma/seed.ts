import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedBlogs } from "./seed-blogs.js";

const prisma = new PrismaClient();

/** Seeded CMS login — stored hashed in the users table, not in .env */
const SEED_ADMIN = {
  email: "admin@shiftmycar.com",
  password: "ChangeMe123!",
  name: "Admin",
} as const;

async function main() {
  const email = SEED_ADMIN.email.toLowerCase();
  const passwordHash = await bcrypt.hash(SEED_ADMIN.password, 12);
  const existing = await prisma.user.findUnique({ where: { email } });

  let admin;
  if (existing) {
    admin = await prisma.user.update({
      where: { email },
      data: {
        name: SEED_ADMIN.name,
        role: "ADMIN",
        passwordHash,
      },
    });
  } else {
    admin = await prisma.user.create({
      data: {
        name: SEED_ADMIN.name,
        email,
        passwordHash,
        role: "ADMIN",
      },
    });
  }

  const categories = [
    {
      name: "Car Transportation",
      slug: "car-transportation",
      description: "Guides and insights on moving vehicles across India.",
    },
    {
      name: "Vehicle Logistics",
      slug: "vehicle-logistics",
      description: "Logistics practices for dealers and private owners.",
    },
    {
      name: "Luxury Vehicles",
      slug: "luxury-vehicles",
      description: "Transport considerations for premium and high-value cars.",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const tags = [
    { name: "Car Transportation", slug: "car-transportation-tag" },
    { name: "Car Shipping", slug: "car-shipping" },
    { name: "Vehicle Logistics", slug: "vehicle-logistics" },
    { name: "Luxury Car Transport", slug: "luxury-car-transport" },
    { name: "Car Transport Routes", slug: "car-transport-routes" },
    { name: "Automotive Logistics", slug: "automotive-logistics" },
    { name: "Dedicated Car Transportation", slug: "dedicated-car-transport" },
    { name: "Car Transportation by Truck", slug: "car-transportation-by-truck" },
    { name: "Door-to-Door Car Delivery", slug: "door-to-door-car-delivery" },
    { name: "Express Car Delivery", slug: "express-car-delivery" },
    { name: "Dealer Transportation", slug: "dealer-transportation" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
  }

  console.log(`Seeded admin user: ${admin.email}`);
  const slugs = await seedBlogs(prisma, admin.id);
  console.log(`Seeded blogs: ${slugs.join(", ")}`);

  const initialTestimonials = [
    {
      name: "Jan Fierri",
      role: "Dealership Manager",
      quote:
        "Shift My Car handled our dealership transfers flawlessly. The shared carrier option was cost-effective, and our vehicles arrived exactly as promised.",
      logo: "/assets/testimonial-logo-1.svg",
      rating: 5,
      order: 1,
      isActive: true,
    },
    {
      name: "Ayeesha Mulia",
      role: "Car Owner",
      quote:
        "We needed door-to-door delivery for a relocation. They collected our car, transported it safely, and a driver brought it right to our new home.",
      logo: "/assets/testimonial-logo-2.svg",
      rating: 5,
      order: 2,
      isActive: true,
    },
    {
      name: "Jacob Onana",
      role: "Classic Car Enthusiast",
      quote:
        "Dedicated transport gave us peace of mind for our classic car. Professional handling throughout — we wouldn't trust anyone else with it.",
      logo: "/assets/testimonial-logo-3.svg",
      rating: 5,
      order: 3,
      isActive: true,
    },
    {
      name: "Jang Han Neul",
      role: "Vehicle Buyer",
      quote:
        "Getting a quote was simple, and the team kept us updated from pickup to delivery. Hassle-free from start to finish.",
      logo: "/assets/testimonial-logo-4.svg",
      rating: 5,
      order: 4,
      isActive: true,
    },
  ];

  for (const item of initialTestimonials) {
    const existingTestimonial = await (prisma as any).testimonial.findFirst({
      where: { name: item.name },
    });
    if (!existingTestimonial) {
      await (prisma as any).testimonial.create({ data: item });
    }
  }
  console.log("Seeded testimonials successfully");

  const initialPartners = [
    { name: "Maruti Suzuki", logo: "/assets/brands/maruti.svg", order: 1, widthDesktop: 160, heightDesktop: 44, widthMobile: 115, heightMobile: 32 },
    { name: "Mahindra", logo: "/assets/brands/mahindra.svg", order: 2, widthDesktop: 155, heightDesktop: 42, widthMobile: 110, heightMobile: 30 },
    { name: "Tata Motors", logo: "/assets/brands/tata.svg", order: 3, widthDesktop: 150, heightDesktop: 40, widthMobile: 105, heightMobile: 28 },
    { name: "MIDHANI", logo: "/assets/brands/midhani.svg", order: 4, widthDesktop: 165, heightDesktop: 44, widthMobile: 120, heightMobile: 32 },
    { name: "Toyota", logo: "/assets/brands/toyota.svg", order: 5, widthDesktop: 150, heightDesktop: 40, widthMobile: 105, heightMobile: 28 },
    { name: "Kia", logo: "/assets/brands/kia.svg", order: 6, widthDesktop: 140, heightDesktop: 38, widthMobile: 98, heightMobile: 26 },
    { name: "Hyundai", logo: "/assets/brands/hyundai.svg", order: 7, widthDesktop: 155, heightDesktop: 42, widthMobile: 110, heightMobile: 30 },
    { name: "Honda", logo: "/assets/brands/honda.svg", order: 8, widthDesktop: 145, heightDesktop: 40, widthMobile: 100, heightMobile: 28 },
    { name: "Mercedes-Benz", logo: "/assets/brands/mercedes.svg", order: 9, widthDesktop: 165, heightDesktop: 44, widthMobile: 120, heightMobile: 32 },
    { name: "BMW", logo: "/assets/brands/bmw.svg", order: 10, widthDesktop: 135, heightDesktop: 42, widthMobile: 95, heightMobile: 30 },
    { name: "Audi", logo: "/assets/brands/audi.svg", order: 11, widthDesktop: 145, heightDesktop: 40, widthMobile: 105, heightMobile: 28 },
    { name: "Porsche", logo: "/assets/brands/porsche.svg", order: 12, widthDesktop: 155, heightDesktop: 42, widthMobile: 110, heightMobile: 30 },
    { name: "Ferrari", logo: "/assets/brands/ferrari.svg", order: 13, widthDesktop: 150, heightDesktop: 42, widthMobile: 105, heightMobile: 30 },
    { name: "Lamborghini", logo: "/assets/brands/lamborghini.svg", order: 14, widthDesktop: 170, heightDesktop: 44, widthMobile: 125, heightMobile: 32 },
  ];

  for (const item of initialPartners) {
    const existing = await (prisma as any).partner.findFirst({
      where: { name: item.name },
    });
    if (!existing) {
      await (prisma as any).partner.create({ data: item });
    } else {
      await (prisma as any).partner.update({
        where: { id: existing.id },
        data: {
          widthDesktop: item.widthDesktop,
          heightDesktop: item.heightDesktop,
          widthMobile: item.widthMobile,
          heightMobile: item.heightMobile,
        },
      });
    }
  }
  console.log("Seeded partners successfully");

  const initialServices = [
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
          description: "Your car is assigned to an optimal carrier based on route, vehicle type, and custom requirements.",
        },
        {
          number: "02.",
          title: "Tailored Scheduling",
          description: "Custom dispatch and transit timetables arranged around your specific moving deadlines.",
        },
        {
          number: "03.",
          title: "Comprehensive Insurance",
          description: "Complete insurance protection covering your vehicle throughout the transit process.",
        },
        {
          number: "04.",
          title: "Live GPS & Updates",
          description: "Track your vehicle's location and receive regular transit status updates at every stage.",
        },
      ],
      metaTitle: "Dedicated Car Transportation Across India | Shift My Car",
      metaDescription: "Safe, enclosed and dedicated vehicle transportation with custom scheduling, comprehensive insurance, and dedicated transit coordinators.",
      focusKeyword: "dedicated car transportation",
      seoHealth: "GOOD" as const,
      order: 1,
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
          description: "Specialized 18.5-meter vehicle carriers designed for multi-car capacity and long-haul safety.",
        },
        {
          number: "02.",
          title: "Book by Slot",
          description: "Book an individual slot for your car, making long-distance transit economical and straightforward.",
        },
        {
          number: "03.",
          title: "Zero Road Mileage",
          description: "Protects your vehicle from unnecessary tire wear, engine mileage, and highway hazards.",
        },
        {
          number: "04.",
          title: "Multi-Car Security",
          description: "Each vehicle is individually secured with heavy-duty wheel straps and monitored throughout transit.",
        },
      ],
      metaTitle: "Car Transportation by Truck (18.5m Multi-Car Carrier) | Shift My Car",
      metaDescription: "Economical and secure car transportation by 18.5m truck carriers. Reserve your slot and relocate your vehicle with full transit insurance.",
      focusKeyword: "car transportation by truck",
      seoHealth: "GOOD" as const,
      order: 2,
    },
    {
      slug: "door-to-door-car-delivery",
      index: "03",
      title: "Door-to-Door Car Delivery",
      shortDescription:
        "Door-to-door car delivery is designed for ultimate convenience. Our team collects your vehicle directly from your home, office, or designated pickup point and delivers it right to your destination doorstep anywhere in India.",
      image: "/assets/services-page/door-to-door-delivery-hd.jpg",
      alt: "Professional vehicle logistics driver handing car keys directly at customer's doorstep",
      overview: [
        "Our Door-to-Door Car Delivery service takes the hassle out of vehicle shifting. There is no need to travel to logistics hubs or shipping depots.",
        "A certified driver performs a full digital inspection checklist at your current address, safely transports your vehicle via our carrier network, and delivers it directly to your new address.",
      ],
      features: [
        {
          number: "01.",
          title: "Doorstep Collection",
          description: "We pick up your car directly from your residence, corporate office, or parking facility.",
        },
        {
          number: "02.",
          title: "Direct Handover",
          description: "Your vehicle is handed over directly at your destination doorstep with physical key handover.",
        },
        {
          number: "03.",
          title: "Condition Checklists",
          description: "Digital photo inspection at pickup and delivery ensuring transparency from start to finish.",
        },
        {
          number: "04.",
          title: "Zero Terminal Visits",
          description: "Enjoy complete convenience without visiting remote logistics yards or cargo terminals.",
        },
      ],
      metaTitle: "Door-to-Door Car Delivery Across India | Shift My Car",
      metaDescription: "Convenient door-to-door vehicle delivery service. We collect from your doorstep and deliver safely to your destination with full tracking.",
      focusKeyword: "door to door car delivery",
      seoHealth: "GOOD" as const,
      order: 3,
    },
    {
      slug: "express-car-delivery",
      index: "04",
      title: "Express Car Delivery",
      shortDescription:
        "When timing is crucial, our Express Car Delivery prioritizes your vehicle with expedited carrier dispatch, priority routing, and minimized transit turnaround across India.",
      image: "/assets/services-page/express-delivery-hd.jpg",
      alt: "Express vehicle carrier traveling on high-speed interstate highway corridor",
      overview: [
        "Express Car Delivery is tailored for tight deadlines, emergency relocations, and urgent auto sales. Your vehicle is assigned to the next immediate outbound carrier with priority load scheduling.",
        "We optimize routes and utilize team drivers on long-distance corridors to significantly reduce transit time without compromising safety.",
      ],
      features: [
        {
          number: "01.",
          title: "Priority Dispatch",
          description: "Fast-tracked vehicle loading with immediate assignment to the earliest departure.",
        },
        {
          number: "02.",
          title: "Expedited Transit",
          description: "Optimized express routes with dual-driver rotation for rapid interstate transit.",
        },
        {
          number: "03.",
          title: "Dedicated Coordinator",
          description: "Direct access to a personal transport coordinator for continuous real-time milestone updates.",
        },
        {
          number: "04.",
          title: "Time-Definite Delivery",
          description: "Guaranteed transit windows designed specifically for urgent automotive relocations.",
        },
      ],
      metaTitle: "Express Car Delivery & Urgent Auto Shipping | Shift My Car",
      metaDescription: "Fast, expedited car transport services across India with priority dispatch, minimized transit times, and live GPS tracking.",
      focusKeyword: "express car delivery",
      seoHealth: "GOOD" as const,
      order: 4,
    },
  ];

  for (const s of initialServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log("Seeded services successfully");

  const initialRoutes = [
    {
      slug: "delhi-to-bangalore",
      number: "01",
      origin: "Delhi",
      destination: "Bangalore",
      title: "Delhi to Bangalore",
      description: "Car transportation from Delhi to Bangalore.",
      detailDescription: "Move your car between Delhi and Bangalore with a transportation service designed around reliable handling, flexible transport options, and a seamless delivery experience.",
      image: "/assets/routes/route-01.jpg",
      alt: "Premium car on an open highway between Delhi and Bangalore",
      originLat: 28.6139,
      originLng: 77.209,
      destinationLat: 12.9716,
      destinationLng: 77.5946,
      featured: true,
      metaTitle: "Delhi to Bangalore Car Transport | Shift My Car",
      metaDescription: "Reliable car transportation from Delhi to Bangalore with verified multi-car carriers, comprehensive insurance, and doorstep pickup.",
      focusKeyword: "delhi to bangalore car transport",
      seoHealth: "GOOD" as const,
      order: 1,
    },
    {
      slug: "delhi-to-mumbai-pune",
      number: "02",
      origin: "Delhi",
      destination: "Mumbai / Pune",
      title: "Delhi to Mumbai / Pune",
      description: "Car transportation from Delhi to Mumbai and Pune.",
      detailDescription: "Move your car from Delhi toward Mumbai and Pune with professional vehicle transportation designed for reliable handling and a smooth delivery experience.",
      image: "/assets/routes/route-02.jpg",
      alt: "Car carrier transporting vehicles from Delhi to Mumbai and Pune",
      originLat: 28.6139,
      originLng: 77.209,
      destinationLat: 19.076,
      destinationLng: 72.8777,
      featured: true,
      metaTitle: "Delhi to Mumbai & Pune Car Transport | Shift My Car",
      metaDescription: "Professional vehicle transport from Delhi to Mumbai and Pune. Safe multi-car carriers and dedicated enclosed transport available.",
      focusKeyword: "delhi to mumbai car transport",
      seoHealth: "GOOD" as const,
      order: 2,
    },
    {
      slug: "delhi-to-kochi-malappuram",
      number: "03",
      origin: "Delhi",
      destination: "Kochi / Malappuram",
      title: "Delhi to Kochi / Malappuram",
      description: "Car transportation from Delhi to Kochi and Malappuram.",
      detailDescription: "Transport your vehicle from Delhi to Kochi and Malappuram with a service built around careful handling, dependable coordination, and flexible delivery options.",
      image: "/assets/routes/route-03.jpg",
      alt: "Vehicle transportation route from Delhi to Kochi and Malappuram",
      originLat: 28.6139,
      originLng: 77.209,
      destinationLat: 9.9312,
      destinationLng: 76.2673,
      metaTitle: "Delhi to Kochi & Malappuram Car Transport | Shift My Car",
      metaDescription: "Safe vehicle shifting from Delhi to Kerala (Kochi and Malappuram). Door-to-door delivery with full transit insurance.",
      focusKeyword: "delhi to kochi car transport",
      seoHealth: "GOOD" as const,
      order: 3,
    },
    {
      slug: "malappuram-to-delhi",
      number: "04",
      origin: "Malappuram",
      destination: "Delhi",
      title: "Malappuram to Delhi",
      description: "Car transportation from Malappuram to Delhi.",
      detailDescription: "Move your car from Malappuram to Delhi with a premium transportation experience focused on professional handling and reliable delivery.",
      image: "/assets/routes/route-04.jpg",
      alt: "Premium vehicle transportation from Malappuram to Delhi",
      originLat: 11.051,
      originLng: 76.0711,
      destinationLat: 28.6139,
      destinationLng: 77.209,
      metaTitle: "Malappuram to Delhi Car Transport | Shift My Car",
      metaDescription: "Reliable auto shipping from Malappuram to Delhi. Dedicated carriers and regular shared carrier departures.",
      focusKeyword: "malappuram to delhi car transport",
      seoHealth: "GOOD" as const,
      order: 4,
    },
    {
      slug: "bangalore-to-pune-mumbai",
      number: "05",
      origin: "Bangalore",
      destination: "Pune / Mumbai",
      title: "Bangalore to Pune / Mumbai",
      description: "Car transportation from Bangalore to Pune and Mumbai.",
      detailDescription: "Transport your vehicle from Bangalore toward Pune and Mumbai with dependable coordination and premium automotive handling throughout the journey.",
      image: "/assets/routes/route-05.jpg",
      alt: "Car transportation from Bangalore to Pune and Mumbai",
      originLat: 12.9716,
      originLng: 77.5946,
      destinationLat: 18.5204,
      destinationLng: 73.8567,
      metaTitle: "Bangalore to Pune & Mumbai Car Transport | Shift My Car",
      metaDescription: "Swift and secure car transport between Bangalore, Pune, and Mumbai. Upfront pricing and comprehensive transit coverage.",
      focusKeyword: "bangalore to mumbai car transport",
      seoHealth: "GOOD" as const,
      order: 5,
    },
    {
      slug: "bangalore-to-delhi",
      number: "06",
      origin: "Bangalore",
      destination: "Delhi",
      title: "Bangalore to Delhi",
      description: "Car transportation from Bangalore to Delhi.",
      detailDescription: "Move your car between Bangalore and Delhi with a transportation service designed around reliable handling, flexible transport options, and a seamless delivery experience.",
      image: "/assets/routes/route-06.jpg",
      alt: "Interstate car transport between Bangalore and Delhi",
      originLat: 12.9716,
      originLng: 77.5946,
      destinationLat: 28.6139,
      destinationLng: 77.209,
      featured: true,
      metaTitle: "Bangalore to Delhi Car Transport | Shift My Car",
      metaDescription: "Ship your car from Bangalore to Delhi NCR safely. Guaranteed multi-car carrier slots with digital inspection checklists.",
      focusKeyword: "bangalore to delhi car transport",
      seoHealth: "GOOD" as const,
      order: 6,
    },
    {
      slug: "bangalore-to-guwahati",
      number: "07",
      origin: "Bangalore",
      destination: "Guwahati",
      title: "Bangalore to Guwahati",
      description: "Car transportation from Bangalore to Guwahati.",
      detailDescription: "Transport your vehicle from Bangalore to Guwahati with professional handling, certified carrier tracking, and secure transit protection across the northeastern corridor.",
      image: "/assets/routes/route-07.jpg",
      alt: "Vehicle carrier route from Bangalore to Guwahati",
      originLat: 12.9716,
      originLng: 77.5946,
      destinationLat: 26.1445,
      destinationLng: 91.7362,
      metaTitle: "Bangalore to Guwahati Car Transport | Shift My Car",
      metaDescription: "Reliable vehicle transportation from Bangalore to Guwahati and Northeast India. Certified carriers and door-to-door handover.",
      focusKeyword: "bangalore to guwahati car transport",
      seoHealth: "GOOD" as const,
      order: 7,
    },
    {
      slug: "delhi-to-ahmedabad",
      number: "08",
      origin: "Delhi",
      destination: "Ahmedabad",
      title: "Delhi to Ahmedabad",
      description: "Car transportation from Delhi to Ahmedabad.",
      detailDescription: "Move your car between Delhi and Ahmedabad with reliable vehicle transportation and flexible service options to suit your move.",
      image: "/assets/routes/highway-01.jpg",
      alt: "Car transportation from Delhi to Ahmedabad",
      originLat: 28.6139,
      originLng: 77.209,
      destinationLat: 23.0225,
      destinationLng: 72.5714,
      metaTitle: "Delhi to Ahmedabad Car Transport | Shift My Car",
      metaDescription: "Safe and punctual car shipping from Delhi to Ahmedabad. Multi-car carrier truck slots with zero highway wear.",
      focusKeyword: "delhi to ahmedabad car transport",
      seoHealth: "GOOD" as const,
      order: 8,
    },
    {
      slug: "delhi-to-surat-vapi",
      number: "09",
      origin: "Delhi",
      destination: "Surat / Vapi",
      title: "Delhi to Surat / Vapi",
      description: "Car transportation from Delhi to Surat and Vapi.",
      detailDescription: "Transport your vehicle from Delhi toward Surat and Vapi with professional coordination and premium automotive care throughout the journey.",
      image: "/assets/routes/highway-02.jpg",
      alt: "Car transportation from Delhi to Surat and Vapi",
      originLat: 28.6139,
      originLng: 77.209,
      destinationLat: 21.1702,
      destinationLng: 72.8311,
      metaTitle: "Delhi to Surat & Vapi Car Transport | Shift My Car",
      metaDescription: "Efficient car transport from Delhi NCR to Surat and Vapi. Enclosed and open carrier options with comprehensive insurance.",
      focusKeyword: "delhi to surat car transport",
      seoHealth: "GOOD" as const,
      order: 9,
    },
    {
      slug: "gurugram-to-guwahati",
      number: "10",
      origin: "Gurugram",
      destination: "Guwahati",
      title: "Gurugram to Guwahati",
      description: "Car transportation from Gurugram (Gurgaon) to Guwahati.",
      detailDescription: "Move your car from Gurugram and Delhi NCR to Guwahati with a dedicated transportation service built around dependable carrier handling, live GPS tracking, and doorstep handover.",
      image: "/assets/routes/carrier-01.jpg",
      alt: "Premium car transport from Gurugram to Guwahati",
      originLat: 28.4595,
      originLng: 77.0266,
      destinationLat: 26.1445,
      destinationLng: 91.7362,
      metaTitle: "Gurugram to Guwahati Car Transport | Shift My Car",
      metaDescription: "Direct vehicle transport from Gurugram & Gurgaon to Guwahati. Secure 18.5m carriers, verified drivers, and live tracking.",
      focusKeyword: "gurugram to guwahati car transport",
      seoHealth: "GOOD" as const,
      order: 10,
    },
    {
      slug: "bangalore-to-ahmedabad",
      number: "11",
      origin: "Bangalore",
      destination: "Ahmedabad",
      title: "Bangalore to Ahmedabad",
      description: "Car transportation from Bangalore to Ahmedabad.",
      detailDescription: "Transport your vehicle from Bangalore to Ahmedabad with reliable handling, flexible transport options, and professional coordination.",
      image: "/assets/routes/route-01.jpg",
      alt: "Vehicle transportation from Bangalore to Ahmedabad",
      originLat: 12.9716,
      originLng: 77.5946,
      destinationLat: 23.0225,
      destinationLng: 72.5714,
      metaTitle: "Bangalore to Ahmedabad Car Transport | Shift My Car",
      metaDescription: "Dependable auto relocation from Bangalore to Ahmedabad. Upfront rates, insurance coverage, and scheduled departures.",
      focusKeyword: "bangalore to ahmedabad car transport",
      seoHealth: "GOOD" as const,
      order: 11,
    },
    {
      slug: "gurgaon-to-kolkata",
      number: "12",
      origin: "Gurgaon",
      destination: "Kolkata",
      title: "Gurgaon to Kolkata",
      description: "Car transportation from Gurgaon to Kolkata.",
      detailDescription: "Move your car between Gurgaon and Kolkata with a premium transportation experience focused on careful handling and dependable delivery.",
      image: "/assets/routes/route-03.jpg",
      alt: "Long-distance car transportation from Gurgaon to Kolkata",
      originLat: 28.4595,
      originLng: 77.0266,
      destinationLat: 22.5726,
      destinationLng: 88.3639,
      metaTitle: "Gurgaon to Kolkata Car Transport | Shift My Car",
      metaDescription: "Professional vehicle transport from Gurgaon (Gurugram) to Kolkata. Certified carriers with doorstep delivery options.",
      focusKeyword: "gurgaon to kolkata car transport",
      seoHealth: "GOOD" as const,
      order: 12,
    },
    {
      slug: "bangalore-to-kolkata",
      number: "13",
      origin: "Bangalore",
      destination: "Kolkata",
      title: "Bangalore to Kolkata",
      description: "Car transportation from Bangalore to Kolkata.",
      detailDescription: "Transport your vehicle from Bangalore to Kolkata with professional automotive handling and a service experience designed for confidence and ease.",
      image: "/assets/routes/route-05.jpg",
      alt: "Interstate vehicle transport from Bangalore to Kolkata",
      originLat: 12.9716,
      originLng: 77.5946,
      destinationLat: 22.5726,
      destinationLng: 88.3639,
      metaTitle: "Bangalore to Kolkata Car Transport | Shift My Car",
      metaDescription: "Smooth interstate car transportation between Bangalore and Kolkata. Complete insurance coverage and milestone notifications.",
      focusKeyword: "bangalore to kolkata car transport",
      seoHealth: "GOOD" as const,
      order: 13,
    },
    {
      slug: "pan-india-car-transportation",
      number: "PAN-INDIA",
      origin: "India",
      destination: "Nationwide",
      title: "Pan-India Car Transportation",
      description: "Reliable vehicle transportation across major cities and destinations throughout India.",
      detailDescription: "Shift My Car connects major cities and destinations across India with premium vehicle transportation — dedicated carriers, shared transport, door-to-door delivery, and express options tailored to your move.",
      image: "/assets/routes/pan-india.jpg",
      alt: "Pan-India premium car transportation across major Indian cities",
      originLat: 22.3511,
      originLng: 78.6677,
      isPanIndia: true,
      featured: true,
      metaTitle: "Pan-India Car Transportation Services | Shift My Car",
      metaDescription: "Nationwide vehicle shipping connecting all major Indian cities. Enclosed trailers, 18.5m multi-car carriers, and full insurance.",
      focusKeyword: "pan india car transportation",
      seoHealth: "GOOD" as const,
      order: 14,
    },
  ];

  for (const r of initialRoutes) {
    await prisma.route.upsert({
      where: { slug: r.slug },
      update: r,
      create: r,
    });
  }
  console.log("Seeded routes successfully");

  const corePages = [
    {
      pagePath: "/",
      pageName: "Home Page",
      metaTitle: "Car Transportation & Shifting Services Across India | Shift My Car",
      metaDescription: "Reliable and efficient vehicle shifting engineered around your schedule. Dedicated carriers, door-to-door delivery, and 18.5m truck shipping with full transit insurance.",
      focusKeyword: "car transportation services",
      seoHealth: "GOOD" as const,
    },
    {
      pagePath: "/about",
      pageName: "About Us",
      metaTitle: "About Shift My Car | Engineering Seamless Vehicle Logistics",
      metaDescription: "Established with a commitment to eliminate the stress of automotive relocation. Learn about our carrier network, team, and nationwide operations.",
      focusKeyword: "about shift my car",
      seoHealth: "GOOD" as const,
    },
    {
      pagePath: "/services",
      pageName: "Services Directory",
      metaTitle: "Car Transportation Services & Delivery Options | Shift My Car",
      metaDescription: "Explore our range of auto relocation solutions: Dedicated Car Transportation, 18.5m Truck Carrier Slots, Door-to-Door Delivery, and Express Delivery.",
      focusKeyword: "car shifting services",
      seoHealth: "GOOD" as const,
    },
    {
      pagePath: "/routes",
      pageName: "Routes Directory",
      metaTitle: "Interstate Car Transport Routes Across India | Shift My Car",
      metaDescription: "Explore all major auto transit corridors across India including Delhi to Bangalore, Bangalore to Guwahati, Gurugram to Guwahati, and Pan-India coverage.",
      focusKeyword: "car transport routes",
      seoHealth: "GOOD" as const,
    },
    {
      pagePath: "/contact",
      pageName: "Contact Us",
      metaTitle: "Contact Shift My Car | Get Instant Car Shifting Quote",
      metaDescription: "Get in touch with our vehicle relocation specialists. Request an instant quote, schedule your carrier pickup, or reach our 24/7 support dispatch.",
      focusKeyword: "contact shift my car",
      seoHealth: "GOOD" as const,
    },
    {
      pagePath: "/privacy-policy",
      pageName: "Privacy Policy",
      metaTitle: "Privacy Policy | Shift My Car",
      metaDescription: "Read the Shift My Car privacy policy regarding data collection, protection, and usage for our vehicle transportation services.",
      focusKeyword: "privacy policy",
      seoHealth: "GOOD" as const,
    },
    {
      pagePath: "/terms-and-conditions",
      pageName: "Terms & Conditions",
      metaTitle: "Terms and Conditions | Shift My Car",
      metaDescription: "Review the terms and conditions governing auto transport bookings, insurance coverage, and carrier operations with Shift My Car.",
      focusKeyword: "terms and conditions",
      seoHealth: "GOOD" as const,
    },
  ];

  for (const p of corePages) {
    await prisma.pageSeo.upsert({
      where: { pagePath: p.pagePath },
      update: p,
      create: p,
    });
  }
  console.log("Seeded page SEO records successfully");
}


main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
