import { newId } from "@/lib/id";
import { round2 } from "@/lib/currency";
import type {
  ClaimStatus,
  DateOnlyString,
  SupportClaim,
  TrackedOpportunity,
} from "@/types";

import { isSelfDirected } from "./calculate";
import type { Recommendation } from "./matching";

/** Put a recommendation into the plan as a "planned" item. */
export function createClaim(rec: Recommendation): SupportClaim {
  return {
    id: newId(),
    resourceId: rec.resource.id,
    resourceName: rec.resource.name,
    kind: rec.resource.kind,
    expenseId: rec.expenseId,
    status: "planned",
    amount: rec.value,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Move a claim to a new status. Approving fixes the confirmed amount (it
 * defaults to the planned value until the student enters the real one);
 * leaving approved/received clears it so it can never linger as funding.
 */
export function applyClaimStatus(
  claim: SupportClaim,
  status: ClaimStatus,
  today: DateOnlyString,
): SupportClaim {
  if (isSelfDirected(claim.kind)) return claim; // estimates have no decision
  const confirmed = status === "approved" || status === "received";
  return {
    ...claim,
    status,
    confirmedAmount: confirmed ? (claim.confirmedAmount ?? claim.amount) : undefined,
    receivedAt: status === "received" ? (claim.receivedAt ?? today) : undefined,
    updatedAt: new Date().toISOString(),
  };
}

export function setConfirmedAmount(
  claim: SupportClaim,
  amount: number,
): SupportClaim {
  return {
    ...claim,
    confirmedAmount: Math.max(0, round2(amount)),
    updatedAt: new Date().toISOString(),
  };
}

export function mapClaim(
  opportunity: TrackedOpportunity,
  claimId: string,
  fn: (claim: SupportClaim) => SupportClaim,
): TrackedOpportunity {
  return {
    ...opportunity,
    claims: opportunity.claims.map((c) => (c.id === claimId ? fn(c) : c)),
  };
}
