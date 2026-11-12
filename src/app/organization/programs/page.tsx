import { FolderKanban } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Programs" };

export default function OrganizationProgramsPage() {
  return (
    <>
      <PageHeader
        title="Programs"
        description="The financial support programs your organization offers to students."
      />
      <EmptyState
        icon={FolderKanban}
        title="No programs yet"
        description="Programs you create will be listed here, along with their verification status."
      />
    </>
  );
}
