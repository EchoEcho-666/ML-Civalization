import { useCallback, useEffect, useState } from 'react'
import type { ExplorationStatus } from '../types'

interface SavedResearchState {
  statuses: Record<string, ExplorationStatus>
  notes: Record<string, string>
}

const STORAGE_KEY = 'ml-civilization:exploration:v1'

function readState(): SavedResearchState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) as SavedResearchState : { statuses: {}, notes: {} }
  } catch {
    return { statuses: {}, notes: {} }
  }
}

export function useResearchState() {
  const [state, setState] = useState<SavedResearchState>(readState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const setStatus = useCallback((id: string, status: ExplorationStatus) => {
    setState((current) => ({ ...current, statuses: { ...current.statuses, [id]: status } }))
  }, [])

  const setNote = useCallback((id: string, note: string) => {
    setState((current) => ({ ...current, notes: { ...current.notes, [id]: note } }))
  }, [])

  return { ...state, setStatus, setNote }
}
