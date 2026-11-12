import { FolderKanban, Inbox, LineChart, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: FolderKanban,
    title: "Publish programs",
    text: "Describe the support you offer and who it is for.",
  },
  {
    icon: ShieldCheck,
    title: "Get verified",
    text: "Administrators review organizations before programs are shown.",
  },
  {
    icon: Inbox,
    title: "Review applications",
    text: "Receive applications matched to the expenses you fund.",
  },
  {
    icon: LineChart,
    title: "See your impact",
    text: "Understand the outcomes of the support you provide.",
  },
] as const;

export function OrganizationsSection() {
  return (
    <section id="for-organizations" className="scroll-mt-20 bg-navy">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            tone="dark"
            eyebrow="For organizations"
            title="Fund the exact expense that unblocks a student"
            description="Scholarships, foundations, schools, and employers can direct support to specific, verified needs instead of broad calls for applicants."
          />
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/register?role=organization">Partner With Us</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/organization/dashboard">Preview the workspace</Link>
            </Button>
          </div>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="bg-navy p-6">
              <Icon className="size-5 text-blue-300" aria-hidden="true" />
              <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
              <p className="mt-1.5 text-sm text-white/70">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
