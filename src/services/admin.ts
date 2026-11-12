import type { Organization, ServiceResult } from "@/types";

import { ok } from "./result";

/**
 * Organizations waiting for verification.
 * TODO: query the `organizations` table once the Supabase schema exists.
 */
export async function listPendingOrganizations(): Promise<
  ServiceResult<Organization[]>
> {
  return ok([]);
}
