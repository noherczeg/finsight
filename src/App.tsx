import { useEffect, useState } from "react";
import { CompoundInterestLabPage } from "./lab/compound-interest/LabPage.tsx";
import { PortfolioSandboxPage } from "./lab/portfolio-sandbox/LabPage.tsx";

const LAB_HASH = "#lab/compound-interest";
const PORTFOLIO_HASH = "#lab/portfolio-sandbox";

const tickers = [
  { symbol: "AAPL", price: "231.42", change: "+1.24%", up: true },
  { symbol: "BTC", price: "67,908", change: "+3.10%", up: true },
  { symbol: "TSLA", price: "248.19", change: "-0.82%", up: false },
  { symbol: "S&P 500", price: "5,762", change: "+0.44%", up: true },
  { symbol: "EUR/USD", price: "1.0873", change: "-0.11%", up: false },
  { symbol: "GOLD", price: "2,634", change: "+0.67%", up: true },
] as const;

const scenarios = [
  {
    title: "Compound Interest Lab",
    blurb: "Watch small, steady contributions snowball across decades.",
    icon: "\u{1F4C8}",
    href: LAB_HASH,
  },
  {
    title: "Portfolio Sandbox",
    blurb: "Balance risk and reward across simulated asset classes.",
    icon: "\u{1F9EE}",
    href: PORTFOLIO_HASH,
  },
  {
    title: "Market Crash Drills",
    blurb: "Feel a downturn safely and learn how allocation cushions it.",
    icon: "\u{1F6DF}",
    href: undefined,
  },
] as const;

function TickerTape() {
  const row = [...tickers, ...tickers];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black/40 py-3">
      <div className="animate-ticker flex w-max gap-10 whitespace-nowrap font-mono text-sm">
        {row.map((t, i) => (
          <span key={`${t.symbol}-${i}`} className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{t.symbol}</span>
            <span className="text-slate-400">{t.price}</span>
            <span className={t.up ? "text-mint" : "text-loss"}>
              {t.up ? "\u25B2" : "\u25BC"} {t.change}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

function App() {
  const hash = useHash();
  if (hash === LAB_HASH) return <CompoundInterestLabPage />;
  if (hash === PORTFOLIO_HASH) return <PortfolioSandboxPage />;

  return (
    <main className="relative flex min-h-full flex-col overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-mint/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-mint/15 font-mono text-lg text-mint-bright">
            f
          </span>
          <span className="text-lg font-semibold tracking-tight">
            fin<span className="text-mint-bright">sight</span>
          </span>
        </div>
        <nav className="hidden gap-8 text-sm text-slate-400 sm:flex">
          <a className="transition hover:text-white" href="#scenarios">
            Scenarios
          </a>
          <a className="transition hover:text-white" href="#about">
            About
          </a>
        </nav>
      </header>

      <TickerTape />

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-mint-bright">
          Learn finance by playing
        </span>
        <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
          See the money{" "}
          <span className="bg-gradient-to-r from-mint-bright via-mint to-emerald-400 bg-clip-text text-transparent">
            move.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-400">
          finsight turns markets, compounding, and risk into hands-on browser
          simulations. No jargon, no spreadsheets to memorize — just realistic,
          simplified scenarios you can actually feel.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#scenarios"
            className="rounded-xl bg-mint px-7 py-3 font-semibold text-ink shadow-lg shadow-mint/20 transition hover:bg-mint-bright"
          >
            Start exploring
          </a>
          <a
            href="#about"
            className="rounded-xl border border-white/15 px-7 py-3 font-semibold text-slate-200 transition hover:border-white/40 hover:bg-white/5"
          >
            How it works
          </a>
        </div>
      </section>

      <section
        id="scenarios"
        className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 px-6 pb-24 sm:grid-cols-3"
      >
        {scenarios.map((s) => {
          const Tag = s.href ? "a" : "article";
          return (
            <Tag
              key={s.title}
              href={s.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-mint/40 hover:bg-white/[0.06]"
            >
              <div className="mb-4 text-3xl">{s.icon}</div>
              <h2 className="text-lg font-semibold text-slate-100">
                {s.title}
              </h2>
              <p className="mt-2 text-sm text-slate-400">{s.blurb}</p>
              <span className="mt-4 inline-block text-sm font-medium text-mint-bright opacity-0 transition group-hover:opacity-100">
                {s.href ? "Open lab →" : "Coming soon →"}
              </span>
            </Tag>
          );
        })}
      </section>

      <footer
        id="about"
        className="relative z-10 border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500"
      >
        Built for the curious. finsight is an educational sandbox — not
        financial advice.
      </footer>
    </main>
  );
}

export default App;
