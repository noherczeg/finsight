import { useMemo, useState } from "react";
import {
  ASSETS,
  RISK_FREE,
  minCorrelation,
  netReturn,
  normalizeWeights,
  portfolioReturn,
  portfolioVol,
  projectMean,
  realSeries,
  sharpe,
  weightedAvgVol,
} from "./model.ts";
import { simulateCone } from "./random.ts";
import { HISTORICAL_KEYS, LAST_YEAR, replayHistory } from "./returns.ts";
import {
  LOCALES,
  formatCurrency,
  formatPercent,
  type Locale,
} from "./format.ts";
import { Chart, type ChartLine } from "./Chart.tsx";

const NOMINAL = "#34d399";
const GROSS = "#f59e0b";
const MUTED = "#94a3b8";
const MC_SEED = 20260824;
const MC_PATHS = 600;

const LENSES = [
  { id: "personalities", label: "Personalities" },
  { id: "diversify", label: "Diversify" },
  { id: "sharpe", label: "Sharpe" },
  { id: "fees", label: "Fees & Inflation" },
  { id: "cone", label: "Monte Carlo" },
  { id: "history", label: "Time Machine" },
  { id: "behavior", label: "Behavior" },
] as const;
type LensId = (typeof LENSES)[number]["id"];

const CRASH_STARTS = [
  { year: 1973, label: "1973 — stagflation" },
  { year: 2000, label: "2000 — dot-com bust" },
  { year: 2007, label: "2007 — global financial crisis" },
  { year: 2015, label: "2015 — recent decade" },
] as const;

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        accent ? "border-mint/30 bg-mint/10" : "border-white/10"
      }`}
    >
      <div className="text-sm text-slate-400">{label}</div>
      <div
        className={`font-mono text-xl ${accent ? "text-mint-bright" : "text-slate-200"}`}
      >
        {value}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono text-mint-bright">{display}</span>
      </span>
      <input
        type="range"
        className="mt-2 w-full accent-mint"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </label>
  );
}

/** A horizontal magnitude bar for comparing figures. */
function Bar({
  value,
  max,
  color,
  title,
}: {
  value: number;
  max: number;
  color: string;
  title: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-2 w-full rounded-full bg-white/10" title={title}>
      <div
        className="h-2 rounded-full"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function PortfolioSandbox() {
  const [weights, setWeights] = useState<number[]>([60, 30, 10, 0]);
  const [rho, setRho] = useState(0.2);
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(300);
  const [years, setYears] = useState(30);
  const [fee, setFee] = useState(0.005);
  const [inflation, setInflation] = useState(2.5);
  const [locale, setLocale] = useState<Locale>(LOCALES[0]);
  const [lens, setLens] = useState<LensId>("personalities");

  const rhoMin = minCorrelation(ASSETS.length);
  const annualContribution = monthly * 12;
  const w = normalizeWeights(weights);

  const muGross = portfolioReturn(ASSETS, weights);
  const muNet = netReturn(ASSETS, weights) - fee;
  const vol = portfolioVol(ASSETS, weights, rho);
  const avgVol = weightedAvgVol(ASSETS, weights);
  const sharpeRatio = sharpe(muNet, vol, RISK_FREE);

  function setWeight(i: number, value: number) {
    setWeights((prev) => prev.map((x, k) => (k === i ? value : x)));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
      <section aria-label="Build your mix">
        <Card>
          <div className="grid gap-5">
            <div>
              <span className="text-sm font-medium text-slate-200">
                Allocation mix
              </span>
              <p className="mt-1 text-xs text-slate-500">
                Weights are normalized to 100%. Current split:{" "}
                {ASSETS.map(
                  (a, i) => `${a.label} ${Math.round(w[i] * 100)}%`,
                ).join(" · ")}
              </p>
            </div>
            {ASSETS.map((a, i) => (
              <Slider
                key={a.id}
                label={a.label}
                value={weights[i]}
                min={0}
                max={100}
                step={5}
                onChange={(v) => setWeight(i, v)}
                display={`${Math.round(w[i] * 100)}%`}
              />
            ))}
            <Slider
              label="Correlation"
              value={rho}
              min={rhoMin}
              max={1}
              step={0.05}
              onChange={setRho}
              display={rho.toFixed(2)}
            />
            <Slider
              label="Starting amount"
              value={principal}
              min={0}
              max={100000}
              step={1000}
              onChange={setPrincipal}
              display={formatCurrency(principal, locale)}
            />
            <Slider
              label="Monthly contribution"
              value={monthly}
              min={0}
              max={2000}
              step={25}
              onChange={setMonthly}
              display={formatCurrency(monthly, locale)}
            />
            <Slider
              label="Years"
              value={years}
              min={1}
              max={40}
              step={1}
              onChange={setYears}
              display={`${years} yr`}
            />
            <Slider
              label="Fund fee (expense ratio)"
              value={fee}
              min={0}
              max={0.02}
              step={0.0005}
              onChange={setFee}
              display={formatPercent(fee, 2)}
            />
            <Slider
              label="Inflation"
              value={inflation}
              min={0}
              max={8}
              step={0.5}
              onChange={setInflation}
              display={`${inflation.toFixed(1)}%`}
            />
            <label className="block">
              <span className="text-sm text-slate-300">Currency</span>
              <select
                className="mt-2 w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm"
                value={locale.id}
                onChange={(e) =>
                  setLocale(
                    LOCALES.find((l) => l.id === e.target.value) ?? LOCALES[0],
                  )
                }
              >
                {LOCALES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <Stat
                label="Expected return"
                value={formatPercent(muNet)}
                accent
              />
              <Stat label="Volatility (risk)" value={formatPercent(vol)} />
            </div>
          </div>
        </Card>
      </section>

      <section aria-label="Lens">
        <div
          className="mb-4 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Lenses"
        >
          {LENSES.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={lens === l.id}
              onClick={() => setLens(l.id)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                lens === l.id
                  ? "border-mint/50 bg-mint/15 text-mint-bright"
                  : "border-white/10 text-slate-400 hover:border-white/30"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <Card>
          {lens === "personalities" && <PersonalitiesLens />}
          {lens === "diversify" && (
            <DiversifyLens vol={vol} avgVol={avgVol} rho={rho} />
          )}
          {lens === "sharpe" && (
            <SharpeLens sharpeRatio={sharpeRatio} muNet={muNet} vol={vol} />
          )}
          {lens === "fees" && (
            <FeesLens
              principal={principal}
              annualContribution={annualContribution}
              muGross={muGross}
              muNet={muNet}
              years={years}
              inflation={inflation / 100}
              locale={locale}
              feeCostReturn={muGross - muNet}
            />
          )}
          {lens === "cone" && (
            <ConeLens
              principal={principal}
              annualContribution={annualContribution}
              muNet={muNet}
              vol={vol}
              years={years}
              locale={locale}
            />
          )}
          {lens === "history" && (
            <HistoryLens
              weights={weights}
              principal={principal}
              annualContribution={annualContribution}
              years={years}
              locale={locale}
            />
          )}
          {lens === "behavior" && (
            <BehaviorLens
              weights={weights}
              principal={principal}
              muNet={muNet}
              years={years}
              locale={locale}
            />
          )}
        </Card>
      </section>
    </div>
  );
}

function PersonalitiesLens() {
  const [revealed, setRevealed] = useState(false);
  const maxMu = Math.max(...ASSETS.map((a) => a.mu));
  const maxSigma = Math.max(...ASSETS.map((a) => a.sigma));
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">
          Asset personalities
        </h2>
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          className="rounded-lg border border-mint/50 bg-mint/15 px-3 py-1.5 text-sm text-mint-bright"
        >
          {revealed ? "Hide names" : "Reveal names"}
        </button>
      </div>
      <p className="text-sm text-slate-400">
        Each card is one asset class. Higher bars mean higher expected return
        (green) and higher volatility (grey). Guess which is which from the
        shape — then reveal.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {ASSETS.map((a, i) => (
          <div key={a.id} className="rounded-lg border border-white/10 p-4">
            <div className="mb-3 font-semibold text-slate-200">
              {revealed ? a.label : `Mystery ${String.fromCharCode(65 + i)}`}
            </div>
            <div className="grid gap-2">
              <span className="text-xs text-slate-400">
                Return {formatPercent(a.mu)}
              </span>
              <Bar
                value={a.mu}
                max={maxMu}
                color={NOMINAL}
                title="expected return"
              />
              <span className="text-xs text-slate-400">
                Volatility {formatPercent(a.sigma)}
              </span>
              <Bar
                value={a.sigma}
                max={maxSigma}
                color={MUTED}
                title="volatility"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiversifyLens({
  vol,
  avgVol,
  rho,
}: {
  vol: number;
  avgVol: number;
  rho: number;
}) {
  const benefit = Math.max(0, avgVol - vol);
  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold text-slate-100">
        Diversification — the free lunch
      </h2>
      <p className="text-sm text-slate-400">
        The "sum of the parts" is what your risk would be if the assets always
        moved together. Lower the correlation on the left and watch the combined
        risk fall below it — that gap is diversification.
      </p>
      <div className="grid gap-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-300">
              Sum of the parts (no benefit)
            </span>
            <span className="font-mono text-slate-200">
              {formatPercent(avgVol)}
            </span>
          </div>
          <Bar
            value={avgVol}
            max={avgVol}
            color={MUTED}
            title="weighted-average volatility"
          />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-300">Your combined risk</span>
            <span className="font-mono text-mint-bright">
              {formatPercent(vol)}
            </span>
          </div>
          <Bar
            value={vol}
            max={avgVol}
            color={NOMINAL}
            title="portfolio volatility"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Correlation" value={rho.toFixed(2)} />
        <Stat label="Risk reduced by" value={formatPercent(benefit)} accent />
      </div>
    </div>
  );
}

function SharpeLens({
  sharpeRatio,
  muNet,
  vol,
}: {
  sharpeRatio: number | null;
  muNet: number;
  vol: number;
}) {
  const verdict =
    sharpeRatio === null
      ? "No risk, no ratio."
      : sharpeRatio >= 1
        ? "Strong — lots of reward per unit of risk."
        : sharpeRatio >= 0.5
          ? "Reasonable risk-adjusted reward."
          : "Thin reward for the risk taken.";
  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold text-slate-100">
        Sharpe — reward per unit of risk
      </h2>
      <p className="text-sm text-slate-400">
        Two portfolios can earn the same return with very different comfort.
        Sharpe scores each dollar of return by how much fear (volatility) it
        cost, above the {formatPercent(RISK_FREE)} risk-free rate.
      </p>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Expected return" value={formatPercent(muNet)} />
        <Stat label="Volatility" value={formatPercent(vol)} />
        <Stat
          label="Sharpe ratio"
          value={sharpeRatio === null ? "—" : sharpeRatio.toFixed(2)}
          accent
        />
      </div>
      <p className="text-sm text-slate-300">{verdict}</p>
    </div>
  );
}

function FeesLens({
  principal,
  annualContribution,
  muGross,
  muNet,
  years,
  inflation,
  locale,
  feeCostReturn,
}: {
  principal: number;
  annualContribution: number;
  muGross: number;
  muNet: number;
  years: number;
  inflation: number;
  locale: Locale;
  feeCostReturn: number;
}) {
  const netPath = projectMean(principal, annualContribution, muNet, years);
  const grossPath = projectMean(principal, annualContribution, muGross, years);
  const realPath = realSeries(netPath, inflation);
  const finalNet = netPath.at(-1)?.balance ?? 0;
  const finalGross = grossPath.at(-1)?.balance ?? 0;
  const finalReal = realPath.at(-1)?.balance ?? 0;
  const lines: ChartLine[] = [
    { points: grossPath, color: GROSS, label: "Before fees", dashed: true },
    { points: netPath, color: NOMINAL, label: "Net (after fees)", fill: true },
    {
      points: realPath,
      color: MUTED,
      label: `Real (${(inflation * 100).toFixed(1)}% inflation)`,
      dashed: true,
    },
  ];
  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold text-slate-100">
        Fees & inflation — the silent skim
      </h2>
      <Chart
        lines={lines}
        locale={locale}
        summary={`After fees the mix reaches about ${formatCurrency(finalNet, locale)} in ${years} years; ${formatCurrency(finalReal, locale)} in today's money.`}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="After fees"
          value={formatCurrency(finalNet, locale)}
          accent
        />
        <Stat
          label="Worth today (real)"
          value={formatCurrency(finalReal, locale)}
        />
        <Stat
          label="Lost to fees"
          value={formatCurrency(finalGross - finalNet, locale)}
        />
      </div>
      <p className="text-sm text-slate-400">
        A {formatPercent(feeCostReturn, 2)} yearly fee looks tiny, but
        compounded over {years} years it quietly skims{" "}
        {formatCurrency(finalGross - finalNet, locale)}.
      </p>
    </div>
  );
}

