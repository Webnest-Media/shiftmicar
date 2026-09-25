"use client";

import { ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkReveal } from "@/components/animations/link-reveal";
import { ButtonReveal } from "@/components/animations/button-reveal";
import { Container } from "@/components/layout/container";
import { Grid, GridItem } from "@/components/layout/grid";
import { assets } from "@/lib/assets";
import { cn, isNavLinkActive } from "@/lib/utils";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "All Services", href: "/services" },
  { label: "Transport Routes", href: "/routes" },
  { label: "Blog & Guides", href: "/blogs" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
] as const;

const serviceLinks = [
  {
    label: "Dedicated Car Transportation",
    href: "/services/dedicated-car-transport",
  },
  {
    label: "Car Transportation by Truck",
    href: "/services/car-transportation-by-truck",
  },
  {
    label: "Door-to-Door Car Delivery",
    href: "/services/door-to-door-car-delivery",
  },
  {
    label: "Express Car Delivery",
    href: "/services/express-car-delivery",
  },
] as const;

const locationLinks = [
  { label: "Delhi NCR", href: "/routes/delhi-to-bangalore" },
  { label: "Mumbai & Pune", href: "/routes/delhi-to-mumbai-pune" },
  { label: "Bangalore", href: "/routes/delhi-to-bangalore" },
  { label: "Ahmedabad & Gujarat", href: "/routes/delhi-to-ahmedabad-surat-vapi" },
  { label: "Kochi & Malappuram", href: "/routes/delhi-to-kochi-malappuram" },
  { label: "Pan-India Network", href: "/routes#all-routes" },
] as const;

const socialLinks = [
  { label: "WhatsApp", href: "https://wa.me/11234567890" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
] as const;

function FooterLinkGroup({
  title,
  links,
  pathname,
  className,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
  pathname: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p className="text-body font-semibold">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {links.map((link) => {
          const isActive = isNavLinkActive(pathname, link.href);

          return (
            <li key={link.label}>
              <LinkReveal
                href={link.href}
                className={cn(
                  "text-body-sm font-light text-white transition-opacity duration-300",
                  isActive
                    ? "opacity-100 font-medium"
                    : "opacity-40 hover:opacity-100",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </LinkReveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const pathname = usePathname();

  return (
    <footer className="bg-foreground py-20 text-white">
      <Container className="flex flex-col gap-12">
        <Grid className="gap-y-12">
          <GridItem span={8} spanMd={5} className="flex flex-col gap-[4.5rem]">
            <div className="relative h-[1.946rem] w-[14.0625rem]">
              <Image
                src={assets.logoLight}
                alt="Shift My Car"
                fill
                className="object-contain object-left"
              />
            </div>
            <div className="flex flex-col gap-8">
              <p className="max-w-[20.75rem] text-h3 tracking-[-0.05rem]">
                Premium Car Transportation, Simplified.
              </p>
              <ButtonReveal
                href="/contact"
                variant="accent"
                className="w-fit self-start"
              >
                Get a Quote
              </ButtonReveal>
            </div>
          </GridItem>
          <GridItem
            span={8}
            spanMd={3}
            className="flex flex-col justify-between gap-8 md:items-end"
          >
            <p className="text-body-sm opacity-90 md:text-right">
              2026 © Shift My Car. All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-6">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-button"
                  >
                    {link.label}
                    <span className="relative size-4 shrink-0">
                      <Image src={assets.icons.external} alt="" fill />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </GridItem>
        </Grid>
        <div className="border-t border-surface pt-6">
          <Grid className="gap-y-8">
            <GridItem span={8} className="w-full">
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <FooterLinkGroup
                  title="Our Services"
                  links={serviceLinks}
                  pathname={pathname}
                />
                <FooterLinkGroup
                  title="Our Locations"
                  links={locationLinks}
                  pathname={pathname}
                />
                <FooterLinkGroup
                  title="Useful Links"
                  links={quickLinks}
                  pathname={pathname}
                />
                <div className="flex flex-col gap-4">
                  <p className="text-body font-semibold">Contact Details</p>
                  <ul className="flex flex-col gap-2.5 text-body-sm font-light text-white/70">
                    <li>
                      <a
                        href="tel:+11234567890"
                        className="transition-opacity hover:text-white hover:opacity-100"
                      >
                        Call: +1 123 456 7890
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://wa.me/11234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-opacity hover:text-accent hover:opacity-100"
                      >
                        WhatsApp: Chat with Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="mailto:info@shiftmycar.com"
                        className="transition-opacity hover:text-white hover:opacity-100"
                      >
                        info@shiftmycar.com
                      </a>
                    </li>
                    <li>Mon – Sat: 8:00 AM – 6:00 PM</li>
                    <li className="pt-2">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
                      >
                        Request a Free Quote →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </GridItem>
            <GridItem span={8} className="flex justify-start">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-button transition-opacity hover:opacity-80"
              >
                <ArrowUp className="size-4 shrink-0" aria-hidden="true" />
                Back To Top
              </a>
            </GridItem>
          </Grid>
        </div>
      </Container>
    </footer>
  );
}
