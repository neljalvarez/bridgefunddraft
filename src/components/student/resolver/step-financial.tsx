"use client";

import { ShieldCheck } from "lucide-react";

import { Field, fieldProps } from "@/components/shared/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { COUNTRY_OPTIONS } from "@/config/countries";
import {
  EDUCATION_LEVEL_LABELS,
  ENROLLMENT_LABELS,
  FIELD_OF_STUDY_LABELS,
} from "@/config/student-options";
import type { FieldErrors } from "@/lib/gap/validation";
import {
  EDUCATION_LEVELS,
  ENROLLMENT_STATUSES,
  FIELDS_OF_STUDY,
  type CurrencyCode,
  type StudentProfile,
} from "@/types";

interface StepFinancialProps {
  profile: StudentProfile;
  onProfileChange: (profile: StudentProfile) => void;
  contribution: string;
  onContributionChange: (value: string) => void;
  currency: CurrencyCode;
  errors: FieldErrors;
}

export function StepFinancial({
  profile,
  onProfileChange,
  contribution,
  onContributionChange,
  currency,
  errors,
}: StepFinancialProps) {
  const set = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) =>
    onProfileChange({ ...profile, [key]: value });

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-lg border border-border bg-muted/50 p-4 text-sm">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
        <p className="text-muted-foreground">
          <span className="font-medium text-navy">We only ask what matching needs.</span> We never ask
          for your income, family finances, bank details, ID numbers, or immigration status.
          Organizations check need themselves when you apply.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="residence" label="Country of residence" required error={errors.residenceCountry}>
          <Select
            {...fieldProps("residence", { error: errors.residenceCountry })}
            value={profile.residenceCountry}
            onChange={(e) => set("residenceCountry", e.target.value)}
          >
            <option value="">Choose a country…</option>
            {COUNTRY_OPTIONS.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Select>
        </Field>

        <Field id="education" label="Education level" required error={errors.educationLevel}>
          <Select
            {...fieldProps("education", { error: errors.educationLevel })}
            value={profile.educationLevel}
            onChange={(e) => set("educationLevel", e.target.value as StudentProfile["educationLevel"])}
          >
            <option value="">Choose a level…</option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level} value={level}>
                {EDUCATION_LEVEL_LABELS[level]}
              </option>
            ))}
          </Select>
        </Field>

        <Field id="field" label="Field of study" hint="Optional. Some support is subject-specific.">
          <Select
            {...fieldProps("field", { hint: true })}
            value={profile.fieldOfStudy}
            onChange={(e) => set("fieldOfStudy", e.target.value as StudentProfile["fieldOfStudy"])}
          >
            <option value="">Prefer not to say</option>
            {FIELDS_OF_STUDY.map((field) => (
              <option key={field} value={field}>
                {FIELD_OF_STUDY_LABELS[field]}
              </option>
            ))}
          </Select>
        </Field>

        <Field id="enrollment" label="Enrollment status" hint="Optional. Some support is for enrolled students.">
          <Select
            {...fieldProps("enrollment", { hint: true })}
            value={profile.enrollment}
            onChange={(e) => set("enrollment", e.target.value as StudentProfile["enrollment"])}
          >
            <option value="">Prefer not to say</option>
            {ENROLLMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {ENROLLMENT_LABELS[status]}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          id="contribution"
          label={`Approximate personal contribution (${currency})`}
          error={errors.contribution}
          hint="Roughly how much you could cover yourself for this opportunity. Leave blank if unsure."
          className="sm:col-span-2"
        >
          <Input
            {...fieldProps("contribution", { error: errors.contribution, hint: true })}
            inputMode="decimal"
            value={contribution}
            placeholder="0"
            onChange={(e) => onContributionChange(e.target.value)}
            className="sm:max-w-xs"
          />
        </Field>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4">
        <Checkbox
          checked={profile.openToNeedBased}
          onChange={(e) => set("openToNeedBased", e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-sm">
          <span className="block font-medium text-navy">Consider me for need-based support</span>
          <span className="block text-muted-foreground">
            Includes programs that give priority to students who can’t cover costs. You don’t share
            any financial details here; the provider assesses need if you apply.
          </span>
        </span>
      </label>

      <p className="text-xs text-muted-foreground">
        Your country, education level, and eligibility choices apply to all your opportunities. The
        contribution is saved for this opportunity only.
      </p>
    </div>
  );
}
