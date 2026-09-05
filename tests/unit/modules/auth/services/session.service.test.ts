import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sessionService, SESSION_CHANGED_EVENT } from '@/modules/auth/services/session.service'
import type { TokenPair } from '@/modules/auth/types/auth.types'

const SESSION_KEY = 'el-bisne.platform-session'

describe('sessionService', () => {
  const mockTokens: TokenPair = {
    access_token: 'access-token-123',
    refresh_token: 'refresh-token-456',
    token_type: 'Bearer'
  }

  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('save', () => {
    it('stores tokens in localStorage and dispatches event', () => {
      const dispatchEvent = vi.spyOn(window, 'dispatchEvent')

      sessionService.save(mockTokens)

      expect(localStorage.getItem(SESSION_KEY)).toBe(JSON.stringify(mockTokens))
      expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({
        type: SESSION_CHANGED_EVENT
      }))
    })
  })

  describe('get', () => {
    it('returns null when no session exists', () => {
      expect(sessionService.get()).toBeNull()
    })

    it('returns parsed tokens when valid session exists', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(mockTokens))

      expect(sessionService.get()).toEqual(mockTokens)
    })

    it('clears storage and returns null when JSON is invalid', () => {
      localStorage.setItem(SESSION_KEY, 'invalid-json')

      expect(sessionService.get()).toBeNull()
      expect(localStorage.getItem(SESSION_KEY)).toBeNull()
    })

    it('returns null in SSR context (window undefined)', () => {
      // @ts-expect-error - simulating SSR
      global.window = undefined

      expect(sessionService.get()).toBeNull()

      // Restore window
      global.window = window
    })
  })

  describe('clear', () => {
    it('removes session and entry seen keys and dispatches event', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(mockTokens))
      sessionStorage.setItem('el-bisne:entry-seen', 'true')
      const dispatchEvent = vi.spyOn(window, 'dispatchEvent')

      sessionService.clear()

      expect(localStorage.getItem(SESSION_KEY)).toBeNull()
      expect(sessionStorage.getItem('el-bisne:entry-seen')).toBeNull()
      expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({
        type: SESSION_CHANGED_EVENT
      }))
    })
  })
})