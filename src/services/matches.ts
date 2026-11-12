import type { ServiceResult, SupportMatch } from "@/types";

import { ok } from "./result";

/**
 * Support matches for the signed-in student.
 * TODO: query the `matches` table once the Supabase schema exists.
 */
export async function listMyMatches(): Promise<ServiceResult<SupportMatch[]>> {
  return ok([]);
}
