import type { ID, ISODateString, Money } from "./common";

export const BARRIER_CATEGORIES = [
  "tuition",
  "application_fees",
  "exam_fees",
  "learning_materials",
  "technology",
  "transportation",
  "housing",
  "other",
] as const;
export type BarrierCategory = (typeof BARRIER_CATEGORIES)[number];

export type BarrierStatus = "open" | "matched" | "resolved" | "closed";

/** A financial obstacle a student faces in reaching an educational opportunity. */
export interface FinancialBarrier {
  id: ID;
  studentId: ID;
  opportunityId?: ID;
  category: BarrierCategory;
  description: string;
  amountNeeded?: Money;
  neededBy?: ISODateString;
  status: BarrierStatus;
  createdAt: ISODateString;
}
