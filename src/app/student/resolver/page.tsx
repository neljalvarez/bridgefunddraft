import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { PortalSkeleton } from "@/components/shared/portal-skeleton";
import { ResolverWizard } from "@/components/student/resolver/resolver-wizard";

export const metadata: Metadata = { title: "Gap Resolver" };

export default function StudentResolverPage() {
  return (
    <>
      <PageHeader
        title="Gap Resolver"
        description="Break an opportunity into its costs, then find verified ways to cover each one."
      />
      {/* useSearchParams in the wizard needs a Suspense boundary under Cache Components. */}
      <Suspense fallback={<PortalSkeleton />}>
        <ResolverWizard />
      </Suspense>
    </>
  );
}
