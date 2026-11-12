import type { ChartDatum } from "@/types";

/**
 * FICTIONAL DEMONSTRATION DATA.
 * Used only by the landing page impact section, which labels it as demo data.
 * Never import this into real dashboards or services.
 */
export const DEMO_IMPACT_STATS = [
  { label: "Expenses matched to support", value: "2,480" },
  { label: "Students supported", value: "960" },
  { label: "Verified organizations", value: "42" },
  { label: "Gaps fully resolved", value: "71%" },
] as const;

export const DEMO_MATCHES_BY_CATEGORY: ChartDatum[] = [
  { label: "Tuition", value: 640 },
  { label: "App fees", value: 520 },
  { label: "Exam fees", value: 410 },
  { label: "Materials", value: 360 },
  { label: "Technology", value: 300 },
  { label: "Transport", value: 250 },
];

export const DEMO_GAPS_RESOLVED: ChartDatum[] = [
  { label: "M1", value: 120 },
  { label: "M2", value: 180 },
  { label: "M3", value: 260 },
  { label: "M4", value: 340 },
  { label: "M5", value: 430 },
  { label: "M6", value: 520 },
];
