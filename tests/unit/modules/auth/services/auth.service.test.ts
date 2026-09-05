import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '@/modules/auth/services/auth.service'
import { sessionService } from '@/modules/auth/services/session.service'
import { apiClient } from '@/lib/api/api-client'

vi.mock('@/lib/api/api-client')
vi.mock('@/modules/auth/services/session.service')

const mockApiClient = vi.mocked(apiClient)
const mockSessionService = vi.mocked(sessionService)

describe('authService', () => {
  const mockCredentials = { email: 'test@example.com', password: 'password123' }
  const mockTokens = {
    access_token: 'access-token-123',
    refresh_token: 'refresh-token-456',
    token_type: 'Bearer'
  }
  const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('login', () => {
    it('calls apiClient with correct params and returns tokens', async () => {
      mockApiClient.mockResolvedValue(mockTokens)

      const result = await authService.login(mockCredentials)

      expect(mockApiClient).toHaveBeenCalledWith('/auth/login', {
        method: 'POST',
        body: mockCredentials
      })
      expect(result).toEqual(mockTokens)
    })

    it('propagates apiClient errors', async () => {
      const error = new Error('Invalid credentials')
      mockApiClient.mockRejectedValue(error)

      await expect(authService.login(mockCredentials)).rejects.toThrow('Invalid credentials')
    })
  })

  describe('getCurrentUser', () => {
    it('calls apiClient with Authorization header', async () => {
      mockApiClient.mockResolvedValue(mockUser)

      const result = await authService.getCurrentUser('test-access-token')

      expect(mockApiClient).toHaveBeenCalledWith('/auth/me', {
        headers: { Authorization: 'Bearer test-access-token' }
      })
      expect(result).toEqual(mockUser)
    })
  })

  describe('createSession', () => {
    it('logs in, gets user, saves session, and returns user', async () => {
      mockApiClient
        .mockResolvedValueOnce(mockTokens)  // login
        .mockResolvedValueOnce(mockUser)    // getCurrentUser

      const result = await authService.createSession(mockCredentials)

      expect(mockApiClient).toHaveBeenCalledTimes(2)
      expect(mockSessionService.save).toHaveBeenCalledWith(mockTokens)
      expect(result).toEqual(mockUser)
    })

    it('does not save session if getCurrentUser fails', async () => {
      mockApiClient
        .mockResolvedValueOnce(mockTokens)
        .mockRejectedValueOnce(new Error('Failed to fetch user'))

      await expect(authService.createSession(mockCredentials)).rejects.toThrow('Failed to fetch user')
      expect(mockSessionService.save).not.toHaveBeenCalled()
    })
  })

  describe('listManagedBusinesses', () => {
    it('returns businesses when session exists', async () => {
      const mockBusinesses = [{ id: 'biz-1' }, { id: 'biz-2' }]
      const sessionTokens = { ...mockTokens, access_token: 'access-token-123' }
      mockSessionService.get.mockReturnValue(sessionTokens)
      mockApiClient.mockResolvedValue(mockBusinesses)

      const result = await authService.listManagedBusinesses()

      expect(mockApiClient).toHaveBeenCalledWith('/businesses', {
        headers: { Authorization: 'Bearer access-token-123' }
      })
      expect(result).toEqual(mockBusinesses)
    })

    it('throws when no session exists', async () => {
      mockSessionService.get.mockReturnValue(null)

      await expect(authService.listManagedBusinesses()).rejects.toThrow('Tu sesión ha expirado.')
      expect(mockApiClient).not.toHaveBeenCalled()
    })
  })
})