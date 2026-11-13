import { CalendarClock, FileText, Receipt } from "lucide-react";
import Link from "next/link";

import { describeDaysLeft } from "@/lib/dates";
import { formatDay } from "@/lib/format";
import type { DeadlineItem, DeadlineKind } from "@/lib/gap/portfolio";
import { cn } from "@/lib/utils";

const KIND_ICON = {
  opportunity: CalendarClock,
  expense: Receipt,
  support: FileText,
} as const satisfies Record<DeadlineKind, unknown>;

const KIND_LABEL: Record<DeadlineKind, string> = {
  opportunity: "Opportunity",
  expense: "Expense",
  support: "Support application",
};

export function DeadlineList({ items }: { items: DeadlineItem[] }) {
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => {
        const Icon = KIND_ICON[item.kind];
        const overdue = item.daysLeft < 0;
        const urgent = !overdue && item.daysLeft <= 7;
        return (
          <li key={item.id}>
            <Link
              href={`/student/resolver?opportunity=${item.opportunityId}&step=6`}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  overdue ? "bg-destructive-soft text-destructive-foreground" : urgent ? "bg-warning-soft text-warning-foreground" : "bg-accent text-primary",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-navy">{item.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {KIND_LABEL[item.kind]} · {item.context}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span
                  className={cn(
                    "block text-xs font-semibold",
                    overdue ? "text-destructive-foreground" : urgent ? "text-warning-foreground" : "text-navy",
                  )}
                >
                  {overdue ? `Overdue · ${describeDaysLeft(item.daysLeft)}` : describeDaysLeft(item.daysLeft)}
                </span>
                <span className="block text-xs text-muted-foreground">{formatDay(item.date)}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
