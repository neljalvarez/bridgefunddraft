"use client";

import { usePathname } from "next/navigation";

import type { NavItem } from "@/config/navigation";

export interface ActiveNavItem extends NavItem {
  isActive: boolean;
}

/** Marks the nav item matching the current route (including nested routes). */
export function useActiveNav(items: NavItem[]): ActiveNavItem[] {
  const pathname = usePathname();
  return items.map((item) => ({
    ...item,
    isActive: pathname === item.href || pathname.startsWith(`${item.href}/`),
  }));
}
