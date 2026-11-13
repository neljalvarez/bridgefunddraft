"use client";

import { Database, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";

import { Field } from "@/components/shared/form-field";
import { PortalSkeleton } from "@/components/shared/portal-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { COUNTRY_OPTIONS } from "@/config/countries";
import { CURRENCY_META, RATES_DISCLAIMER } from "@/config/currencies";
import {
  EDUCATION_LEVEL_LABELS,
  ENROLLMENT_LABELS,
  FIELD_OF_STUDY_LABELS,
} from "@/config/student-options";
import { useStudentPortal } from "@/hooks/use-student-portal";
import {
  CURRENCY_CODES,
  EDUCATION_LEVELS,
  ENROLLMENT_STATUSES,
  FIELDS_OF_STUDY,
  type CurrencyCode,
  type StudentProfile,
} from "@/types";

export function SettingsView() {
  const portal = useStudentPortal();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!portal) return <PortalSkeleton />;
  const { data, actions } = portal;
  const { profile } = data;
  const hasDemo = data.opportunities.some((o) => o.isDemo);

  const setProfile = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) =>
    actions.updateProfile({ ...profile, [key]: value });

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Display currency</CardTitle>
          <CardDescription>Used to total amounts across all your opportunities.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field id="display-currency" label="Currency" className="sm:max-w-xs">
            <Select
              id="display-currency"
              value={data.settings.currency}
              onChange={(e) => actions.updateSettings({ currency: e.target.value as CurrencyCode })}
            >
              {CURRENCY_CODES.map((code) => (
                <option key={code} value={code}>
                  {code} · {CURRENCY_META[code].name}
                </option>
              ))}
            </Select>
          </Field>
          <p className="text-xs text-muted-foreground">{RATES_DISCLAIMER}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eligibility details</CardTitle>
          <CardDescription>Used to match you with support. Changes save automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="s-residence" label="Country of residence">
              <Select id="s-residence" value={profile.residenceCountry} onChange={(e) => setProfile("residenceCountry", e.target.value)}>
                <option value="">Not set</option>
                {COUNTRY_OPTIONS.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id="s-education" label="Education level">
              <Select id="s-education" value={profile.educationLevel} onChange={(e) => setProfile("educationLevel", e.target.value as StudentProfile["educationLevel"])}>
                <option value="">Not set</option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {EDUCATION_LEVEL_LABELS[level]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id="s-field" label="Field of study">
              <Select id="s-field" value={profile.fieldOfStudy} onChange={(e) => setProfile("fieldOfStudy", e.target.value as StudentProfile["fieldOfStudy"])}>
                <option value="">Prefer not to say</option>
                {FIELDS_OF_STUDY.map((field) => (
                  <option key={field} value={field}>
                    {FIELD_OF_STUDY_LABELS[field]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id="s-enrollment" label="Enrollment status">
              <Select id="s-enrollment" value={profile.enrollment} onChange={(e) => setProfile("enrollment", e.target.value as StudentProfile["enrollment"])}>
                <option value="">Prefer not to say</option>
                {ENROLLMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {ENROLLMENT_LABELS[status]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <Checkbox
              checked={profile.openToNeedBased}
              onChange={(e) => setProfile("openToNeedBased", e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="block font-medium text-navy">Consider me for need-based support</span>
              <span className="block text-muted-foreground">Providers assess need themselves if you apply.</span>
            </span>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="size-5 text-primary" aria-hidden="true" />
            Your data
          </CardTitle>
          <CardDescription>Where it lives and how to remove it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex gap-3 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
            <p>
              Your portal data is stored <strong className="text-navy">only in this browser</strong>. It
              isn’t sent to a server or shared between devices until BridgeFund accounts are connected.
              We never collect income, bank details, ID numbers, or immigration status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasDemo ? (
              <Button variant="outline" onClick={() => actions.removeDemoData()}>
                Remove demo data
              </Button>
            ) : null}
            {confirmReset ? (
              <>
                <span className="text-sm text-muted-foreground">Delete everything in this browser?</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    actions.resetAll();
                    setConfirmReset(false);
                  }}
                >
                  Yes, delete all
                </Button>
                <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setConfirmReset(true)}>
                <Trash2 /> Delete all my portal data
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
