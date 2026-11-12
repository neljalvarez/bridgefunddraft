import { APPLICATION_STATUS_META } from "@/config/status";
import { BARRIER_CATEGORY_META } from "@/config/barrier-categories";
import type { Application, ChartDatum, FinancialBarrier } from "@/types";

/** Count barriers per category, omitting empty categories. */
export function groupBarriersByCategory(
  barriers: FinancialBarrier[],
): ChartDatum[] {
  const counts = new Map<string, number>();
  for (const { category } of barriers) {
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return [...counts].map(([category, value]) => ({
    label:
      BARRIER_CATEGORY_META[category as keyof typeof BARRIER_CATEGORY_META]
        ?.label ?? category,
    value,
  }));
}

/** Count applications per status, omitting empty statuses. */
export function groupApplicationsByStatus(
  applications: Application[],
): ChartDatum[] {
  const counts = new Map<Application["status"], number>();
  for (const { status } of applications) {
    counts.set(status, (counts.get(status) ?? 0) + 1);
  }
  return [...counts].map(([status, value]) => ({
    label: APPLICATION_STATUS_META[status].label,
    value,
  }));
}
