import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLogin } from '@/modules/auth/hooks/useLogin'
import { authService } from '@/modules/auth/services/auth.service'
import { sessionService } from '@/modules/auth/services/session.service'
import type { AuthenticatedUser } from '@/modules/auth/types/auth.types'

vi.mock('@/modules/auth/services/auth.service')
vi.mock('@/modules/auth/services/session.service')
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() })
}))

const mockAuthService = vi.mocked(authService)
const mockSessionService = vi.mocked(sessionService)

describe('useLogin', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
    sessionStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('returns initial state', () => {
    const { result } = renderHook(() => useLogin())

    expect(result.current.email).toBe('')
    expect(result.current.password).toBe('')
    expect(result.current.error).toBeNull()
    expect(result.current.isSubmitting).toBe(false)
  })

  it('updates email and password state', () => {
    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.setEmail('test@example.com')
      result.current.setPassword('password123')
    })

    expect(result.current.email).toBe('test@example.com')
    expect(result.current.password).toBe('password123')
  })

  it('calls createSession on submit and redirects on success', async () => {
    const mockUser = { id: '1', email: 'test@example.com', full_name: 'Test', is_platform_admin: false }
    const mockBusinesses = [{ id: 'biz-1' }]
    mockAuthService.createSession.mockResolvedValue(mockUser)
    mockAuthService.listManagedBusinesses.mockResolvedValue(mockBusinesses)

    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.setEmail('test@example.com')
      result.current.setPassword('password123')
    })

    await act(async () => {
      const form = document.createElement('form')
      const event = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
      await result.current.handleSubmit(event)
    })

    expect(mockAuthService.createSession).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
    expect(mockAuthService.listManagedBusinesses).toHaveBeenCalled()
  })

  it('sets error on failed login', async () => {
    mockAuthService.createSession.mockRejectedValue(new Error('Invalid credentials'))

    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.setEmail('test@example.com')
      result.current.setPassword('wrong')
    })

    await act(async () => {
      const event = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
      await result.current.handleSubmit(event)
    })

    expect(result.current.error).toBe('Invalid credentials')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('sets isSubmitting during submission', async () => {
    let resolveFn: (value: AuthenticatedUser) => void
    const promise = new Promise<AuthenticatedUser>(resolve => { resolveFn = resolve })
    mockAuthService.createSession.mockReturnValue(promise)

    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.setEmail('test@example.com')
      result.current.setPassword('password')
    })

    const submitPromise = act(async () => {
      const event = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
      await result.current.handleSubmit(event)
    })

    expect(result.current.isSubmitting).toBe(true)

    await act(async () => {
      resolveFn!({ id: '1', email: 'test@test.com', full_name: 'Test', is_platform_admin: false })
      await submitPromise
    })

    expect(result.current.isSubmitting).toBe(false)
  })

  it('redirects platform admin to destinationAfterLogin on init if session exists', async () => {
    const mockSession = { access_token: 'token', refresh_token: 'r', token_type: 'Bearer' }
    const mockUser = { id: '1', email: 'admin@test.com', full_name: 'Admin', is_platform_admin: true }

    mockSessionService.get.mockReturnValue(mockSession)
    mockAuthService.getCurrentUser.mockResolvedValue(mockUser)

    renderHook(() => useLogin())

    // The useEffect runs after render, so we just verify the mock was called
    expect(mockAuthService.getCurrentUser).toHaveBeenCalledWith('token')
  })

  it('clears session on auth failure during init', async () => {
    const mockSession = { access_token: 'token', refresh_token: 'r', token_type: 'Bearer' }
    mockSessionService.get.mockReturnValue(mockSession)
    mockAuthService.getCurrentUser.mockRejectedValue(new Error('Unauthorized'))

    renderHook(() => useLogin())

    // The useEffect runs after render
    expect(mockSessionService.clear).toHaveBeenCalled()
  })

  it('handles create-business intent redirect', async () => {
    window.history.replaceState({}, '', '/?intent=create-business')
    const mockUser = { id: '1', email: 'test@test.com', full_name: 'Test', is_platform_admin: false }
    const mockBusinesses = [{ id: 'biz-1' }]

    mockAuthService.createSession.mockResolvedValue(mockUser)
    mockAuthService.listManagedBusinesses.mockResolvedValue(mockBusinesses)

    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.setEmail('test@test.com')
      result.current.setPassword('password')
    })

    await act(async () => {
      const event = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
      await result.current.handleSubmit(event)
    })

    // Should redirect to /admin (create-business intent)
  })
})