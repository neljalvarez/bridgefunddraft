import type { ISODateString, Money } from "@/types";

export function formatMoney({ amountMinor, currency }: Money, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

/** Format a "YYYY-MM-DD" date without shifting it across time zones. */
export function formatDay(value: string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatDate(value: ISODateString, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(value),
  );
}
