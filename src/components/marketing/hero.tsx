import { ArrowRight, Handshake, Search, Send } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PATH_STEPS = [
  {
    icon: Search,
    title: "Identify the barrier",
    text: "Name the cost standing between you and the opportunity.",
  },
  {
    icon: Handshake,
    title: "Find verified support",
    text: "See programs from organizations that have been checked.",
  },
  {
    icon: Send,
    title: "Apply and track",
    text: "Follow each application from draft to decision.",
  },
] as const;

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
      <div>
        <p className="text-sm font-medium text-primary">
          Educational financial accessibility
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
          Don’t let a cost decide what you can learn.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          BridgeFund helps students identify the financial barriers between
          them and an educational opportunity, then connects them with verified
          financial support.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register?role=student">
              Create a student account
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register?role=organization">I represent an organization</Link>
          </Button>
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          How BridgeFund works
        </h2>
        <ol className="mt-6 space-y-6">
          {PATH_STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">
                  {index + 1}. {title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}
