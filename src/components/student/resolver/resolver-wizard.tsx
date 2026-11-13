"use client";

import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { PortalSkeleton } from "@/components/shared/portal-skeleton";
import { ResolutionPlan } from "@/components/student/resolution-plan";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type StudentPortal, useStudentPortal } from "@/hooks/use-student-portal";
import { convertAmount, parseAmount } from "@/lib/currency";
import { createBlankOpportunity } from "@/lib/gap/factory";
import {
  type FieldErrors,
  validateExpenses,
  validateFinancial,
  validateOpportunityInfo,
} from "@/lib/gap/validation";
import type { CurrencyCode, StudentProfile, TrackedOpportunity } from "@/types";
import { FolderSearch } from "lucide-react";

import { StepExpenses } from "./step-expenses";
import { StepFinancial } from "./step-financial";
import { StepGapAnalysis } from "./step-gap-analysis";
import { StepOpportunity } from "./step-opportunity";
import { StepResults } from "./step-results";
import type { ApplyFn } from "./types";
import { WIZARD_STEPS, WizardStepper } from "./wizard-stepper";

const LAST_STEP = WIZARD_STEPS.length;

/** Entry point: finds the opportunity to resume (or starts a new one). */
export function ResolverWizard() {
  const portal = useStudentPortal();
  const params = useSearchParams();

  if (!portal) return <PortalSkeleton />;

  const id = params.get("opportunity");
  const existing = id ? portal.data.opportunities.find((o) => o.id === id) : undefined;

  if (id && !existing) {
    return (
      <EmptyState
        icon={FolderSearch}
        title="We couldn’t find that opportunity"
        description="It may have been deleted, or it was saved in a different browser."
        action={
          <Button asChild>
            <Link href="/student/resolver">Start a new one</Link>
          </Button>
        }
      />
    );
  }

  const stepParam = Number(params.get("step"));
  const requested = Number.isInteger(stepParam) && stepParam >= 1 && stepParam <= LAST_STEP ? stepParam : null;
  const initialStep = requested ?? (existing ? (existing.status === "active" ? LAST_STEP : existing.lastStep) : 1);

  return (
    <ResolverWorkspace
      key={existing?.id ?? "new"}
      portal={portal}
      initial={existing ?? createBlankOpportunity(portal.data.settings.currency)}
      initialStep={initialStep}
    />
  );
}

interface ResolverWorkspaceProps {
  portal: StudentPortal;
  initial: TrackedOpportunity;
  initialStep: number;
}

function ResolverWorkspace({ portal, initial, initialStep }: ResolverWorkspaceProps) {
  const { data, today, resources, actions } = portal;
  const router = useRouter();

  const [draft, setDraft] = useState(initial);
  const draftRef = useRef(initial);
  const [profile, setProfile] = useState<StudentProfile>(data.profile);
  const [contribution, setContribution] = useState(
    initial.personalContribution > 0 ? String(initial.personalContribution) : "",
  );
  const [step, setStep] = useState(initialStep);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [step]);

  /** Update the working copy; once it has an id every change is saved. */
  const commit = useCallback(
    (next: TrackedOpportunity, forceSave = false) => {
      if (next.id || forceSave) {
        const saved = actions.upsertOpportunity(next);
        draftRef.current = saved;
        setDraft(saved);
      } else {
        draftRef.current = next;
        setDraft(next);
      }
    },
    [actions],
  );

  const apply = useCallback<ApplyFn>((fn) => commit(fn(draftRef.current)), [commit]);

  const validateStep = (target: number): FieldErrors => {
    if (target === 1) return validateOpportunityInfo(draftRef.current);
    if (target === 2) return validateExpenses(draftRef.current);
    if (target === 3) return validateFinancial(profile, contribution);
    return {};
  };

  /** Save the step-3 details (profile applies to every opportunity). */
  const commitFinancial = () => {
    if (Object.keys(validateFinancial(profile, contribution)).length > 0) return;
    actions.updateProfile(profile);
    apply((d) => ({ ...d, personalContribution: parseAmount(contribution) ?? 0 }));
  };

  function goTo(target: number) {
    if (target === step) return;
    if (step === 3) commitFinancial();

    // Moving forward requires every earlier step to be valid.
    for (let s = 1; s < target; s++) {
      const found = validateStep(s);
      if (Object.keys(found).length > 0) {
        setErrors(found);
        setStep(s);
        return;
      }
    }
    setErrors({});
    setNotice("");
    commit({ ...draftRef.current, lastStep: target }, target >= 2);
    setStep(target);
  }

  function saveAndExit() {
    const found = validateOpportunityInfo(draftRef.current);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStep(1);
      return;
    }
    if (step === 3) commitFinancial();
    commit({ ...draftRef.current, lastStep: step }, true);
    router.push("/student/opportunities");
  }

  function changeCurrency(next: CurrencyCode) {
    const previous = draftRef.current.currency;
    if (next === previous) return;
    const converted = convertAmount(parseAmount(contribution) ?? 0, previous, next);
    setContribution(converted > 0 ? String(converted) : "");
    apply((d) => ({
      ...d,
      currency: next,
      personalContribution: convertAmount(d.personalContribution, previous, next),
    }));
  }

  const meta = WIZARD_STEPS[step - 1];
  const toggleSave = (id: string) => actions.toggleSavedResource(id);

  return (
    <div className="space-y-6">
      <WizardStepper current={step} onSelect={goTo} />

      <Card>
        <CardContent className="p-5 sm:p-8">
          <div className="mb-6">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-semibold tracking-tight text-navy focus:outline-none"
            >
              {meta?.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{meta?.description}</p>
          </div>

          {step === 1 ? <StepOpportunity draft={draft} apply={apply} errors={errors} today={today} /> : null}
          {step === 2 ? (
            <StepExpenses draft={draft} apply={apply} errors={errors} onCurrencyChange={changeCurrency} />
          ) : null}
          {step === 3 ? (
            <StepFinancial
              profile={profile}
              onProfileChange={setProfile}
              contribution={contribution}
              onContributionChange={setContribution}
              currency={draft.currency}
              errors={errors}
            />
          ) : null}
          {step === 4 ? <StepGapAnalysis draft={draft} profile={profile} resources={resources} today={today} /> : null}
          {step === 5 ? (
            <ResolutionPlan
              opportunity={draft}
              profile={profile}
              resources={resources}
              today={today}
              savedIds={data.savedResourceIds}
              apply={apply}
              onToggleSave={toggleSave}
            />
          ) : null}
          {step === 6 ? (
            <StepResults
              draft={draft}
              profile={profile}
              resources={resources}
              today={today}
              apply={apply}
              onSaved={() => setNotice("Saved to My Opportunities.")}
            />
          ) : null}
        </CardContent>
      </Card>

      <p className="sr-only" role="status" aria-live="polite">
        {notice}
      </p>

      {step < LAST_STEP ? (
        <div className="flex flex-wrap items-center gap-3">
          {step > 1 ? (
            <Button variant="outline" onClick={() => goTo(step - 1)}>
              <ArrowLeft /> Back
            </Button>
          ) : null}
          <Button variant="ghost" onClick={saveAndExit} className="sm:ml-auto">
            <Save /> Save &amp; exit
          </Button>
          <Button onClick={() => goTo(step + 1)}>
            {step === LAST_STEP - 1 ? "See results" : "Continue"} <ArrowRight />
          </Button>
        </div>
      ) : (
        <div className="flex">
          <Button variant="outline" onClick={() => goTo(step - 1)}>
            <ArrowLeft /> Back to plan
          </Button>
        </div>
      )}
    </div>
  );
}
