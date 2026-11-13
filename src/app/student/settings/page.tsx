import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { SettingsView } from "@/components/student/settings-view";

export const metadata: Metadata = { title: "Settings" };

export default function StudentSettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Your currency, eligibility details, and the data BridgeFund holds for you."
      />
      <SettingsView />
    </>
  );
}
