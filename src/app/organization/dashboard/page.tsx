import { BarChart3, FolderKanban, Inbox } from "lucide-react";
import type { Metadata } from "next";

import { BarChartCard } from "@/components/charts/bar-chart-card";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { groupApplicationsByStatus } from "@/lib/aggregate";
import { listReceivedApplications } from "@/services/applications";
import { listMyPrograms } from "@/services/programs";
import { countItems } from "@/services/result";

export const metadata: Metadata = { title: "Organization dashboard" };

export default async function OrganizationDashboardPage() {
  const [programs, applications] = await Promise.all([
    listMyPrograms(),
    listReceivedApplications(),
  ]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your support programs and the applications they receive."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Programs" value={countItems(programs)} icon={FolderKanban} />
        <StatCard
          label="Applications received"
          value={countItems(applications)}
          icon={Inbox}
        />
      </div>

      <div className="mt-6">
        <BarChartCard
          title="Applications by status"
          description="Where applications to your programs currently stand."
          data={applications.ok ? groupApplicationsByStatus(applications.data) : []}
          emptyIcon={BarChart3}
          emptyTitle="No applications yet"
          emptyDescription="Applications to your programs will be summarized here."
        />
      </div>
    </>
  );
}
