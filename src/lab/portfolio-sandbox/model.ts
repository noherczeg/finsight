// Pure, dependency-free portfolio math for the Portfolio Sandbox.
//
// One shared model feeds every lens: each asset class carries an expected
// return, a volatility, and a fee; the learner sets weights (a mix) and a
// global correlation. All figures below are closed-form (deterministic) — the
// only randomness in the sandbox lives in the seeded Monte Carlo sampler
// (random.ts), never here.

export interface AssetClass {
  id: string;
  label: string;
  /** Expected nominal annual return, as a decimal (0.10 = 10%). */
  mu: number;
  /** Annual volatility (standard deviation of return), as a decimal. */
  sigma: number;
  /** Annual expense-ratio fee, as a decimal (0.0004 = 0.04%). */
  fee: number;
}

/** Illustrative long-run asset classes. Numbers are teaching defaults, not
 * forecasts; the historical lens replays real data instead. */
export const ASSETS: AssetClass[] = [
  { id: "stocks", label: "Stocks", mu: 0.1, sigma: 0.16, fee: 0.0004 },
  { id: "bonds", label: "Bonds", mu: 0.05, sigma: 0.07, fee: 0.0003 },
  { id: "cash", label: "Cash", mu: 0.03, sigma: 0.01, fee: 0.0001 },
  { id: "gold", label: "Gold", mu: 0.06, sigma: 0.18, fee: 0.0025 },
];

/** Risk-free rate used for the Sharpe lens (decimal). */
export const RISK_FREE = 0.03;

/**
 * Lowest correlation the global dial may take while the equicorrelation matrix
 * stays positive semi-definite: rho >= -1/(N-1). Below this the covariance is
 * invalid (and the Monte Carlo variance could go negative).
 */
export function minCorrelation(assetCount: number): number {
  return assetCount <= 1 ? 0 : -1 / (assetCount - 1);
}

/** Normalize raw weights so they sum to 1. Equal split if the total is 0. */
export function normalizeWeights(weights: number[]): number[] {
  const total = weights.reduce((s, w) => s + Math.max(0, w), 0);
  if (total <= 0) return weights.map(() => 1 / weights.length);
  return weights.map((w) => Math.max(0, w) / total);
}

/** Portfolio expected return: the weighted average of asset returns. */
export function portfolioReturn(
  assets: AssetClass[],
  weights: number[],
): number {
  const w = normalizeWeights(weights);
  return assets.reduce((s, a, i) => s + w[i] * a.mu, 0);
}

/** Blended fee: the weighted average of asset fees. */
export function blendedFee(assets: AssetClass[], weights: number[]): number {
  const w = normalizeWeights(weights);
  return assets.reduce((s, a, i) => s + w[i] * a.fee, 0);
}

/** Net (after-fee) portfolio expected return. */
export function netReturn(assets: AssetClass[], weights: number[]): number {
  return portfolioReturn(assets, weights) - blendedFee(assets, weights);
}

/**
 * Portfolio volatility with a single global correlation applied to every
 * distinct asset pair:
 *   sigma_p^2 = sum_i sum_j w_i w_j sigma_i sigma_j rho_ij
 * where rho_ii = 1 and rho_ij = rho for i != j.
 */
export function portfolioVol(
  assets: AssetClass[],
  weights: number[],
  rho: number,
): number {
  const w = normalizeWeights(weights);
  let variance = 0;
  for (let i = 0; i < assets.length; i++) {
    for (let j = 0; j < assets.length; j++) {
      const corr = i === j ? 1 : rho;
      variance += w[i] * w[j] * assets[i].sigma * assets[j].sigma * corr;
    }
  }
  return Math.sqrt(Math.max(0, variance));
}

/**
 * Weighted-average volatility — the "sum of the parts" with no diversification
 * benefit (equivalent to rho = 1). Portfolio vol sits at or below this.
 */
export function weightedAvgVol(
  assets: AssetClass[],
  weights: number[],
): number {
  const w = normalizeWeights(weights);
  return assets.reduce((s, a, i) => s + w[i] * a.sigma, 0);
}

/** Sharpe ratio: reward per unit of risk. Null when risk is ~zero. */
export function sharpe(
  meanReturn: number,
  vol: number,
  riskFree = RISK_FREE,
): number | null {
  if (vol < 1e-9) return null;
  return (meanReturn - riskFree) / vol;
}

export interface SeriesPoint {
  year: number;
  balance: number;
}

/**
 * Deterministic mean-path projection: start at `principal`, add
 * `annualContribution` each year, compound at a constant `annualReturn`.
 * One point per year plus year 0.
 */
export function projectMean(
  principal: number,
  annualContribution: number,
  annualReturn: number,
  years: number,
): SeriesPoint[] {
  const points: SeriesPoint[] = [{ year: 0, balance: principal }];
  let balance = principal;
  for (let year = 1; year <= years; year++) {
    balance = balance * (1 + annualReturn) + annualContribution;
    points.push({ year, balance });
  }
  return points;
}

/** Convert a nominal future value into today's (real) money. */
export function toReal(
  nominal: number,
  inflationRate: number,
  years: number,
): number {
  return nominal / (1 + inflationRate) ** years;
}

/** Discount a nominal series into today's money, point by point. */
export function realSeries(
  points: SeriesPoint[],
  inflationRate: number,
): SeriesPoint[] {
  return points.map((p) => ({
    year: p.year,
    balance: toReal(p.balance, inflationRate, p.year),
  }));
}
