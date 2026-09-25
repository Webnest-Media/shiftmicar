"use client";

import { useLayoutEffect, useState } from "react";
import { TextReveal } from "@/components/animations/text-reveal";

export function HeroHeadline() {
  const [emphasisReady, setEmphasisReady] = useState(false);

  useLayoutEffect(() => {
    setEmphasisReady(true);
  }, []);

  return (
    <h1
      className="text-display text-white"
      aria-label="Moving Cars. Made Simple."
    >
      <TextReveal as="span" className="block" delay={0.1} immediate>
        Moving Cars.
      </TextReveal>
      {emphasisReady ? (
        <TextReveal
          as="span"
          className="text-display-emphasis block"
          delay={0.2}
          immediate
        >
          Made Simple.
        </TextReveal>
      ) : (
        <span
          className="text-display-emphasis block min-h-[1.1em]"
          aria-hidden="true"
        />
      )}
    </h1>
  );
}
