import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { DashboardView } from "@/components/student/dashboard-view";

export const metadata: Metadata = { title: "Overview" };

export default function StudentDashboardPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Your costs, support, and remaining gap across every opportunity you’re tracking."
      />
      <DashboardView />
    </>
  );
}
