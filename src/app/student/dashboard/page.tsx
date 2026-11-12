import { ArrowRight, BarChart3, FileText, Handshake, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BarChartCard } from "@/components/charts/bar-chart-card";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { groupBarriersByCategory } from "@/lib/aggregate";
import { listMyApplications } from "@/services/applications";
import { listMyBarriers } from "@/services/barriers";
import { listMyMatches } from "@/services/matches";
import { countItems } from "@/services/result";

export const metadata: Metadata = { title: "Student dashboard" };

const NEXT_STEPS = [
  {
    href: "/student/resolver",
    title: "Describe a financial barrier",
    text: "Tell us what cost is standing in your way.",
  },
  {
    href: "/student/opportunities",
    title: "Browse opportunities",
    text: "Explore educational opportunities you may want to pursue.",
  },
  {
    href: "/student/matches",
    title: "Review your matches",
    text: "See verified support programs suggested for your barriers.",
  },
] as const;

export default async function StudentDashboardPage() {
  const [barriers, matches, applications] = await Promise.all([
    listMyBarriers(),
    listMyMatches(),
    listMyApplications(),
  ]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your financial barriers, support matches, and applications at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Financial barriers" value={countItems(barriers)} icon={Wallet} />
        <StatCard label="Support matches" value={countItems(matches)} icon={Handshake} />
        <StatCard label="Applications" value={countItems(applications)} icon={FileText} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <BarChartCard
            title="Barriers by category"
            description="Where costs are standing in your way."
            data={barriers.ok ? groupBarriersByCategory(barriers.data) : []}
            emptyIcon={BarChart3}
            emptyTitle="No barriers recorded"
            emptyDescription="Once you describe a barrier in the resolver, it will appear here."
          />
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Where to start</CardTitle>
            <CardDescription>Three steps to get moving.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {NEXT_STEPS.map(({ href, title, text }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span>
                      <span className="block text-sm font-medium text-navy">
                        {title}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        {text}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
