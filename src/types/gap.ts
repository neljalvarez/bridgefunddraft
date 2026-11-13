import type { BarrierCategory } from "./barrier";
import type { DateOnlyString, ID, ISODateString } from "./common";
import type { OpportunityType } from "./opportunity";
import type { VerificationStatus } from "./organization";

/* -------------------------------------------------------------------------
 * Student portal domain model.
 *
 * Amounts on these types are MAJOR units (e.g. 12.50 = twelve dollars fifty),
 * rounded to 2 decimals at calculation time. Each amount carries its own
 * currency, or the owning opportunity's base currency.
 * ---------------------------------------------------------------------- */

export const CURRENCY_CODES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "AED",
  "INR",
  "KES",
  "NGN",
  "GHS",
  "ZAR",
  "BRL",
  "MXN",
  "PHP",
  "SGD",
  "JPY",
] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export const EDUCATION_LEVELS = [
  "secondary",
  "vocational",
  "undergraduate",
  "graduate",
  "doctoral",
  "other",
] as const;
export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export const FIELDS_OF_STUDY = [
  "stem",
  "business",
  "health",
  "social_sciences",
  "humanities",
  "arts",
  "trades",
  "other",
] as const;
export type FieldOfStudy = (typeof FIELDS_OF_STUDY)[number];

export const ENROLLMENT_STATUSES = [
  "enrolled",
  "applying",
  "not_enrolled",
] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

/**
 * The only personal information BridgeFund asks for to match support.
 * Deliberately excludes income, family finances, ID numbers, and immigration
 * status. Providers verify any need-based criteria themselves.
 */
export interface StudentProfile {
  /** ISO 3166-1 alpha-2 code, or "OTHER". Empty until chosen. */
  residenceCountry: string;
  educationLevel: EducationLevel | "";
  fieldOfStudy: FieldOfStudy | "";
  enrollment: EnrollmentStatus | "";
  /** The student agrees to be considered for need-based support. */
  openToNeedBased: boolean;
}

export interface StudentSettings {
  /** Currency used to total amounts across opportunities. */
  currency: CurrencyCode;
}

export interface Expense {
  id: ID;
  name: string;
  amount: number;
  currency: CurrencyCode;
  category: BarrierCategory;
  mandatory: boolean;
  deadline?: DateOnlyString;
}

/* ----------------------------- Support catalog ---------------------------- */

export const RESOURCE_KINDS = [
  "fee_waiver",
  "sponsorship",
  "grant",
  "free_alternative",
  "equipment_loan",
  "other",
] as const;
export type SupportResourceKind = (typeof RESOURCE_KINDS)[number];

export type ResourceValue =
  | { kind: "fixed"; amount: number; currency: CurrencyCode }
  | { kind: "percent"; percent: number }
  | { kind: "full" };

export interface ResourceEligibility {
  /** Plain-language summary shown to students. */
  summary: string;
  /** Residence countries (ISO codes). Omit for "any country". */
  countries?: string[];
  educationLevels?: EducationLevel[];
  opportunityTypes?: OpportunityType[];
  /** Requires the student to have opted in to need-based consideration. */
  needBased?: boolean;
  enrolledOnly?: boolean;
}

export interface SupportResource {
  id: ID;
  name: string;
  provider: string;
  kind: SupportResourceKind;
  description: string;
  /** Expense categories this support can reduce. */
  categories: BarrierCategory[];
  eligibility: ResourceEligibility;
  value: ResourceValue;
  /** Omit for rolling / no fixed deadline. */
  deadline?: DateOnlyString;
  verification: VerificationStatus;
  sourceName: string;
  sourceUrl: string;
}

/* --------------------------------- Claims -------------------------------- */

/**
 * planned  - student intends to pursue it (provider-backed) or use it (free alternative)
 * applied  - submitted, awaiting the provider's decision (PENDING, never counted)
 * approved - provider confirmed; not yet delivered (counted as confirmed)
 * received - delivered to the student (counted as confirmed AND received)
 * declined - provider said no (ignored in all totals)
 */
export const CLAIM_STATUSES = [
  "planned",
  "applied",
  "approved",
  "received",
  "declined",
] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

/** One support item the student has put in their plan for one expense. */
export interface SupportClaim {
  id: ID;
  resourceId: ID;
  /** Snapshots so the plan still reads correctly if the catalog changes. */
  resourceName: string;
  kind: SupportResourceKind;
  expenseId: ID;
  status: ClaimStatus;
  /** Potential value in the EXPENSE's currency when it was added. */
  amount: number;
  /** Provider-confirmed value (expense currency). Used once approved. */
  confirmedAmount?: number;
  receivedAt?: DateOnlyString;
  updatedAt: ISODateString;
}

/* ----------------------------- Opportunities ----------------------------- */

export type OpportunityStatus = "draft" | "active" | "archived";

export interface TrackedOpportunity {
  /** Empty until the first save. */
  id: ID;
  title: string;
  provider: string;
  /** Where the opportunity takes place (ISO code or "OTHER"). */
  country: string;
  type: OpportunityType;
  deadline?: DateOnlyString;
  url?: string;
  description?: string;
  /** Currency used for this opportunity's totals. */
  currency: CurrencyCode;
  expenses: Expense[];
  /** Approximate amount the student can cover, in `currency`. */
  personalContribution: number;
  claims: SupportClaim[];
  status: OpportunityStatus;
  /** Wizard step to resume at (1-6). */
  lastStep: number;
  /** True for fictional demo records. */
  isDemo: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Everything the student portal persists. */
export interface StudentData {
  version: 1;
  profile: StudentProfile;
  settings: StudentSettings;
  opportunities: TrackedOpportunity[];
  savedResourceIds: ID[];
}
