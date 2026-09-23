import { afterEach, describe, expect, it, vi } from 'vitest'

import { getEarningsCallRisk, getHealthStatus } from './earningsCallRisk.ts'

describe('getEarningsCallRisk', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('posts to the local Vite proxy and returns the typed API response', async () => {
    const originalFetch = globalThis.fetch

    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(input).toBe('/api/v1/earnings-call-risk')
      expect(init?.method).toBe('POST')
      expect(
        init?.headers &&
          (init.headers as Record<string, string>)['Content-Type'],
      ).toBe('application/json')

      const body = JSON.parse(String(init?.body ?? '{}'))
      expect(body).toEqual({ symbol: 'IBM', quarter: '2024Q1' })

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
      expect(result.risk_band).toBe('high')
      expect(result.factors[0]?.factor).toBe('management_evasiveness')
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('gets the local API health status through the proxy', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    const result = await getHealthStatus()

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/healthz')
    expect(result).toEqual({ status: 'ok' })
  })
})
