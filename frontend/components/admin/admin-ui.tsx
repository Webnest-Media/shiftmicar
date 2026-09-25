import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="cms-page-header">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="cms-actions">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={cn("cms-card", padded && "cms-card-pad", className)}>
      {children}
    </div>
  );
}

export function AdminField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="cms-field">
      <span>{label}</span>
      {children}
      {hint ? <span className="cms-hint">{hint}</span> : null}
    </div>
  );
}

export const adminInputClass = "cms-input";
export const adminSelectClass = "cms-select";
export const adminTextareaClass = "cms-textarea";
export const adminBtnPrimary = "cms-btn cms-btn-primary";
export const adminBtnSecondary = "cms-btn cms-btn-secondary";
export const adminBtnDanger = "cms-btn cms-btn-danger";
export const adminBtnGhost = "cms-btn cms-btn-ghost";

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "PUBLISHED"
      ? "cms-badge-published"
      : status === "SCHEDULED"
        ? "cms-badge-scheduled"
        : "cms-badge-draft";

  return <span className={cn("cms-badge", tone)}>{status}</span>;
}

export function SeoStatusBadge({ health }: { health?: string | null }) {
  const tone =
    health === "GOOD"
      ? "cms-badge-published"
      : health === "NEEDS_ATTENTION"
        ? "cms-badge-scheduled"
        : "cms-badge-draft";
  const label =
    health === "GOOD"
      ? "Good"
      : health === "NEEDS_ATTENTION"
        ? "Needs Attention"
        : "Incomplete";

  return <span className={cn("cms-badge", tone)}>{label}</span>;
}
