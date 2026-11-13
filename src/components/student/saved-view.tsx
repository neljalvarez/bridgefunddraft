"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Field } from "@/components/shared/form-field";
import { PortalSkeleton } from "@/components/shared/portal-skeleton";
import { ResourceCard } from "@/components/student/resource-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RESOURCE_KIND_META } from "@/config/student-options";
import { useStudentPortal } from "@/hooks/use-student-portal";
import { RESOURCE_KINDS, type SupportResourceKind } from "@/types";

export function SavedView() {
  const portal = useStudentPortal();
  const [kind, setKind] = useState<SupportResourceKind | "all">("all");

  if (!portal) return <PortalSkeleton />;
  const { data, today, resources, actions } = portal;

  const saved = resources.filter((r) => data.savedResourceIds.includes(r.id));
  const browse = kind === "all" ? resources : resources.filter((r) => r.kind === kind);

  return (
    <div className="space-y-10">
      <section aria-labelledby="saved-heading" className="space-y-4">
        <h2 id="saved-heading" className="text-base font-semibold text-navy">
          Saved ({saved.length})
        </h2>
        {saved.length === 0 ? (
          <EmptyState
            compact
            icon={Bookmark}
            title="Nothing saved yet"
            description="Use the bookmark on any support listing to keep it here, or browse the listings below."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {saved.map((resource) => (
              <li key={resource.id}>
                <ResourceCard
                  resource={resource}
                  today={today}
                  saved
                  onToggleSave={() => actions.toggleSavedResource(resource.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="browse-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="browse-heading" className="text-base font-semibold text-navy">
              Browse support listings
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fictional demo listings. Eligibility is checked when you match them to an expense.
            </p>
          </div>
          <Field id="kind-filter" label="Type of support" className="w-full sm:w-56">
            <Select id="kind-filter" value={kind} onChange={(e) => setKind(e.target.value as SupportResourceKind | "all")}>
              <option value="all">All types</option>
              {RESOURCE_KINDS.map((k) => (
                <option key={k} value={k}>
                  {RESOURCE_KIND_META[k].label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {browse.map((resource) => (
            <li key={resource.id}>
              <ResourceCard
                resource={resource}
                today={today}
                saved={data.savedResourceIds.includes(resource.id)}
                onToggleSave={() => actions.toggleSavedResource(resource.id)}
              />
            </li>
          ))}
        </ul>

        <p className="text-sm text-muted-foreground">
          Ready to use one?{" "}
          <Button asChild variant="link" className="h-auto p-0">
            <Link href="/student/matches">See your funding matches</Link>
          </Button>
        </p>
      </section>
    </div>
  );
}
