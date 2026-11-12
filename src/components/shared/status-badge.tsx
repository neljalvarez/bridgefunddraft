import { Badge } from "@/components/ui/badge";
import type { StatusMeta } from "@/config/status";

/** Renders a status using label + tone metadata from src/config/status.ts. */
export function StatusBadge({ meta }: { meta: StatusMeta }) {
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
