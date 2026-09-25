import { PrismaClient, SeoHealth } from "@prisma/client";
import { analyzeSeo } from "../src/utils/seo-analysis.js";
import type { PrismaClient } from "@prisma/client";

type SeedBlog = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  categorySlug: string;
  tagSlugs: string[];
  relatedSlugs: string[];
  focusKeyword: string;
  secondaryKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  faqItems: Array<{ question: string; answer: string }>;
  publishedAt: Date;
};

const blogs: SeedBlog[] = [
  {
    title: "How to Transport Your Car from Delhi to Bangalore",
    slug: "how-to-transport-your-car-from-delhi-to-bangalore",
    excerpt:
      "A practical guide to moving a car from Delhi to Bangalore — transport options, preparation, and what to confirm before pickup.",
    featuredImage:
      "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1600&q=80",
    featuredImageAlt: "Car on an open highway during an intercity journey in India",
    categorySlug: "car-transportation",
    tagSlugs: ["car-transportation-tag", "car-shipping", "car-transport-routes"],
    relatedSlugs: [
      "dedicated-vs-shared-car-transport",
      "how-to-prepare-your-car-for-door-to-door-transport",
    ],
    focusKeyword: "car transportation from Delhi to Bangalore",
    secondaryKeywords: [
      "Delhi to Bangalore car transport",
      "car carrier Delhi Bangalore",
      "transport car from Delhi to Bangalore",
    ],
    metaTitle: "Car Transport from Delhi to Bangalore",
    metaDescription:
      "Learn how car transportation from Delhi to Bangalore works, including dedicated and shared options, preparation, and questions to ask before booking.",
    publishedAt: new Date("2026-08-12T09:00:00.000Z"),
    faqItems: [
      {
        question: "How long does car transportation take from Delhi to Bangalore?",
        answer:
          "Transit time depends on the route, the transport option you choose, traffic, weather, and operational scheduling. Ask for a current estimate for your dates rather than relying on a generic figure.",
      },
      {
        question: "Can the car be picked up from my address in Delhi?",
        answer:
          "Door-to-door pickup is often available, subject to access, vehicle condition, and the service you book. Confirm pickup and drop points when you request a quote.",
      },
    ],
    content: `
<h2>How car transportation from Delhi to Bangalore works</h2>
<p>Moving a car between Delhi and Bangalore is a long-distance logistics job, not a casual road trip. A professional carrier collects the vehicle, secures it for transit, and delivers it to the agreed destination. The right option depends on the car, the timeline, and how much exclusivity you want on the journey.</p>
<p>If you are comparing this corridor specifically, start with the <a href="/routes/delhi-to-bangalore">Delhi to Bangalore route</a> and then match a service to the vehicle.</p>
<h2>Transportation options</h2>
<h3>Dedicated car transport</h3>
<p>Dedicated movement reserves the carrier for a single vehicle. It is usually chosen for luxury cars, low-clearance cars, or moves where sharing space is not acceptable. See <a href="/services/dedicated-car-transport">dedicated car transport</a> for how that service is structured.</p>
<h3>Shared car transport</h3>
<p>Shared movement places more than one vehicle on the same carrier. It can be a practical choice for standard cars when schedules can flex. Details are outlined under <a href="/services/premium-shared-transport">premium shared transport</a>.</p>
<h2>How much does car transportation cost?</h2>
<p>Cost is quoted against the vehicle, pickup and drop locations, transport mode, and current operational conditions. There is no single public tariff that applies to every Delhi–Bangalore booking. Request a written quote for your car and addresses instead of using informal estimates.</p>
<h2>How to prepare your car</h2>
<p>Remove loose items, note existing marks, keep a modest fuel level, and share any low-clearance or alarm instructions with the operator. A short inspection at pickup and delivery helps both sides record the car’s condition.</p>
<p>Door-to-door collection is covered separately in <a href="/services/door-to-door-delivery">door-to-door delivery</a>.</p>
`,
  },
  {
    title: "Dedicated vs Shared Car Transport: How to Choose",
    slug: "dedicated-vs-shared-car-transport",
    excerpt:
      "Compare dedicated and shared car transport so you can choose based on the vehicle, schedule, and how the car should travel.",
    featuredImage:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
    featuredImageAlt: "Premium car parked before professional vehicle transportation",
    categorySlug: "car-transportation",
    tagSlugs: ["car-transportation-tag", "luxury-car-transport", "automotive-logistics"],
    relatedSlugs: [
      "how-to-transport-your-car-from-delhi-to-bangalore",
      "luxury-car-transportation-across-india",
    ],
    focusKeyword: "dedicated vs shared car transport",
    secondaryKeywords: [
      "dedicated car transport",
      "shared car transportation",
      "car carrier options India",
    ],
    metaTitle: "Dedicated vs Shared Car Transport",
    metaDescription:
      "Understand dedicated versus shared car transport in India, including when exclusive carriage is useful and what to confirm before you book.",
    publishedAt: new Date("2026-08-18T09:00:00.000Z"),
    faqItems: [
      {
        question: "Is dedicated transport always faster?",
        answer:
          "Not automatically. Dedicated carriage can reduce sharing delays, but pickup windows, route permissions, and operating conditions still affect the schedule.",
      },
      {
        question: "Can a luxury car travel on a shared carrier?",
        answer:
          "Some high-value cars can, depending on the carrier setup and handling requirements. Many owners still prefer dedicated movement for exclusivity and simpler loading.",
      },
    ],
    content: `
<h2>Why the distinction matters</h2>
<p>Car transportation in India generally falls into dedicated or shared movement. The difference is not marketing language. It changes who else is on the carrier, how loading is planned, and how much flexibility remains in the schedule.</p>
<h2>Dedicated car transport</h2>
<p>A dedicated service keeps one vehicle on the carrier. That is useful when the car is high-value, time-sensitive, or needs a quieter loading process. Read more on <a href="/services/dedicated-car-transport">dedicated car transport</a>.</p>
<h2>Shared car transport</h2>
<p>Shared transport groups compatible vehicles on the same journey. It can be suitable for regular cars when owners can accept a shared itinerary. See <a href="/services/premium-shared-transport">premium shared transport</a>.</p>
<h2>How to choose</h2>
<p>Match the option to the car, not to a slogan. Ask how the vehicle will be secured, whether other cars will share the load, and how pickup and delivery are confirmed. For pan-India context, the <a href="/routes/pan-india-car-transportation">pan-India car transportation</a> page outlines the wider network.</p>
`,
  },
  {
    title: "How to Prepare Your Car for Door-to-Door Transport",
    slug: "how-to-prepare-your-car-for-door-to-door-transport",
    excerpt:
      "A clear checklist for owners before door-to-door car delivery: documents, condition notes, fuel, and access at pickup.",
    featuredImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80",
    featuredImageAlt: "Car being prepared in a driveway before door-to-door transport",
    categorySlug: "vehicle-logistics",
    tagSlugs: ["door-to-door-car-delivery", "car-shipping", "vehicle-logistics"],
    relatedSlugs: [
      "how-to-transport-your-car-from-delhi-to-bangalore",
      "dealer-to-dealer-car-transportation-in-india",
    ],
    focusKeyword: "prepare your car for door-to-door transport",
    secondaryKeywords: [
      "door-to-door car delivery",
      "car shipping preparation",
      "vehicle pickup checklist",
    ],
    metaTitle: "Prepare Your Car for Door-to-Door Transport",
    metaDescription:
      "Prepare your car for door-to-door transport with a practical checklist covering access, condition notes, personal items, and pickup coordination.",
    publishedAt: new Date("2026-08-22T09:00:00.000Z"),
    faqItems: [
      {
        question: "Should I empty the car completely?",
        answer:
          "Remove loose valuables and items that can shift in transit. Keep registration and any documents the operator asked for available at pickup.",
      },
      {
        question: "How much fuel should be in the tank?",
        answer:
          "A modest fuel level is usually enough for loading and local movement. Confirm any specific request when the pickup is scheduled.",
      },
    ],
    content: `
<h2>Start with access and documents</h2>
<p>Door-to-door car delivery only works smoothly when the carrier can reach the pickup point and the paperwork is ready. Share gate restrictions, basement height limits, and a contact who will be present. The service itself is described on <a href="/services/door-to-door-delivery">door-to-door delivery</a>.</p>
<h2>Record the car’s condition</h2>
<p>Photograph the exterior and note existing scratches or dents before handover. A simple record avoids confusion at delivery. If the car is a luxury or low-clearance model, mention that early so the team can plan loading.</p>
<h2>Reduce what travels inside</h2>
<p>Take out loose electronics, cash, and items that can roll under seats. A tidy cabin also makes inspection easier. For high-value cars, dedicated handling is covered in <a href="/services/dedicated-car-transport">dedicated car transport</a>.</p>
<h2>Stay available on pickup day</h2>
<p>Keep your phone reachable. Operators may need a slightly adjusted window because of traffic or building access. If the move is time-sensitive, discuss <a href="/services/express-car-delivery">express car delivery</a> rather than assuming a standard shared slot.</p>
`,
  },
  {
    title: "Dealer-to-Dealer Car Transportation in India",
    slug: "dealer-to-dealer-car-transportation-in-india",
    excerpt:
      "What dealerships and OEM partners should confirm when moving stock between cities: documentation, handling, and route planning.",
    featuredImage:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80",
    featuredImageAlt: "Row of cars outside a dealership before intercity transportation",
    categorySlug: "vehicle-logistics",
    tagSlugs: ["dealer-transportation", "automotive-logistics", "vehicle-logistics"],
    relatedSlugs: [
      "dedicated-vs-shared-car-transport",
      "luxury-car-transportation-across-india",
    ],
    focusKeyword: "dealer to dealer car transportation",
    secondaryKeywords: [
      "dealer transportation",
      "OEM transportation",
      "automotive logistics India",
    ],
    metaTitle: "Dealer-to-Dealer Car Transportation in India",
    metaDescription:
      "A practical overview of dealer-to-dealer car transportation in India, including stock movement, documentation, and how to brief a logistics partner.",
    publishedAt: new Date("2026-08-26T09:00:00.000Z"),
    faqItems: [
      {
        question: "Can multiple cars move together between dealerships?",
        answer:
          "Yes, when the cars are compatible for shared loading and both locations can receive them. Confirm capacity and delivery windows with the logistics partner.",
      },
      {
        question: "What should a dealer provide before pickup?",
        answer:
          "Stock list, contact at origin and destination, any handling notes, and access instructions for the premises.",
      },
    ],
    content: `
<h2>Stock movement is a logistics process</h2>
<p>Dealer-to-dealer car transportation is about moving inventory between locations with a clear handover, not a one-off owner relocation. The brief should include the model mix, whether cars can share a carrier, and who signs at each end.</p>
<h2>Documentation and handover</h2>
<p>Keep dispatch notes, stock identifiers, and receiver details aligned before the carrier arrives. Incomplete paperwork is a common cause of delay at the destination yard or showroom.</p>
<h2>Choosing a movement style</h2>
<p>High-value or launch stock may need exclusive carriage. Regular stock can often share a load. Compare <a href="/services/dedicated-car-transport">dedicated car transport</a> with <a href="/services/premium-shared-transport">premium shared transport</a> against the actual cars in the batch.</p>
<h2>Routes that dealers use often</h2>
<p>Common corridors include <a href="/routes/delhi-to-mumbai-pune">Delhi to Mumbai / Pune</a>, <a href="/routes/bangalore-to-delhi">Bangalore to Delhi</a>, and <a href="/routes/bangalore-to-pune-mumbai">Bangalore to Pune / Mumbai</a>. Confirm the current operating plan for the dates you need rather than copying an old run sheet.</p>
`,
  },
  {
    title: "Luxury Car Transportation Across India",
    slug: "luxury-car-transportation-across-india",
    excerpt:
      "How premium and high-value cars are moved between cities: handling expectations, exclusive carriage, and what owners should brief in advance.",
    featuredImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    featuredImageAlt: "Luxury sports car prepared for premium vehicle transportation",
    categorySlug: "luxury-vehicles",
    tagSlugs: ["luxury-car-transport", "car-transportation-tag", "door-to-door-car-delivery"],
    relatedSlugs: [
      "dedicated-vs-shared-car-transport",
      "how-to-prepare-your-car-for-door-to-door-transport",
    ],
    focusKeyword: "luxury car transportation",
    secondaryKeywords: [
      "premium car transportation",
      "high-value car shipping",
      "luxury car carrier India",
    ],
    metaTitle: "Luxury Car Transportation Across India",
    metaDescription:
      "Learn how luxury car transportation works across India, including dedicated handling, owner briefing, and door-to-door pickup for premium vehicles.",
    publishedAt: new Date("2026-09-01T09:00:00.000Z"),
    faqItems: [
      {
        question: "Do luxury cars always need a closed carrier?",
        answer:
          "Not in every case. The right setup depends on the car, weather exposure, and the operator’s equipment. Ask what will actually be used for your vehicle.",
      },
      {
        question: "Can pickup happen at a residence?",
        answer:
          "Often yes, if access is suitable. Share ramp, height, and street constraints before the team is dispatched.",
      },
    ],
    content: `
<h2>Premium cars need a specific brief</h2>
<p>Luxury car transportation is still vehicle logistics, but the margin for poor loading or vague instructions is smaller. Owners should describe ground clearance, aftermarket parts, alarm behaviour, and whether the car can be driven onto a carrier.</p>
<h2>Dedicated movement</h2>
<p>Exclusive carriage is the usual starting point for high-value cars. It keeps the load simple and reduces contact with other vehicles. See <a href="/services/dedicated-car-transport">dedicated car transport</a>.</p>
<h2>Door-to-door collection</h2>
<p>Many owners prefer the car to leave from home or a workshop rather than a public yard. That is possible when access is confirmed in advance through <a href="/services/door-to-door-delivery">door-to-door delivery</a>.</p>
<h2>Longer corridors</h2>
<p>Premium cars regularly move on routes such as <a href="/routes/delhi-to-bangalore">Delhi to Bangalore</a>, <a href="/routes/gurugram-to-guwahati">Gurugram to Guwahati</a>, and <a href="/routes/bangalore-to-kolkata">Bangalore to Kolkata</a>. The equipment and the briefing matter more than the city names on the booking.</p>
`,
  },
];

