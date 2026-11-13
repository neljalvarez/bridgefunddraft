import { getCountryName } from "@/config/countries";
import { BARRIER_CATEGORY_META } from "@/config/barrier-categories";
import {
  EDUCATION_LEVEL_LABELS,
  OPPORTUNITY_TYPE_LABELS,
} from "@/config/student-options";
import { convertAmount, formatCurrency, round2 } from "@/lib/currency";
import { daysBetween } from "@/lib/dates";
import type {
  DateOnlyString,
  Expense,
  StudentProfile,
  SupportClaim,
  SupportResource,
  TrackedOpportunity,
} from "@/types";

export interface Recommendation {
  resource: SupportResource;
  expenseId: string;
  /** Potential value in the expense's currency, capped at the expense amount. */
  value: number;
  /** Why this matched, in plain language. */
  reasons: string[];
  /** Days until the application deadline; null for rolling. */
  daysLeft: number | null;
  /** The plan item for this resource + expense, if the student added one. */
  claim: SupportClaim | null;
}

/** Potential value of a resource for one expense, in the expense's currency. */
export function resourceValueFor(
  resource: SupportResource,
  expense: Pick<Expense, "amount" | "currency">,
): number {
  const { value } = resource;
  if (value.kind === "full") return expense.amount;
  if (value.kind === "percent") {
    return round2((expense.amount * value.percent) / 100);
  }
  return Math.min(
    expense.amount,
    convertAmount(value.amount, value.currency, expense.currency),
  );
}

/** Human description of a resource's value independent of any expense. */
export function describeValue(resource: SupportResource): string {
  const { value } = resource;
  if (value.kind === "full") return "Covers the full cost";
  if (value.kind === "percent") return `${value.percent}% of the cost`;
  return `Up to ${formatCurrency(value.amount, value.currency)}`;
}

interface RecommendArgs {
  expense: Expense;
  opportunity: Pick<TrackedOpportunity, "type" | "claims">;
  profile: StudentProfile;
  resources: SupportResource[];
  today: DateOnlyString;
}

/**
 * Support that matches one expense. Every hard rule must pass; a resource that
 * fails any rule is omitted rather than shown as "maybe".
 */
export function recommendForExpense({
  expense,
  opportunity,
  profile,
  resources,
  today,
}: RecommendArgs): Recommendation[] {
  const results: Recommendation[] = [];

  for (const resource of resources) {
    if (resource.verification === "rejected") continue;
    if (!resource.categories.includes(expense.category)) continue;

    const rules = resource.eligibility;
    const reasons = [
      `Covers ${BARRIER_CATEGORY_META[expense.category].label.toLowerCase()} costs`,
    ];

    if (rules.countries) {
      if (!rules.countries.includes(profile.residenceCountry)) continue;
      reasons.push(
        `Open to residents of ${getCountryName(profile.residenceCountry)}`,
      );
    } else {
      reasons.push("Open to students in any country");
    }

    if (rules.educationLevels) {
      if (
        profile.educationLevel === "" ||
        !rules.educationLevels.includes(profile.educationLevel)
      ) {
        continue;
      }
      reasons.push(
        `Open to ${EDUCATION_LEVEL_LABELS[profile.educationLevel].toLowerCase()} students`,
      );
    }

    if (rules.opportunityTypes) {
      if (!rules.opportunityTypes.includes(opportunity.type)) continue;
      reasons.push(
        `For ${OPPORTUNITY_TYPE_LABELS[opportunity.type].toLowerCase()} opportunities`,
      );
    }

    if (rules.needBased) {
      if (!profile.openToNeedBased) continue;
      reasons.push(
        "Need-based: you chose to be considered; the provider verifies need",
      );
    }

    if (rules.enrolledOnly) {
      if (profile.enrollment !== "enrolled") continue;
      reasons.push("For currently enrolled students");
    }

    let daysLeft: number | null = null;
    if (resource.deadline) {
      if (resource.deadline < today) continue; // closed
      daysLeft = daysBetween(today, resource.deadline);
    }

    const value = resourceValueFor(resource, expense);
    if (value <= 0) continue;

    results.push({
      resource,
      expenseId: expense.id,
      value,
      reasons,
      daysLeft,
      claim:
        opportunity.claims.find(
          (c) => c.resourceId === resource.id && c.expenseId === expense.id,
        ) ?? null,
    });
  }

  return results.sort(
    (a, b) =>
      Number(b.resource.verification === "verified") -
        Number(a.resource.verification === "verified") ||
      b.value - a.value ||
      (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity),
  );
}

/** Recommendations for every expense of an opportunity, keyed by expense id. */
export function recommendForOpportunity(
  opportunity: Pick<TrackedOpportunity, "type" | "claims" | "expenses">,
  profile: StudentProfile,
  resources: SupportResource[],
  today: DateOnlyString,
): Map<string, Recommendation[]> {
  const map = new Map<string, Recommendation[]>();
  for (const expense of opportunity.expenses) {
    map.set(
      expense.id,
      recommendForExpense({ expense, opportunity, profile, resources, today }),
    );
  }
  return map;
}
