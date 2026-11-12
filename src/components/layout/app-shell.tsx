import type { ReactNode } from "react";

import { SidebarContent } from "@/components/layout/sidebar-content";
import { Topbar } from "@/components/layout/topbar";
import type { UserRole } from "@/types";

interface AppShellProps {
  role: UserRole;
  children: ReactNode;
}

/**
 * Authenticated application frame: fixed navy sidebar on desktop, drawer on
 * mobile, sticky top bar, and a centred content column.
 * Each role's layout.tsx renders this once; pages only render their content.
 */
export function AppShell({ role, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-navy lg:block">
        <SidebarContent role={role} />
      </aside>

      <div className="lg:pl-64">
        <Topbar role={role} />
        <main
          id="main-content"
          className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
