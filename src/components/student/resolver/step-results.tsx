"use client";

import { ArrowRight, CalendarClock, CheckCircle2, ExternalLink, ListChecks, Save } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AssistanceLegend } from "@/components/student/assistance-legend";
import { GapProgress } from "@/components/student/gap-progress";
import { StackedProgress } from "@/components/student/stacked-progress";
import { BARRIER_CATEGORY_META } from "@/config/barrier-categories";
import { CLAIM_STATUS_META, OPPORTUNITY_STATUS_META } from "@/config/status";
import { OPPORTUNITY_TYPE_LABELS, RESOURCE_KIND_META } from "@/config/student-options";
import { getCountryName } from "@/config/countries";
import { formatCurrency } from "@/lib/currency";
import { daysBetween, describeDaysLeft } from "@/lib/dates";
import { formatDay } from "@/lib/format";
import { computeGap, coveredShare } from "@/lib/gap/calculate";
import { buildNextActions } from "@/lib/gap/next-actions";
import { cn } from "@/lib/utils";
import type { DateOnlyString, StudentProfile, SupportResource, TrackedOpportunity } from "@/types";

import type { ApplyFn } from "./types";

interface StepResultsProps {
  draft: TrackedOpportunity;
  profile: StudentProfile;
  resources: SupportResource[];
  today: DateOnlyString;
  apply: ApplyFn;
  onSaved: () => void;
}

const PRIORITY_STYLE = {
  urgent: { label: "Urgent", tone: "danger" },
  soon: { label: "Soon", tone: "warning" },
  normal: { label: "Planned", tone: "neutral" },
} as const;

export function StepResults({ draft, profile, resources, today, apply, onSaved }: StepResultsProps) {
  const gap = useMemo(() => computeGap(draft), [draft]);
  const actions = useMemo(
    () => buildNextActions(draft, profile, resources, today),
    [draft, profile, resources, today],
  );
  const money = (n: number) => formatCurrency(n, gap.currency);
  const share = Math.round(coveredShare(gap) * 100);
  const isSaved = draft.status === "active";
  const days = draft.deadline ? daysBetween(today, draft.deadline) : null;
  const status = OPPORTUNITY_STATUS_META[draft.status];

  const save = () => {
    apply((d) => ({ ...d, status: "active", lastStep: 6 }));
    onSaved();
  };

  return (
    <div className="space-y-6">
      {/* Headline */}
      <Card className="shadow-none">
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-navy">{draft.title}</h3>
                <Badge tone={status.tone}>{status.label}</Badge>
                {draft.isDemo ? <Badge tone="warning">Demo</Badge> : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {draft.provider} · {OPPORTUNITY_TYPE_LABELS[draft.type]} · {getCountryName(draft.country)}
              </p>
              {draft.deadline && days !== null ? (
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarClock className="size-4" aria-hidden="true" />
                  Deadline {formatDay(draft.deadline)} · {describeDaysLeft(days)}
                </p>
              ) : null}
              {draft.url ? (
                <a
                  href={draft.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Official page <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">Remaining gap (confirmed only)</p>
              <p className={cn("text-3xl font-semibold tracking-tight", gap.remaining === 0 ? "text-success" : "text-navy")}>
                {money(gap.remaining)}
              </p>
              <p className="text-xs text-muted-foreground">
                of {money(gap.original)} total cost · {share}% covered
              </p>
            </div>
          </div>

          <GapProgress totals={gap} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>How your support is counted</CardTitle>
            <CardDescription>Pending and estimated amounts never reduce your confirmed gap.</CardDescription>
          </CardHeader>
          <CardContent>
            <AssistanceLegend totals={gap} />
            <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Confirmed assistance</dt><dd className="font-semibold text-navy">{money(gap.confirmed)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Gap after estimated savings</dt><dd className="font-semibold text-navy">{money(gap.projected)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Best case if all pending is approved</dt><dd className="font-semibold text-navy">{money(gap.bestCase)}</dd></div>
            </dl>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>By expense</CardTitle>
            <CardDescription>Where each cost stands.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {gap.perExpense.map((row) => (
                <li key={row.expenseId}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium text-navy">{row.name}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {money(row.uncovered)} uncovered of {money(row.amount)}
                    </span>
                  </div>
                  <StackedProgress
                    className="mt-1.5 h-2"
                    total={row.amount}
                    ariaLabel={`${row.name}: ${money(row.confirmed)} confirmed, ${money(row.estimated)} estimated, ${money(row.potential)} potential`}
                    segments={[
                      { key: "c", label: "Confirmed", value: row.confirmed, className: "bg-success" },
                      { key: "e", label: "Estimated", value: row.estimated, className: "bg-blue-300" },
                      { key: "p", label: "Potential", value: row.potential, className: "bg-hatched" },
                    ]}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {BARRIER_CATEGORY_META[row.category].label}
                    {row.mandatory ? "" : " · optional"}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations in the plan */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Your recommended support</CardTitle>
          <CardDescription>
            {draft.claims.length === 0
              ? "Nothing in your plan yet. Go back to the resolution plan to add support."
              : "Update each item’s status under Applications as decisions arrive."}
          </CardDescription>
        </CardHeader>
        {draft.claims.length > 0 ? (
          <CardContent>
            <ul className="divide-y divide-border">
              {draft.claims.map((claim) => {
                const expense = draft.expenses.find((e) => e.id === claim.expenseId);
                return (
                  <li key={claim.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1 basis-56">
                      <p className="text-sm font-medium text-navy">{claim.resourceName}</p>
                      <p className="text-xs text-muted-foreground">
                        {RESOURCE_KIND_META[claim.kind].label} · for {expense?.name ?? "removed expense"}
                      </p>
                    </div>
                    <StatusBadge meta={CLAIM_STATUS_META[claim.status]} />
                    <p className="text-sm font-semibold tabular-nums text-navy">
                      {formatCurrency(claim.confirmedAmount ?? claim.amount, expense?.currency ?? gap.currency)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        ) : null}
      </Card>

      {/* Next actions */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="size-5 text-primary" aria-hidden="true" />
            Next actions
          </CardTitle>
          <CardDescription>Most pressing first.</CardDescription>
        </CardHeader>
        <CardContent>
          {actions.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
              Nothing needs your attention right now.
            </p>
          ) : (
            <ol className="space-y-3">
              {actions.map((action, index) => {
                const priority = PRIORITY_STYLE[action.priority];
                return (
                  <li key={action.id} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-navy">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-navy">
                        {action.title}
                        <Badge tone={priority.tone}>{priority.label}</Badge>
                      </p>
                      <p className="text-xs text-muted-foreground">{action.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>

      {/* Save / revisit */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/50 p-5">
        {isSaved ? (
          <p className="flex items-center gap-2 text-sm font-medium text-success-foreground" role="status">
            <CheckCircle2 className="size-5" aria-hidden="true" />
            Saved to My Opportunities. You can reopen it anytime.
          </p>
        ) : (
          <Button onClick={save}>
            <Save /> Save opportunity
          </Button>
        )}
        <div className="ml-auto flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/student/applications">Track applications</Link>
          </Button>
          <Button asChild variant={isSaved ? "default" : "outline"}>
            <Link href="/student/opportunities">
              My Opportunities <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
