"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CmsOption = {
  value: string;
  label: string;
};

function useDismiss(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointer(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) onClose();
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return ref;
}

export function CmsSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  searchable = false,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: CmsOption[];
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useDismiss(open, () => setOpen(false));
  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(needle),
    );
  }, [options, query]);

  return (
    <div className="cms-ctl" ref={ref}>
      <button
        type="button"
        className="cms-ctl-trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? undefined : "cms-ctl-placeholder"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={16} />
      </button>
      {open ? (
        <div className="cms-ctl-panel" role="listbox">
          {searchable ? (
            <input
              className="cms-ctl-search"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          ) : null}
          <div className="cms-ctl-list">
            {filtered.length === 0 ? (
              <p className="cms-ctl-empty">No matches</p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value || "empty"}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={cn(
                    "cms-ctl-option",
                    option.value === value && "is-active",
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span>{option.label}</span>
                  {option.value === value ? <Check size={14} /> : null}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function CmsCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className={cn("cms-check", checked && "is-checked")}
      onClick={() => onChange(!checked)}
    >
      <span className="cms-check-box">{checked ? <Check size={12} /> : null}</span>
      <span>{children}</span>
    </button>
  );
}

export function CmsCheckboxGroup({
  options,
  values,
  onChange,
  className,
}: {
  options: CmsOption[];
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
}) {
  if (options.length === 0) {
    return <p className="cms-hint">No options yet.</p>;
  }

  return (
    <div className={cn("cms-check-grid", className)}>
      {options.map((option) => {
        const checked = values.includes(option.value);
        return (
          <CmsCheckbox
            key={option.value}
            checked={checked}
            onChange={(next) => {
              onChange(
                next
                  ? [...values, option.value]
                  : values.filter((id) => id !== option.value),
              );
            }}
          >
            {option.label}
          </CmsCheckbox>
        );
      })}
    </div>
  );
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseDateValue(value: string) {
  if (!value) return null;
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) return null;
  const [hour, minute] = (timePart || "00:00").split(":").map(Number);
  return { year, month, day, hour: hour || 0, minute: minute || 0 };
}

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

export function CmsDatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  includeTime = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  includeTime?: boolean;
}) {
  const parsed = parseDateValue(value);
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed?.year || now.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month || now.getMonth() + 1);
  const ref = useDismiss(open, () => setOpen(false));

  const days = useMemo(() => {
    const first = new Date(viewYear, viewMonth - 1, 1);
    const offset = (first.getDay() + 6) % 7;
    const count = new Date(viewYear, viewMonth, 0).getDate();
    return Array.from({ length: offset + count }, (_, index) => {
      if (index < offset) return null;
      return index - offset + 1;
    });
  }, [viewYear, viewMonth]);

  const display = parsed
    ? includeTime
      ? `${pad(parsed.day)}/${pad(parsed.month)}/${parsed.year} ${pad(parsed.hour)}:${pad(parsed.minute)}`
      : `${pad(parsed.day)}/${pad(parsed.month)}/${parsed.year}`
    : placeholder;

  function commit(next: { year: number; month: number; day: number; hour: number; minute: number }) {
    const date = `${next.year}-${pad(next.month)}-${pad(next.day)}`;
    onChange(includeTime ? `${date}T${pad(next.hour)}:${pad(next.minute)}` : date);
    if (!includeTime) setOpen(false);
  }

  function shiftMonth(delta: number) {
    const date = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth() + 1);
  }

  return (
    <div className="cms-ctl" ref={ref}>
      <button
        type="button"
        className="cms-ctl-trigger"
        aria-expanded={open}
        onClick={() => {
          const next = parseDateValue(value);
          const current = new Date();
          setViewYear(next?.year || current.getFullYear());
          setViewMonth(next?.month || current.getMonth() + 1);
          setOpen((currentOpen) => !currentOpen);
        }}
      >
        <span className={parsed ? undefined : "cms-ctl-placeholder"}>{display}</span>
        <CalendarIcon size={16} />
      </button>
      {open ? (
        <div className="cms-cal">
          <div className="cms-cal-head">
            <button type="button" className="cms-cal-nav" onClick={() => shiftMonth(-1)}>
              <ChevronLeft size={16} />
            </button>
            <strong>{monthLabel(viewYear, viewMonth)}</strong>
            <button type="button" className="cms-cal-nav" onClick={() => shiftMonth(1)}>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="cms-cal-week">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="cms-cal-grid">
            {days.map((day, index) => {
              if (!day) return <span key={`empty-${index}`} />;
              const active =
                parsed?.year === viewYear &&
                parsed?.month === viewMonth &&
                parsed?.day === day;
              const today =
                now.getFullYear() === viewYear &&
                now.getMonth() + 1 === viewMonth &&
                now.getDate() === day;
              return (
                <button
                  key={day}
                  type="button"
                  className={cn("cms-cal-day", active && "is-active", today && "is-today")}
                  onClick={() =>
                    commit({
                      year: viewYear,
                      month: viewMonth,
                      day,
                      hour: parsed?.hour ?? now.getHours(),
                      minute: parsed?.minute ?? 0,
                    })
                  }
                >
                  {day}
                </button>
              );
            })}
          </div>
          {includeTime ? (
            <div className="cms-cal-time">
              <select
                className="cms-ctl-mini"
                value={pad(parsed?.hour ?? now.getHours())}
                onChange={(e) => {
                  const next = parsed || {
                    year: viewYear,
                    month: viewMonth,
                    day: now.getDate(),
                    hour: 0,
                    minute: 0,
                  };
                  commit({ ...next, hour: Number(e.target.value) });
                }}
              >
                {Array.from({ length: 24 }, (_, hour) => (
                  <option key={hour} value={pad(hour)}>
                    {pad(hour)}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                className="cms-ctl-mini"
                value={pad(parsed?.minute ?? 0)}
                onChange={(e) => {
                  const next = parsed || {
                    year: viewYear,
                    month: viewMonth,
                    day: now.getDate(),
                    hour: now.getHours(),
                    minute: 0,
                  };
                  commit({ ...next, minute: Number(e.target.value) });
                }}
              >
                {Array.from(
                  new Set([
                    parsed?.minute ?? 0,
                    ...Array.from({ length: 12 }, (_, index) => index * 5),
                  ]),
                )
                  .sort((a, b) => a - b)
                  .map((minute) => (
                    <option key={minute} value={pad(minute)}>
                      {pad(minute)}
                    </option>
                  ))}
              </select>
            </div>
          ) : null}
          <div className="cms-cal-actions">
            <button
              type="button"
              className="cms-btn cms-btn-ghost"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              <X size={14} />
              Clear
            </button>
            <button
              type="button"
              className="cms-btn cms-btn-ghost"
              onClick={() =>
                commit({
                  year: now.getFullYear(),
                  month: now.getMonth() + 1,
                  day: now.getDate(),
                  hour: now.getHours(),
                  minute: now.getMinutes(),
                })
              }
            >
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function CmsFilePicker({
  accept,
  disabled,
  label = "Choose file",
  onChange,
}: {
  accept?: string;
  disabled?: boolean;
  label?: string;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");

  return (
    <div className="cms-file">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setName(file?.name || "");
          onChange(file);
        }}
      />
      <button
        type="button"
        className="cms-ctl-trigger"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={16} />
        <span className={name ? undefined : "cms-ctl-placeholder"}>
          {name || label}
        </span>
      </button>
    </div>
  );
}
