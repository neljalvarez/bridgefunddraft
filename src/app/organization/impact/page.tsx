import { TrendingUp } from "lucide-react";
import type { Metadata } from "next";

import { LineChartCard } from "@/components/charts/line-chart-card";
import { PageHeader } from "@/components/layout/page-header";
import { getOrganizationImpact } from "@/services/impact";

export const metadata: Metadata = { title: "Impact" };

export default async function OrganizationImpactPage() {
  const impact = await getOrganizationImpact();

  return (
    <>
      <PageHeader
        title="Impact"
        description="Understand the outcomes of the support your programs provide."
      />
      <LineChartCard
        title="Support over time"
        description="Based on approved applications to your programs."
        data={impact.ok ? impact.data.series : []}
        emptyIcon={TrendingUp}
        emptyTitle="Nothing to show yet"
        emptyDescription="Impact appears here once your programs have approved applications."
      />
    </>
  );
}
