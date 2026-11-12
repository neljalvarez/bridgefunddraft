import { Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Opportunities" };

export default function StudentOpportunitiesPage() {
  return (
    <>
      <PageHeader
        title="Opportunities"
        description="Educational programs, courses, exams, and scholarships you may want to pursue."
      />
      <EmptyState
        icon={Compass}
        title="No opportunities listed yet"
        description="Opportunities will appear here once they are added. In the meantime, you can describe a financial barrier you're facing."
        action={
          <Button asChild>
            <Link href="/student/resolver">Open the resolver</Link>
          </Button>
        }
      />
    </>
  );
}
