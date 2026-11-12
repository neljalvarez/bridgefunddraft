import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { BARRIER_CATEGORY_META } from "@/config/barrier-categories";
import { BARRIER_CATEGORIES } from "@/types";

export const metadata: Metadata = { title: "Barrier resolver" };

export default function StudentResolverPage() {
  return (
    <>
      <PageHeader
        title="Barrier resolver"
        description="Identify the financial barriers between you and an educational opportunity."
      />

      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Barrier categories
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BARRIER_CATEGORIES.map((category) => {
          const { label, description, icon: Icon } = BARRIER_CATEGORY_META[category];
          return (
            <li key={category}>
              <Card className="h-full p-5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-navy">{label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </Card>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-sm text-muted-foreground">
        The barrier intake form is the next milestone. These categories are the
        shared vocabulary it will use.
      </p>
    </>
  );
}
