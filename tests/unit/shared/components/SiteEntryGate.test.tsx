import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SiteEntryGate } from '@/shared/components/SiteEntryGate'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}))

vi.mock('@/modules/auth/services/session.service', () => ({
  sessionService: { get: vi.fn() },
  ENTRY_SEEN_KEY: 'el-bisne:entry-seen',
  SESSION_CHANGED_EVENT: 'el-bisne:session-changed'
}))

describe('SiteEntryGate', () => {
  it('returns null when session exists', () => {
    const { sessionService } = require('@/modules/auth/services/session.service')
    vi.mocked(sessionService.get).mockReturnValue({ access_token: 'token', refresh_token: 'r', token_type: 'Bearer' })

    const { container } = render(<SiteEntryGate />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null on excluded pages (admin)', () => {
    vi.mock('next/navigation', () => ({
      usePathname: () => '/admin/dashboard',
      useSearchParams: () => new URLSearchParams()
    }))

    const { container } = render(<SiteEntryGate />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null on login page', () => {
    vi.mock('next/navigation', () => ({
      usePathname: () => '/login',
      useSearchParams: () => new URLSearchParams()
    }))

    const { container } = render(<SiteEntryGate />)
    expect(container.firstChild).toBeNull()
  })
})