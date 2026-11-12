import type { ID, ISODateString, Money } from "./common";
import type { VerificationStatus } from "./organization";

export type SupportType = "grant" | "scholarship" | "fee_waiver" | "in_kind";

export type ProgramStatus = "draft" | "open" | "paused" | "closed";

/** A financial support program run by a verified organization. */
export interface SupportProgram {
  id: ID;
  organizationId: ID;
  name: string;
  description: string;
  supportType: SupportType;
  fundingAvailable?: Money;
  eligibilitySummary?: string;
  applicationDeadline?: ISODateString;
  status: ProgramStatus;
  verificationStatus: VerificationStatus;
  createdAt: ISODateString;
}
