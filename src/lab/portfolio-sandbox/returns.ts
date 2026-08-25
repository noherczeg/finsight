// Bundled static historical annual returns — the "time-machine" dataset.
//
// Source: Aswath Damodaran (NYU Stern), "Historical Returns on Stocks, Bonds
// and Bills" (histretSP), which carries all four classes in ONE table:
//   stocks = S&P 500 (incl. dividends), bonds = 10-yr US T.Bond,
//   cash   = 3-month T.Bill,           gold  = spot gold.
// Values are annual total returns as decimals.
//
// Window starts 1971 (not 1928): gold was pegged under Bretton Woods until
// 1971, so pre-1971 "gold returns" are meaningless. 1971-onward keeps every
// class honest and still spans 1970s stagflation, 2008, and 2020.
//
// This module is compiled into the bundle — no network request at runtime.

export interface HistoricalYear {
  year: number;
  stocks: number;
  bonds: number;
  cash: number;
  gold: number;
}

/** The order the four series map onto a weights array. */
export const HISTORICAL_KEYS = ["stocks", "bonds", "cash", "gold"] as const;

export const HISTORICAL_RETURNS: HistoricalYear[] = [
  { year: 1971, stocks: 0.1422, bonds: 0.0979, cash: 0.0433, gold: 0.1669 },
  { year: 1972, stocks: 0.1876, bonds: 0.0282, cash: 0.0406, gold: 0.4878 },
  { year: 1973, stocks: -0.1431, bonds: 0.0366, cash: 0.0704, gold: 0.7296 },
  { year: 1974, stocks: -0.259, bonds: 0.0199, cash: 0.0785, gold: 0.6615 },
  { year: 1975, stocks: 0.37, bonds: 0.0361, cash: 0.0579, gold: -0.248 },
  { year: 1976, stocks: 0.2383, bonds: 0.1598, cash: 0.0498, gold: -0.041 },
  { year: 1977, stocks: -0.0698, bonds: 0.0129, cash: 0.0526, gold: 0.2264 },
  { year: 1978, stocks: 0.0651, bonds: -0.0078, cash: 0.0718, gold: 0.3701 },
  { year: 1979, stocks: 0.1852, bonds: 0.0067, cash: 0.1005, gold: 1.2655 },
  { year: 1980, stocks: 0.3174, bonds: -0.0299, cash: 0.1139, gold: 0.1519 },
  { year: 1981, stocks: -0.047, bonds: 0.082, cash: 0.1404, gold: -0.326 },
  { year: 1982, stocks: 0.2042, bonds: 0.3281, cash: 0.1109, gold: 0.1562 },
  { year: 1983, stocks: 0.2234, bonds: 0.032, cash: 0.0895, gold: -0.168 },
  { year: 1984, stocks: 0.0615, bonds: 0.1373, cash: 0.0992, gold: -0.1938 },
  { year: 1985, stocks: 0.3124, bonds: 0.2571, cash: 0.0772, gold: 0.06 },
  { year: 1986, stocks: 0.1849, bonds: 0.2428, cash: 0.0615, gold: 0.1896 },
  { year: 1987, stocks: 0.0581, bonds: -0.0496, cash: 0.0596, gold: 0.2453 },
  { year: 1988, stocks: 0.1654, bonds: 0.0822, cash: 0.0689, gold: -0.1526 },
  { year: 1989, stocks: 0.3148, bonds: 0.1769, cash: 0.0839, gold: -0.0284 },
  { year: 1990, stocks: -0.0306, bonds: 0.0624, cash: 0.0775, gold: -0.0311 },
  { year: 1991, stocks: 0.3023, bonds: 0.15, cash: 0.0554, gold: -0.0856 },
  { year: 1992, stocks: 0.0749, bonds: 0.0936, cash: 0.0351, gold: -0.0573 },
  { year: 1993, stocks: 0.0997, bonds: 0.1421, cash: 0.0307, gold: 0.1768 },
  { year: 1994, stocks: 0.0133, bonds: -0.0804, cash: 0.0437, gold: -0.0217 },
  { year: 1995, stocks: 0.372, bonds: 0.2348, cash: 0.0566, gold: 0.0098 },
  { year: 1996, stocks: 0.2268, bonds: 0.0143, cash: 0.0515, gold: -0.0459 },
  { year: 1997, stocks: 0.331, bonds: 0.0994, cash: 0.052, gold: -0.2141 },
  { year: 1998, stocks: 0.2834, bonds: 0.1492, cash: 0.0491, gold: -0.0083 },
  { year: 1999, stocks: 0.2089, bonds: -0.0825, cash: 0.0478, gold: 0.0085 },
  { year: 2000, stocks: -0.0903, bonds: 0.1666, cash: 0.06, gold: -0.0544 },
  { year: 2001, stocks: -0.1185, bonds: 0.0557, cash: 0.0348, gold: 0.0075 },
  { year: 2002, stocks: -0.2197, bonds: 0.1512, cash: 0.0164, gold: 0.2557 },
  { year: 2003, stocks: 0.2836, bonds: 0.0038, cash: 0.0103, gold: 0.1989 },
  { year: 2004, stocks: 0.1074, bonds: 0.0449, cash: 0.014, gold: 0.0465 },
  { year: 2005, stocks: 0.0483, bonds: 0.0287, cash: 0.0322, gold: 0.1777 },
  { year: 2006, stocks: 0.1561, bonds: 0.0196, cash: 0.0485, gold: 0.232 },
  { year: 2007, stocks: 0.0548, bonds: 0.1021, cash: 0.0448, gold: 0.3192 },
  { year: 2008, stocks: -0.3655, bonds: 0.201, cash: 0.014, gold: 0.0432 },
  { year: 2009, stocks: 0.2594, bonds: -0.1112, cash: 0.0015, gold: 0.2504 },
  { year: 2010, stocks: 0.1482, bonds: 0.0846, cash: 0.0014, gold: 0.2924 },
  { year: 2011, stocks: 0.021, bonds: 0.1604, cash: 0.0005, gold: 0.1202 },
  { year: 2012, stocks: 0.1589, bonds: 0.0297, cash: 0.0009, gold: 0.0568 },
  { year: 2013, stocks: 0.3215, bonds: -0.091, cash: 0.0006, gold: -0.2761 },
  { year: 2014, stocks: 0.1352, bonds: 0.1075, cash: 0.0003, gold: 0.0012 },
  { year: 2015, stocks: 0.0138, bonds: 0.0128, cash: 0.0005, gold: -0.1211 },
  { year: 2016, stocks: 0.1177, bonds: 0.0069, cash: 0.0032, gold: 0.081 },
  { year: 2017, stocks: 0.2161, bonds: 0.028, cash: 0.0095, gold: 0.1266 },
  { year: 2018, stocks: -0.0423, bonds: -0.0002, cash: 0.0197, gold: -0.0093 },
  { year: 2019, stocks: 0.3121, bonds: 0.0964, cash: 0.0211, gold: 0.1908 },
  { year: 2020, stocks: 0.1802, bonds: 0.1133, cash: 0.0036, gold: 0.2417 },
  { year: 2021, stocks: 0.2847, bonds: -0.0442, cash: 0.0004, gold: -0.0375 },
  { year: 2022, stocks: -0.1804, bonds: -0.1783, cash: 0.0209, gold: 0.0055 },
  { year: 2023, stocks: 0.2606, bonds: 0.0388, cash: 0.0528, gold: 0.1326 },
  { year: 2024, stocks: 0.2488, bonds: -0.0164, cash: 0.0518, gold: 0.2596 },
];

