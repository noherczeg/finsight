import { PortfolioSandbox } from "./PortfolioSandbox.tsx";

/** Full-page shell for the Portfolio Sandbox: heading, the sandbox, disclaimer. */
export function PortfolioSandboxPage() {
  return (
    <main className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col px-6 py-10">
      <header className="mb-8">
        <a
          href="#"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to finsight
        </a>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Portfolio{" "}
          <span className="bg-gradient-to-r from-mint-bright via-mint to-emerald-400 bg-clip-text text-transparent">
            Sandbox
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-slate-400">
          One tab taught you that growth compounds. This one shows growth is
          uncertain. Build a mix on the left, then view it through each lens —
          feel how risk, fees, and history reshape a single certain line into a
          cone of possible futures.
        </p>
      </header>

      <PortfolioSandbox />

      <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-500">
        Educational simulation using simplified figures and a seeded random
        model — <strong>not financial advice</strong>. No products are
        recommended and no allocation is suggested on your behalf. Historical
        returns are real but past performance does not predict the future; real
        returns vary and can be negative.
      </footer>
    </main>
  );
}
