/** ISO 3166-1 alpha-2 codes offered in country pickers. */
const COUNTRY_CODES = [
  "AE", "AR", "AT", "AU", "BD", "BE", "BR", "CA", "CH", "CL", "CN", "CO",
  "CZ", "DE", "DK", "DZ", "EG", "ES", "ET", "FI", "FR", "GB", "GH", "GR",
  "HK", "HU", "ID", "IE", "IL", "IN", "IQ", "IT", "JO", "JP", "KE", "KR",
  "LB", "LK", "MA", "MX", "MY", "NG", "NL", "NO", "NP", "NZ", "PE", "PH",
  "PK", "PL", "PT", "QA", "RO", "RW", "SA", "SE", "SG", "TH", "TN", "TR",
  "TZ", "UA", "UG", "US", "VN", "ZA", "ZM", "ZW",
] as const;

export const OTHER_COUNTRY = "OTHER";

let displayNames: Intl.DisplayNames | null = null;

export function getCountryName(code: string): string {
  if (code === OTHER_COUNTRY) return "Another country";
  try {
    displayNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return displayNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export interface CountryOption {
  code: string;
  name: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  ...COUNTRY_CODES.map((code) => ({ code, name: getCountryName(code) })).sort(
    (a, b) => a.name.localeCompare(b.name),
  ),
  { code: OTHER_COUNTRY, name: getCountryName(OTHER_COUNTRY) },
];
