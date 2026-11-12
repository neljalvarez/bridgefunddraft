import type { LucideIcon } from "lucide-react";

import { BarChart } from "@/components/charts/bar-chart";
import { ChartCard } from "@/components/charts/chart-card";
import type { ChartDatum } from "@/types";

interface BarChartCardProps {
  title: string;
  description?: string;
  data: ChartDatum[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
}

/** Server-friendly card: empty state when there is no data, bar chart otherwise. */
export function BarChartCard({ data, ...card }: BarChartCardProps) {
  return (
    <ChartCard isEmpty={data.length === 0} {...card}>
      <BarChart data={data} />
    </ChartCard>
  );
}
