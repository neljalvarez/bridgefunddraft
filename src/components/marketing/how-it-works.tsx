import { Compass, Handshake, ListChecks, ShieldCheck } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";

const STEPS = [
  {
    icon: Compass,
    title: "Identify an opportunity",
    text: "Choose the program, course, exam, or scholarship you want to pursue.",
  },
  {
    icon: ListChecks,
    title: "Break down its costs",
    text: "List every expense involved, from fees to travel, so the real gap is visible.",
  },
  {
    icon: ShieldCheck,
    title: "Find verified support",
    text: "See programs from organizations that BridgeFund administrators have reviewed.",
  },
  {
    icon: Handshake,
    title: "Resolve the remaining gap",
    text: "Apply, track each decision, and close whatever is left until nothing stands in the way.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-border bg-card"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From an opportunity to a closed gap, in four steps"
        />

        <ol className="relative mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Connector line behind the step badges (desktop only) */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-5 hidden h-px bg-border lg:block"
          />
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="relative">
              <span className="relative flex size-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white ring-8 ring-card">
                {index + 1}
              </span>
              <div className="mt-5 flex items-center gap-2 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-2 text-base font-semibold text-navy">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
