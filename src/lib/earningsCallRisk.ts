export type RiskBand = 'low' | 'medium' | 'high'

export type EvidenceExcerpt = {
  chunk_id: string
  speaker: string
  title: string | null
  content: string
}

export type HealthStatus = {
  status: string
}

export type RiskFactorResult = {
  factor: string
  probability: number
  weight: number
  flagged: boolean
  evidence: EvidenceExcerpt | null
}

export type EarningsCallRiskResponse = {
  symbol: string
  quarter: string
  source: string
  model: string
  overall_risk: number
  risk_band: RiskBand
  factors: RiskFactorResult[]
}

export type EarningsCallRiskRequest = {
  symbol: string
  quarter: string
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const response = await fetch('/api/healthz')

  if (!response.ok) {
    throw new Error('API health check failed')
  }

  return (await response.json()) as HealthStatus
}

export async function getEarningsCallRisk(
  payload: EarningsCallRiskRequest,
): Promise<EarningsCallRiskResponse> {
  const response = await fetch('/api/v1/earnings-call-risk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let detail = 'Unable to fetch earnings call risk.'

    try {
      const errorBody = (await response.json()) as { detail?: string }
      if (errorBody.detail) {
        detail = errorBody.detail
      }
    } catch {
      // ignore invalid JSON responses and keep the fallback message
    }

    throw new Error(detail)
  }

  return (await response.json()) as EarningsCallRiskResponse
}
