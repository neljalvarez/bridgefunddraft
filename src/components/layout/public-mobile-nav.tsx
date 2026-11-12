"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PUBLIC_NAV } from "@/config/navigation";

const linkClass =
  "block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-white";

/** Drawer navigation for the public site below the lg breakpoint. */
export function PublicMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="sr-only">Site navigation</SheetTitle>
        <SheetDescription className="sr-only">
          Links to sections of the BridgeFund site.
        </SheetDescription>
        <div className="flex h-16 items-center px-5">
          <Logo tone="dark" />
        </div>
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-3">
          <ul className="flex flex-col gap-1">
            {PUBLIC_NAV.map(({ label, href }) => (
              <li key={href}>
                <SheetClose asChild>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-2 border-t border-white/10 p-4">
          <SheetClose asChild>
            <Link href="/login" className={linkClass}>
              Log In
            </Link>
          </SheetClose>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
