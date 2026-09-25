"use client";

import { cn } from "@/lib/utils";

type VehicleIconType =
  | "dedicated"
  | "truck"
  | "door-to-door"
  | "express"
  | "handling"
  | "flexible"
  | "delivery"
  | "tracking"
  | "shield"
  | "default";

function getIconType(hint?: string, number?: string): VehicleIconType {
  if (!hint) return "default";
  const lower = hint.toLowerCase();

  if (lower.includes("dedicated") || lower.includes("handling") || lower.includes("one car") || lower.includes("premium")) {
    return "dedicated";
  }
  if (lower.includes("truck") || lower.includes("18.5") || lower.includes("carrier") || lower.includes("flexible") || lower.includes("slot")) {
    return "truck";
  }
  if (lower.includes("door") || lower.includes("delivery") || lower.includes("seamless") || lower.includes("pickup")) {
    return "door-to-door";
  }
  if (lower.includes("express") || lower.includes("speed") || lower.includes("faster") || lower.includes("priority") || lower.includes("timeframe")) {
    return "express";
  }
  if (lower.includes("communication") || lower.includes("gps") || lower.includes("tracking") || lower.includes("updates")) {
    return "tracking";
  }
  if (lower.includes("insurance") || lower.includes("inspection") || lower.includes("safety") || lower.includes("secure")) {
    return "shield";
  }

  // Fallback by number if provided (e.g. 01., 02., 03., 04.)
  if (number) {
    if (number.includes("1")) return "dedicated";
    if (number.includes("2")) return "truck";
    if (number.includes("3")) return "door-to-door";
    if (number.includes("4")) return "express";
  }

  return "default";
}

export function AnimatedVehicleIcon({
  hint,
  number,
  className,
}: {
  hint?: string;
  number?: string;
  className?: string;
}) {
  const iconType = getIconType(hint, number);

  return (
    <div
      className={cn(
        "relative flex items-center justify-start",
        "text-foreground/80 transition-all duration-300",
        "group-hover:text-primary",
        className,
      )}
      aria-hidden="true"
    >
      {/* Render the specific animated SVG vehicle */}
      {iconType === "truck" && <TruckCarrierIcon />}
      {iconType === "dedicated" && <DedicatedCarIcon />}
      {iconType === "door-to-door" && <DoorToDoorCarIcon />}
      {iconType === "express" && <ExpressCarIcon />}
      {iconType === "tracking" && <TrackingCarIcon />}
      {iconType === "shield" && <ShieldCarIcon />}
      {iconType === "default" && <DedicatedCarIcon />}
    </div>
  );
}

/** 18.5m Multi-Car Carrier Truck Icon */
function TruckCarrierIcon() {
  return (
    <div className="relative flex flex-col items-start">
      <svg
        viewBox="0 0 44 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-14 text-foreground/80 transition-all duration-500 group-hover:translate-x-2 group-hover:text-primary"
      >
        {/* Upper tier loaded slot car */}
        <path
          d="M7 7.5L10 4.5H19L22 7.5H7Z"
          fill="currentColor"
          fillOpacity="0.35"
          className="transition-colors group-hover:fill-primary group-hover:fill-opacity-80"
        />
        {/* Carrier Truck Cab & Body (18.5m profile) */}
        <path
          d="M2 17V3.5C2 3.2 2.2 3 2.5 3H26.5C26.8 3 27 3.2 27 3.5V17M27 9H33.5L38 13.5V17H27"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Cargo tier divider rail */}
        <line
          x1="2"
          y1="10"
          x2="27"
          y2="10"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="2 1.5"
          className="opacity-70"
        />
        {/* Lower tier car slot */}
        <rect
          x="6"
          y="12"
          width="15"
          height="4"
          rx="1"
          fill="currentColor"
          fillOpacity="0.25"
          className="transition-colors group-hover:fill-primary group-hover:fill-opacity-50"
        />
        {/* Wheels with spin effect on hover */}
        <g className="origin-[7px_19px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="7" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="7" cy="19" r="1" fill="currentColor" />
        </g>
        <g className="origin-[15px_19px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="15" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="15" cy="19" r="1" fill="currentColor" />
        </g>
        <g className="origin-[33px_19px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="33" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="33" cy="19" r="1" fill="currentColor" />
        </g>
      </svg>
      {/* Road trace */}
      <span className="mt-1 h-[2px] w-12 rounded-full bg-border-muted transition-all duration-500 group-hover:w-14 group-hover:bg-primary/50" />
    </div>
  );
}

