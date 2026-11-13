import { formatCurrency } from "@/lib/currency";
import { daysBetween, describeDaysLeft } from "@/lib/dates";
import { formatDay } from "@/lib/format";
import type {
  DateOnlyString,
  StudentProfile,
  SupportResource,
  TrackedOpportunity,
} from "@/types";

import { computeGap, isSelfDirected } from "./calculate";
import { recommendForOpportunity } from "./matching";

export type ActionPriority = "urgent" | "soon" | "normal";

export interface NextAction {
  id: string;
  title: string;
  detail: string;
  priority: ActionPriority;
}

const PRIORITY_RANK: Record<ActionPriority, number> = {
  urgent: 0,
  soon: 1,
  normal: 2,
};

const URGENT_DAYS = 7;
const SOON_DAYS = 21;

function priorityFor(daysLeft: number): ActionPriority {
  if (daysLeft <= URGENT_DAYS) return "urgent";
  if (daysLeft <= SOON_DAYS) return "soon";
  return "normal";
}

/** Concrete things the student should do next, most pressing first. */
export function buildNextActions(
  opportunity: TrackedOpportunity,
  profile: StudentProfile,
  resources: SupportResource[],
  today: DateOnlyString,
): NextAction[] {
  const gap = computeGap(opportunity);
  const resourceById = new Map(resources.map((r) => [r.id, r]));
  const actions: NextAction[] = [];

  for (const claim of opportunity.claims) {
    if (isSelfDirected(claim.kind)) continue;
    const expense = opportunity.expenses.find((e) => e.id === claim.expenseId);
    const forWhat = expense ? ` for ${expense.name.toLowerCase()}` : "";

    if (claim.status === "planned") {
      const deadline = resourceById.get(claim.resourceId)?.deadline;
      if (deadline) {
        const days = daysBetween(today, deadline);
        actions.push({
          id: `apply:${claim.id}`,
          title: `Apply to ${claim.resourceName}`,
          detail: `${describeDaysLeft(days)} · deadline ${formatDay(deadline)}${forWhat}.`,
          priority: days < 0 ? "urgent" : priorityFor(days),
        });
      } else {
        actions.push({
          id: `apply:${claim.id}`,
          title: `Apply to ${claim.resourceName}`,
          detail: `Rolling application${forWhat}.`,
          priority: "normal",
        });
      }
    } else if (claim.status === "applied") {
      actions.push({
        id: `follow:${claim.id}`,
        title: `Follow up on ${claim.resourceName}`,
        detail: "Pending. This is not counted as funding until it is approved.",
        priority: "normal",
      });
    } else if (claim.status === "approved") {
      actions.push({
        id: `deliver:${claim.id}`,
        title: `Confirm delivery from ${claim.resourceName}`,
        detail: "Approved. Mark it received once the support reaches you.",
        priority: "soon",
      });
    }
  }

  // Expenses nothing is covering yet.
  const recs = recommendForOpportunity(opportunity, profile, resources, today);
  for (const row of gap.perExpense) {
    if (row.uncovered < row.amount || row.amount <= 0) continue;
    const options = recs.get(row.expenseId)?.length ?? 0;
    actions.push({
      id: `uncovered:${row.expenseId}`,
      title: `Find cover for ${row.name}`,
      detail:
        options > 0
          ? `${options} matched option${options === 1 ? "" : "s"} available. Add one to your plan.`
          : "No matched support yet. Check Funding Matches again later or reduce this cost.",
      priority: "normal",
    });
  }

  if (opportunity.deadline && gap.bestCase > 0) {
    const days = daysBetween(today, opportunity.deadline);
    if (days >= 0 && days <= 60) {
      actions.push({
        id: "gap-deadline",
        title: "Close the remaining gap before the opportunity deadline",
        detail: `${formatCurrency(gap.bestCase, gap.currency)} still uncovered even if everything pending is approved. Deadline ${formatDay(opportunity.deadline)}.`,
        priority: priorityFor(days),
      });
    }
  }

  return actions
    .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
    .slice(0, 8);
}
