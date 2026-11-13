import { RESOURCE_KIND_META } from "@/config/student-options";
import { convertAmount, round2 } from "@/lib/currency";
import type {
  BarrierCategory,
  CurrencyCode,
  SupportClaim,
  SupportResourceKind,
  TrackedOpportunity,
} from "@/types";

/**
 * GAP MATH: the one place that decides what counts as funding.
 *
 * Every claim lands in exactly one bucket:
 *  - declined                         -> ignored
 *  - free alternative (self-directed) -> ESTIMATED savings (never funding)
 *  - provider-backed, planned/applied -> POTENTIAL savings (pending, never funding)
 *  - provider-backed, approved        -> APPROVED assistance (confirmed)
 *  - provider-backed, received        -> DELIVERED assistance (confirmed, received)
 *
 * Confirmed assistance = approved + delivered. Pending support is never
 * added to it. Buckets are capped per expense so nothing is counted twice or
 * exceeds the cost it applies to.
 */

export function isSelfDirected(kind: SupportResourceKind): boolean {
  return RESOURCE_KIND_META[kind].selfDirected;
}

export interface ExpenseGap {
  expenseId: string;
  name: string;
  category: BarrierCategory;
  mandatory: boolean;
  /** All values below are in the opportunity's base currency. */
  amount: number;
  confirmed: number;
  delivered: number;
  estimated: number;
  potential: number;
  /** Amount with no confirmed, estimated, or potential cover. */
  uncovered: number;
}

export interface GapTotals {
  currency: CurrencyCode;
  /** Sum of every expense. */
  original: number;
  /** Sum of mandatory expenses only. */
  mandatoryTotal: number;
  /** The student's own contribution, capped at what is still unfunded. */
  contribution: number;
  /** Approved + delivered. The only assistance counted as funding. */
  confirmed: number;
  /** Subset of confirmed that has actually been received. */
  delivered: number;
  /** Subset of confirmed still awaiting delivery. */
  approved: number;
  /** Free-alternative estimates (per-expense capped). Not funding. */
  estimated: number;
  /** Pending provider support (per-expense capped). Not funding. */
  potential: number;
  /** original - contribution - confirmed. Counts confirmed assistance only. */
  remaining: number;
  /** Part of `estimated` that falls inside the remaining gap. */
  estimatedInGap: number;
  /** Part of `potential` that falls inside the remaining gap. */
  potentialInGap: number;
  /** remaining after estimated savings (a projection). */
  projected: number;
  /** remaining if every pending item were approved too (best case, not guaranteed). */
  bestCase: number;
}

export interface GapSummary extends GapTotals {
  perExpense: ExpenseGap[];
}

const MONEY_KEYS = [
  "original",
  "mandatoryTotal",
  "contribution",
  "confirmed",
  "delivered",
  "approved",
  "estimated",
  "potential",
  "remaining",
  "estimatedInGap",
  "potentialInGap",
  "projected",
  "bestCase",
] as const;

const sum = (values: number[]) =>
  round2(values.reduce((total, value) => total + value, 0));

export function emptyTotals(currency: CurrencyCode): GapTotals {
  return {
    currency,
    original: 0,
    mandatoryTotal: 0,
    contribution: 0,
    confirmed: 0,
    delivered: 0,
    approved: 0,
    estimated: 0,
    potential: 0,
    remaining: 0,
    estimatedInGap: 0,
    potentialInGap: 0,
    projected: 0,
    bestCase: 0,
  };
}

type GapInput = Pick<
  TrackedOpportunity,
  "currency" | "expenses" | "claims" | "personalContribution"
>;

function claimValue(claim: SupportClaim): number {
  return claim.confirmedAmount ?? claim.amount;
}

export function computeGap(input: GapInput): GapSummary {
  const base = input.currency;

  const perExpense: ExpenseGap[] = input.expenses.map((expense) => {
    const toBase = (value: number) =>
      convertAmount(value, expense.currency, base);
    const amount = toBase(expense.amount);
    const claims = input.claims.filter((c) => c.expenseId === expense.id);

    const confirmedRaw = sum(
      claims
        .filter(
          (c) =>
            !isSelfDirected(c.kind) &&
            (c.status === "approved" || c.status === "received"),
        )
        .map((c) => toBase(claimValue(c))),
    );
    const deliveredRaw = sum(
      claims
        .filter((c) => !isSelfDirected(c.kind) && c.status === "received")
        .map((c) => toBase(claimValue(c))),
    );
    const estimatedRaw = sum(
      claims
        .filter((c) => isSelfDirected(c.kind) && c.status !== "declined")
        .map((c) => toBase(c.amount)),
    );
    const potentialRaw = sum(
      claims
        .filter(
          (c) =>
            !isSelfDirected(c.kind) &&
            (c.status === "planned" || c.status === "applied"),
        )
        .map((c) => toBase(c.amount)),
    );

    const confirmed = Math.min(amount, confirmedRaw);
    const delivered = Math.min(confirmed, deliveredRaw);
    const estimated = Math.min(amount - confirmed, estimatedRaw);
    const potential = Math.min(amount - confirmed - estimated, potentialRaw);

    return {
      expenseId: expense.id,
      name: expense.name,
      category: expense.category,
      mandatory: expense.mandatory,
      amount,
      confirmed: round2(confirmed),
      delivered: round2(delivered),
      estimated: round2(estimated),
      potential: round2(potential),
      uncovered: round2(amount - confirmed - estimated - potential),
    };
  });

  const original = sum(perExpense.map((e) => e.amount));
  const mandatoryTotal = sum(
    perExpense.filter((e) => e.mandatory).map((e) => e.amount),
  );
  const confirmed = sum(perExpense.map((e) => e.confirmed));
  const delivered = sum(perExpense.map((e) => e.delivered));
  const estimated = sum(perExpense.map((e) => e.estimated));
  const potential = sum(perExpense.map((e) => e.potential));

  const contribution = round2(
    Math.max(0, Math.min(input.personalContribution, original - confirmed)),
  );
  const remaining = round2(Math.max(0, original - contribution - confirmed));
  const estimatedInGap = round2(Math.min(estimated, remaining));
  const potentialInGap = round2(
    Math.min(potential, remaining - estimatedInGap),
  );

  return {
    currency: base,
    original,
    mandatoryTotal,
    contribution,
    confirmed,
    delivered,
    approved: round2(confirmed - delivered),
    estimated,
    potential,
    remaining,
    estimatedInGap,
    potentialInGap,
    projected: round2(remaining - estimatedInGap),
    bestCase: round2(remaining - estimatedInGap - potentialInGap),
    perExpense,
  };
}

/** Add several summaries together in one display currency. */
export function addTotals(
  list: GapTotals[],
  currency: CurrencyCode,
): GapTotals {
  const total = emptyTotals(currency);
  for (const item of list) {
    for (const key of MONEY_KEYS) {
      total[key] = round2(
        total[key] + convertAmount(item[key], item.currency, currency),
      );
    }
  }
  return total;
}

/** Share of the original cost covered by confirmed assistance + own contribution. */
export function coveredShare(totals: GapTotals): number {
  if (totals.original <= 0) return 0;
  return Math.min(
    1,
    (totals.confirmed + totals.contribution) / totals.original,
  );
}