/** Dedicated Car Transportation Icon */
function DedicatedCarIcon() {
  return (
    <div className="relative flex flex-col items-start">
      <svg
        viewBox="0 0 38 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-14 text-foreground/80 transition-all duration-500 group-hover:translate-x-2 group-hover:text-primary"
      >
        {/* Aerodynamic Luxury Sedan silhouette */}
        <path
          d="M3 13.5L5.5 8C6 6.8 7.2 6 8.5 6H21.5C23 6 24.3 7 24.8 8.4L27 13.5H35C35.8 13.5 36.5 14.2 36.5 15V16C36.5 16.6 36 17 35.4 17H32M3 13.5H1.5C0.7 13.5 0 14.2 0 15V16C0 16.6 0.5 17 1.1 17H6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Tinted glass windshield */}
        <path
          d="M8.5 7.5L6.5 12.5H14.5V7.5H8.5ZM16.5 7.5V12.5H23.5L21.5 7.5H16.5Z"
          fill="currentColor"
          fillOpacity="0.2"
          className="transition-colors group-hover:fill-primary group-hover:fill-opacity-40"
        />
        {/* Wheels with spin effect */}
        <g className="origin-[10px_17px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="10" cy="17" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="17" r="1.2" fill="currentColor" />
        </g>
        <g className="origin-[27px_17px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="27" cy="17" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="27" cy="17" r="1.2" fill="currentColor" />
        </g>
        {/* Headlight beam */}
        <path
          d="M35 14.5L37.5 14M35 16L37.5 16.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </svg>
      {/* Road trace */}
      <span className="mt-1 h-[2px] w-11 rounded-full bg-border-muted transition-all duration-500 group-hover:w-13 group-hover:bg-primary/50" />
    </div>
  );
}

/** Door-to-Door Car Delivery Icon */
function DoorToDoorCarIcon() {
  return (
    <div className="relative flex flex-col items-start">
      <svg
        viewBox="0 0 38 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-14 text-foreground/80 transition-all duration-500 group-hover:translate-x-2 group-hover:text-primary"
      >
        {/* Destination Location Pin hovering above */}
        <path
          d="M27 1.5C25 1.5 23.5 3 23.5 5C23.5 7.5 27 11 27 11C27 11 30.5 7.5 30.5 5C30.5 3 29 1.5 27 1.5Z"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="1.25"
          className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:fill-primary group-hover:fill-opacity-50"
        />
        <circle cx="27" cy="5" r="1.2" fill="currentColor" />

        {/* Car profile arriving at door */}
        <path
          d="M3 18.5L5.5 13C6 11.8 7.2 11 8.5 11H20C21.5 11 22.8 12 23.3 13.4L25 18.5H32C32.8 18.5 33.5 19.2 33.5 20V21H29M3 18.5H1C0.4 18.5 0 19 0 19.6V21H6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Wheels */}
        <g className="origin-[9px_21px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="9" cy="21" r="3.2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9" cy="21" r="1" fill="currentColor" />
        </g>
        <g className="origin-[25px_21px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="25" cy="21" r="3.2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="25" cy="21" r="1" fill="currentColor" />
        </g>
      </svg>
      {/* Road trace */}
      <span className="mt-1 h-[2px] w-11 rounded-full bg-border-muted transition-all duration-500 group-hover:w-13 group-hover:bg-primary/50" />
    </div>
  );
}

