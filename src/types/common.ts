/** Primary key type. Supabase uses UUID strings. */
export type ID = string;

/** ISO 8601 timestamp string, e.g. "2026-11-12T08:30:00Z". */
export type ISODateString = string;

/** Calendar date without a time, "YYYY-MM-DD". Compare these as strings. */
export type DateOnlyString = string;

/** Monetary amount stored in minor units (cents) to avoid float errors. */
export interface Money {
  amountMinor: number;
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string;
}

/** A single labelled data point for charts. */
export interface ChartDatum {
  label: string;
  value: number;
}

export type ServiceErrorCode =
  | "not_configured"
  | "unauthorized"
  | "not_found"
  | "validation"
  | "unknown";

export interface ServiceError {
  code: ServiceErrorCode;
  message: string;
}

/** Discriminated result returned by every service function. */
export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ServiceError };
