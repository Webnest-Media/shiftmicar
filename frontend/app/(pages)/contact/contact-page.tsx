import { ContactFormSection } from "@/app/(pages)/contact/components/contact-form-section";
import { ContactHero } from "@/app/(pages)/contact/components/contact-hero";
import { ContactLocation } from "@/app/(pages)/contact/components/contact-location";

export function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactFormSection />
      <ContactLocation />
    </>
  );
}
