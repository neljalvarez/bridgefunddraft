import type { ServiceErrorCode, ServiceResult } from "@/types";

export function ok<T>(data: T): ServiceResult<T> {
  return { ok: true, data };
}

export function fail<T = never>(
  code: ServiceErrorCode,
  message: string,
): ServiceResult<T> {
  return { ok: false, error: { code, message } };
}

/** Item count for display, or an em dash when the lookup failed. */
export function countItems<T>(result: ServiceResult<T[]>): number | "—" {
  return result.ok ? result.data.length : "—";
}

export const NOT_CONFIGURED_MESSAGE =
  "BridgeFund isn't connected to Supabase yet. Add your project keys to .env.local (see the README) and restart the dev server.";
