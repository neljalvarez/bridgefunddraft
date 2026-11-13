"use client";

import { Info } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BARRIER_CATEGORY_META } from "@/config/barrier-categories";
import { formatCurrency } from "@/lib/currency";
import { createClaim } from "@/lib/gap/claims";
import { computeGap } from "@/lib/gap/calculate";
import { recommendForOpportunity, type Recommendation } from "@/lib/gap/matching";
import type { DateOnlyString, StudentProfile, SupportResource, TrackedOpportunity } from "@/types";

import { ResourceCard } from "./resource-card";
import { StackedProgress } from "./stacked-progress";
import type { ApplyFn } from "./resolver/types";

interface ResolutionPlanProps {
  opportunity: TrackedOpportunity;
  profile: StudentProfile;
  resources: SupportResource[];
  today: DateOnlyString;
  savedIds: string[];
  apply: ApplyFn;
  onToggleSave: (resourceId: string) => void;
}

/**
 * Per-expense recommendations with add/remove-from-plan. Used by the Gap
 * Resolver (step 5) and the Funding Matches page.
 */
export function ResolutionPlan({
  opportunity,
  profile,
  resources,
  today,
  savedIds,
  apply,
  onToggleSave,
}: ResolutionPlanProps) {
  const gap = useMemo(() => computeGap(opportunity), [opportunity]);
  const recs = useMemo(
    () => recommendForOpportunity(opportunity, profile, resources, today),
    [opportunity, profile, resources, today],
  );
  const resourceById = useMemo(() => new Map(resources.map((r) => [r.id, r])), [resources]);

  const add = (rec: Recommendation) =>
    apply((d) => ({
      ...d,
      claims: d.claims.some((c) => c.resourceId === rec.resource.id && c.expenseId === rec.expenseId)
        ? d.claims
        : [...d.claims, createClaim(rec)],
    }));
  const remove = (claimId: string) =>
    apply((d) => ({ ...d, claims: d.claims.filter((c) => c.id !== claimId) }));

  return (
    <div className="space-y-6">
      {!profile.residenceCountry ? (
        <div className="flex gap-3 rounded-lg border border-amber-200 bg-warning-soft p-4 text-sm text-warning-foreground">
          <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>
            Matches depend on your country and education level.{" "}
            <Link href={`/student/resolver?opportunity=${opportunity.id}&step=3`} className="font-medium underline">
              Complete your details
            </Link>{" "}
            to see support you’re eligible for.
          </p>
        </div>
      ) : null}

      {opportunity.expenses.map((expense) => {
        const row = gap.perExpense.find((r) => r.expenseId === expense.id);
        const matches = recs.get(expense.id) ?? [];
        // Plan items whose resource no longer matches (e.g. profile changed) stay visible.
        const orphaned: Recommendation[] = opportunity.claims
          .filter((c) => c.expenseId === expense.id && !matches.some((m) => m.resource.id === c.resourceId))
          .flatMap((claim) => {
            const resource = resourceById.get(claim.resourceId);
            return resource
              ? [{ resource, expenseId: expense.id, value: claim.amount, reasons: [], daysLeft: null, claim }]
              : [];
          });
        const items = [...matches, ...orphaned];
        const meta = BARRIER_CATEGORY_META[expense.category];

        return (
          <section key={expense.id} aria-labelledby={`plan-${expense.id}`} className="space-y-3">
            <Card className="p-4 shadow-none">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 id={`plan-${expense.id}`} className="text-base font-semibold text-navy">
                    {expense.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{meta.label}</span>
                    <Badge tone={expense.mandatory ? "info" : "neutral"}>
                      {expense.mandatory ? "Mandatory" : "Optional"}
                    </Badge>
                  </div>
                </div>
                <p className="text-base font-semibold text-navy">
                  {formatCurrency(expense.amount, expense.currency)}
                </p>
              </div>
              {row ? (
                <StackedProgress
                  className="mt-3 h-2"
                  total={row.amount}
                  ariaLabel={`${expense.name}: ${formatCurrency(row.confirmed, gap.currency)} confirmed, ${formatCurrency(row.estimated, gap.currency)} estimated, ${formatCurrency(row.potential, gap.currency)} potential, ${formatCurrency(row.uncovered, gap.currency)} uncovered`}
                  segments={[
                    { key: "c", label: "Confirmed", value: row.confirmed, className: "bg-success" },
                    { key: "e", label: "Estimated", value: row.estimated, className: "bg-blue-300" },
                    { key: "p", label: "Potential", value: row.potential, className: "bg-hatched" },
                  ]}
                />
              ) : null}
            </Card>

            {items.length === 0 ? (
              <p className="rounded-lg border border-dashed border-input bg-card px-4 py-6 text-center text-sm text-muted-foreground">
                No matched support for this expense yet. Consider whether it is optional, or check back
                as new support is verified.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {items.map((rec) => (
                  <li key={`${rec.resource.id}:${expense.id}`}>
                    <ResourceCard
                      resource={rec.resource}
                      today={today}
                      value={{ amount: rec.claim?.amount ?? rec.value, currency: expense.currency }}
                      reasons={rec.reasons}
                      saved={savedIds.includes(rec.resource.id)}
                      onToggleSave={() => onToggleSave(rec.resource.id)}
                      planStatus={rec.claim?.status ?? null}
                      onAdd={() => add(rec)}
                      onRemove={rec.claim ? () => remove(rec.claim!.id) : undefined}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
