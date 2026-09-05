import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SecondaryButton } from '@/shared/ui/buttons/SecondayButton'

vi.mock('@tecnologias-orbita/orbita-ui-react', () => ({
  Btn: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>{children}</button>
  )
}))

describe('SecondaryButton', () => {
  it('renders children', () => {
    render(<SecondaryButton>Click me</SecondaryButton>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies default green styling classes', () => {
    const { container } = render(<SecondaryButton>Button</SecondaryButton>)
    const button = container.firstChild as HTMLElement
    expect(button).toHaveClass('rounded-lg')
    expect(button).toHaveClass('border-green')
    expect(button).toHaveClass('bg-green/5')
    expect(button).toHaveClass('text-green')
    expect(button).toHaveClass('hover:bg-green/10')
  })

  it('merges custom className', () => {
    const { container } = render(<SecondaryButton className="custom-class">Button</SecondaryButton>)
    const button = container.firstChild as HTMLElement
    expect(button).toHaveClass('custom-class')
  })

  it('forwards props to underlying button', () => {
    const mockOnClick = vi.fn()
    render(<SecondaryButton onClick={mockOnClick} disabled>Button</SecondaryButton>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    button.click()
    expect(mockOnClick).not.toHaveBeenCalled()
  })
})