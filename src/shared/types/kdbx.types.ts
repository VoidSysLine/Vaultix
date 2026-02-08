export interface KdbxEntry {
  id: string
  title: string
  username: string
  password: string
  url: string
  notes: string
  icon: number
  tags: string[]
  groupId: string
  customFields: CustomField[]
  attachments: Attachment[]
  created: string
  modified: string
  accessed: string
  expiryTime: string | null
  isExpired: boolean
}

export interface CustomField {
  name: string
  value: string
  protected: boolean
}

export interface Attachment {
  id: string
  filename: string
  size: number
  mimeType: string
  data?: Uint8Array
}

export interface KdbxGroup {
  id: string
  name: string
  icon: number
  parentId: string | null
  children: KdbxGroup[]
  entryCount: number
}

export interface KdbxDatabase {
  name: string
  description: string
  path: string
  rootGroup: KdbxGroup
  recycleBinId: string | null
  version: string
  cipher: 'AES256' | 'ChaCha20'
  kdf: 'Argon2d' | 'Argon2id' | 'AES-KDF'
}

export type SecurityLevel = 'weak' | 'medium' | 'strong' | 'veryStrong'

export interface PasswordStrength {
  score: number
  level: SecurityLevel
  entropy: number
  crackTime: string
  feedback: string[]
}
