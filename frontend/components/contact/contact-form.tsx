import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  className?: string;
};

const inputClassName =
  "form-field-input w-full resize-none bg-transparent py-2 text-body-sm text-foreground placeholder:text-muted max-md:py-3 max-md:text-body";

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="group flex flex-col gap-1">
      <span className="text-body font-medium">{label}</span>
      <div className="relative">
        {children}
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-muted"
          aria-hidden="true"
        />
        <span
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary",
            "transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            "group-focus-within:scale-x-100",
            "motion-reduce:transition-none motion-reduce:group-focus-within:scale-x-100",
          )}
          aria-hidden="true"
        />
      </div>
    </label>
  );
}

export function ContactForm({ className }: ContactFormProps) {
  return (
    <form className={className} action="#" method="post">
      <div className="flex flex-col gap-8 max-md:gap-6">
        <FormField label="Name">
          <input
            type="text"
            name="name"
            placeholder="Philipe Sam"
            className={inputClassName}
          />
        </FormField>
        <FormField label="Email Address">
          <input
            type="email"
            name="email"
            placeholder="philipe@company.id"
            className={inputClassName}
          />
        </FormField>
        <FormField label="Subject Requirement">
          <input
            type="text"
            name="subject"
            placeholder="what do you need?"
            className={inputClassName}
          />
        </FormField>
        <FormField label="Message">
          <textarea
            name="message"
            rows={5}
            placeholder="Hello there!"
            className={inputClassName}
          />
        </FormField>
        <button
          type="submit"
          className="w-full rounded-badge bg-primary px-4 py-2 text-button text-white"
        >
          Submit Message
        </button>
      </div>
    </form>
  );
}
