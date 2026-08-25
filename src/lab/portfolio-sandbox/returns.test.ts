import {
  FIRST_YEAR,
  HISTORICAL_RETURNS,
  LAST_YEAR,
  historicalYearReturn,
  replayHistory,
} from "./returns.ts";

describe("historical dataset", () => {
  it("starts in 1971 (post gold peg) and runs contiguously", () => {
    expect(FIRST_YEAR).toBe(1971);
    expect(LAST_YEAR).toBeGreaterThanOrEqual(2023);
    for (let i = 1; i < HISTORICAL_RETURNS.length; i++) {
      expect(HISTORICAL_RETURNS[i].year).toBe(
        HISTORICAL_RETURNS[i - 1].year + 1,
      );
    }
  });

  it("carries plausible decimal returns for all four classes", () => {
    for (const row of HISTORICAL_RETURNS) {
      for (const v of [row.stocks, row.bonds, row.cash, row.gold]) {
        expect(v).toBeGreaterThan(-0.9);
        expect(v).toBeLessThan(2);
      }
    }
  });
});

describe("historicalYearReturn", () => {
  it("picks out a single class at a 100% weight", () => {
    const row = HISTORICAL_RETURNS.find((r) => r.year === 2008)!;
    expect(historicalYearReturn(row, [1, 0, 0, 0])).toBeCloseTo(row.stocks, 12);
    expect(historicalYearReturn(row, [0, 0, 0, 1])).toBeCloseTo(row.gold, 12);
  });

  it("blends classes by weight", () => {
    const row = HISTORICAL_RETURNS.find((r) => r.year === 2008)!;
    const blended = historicalYearReturn(row, [1, 1, 0, 0]);
    expect(blended).toBeCloseTo((row.stocks + row.bonds) / 2, 12);
  });
});

describe("replayHistory", () => {
  it("is deterministic — same inputs, same path", () => {
    const input = {
      weights: [0.6, 0.3, 0.1, 0],
      startYear: 1990,
      principal: 1000,
      annualContribution: 0,
      years: 20,
    };
    expect(replayHistory(input)).toEqual(replayHistory(input));
  });

  it("replays 100% stocks from 2008 through the crash and recovery", () => {
    const path = replayHistory({
      weights: [1, 0, 0, 0],
      startYear: 2008,
      principal: 1000,
      annualContribution: 0,
      years: 2,
    });
    // year 1 = 2008 (-36.55%), year 2 compounds 2009 (+25.94%)
    expect(path[1].balance).toBeCloseTo(1000 * (1 - 0.3655), 6);
    expect(path[2].balance).toBeCloseTo(1000 * (1 - 0.3655) * (1 + 0.2594), 6);
  });

  it("starts at the principal and clamps the horizon to available data", () => {
    const path = replayHistory({
      weights: [1, 0, 0, 0],
      startYear: 2023,
      principal: 500,
      annualContribution: 0,
      years: 40,
    });
    expect(path[0]).toEqual({ year: 0, balance: 500 });
    // only 2023, 2024 available from 2023 → 2 steps
    expect(path).toHaveLength(3);
  });
});
