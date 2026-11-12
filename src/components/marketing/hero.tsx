import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { GapIllustration } from "@/components/marketing/gap-illustration";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="animate-fade-up">
          <p className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-navy">
            {siteConfig.slogan}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
            Your next opportunity shouldn’t be out of reach.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            BridgeFund helps students overcome financial barriers standing
            between them and educational opportunities. Discover verified
            assistance, reduce expenses, and connect with organizations ready to
            support your next step.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register?role=student">
                Find Financial Support
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register?role=organization">Partner With Us</Link>
            </Button>
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
          <GapIllustration />
        </div>
      </div>
    </section>
  );
}
