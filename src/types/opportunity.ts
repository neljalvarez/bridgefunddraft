import type { ID, ISODateString, Money } from "./common";

export type OpportunityType = "program" | "scholarship" | "course" | "exam";

/** An educational opportunity a student may want to pursue. */
export interface Opportunity {
  id: ID;
  title: string;
  type: OpportunityType;
  description: string;
  providerName: string;
  location?: string;
  deadline?: ISODateString;
  estimatedCost?: Money;
  url?: string;
}