function ConeLens({
  principal,
  annualContribution,
  muNet,
  vol,
  years,
  locale,
}: {
  principal: number;
  annualContribution: number;
  muNet: number;
  vol: number;
  years: number;
  locale: Locale;
}) {
  const [guess, setGuess] = useState(100000);
  const [revealed, setRevealed] = useState(false);

  const bands = useMemo(
    () =>
      simulateCone({
        principal,
        annualContribution,
        meanReturn: muNet,
        vol,
        years,
        paths: MC_PATHS,
        seed: MC_SEED,
      }),
    [principal, annualContribution, muNet, vol, years],
  );
  const final = bands.at(-1)!;

  if (!revealed) {
    return (
      <div className="grid gap-4">
        <h2 className="text-lg font-semibold text-slate-100">
          Monte Carlo — a cone of futures
        </h2>
        <p className="rounded-xl border border-dashed border-mint/40 bg-mint/5 px-4 py-6 text-sm text-slate-300">
          Before you see the outcomes, commit a guess: where do you think the{" "}
          <strong>median</strong> future balance lands after {years} years?
          There's no single answer — that's the point.
        </p>
        <Slider
          label="Your guess (median balance)"
          value={guess}
          min={principal}
          max={principal * 20 + annualContribution * years * 4 + 1}
          step={1000}
          onChange={setGuess}
          display={formatCurrency(guess, locale)}
        />
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="justify-self-start rounded-lg border border-mint/50 bg-mint/15 px-4 py-2 text-sm text-mint-bright"
        >
          Reveal the cone →
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold text-slate-100">
        Monte Carlo — a cone of futures
      </h2>
      <Chart
        cone={bands}
        locale={locale}
        summary={`Across ${MC_PATHS} simulated futures the median lands near ${formatCurrency(final.p50, locale)}, ranging from ${formatCurrency(final.p10, locale)} (p10) to ${formatCurrency(final.p90, locale)} (p90).`}
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Your guess" value={formatCurrency(guess, locale)} />
        <Stat label="Unlucky (p10)" value={formatCurrency(final.p10, locale)} />
        <Stat
          label="Median (p50)"
          value={formatCurrency(final.p50, locale)}
          accent
        />
        <Stat label="Lucky (p90)" value={formatCurrency(final.p90, locale)} />
      </div>
      <p className="text-sm text-slate-400">
        Same mix, same seed, same cone every time — reproducible randomness.
        Your guess was {guess >= final.p50 ? "above" : "below"} the median by{" "}
        {formatCurrency(Math.abs(guess - final.p50), locale)}.
      </p>
    </div>
  );
}

function HistoryLens({
  weights,
  principal,
  annualContribution,
  years,
  locale,
}: {
  weights: number[];
  principal: number;
  annualContribution: number;
  years: number;
  locale: Locale;
}) {
  const [startYear, setStartYear] = useState(2007);
  const path = replayHistory({
    weights,
    startYear,
    principal,
    annualContribution,
    years,
  });
  const final = path.at(-1)?.balance ?? principal;
  const endYear = startYear + (path.length - 1);
  const lines: ChartLine[] = [
    {
      points: path,
      color: NOMINAL,
      label: `Your mix from ${startYear}`,
      fill: true,
    },
  ];
  const mixLabel = HISTORICAL_KEYS.map(
    (k, i) => `${Math.round(normalizeWeights(weights)[i] * 100)}% ${k}`,
  ).join(" · ");
  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold text-slate-100">
        Time machine — your mix through history
      </h2>
      <div className="flex flex-wrap gap-2">
        {CRASH_STARTS.map((c) => (
          <button
            key={c.year}
            type="button"
            onClick={() => setStartYear(c.year)}
            aria-pressed={startYear === c.year}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              startYear === c.year
                ? "border-mint/50 bg-mint/15 text-mint-bright"
                : "border-white/10 text-slate-400 hover:border-white/30"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <Chart
        lines={lines}
        locale={locale}
        summary={`${mixLabel}, replayed from ${startYear} to ${endYear}, ends near ${formatCurrency(final, locale)}.`}
      />
      <div className="grid grid-cols-2 gap-3">
        <Stat label={`Replayed ${startYear}–${endYear}`} value={mixLabel} />
        <Stat
          label="Ending balance"
          value={formatCurrency(final, locale)}
          accent
        />
      </div>
      <p className="text-xs text-slate-500">
        Real annual returns (Damodaran/NYU, 1971–{LAST_YEAR}). History is one
        path, not a forecast.
      </p>
    </div>
  );
}

function BehaviorLens({
  weights,
  principal,
  muNet,
  years,
  locale,
}: {
  weights: number[];
  principal: number;
  muNet: number;
  years: number;
  locale: Locale;
}) {
  const [sold, setSold] = useState<boolean | null>(null);

  // DCA vs lump: same total money deployed two ways over the mean path.
  const lumpPath = projectMean(principal, 0, muNet, years);
  const dcaPath = projectMean(0, principal / years, muNet, years);
  const lumpFinal = lumpPath.at(-1)?.balance ?? 0;
  const dcaFinal = dcaPath.at(-1)?.balance ?? 0;

  // Panic drill: replay the mix through the 2007 GFC.
  const holdPath = replayHistory({
    weights,
    startYear: 2007,
    principal,
    annualContribution: 0,
    years: Math.max(6, years),
  });
  const troughIdx = holdPath.reduce(
    (lo, p, i, arr) => (p.balance < arr[lo].balance ? i : lo),
    0,
  );
  const soldValue = holdPath[troughIdx].balance; // sell at the bottom, sit in cash
  const holdFinal = holdPath.at(-1)?.balance ?? principal;

  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <h2 className="text-lg font-semibold text-slate-100">
          DCA vs lump sum
        </h2>
        <p className="text-sm text-slate-400">
          The same {formatCurrency(principal, locale)} deployed two ways over{" "}
          {years} years at your mix's expected return: all at once, or spread
          evenly.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Stat
            label="Lump sum (all at once)"
            value={formatCurrency(lumpFinal, locale)}
            accent
          />
          <Stat
            label="Dollar-cost averaged"
            value={formatCurrency(dcaFinal, locale)}
          />
        </div>
        <p className="text-sm text-slate-400">
          Lump sum ends {formatCurrency(Math.abs(lumpFinal - dcaFinal), locale)}{" "}
          {lumpFinal >= dcaFinal ? "ahead" : "behind"} — more time in the market
          usually wins when returns are positive, but it means riding every dip.
        </p>
      </div>

      <div className="grid gap-3 border-t border-white/10 pt-6">
        <h2 className="text-lg font-semibold text-slate-100">
          Panic drill — the 2008 crash
        </h2>
        <p className="text-sm text-slate-400">
          Your mix, invested at the start of 2007. A brutal downturn hits. When
          your balance bottoms out, what do you do?
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSold(false)}
            aria-pressed={sold === false}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              sold === false
                ? "border-mint/50 bg-mint/15 text-mint-bright"
                : "border-white/10 text-slate-400 hover:border-white/30"
            }`}
          >
            Hold on
          </button>
          <button
            type="button"
            onClick={() => setSold(true)}
            aria-pressed={sold === true}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              sold === true
                ? "border-loss/60 bg-loss/15 text-loss"
                : "border-white/10 text-slate-400 hover:border-white/30"
            }`}
          >
            Sell to cash
          </button>
        </div>
        {sold !== null && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Stat
                label="If you held on"
                value={formatCurrency(holdFinal, locale)}
                accent
              />
              <Stat
                label="If you sold at the bottom"
                value={formatCurrency(soldValue, locale)}
              />
            </div>
            <p className="text-sm text-slate-400">
              {sold
                ? `Selling at the trough locked in the loss — staying invested through the recovery was worth ${formatCurrency(holdFinal - soldValue, locale)} more.`
                : `Holding through the crash let the recovery do its work — ${formatCurrency(holdFinal - soldValue, locale)} more than selling at the bottom.`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
