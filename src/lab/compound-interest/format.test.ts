import { LOCALES, formatCurrency } from "./format.ts";

describe("formatCurrency", () => {
  it("formats using the selected locale and currency, not a hard-coded symbol", () => {
    const usd = formatCurrency(1234, LOCALES[0]);
    const eur = formatCurrency(1234, LOCALES[1]);
    expect(usd).toContain("$");
    expect(eur).toContain("€");
    expect(usd).not.toEqual(eur);
  });

  it("rounds to whole units", () => {
    expect(formatCurrency(1234.87, LOCALES[0])).toBe("$1,235");
  });
});
