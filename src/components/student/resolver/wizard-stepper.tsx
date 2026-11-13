import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export const WIZARD_STEPS = [
  { id: 1, label: "Opportunity", title: "Opportunity information", description: "Tell us which opportunity you want to pursue." },
  { id: 2, label: "Expenses", title: "Expense breakdown", description: "List every cost involved. We total them for you." },
  { id: 3, label: "Your details", title: "Financial information", description: "Only what’s needed to match you with support." },
  { id: 4, label: "Gap analysis", title: "Financial gap analysis", description: "See what is covered, what is pending, and what is left." },
  { id: 5, label: "Plan", title: "Resolution plan", description: "Choose ways to reduce or cover each expense." },
  { id: 6, label: "Results", title: "Results", description: "Your financial breakdown and next actions." },
] as const;

interface WizardStepperProps {
  current: number;
  onSelect: (step: number) => void;
}

export function WizardStepper({ current, onSelect }: WizardStepperProps) {
  const active = WIZARD_STEPS.find((s) => s.id === current);
  return (
    <nav aria-label="Gap Resolver steps">
      <p className="mb-3 text-sm font-medium text-muted-foreground sm:hidden">
        Step {current} of {WIZARD_STEPS.length}: <span className="text-navy">{active?.label}</span>
      </p>
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {WIZARD_STEPS.map((step, index) => {
          const done = step.id < current;
          const isCurrent = step.id === current;
          return (
            <li key={step.id} className="flex flex-1 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => onSelect(step.id)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "group flex min-w-0 items-center gap-2 rounded-lg py-1 text-left",
                  isCurrent ? "text-navy" : "text-muted-foreground hover:text-navy",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    isCurrent && "border-primary bg-primary text-white",
                    done && "border-success bg-success text-white",
                    !isCurrent && !done && "border-input bg-card",
                  )}
                >
                  {done ? <Check className="size-4" aria-hidden="true" /> : step.id}
                </span>
                <span className="sr-only sm:not-sr-only sm:hidden xl:inline xl:text-sm xl:font-medium">
                  {step.label}
                </span>
              </button>
              {index < WIZARD_STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn("h-px flex-1", done ? "bg-success" : "bg-border")}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
