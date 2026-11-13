import { CURRENCY_META } from "@/config/currencies";
import type { CurrencyCode } from "@/types";

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Convert using the fixed demo rates in config/currencies.ts. */
export function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  if (from === to) return round2(amount);
  const usd = amount / CURRENCY_META[from].perUsd;
  return round2(usd * CURRENCY_META[to].perUsd);
}

/** "$1,200" for whole amounts, "$1,200.50" otherwise. */
export function formatCurrency(
  amount: number,
  currency: string,
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    ...(Number.isInteger(amount) ? { maximumFractionDigits: 0 } : {}),
  }).format(amount);
}

/** Parse a user-typed amount like "1,200.50". Returns null if not a number >= 0. */
export function parseAmount(text: string): number | null {
  const cleaned = text.replace(/[,\s]/g, "");
  if (cleaned === "") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) && value >= 0 ? round2(value) : null;
}
