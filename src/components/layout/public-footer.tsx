import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { PUBLIC_NAV } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const ACCOUNT_LINKS = [
  { label: "Log In", href: "/login" },
  { label: "Create a student account", href: "/register?role=student" },
  { label: "Partner with us", href: "/register?role=organization" },
] as const;

const linkClass = "text-sm text-white/70 transition-colors hover:text-white";

export function PublicFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-5 lg:px-8">
        <div id="about" className="scroll-mt-24 md:col-span-2">
          <Logo tone="dark" />
          <p className="mt-4 max-w-sm text-sm text-white/70">{siteConfig.slogan}</p>
          <h2 className="mt-6 text-sm font-semibold text-white">About BridgeFund</h2>
          <p className="mt-2 max-w-sm text-sm text-white/70">
            BridgeFund is an educational financial accessibility platform. It
            breaks an opportunity into its individual expenses and matches each
            one with verified support, so small costs stop standing in the way
            of big steps.
          </p>
        </div>

        <nav aria-label="Explore" className="md:col-span-1">
          <h2 className="text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-4 space-y-3">
            {PUBLIC_NAV.filter(({ label }) => label !== "About").map(
              ({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <nav aria-label="Account" className="md:col-span-2">
          <h2 className="text-sm font-semibold text-white">Get involved</h2>
          <ul className="mt-4 space-y-3">
            {ACCOUNT_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/60 sm:px-6 lg:px-8">
          {siteConfig.name}. Impact figures on this site are fictional
          demonstration data and do not represent real results.
        </p>
      </div>
    </footer>
  );
}
