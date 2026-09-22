import { useState } from 'react'
import type { FormEvent } from 'react'

import './App.css'
import { getEarningsCallRisk, type EarningsCallRiskResponse } from './lib/earningsCallRisk'

const defaultForm = {
  symbol: 'IBM',
  quarter: '2024Q1',
}

function App() {
  const [form, setForm] = useState(defaultForm)
  const [result, setResult] = useState<EarningsCallRiskResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
    <main className="app-shell">
      <section className="panel">
        <h1>Earnings Call Risk</h1>
        <p className="subtitle">Local interface for the TypeSafe earnings-call API.</p>

        <form onSubmit={handleSubmit} className="risk-form">
          <label>
            Symbol
            <input
              value={form.symbol}
              onChange={(event) => setForm((current) => ({ ...current, symbol: event.target.value }))}
              placeholder="IBM"
            />
          </label>

          <label>
            Quarter
            <input
              value={form.quarter}
              onChange={(event) => setForm((current) => ({ ...current, quarter: event.target.value }))}
              placeholder="2024Q1"
            />
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Checking…' : 'Analyze'}
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        {result ? (
          <div className="result-card">
            <div className="result-header">
              <h2>
                {result.symbol} · {result.quarter}
              </h2>
              <span className={`band band-${result.risk_band}`}>{result.risk_band}</span>
            </div>

            <p className="overall">
              Overall risk: <strong>{result.overall_risk.toFixed(2)}</strong>
            </p>

            <div className="meta">
              <span>Source: {result.source}</span>
              <span>Model: {result.model}</span>
            </div>

            <ul className="factor-list">
              {result.factors.map((factor) => (
                <li key={factor.factor}>
                  <div className="factor-row">
                    <strong>{factor.factor}</strong>
                    <span>{factor.probability.toFixed(2)} / {factor.weight.toFixed(2)}</span>
                  </div>
                  <div className="factor-row subtle">
                    <span>{factor.flagged ? 'Flagged' : 'Not flagged'}</span>
                    <span>{factor.evidence ? factor.evidence.speaker : 'No evidence'}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default App
