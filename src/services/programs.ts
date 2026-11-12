import type { ServiceResult, SupportProgram } from "@/types";

import { ok } from "./result";

/**
 * Programs owned by the signed-in organization.
 * TODO: query the `programs` table once the Supabase schema exists.
 */
export async function listMyPrograms(): Promise<ServiceResult<SupportProgram[]>> {
  return ok([]);
}
