"use client";

import { Phone } from "lucide-react";

export function FloatingContactActions() {
  return (
    <aside
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto"
      aria-label="Quick contact actions"
    >
      {/* WhatsApp Floating Circular Button */}
      <a
        href="https://wa.me/11234567890"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
        className="group relative flex size-14 items-center justify-center rounded-full border border-white/20 bg-primary text-white shadow-[0_8px_22px_rgba(0,57,149,0.45)] transition-all duration-300 hover:scale-110 hover:bg-primary/95 hover:shadow-[0_12px_28px_rgba(0,57,149,0.65)] active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-7 shrink-0 aspect-square text-white transition-transform duration-300 group-hover:scale-105"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.93 11.93 0 0 0 12.06 0C5.46 0 .09 5.37.09 11.97c0 2.11.55 4.17 1.6 6L0 24l6.2-1.62a11.94 11.94 0 0 0 5.86 1.51h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-.1-6.25-1.25-6.25l-.27-.19zM12.07 21.88h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.75.98 1-3.65-.24-.38a9.92 9.92 0 0 1-1.52-5.26c0-5.48 4.46-9.94 9.95-9.94 2.65 0 5.15 1.03 7.02 2.91a9.88 9.88 0 0 1 2.9 7.03c0 5.48-4.46 9.91-9.94 9.91zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52-.18-.01-.38-.01-.58-.01-.2 0-.53.08-.8.38-.28.3-1.06 1.04-1.06 2.53s1.09 2.94 1.24 3.14c.15.2 2.14 3.27 5.19 4.58.73.31 1.3.5 1.74.64.73.23 1.4.2 1.93.12.59-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
        </svg>
      </a>

      {/* Call Floating Circular Button */}
      <a
        href="tel:+11234567890"
        title="Call Shift My Car"
        aria-label="Call Shift My Car"
        className="group relative flex size-14 items-center justify-center rounded-full border border-white/20 bg-primary text-white shadow-[0_8px_22px_rgba(0,57,149,0.45)] transition-all duration-300 hover:scale-110 hover:bg-primary/95 hover:shadow-[0_12px_28px_rgba(0,57,149,0.65)] active:scale-95"
      >
        <Phone className="size-7 shrink-0 aspect-square text-white transition-transform duration-300 group-hover:rotate-12" />
      </a>
    </aside>
  );
}
