import { FileText } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APPLICATION_STATUS_META } from "@/config/status";
import { APPLICATION_STATUSES } from "@/types";

export const metadata: Metadata = { title: "Applications" };

export default function StudentApplicationsPage() {
  return (
    <>
      <PageHeader
        title="Applications"
        description="Track each application from draft to decision."
      />
      <EmptyState
        icon={FileText}
        title="No applications yet"
        description="Applications you start will be listed here with their current status."
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Application statuses</CardTitle>
          <CardDescription>The stages an application can move through.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {APPLICATION_STATUSES.map((status) => (
              <li key={status}>
                <StatusBadge meta={APPLICATION_STATUS_META[status]} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
