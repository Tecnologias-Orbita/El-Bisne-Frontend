import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PublicAccessNav } from '@/shared/components/PublicAccessNav'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), prefetch: vi.fn() })
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

vi.mock('@/modules/auth/services/auth.service', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    listManagedBusinesses: vi.fn()
  }
}))

vi.mock('@/modules/auth/services/session.service', () => ({
  sessionService: { get: vi.fn() },
  SESSION_CHANGED_EVENT: 'el-bisne:session-changed'
}))

describe('PublicAccessNav', () => {
  it('returns null on admin pages', () => {
    vi.mock('next/navigation', () => ({
      usePathname: () => '/admin/dashboard',
      useRouter: () => ({ replace: vi.fn(), push: vi.fn(), prefetch: vi.fn() })
    }))

    const { container } = render(<PublicAccessNav />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null on login page', () => {
    vi.mock('next/navigation', () => ({
      usePathname: () => '/login',
      useRouter: () => ({ replace: vi.fn(), push: vi.fn(), prefetch: vi.fn() })
    }))

    const { container } = render(<PublicAccessNav />)
    expect(container.firstChild).toBeNull()
  })

  it('shows login/register links when no session', async () => {
    const { sessionService } = await import('@/modules/auth/services/session.service')
    vi.mocked(sessionService.get).mockReturnValue(null)

    render(<PublicAccessNav />)

    expect(screen.getByRole('link', { name: /publicar mi negocio/i })).toHaveAttribute('href', '/crear-negocio')
    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toHaveAttribute('href', '/login')
  })
})