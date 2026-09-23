import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App, { getLatestCompletedQuarter, getQuarterOptions } from './App'

describe('dashboard theme', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: false }),
    )
  })

  it('prefers a stored theme and persists changes from the header control', async () => {
    localStorage.setItem('theme', 'dark')
    const user = userEvent.setup()

    render(<App />)

    expect(document.documentElement).toHaveClass('dark')

    await user.click(
      screen.getByRole('button', { name: 'Switch to light theme' }),
    )

    expect(document.documentElement).not.toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('follows the operating-system preference without storing an override', () => {
    vi.mocked(matchMedia).mockReturnValue({ matches: true } as MediaQueryList)

    render(<App />)

    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBeNull()
  })
})

describe('analysis controls', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: false }),
    )
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )
  })

  it('uses IBM and the latest completed quarter by default', () => {
    const referenceDate = new Date('2026-09-22T12:00:00Z')

    expect(getLatestCompletedQuarter(referenceDate)).toBe('2026Q2')
    expect(getQuarterOptions(referenceDate)[0]).toBe('2026Q2')
    expect(getQuarterOptions(referenceDate)).toHaveLength(12)

    render(<App />)

    expect(screen.getByRole('combobox', { name: 'Symbol' })).toHaveValue('IBM')
    expect(screen.getByRole('combobox', { name: 'Quarter' })).toHaveValue('2026Q2')
  })

  it('shows the API status states for online and offline checks', async () => {
    render(<App />)
    expect(await screen.findByText('API healthy')).toBeInTheDocument()

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    render(<App />)
    expect(await screen.findByText('API healthy')).toBeInTheDocument()

    vi.mocked(fetch).mockRejectedValueOnce(new Error('offline'))
    render(<App />)
    expect(await screen.findByText('API unavailable')).toBeInTheDocument()
  })
})
