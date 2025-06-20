import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { DarkModeToggle } from './DarkModeToggle'

const setTheme = vi.fn()
let currentTheme = 'light'
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: currentTheme, setTheme }),
}))

describe('DarkModeToggle', () => {
  it('shows current theme and toggles to dark', async () => {
    currentTheme = 'light'
    const user = userEvent.setup()
    render(<DarkModeToggle />)
    expect(screen.getByText('Light')).toBeInTheDocument()
    await user.click(screen.getByRole('switch', { name: /toggle dark mode/i }))
    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it('shows dark theme and toggles to light', async () => {
    currentTheme = 'dark'
    const user = userEvent.setup()
    render(<DarkModeToggle />)
    expect(screen.getByText('Dark')).toBeInTheDocument()
    await user.click(screen.getByRole('switch', { name: /toggle dark mode/i }))
    expect(setTheme).toHaveBeenCalledWith('light')
  })
})
