import type {
  CurrencyCode,
  StudentData,
  StudentProfile,
  TrackedOpportunity,
} from "@/types";

export const EMPTY_PROFILE: StudentProfile = {
  residenceCountry: "",
  educationLevel: "",
  fieldOfStudy: "",
  enrollment: "",
  openToNeedBased: false,
};

/** A blank, unsaved opportunity (no id or timestamps until first save). */
export function createBlankOpportunity(
  currency: CurrencyCode,
): TrackedOpportunity {
  return {
    id: "",
    title: "",
    provider: "",
    country: "",
    type: "program",
    currency,
    expenses: [],
    personalContribution: 0,
    claims: [],
    status: "draft",
    lastStep: 1,
    isDemo: false,
    createdAt: "",
    updatedAt: "",
  };
}

export function createEmptyStudentData(): StudentData {
  return {
    version: 1,
    profile: EMPTY_PROFILE,
    settings: { currency: "USD" },
    opportunities: [],
    savedResourceIds: [],
  };
}
