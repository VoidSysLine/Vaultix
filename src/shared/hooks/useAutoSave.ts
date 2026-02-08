import { useEffect, useRef } from 'react'
import { useDatabaseStore } from '@/features/database/store/databaseStore'
import { databaseApi } from '@/shared/utils/api'
import { toast } from '@/shared/components/Toast'

export function useAutoSave() {
  const autoSave = useDatabaseStore((s) => s.autoSave)
  const autoSaveInterval = useDatabaseStore((s) => s.autoSaveInterval)
  const database = useDatabaseStore((s) => s.database)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (!autoSave || !database || autoSaveInterval <= 0) return

    timerRef.current = setInterval(async () => {
      const state = useDatabaseStore.getState()
      if (state.isDirty && state.database) {
        try {
          await databaseApi.save()
          useDatabaseStore.getState().setLastSaved(new Date())
          toast('info', 'Automatisch gespeichert')
        } catch {
          toast('error', 'Auto-Speichern fehlgeschlagen')
        }
      }
    }, autoSaveInterval * 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoSave, autoSaveInterval, database])
}