export async function seedBlogs(prisma: PrismaClient, authorId: string) {
  const createdIds: Record<string, string> = {};

  for (const blog of blogs) {
    const category = await prisma.category.findUnique({ where: { slug: blog.categorySlug } });
    const tags = await prisma.tag.findMany({ where: { slug: { in: blog.tagSlugs } } });
    const seoHealth = analyzeSeo({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: blog.featuredImage,
      featuredImageAlt: blog.featuredImageAlt,
      focusKeyword: blog.focusKeyword,
      secondaryKeywords: blog.secondaryKeywords,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      canonicalUrl: null,
      faqItems: blog.faqItems,
    }).health as SeoHealth;

    const saved = await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content.trim(),
        featuredImage: blog.featuredImage,
        featuredImageAlt: blog.featuredImageAlt,
        status: "PUBLISHED",
        publishedAt: blog.publishedAt,
        scheduledAt: null,
        categoryId: category?.id ?? null,
        focusKeyword: blog.focusKeyword,
        secondaryKeywords: blog.secondaryKeywords,
        metaTitle: blog.metaTitle,
        metaDescription: blog.metaDescription,
        ogTitle: blog.metaTitle,
        ogDescription: blog.metaDescription,
        ogImage: blog.featuredImage,
        twitterTitle: blog.metaTitle,
        twitterDescription: blog.metaDescription,
        twitterImage: blog.featuredImage,
        robotsIndex: true,
        robotsFollow: true,
        faqItems: blog.faqItems,
        seoHealth,
      },
      create: {
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content.trim(),
        featuredImage: blog.featuredImage,
        featuredImageAlt: blog.featuredImageAlt,
        status: "PUBLISHED",
        publishedAt: blog.publishedAt,
        authorId,
        categoryId: category?.id ?? null,
        focusKeyword: blog.focusKeyword,
        secondaryKeywords: blog.secondaryKeywords,
        metaTitle: blog.metaTitle,
        metaDescription: blog.metaDescription,
        ogTitle: blog.metaTitle,
        ogDescription: blog.metaDescription,
        ogImage: blog.featuredImage,
        twitterTitle: blog.metaTitle,
        twitterDescription: blog.metaDescription,
        twitterImage: blog.featuredImage,
        robotsIndex: true,
        robotsFollow: true,
        faqItems: blog.faqItems,
        seoHealth,
      },
    });

    await prisma.blogTag.deleteMany({ where: { blogId: saved.id } });
    if (tags.length > 0) {
      await prisma.blogTag.createMany({
        data: tags.map((tag) => ({ blogId: saved.id, tagId: tag.id })),
      });
    }

    createdIds[blog.slug] = saved.id;
  }

  for (const blog of blogs) {
    const fromId = createdIds[blog.slug];
    if (!fromId) continue;
    await prisma.blogRelation.deleteMany({ where: { fromBlogId: fromId } });
    const related = blog.relatedSlugs
      .map((slug) => createdIds[slug])
      .filter((id): id is string => Boolean(id) && id !== fromId);
    if (related.length > 0) {
      await prisma.blogRelation.createMany({
        data: related.map((toBlogId) => ({ fromBlogId: fromId, toBlogId })),
      });
    }
  }

  return Object.keys(createdIds);
}
