import { Bookmark, BookmarkCheck, CalendarClock, ExternalLink, Plus, X } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CLAIM_STATUS_META, VERIFICATION_STATUS_META } from "@/config/status";
import { RESOURCE_KIND_META } from "@/config/student-options";
import { formatCurrency } from "@/lib/currency";
import { daysBetween, describeDaysLeft } from "@/lib/dates";
import { formatDay } from "@/lib/format";
import { describeValue } from "@/lib/gap/matching";
import { cn } from "@/lib/utils";
import type { ClaimStatus, CurrencyCode, DateOnlyString, SupportResource } from "@/types";

interface ResourceCardProps {
  resource: SupportResource;
  today: DateOnlyString;
  /** Potential value for the expense this is matched to. */
  value?: { amount: number; currency: CurrencyCode };
  /** Why it matched this student. */
  reasons?: string[];
  saved: boolean;
  onToggleSave: () => void;
  /** Plan state for this resource + expense; null/undefined when not in the plan. */
  planStatus?: ClaimStatus | null;
  onAdd?: () => void;
  onRemove?: () => void;
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{children}</dd>
    </div>
  );
}

export function ResourceCard({
  resource,
  today,
  value,
  reasons,
  saved,
  onToggleSave,
  planStatus,
  onAdd,
  onRemove,
}: ResourceCardProps) {
  const kind = RESOURCE_KIND_META[resource.kind];
  const KindIcon = kind.icon;
  const verification = VERIFICATION_STATUS_META[resource.verification];
  const days = resource.deadline ? daysBetween(today, resource.deadline) : null;
  const inPlan = planStatus != null;
  const removable = inPlan && (planStatus === "planned" || planStatus === "applied" || planStatus === "declined");

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          <KindIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-navy">{resource.name}</h4>
          <p className="text-xs text-muted-foreground">{resource.provider}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone="info">{kind.label}</Badge>
            <Badge tone={verification.tone}>{verification.label}</Badge>
            <Badge tone="neutral">Demo listing</Badge>
            {inPlan ? <StatusBadge meta={CLAIM_STATUS_META[planStatus]} /> : null}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="-mr-2 -mt-1 shrink-0"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${resource.name} from saved resources` : `Save ${resource.name}`}
        >
          {saved ? <BookmarkCheck className="text-primary" /> : <Bookmark />}
        </Button>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{resource.description}</p>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <Fact label={kind.selfDirected ? "Estimated saving" : "Potential value, if approved"}>
          <span className="font-semibold text-navy">
            {value ? formatCurrency(value.amount, value.currency) : describeValue(resource)}
          </span>
          {value ? <span className="text-muted-foreground"> · {describeValue(resource)}</span> : null}
        </Fact>
        <Fact label="Application deadline">
          {resource.deadline && days !== null ? (
            <span className={cn("inline-flex items-center gap-1.5", days <= 7 && "font-medium text-warning-foreground")}>
              <CalendarClock className="size-3.5" aria-hidden="true" />
              {formatDay(resource.deadline)} · {describeDaysLeft(days)}
            </span>
          ) : (
            "Rolling, no fixed deadline"
          )}
        </Fact>
        <Fact label="Eligibility">{resource.eligibility.summary}</Fact>
        <Fact label="Official source">
          <a
            href={resource.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            {resource.sourceName}
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <span className="block text-xs text-muted-foreground">Fictional demo link</span>
        </Fact>
      </dl>

      {reasons && reasons.length > 0 ? (
        <div className="mt-4 rounded-lg bg-muted/60 p-3">
          <p className="text-xs font-medium text-navy">Why it fits you</p>
          <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
            {reasons.map((reason) => (
              <li key={reason} className="before:mr-1.5 before:content-['•']">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {resource.verification === "pending" ? (
        <p className="mt-3 text-xs text-warning-foreground">
          Not yet verified. Confirm the details with the provider before you apply.
        </p>
      ) : null}

      {onAdd || onRemove ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {inPlan ? (
            removable && onRemove ? (
              <Button variant="outline" size="sm" onClick={onRemove}>
                <X /> Remove from plan
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                In your plan. Update its status under Applications.
              </p>
            )
          ) : onAdd ? (
            <Button size="sm" onClick={onAdd}>
              <Plus /> Add to my plan
            </Button>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
