import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { SavedView } from "@/components/student/saved-view";

export const metadata: Metadata = { title: "Saved Resources" };

export default function StudentSavedPage() {
  return (
    <>
      <PageHeader
        title="Saved Resources"
        description="Support listings you’ve bookmarked to come back to."
      />
      <SavedView />
    </>
  );
}
