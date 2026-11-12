import { BarChart3, TrendingUp } from "lucide-react";

import { BarChartCard } from "@/components/charts/bar-chart-card";
import { LineChartCard } from "@/components/charts/line-chart-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DEMO_GAPS_RESOLVED,
  DEMO_IMPACT_STATS,
  DEMO_MATCHES_BY_CATEGORY,
} from "@/config/demo-data";

/** Landing-page impact preview. Every figure here is fictional and labeled so. */
export function ImpactSection() {
  return (
    <section id="impact" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Our impact"
          title="What the impact dashboard will show"
          description="A preview of how outcomes are reported to students, organizations, and administrators."
        />
        <Badge tone="warning" className="self-start sm:self-auto">
          Demo data
        </Badge>
      </div>

      <div
        role="note"
        className="mt-6 rounded-lg border border-amber-200 bg-warning-soft px-4 py-3 text-sm text-warning-foreground"
      >
        <strong className="font-semibold">Fictional demonstration figures.</strong>{" "}
        These numbers were made up to show the dashboard design. They are not
        real results.
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEMO_IMPACT_STATS.map(({ label, value }) => (
          <Card key={label} className="p-5">
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-navy">
              {value}
            </dd>
          </Card>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <BarChartCard
          title="Expenses matched by category (demo)"
          description="Fictional example of how support is broken down."
          data={DEMO_MATCHES_BY_CATEGORY}
          emptyIcon={BarChart3}
          emptyTitle="No data"
          emptyDescription="Demo data unavailable."
        />
        <LineChartCard
          title="Gaps resolved per month (demo)"
          description="Fictional example of progress over six months."
          data={DEMO_GAPS_RESOLVED}
          emptyIcon={TrendingUp}
          emptyTitle="No data"
          emptyDescription="Demo data unavailable."
        />
      </div>
    </section>
  );
}
