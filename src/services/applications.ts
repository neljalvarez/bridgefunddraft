import type { Application, ServiceResult } from "@/types";

import { ok } from "./result";

/**
 * Applications submitted by the signed-in student.
 * TODO: query the `applications` table once the Supabase schema exists.
 */
export async function listMyApplications(): Promise<ServiceResult<Application[]>> {
  return ok([]);
}

/**
 * Applications received by the signed-in organization's programs.
 * TODO: query the `applications` table filtered by organization.
 */
export async function listReceivedApplications(): Promise<
  ServiceResult<Application[]>
> {
  return ok([]);
}
