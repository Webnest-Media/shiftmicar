"use client";

import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type HoverTooltipProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function HoverTooltip({ label, children, className }: HoverTooltipProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

  const showTooltip = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={cn("relative", className)}
        title={label}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {tooltip
        ? createPortal(
            <span
              role="tooltip"
              className="pointer-events-none fixed z-(--z-tooltip) -translate-x-1/2 -translate-y-[calc(100%+0.5rem)] whitespace-nowrap rounded-badge bg-foreground px-3 py-1.5 text-body-sm text-white"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {label}
            </span>,
            document.body,
          )
        : null}
    </>
  );
}
