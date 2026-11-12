import { Bus, ClipboardCheck, FileInput, Laptop, BookOpen } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Card } from "@/components/ui/card";

const SMALL_EXPENSES = [
  { icon: FileInput, title: "Application fees", text: "Charged before anyone has even seen the application." },
  { icon: ClipboardCheck, title: "Exam registration", text: "A single test fee can decide whether a student sits it." },
  { icon: Laptop, title: "Devices and internet", text: "Coursework often assumes access that isn’t guaranteed." },
  { icon: Bus, title: "Getting there", text: "Interviews, classes, and campus visits all need transport." },
  { icon: BookOpen, title: "Books and materials", text: "Required supplies arrive after the tuition decision is made." },
] as const;

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
        <div className="lg:col-span-2">
          <SectionHeading
            eyebrow="The problem"
            title="It’s rarely one big cost. It’s the small ones."
            description="A scholarship may cover tuition and still leave a fee, a device, or a bus pass uncovered. Each is small on its own, but any one of them can end an application before it starts. Most support is organized around whole awards, so these gaps go unmatched."
          />
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          {SMALL_EXPENSES.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Card className="h-full p-5 transition-shadow hover:shadow-popover">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-navy">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
