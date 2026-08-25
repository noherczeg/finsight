// Seeded, dependency-free randomness for the Monte Carlo cone.
//
// The whole point of seeding: the same mix + seed yields the same cone every
// time, so the stochastic lens is reproducible, shareable, and unit-testable —
// "randomness without chaos". Nothing here calls Math.random.
//
// Note on correlation: a buy-and-hold portfolio's annual return is a weighted
// sum of the (jointly-normal) asset returns, which is itself normal with mean
// mu_p and standard deviation sigma_p. So we sample the *portfolio* return
// directly from N(mu_p, sigma_p) — the correlation is already baked into
// sigma_p by model.portfolioVol. No Cholesky needed.

import type { SeriesPoint } from "./model.ts";

/** mulberry32 — a tiny, fast, deterministic PRNG. Returns floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A standard-normal sampler (Box–Muller) driven by a uniform generator. */
export function gaussianSampler(next: () => number): () => number {
  return function nextGaussian() {
    let u = 0;
    let v = 0;
    while (u === 0) u = next(); // avoid log(0)
    while (v === 0) v = next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}

export interface ConeInput {
  principal: number;
  annualContribution: number;
  meanReturn: number;
  vol: number;
  years: number;
  paths: number;
  seed: number;
}

export interface ConeBand {
  year: number;
  p10: number;
  p50: number;
  p90: number;
}

/** The linearly-interpolated q-quantile of an already-sorted ascending array. */
export function percentile(sortedAsc: number[], q: number): number {
  if (sortedAsc.length === 0) return 0;
  if (sortedAsc.length === 1) return sortedAsc[0];
  const idx = q * (sortedAsc.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedAsc[lo];
  return sortedAsc[lo] + (sortedAsc[hi] - sortedAsc[lo]) * (idx - lo);
}

/**
 * Simulate `paths` future balance trajectories and reduce them to a p10/p50/p90
 * cone, one band per year (plus year 0). Deterministic for a fixed seed.
 */
export function simulateCone(input: ConeInput): ConeBand[] {
  const { principal, annualContribution, meanReturn, vol, years, paths, seed } =
    input;
  const nextGaussian = gaussianSampler(mulberry32(seed));

  // balancesByYear[year] = array of one balance per path at that year.
  const balancesByYear: number[][] = Array.from(
    { length: years + 1 },
    () => [],
  );
  for (let p = 0; p < paths; p++) {
    let balance = principal;
    balancesByYear[0].push(balance);
    for (let year = 1; year <= years; year++) {
      const r = meanReturn + vol * nextGaussian();
      balance = balance * (1 + r) + annualContribution;
      balancesByYear[year].push(balance);
    }
  }

  return balancesByYear.map((balances, year) => {
    const sorted = balances.toSorted((a, b) => a - b);
    return {
      year,
      p10: percentile(sorted, 0.1),
      p50: percentile(sorted, 0.5),
      p90: percentile(sorted, 0.9),
    };
  });
}

/** The median (p50) line of a cone, as plottable series points. */
export function coneMedian(bands: ConeBand[]): SeriesPoint[] {
  return bands.map((b) => ({ year: b.year, balance: b.p50 }));
}
