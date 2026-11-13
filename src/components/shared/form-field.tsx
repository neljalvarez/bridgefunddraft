import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  /** Must equal the id of the control inside. */
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Label + control + hint + error. Pair the control with `fieldProps`. */
export function Field({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="ml-0.5 text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive-foreground">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Accessibility props linking a control to its hint/error text. */
export function fieldProps(
  id: string,
  opts: { hint?: boolean; error?: string },
) {
  const described = [opts.hint ? `${id}-hint` : "", opts.error ? `${id}-error` : ""]
    .filter(Boolean)
    .join(" ");
  return {
    id,
    "aria-invalid": opts.error ? (true as const) : undefined,
    "aria-describedby": described || undefined,
  };
}
