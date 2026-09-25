"use client";

import Image from "next/image";
import { TextReveal } from "@/components/animations/text-reveal";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { DraggableMarquee } from "@/components/ui/draggable-marquee";
import { assets } from "@/lib/assets";
import type { Testimonial } from "@/lib/blog-types";

export type TestimonialItem = {
  id?: string;
  logo?: string | null;
  quote: string;
  name: string;
  role: string;
  rating?: number;
};

const defaultTestimonials: TestimonialItem[] = [
  {
    logo: assets.testimonials[0],
    quote:
      "Shift My Car handled our dealership transfers flawlessly. The shared carrier option was cost-effective, and our vehicles arrived exactly as promised.",
    name: "Jan Fierri",
    role: "Dealership Manager",
  },
  {
    logo: assets.testimonials[1],
    quote:
      "We needed door-to-door delivery for a relocation. They collected our car, transported it safely, and a driver brought it right to our new home.",
    name: "Ayeesha Mulia",
    role: "Car Owner",
  },
  {
    logo: assets.testimonials[2],
    quote:
      "Dedicated transport gave us peace of mind for our classic car. Professional handling throughout — we wouldn't trust anyone else with it.",
    name: "Jacob Onana",
    role: "Classic Car Enthusiast",
  },
  {
    logo: assets.testimonials[3],
    quote:
      "Getting a quote was simple, and the team kept us updated from pickup to delivery. Hassle-free from start to finish.",
    name: "Jang Han Neul",
    role: "Vehicle Buyer",
  },
];

function TestimonialCard({ item }: { item: TestimonialItem }) {
  const logoSrc = item.logo || null;
  const isSvgOrRemote =
    typeof logoSrc === "string" &&
    (logoSrc.endsWith(".svg") || logoSrc.startsWith("http"));

  return (
    <article className="mx-2 w-[78vw] max-w-[19rem] shrink-0 md:mx-2.5 md:w-[25.625rem] md:max-w-[25.625rem]">
      <div className="flex min-h-[14rem] flex-col justify-between rounded-badge bg-white p-4 md:p-5 md:h-(--testimonial-card-height) md:min-h-0 shadow-sm md:shadow-none">
        <div className="relative h-6 w-[5.5rem] md:h-7 md:w-[6.85rem]">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={item.name}
              fill
              unoptimized={isSvgOrRemote}
              className="object-contain object-left"
            />
          ) : (
            <span className="text-xs md:text-body-sm font-semibold opacity-60">
              {item.name}
            </span>
          )}
        </div>
        <p className="text-body-sm md:text-body opacity-82 leading-relaxed line-clamp-5 md:line-clamp-none my-2 md:my-0">
          {item.quote}
        </p>
        <div>
          <p className="text-body-sm md:text-body font-medium">{item.name}</p>
          <p className="text-xs md:text-body-sm opacity-82">{item.role}</p>
        </div>
      </div>
    </article>
  );
}

export function Testimonials({
  initialTestimonials,
}: {
  initialTestimonials?: (Testimonial | TestimonialItem)[];
}) {
  const rawList =
    initialTestimonials && initialTestimonials.length > 0
      ? initialTestimonials
      : defaultTestimonials;

  // When there is only 1 or 2 testimonials, repeat so the marquee can measure and scroll smoothly without leaving empty gaps
  const list =
    rawList.length === 1
      ? [rawList[0], rawList[0], rawList[0], rawList[0]]
      : rawList.length === 2
        ? [...rawList, ...rawList]
        : rawList;

  return (
    <section className="overflow-hidden bg-testimonial-section py-10 md:py-section">
      <Container className="flex flex-col gap-6 md:gap-[6.25rem]">
        <div>
          <Badge className="bg-background">Testimonials</Badge>
          <TextReveal as="h2" className="text-h1 mt-4 md:mt-5">
            What our customers say
          </TextReveal>
        </div>
      </Container>

      <div className="mt-6 md:mt-[6.25rem]">
        <DraggableMarquee
          speed={35}
          pauseOnHover
          gradient
          gradientColor="#f5f1eb"
          gradientWidth="clamp(1.5rem, 6vw, 8rem)"
        >
          {list.map((item, index) => (
            <TestimonialCard
              key={item.id ? `${item.id}-${index}` : `${item.name}-${index}`}
              item={item}
            />
          ))}
        </DraggableMarquee>
      </div>
    </section>
  );
}
