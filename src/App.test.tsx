import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from './App'

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
