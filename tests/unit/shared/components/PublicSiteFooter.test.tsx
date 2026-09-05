import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PublicSiteFooter } from '@/shared/components/PublicSiteFooter'

vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

describe('PublicSiteFooter', () => {
  it('renders footer content on public pages', () => {
    render(<PublicSiteFooter />)
    expect(screen.getByText('El Bisne')).toBeInTheDocument()
    expect(screen.getByText('Una vitrina digital para lo que Cuba crea.')).toBeInTheDocument()
    expect(screen.getByText('¿Tienes un negocio?')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /únase a nosotros/i })).toHaveAttribute('href', '/crear-negocio')
  })

  it('returns null on admin pages', () => {
    vi.mock('next/navigation', () => ({
      usePathname: () => '/admin'
    }))

    const { container } = render(<PublicSiteFooter />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null on login page', () => {
    vi.mock('next/navigation', () => ({
      usePathname: () => '/login'
    }))

    const { container } = render(<PublicSiteFooter />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null on crear-negocio page', () => {
    vi.mock('next/navigation', () => ({
      usePathname: () => '/crear-negocio'
    }))

    const { container } = render(<PublicSiteFooter />)
    expect(container.firstChild).toBeNull()
  })
})