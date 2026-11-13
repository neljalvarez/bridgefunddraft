import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { MatchesView } from "@/components/student/matches-view";

export const metadata: Metadata = { title: "Funding Matches" };

export default function StudentMatchesPage() {
  return (
    <>
      <PageHeader
        title="Funding Matches"
        description="Support matched to each expense of an opportunity, based on your eligibility details."
      />
      <MatchesView />
    </>
  );
}
