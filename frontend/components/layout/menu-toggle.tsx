import { cn } from "@/lib/utils";

type MenuToggleProps = {
  open: boolean;
  className?: string;
};

export function MenuToggle({ open, className }: MenuToggleProps) {
  return (
    <span
      className={cn("relative block h-[0.900375rem] w-9", className)}
      aria-hidden="true"
    >
      <span
        className={cn(
          "absolute left-0 h-0.5 bg-foreground transition-all duration-300 ease-[var(--ease-emphasized)] motion-reduce:transition-none",
          open
            ? "top-1/2 w-full -translate-y-1/2 rotate-45"
            : "top-0 w-full",
        )}
      />
      <span
        className={cn(
          "absolute right-0 h-0.5 bg-foreground transition-all duration-300 ease-[var(--ease-emphasized)] motion-reduce:transition-none",
          open
            ? "top-1/2 w-full -translate-y-1/2 -rotate-45"
            : "bottom-0 w-[77.78%]",
        )}
      />
    </span>
  );
}
