"use client";

import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  FolderOpen,
  HandCoins,
  Hourglass,
  Plus,
  Receipt,
  Target,
} from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PortalSkeleton } from "@/components/shared/portal-skeleton";
import { StatCard } from "@/components/shared/stat-card";
import { AssistanceLegend } from "@/components/student/assistance-legend";
import { DeadlineList } from "@/components/student/deadline-list";
import { GapProgress } from "@/components/student/gap-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RATES_DISCLAIMER } from "@/config/currencies";
import { useStudentPortal } from "@/hooks/use-student-portal";
import { formatCurrency } from "@/lib/currency";
import { computeGap, coveredShare } from "@/lib/gap/calculate";
import { collectDeadlines, summarizePortfolio } from "@/lib/gap/portfolio";

const DEADLINES_SHOWN = 6;

export function DashboardView() {
  const portal = useStudentPortal();
  if (!portal) return <PortalSkeleton />;

  const { data, today, resources, actions } = portal;
  const currency = data.settings.currency;
  const { active, drafts, totals, pendingApplications } = summarizePortfolio(data.opportunities, currency);
  const money = (n: number) => formatCurrency(n, currency);
  const deadlines = collectDeadlines(data.opportunities, resources, today).slice(0, DEADLINES_SHOWN);
  const mixed = active.some((o) => o.currency !== currency || o.expenses.some((e) => e.currency !== o.currency));

  if (data.opportunities.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="Start with an opportunity"
        description="Add an opportunity and its costs, and BridgeFund will show your financial gap and verified ways to close it. Or look around first with clearly labeled fictional demo data."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/student/resolver">
                <Plus /> Start the Gap Resolver
              </Link>
            </Button>
            <Button variant="outline" onClick={() => actions.loadDemo(today)}>
              Explore with demo data
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {drafts.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            <strong className="font-semibold text-navy">{drafts.length}</strong> opportunit
            {drafts.length === 1 ? "y" : "ies"} still in progress. Drafts aren’t included in the totals below.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href="/student/opportunities">Continue drafts</Link>
          </Button>
        </div>
      ) : null}

      {active.length === 0 ? (
        <EmptyState
          compact
          icon={FolderOpen}
          title="No saved opportunities yet"
          description="Finish the Gap Resolver and save an opportunity to see your totals here."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Your financial picture</CardTitle>
                <CardDescription>
                  Across {active.length} saved opportunit{active.length === 1 ? "y" : "ies"}, in {currency}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Remaining financial gap</p>
                    <p className="mt-1 text-4xl font-semibold tracking-tight text-navy">{money(totals.remaining)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Counts confirmed assistance only</p>
                  </div>
                  <Badge tone="success">{Math.round(coveredShare(totals) * 100)}% covered</Badge>
                </div>
                <GapProgress totals={totals} />
                <dl className="grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Gap after estimated savings</dt>
                    <dd className="text-sm font-semibold text-navy">{money(totals.projected)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Best case if all pending is approved</dt>
                    <dd className="text-sm font-semibold text-navy">
                      {money(totals.bestCase)} <span className="font-normal text-muted-foreground">(not guaranteed)</span>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Four kinds of support, kept apart</CardTitle>
                <CardDescription>Only approved and delivered assistance counts as funding.</CardDescription>
              </CardHeader>
              <CardContent>
                <AssistanceLegend totals={totals} />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Active opportunities" value={active.length} icon={FolderOpen} hint="Saved and being tracked" />
            <StatCard label="Original financial expenses" value={money(totals.original)} icon={Receipt} hint={`${money(totals.mandatoryTotal)} mandatory`} />
            <StatCard
              label="Confirmed assistance"
              value={money(totals.confirmed)}
              icon={BadgeCheck}
              hint={`Approved ${money(totals.approved)} + delivered ${money(totals.delivered)}`}
            />
            <StatCard label="Assistance received" value={money(totals.delivered)} icon={HandCoins} hint="Delivered to you" />
            <StatCard
              label="Pending applications"
              value={pendingApplications}
              icon={Hourglass}
              hint={`Awaiting a decision · ${money(totals.potential)} potential, not counted`}
            />
            <StatCard label="Remaining financial gap" value={money(totals.remaining)} icon={Target} hint="After your contribution and confirmed assistance" />
          </div>

          {mixed ? <p className="text-xs text-muted-foreground">{RATES_DISCLAIMER}</p> : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="size-5 text-primary" aria-hidden="true" />
                  Upcoming deadlines
                </CardTitle>
                <CardDescription>Soonest first. Overdue items are flagged.</CardDescription>
              </CardHeader>
              <CardContent>
                {deadlines.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No deadlines on your saved opportunities.</p>
                ) : (
                  <DeadlineList items={deadlines} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active opportunities</CardTitle>
                <CardDescription>Open one to review its plan.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border">
                  {active.map((opp) => {
                    const gap = computeGap(opp);
                    return (
                      <li key={opp.id}>
                        <Link
                          href={`/student/resolver?opportunity=${opp.id}`}
                          className="group block py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="min-w-0 truncate text-sm font-medium text-navy">{opp.title}</p>
                            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatCurrency(gap.remaining, gap.currency)} remaining of {formatCurrency(gap.original, gap.currency)}
                            {opp.isDemo ? " · Demo" : ""}
                          </p>
                          <GapProgress totals={gap} compact className="mt-2" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
