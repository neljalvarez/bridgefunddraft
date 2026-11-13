import { ASSISTANCE_META, ASSISTANCE_ORDER, type AssistanceKind } from "@/config/assistance";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import type { GapTotals } from "@/lib/gap/calculate";
import { cn } from "@/lib/utils";

function amountFor(kind: AssistanceKind, totals: GapTotals): number {
  return {
    delivered: totals.delivered,
    approved: totals.approved,
    potential: totals.potential,
    estimated: totals.estimated,
  }[kind];
}

/**
 * Spells out the four kinds of support and which of them count as funding.
 * Shown wherever amounts are summarised so they are never confused.
 */
export function AssistanceLegend({ totals, className }: { totals: GapTotals; className?: string }) {
  return (
    <dl className={cn("divide-y divide-border", className)}>
      {ASSISTANCE_ORDER.map((kind) => {
        const meta = ASSISTANCE_META[kind];
        return (
          <div key={kind} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <span className={cn("mt-1 size-3 shrink-0 rounded-sm", meta.swatch)} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <dt className="flex flex-wrap items-center gap-2 text-sm font-medium text-navy">
                {meta.label}
                <Badge tone={meta.counted ? "success" : "neutral"}>
                  {meta.counted ? "Counts as funding" : "Not counted"}
                </Badge>
              </dt>
              <dd className="mt-0.5 text-xs text-muted-foreground">{meta.description}</dd>
            </div>
            <span className="shrink-0 text-sm font-semibold text-navy">
              {formatCurrency(amountFor(kind, totals), totals.currency)}
            </span>
          </div>
        );
      })}
    </dl>
  );
}
