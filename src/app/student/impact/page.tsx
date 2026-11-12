import { TrendingUp } from "lucide-react";
import type { Metadata } from "next";

import { LineChartCard } from "@/components/charts/line-chart-card";
import { PageHeader } from "@/components/layout/page-header";
import { getStudentImpact } from "@/services/impact";

export const metadata: Metadata = { title: "Impact" };

export default async function StudentImpactPage() {
  const impact = await getStudentImpact();

  return (
    <>
      <PageHeader
        title="Impact"
        description="See how financial support has helped you move forward."
      />
      <LineChartCard
        title="Progress over time"
        description="Based on your recorded applications and support."
        data={impact.ok ? impact.data.series : []}
        emptyIcon={TrendingUp}
        emptyTitle="Nothing to show yet"
        emptyDescription="Your impact appears here once you have applications and support on record."
      />
    </>
  );
}
