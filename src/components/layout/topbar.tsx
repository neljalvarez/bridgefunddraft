import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROLE_CONFIG } from "@/config/navigation";
import type { UserRole } from "@/types";

export function Topbar({ role }: { role: UserRole }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <MobileNav role={role} />
      <Logo className="lg:hidden" href={ROLE_CONFIG[role].home} />

      <div className="ml-auto flex items-center gap-3">
        <Badge tone="info" className="hidden sm:inline-flex">{ROLE_CONFIG[role].label}</Badge>
        <Button asChild variant="outline" size="sm">
          <Link href="/login">Switch account</Link>
        </Button>
      </div>
    </header>
  );
}
