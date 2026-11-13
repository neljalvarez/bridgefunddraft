"use client";

import { Archive, ArrowRight, CalendarClock, FolderOpen, Plus, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { PortalSkeleton } from "@/components/shared/portal-skeleton";
import { GapProgress } from "@/components/student/gap-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCountryName } from "@/config/countries";
import { OPPORTUNITY_STATUS_META } from "@/config/status";
import { OPPORTUNITY_TYPE_LABELS } from "@/config/student-options";
import { useStudentPortal } from "@/hooks/use-student-portal";
import { formatCurrency } from "@/lib/currency";
import { daysBetween, describeDaysLeft } from "@/lib/dates";
import { formatDay } from "@/lib/format";
import { computeGap } from "@/lib/gap/calculate";
import { cn } from "@/lib/utils";
import type { OpportunityStatus } from "@/types";

type Filter = "all" | OpportunityStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Saved" },
  { value: "draft", label: "Drafts" },
  { value: "archived", label: "Archived" },
];

export function OpportunitiesView() {
  const portal = useStudentPortal();
  const [filter, setFilter] = useState<Filter>("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!portal) return <PortalSkeleton />;
  const { data, today, actions } = portal;
  const all = data.opportunities;

  if (all.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No opportunities yet"
        description="Opportunities you add in the Gap Resolver are saved here so you can come back to them."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/student/resolver">
                <Plus /> Add an opportunity
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

  const visible = filter === "all" ? all.filter((o) => o.status !== "archived") : all.filter((o) => o.status === filter);
  const count = (f: Filter) => (f === "all" ? all.filter((o) => o.status !== "archived").length : all.filter((o) => o.status === f).length);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filter opportunities" className="flex flex-wrap gap-2">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                filter === value ? "border-navy bg-navy text-white" : "border-border bg-card text-navy hover:bg-muted",
              )}
            >
              {label} <span className={filter === value ? "text-white/70" : "text-muted-foreground"}>{count(value)}</span>
            </button>
          ))}
        </div>
        <Button asChild>
          <Link href="/student/resolver">
            <Plus /> New opportunity
          </Link>
        </Button>
      </div>

      {visible.length === 0 ? (
        <EmptyState compact icon={FolderOpen} title="Nothing here" description="No opportunities match this filter." />
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visible.map((opp) => {
            const gap = computeGap(opp);
            const status = OPPORTUNITY_STATUS_META[opp.status];
            const days = opp.deadline ? daysBetween(today, opp.deadline) : null;
            const confirming = confirmDeleteId === opp.id;
            return (
              <li key={opp.id}>
                <Card className="flex h-full flex-col p-5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={status.tone}>{status.label}</Badge>
                    {opp.isDemo ? <Badge tone="warning">Demo</Badge> : null}
                    <Badge tone="neutral">{OPPORTUNITY_TYPE_LABELS[opp.type]}</Badge>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-navy">{opp.title || "Untitled opportunity"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {opp.provider} · {getCountryName(opp.country)}
                  </p>
                  {opp.deadline && days !== null ? (
                    <p className={cn("mt-1 inline-flex items-center gap-1.5 text-xs", days >= 0 && days <= 7 ? "font-medium text-warning-foreground" : "text-muted-foreground")}>
                      <CalendarClock className="size-3.5" aria-hidden="true" />
                      Deadline {formatDay(opp.deadline)} · {describeDaysLeft(days)}
                    </p>
                  ) : null}

                  {opp.expenses.length > 0 ? (
                    <div className="mt-4">
                      <GapProgress totals={gap} compact />
                      <dl className="mt-3 grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <dt className="text-muted-foreground">Total cost</dt>
                          <dd className="mt-0.5 text-sm font-semibold text-navy">{formatCurrency(gap.original, gap.currency)}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Confirmed</dt>
                          <dd className="mt-0.5 text-sm font-semibold text-success-foreground">{formatCurrency(gap.confirmed, gap.currency)}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Remaining gap</dt>
                          <dd className="mt-0.5 text-sm font-semibold text-navy">{formatCurrency(gap.remaining, gap.currency)}</dd>
                        </div>
                      </dl>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">No expenses added yet.</p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    {confirming ? (
                      <>
                        <span className="text-xs text-muted-foreground">Delete this opportunity and its plan?</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            actions.deleteOpportunity(opp.id);
                            setConfirmDeleteId(null);
                          }}
                        >
                          Yes, delete
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmDeleteId(null)}>
                          Keep
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild size="sm">
                          <Link href={`/student/resolver?opportunity=${opp.id}`}>
                            {opp.status === "draft" ? "Continue" : "Open"} <ArrowRight />
                          </Link>
                        </Button>
                        {opp.status === "archived" ? (
                          <Button size="sm" variant="outline" onClick={() => actions.setOpportunityStatus(opp.id, "active")}>
                            <RotateCcw /> Restore
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => actions.setOpportunityStatus(opp.id, "archived")}>
                            <Archive /> Archive
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="ml-auto"
                          aria-label={`Delete ${opp.title || "opportunity"}`}
                          onClick={() => setConfirmDeleteId(opp.id)}
                        >
                          <Trash2 />
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
