import type { Opportunity, ServiceResult } from "@/types";

import { ok } from "./result";

/**
 * Educational opportunities students can browse.
 * TODO: query the `opportunities` table once the Supabase schema exists.
 */
export async function listOpportunities(): Promise<ServiceResult<Opportunity[]>> {
  return ok([]);
}
