import { useCallback, useEffect, useState } from 'react'
import type { ExplorationStatus, ResearchEdge, ResearchNode } from '../types'

interface SavedResearchState {
  statuses: Record<string, ExplorationStatus>
  notes: Record<string, string>
  nodePositions: Record<string, { x: number; y: number }>
  importedNodes: ResearchNode[]
  importedEdges: ResearchEdge[]
}

const STORAGE_KEY = 'ml-civilization:exploration:v1'

function readState(): SavedResearchState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { statuses: {}, notes: {}, nodePositions: {}, importedNodes: [], importedEdges: [] }
    const parsed = JSON.parse(raw) as Partial<SavedResearchState>
    return {
      statuses: parsed.statuses ?? {},
      notes: parsed.notes ?? {},
      nodePositions: parsed.nodePositions ?? {},
      importedNodes: parsed.importedNodes ?? [],
      importedEdges: parsed.importedEdges ?? [],
    }
  } catch {
    return { statuses: {}, notes: {}, nodePositions: {}, importedNodes: [], importedEdges: [] }
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

  const setNodePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setState((current) => ({ ...current, nodePositions: { ...current.nodePositions, [id]: position } }))
  }, [])

  const resetNodePositions = useCallback(() => {
    setState((current) => ({ ...current, nodePositions: {} }))
  }, [])

  const addImportedPaper = useCallback((node: ResearchNode, edge?: ResearchEdge) => {
    setState((current) => ({
      ...current,
      importedNodes: current.importedNodes.some((item) => item.id === node.id)
        ? current.importedNodes
        : [...current.importedNodes, node],
      importedEdges: edge && !current.importedEdges.some((item) => item.id === edge.id)
        ? [...current.importedEdges, edge]
        : current.importedEdges,
    }))
  }, [])

  return { ...state, setStatus, setNote, setNodePosition, resetNodePositions, addImportedPaper }
}
