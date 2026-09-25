import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";
import type { RouteDetail } from "@/lib/routes-content";

type RouteCardProps = {
  route: RouteDetail;
  className?: string;
  variant?: "default" | "featured" | "pan-india";
};

export function RouteCard({
  route,
  className,
  variant = "default",
}: RouteCardProps) {
  const isPanIndia = variant === "pan-india" || route.isPanIndia;

  return (
    <Link
      href={`/routes/${route.slug}`}
      scroll={false}
      className={cn(
        "group relative block overflow-hidden rounded-badge focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        isPanIndia ? "h-[24rem] md:h-[28rem]" : "h-[22rem] md:h-[26rem]",
        className,
      )}
    >
      <Image
        src={route.image}
        alt={route.alt}
        fill
        sizes="(min-width: 64rem) 28rem, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-foreground from-[18%] via-foreground/55 to-foreground/15"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-foreground/10 transition-colors duration-300 group-hover:bg-foreground/0"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "inline-flex items-center rounded-badge px-3 py-1.5 text-label font-semibold",
              isPanIndia ? "bg-white/12 text-accent" : "bg-primary text-white",
            )}
          >
            {route.number}
          </span>
          <span className="relative size-4 shrink-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
            <Image
              src={assets.icons.external}
              alt=""
              fill
              className="object-contain transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {!isPanIndia ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-caption uppercase tracking-[0.08em] text-white/60">
                    From
                  </p>
                  <p className="text-h3 tracking-[-0.05rem]">{route.origin}</p>
                </div>
                <span
                  className="mt-4 text-h3 text-primary"
                  aria-hidden="true"
                >
                  →
                </span>
                <div>
                  <p className="text-caption uppercase tracking-[0.08em] text-white/60">
                    To
                  </p>
                  <p className="text-h3 tracking-[-0.05rem]">
                    {route.destination}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <h3 className="text-h2 tracking-[-0.05rem]">{route.title}</h3>
          )}

          <p className="text-body max-w-[24rem] text-white/82">
            {route.description}
          </p>

          <span className="text-body-sm font-medium text-white transition-colors duration-300 group-hover:text-accent">
            {isPanIndia ? "Explore Pan-India" : "View Route"} →
          </span>
        </div>
      </div>
    </Link>
  );
}
