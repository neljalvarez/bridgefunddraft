import type { ID, ISODateString } from "./common";

export type MatchStatus = "suggested" | "saved" | "dismissed";

/** A suggested pairing between a student's barrier and a support program. */
export interface SupportMatch {
  id: ID;
  studentId: ID;
  barrierId: ID;
  programId: ID;
  status: MatchStatus;
  createdAt: ISODateString;
}
