// Locale-flexible currency formatting. No hard-coded symbol — every monetary
// value in the lab flows through here so the learner's chosen locale/currency
// drives presentation.

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
