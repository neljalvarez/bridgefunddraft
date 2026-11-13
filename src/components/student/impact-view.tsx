"use client";

import { BadgeCheck, BarChart3, HandCoins, PieChart, TrendingUp, Trophy } from "lucide-react";

import { BarChartCard } from "@/components/charts/bar-chart-card";
import { LineChartCard } from "@/components/charts/line-chart-card";
import { PortalSkeleton } from "@/components/shared/portal-skeleton";
import { StatCard } from "@/components/shared/stat-card";
import { useStudentPortal } from "@/hooks/use-student-portal";
import { formatCurrency } from "@/lib/currency";
import { computeGap, coveredShare } from "@/lib/gap/calculate";
import { confirmedByCategory, deliveredByMonth, summarizePortfolio } from "@/lib/gap/portfolio";

export function ImpactView() {
  const portal = useStudentPortal();
  if (!portal) return <PortalSkeleton />;

  const { data } = portal;
  const currency = data.settings.currency;
  const { active, totals } = summarizePortfolio(data.opportunities, currency);
  const money = (n: number) => formatCurrency(n, currency);
  const fullyCovered = active.filter((o) => {
    const g = computeGap(o);
    return g.original > 0 && g.remaining === 0;
  }).length;
  const hasDemo = active.some((o) => o.isDemo);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Impact reflects only support you have marked <strong className="text-navy">approved</strong> or{" "}
        <strong className="text-navy">received</strong>. Pending and estimated amounts are never included.
        Figures are in {currency}
        {hasDemo ? ", and include fictional demo data" : ""}.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assistance received" value={money(totals.delivered)} icon={HandCoins} hint="Delivered to you" />
        <StatCard label="Confirmed assistance" value={money(totals.confirmed)} icon={BadgeCheck} hint="Approved plus delivered" />
        <StatCard label="Costs covered" value={`${Math.round(coveredShare(totals) * 100)}%`} icon={PieChart} hint="Confirmed assistance + your contribution" />
        <StatCard label="Fully covered" value={`${fullyCovered} of ${active.length}`} icon={Trophy} hint="Opportunities with no remaining gap" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChartCard
          title={`Confirmed assistance by category (${currency})`}
          description="Where approved and delivered support is going."
          data={confirmedByCategory(data.opportunities, currency)}
          emptyIcon={BarChart3}
          emptyTitle="No confirmed assistance yet"
          emptyDescription="Mark support as approved or received in Applications to see it here."
        />
        <LineChartCard
          title={`Assistance received by month (${currency})`}
          description="Based on the date you marked each item received."
          data={deliveredByMonth(data.opportunities, currency)}
          emptyIcon={TrendingUp}
          emptyTitle="Nothing received yet"
          emptyDescription="Once you mark support as received, your timeline appears here."
        />
      </div>
    </div>
  );
}
