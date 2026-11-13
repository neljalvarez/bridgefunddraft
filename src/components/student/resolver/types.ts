import type { FieldErrors } from "@/lib/gap/validation";
import type { TrackedOpportunity } from "@/types";

/** Update the working opportunity (and save it once it has an id). */
export type ApplyFn = (
  fn: (opportunity: TrackedOpportunity) => TrackedOpportunity,
) => void;

export interface StepBaseProps {
  draft: TrackedOpportunity;
  apply: ApplyFn;
  errors: FieldErrors;
}
