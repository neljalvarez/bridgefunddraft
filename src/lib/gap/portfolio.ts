import { convertAmount } from "@/lib/currency";
import { daysBetween } from "@/lib/dates";
import type {
  BarrierCategory,
  ChartDatum,
  CurrencyCode,
  DateOnlyString,
  SupportResource,
  TrackedOpportunity,
} from "@/types";
import { BARRIER_CATEGORY_META } from "@/config/barrier-categories";

import { addTotals, computeGap, isSelfDirected, type GapTotals } from "./calculate";

export interface PortfolioSummary {
  active: TrackedOpportunity[];
  drafts: TrackedOpportunity[];
  totals: GapTotals;
  /** Provider-backed claims waiting on a decision. */
  pendingApplications: number;
}

/** Totals across saved (active) opportunities, in the display currency. */
export function summarizePortfolio(
  opportunities: TrackedOpportunity[],
  currency: CurrencyCode,
): PortfolioSummary {
  const active = opportunities.filter((o) => o.status === "active");
  const drafts = opportunities.filter((o) => o.status === "draft");
  return {
    active,
    drafts,
    totals: addTotals(active.map(computeGap), currency),
    pendingApplications: active
      .flatMap((o) => o.claims)
      .filter((c) => !isSelfDirected(c.kind) && c.status === "applied").length,
  };
}

export type DeadlineKind = "opportunity" | "expense" | "support";

export interface DeadlineItem {
  id: string;
  date: DateOnlyString;
  /** Negative when overdue. */
  daysLeft: number;
  kind: DeadlineKind;
  title: string;
  context: string;
  opportunityId: string;
}

/** Deadlines across saved opportunities, soonest first (overdue first of all). */
export function collectDeadlines(
  opportunities: TrackedOpportunity[],
  resources: SupportResource[],
  today: DateOnlyString,
): DeadlineItem[] {
  const resourceById = new Map(resources.map((r) => [r.id, r]));
  const items: DeadlineItem[] = [];

  for (const opp of opportunities) {
    if (opp.status !== "active") continue;

    if (opp.deadline) {
      items.push({
        id: `${opp.id}:deadline`,
        date: opp.deadline,
        daysLeft: daysBetween(today, opp.deadline),
        kind: "opportunity",
        title: `${opp.title} closes`,
        context: opp.provider,
        opportunityId: opp.id,
      });
    }

    for (const expense of opp.expenses) {
      if (!expense.deadline) continue;
      items.push({
        id: `${opp.id}:${expense.id}`,
        date: expense.deadline,
        daysLeft: daysBetween(today, expense.deadline),
        kind: "expense",
        title: `${expense.name} due`,
        context: opp.title,
        opportunityId: opp.id,
      });
    }

    for (const claim of opp.claims) {
      if (isSelfDirected(claim.kind) || claim.status !== "planned") continue;
      const deadline = resourceById.get(claim.resourceId)?.deadline;
      if (!deadline) continue;
      items.push({
        id: `${opp.id}:${claim.id}`,
        date: deadline,
        daysLeft: daysBetween(today, deadline),
        kind: "support",
        title: `Apply: ${claim.resourceName}`,
        context: opp.title,
        opportunityId: opp.id,
      });
    }
  }

  return items.sort((a, b) => a.daysLeft - b.daysLeft);
}

/** Confirmed assistance per expense category, in the display currency. */
export function confirmedByCategory(
  opportunities: TrackedOpportunity[],
  currency: CurrencyCode,
): ChartDatum[] {
  const totals = new Map<BarrierCategory, number>();
  for (const opp of opportunities) {
    if (opp.status !== "active") continue;
    for (const row of computeGap(opp).perExpense) {
      if (row.confirmed <= 0) continue;
      totals.set(
        row.category,
        (totals.get(row.category) ?? 0) +
          convertAmount(row.confirmed, opp.currency, currency),
      );
    }
  }
  return [...totals].map(([category, value]) => ({
    label: BARRIER_CATEGORY_META[category].label,
    value: Math.round(value),
  }));
}

/** Delivered assistance by calendar month (oldest first), display currency. */
export function deliveredByMonth(
  opportunities: TrackedOpportunity[],
  currency: CurrencyCode,
): ChartDatum[] {
  const months = new Map<string, number>();
  for (const opp of opportunities) {
    if (opp.status !== "active") continue;
    const currencyOf = new Map(opp.expenses.map((e) => [e.id, e.currency]));
    for (const claim of opp.claims) {
      if (claim.status !== "received" || !claim.receivedAt) continue;
      const from = currencyOf.get(claim.expenseId);
      if (!from) continue;
      const month = claim.receivedAt.slice(0, 7);
      months.set(
        month,
        (months.get(month) ?? 0) +
          convertAmount(claim.confirmedAmount ?? claim.amount, from, currency),
      );
    }
  }
  return [...months]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      }).format(new Date(`${month}-01T00:00:00Z`)),
      value: Math.round(value),
    }));
}
