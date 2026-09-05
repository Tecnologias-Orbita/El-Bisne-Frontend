import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Container } from '@/shared/components/Container'

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Hello World</Container>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies default classes', () => {
    const { container } = render(<Container>Content</Container>)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('mx-auto')
    expect(div).toHaveClass('w-full')
    expect(div).toHaveClass('max-w-6xl')
    expect(div).toHaveClass('px-6')
  })

  it('applies custom className', () => {
    const { container } = render(<Container className="custom-class">Content</Container>)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('custom-class')
  })

  it('renders nested components', () => {
    render(
      <Container>
        <div data-testid="nested">Nested</div>
      </Container>
    )
    expect(screen.getByTestId('nested')).toBeInTheDocument()
  })
})