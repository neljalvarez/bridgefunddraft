import type { LucideIcon } from "lucide-react";

import { ChartCard } from "@/components/charts/chart-card";
import { LineChart } from "@/components/charts/line-chart";
import type { ChartDatum } from "@/types";

interface LineChartCardProps {
  title: string;
  description?: string;
  data: ChartDatum[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
}

/** Server-friendly card: empty state when there is no data, line chart otherwise. */
export function LineChartCard({ data, ...card }: LineChartCardProps) {
  return (
    <ChartCard isEmpty={data.length === 0} {...card}>
      <LineChart data={data} />
    </ChartCard>
  );
}
