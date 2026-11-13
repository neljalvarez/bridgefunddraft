"use client";

import { AlertTriangle, FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStudentPortal } from "@/hooks/use-student-portal";

/**
 * Banners shown above every student page: a warning if the browser can't
 * save, and a clear label (with a one-click remove) while fictional demo
 * data is present.
 */
export function PortalNotices() {
  const portal = useStudentPortal();
  if (!portal) return null;

  const hasDemo = portal.data.opportunities.some((o) => o.isDemo);

  return (
    <div className="mb-6 space-y-3 empty:hidden">
      {portal.persistFailed ? (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-red-200 bg-destructive-soft px-4 py-3 text-sm text-destructive-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            Your browser blocked saving, so changes will be lost when you close or refresh
            this page. Allow site storage or leave private browsing to keep your work.
          </p>
        </div>
      ) : null}

      {hasDemo ? (
        <div role="note" className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-warning-soft px-4 py-3 text-sm text-warning-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3">
            <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold">Fictional demo data.</strong> The opportunities,
              providers, and support listings you see are invented to demonstrate BridgeFund.
            </span>
          </p>
          <Button variant="outline" size="sm" onClick={() => portal.actions.removeDemoData()}>
            Remove demo data
          </Button>
        </div>
      ) : null}
    </div>
  );
}
