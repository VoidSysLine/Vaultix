import { useEffect, useCallback } from 'react'

type KeyCombo = string // e.g. "ctrl+s", "ctrl+shift+n"

export function useHotkeys(combo: KeyCombo, callback: (e: KeyboardEvent) => void) {
  const handler = useCallback((e: KeyboardEvent) => {
    const parts = combo.toLowerCase().split('+')
    const key = parts[parts.length - 1]
    const needsCtrl = parts.includes('ctrl') || parts.includes('mod')
    const needsShift = parts.includes('shift')
    const needsAlt = parts.includes('alt')

    const ctrlMatch = needsCtrl ? (e.ctrlKey || e.metaKey) : true
    const shiftMatch = needsShift ? e.shiftKey : !e.shiftKey
    const altMatch = needsAlt ? e.altKey : !e.altKey

    if (ctrlMatch && shiftMatch && altMatch && e.key.toLowerCase() === key) {
      e.preventDefault()
      callback(e)
    }
  }, [combo, callback])

  useEffect(() => {
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [handler])
}
