import type { CurrencyCode } from "@/types";

export interface CurrencyMeta {
  code: CurrencyCode;
  name: string;
  /** Units of this currency per 1 USD. FIXED, APPROXIMATE demo rate. */
  perUsd: number;
}

/**
 * Fixed, approximate rates used only so totals can be shown in one currency.
 * They are NOT live exchange rates. Replace with a rates service before
 * relying on converted amounts for real decisions.
 */
export const CURRENCY_META: Record<CurrencyCode, CurrencyMeta> = {
  USD: { code: "USD", name: "US dollar", perUsd: 1 },
  EUR: { code: "EUR", name: "Euro", perUsd: 0.92 },
  GBP: { code: "GBP", name: "Pound sterling", perUsd: 0.79 },
  CAD: { code: "CAD", name: "Canadian dollar", perUsd: 1.36 },
  AUD: { code: "AUD", name: "Australian dollar", perUsd: 1.52 },
  AED: { code: "AED", name: "UAE dirham", perUsd: 3.6725 },
  INR: { code: "INR", name: "Indian rupee", perUsd: 83.5 },
  KES: { code: "KES", name: "Kenyan shilling", perUsd: 129 },
  NGN: { code: "NGN", name: "Nigerian naira", perUsd: 1500 },
  GHS: { code: "GHS", name: "Ghanaian cedi", perUsd: 15 },
  ZAR: { code: "ZAR", name: "South African rand", perUsd: 18.5 },
  BRL: { code: "BRL", name: "Brazilian real", perUsd: 5.1 },
  MXN: { code: "MXN", name: "Mexican peso", perUsd: 17.2 },
  PHP: { code: "PHP", name: "Philippine peso", perUsd: 56 },
  SGD: { code: "SGD", name: "Singapore dollar", perUsd: 1.34 },
  JPY: { code: "JPY", name: "Japanese yen", perUsd: 150 },
};

export const RATES_DISCLAIMER =
  "Converted amounts use fixed, approximate demo exchange rates, not live rates.";
