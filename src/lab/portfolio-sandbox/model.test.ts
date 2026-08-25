import {
  ASSETS,
  blendedFee,
  minCorrelation,
  netReturn,
  normalizeWeights,
  portfolioReturn,
  portfolioVol,
  projectMean,
  realSeries,
  sharpe,
  toReal,
  weightedAvgVol,
  type AssetClass,
} from "./model.ts";

const twoRisky: AssetClass[] = [
  { id: "a", label: "A", mu: 0.1, sigma: 0.2, fee: 0 },
  { id: "b", label: "B", mu: 0.06, sigma: 0.1, fee: 0 },
];

describe("normalizeWeights", () => {
  it("scales weights to sum to 1", () => {
    expect(normalizeWeights([2, 2])).toEqual([0.5, 0.5]);
    expect(normalizeWeights([60, 30, 10, 0])).toEqual([0.6, 0.3, 0.1, 0]);
  });

  it("falls back to an equal split when the total is zero", () => {
    expect(normalizeWeights([0, 0, 0, 0])).toEqual([0.25, 0.25, 0.25, 0.25]);
  });
});

describe("portfolioReturn", () => {
  it("is the weighted average of asset returns", () => {
    expect(portfolioReturn(twoRisky, [1, 1])).toBeCloseTo(0.08, 12);
    expect(portfolioReturn(twoRisky, [3, 1])).toBeCloseTo(0.09, 12);
  });
});

describe("fees", () => {
  it("blends fees by weight and subtracts them from the gross return", () => {
    const assets: AssetClass[] = [
      { id: "a", label: "A", mu: 0.1, sigma: 0.2, fee: 0.01 },
      { id: "b", label: "B", mu: 0.1, sigma: 0.1, fee: 0.0 },
    ];
    expect(blendedFee(assets, [1, 1])).toBeCloseTo(0.005, 12);
    expect(netReturn(assets, [1, 1])).toBeCloseTo(0.1 - 0.005, 12);
  });
});

describe("portfolioVol — the diversification effect", () => {
  it("equals the weighted-average vol at perfect correlation", () => {
    expect(portfolioVol(twoRisky, [1, 1], 1)).toBeCloseTo(
      weightedAvgVol(twoRisky, [1, 1]),
      12,
    );
  });

  it("drops below the weighted-average vol when correlation is low", () => {
    const vol = portfolioVol(twoRisky, [1, 1], 0);
    // 50/50, rho=0: sqrt(0.25*0.04 + 0.25*0.01) = sqrt(0.0125) ~ 0.1118
    expect(vol).toBeCloseTo(Math.sqrt(0.0125), 6);
    expect(vol).toBeLessThan(weightedAvgVol(twoRisky, [1, 1])); // the free lunch
    expect(vol).toBeLessThan(twoRisky[0].sigma); // below the riskier asset
  });

  it("can fall below the least-risky asset with a negative correlation", () => {
    const vol = portfolioVol(twoRisky, [1, 3], minCorrelation(2));
    expect(vol).toBeLessThan(twoRisky[1].sigma);
  });

  it("is monotonically increasing in correlation", () => {
    const low = portfolioVol(twoRisky, [1, 1], -0.5);
    const mid = portfolioVol(twoRisky, [1, 1], 0);
    const high = portfolioVol(twoRisky, [1, 1], 1);
    expect(low).toBeLessThan(mid);
    expect(mid).toBeLessThan(high);
  });

  it("never exceeds the weighted-average vol for valid correlations", () => {
    const avg = weightedAvgVol(twoRisky, [1, 1]);
    expect(portfolioVol(twoRisky, [1, 1], 0.3)).toBeLessThanOrEqual(avg + 1e-9);
  });
});

describe("minCorrelation", () => {
  it("is the PSD floor -1/(N-1)", () => {
    expect(minCorrelation(4)).toBeCloseTo(-1 / 3, 12);
    expect(minCorrelation(2)).toBeCloseTo(-1, 12);
  });

  it("keeps the four-asset variance non-negative at the floor", () => {
    const vol = portfolioVol(
      ASSETS,
      [1, 1, 1, 1],
      minCorrelation(ASSETS.length),
    );
    expect(vol).toBeGreaterThanOrEqual(0);
    expect(Number.isNaN(vol)).toBe(false);
  });
});

describe("sharpe", () => {
  it("is (mean - risk free) / vol", () => {
    expect(sharpe(0.09, 0.12, 0.03)).toBeCloseTo((0.09 - 0.03) / 0.12, 12);
  });

  it("returns null when volatility is ~zero", () => {
    expect(sharpe(0.09, 0, 0.03)).toBeNull();
  });

  it("rewards a lower-risk mix for the same return", () => {
    const a = sharpe(0.08, 0.2) ?? 0;
    const b = sharpe(0.08, 0.1) ?? 0;
    expect(b).toBeGreaterThan(a);
  });
});

describe("projectMean", () => {
  it("returns just the principal at a zero return with no contributions", () => {
    const pts = projectMean(1000, 0, 0, 10);
    expect(pts).toHaveLength(11);
    expect(pts.at(-1)?.balance).toBeCloseTo(1000, 9);
  });

  it("is linear at a zero return with contributions", () => {
    const pts = projectMean(1000, 1200, 0, 10);
    expect(pts.at(-1)?.balance).toBeCloseTo(1000 + 1200 * 10, 6);
  });

  it("compounds a lump sum as P(1+r)^N", () => {
    const pts = projectMean(2000, 0, 0.06, 5);
    expect(pts.at(-1)?.balance).toBeCloseTo(2000 * 1.06 ** 5, 6);
  });

  it("grows lower under a higher fee (lower net return)", () => {
    const gross = projectMean(1000, 100, 0.07, 30).at(-1)?.balance ?? 0;
    const afterFee =
      projectMean(1000, 100, 0.07 - 0.01, 30).at(-1)?.balance ?? 0;
    expect(afterFee).toBeLessThan(gross);
  });
});

describe("toReal / realSeries", () => {
  it("returns the nominal value at zero inflation", () => {
    expect(toReal(10000, 0, 10)).toBe(10000);
  });

  it("discounts a series and leaves year 0 untouched", () => {
    const nominal = projectMean(1000, 100, 0.07, 20);
    const real = realSeries(nominal, 0.025);
    expect(real[0].balance).toBeCloseTo(nominal[0].balance, 9);
    expect(real.at(-1)!.balance).toBeLessThan(nominal.at(-1)!.balance);
  });
});
