import type { ID, ISODateString } from "./common";

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface Organization {
  id: ID;
  name: string;
  website?: string;
  verificationStatus: VerificationStatus;
  createdAt: ISODateString;
}
