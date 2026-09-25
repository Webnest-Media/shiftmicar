import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 bg-accent px-3 py-2 text-label text-foreground rounded-badge",
        className,
      )}
    >
      <span
        className="size-2 shrink-0 rounded-full bg-primary"
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
