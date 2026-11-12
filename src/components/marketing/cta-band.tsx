import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-border bg-card px-6 py-10 shadow-card sm:px-10 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight text-navy">
            Your next step is closer than the gap makes it look.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Students can start by naming the costs in the way. Organizations can
            start by joining the verification queue.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register?role=student">Find Financial Support</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register?role=organization">Partner With Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
