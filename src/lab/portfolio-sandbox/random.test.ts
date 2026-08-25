import {
  coneMedian,
  gaussianSampler,
  mulberry32,
  percentile,
  simulateCone,
  type ConeInput,
} from "./random.ts";

describe("mulberry32", () => {
  it("produces the same sequence for the same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = [a(), a(), a(), a()];
    const seqB = [b(), b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it("produces different sequences for different seeds", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });

  it("stays within [0, 1)", () => {
    const next = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const x = next();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
});

describe("gaussianSampler", () => {
  it("has an approximately standard-normal mean and spread", () => {
    const g = gaussianSampler(mulberry32(99));
    const n = 20000;
    let sum = 0;
    let sumSq = 0;
    for (let i = 0; i < n; i++) {
      const x = g();
      sum += x;
      sumSq += x * x;
    }
    const mean = sum / n;
    const variance = sumSq / n - mean * mean;
    expect(mean).toBeCloseTo(0, 1);
    expect(Math.sqrt(variance)).toBeCloseTo(1, 1);
  });
});

describe("percentile", () => {
  const data = [10, 20, 30, 40, 50];
  it("returns the min, median and max at 0, 0.5 and 1", () => {
    expect(percentile(data, 0)).toBe(10);
    expect(percentile(data, 0.5)).toBe(30);
    expect(percentile(data, 1)).toBe(50);
  });

  it("interpolates between samples", () => {
    expect(percentile(data, 0.1)).toBeCloseTo(14, 9);
  });
});

const base: ConeInput = {
  principal: 1000,
  annualContribution: 1200,
  meanReturn: 0.07,
  vol: 0.15,
  years: 20,
  paths: 500,
  seed: 123,
};

describe("simulateCone", () => {
  it("is reproducible for a fixed seed", () => {
    expect(simulateCone(base)).toEqual(simulateCone(base));
  });

  it("differs when the seed changes", () => {
    const a = simulateCone(base).at(-1)!;
    const b = simulateCone({ ...base, seed: 999 }).at(-1)!;
    expect(a.p50).not.toBe(b.p50);
  });

  it("keeps the bands ordered p10 <= p50 <= p90 at every year", () => {
    for (const band of simulateCone(base)) {
      expect(band.p10).toBeLessThanOrEqual(band.p50);
      expect(band.p50).toBeLessThanOrEqual(band.p90);
    }
  });

  it("starts every band at the principal in year 0", () => {
    const first = simulateCone(base)[0];
    expect(first.p10).toBe(1000);
    expect(first.p50).toBe(1000);
    expect(first.p90).toBe(1000);
  });

  it("returns one band per year plus year 0", () => {
    expect(simulateCone(base)).toHaveLength(base.years + 1);
  });

  it("widens the cone as volatility rises", () => {
    const calm = simulateCone({ ...base, vol: 0.05 }).at(-1)!;
    const wild = simulateCone({ ...base, vol: 0.25 }).at(-1)!;
    expect(wild.p90 - wild.p10).toBeGreaterThan(calm.p90 - calm.p10);
  });
});

describe("coneMedian", () => {
  it("extracts the p50 line", () => {
    const bands = simulateCone(base);
    const median = coneMedian(bands);
    expect(median).toHaveLength(bands.length);
    expect(median[5].balance).toBe(bands[5].p50);
  });
});
