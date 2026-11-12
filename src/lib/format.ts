import type { ISODateString, Money } from "@/types";

export function formatMoney({ amountMinor, currency }: Money, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

export function formatDate(value: ISODateString, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(value),
  );
}
