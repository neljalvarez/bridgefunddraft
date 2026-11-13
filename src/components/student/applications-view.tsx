"use client";

import { FileText, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { PortalSkeleton } from "@/components/shared/portal-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CLAIM_STATUS_META } from "@/config/status";
import { RESOURCE_KIND_META } from "@/config/student-options";
import { useStudentPortal } from "@/hooks/use-student-portal";
import { formatCurrency, parseAmount } from "@/lib/currency";
import { daysBetween, describeDaysLeft } from "@/lib/dates";
import { formatDay } from "@/lib/format";
import { isSelfDirected } from "@/lib/gap/calculate";
import { applyClaimStatus, setConfirmedAmount } from "@/lib/gap/claims";
import { cn } from "@/lib/utils";
import { CLAIM_STATUSES, type ClaimStatus } from "@/types";

type Filter = "all" | ClaimStatus;

export function ApplicationsView() {
  const portal = useStudentPortal();
  const [filter, setFilter] = useState<Filter>("all");

  if (!portal) return <PortalSkeleton />;
  const { data, today, resources, actions } = portal;
  const resourceById = new Map(resources.map((r) => [r.id, r]));

  const rows = data.opportunities
    .filter((o) => o.status !== "archived")
    .flatMap((opp) =>
      opp.claims
        .filter((c) => !isSelfDirected(c.kind))
        .map((claim) => ({ opp, claim, expense: opp.expenses.find((e) => e.id === claim.expenseId) })),
    );

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No applications yet"
        description="Add support to a plan in the Gap Resolver or Funding Matches, then track each application here from planned to received."
        action={
          <Button asChild>
            <Link href="/student/matches">Find funding matches</Link>
          </Button>
        }
      />
    );
  }

  const counts = Object.fromEntries(
    CLAIM_STATUSES.map((s) => [s, rows.filter((r) => r.claim.status === s).length]),
  ) as Record<ClaimStatus, number>;
  const visible = filter === "all" ? rows : rows.filter((r) => r.claim.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-lg border border-blue-200 bg-accent p-4 text-sm text-navy">
        <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <p>
          <strong>You update these statuses.</strong> A pending application is never counted as funding.
          It only counts once you mark it <em>Approved</em> (the provider confirmed it) or <em>Received</em>.
          Free alternatives are estimates and live in your resolution plan.
        </p>
      </div>

      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {(["all", ...CLAIM_STATUSES] as Filter[]).map((value) => (
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
            {value === "all" ? "All" : CLAIM_STATUS_META[value].label}{" "}
            <span className={filter === value ? "text-white/70" : "text-muted-foreground"}>
              {value === "all" ? rows.length : counts[value]}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState compact icon={FileText} title="Nothing here" description="No applications have this status." />
      ) : (
        <ul className="space-y-4">
          {visible.map(({ opp, claim, expense }) => {
            const resource = resourceById.get(claim.resourceId);
            const days = resource?.deadline ? daysBetween(today, resource.deadline) : null;
            const currency = expense?.currency ?? opp.currency;
            const confirmed = claim.status === "approved" || claim.status === "received";
            return (
              <li key={claim.id}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-navy">{claim.resourceName}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <Link href={`/student/resolver?opportunity=${opp.id}&step=6`} className="font-medium text-primary hover:underline">
                          {opp.title}
                        </Link>{" "}
                        · for {expense?.name ?? "removed expense"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge tone="info">{RESOURCE_KIND_META[claim.kind].label}</Badge>
                        {opp.isDemo ? <Badge tone="warning">Demo</Badge> : null}
                      </div>
                    </div>
                    <StatusBadge meta={CLAIM_STATUS_META[claim.status]} />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor={`status-${claim.id}`} className="text-xs font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="mt-1">
                        <Select
                          id={`status-${claim.id}`}
                          value={claim.status}
                          onChange={(e) =>
                            actions.updateClaim(opp.id, claim.id, (c) =>
                              applyClaimStatus(c, e.target.value as ClaimStatus, today),
                            )
                          }
                        >
                          {CLAIM_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {CLAIM_STATUS_META[s].label}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Potential value</p>
                      <p className="mt-2.5 text-sm font-semibold text-navy">{formatCurrency(claim.amount, currency)}</p>
                    </div>

                    <div>
                      {confirmed ? (
                        <>
                          <label htmlFor={`amount-${claim.id}`} className="text-xs font-medium text-muted-foreground">
                            Confirmed amount ({currency})
                          </label>
                          <Input
                            id={`amount-${claim.id}`}
                            key={claim.confirmedAmount}
                            className="mt-1"
                            inputMode="decimal"
                            defaultValue={claim.confirmedAmount ?? claim.amount}
                            onBlur={(e) => {
                              const value = parseAmount(e.target.value);
                              if (value !== null && value !== claim.confirmedAmount) {
                                actions.updateClaim(opp.id, claim.id, (c) => setConfirmedAmount(c, value));
                              }
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-medium text-muted-foreground">Application deadline</p>
                          <p className={cn("mt-2.5 text-sm", days !== null && days >= 0 && days <= 7 && "font-medium text-warning-foreground")}>
                            {resource?.deadline && days !== null
                              ? `${formatDay(resource.deadline)} · ${describeDaysLeft(days)}`
                              : "Rolling"}
                          </p>
                        </>
                      )}
                    </div>
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
