import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { PortalNotices } from "@/components/student/portal-notices";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="student">
      <PortalNotices />
      {children}
    </AppShell>
  );
}
