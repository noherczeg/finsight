import {
  projectBalance,
  series,
  toReal,
  realSeries,
  type CompoundInput,
} from "./math.ts";

const base: CompoundInput = {
  principal: 1000,
  monthlyContribution: 100,
  annualRate: 0.05,
  years: 10,
  compoundingPerYear: 12,
};

describe("projectBalance", () => {
  it("returns just the principal when nothing else contributes", () => {
    expect(
      projectBalance({
        principal: 1000,
        monthlyContribution: 0,
        annualRate: 0,
        years: 10,
        compoundingPerYear: 12,
      }),
    ).toBe(1000);
  });

  it("is linear (principal + all contributions) at a zero rate", () => {
    // 1000 principal + 100/mo * 12 months * 10 years
    expect(
      projectBalance({
        principal: 1000,
        monthlyContribution: 100,
        annualRate: 0,
        years: 10,
        compoundingPerYear: 12,
      }),
    ).toBeCloseTo(1000 + 100 * 12 * 10, 6);
  });

  it("compounds the principal alone as P(1+i)^N", () => {
    const i = 0.06 / 12;
    const expected = 2000 * (1 + i) ** (12 * 5);
    expect(
      projectBalance({
        principal: 2000,
        monthlyContribution: 0,
        annualRate: 0.06,
        years: 5,
        compoundingPerYear: 12,
      }),
    ).toBeCloseTo(expected, 6);
  });

  it("exceeds the linear (simple) total once a positive rate compounds", () => {
    const linear = 1000 + 100 * 12 * 10;
    expect(projectBalance(base)).toBeGreaterThan(linear);
  });

  it("grows monotonically with the time horizon", () => {
    const a = projectBalance({ ...base, years: 10 });
    const b = projectBalance({ ...base, years: 20 });
    const c = projectBalance({ ...base, years: 30 });
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThan(b);
  });

  it("keeps total annual contribution stable across compounding frequency", () => {
    // annual vs monthly compounding with the same 0 rate must match
    const monthly = projectBalance({
      ...base,
      annualRate: 0,
      compoundingPerYear: 12,
    });
    const annual = projectBalance({
      ...base,
      annualRate: 0,
      compoundingPerYear: 1,
    });
    expect(monthly).toBeCloseTo(annual, 6);
  });
});

describe("series", () => {
  it("starts at the principal and ends at the full projection", () => {
    const points = series(base);
    expect(points[0]).toEqual({ year: 0, balance: base.principal });
    expect(points.at(-1)?.year).toBe(base.years);
    expect(points.at(-1)?.balance).toBeCloseTo(projectBalance(base), 6);
  });

  it("returns one point per year plus year zero", () => {
    expect(series(base)).toHaveLength(base.years + 1);
  });

  it("is non-decreasing for a positive rate", () => {
    const points = series(base);
    for (let k = 1; k < points.length; k++) {
      expect(points[k].balance).toBeGreaterThanOrEqual(points[k - 1].balance);
    }
  });
});

describe("toReal", () => {
  it("returns the nominal value at zero inflation", () => {
    expect(toReal(10000, 0, 10)).toBe(10000);
  });

  it("discounts by (1+inflation)^years", () => {
    expect(toReal(10000, 0.03, 10)).toBeCloseTo(10000 / 1.03 ** 10, 6);
  });
});

describe("realSeries", () => {
  it("leaves year 0 untouched and discounts later years", () => {
    const nominal = series(base);
    const real = realSeries(nominal, 0.03);
    expect(real[0].balance).toBeCloseTo(nominal[0].balance, 6);
    expect(real.at(-1)?.balance ?? 0).toBeLessThan(
      nominal.at(-1)?.balance ?? 0,
    );
  });

  it("equals the nominal series at zero inflation", () => {
    const nominal = series(base);
    const real = realSeries(nominal, 0);
    real.forEach((p, i) =>
      expect(p.balance).toBeCloseTo(nominal[i].balance, 6),
    );
  });
});
