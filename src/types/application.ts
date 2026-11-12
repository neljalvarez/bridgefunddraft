import type { ID, ISODateString } from "./common";

export const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "declined",
  "withdrawn",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface Application {
  id: ID;
  studentId: ID;
  programId: ID;
  matchId?: ID;
  status: ApplicationStatus;
  submittedAt?: ISODateString;
  updatedAt: ISODateString;
}
