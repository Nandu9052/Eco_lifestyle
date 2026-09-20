import type {
  AdminStats,
  ChatResult,
  ReindexResult,
  SourceItem,
  SourceRegistryItem,
  SystemLogEvent,
  TravelResponse,
} from '../types'

const API_BASE = import.meta.env.VITE_API_URL || ''

const ADMIN_KEY_STORAGE = 'eco_admin_passkey'

export function getAdminKey(): string | null {
  return sessionStorage.getItem(ADMIN_KEY_STORAGE) || localStorage.getItem(ADMIN_KEY_STORAGE)
}

export function setAdminKey(key: string): void {
  sessionStorage.setItem(ADMIN_KEY_STORAGE, key)
}

export function clearAdminKey(): void {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE)
  localStorage.removeItem(ADMIN_KEY_STORAGE)
}

async function apiFetch<T>(path: string, options?: RequestInit, requireAdmin = false): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  }

  if (requireAdmin) {
    const key = getAdminKey()
    if (key) {
      headers['X-Admin-Key'] = key
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })
  if (!response.ok) {
    const detail = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(detail.detail || `API error ${response.status}`)
  }
  return response.json() as Promise<T>
}

export const api = {
  health: () =>
    apiFetch<{ status: string; service: string; rag_engine?: string; granite_configured?: boolean; demo_mode?: boolean }>('/api/health'),

  chat: (message: string, location?: string, preferences?: Record<string, unknown>) =>
    apiFetch<ChatResult>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, location, preferences }),
    }),

  retrieve: (query: string, location?: string) =>
    apiFetch<{ documents: SourceItem[]; count: number }>('/api/retrieve', {
      method: 'POST',
      body: JSON.stringify({ query, location }),
    }),

  categories: () =>
    apiFetch<{ categories: string[] }>('/api/categories'),

  sources: () =>
    apiFetch<{ sources: SourceItem[] }>('/api/sources'),

  recycling: () =>
    apiFetch<{ recycling: SourceItem[] }>('/api/recycling'),

  schemes: () =>
    apiFetch<{ schemes: SourceItem[] }>('/api/schemes'),

  travel: () =>
    apiFetch<TravelResponse>('/api/travel'),

  actions: () =>
    apiFetch<{ actions: { title: string; description: string; why: string; difficulty: string; category: string }[] }>('/api/actions'),

  adminLogin: (key: string) =>
    apiFetch<{ status: string; message: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ key }),
    }),

  adminStats: () =>
    apiFetch<AdminStats>('/api/admin/stats', undefined, true),

  adminSources: () =>
    apiFetch<{ sources: SourceRegistryItem[]; total: number }>('/api/admin/sources', undefined, true),

  adminLogs: (limit = 50) =>
    apiFetch<SystemLogEvent[] | { logs: SystemLogEvent[] }>(`/api/admin/logs?limit=${limit}`, undefined, true),

  adminVerifySource: (source_title: string, verified: boolean, notes = '') =>
    apiFetch<{ status: string; target: string; new_status: string; success: boolean }>('/api/admin/verify-source', {
      method: 'POST',
      body: JSON.stringify({ source_title, verified, notes }),
    }, true),

  reindex: (target_domain?: string) =>
    apiFetch<ReindexResult>('/api/admin/reindex', {
      method: 'POST',
      body: JSON.stringify(target_domain ? { target_domain } : {}),
    }, true),
}

