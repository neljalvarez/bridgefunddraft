import { Check, Minus } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Card } from "@/components/ui/card";

const ROWS = [
  {
    aspect: "Where you start",
    traditional: "A list of scholarships to search through",
    bridgefund: "The specific opportunity you want to pursue",
  },
  {
    aspect: "What gets matched",
    traditional: "A whole award, based on broad eligibility",
    bridgefund: "Individual expenses, each with fitting support",
  },
  {
    aspect: "Small costs",
    traditional: "Fees, devices, and travel are often left out",
    bridgefund: "Every line of the budget is counted",
  },
  {
    aspect: "Trust",
    traditional: "Quality and legitimacy vary by source",
    bridgefund: "Organizations are reviewed before they are shown",
  },
  {
    aspect: "Outcome",
    traditional: "Partial coverage, and the gap stays open",
    bridgefund: "The remaining gap is tracked until it is resolved",
  },
] as const;

export function WhyBridgeFund() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading
        eyebrow="Why BridgeFund"
        title="Scholarship discovery finds awards. We close gaps."
        description="Traditional discovery asks what a student qualifies for. BridgeFund asks what is actually stopping them, then matches support to each expense."
      />

      <Card className="mt-10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Traditional scholarship discovery compared with expense-level matching
            </caption>
            <thead>
              <tr className="border-b border-border bg-background">
                <th scope="col" className="w-1/5 px-5 py-3 font-medium text-muted-foreground">
                  <span className="sr-only">Aspect</span>
                </th>
                <th scope="col" className="w-2/5 px-5 py-3 font-semibold text-muted-foreground">
                  Traditional scholarship discovery
                </th>
                <th scope="col" className="w-2/5 bg-accent px-5 py-3 font-semibold text-navy">
                  BridgeFund expense-level matching
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(({ aspect, traditional, bridgefund }) => (
                <tr key={aspect} className="border-b border-border last:border-b-0">
                  <th scope="row" className="px-5 py-4 align-top font-medium text-navy">
                    {aspect}
                  </th>
                  <td className="px-5 py-4 align-top text-muted-foreground">
                    <span className="flex gap-2">
                      <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      {traditional}
                    </span>
                  </td>
                  <td className="bg-accent/50 px-5 py-4 align-top text-foreground">
                    <span className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                      {bridgefund}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
