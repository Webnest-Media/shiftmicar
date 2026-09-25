import { About } from "@/app/(pages)/home/components/about";
import { Contact } from "@/app/(pages)/home/components/contact";
import { CtaBanner } from "@/app/(pages)/home/components/cta-banner";
import { Faq } from "@/app/(pages)/home/components/faq";
import { Hero } from "@/app/(pages)/home/components/hero";
import { Process } from "@/app/(pages)/home/components/process";
import { Services } from "@/app/(pages)/home/components/services";
import { Testimonials } from "@/app/(pages)/home/components/testimonials";
import { Trust } from "@/app/(pages)/home/components/trust";
import { WhyChooseUs } from "@/app/(pages)/home/components/why-choose-us";
import { fetchPublicPartners, fetchPublicTestimonials } from "@/lib/api";

export async function HomePage() {
  const [testimonials, partners] = await Promise.all([
    fetchPublicTestimonials(),
    fetchPublicPartners(),
  ]);

  return (
    <>
      <Hero />
      <Trust initialPartners={partners} />
      <About />
      <Services />
      <WhyChooseUs />
      <Process />
      <Testimonials initialTestimonials={testimonials} />
      <Contact />
      <Faq />
      <CtaBanner />
    </>
  );
}

