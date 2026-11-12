import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Logo />
        <p className="text-sm text-muted-foreground">
          {siteConfig.name} — {siteConfig.tagline}
        </p>
      </div>
    </footer>
  );
}
