import { Handshake } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Matches" };

export default function StudentMatchesPage() {
  return (
    <>
      <PageHeader
        title="Matches"
        description="Verified support programs suggested for your financial barriers."
      />
      <EmptyState
        icon={Handshake}
        title="No matches yet"
        description="Matches are created from the barriers you describe. Start by describing one in the resolver."
        action={
          <Button asChild>
            <Link href="/student/resolver">Open the resolver</Link>
          </Button>
        }
      />
    </>
  );
}
