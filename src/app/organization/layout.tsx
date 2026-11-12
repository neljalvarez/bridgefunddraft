import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

export default function OrganizationLayout({ children }: { children: ReactNode }) {
  return <AppShell role="organization">{children}</AppShell>;
}
