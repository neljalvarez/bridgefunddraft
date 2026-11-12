import {
  BarChart3,
  Compass,
  FileText,
  FolderKanban,
  Handshake,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  Wallet,
} from "lucide-react";

import type { UserRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface RoleConfig {
  label: string;
  /** Landing route after sign-in. */
  home: string;
  nav: NavItem[];
}

/**
 * Single source of truth for per-role navigation.
 * To add a page to a dashboard: create the route, then add one entry here.
 */
export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  student: {
    label: "Student",
    home: "/student/dashboard",
    nav: [
      { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { label: "Opportunities", href: "/student/opportunities", icon: Compass },
      { label: "Resolver", href: "/student/resolver", icon: Wallet },
      { label: "Matches", href: "/student/matches", icon: Handshake },
      { label: "Applications", href: "/student/applications", icon: FileText },
      { label: "Impact", href: "/student/impact", icon: BarChart3 },
    ],
  },
  organization: {
    label: "Organization",
    home: "/organization/dashboard",
    nav: [
      {
        label: "Dashboard",
        href: "/organization/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Programs", href: "/organization/programs", icon: FolderKanban },
      { label: "Applications", href: "/organization/applications", icon: Inbox },
      { label: "Impact", href: "/organization/impact", icon: BarChart3 },
    ],
  },
  admin: {
    label: "Admin",
    home: "/admin/dashboard",
    nav: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
};

export function getRoleHome(role: UserRole): string {
  return ROLE_CONFIG[role].home;
}
