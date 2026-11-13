import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ApplicationsView } from "@/components/student/applications-view";

export const metadata: Metadata = { title: "Applications" };

export default function StudentApplicationsPage() {
  return (
    <>
      <PageHeader
        title="Applications"
        description="Track each support application from planned to received."
      />
      <ApplicationsView />
    </>
  );
}
