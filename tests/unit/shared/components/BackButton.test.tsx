import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BackButton } from '@/shared/components/BackButton'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() })
}))

describe('BackButton', () => {
  it('renders with correct text', () => {
    render(<BackButton />)
    expect(screen.getByRole('button', { name: /volver/i })).toBeInTheDocument()
  })

  it('calls router.back on click', () => {
    const mockBack = vi.fn()
    vi.mock('next/navigation', () => ({
      useRouter: () => ({ back: mockBack, push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() })
    }))

    render(<BackButton />)
    screen.getByRole('button').click()

    expect(mockBack).toHaveBeenCalledTimes(1)
  })

  it('has correct type attribute', () => {
    render(<BackButton />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})