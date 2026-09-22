import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { getEarningsCallRisk } from './earningsCallRisk.ts'

describe('getEarningsCallRisk', () => {
  it('posts to the local Vite proxy and returns the typed API response', async () => {
    const originalFetch = globalThis.fetch

    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      assert.equal(input, '/api/v1/earnings-call-risk')
      assert.equal(init?.method, 'POST')
      assert.equal(init?.headers && (init.headers as Record<string, string>)['Content-Type'], 'application/json')

      const body = JSON.parse(String(init?.body ?? '{}'))
      assert.deepEqual(body, { symbol: 'IBM', quarter: '2024Q1' })

      return new Response(
        JSON.stringify({
          symbol: 'IBM',
          quarter: '2024Q1',
          source: 'alpha_vantage',
          model: 'typesafe-jev',
          overall_risk: 0.72,
          risk_band: 'high',
          factors: [
            {
              factor: 'management_evasiveness',
              probability: 0.8,
              weight: 0.25,
              flagged: true,
              evidence: null,
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }

    try {
      const result = await getEarningsCallRisk({ symbol: 'IBM', quarter: '2024Q1' })
      assert.equal(result.risk_band, 'high')
      assert.equal(result.factors[0]?.factor, 'management_evasiveness')
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
