import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ImpactView } from "@/components/student/impact-view";

export const metadata: Metadata = { title: "Impact" };

export default function StudentImpactPage() {
  return (
    <>
      <PageHeader
        title="Impact"
        description="How much confirmed support has reached you, based only on what you’ve marked approved or received."
      />
      <ImpactView />
    </>
  );
}
