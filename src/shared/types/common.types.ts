export type Theme = 'light' | 'dark' | 'system'

export interface SortConfig {
  field: 'title' | 'username' | 'modified' | 'created'
  direction: 'asc' | 'desc'
}

export interface EntryFilter {
  search: string
  tags: string[]
  group: string | null
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
