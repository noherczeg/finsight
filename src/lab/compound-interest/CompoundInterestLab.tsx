import { useState } from "react";
import {
  projectBalance,
  realSeries,
  series,
  toReal,
  type CompoundInput,
} from "./math.ts";
import { LOCALES, formatCurrency, type Locale } from "./format.ts";
import { Curve, type CurveLine } from "./Curve.tsx";

const FREQUENCIES = [
  { value: 1, label: "Yearly" },
  { value: 4, label: "Quarterly" },
  { value: 12, label: "Monthly" },
] as const;

const MINT = "#34d399";
const MUTED = "#94a3b8";

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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
      {children}
    </div>
  );
}

function RatePrompt() {
  return (
    <p className="rounded-xl border border-dashed border-mint/40 bg-mint/5 px-4 py-6 text-center text-sm text-slate-300">
      Pick an interest rate to see the projection. There is no default — the
      rate you choose is up to you.
    </p>
  );
}

export function CompoundInterestLab() {
  const [locale, setLocale] = useState<Locale>(LOCALES[0]);
  const [principal, setPrincipal] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState<number | null>(null);
  const [years, setYears] = useState(30);
  const [freq, setFreq] = useState(12);
  const [inflation, setInflation] = useState(2.5);

  const rateChosen = rate !== null;
  const input: CompoundInput = {
    principal,
    monthlyContribution: monthly,
    annualRate: (rate ?? 0) / 100,
    years,
    compoundingPerYear: freq,
  };
  const projection = projectBalance(input);
  const points = series(input);
  const realPoints = realSeries(points, inflation / 100);
  const realProjection = toReal(projection, inflation / 100, years);
  const contributed = principal + monthly * 12 * years;
  const growth = projection - contributed;
  const lines: CurveLine[] = [
    { points, color: MINT, label: "Nominal balance", fill: true },
    {
      points: realPoints,
      color: MUTED,
      label: `Real (today's money, ${inflation.toFixed(1)}% inflation)`,
      dashed: true,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
      <section aria-label="Scenario controls">
        <Card>
          <div className="grid gap-5">
            <Slider
              label="Starting amount"
              value={principal}
              min={0}
              max={50000}
              step={500}
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
              label="Interest rate"
              value={rate ?? 5}
              min={0}
              max={15}
              step={0.5}
              onChange={setRate}
              display={rateChosen ? `${rate?.toFixed(1)}%` : "pick one →"}
            />
            <Slider
              label="Years"
              value={years}
              min={1}
              max={50}
              step={1}
              onChange={setYears}
              display={`${years} yr`}
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
            <div>
              <span className="text-sm text-slate-300">Compounding</span>
              <div className="mt-2 flex gap-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFreq(f.value)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                      freq === f.value
                        ? "border-mint/50 bg-mint/15 text-mint-bright"
                        : "border-white/10 text-slate-400 hover:border-white/30"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
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
          </div>
        </Card>
      </section>

      <section aria-label="Projection">
        <Card>
          {!rateChosen ? (
            <RatePrompt />
          ) : (
            <div className="grid gap-4">
              <Curve lines={lines} locale={locale} />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-mint/30 bg-mint/10 p-3">
                  <div className="text-sm text-slate-400">
                    Projected balance
                  </div>
                  <div className="font-mono text-xl text-mint-bright">
                    {formatCurrency(projection, locale)}
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 p-3">
                  <div className="text-sm text-slate-400">
                    Worth today (real)
                  </div>
                  <div className="font-mono text-xl text-slate-200">
                    {formatCurrency(realProjection, locale)}
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 p-3">
                  <div className="text-sm text-slate-400">You contribute</div>
                  <div className="font-mono text-xl text-slate-200">
                    {formatCurrency(contributed, locale)}
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 p-3">
                  <div className="text-sm text-slate-400">Growth adds</div>
                  <div className="font-mono text-xl text-slate-200">
                    {formatCurrency(growth, locale)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
