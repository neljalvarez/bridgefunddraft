import type { ChartDatum } from "./common";

export interface ImpactMetric {
  key: string;
  label: string;
  value: number;
  unit?: string;
}

/** Aggregated outcomes for a student, an organization, or the whole platform. */
export interface ImpactSummary {
  metrics: ImpactMetric[];
  /** Time series (oldest first) for trend charts. */
  series: ChartDatum[];
}
