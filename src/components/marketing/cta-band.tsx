import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-navy px-6 py-10 sm:flex-row sm:items-center sm:px-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Ready to start?
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/75">
            Create a free account and tell us what stands between you and your
            next step in education.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/register">Get started</Link>
        </Button>
      </div>
    </section>
  );
}
