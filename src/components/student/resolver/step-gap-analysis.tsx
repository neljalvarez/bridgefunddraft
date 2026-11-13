"use client";

import { ArrowRight, Info } from "lucide-react";
import { useMemo } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssistanceLegend } from "@/components/student/assistance-legend";
import { GapProgress } from "@/components/student/gap-progress";
import { computeGap } from "@/lib/gap/calculate";
import { convertAmount, formatCurrency } from "@/lib/currency";
import { recommendForOpportunity } from "@/lib/gap/matching";
import { cn } from "@/lib/utils";
import type { DateOnlyString, StudentProfile, SupportResource, TrackedOpportunity } from "@/types";

interface AmountRowProps {
  label: string;
  value: string;
  note?: string;
  indent?: boolean;
  strong?: boolean;
  tone?: "default" | "muted";
}

export function AmountRow({ label, value, note, indent, strong, tone = "default" }: AmountRowProps) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-3", indent && "pl-5")}>
      <div className="min-w-0">
        <dt className={cn("text-sm", strong ? "font-semibold text-navy" : "text-foreground", tone === "muted" && "text-muted-foreground")}>
          {label}
        </dt>
        {note ? <dd className="mt-0.5 text-xs text-muted-foreground">{note}</dd> : null}
      </div>
      <dd className={cn("shrink-0 text-sm font-semibold tabular-nums", strong ? "text-xl text-navy" : "text-navy", tone === "muted" && "text-muted-foreground")}>
        {value}
      </dd>
    </div>
  );
}

interface StepGapAnalysisProps {
  draft: TrackedOpportunity;
  profile: StudentProfile;
  resources: SupportResource[];
  today: DateOnlyString;
}

export function StepGapAnalysis({ draft, profile, resources, today }: StepGapAnalysisProps) {
  const gap = useMemo(() => computeGap(draft), [draft]);
  const money = (n: number) => formatCurrency(n, gap.currency);

  // Matched support not yet in the plan: an upper bound, never counted.
  const matched = useMemo(() => {
    const recs = recommendForOpportunity(draft, profile, resources, today);
    let options = 0;
    let upTo = 0;
    for (const row of gap.perExpense) {
      const expense = draft.expenses.find((e) => e.id === row.expenseId);
      const open = (recs.get(row.expenseId) ?? []).filter((r) => !r.claim);
      if (!expense || open.length === 0) continue;
      options += open.length;
      const valueInBase = open.reduce(
        (sum, r) => sum + convertAmount(r.value, expense.currency, gap.currency),
        0,
      );
      upTo += Math.min(row.uncovered, valueInBase);
    }
    return { options, upTo: Math.round(upTo * 100) / 100 };
  }, [draft, profile, resources, today, gap]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="shadow-none lg:col-span-3">
          <CardHeader>
            <CardTitle>The numbers</CardTitle>
            <CardDescription>
              Only confirmed assistance reduces your gap. Pending support is shown, never counted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              <AmountRow
                label="Original total cost"
                value={money(gap.original)}
                note={gap.mandatoryTotal !== gap.original ? `${money(gap.mandatoryTotal)} is mandatory` : undefined}
              />
              <AmountRow label="Your contribution" value={`− ${money(gap.contribution)}`} />
              <AmountRow label="Confirmed assistance" value={`− ${money(gap.confirmed)}`} note="Approved plus delivered" />
              <AmountRow label="Of which received" value={money(gap.delivered)} indent tone="muted" />
              <AmountRow
                label="Remaining gap"
                value={money(gap.remaining)}
                note="Original cost minus your contribution and confirmed assistance"
                strong
              />
            </dl>
          </CardContent>
        </Card>

        <Card className="shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle>Potential expense reductions</CardTitle>
            <CardDescription>Not counted as funding.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              <AmountRow label="Estimated savings" value={money(gap.estimated)} note="Free alternatives you plan to use" />
              <AmountRow label="Potential savings" value={money(gap.potential)} note="Planned or pending support" />
              <AmountRow
                label="Gap after estimated savings"
                value={money(gap.projected)}
                note="A projection, not a promise"
                tone="muted"
              />
              <AmountRow
                label="Best case if all pending is approved"
                value={money(gap.bestCase)}
                note="Not guaranteed"
                tone="muted"
              />
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardContent className="space-y-5 pt-6">
          <GapProgress totals={gap} />
          <AssistanceLegend totals={gap} className="border-t border-border pt-5" />
        </CardContent>
      </Card>

      {matched.options > 0 ? (
        <div className="flex gap-3 rounded-lg border border-blue-200 bg-accent p-4 text-sm">
          <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-navy">
            We found <strong>{matched.options} matched support option{matched.options === 1 ? "" : "s"}</strong>{" "}
            worth up to <strong>{money(matched.upTo)}</strong> that you haven’t added yet. Continue to
            your resolution plan to choose which to pursue.{" "}
            <ArrowRight className="inline size-4" aria-hidden="true" />
          </p>
        </div>
      ) : (
        <div className="flex gap-3 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>No additional matched support right now. Your plan may already cover every match.</p>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">Coverage for each expense</caption>
          <thead>
            <tr className="border-b border-border bg-background text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-2.5 font-medium">Expense</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Cost</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Confirmed</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Estimated</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Potential</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Uncovered</th>
            </tr>
          </thead>
          <tbody>
            {gap.perExpense.map((row) => (
              <tr key={row.expenseId} className="border-b border-border last:border-b-0">
                <th scope="row" className="px-4 py-3 font-medium text-navy">{row.name}</th>
                <td className="px-4 py-3 text-right tabular-nums">{money(row.amount)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-success-foreground">{money(row.confirmed)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{money(row.estimated)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{money(row.potential)}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums text-navy">{money(row.uncovered)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
