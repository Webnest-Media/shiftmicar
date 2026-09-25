"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type DraggableMarqueeProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
  trackClassName?: string;
  gradient?: boolean;
  gradientColor?: string;
  gradientWidth?: string;
  pauseOnHover?: boolean;
};

function duplicateChildren(children: ReactNode, keyPrefix: string) {
  return Children.map(children, (child, index) => {
    if (!isValidElement(child)) {
      return child;
    }

    const element = child as ReactElement<{ className?: string }>;
    return cloneElement(element, {
      key: `${keyPrefix}-${element.key ?? index}`,
    });
  });
}

export function DraggableMarquee({
  children,
  speed = 35,
  className,
  trackClassName,
  gradient = false,
  gradientColor = "#ffffff",
  gradientWidth = "8rem",
  pauseOnHover = false,
}: DraggableMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef(0);
  const segmentWidthRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isPausedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number | undefined>(undefined);
  const playRef = useRef(true);

  const [play, setPlay] = useState(true);
  const [repeatCount, setRepeatCount] = useState(2);

  useEffect(() => {
    setPlay(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    const width = segmentWidthRef.current;
    if (!track || !width) {
      return;
    }

    let offset = offsetRef.current;
    while (offset <= -width) {
      offset += width;
    }
    while (offset > 0) {
      offset -= width;
    }
    offsetRef.current = offset;
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  }, []);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const segment = segmentRef.current;
    if (!container || !segment) {
      return;
    }

    const segmentWidth = segment.offsetWidth;
    segmentWidthRef.current = segmentWidth;

    if (segmentWidth > 0) {
      const minRepeats = Math.max(2, Math.ceil(container.offsetWidth / segmentWidth) + 1);
      setRepeatCount((current) =>
        current === minRepeats ? current : minRepeats,
      );
    }

    applyTransform();
  }, [applyTransform]);

  useEffect(() => {
    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (segmentRef.current) {
      resizeObserver.observe(segmentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [measure, children]);

  useEffect(() => {
    const tick = (time: number) => {
      if (lastTimeRef.current === undefined) {
        lastTimeRef.current = time;
      }

      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const shouldAnimate =
        playRef.current &&
        !isDraggingRef.current &&
        !isPausedRef.current &&
        segmentWidthRef.current > 0;

      if (shouldAnimate) {
        offsetRef.current -= speed * delta;
        applyTransform();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, applyTransform]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
    containerRef.current?.classList.add("cursor-grabbing");
    containerRef.current?.classList.remove("cursor-grab");
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    offsetRef.current =
      dragStartOffsetRef.current + (event.clientX - dragStartXRef.current);
    applyTransform();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    isDraggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    containerRef.current?.classList.remove("cursor-grabbing");
    containerRef.current?.classList.add("cursor-grab");
    applyTransform();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative cursor-grab overflow-hidden touch-pan-y select-none",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseEnter={() => {
        if (pauseOnHover) {
          isPausedRef.current = true;
        }
      }}
      onMouseLeave={() => {
        if (pauseOnHover) {
          isPausedRef.current = false;
        }
      }}
    >
      {gradient ? (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10"
            style={{
              width: gradientWidth,
              background: `linear-gradient(to right, ${gradientColor}, transparent)`,
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10"
            style={{
              width: gradientWidth,
              background: `linear-gradient(to left, ${gradientColor}, transparent)`,
            }}
            aria-hidden="true"
          />
        </>
      ) : null}

      <div
        ref={trackRef}
        className={cn("flex w-max will-change-transform", trackClassName)}
      >
        {Array.from({ length: repeatCount }, (_, index) => (
          <div
            key={index}
            ref={index === 0 ? segmentRef : undefined}
            className="flex shrink-0"
            aria-hidden={index > 0 ? true : undefined}
          >
            {index === 0 ? children : duplicateChildren(children, `dup-${index}`)}
          </div>
        ))}
      </div>
    </div>
  );
}
