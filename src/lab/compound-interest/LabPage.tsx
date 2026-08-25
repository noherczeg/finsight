import { CompoundInterestLab } from "./CompoundInterestLab.tsx";

/** Full-page shell for the Compound Interest Lab: heading, the lab, disclaimer. */
export function CompoundInterestLabPage() {
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
          Compound Interest{" "}
          <span className="bg-gradient-to-r from-mint-bright via-mint to-emerald-400 bg-clip-text text-transparent">
            Lab
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-slate-400">
          Most people picture savings growing in a straight line. They don't —
          they curve. Move the sliders and watch the balance grow.
        </p>
      </header>

      <CompoundInterestLab />

      <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-500">
        Educational simulation using simplified, deterministic math —{" "}
        <strong>not financial advice</strong>. No products are recommended and
        no rate is assumed on your behalf. Real returns vary and can be
        negative.
      </footer>
    </main>
  );
}
