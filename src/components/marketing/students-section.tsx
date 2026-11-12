import { FileText, Handshake, Wallet } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Wallet,
    title: "Barrier resolver",
    text: "Describe what stands between you and an opportunity, one expense at a time.",
  },
  {
    icon: Handshake,
    title: "Verified matches",
    text: "See support from reviewed organizations that fits each cost.",
  },
  {
    icon: FileText,
    title: "Application tracking",
    text: "Follow every application from draft to decision in a single place.",
  },
] as const;

export function StudentsSection() {
  return (
    <section
      id="for-students"
      className="scroll-mt-20 border-y border-border bg-card"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-5 lg:gap-14 lg:px-8">
        <div className="lg:col-span-2">
          <SectionHeading
            eyebrow="For students"
            title="Know your real gap, then close it"
            description="Stop guessing which costs you can cover. BridgeFund turns an opportunity into a clear list of expenses and helps you find support for each."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/register?role=student">Find Financial Support</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/student/resolver">Preview the resolver</Link>
            </Button>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Card className="h-full p-5 shadow-none transition-shadow hover:shadow-popover">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-navy">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
