import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "dark" renders white text for use on navy backgrounds. */
  tone?: "light" | "dark";
  href?: string;
  className?: string;
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="32" height="32" rx="8" fill="#2563EB" />
      <path
        d="M6 21c3-8 7-11 10-11s7 3 10 11"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M5 23h22" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ tone = "light", href = "/", className }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <LogoMark />
      <span
        className={cn(
          "text-lg font-semibold tracking-tight",
          tone === "dark" ? "text-white" : "text-navy",
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
