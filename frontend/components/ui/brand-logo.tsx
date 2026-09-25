"use client";

import React from "react";
import Image from "next/image";

export type BrandLogoProps = {
  name: string;
  logoUrl?: string;
  className?: string;
  widthDesktop?: number | null;
  heightDesktop?: number | null;
  widthMobile?: number | null;
  heightMobile?: number | null;
  previewMode?: "desktop" | "mobile" | "responsive";
};

const BRAND_SVG_MAP: Record<string, string> = {
  toyota: "/assets/brands/toyota.svg",
  kia: "/assets/brands/kia.svg",
  maruti: "/assets/brands/maruti.svg",
  marutisuzuki: "/assets/brands/maruti.svg",
  mahindra: "/assets/brands/mahindra.svg",
  tata: "/assets/brands/tata.svg",
  tatamotors: "/assets/brands/tata.svg",
  midhani: "/assets/brands/midhani.svg",
  hyundai: "/assets/brands/hyundai.svg",
  honda: "/assets/brands/honda.svg",
  mercedes: "/assets/brands/mercedes.svg",
  mercedesbenz: "/assets/brands/mercedes.svg",
  bmw: "/assets/brands/bmw.svg",
  audi: "/assets/brands/audi.svg",
  porsche: "/assets/brands/porsche.svg",
  ferrari: "/assets/brands/ferrari.svg",
  lamborghini: "/assets/brands/lamborghini.svg",
};

export function BrandLogo({
  name,
  logoUrl,
  className = "",
  widthDesktop,
  heightDesktop,
  widthMobile,
  heightMobile,
  previewMode = "responsive",
}: BrandLogoProps) {
  const normKey = name.toLowerCase().replace(/[\s-_]/g, "");
  const resolvedUrl = logoUrl || BRAND_SVG_MAP[normKey] || "";

  // Defaults: Larger, balanced sizes (desktop 150x42, mobile 105x30)
  const wDesk = widthDesktop && widthDesktop > 0 ? widthDesktop : 150;
  const hDesk = heightDesktop && heightDesktop > 0 ? heightDesktop : 42;
  const wMob = widthMobile && widthMobile > 0 ? widthMobile : 105;
  const hMob = heightMobile && heightMobile > 0 ? heightMobile : 30;

  const isSvg =
    resolvedUrl.toLowerCase().endsWith(".svg") ||
    resolvedUrl.startsWith("/assets/brands/");

  // Dimension styling based on previewMode
  let dimensionClass = "";
  let dimensionStyle: React.CSSProperties = {};

  if (previewMode === "desktop") {
    dimensionStyle = {
      width: `${wDesk}px`,
      height: `${hDesk}px`,
    };
  } else if (previewMode === "mobile") {
    dimensionStyle = {
      width: `${wMob}px`,
      height: `${hMob}px`,
    };
  } else {
    dimensionClass =
      "w-[var(--bw-mob)] h-[var(--bh-mob)] md:w-[var(--bw-desk)] md:h-[var(--bh-desk)]";
    dimensionStyle = {
      "--bw-mob": `${wMob}px`,
      "--bh-mob": `${hMob}px`,
      "--bw-desk": `${wDesk}px`,
      "--bh-desk": `${hDesk}px`,
    } as React.CSSProperties;
  }

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 transition-all duration-200 ${dimensionClass} ${className}`}
      style={dimensionStyle}
      title={name}
    >
      {resolvedUrl ? (
        isSvg ? (
          /* Using standard img for SVG retains crisp vector scaling and viewBox */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={resolvedUrl}
            alt={name}
            className="w-full h-full object-contain pointer-events-none select-none transition-transform"
            loading="lazy"
          />
        ) : (
          <Image
            src={resolvedUrl}
            alt={name}
            fill
            sizes={`${wDesk}px`}
            className="object-contain pointer-events-none select-none"
          />
        )
      ) : (
        <span className="font-bold tracking-wider text-xs md:text-sm text-foreground/85 uppercase text-center px-1">
          {name}
        </span>
      )}
    </div>
  );
}
