import type { ImpactSummary, ServiceResult } from "@/types";

import { ok } from "./result";

const EMPTY_SUMMARY: ImpactSummary = { metrics: [], series: [] };

/**
 * Impact is computed from real application and funding records only.
 * TODO: aggregate from Supabase once the schema exists.
 */
export async function getStudentImpact(): Promise<ServiceResult<ImpactSummary>> {
  return ok(EMPTY_SUMMARY);
}

export async function getOrganizationImpact(): Promise<
  ServiceResult<ImpactSummary>
> {
  return ok(EMPTY_SUMMARY);
}
