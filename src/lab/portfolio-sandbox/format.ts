// Locale-flexible currency formatting for the Portfolio Sandbox. Duplicated
// (not shared) from the Compound Interest Lab on purpose: each lab stays
// self-contained so changes to one never ripple into the other — no premature
// "lab shell" abstraction. No hard-coded currency symbol.

export interface Locale {
  id: string;
  label: string;
  locale: string;
  currency: string;
}

export const LOCALES: Locale[] = [
  { id: "us", label: "USD ($)", locale: "en-US", currency: "USD" },
  { id: "eu", label: "EUR (€)", locale: "de-DE", currency: "EUR" },
  { id: "gb", label: "GBP (£)", locale: "en-GB", currency: "GBP" },
  { id: "jp", label: "JPY (¥)", locale: "ja-JP", currency: "JPY" },
];

export function formatCurrency(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale.locale, {
    style: "currency",
    currency: locale.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** A percentage from a decimal, e.g. 0.075 -> "7.5%". */
export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}