/** Express Car Delivery Icon with speed dashes */
function ExpressCarIcon() {
  return (
    <div className="relative flex flex-col items-start">
      <svg
        viewBox="0 0 42 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-14 text-foreground/80 transition-all duration-500 group-hover:translate-x-2 group-hover:text-primary"
      >
        {/* Speed streak lines behind the vehicle */}
        <line
          x1="0"
          y1="8"
          x2="5"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-40 transition-all duration-300 group-hover:opacity-100"
        />
        <line
          x1="1"
          y1="11"
          x2="7"
          y2="11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-60 transition-all duration-300 group-hover:opacity-100"
        />
        <line
          x1="0"
          y1="14"
          x2="5"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-40 transition-all duration-300 group-hover:opacity-100"
        />

        {/* Sleek Fast Car Silhouette */}
        <path
          d="M9 13.5L12 8C12.6 6.8 13.8 6 15.2 6H27C28.4 6 29.6 6.9 30.1 8.2L32.5 13.5H39C39.8 13.5 40.5 14.2 40.5 15V16C40.5 16.6 40 17 39.4 17H36M9 13.5H7.5C6.7 13.5 6 14.2 6 15V16C6 16.6 6.5 17 7.1 17H12"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Wheels */}
        <g className="origin-[16px_17px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="16" cy="17" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="17" r="1.2" fill="currentColor" />
        </g>
        <g className="origin-[32px_17px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="32" cy="17" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="32" cy="17" r="1.2" fill="currentColor" />
        </g>
      </svg>
      {/* Road trace */}
      <span className="mt-1 h-[2px] w-12 rounded-full bg-border-muted transition-all duration-500 group-hover:w-14 group-hover:bg-primary/50" />
    </div>
  );
}

/** Tracking / Communication Icon */
function TrackingCarIcon() {
  return (
    <div className="relative flex flex-col items-start">
      <svg
        viewBox="0 0 38 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-14 text-foreground/80 transition-all duration-500 group-hover:translate-x-2 group-hover:text-primary"
      >
        {/* Radar communication signal waves */}
        <path
          d="M16 3C18 3 20 4 21 5.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          className="opacity-40 transition-opacity duration-300 group-hover:opacity-100"
        />
        <path
          d="M14 6C15.5 6 17 6.8 17.8 8"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          className="opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        />
        <circle cx="12" cy="9" r="1.5" fill="currentColor" />

        {/* Car profile */}
        <path
          d="M3 18.5L5.5 13C6 11.8 7.2 11 8.5 11H20C21.5 11 22.8 12 23.3 13.4L25 18.5H32C32.8 18.5 33.5 19.2 33.5 20V21H29M3 18.5H1C0.4 18.5 0 19 0 19.6V21H6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Wheels */}
        <g className="origin-[9px_21px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="9" cy="21" r="3.2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9" cy="21" r="1" fill="currentColor" />
        </g>
        <g className="origin-[25px_21px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="25" cy="21" r="3.2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="25" cy="21" r="1" fill="currentColor" />
        </g>
      </svg>
      {/* Road trace */}
      <span className="mt-1 h-[2px] w-11 rounded-full bg-border-muted transition-all duration-500 group-hover:w-13 group-hover:bg-primary/50" />
    </div>
  );
}

/** Shield & Safe Inspection Icon */
function ShieldCarIcon() {
  return (
    <div className="relative flex flex-col items-start">
      <svg
        viewBox="0 0 38 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-14 text-foreground/80 transition-all duration-500 group-hover:translate-x-2 group-hover:text-primary"
      >
        {/* Safety Shield Header */}
        <path
          d="M26 2L31 4V7.5C31 10.5 28.5 13 26 14C23.5 13 21 10.5 21 7.5V4L26 2Z"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="1.25"
          className="transition-transform duration-500 group-hover:scale-105 group-hover:fill-primary group-hover:fill-opacity-40"
        />
        <path d="M24.5 7.5L25.8 8.8L28 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Car profile */}
        <path
          d="M3 18.5L5.5 13C6 11.8 7.2 11 8.5 11H18M25 18.5H32C32.8 18.5 33.5 19.2 33.5 20V21H29M3 18.5H1C0.4 18.5 0 19 0 19.6V21H6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Wheels */}
        <g className="origin-[9px_21px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="9" cy="21" r="3.2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9" cy="21" r="1" fill="currentColor" />
        </g>
        <g className="origin-[25px_21px] transition-transform duration-700 group-hover:rotate-180">
          <circle cx="25" cy="21" r="3.2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="25" cy="21" r="1" fill="currentColor" />
        </g>
      </svg>
      {/* Road trace */}
      <span className="mt-1 h-[2px] w-11 rounded-full bg-border-muted transition-all duration-500 group-hover:w-13 group-hover:bg-primary/50" />
    </div>
  );
}

