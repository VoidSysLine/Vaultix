export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

export interface PassphraseOptions {
  wordCount: number
  separator: string
  capitalize: boolean
  includeNumber: boolean
}

export interface PinOptions {
  length: number
  excludeSequential: boolean
}

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
}

export const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
  wordCount: 6,
  separator: '-',
  capitalize: true,
  includeNumber: true,
}

export const DEFAULT_PIN_OPTIONS: PinOptions = {
  length: 6,
  excludeSequential: true,
}

function getRandomValues(length: number): Uint32Array {
  return crypto.getRandomValues(new Uint32Array(length))
}

export function generatePassword(options: PasswordOptions): string {
  let charset = ''

  if (options.lowercase) {
    charset += options.excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz'
  }
  if (options.uppercase) {
    charset += options.excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }
  if (options.numbers) {
    charset += options.excludeSimilar ? '23456789' : '0123456789'
  }
  if (options.symbols) {
    charset += options.excludeAmbiguous ? '!@#$%^&*_+-=' : '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }

  if (charset.length === 0) {
    charset = 'abcdefghijklmnopqrstuvwxyz'
  }

  const values = getRandomValues(options.length)
  return Array.from(values)
    .map((x) => charset[x % charset.length])
    .join('')
}

// EFF short wordlist (representative sample for demo)
const WORDLIST = [
  'acid', 'acme', 'aged', 'also', 'area', 'army', 'away', 'baby', 'back', 'bail',
  'bake', 'ball', 'band', 'bank', 'bare', 'bark', 'barn', 'base', 'bash', 'bath',
  'beam', 'bean', 'bear', 'beat', 'been', 'beer', 'bell', 'belt', 'bend', 'best',
  'bird', 'bite', 'blow', 'blue', 'blur', 'boat', 'body', 'bold', 'bolt', 'bomb',
  'bond', 'bone', 'book', 'born', 'boss', 'both', 'bowl', 'bulk', 'burn', 'bush',
  'busy', 'cafe', 'cage', 'cake', 'calm', 'came', 'camp', 'card', 'care', 'cart',
  'case', 'cash', 'cast', 'cave', 'chip', 'city', 'clad', 'clam', 'clan', 'clay',
  'clip', 'club', 'clue', 'coal', 'coat', 'code', 'coil', 'coin', 'cold', 'come',
  'cook', 'cool', 'cope', 'copy', 'cord', 'core', 'cork', 'corn', 'cost', 'cozy',
  'crew', 'crop', 'crow', 'cube', 'cult', 'curb', 'cure', 'curl', 'cute', 'cycle',
  'dado', 'dale', 'dame', 'damp', 'dare', 'dark', 'dash', 'data', 'dawn', 'deal',
  'dean', 'dear', 'debt', 'deck', 'deep', 'deer', 'demo', 'deny', 'desk', 'dial',
  'dice', 'diet', 'dirt', 'disc', 'dish', 'dock', 'doll', 'dome', 'done', 'door',
  'dose', 'dove', 'down', 'drag', 'draw', 'drew', 'drop', 'drum', 'dual', 'dude',
  'duke', 'dull', 'dump', 'dune', 'dusk', 'dust', 'duty', 'each', 'earn', 'ease',
  'east', 'easy', 'edge', 'else', 'emit', 'epic', 'euro', 'even', 'ever', 'evil',
  'exam', 'exit', 'face', 'fact', 'fade', 'fail', 'fair', 'fake', 'fall', 'fame',
  'farm', 'fast', 'fate', 'fear', 'feed', 'feel', 'fell', 'felt', 'file', 'fill',
  'film', 'find', 'fine', 'fire', 'firm', 'fish', 'fist', 'flag', 'flame', 'flat',
  'fled', 'flew', 'flip', 'flock', 'flow', 'foam', 'fold', 'folk', 'fond', 'font',
  'fool', 'foot', 'ford', 'fork', 'form', 'fort', 'foul', 'four', 'free', 'frog',
  'from', 'fuel', 'full', 'fund', 'fury', 'fuse', 'gain', 'gale', 'game', 'gang',
  'garb', 'gate', 'gave', 'gaze', 'gear', 'gene', 'gift', 'glad', 'glow', 'glue',
  'goat', 'gold', 'golf', 'gone', 'good', 'grab', 'gram', 'gray', 'grew', 'grid',
  'grim', 'grin', 'grip', 'grit', 'grow', 'gulf', 'guru', 'gust', 'hack', 'hail',
  'hair', 'half', 'hall', 'halt', 'hand', 'hang', 'hard', 'harm', 'harp', 'hash',
  'hate', 'haul', 'have', 'hawk', 'haze', 'head', 'heal', 'heap', 'hear', 'heat',
  'heel', 'held', 'helm', 'help', 'herb', 'herd', 'here', 'hero', 'hide', 'high',
  'hike', 'hill', 'hint', 'hire', 'hold', 'hole', 'holy', 'home', 'hood', 'hook',
  'hope', 'horn', 'host', 'hour', 'huge', 'hull', 'hung', 'hunt', 'hurt', 'hush',
]

export function generatePassphrase(options: PassphraseOptions): string {
  const values = getRandomValues(options.wordCount)
  const words = Array.from(values).map((x) => {
    const word = WORDLIST[x % WORDLIST.length]
    return options.capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word
  })

  if (options.includeNumber) {
    const numValues = getRandomValues(1)
    words.push(String(numValues[0] % 10000))
  }

  return words.join(options.separator)
}

export function generatePin(options: PinOptions): string {
  const gen = (): string => {
    const values = getRandomValues(options.length)
    return Array.from(values)
      .map((x) => x % 10)
      .join('')
  }

  const isSequential = (pin: string): boolean => {
    const digits = pin.split('').map(Number)
    if (new Set(digits).size === 1) return true
    if (digits.every((d, i) => i === 0 || d === digits[i - 1] + 1)) return true
    if (digits.every((d, i) => i === 0 || d === digits[i - 1] - 1)) return true
    return false
  }

  let pin = gen()
  let attempts = 0
  while (options.excludeSequential && isSequential(pin) && attempts < 100) {
    pin = gen()
    attempts++
  }

  return pin
}

export function estimateEntropy(type: 'password' | 'passphrase' | 'pin', options: PasswordOptions | PassphraseOptions | PinOptions): number {
  if (type === 'password') {
    const opts = options as PasswordOptions
    let charsetSize = 0
    if (opts.lowercase) charsetSize += 26
    if (opts.uppercase) charsetSize += 26
    if (opts.numbers) charsetSize += 10
    if (opts.symbols) charsetSize += 32
    if (charsetSize === 0) charsetSize = 26
    return Math.log2(Math.pow(charsetSize, opts.length))
  }

  if (type === 'passphrase') {
    const opts = options as PassphraseOptions
    return opts.wordCount * Math.log2(WORDLIST.length)
  }

  const opts = options as PinOptions
  return opts.length * Math.log2(10)
}

export function getStrengthLevel(entropy: number): { level: string; color: string; label: string } {
  if (entropy < 40) return { level: 'weak', color: 'var(--color-security-weak)', label: 'Schwach' }
  if (entropy < 60) return { level: 'medium', color: 'var(--color-security-medium)', label: 'Mittel' }
  if (entropy < 80) return { level: 'strong', color: 'var(--color-security-strong)', label: 'Stark' }
  return { level: 'veryStrong', color: 'var(--color-security-very-strong)', label: 'Sehr stark' }
}
