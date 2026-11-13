import { ASSISTANCE_META } from "@/config/assistance";
import type { GapTotals } from "@/lib/gap/calculate";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

import { StackedProgress, type ProgressSegment } from "./stacked-progress";

/** The bar's segments always add up to the original total cost. */
export function gapSegments(totals: GapTotals): ProgressSegment[] {
  return [
    { key: "delivered", label: "Delivered", value: totals.delivered, className: ASSISTANCE_META.delivered.swatch },
    { key: "approved", label: "Approved, awaiting delivery", value: totals.approved, className: ASSISTANCE_META.approved.swatch },
    { key: "contribution", label: "Your contribution", value: totals.contribution, className: "bg-slate-400" },
    { key: "estimated", label: "Estimated savings", value: totals.estimatedInGap, className: ASSISTANCE_META.estimated.swatch },
    { key: "potential", label: "Potential savings", value: totals.potentialInGap, className: ASSISTANCE_META.potential.swatch },
    { key: "uncovered", label: "Still uncovered", value: totals.bestCase, className: "bg-slate-200" },
  ];
}

interface GapProgressProps {
  totals: GapTotals;
  /** Hide the legend under the bar (e.g. in compact rows). */
  compact?: boolean;
  className?: string;
}

/** Progress bar for one cost picture, with an optional labelled legend. */
export function GapProgress({ totals, compact = false, className }: GapProgressProps) {
  const segments = gapSegments(totals);
  const money = (n: number) => formatCurrency(n, totals.currency);
  const summary = segments
    .filter((s) => s.value > 0)
    .map((s) => `${s.label} ${money(s.value)}`)
    .join(", ");

  return (
    <div className={className}>
      <StackedProgress
        segments={segments}
        total={totals.original}
        ariaLabel={
          totals.original > 0
            ? `Breakdown of ${money(totals.original)}: ${summary}`
            : "No expenses yet"
        }
        className={compact ? "h-2" : undefined}
      />
      {compact ? null : (
        <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((s) => (
            <li key={s.key} className={cn("flex items-center gap-2", s.value === 0 && "opacity-50")}>
              <span className={cn("size-2.5 shrink-0 rounded-sm", s.className)} aria-hidden="true" />
              <span className="text-muted-foreground">{s.label}</span>
              <span className="ml-auto font-medium text-navy">{money(s.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
