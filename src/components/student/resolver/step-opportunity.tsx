"use client";

import { Field, fieldProps } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRY_OPTIONS } from "@/config/countries";
import { OPPORTUNITY_TYPE_LABELS } from "@/config/student-options";
import { daysBetween } from "@/lib/dates";
import { DESCRIPTION_MAX, TITLE_MAX } from "@/lib/gap/validation";
import type { DateOnlyString, OpportunityType } from "@/types";

import type { StepBaseProps } from "./types";

export function StepOpportunity({
  draft,
  apply,
  errors,
  today,
}: StepBaseProps & { today: DateOnlyString }) {
  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) =>
    apply((d) => ({ ...d, [key]: value }));

  const deadlinePassed =
    draft.deadline && !errors.deadline && daysBetween(today, draft.deadline) < 0;
  const descriptionLength = draft.description?.length ?? 0;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field id="title" label="Opportunity title" required error={errors.title} className="sm:col-span-2">
        <Input
          {...fieldProps("title", { error: errors.title })}
          value={draft.title}
          maxLength={TITLE_MAX + 20}
          placeholder="e.g. Summer data science programme"
          onChange={(e) => set("title", e.target.value)}
        />
      </Field>

      <Field id="provider" label="Provider" required error={errors.provider} hint="The school, company, or organization offering it.">
        <Input
          {...fieldProps("provider", { error: errors.provider, hint: true })}
          value={draft.provider}
          placeholder="e.g. Aldermere Institute"
          onChange={(e) => set("provider", e.target.value)}
        />
      </Field>

      <Field id="type" label="Opportunity type" required>
        <Select
          id="type"
          value={draft.type}
          onChange={(e) => set("type", e.target.value as OpportunityType)}
        >
          {Object.entries(OPPORTUNITY_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <Field id="country" label="Country" required error={errors.country} hint="Where the opportunity takes place.">
        <Select
          {...fieldProps("country", { error: errors.country, hint: true })}
          value={draft.country}
          onChange={(e) => set("country", e.target.value)}
        >
          <option value="">Choose a country…</option>
          {COUNTRY_OPTIONS.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        id="deadline"
        label="Application deadline"
        error={errors.deadline}
        hint={deadlinePassed ? "This date has already passed." : "Optional. We’ll remind you on your overview."}
      >
        <Input
          {...fieldProps("deadline", { error: errors.deadline, hint: true })}
          type="date"
          value={draft.deadline ?? ""}
          onChange={(e) => set("deadline", e.target.value || undefined)}
        />
      </Field>

      <Field id="url" label="Official web address" error={errors.url} hint="Optional. Link to the official page." className="sm:col-span-2">
        <Input
          {...fieldProps("url", { error: errors.url, hint: true })}
          type="url"
          inputMode="url"
          value={draft.url ?? ""}
          placeholder="https://"
          onChange={(e) => set("url", e.target.value.trim() || undefined)}
        />
      </Field>

      <Field
        id="description"
        label="Description"
        error={errors.description}
        hint={`${descriptionLength}/${DESCRIPTION_MAX} characters. Optional.`}
        className="sm:col-span-2"
      >
        <Textarea
          {...fieldProps("description", { error: errors.description, hint: true })}
          value={draft.description ?? ""}
          placeholder="What is it, and why does it matter for you?"
          onChange={(e) => set("description", e.target.value || undefined)}
        />
      </Field>
    </div>
  );
}
