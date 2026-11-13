"use client";

import { Handshake, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Field } from "@/components/shared/form-field";
import { PortalSkeleton } from "@/components/shared/portal-skeleton";
import { ResolutionPlan } from "@/components/student/resolution-plan";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useStudentPortal } from "@/hooks/use-student-portal";
import { formatCurrency } from "@/lib/currency";
import { computeGap } from "@/lib/gap/calculate";

export function MatchesView() {
  const portal = useStudentPortal();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!portal) return <PortalSkeleton />;
  const { data, today, resources, actions } = portal;

  const eligible = data.opportunities.filter((o) => o.status !== "archived" && o.expenses.length > 0);

  if (eligible.length === 0) {
    return (
      <EmptyState
        icon={Handshake}
        title="No matches yet"
        description="Matches are found for each expense of an opportunity. Add an opportunity and its costs in the Gap Resolver first."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/student/resolver">
                <Plus /> Open the Gap Resolver
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

  const selected = eligible.find((o) => o.id === selectedId) ?? eligible[0]!;
  const gap = computeGap(selected);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-end sm:justify-between">
        <Field id="match-opportunity" label="Opportunity" className="sm:w-96">
          <Select id="match-opportunity" value={selected.id} onChange={(e) => setSelectedId(e.target.value)}>
            {eligible.map((o) => (
              <option key={o.id} value={o.id}>
                {o.title || "Untitled opportunity"}
              </option>
            ))}
          </Select>
        </Field>
        <dl className="flex gap-6 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">In your plan</dt>
            <dd className="font-semibold text-navy">{selected.claims.length} item{selected.claims.length === 1 ? "" : "s"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Potential (not counted)</dt>
            <dd className="font-semibold text-navy">{formatCurrency(gap.potential, gap.currency)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Remaining gap</dt>
            <dd className="font-semibold text-navy">{formatCurrency(gap.remaining, gap.currency)}</dd>
          </div>
        </dl>
      </div>

      <ResolutionPlan
        key={selected.id}
        opportunity={selected}
        profile={data.profile}
        resources={resources}
        today={today}
        savedIds={data.savedResourceIds}
        apply={(fn) => actions.upsertOpportunity(fn(selected))}
        onToggleSave={actions.toggleSavedResource}
      />
    </div>
  );
}
