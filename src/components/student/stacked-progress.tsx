import { cn } from "@/lib/utils";

export interface ProgressSegment {
  key: string;
  label: string;
  value: number;
  /** Tailwind classes giving the segment its fill. */
  className: string;
}

interface StackedProgressProps {
  segments: ProgressSegment[];
  /** Full width equals this value. */
  total: number;
  /** Spoken summary for screen readers. */
  ariaLabel: string;
  className?: string;
}

/** A horizontal bar split into proportional segments. Presentation only. */
export function StackedProgress({
  segments,
  total,
  ariaLabel,
  className,
}: StackedProgressProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "flex h-3 w-full overflow-hidden rounded-full bg-slate-200",
        className,
      )}
    >
      {total > 0
        ? segments
            .filter((s) => s.value > 0)
            .map((s) => (
              <div
                key={s.key}
                className={cn("h-full first:rounded-l-full last:rounded-r-full", s.className)}
                style={{ width: `${(s.value / total) * 100}%` }}
              />
            ))
        : null}
    </div>
  );
}
