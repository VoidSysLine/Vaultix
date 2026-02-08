// API client for communicating with the Python backend

let _baseUrl = 'http://127.0.0.1:18923'

export async function initApi(): Promise<void> {
  if (window.electronAPI) {
    _baseUrl = await window.electronAPI.getBackendUrl()
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${_baseUrl}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }))
    throw new ApiError(res.status, body.detail || 'Unknown error')
  }

  return res.json()
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// ============================================
// Database API
// ============================================

export const databaseApi = {
  open: (path: string, password: string, keyFile?: string) =>
    request<{ success: boolean; database: DatabaseResponse }>('/api/database/open', {
      method: 'POST',
      body: JSON.stringify({ path, password, key_file: keyFile }),
    }),

  close: () =>
    request<{ success: boolean }>('/api/database/close', { method: 'POST' }),

  save: () =>
    request<{ success: boolean; timestamp: string }>('/api/database/save', { method: 'POST' }),

  info: () =>
    request<DatabaseResponse>('/api/database/info'),

  create: (path: string, password: string, name: string) =>
    request<{ success: boolean; database: DatabaseResponse }>('/api/database/create', {
      method: 'POST',
      body: JSON.stringify({ path, password, name }),
    }),
}

// ============================================
// Entries API
// ============================================

export const entriesApi = {
  list: (groupId?: string) => {
    const params = groupId ? `?group_id=${groupId}` : ''
    return request<EntryResponse[]>(`/api/entries/${params}`)
  },

  get: (id: string) =>
    request<EntryResponse>(`/api/entries/${id}`),

  create: (data: EntryCreateRequest) =>
    request<EntryResponse>('/api/entries/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: EntryUpdateRequest) =>
    request<EntryResponse>(`/api/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/api/entries/${id}`, { method: 'DELETE' }),
}

// ============================================
// Groups API
// ============================================

export const groupsApi = {
  list: () =>
    request<GroupResponse[]>('/api/groups/'),

  create: (data: { name: string; parent_id?: string }) =>
    request<GroupResponse>('/api/groups/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { name?: string; icon?: number }) =>
    request<GroupResponse>(`/api/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/api/groups/${id}`, { method: 'DELETE' }),
}

// ============================================
// Generator API
// ============================================

export const generatorApi = {
  password: (options: PasswordGenRequest) =>
    request<GeneratorResponse>('/api/generator/password', {
      method: 'POST',
      body: JSON.stringify(options),
    }),

  passphrase: (options: PassphraseGenRequest) =>
    request<GeneratorResponse>('/api/generator/passphrase', {
      method: 'POST',
      body: JSON.stringify(options),
    }),

  pin: (options: PinGenRequest) =>
    request<GeneratorResponse>('/api/generator/pin', {
      method: 'POST',
      body: JSON.stringify(options),
    }),
}

// ============================================
// Health Check
// ============================================

export async function waitForBackend(maxRetries = 30, interval = 500): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await request<{ status: string }>('/api/health')
      return true
    } catch {
      await new Promise((r) => setTimeout(r, interval))
    }
  }
  return false
}

// ============================================
// Response Types
// ============================================

interface DatabaseResponse {
  name: string
  description: string
  path: string
  version: string
  cipher: string
  kdf: string
  entry_count: number
  group_count: number
}

interface EntryResponse {
  id: string
  title: string
  username: string
  password: string
  url: string
  notes: string
  icon: number
  tags: string[]
  group_id: string
  custom_fields: Record<string, { value: string; protected: boolean }>
  attachments: { id: string; filename: string; size: number }[]
  created: string
  modified: string
  expiry_time: string | null
}

interface EntryCreateRequest {
  title: string
  username?: string
  password?: string
  url?: string
  notes?: string
  group_id: string
  custom_fields?: Record<string, string>
  tags?: string[]
}

interface EntryUpdateRequest {
  title?: string
  username?: string
  password?: string
  url?: string
  notes?: string
  custom_fields?: Record<string, string>
  tags?: string[]
}

interface GroupResponse {
  id: string
  name: string
  icon: number
  parent_id: string | null
  children: GroupResponse[]
  entry_count: number
}

interface PasswordGenRequest {
  length?: number
  uppercase?: boolean
  lowercase?: boolean
  numbers?: boolean
  symbols?: boolean
}

interface PassphraseGenRequest {
  word_count?: number
  separator?: string
  capitalize?: boolean
  include_number?: boolean
}

interface PinGenRequest {
  length?: number
  exclude_sequential?: boolean
}

interface GeneratorResponse {
  result: string
  entropy: number
  strength: string
}
