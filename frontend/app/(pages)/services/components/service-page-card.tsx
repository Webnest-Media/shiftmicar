import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "@/components/animations/image-reveal";
import { assets } from "@/lib/assets";

type ServicePageCardProps = {
  title: string;
  image: string;
  alt: string;
  href: string;
  delay?: number;
};

export function ServicePageCard({
  title,
  image,
  alt,
  href,
  delay = 0,
}: ServicePageCardProps) {
  return (
    <Link
      href={href}
      scroll={false}
      className="group relative block h-[28.75rem] overflow-hidden rounded-badge"
    >
      <ImageReveal
        src={image}
        alt={alt}
        sizes="(min-width: 64rem) 42rem, 100vw"
        className="absolute inset-0 size-full"
        delay={delay}
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-black from-[4%] to-transparent to-[94%]"
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full items-end justify-between p-5">
        <span className="inline-flex items-center gap-2 text-body-sm text-white">
          <span
            className="size-2 shrink-0 rounded-full bg-primary"
            aria-hidden="true"
          />
          {title}
        </span>
        <span className="relative size-4 shrink-0">
          <Image
            src={assets.icons.external}
            alt=""
            fill
            className="object-contain transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
