import { Inbox } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Applications" };

export default function OrganizationApplicationsPage() {
  return (
    <>
      <PageHeader
        title="Applications"
        description="Review applications students submit to your programs."
      />
      <EmptyState
        icon={Inbox}
        title="No applications received"
        description="When students apply to your programs, their applications will appear here for review."
      />
    </>
  );
}
