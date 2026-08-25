// Pure, dependency-free compounding math for the Compound Interest Lab.
//
// Model: closed-form (no simulation, no randomness). The principal compounds at
// the selected frequency; the monthly contribution is spread across the
// compounding periods so the *annual* amount saved stays constant regardless of
// the compounding frequency the learner picks.

export interface CompoundInput {
  /** Starting balance. */
  principal: number;
  /** Amount added every month. */
  monthlyContribution: number;
  /** Nominal annual interest rate as a decimal (0.05 = 5%). */
  annualRate: number;
  /** Time horizon in whole years. */
  years: number;
  /** Compounding periods per year (12 = monthly, 1 = annually). */
  compoundingPerYear: number;
}

export interface SeriesPoint {
  year: number;
  balance: number;
}

/**
 * Future balance for the given scenario.
 *
 * FV = P(1+i)^N + pmt * ((1+i)^N - 1) / i
 * where i = annualRate / n, N = n * years, pmt = 12*monthly / n (so the annual
 * contribution 12*monthly is invariant to n). The i = 0 case is linear.
 */
export function projectBalance(input: CompoundInput): number {
  const {
    principal,
    monthlyContribution,
    annualRate,
    years,
    compoundingPerYear,
  } = input;
  const n = compoundingPerYear;
  const periods = n * years;
  const periodRate = annualRate / n;
  const pmtPerPeriod = (monthlyContribution * 12) / n;

  const growth = (1 + periodRate) ** periods;
  const principalFv = principal * growth;
  const contributionFv =
    periodRate === 0
      ? pmtPerPeriod * periods
      : pmtPerPeriod * ((growth - 1) / periodRate);

  return principalFv + contributionFv;
}

/** Balance-over-time points, one per year plus year 0, for the curve. */
export function series(input: CompoundInput): SeriesPoint[] {
  const points: SeriesPoint[] = [];
  for (let year = 0; year <= input.years; year++) {
    points.push({ year, balance: projectBalance({ ...input, years: year }) });
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

/**
 * Discount a nominal balance-over-time series into today's money, point by
 * point, so a real (inflation-adjusted) curve can be drawn alongside the
 * nominal one.
 */
export function realSeries(
  points: SeriesPoint[],
  inflationRate: number,
): SeriesPoint[] {
  return points.map((p) => ({
    year: p.year,
    balance: toReal(p.balance, inflationRate, p.year),
  }));
}
