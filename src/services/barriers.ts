import type { FinancialBarrier, ServiceResult } from "@/types";

import { ok } from "./result";

/**
 * Barriers belonging to the signed-in student.
 * TODO: query the `barriers` table once the Supabase schema exists.
 */
export async function listMyBarriers(): Promise<ServiceResult<FinancialBarrier[]>> {
  return ok([]);
}
