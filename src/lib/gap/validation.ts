import { isValidDateOnly } from "@/lib/dates";
import { parseAmount } from "@/lib/currency";
import type { StudentProfile, TrackedOpportunity } from "@/types";

export type FieldErrors = Record<string, string>;

export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 600;

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateOpportunityInfo(
  opportunity: TrackedOpportunity,
): FieldErrors {
  const errors: FieldErrors = {};
  if (!opportunity.title.trim()) errors.title = "Enter the opportunity’s title.";
  else if (opportunity.title.length > TITLE_MAX) {
    errors.title = `Keep the title under ${TITLE_MAX} characters.`;
  }
  if (!opportunity.provider.trim()) errors.provider = "Enter who provides it.";
  if (!opportunity.country) errors.country = "Choose a country.";
  if (opportunity.deadline && !isValidDateOnly(opportunity.deadline)) {
    errors.deadline = "Enter a valid date.";
  }
  if (opportunity.url && !isHttpUrl(opportunity.url)) {
    errors.url = "Enter a full web address starting with https://";
  }
  if ((opportunity.description?.length ?? 0) > DESCRIPTION_MAX) {
    errors.description = `Keep the description under ${DESCRIPTION_MAX} characters.`;
  }
  return errors;
}

export function validateExpenses(opportunity: TrackedOpportunity): FieldErrors {
  return opportunity.expenses.length === 0
    ? { expenses: "Add at least one expense to continue." }
    : {};
}

export interface ExpenseForm {
  name: string;
  amount: string;
  deadline: string;
}

export function validateExpenseForm(form: ExpenseForm): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Name this expense.";
  const amount = parseAmount(form.amount);
  if (amount === null || amount <= 0) {
    errors.amount = "Enter an amount greater than zero.";
  }
  if (form.deadline && !isValidDateOnly(form.deadline)) {
    errors.deadline = "Enter a valid date.";
  }
  return errors;
}

export function validateFinancial(
  profile: StudentProfile,
  contributionText: string,
): FieldErrors {
  const errors: FieldErrors = {};
  if (!profile.residenceCountry) {
    errors.residenceCountry = "Choose your country of residence.";
  }
  if (!profile.educationLevel) {
    errors.educationLevel = "Choose your education level.";
  }
  if (contributionText.trim() !== "" && parseAmount(contributionText) === null) {
    errors.contribution = "Enter an amount of zero or more, or leave it blank.";
  }
  return errors;
}
