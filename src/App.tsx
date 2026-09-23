import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { getEarningsCallRisk, type EarningsCallRiskResponse } from './lib/earningsCallRisk'

const defaultForm = {
  symbol: 'IBM',
  quarter: '2024Q1',
}

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [form, setForm] = useState(defaultForm)
  const [result, setResult] = useState<EarningsCallRiskResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  function toggleTheme() {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', nextTheme)
      return nextTheme
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await getEarningsCallRisk({
        symbol: form.symbol.trim(),
        quarter: form.quarter.trim(),
      })
      setResult(response)
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unknown error'
      setError(message)
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-[#0c111d] dark:text-white">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-[#101828]/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20">
              <ChartNoAxesCombined aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-none tracking-[0.02em] text-slate-950 dark:text-white">
                Signal Desk
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Investment research
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            onClick={toggleTheme}
            className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {theme === 'dark' ? (
              <Sun aria-hidden="true" className="size-4" />
            ) : (
              <Moon aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
              <Sparkles aria-hidden="true" className="size-4" />
              Local research workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
              Earnings call risk
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">
              Screen management commentary for demand, competition, guidance,
              and evasiveness signals.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <ShieldCheck aria-hidden="true" className="size-4 text-emerald-500" />
            Research aid
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.42fr)]">
          <section className="self-start rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-[#101828]">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                New analysis
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                Select an earnings call
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Symbol
                <input
                  value={form.symbol}
                  onChange={(event) => setForm((current) => ({ ...current, symbol: event.target.value }))}
                  placeholder="IBM"
                  className="h-11 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Quarter
                <input
                  value={form.quarter}
                  onChange={(event) => setForm((current) => ({ ...current, quarter: event.target.value }))}
                  placeholder="2024Q1"
                  className="h-11 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-wait disabled:opacity-65"
              >
                {isLoading ? 'Analyzing…' : 'Run analysis'}
                {!isLoading ? <ArrowUpRight aria-hidden="true" className="size-4" /> : null}
              </button>
            </form>

            {error ? (
              <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            ) : null}
          </section>

          <section className="min-h-96 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#101828]">
            {result ? (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      Latest assessment
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
                      {result.symbol} · {result.quarter}
                    </h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {result.risk_band} risk
                  </span>
                </div>

                <div className="grid gap-px bg-slate-200 sm:grid-cols-3 dark:bg-slate-800">
                  <div className="bg-white px-5 py-4 dark:bg-[#101828]">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Overall risk</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                      {result.overall_risk.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white px-5 py-4 dark:bg-[#101828]">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Source</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-950 dark:text-white">
                      {result.source}
                    </p>
                  </div>
                  <div className="bg-white px-5 py-4 dark:bg-[#101828]">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Model</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-950 dark:text-white">
                      {result.model}
                    </p>
                  </div>
                </div>

                <ul className="divide-y divide-slate-200 px-5 sm:px-6 dark:divide-slate-800">
                  {result.factors.map((factor) => (
                    <li key={factor.factor} className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        <strong className="text-sm text-slate-900 dark:text-white">{factor.factor}</strong>
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                          {factor.probability.toFixed(2)} / {factor.weight.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span>{factor.flagged ? 'Flagged' : 'Not flagged'}</span>
                        <span>{factor.evidence ? factor.evidence.speaker : 'No evidence'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="grid min-h-96 place-items-center px-6 py-12 text-center">
                <div className="max-w-sm">
                  <span className="mx-auto grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <ChartNoAxesCombined aria-hidden="true" className="size-6" />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                    Ready for an assessment
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Choose a company and reporting period to surface risk signals from its earnings call.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
