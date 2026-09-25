import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

const colSpan = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
} as const;

const colSpanMd = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  11: "md:col-span-11",
  12: "md:col-span-12",
} as const;

const colStart = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
  6: "col-start-6",
  7: "col-start-7",
  8: "col-start-8",
  9: "col-start-9",
  10: "col-start-10",
  11: "col-start-11",
  12: "col-start-12",
} as const;

const colStartMd = {
  1: "md:col-start-1",
  2: "md:col-start-2",
  3: "md:col-start-3",
  4: "md:col-start-4",
  5: "md:col-start-5",
  6: "md:col-start-6",
  7: "md:col-start-7",
  8: "md:col-start-8",
  9: "md:col-start-9",
  10: "md:col-start-10",
  11: "md:col-start-11",
  12: "md:col-start-12",
} as const;

export type GridSpan = keyof typeof colSpan;
export type GridStart = keyof typeof colStart;

type GridColumns = 8 | 12;

export function Grid({
  className,
  children,
  columns = 8,
  as: Comp = "div",
}: {
  className?: string;
  children: ReactNode;
  columns?: GridColumns;
  as?: ElementType;
}) {
  return (
    <Comp
      className={cn("grid w-full min-w-0", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        columnGap: "var(--grid-gutter)",
        rowGap: "var(--grid-gutter)",
      }}
    >
      {children}
    </Comp>
  );
}

export function GridItem({
  span = 8,
  spanMd,
  startMd,
  className,
  children,
  as: Comp = "div",
}: {
  span?: GridSpan;
  spanMd?: GridSpan;
  startMd?: GridStart;
  className?: string;
  children?: ReactNode;
  as?: ElementType;
}) {
  return (
    <Comp
      className={cn(
        "min-w-0",
        colSpan[span],
        spanMd ? colSpanMd[spanMd] : null,
        startMd ? colStartMd[startMd] : null,
        className,
      )}
    >
      {children}
    </Comp>
  );
}
