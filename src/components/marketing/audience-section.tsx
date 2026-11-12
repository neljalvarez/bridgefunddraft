import { Building2, GraduationCap, ShieldCheck } from "lucide-react";

import { Card } from "@/components/ui/card";

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: "For students",
    text: "Describe what’s in your way, see support that fits, and keep every application in one place.",
  },
  {
    icon: Building2,
    title: "For organizations",
    text: "Publish support programs, review applications, and see the outcomes of the support you provide.",
  },
  {
    icon: ShieldCheck,
    title: "Verification first",
    text: "Organizations are reviewed by BridgeFund administrators before their programs are shown to students.",
  },
] as const;

export function AudienceSection() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-navy">
          Built for everyone in the support chain
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {AUDIENCES.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-6 shadow-none">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-navy">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