export const FIRST_YEAR = HISTORICAL_RETURNS[0].year;
export const LAST_YEAR = HISTORICAL_RETURNS.at(-1)!.year;

import type { SeriesPoint } from "./model.ts";
import { normalizeWeights } from "./model.ts";

/** Portfolio return for a single historical year, given weights ordered as
 * HISTORICAL_KEYS. */
export function historicalYearReturn(
  row: HistoricalYear,
  weights: number[],
): number {
  const w = normalizeWeights(weights);
  return HISTORICAL_KEYS.reduce((s, key, i) => s + w[i] * row[key], 0);
}

export interface ReplayInput {
  weights: number[];
  startYear: number;
  principal: number;
  annualContribution: number;
  /** How many years to replay. Clamped to the data available from startYear. */
  years: number;
}

/**
 * Deterministically replay a mix through the real historical series, starting
 * at `startYear`. One point per year plus year 0. No randomness — pure playback.
 */
export function replayHistory(input: ReplayInput): SeriesPoint[] {
  const { weights, startYear, principal, annualContribution, years } = input;
  const startIdx = HISTORICAL_RETURNS.findIndex((r) => r.year === startYear);
  if (startIdx < 0) return [{ year: 0, balance: principal }];
  const available = HISTORICAL_RETURNS.length - startIdx;
  const span = Math.min(years, available);

  const points: SeriesPoint[] = [{ year: 0, balance: principal }];
  let balance = principal;
  for (let k = 0; k < span; k++) {
    const r = historicalYearReturn(HISTORICAL_RETURNS[startIdx + k], weights);
    balance = balance * (1 + r) + annualContribution;
    points.push({ year: k + 1, balance });
  }
  return points;
}

/** Valid start years that still leave at least `years` of data to replay. */
export function availableStartYears(years: number): number[] {
  return HISTORICAL_RETURNS.filter(
    (_, i) => HISTORICAL_RETURNS.length - i >= Math.min(years, 1),
  ).map((r) => r.year);
}
