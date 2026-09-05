import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient, ApiError } from '@/lib/api/api-client'

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('throws ApiError on non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Unauthorized' })
    } as Response)

    await expect(apiClient('/test')).rejects.toThrow(ApiError)
    await expect(apiClient('/test')).rejects.toMatchObject({
      status: 401,
      message: 'Unauthorized'
    })
  })

  it('returns parsed JSON on successful response', async () => {
    const mockData = { id: 1, name: 'Test' }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData)
    } as Response)

    const result = await apiClient<typeof mockData>('/test')
    expect(result).toEqual(mockData)
  })

  it('sets Content-Type header for JSON body', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({})
    } as Response)

    await apiClient('/test', { method: 'POST', body: { key: 'value' } })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ key: 'value' })
      })
    )
  })

  it('does not set Content-Type for FormData', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({})
    } as Response)

    const formData = new FormData()
    formData.append('file', 'test')

    await apiClient('/upload', { method: 'POST', body: formData })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/upload'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.not.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: formData
      })
    )
  })

  it('returns undefined for 204 No Content', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204
    } as Response)

    const result = await apiClient<unknown>('/delete', { method: 'DELETE' })
    expect(result).toBeUndefined()
  })
})