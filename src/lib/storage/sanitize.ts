import {
  BARRIER_CATEGORIES,
  CLAIM_STATUSES,
  CURRENCY_CODES,
  EDUCATION_LEVELS,
  ENROLLMENT_STATUSES,
  FIELDS_OF_STUDY,
  RESOURCE_KINDS,
  type Expense,
  type StudentData,
  type StudentProfile,
  type SupportClaim,
  type TrackedOpportunity,
} from "@/types";
import { isValidDateOnly } from "@/lib/dates";
import { createEmptyStudentData, EMPTY_PROFILE } from "@/lib/gap/factory";

/**
 * Browser storage can be edited by the user or left by an older app version,
 * so everything read from it is coerced into a valid shape rather than trusted.
 */

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0) =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;
const oneOf = <T extends string>(list: readonly T[], v: unknown, fallback: T): T =>
  list.includes(v as T) ? (v as T) : fallback;
const dateOrUndef = (v: unknown) =>
  typeof v === "string" && isValidDateOnly(v) ? v : undefined;

const OPPORTUNITY_TYPES = ["program", "scholarship", "course", "exam"] as const;
const STATUSES = ["draft", "active", "archived"] as const;

function sanitizeExpense(v: unknown): Expense | null {
  if (!isObj(v) || typeof v.id !== "string" || !v.id) return null;
  return {
    id: v.id,
    name: str(v.name, "Expense"),
    amount: Math.max(0, num(v.amount)),
    currency: oneOf(CURRENCY_CODES, v.currency, "USD"),
    category: oneOf(BARRIER_CATEGORIES, v.category, "other"),
    mandatory: v.mandatory !== false,
    deadline: dateOrUndef(v.deadline),
  };
}

function sanitizeClaim(v: unknown, expenseIds: Set<string>): SupportClaim | null {
  if (!isObj(v) || typeof v.id !== "string" || !v.id) return null;
  const expenseId = str(v.expenseId);
  if (!expenseIds.has(expenseId)) return null;
  return {
    id: v.id,
    resourceId: str(v.resourceId),
    resourceName: str(v.resourceName, "Support"),
    kind: oneOf(RESOURCE_KINDS, v.kind, "other"),
    expenseId,
    status: oneOf(CLAIM_STATUSES, v.status, "planned"),
    amount: Math.max(0, num(v.amount)),
    confirmedAmount:
      typeof v.confirmedAmount === "number" && Number.isFinite(v.confirmedAmount)
        ? Math.max(0, v.confirmedAmount)
        : undefined,
    receivedAt: dateOrUndef(v.receivedAt),
    updatedAt: str(v.updatedAt),
  };
}

function sanitizeOpportunity(v: unknown): TrackedOpportunity | null {
  if (!isObj(v) || typeof v.id !== "string" || !v.id) return null;
  const expenses = (Array.isArray(v.expenses) ? v.expenses : [])
    .map(sanitizeExpense)
    .filter((e): e is Expense => e !== null);
  const expenseIds = new Set(expenses.map((e) => e.id));
  return {
    id: v.id,
    title: str(v.title),
    provider: str(v.provider),
    country: str(v.country),
    type: oneOf(OPPORTUNITY_TYPES, v.type, "program"),
    deadline: dateOrUndef(v.deadline),
    url: typeof v.url === "string" && v.url ? v.url : undefined,
    description: typeof v.description === "string" ? v.description : undefined,
    currency: oneOf(CURRENCY_CODES, v.currency, "USD"),
    expenses,
    personalContribution: Math.max(0, num(v.personalContribution)),
    claims: (Array.isArray(v.claims) ? v.claims : [])
      .map((c) => sanitizeClaim(c, expenseIds))
      .filter((c): c is SupportClaim => c !== null),
    status: oneOf(STATUSES, v.status, "draft"),
    lastStep: Math.min(6, Math.max(1, Math.round(num(v.lastStep, 1)))),
    isDemo: v.isDemo === true,
    createdAt: str(v.createdAt),
    updatedAt: str(v.updatedAt),
  };
}

function sanitizeProfile(v: unknown): StudentProfile {
  if (!isObj(v)) return EMPTY_PROFILE;
  return {
    residenceCountry: str(v.residenceCountry),
    educationLevel: EDUCATION_LEVELS.includes(v.educationLevel as never)
      ? (v.educationLevel as StudentProfile["educationLevel"])
      : "",
    fieldOfStudy: FIELDS_OF_STUDY.includes(v.fieldOfStudy as never)
      ? (v.fieldOfStudy as StudentProfile["fieldOfStudy"])
      : "",
    enrollment: ENROLLMENT_STATUSES.includes(v.enrollment as never)
      ? (v.enrollment as StudentProfile["enrollment"])
      : "",
    openToNeedBased: v.openToNeedBased === true,
  };
}

/** Turn anything parsed from storage into valid StudentData. */
export function sanitizeStudentData(raw: unknown): StudentData {
  const empty = createEmptyStudentData();
  if (!isObj(raw) || raw.version !== 1) return empty;
  const settings = isObj(raw.settings) ? raw.settings : {};
  return {
    version: 1,
    profile: sanitizeProfile(raw.profile),
    settings: { currency: oneOf(CURRENCY_CODES, settings.currency, "USD") },
    opportunities: (Array.isArray(raw.opportunities) ? raw.opportunities : [])
      .map(sanitizeOpportunity)
      .filter((o): o is TrackedOpportunity => o !== null),
    savedResourceIds: (Array.isArray(raw.savedResourceIds)
      ? raw.savedResourceIds
      : []
    ).filter((id): id is string => typeof id === "string"),
  };
}
