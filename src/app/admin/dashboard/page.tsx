import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { listPendingOrganizations } from "@/services/admin";
import { countItems } from "@/services/result";

export const metadata: Metadata = { title: "Admin dashboard" };

export default async function AdminDashboardPage() {
  const pending = await listPendingOrganizations();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Oversee verification and the health of the platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Organizations awaiting verification"
          value={countItems(pending)}
          icon={ShieldCheck}
        />
      </div>

      <div className="mt-6">
        <EmptyState
          icon={ShieldCheck}
          title="Verification queue is empty"
          description="Organizations that register will appear here for review before their programs are shown to students."
        />
      </div>
    </>
  );
}
