"use client";

import { Home } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { ROLE_CONFIG } from "@/config/navigation";
import { useActiveNav } from "@/hooks/use-active-nav";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface SidebarContentProps {
  role: UserRole;
  /** Called after a nav link is followed (used to close the mobile drawer). */
  onNavigate?: () => void;
}

/** Navy sidebar body shared by the desktop sidebar and the mobile drawer. */
export function SidebarContent({ role, onNavigate }: SidebarContentProps) {
  const { label, nav } = ROLE_CONFIG[role];
  const items = useActiveNav(nav);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Logo tone="dark" href={ROLE_CONFIG[role].home} />
      </div>

      <div className="px-5 pb-2 pt-4 text-xs font-medium uppercase tracking-wider text-white/60">
        {label} workspace
      </div>

      <nav aria-label={`${label} navigation`} className="flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-1">
          {items.map(({ href, label: itemLabel, icon: Icon, isActive }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-white",
                  isActive
                    ? "bg-white/12 text-white"
                    : "text-white/75 hover:bg-white/8 hover:text-white",
                )}
              >
                <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                {itemLabel}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/8 hover:text-white focus-visible:outline-white"
        >
          <Home className="size-[18px]" aria-hidden="true" />
          Back to site
        </Link>
      </div>
    </div>
  );
}
