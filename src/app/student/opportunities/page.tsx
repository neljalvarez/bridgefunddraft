import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { OpportunitiesView } from "@/components/student/opportunities-view";

export const metadata: Metadata = { title: "My Opportunities" };

export default function StudentOpportunitiesPage() {
  return (
    <>
      <PageHeader
        title="My Opportunities"
        description="Every opportunity you’re tracking. Reopen one to review its costs and support plan."
      />
      <OpportunitiesView />
    </>
  );
}
