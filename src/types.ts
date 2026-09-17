export type NodeType =
  | 'paper'
  | 'concept'
  | 'problem'
  | 'mechanism'
  | 'open-question'
  | 'contradiction'
  | 'research-idea'

export type ExplorationStatus =
  | 'locked'
  | 'discoverable'
  | 'unread'
  | 'reading'
  | 'understood'
  | 'mastered'
  | 'frontier'
  | 'current-research'
  | 'unresolved'

export type EdgeType =
  | 'INTRODUCES'
  | 'EXTENDS'
  | 'MOTIVATED_BY'
  | 'SOLVES'
  | 'MITIGATES'
  | 'REQUIRES'
  | 'CONTRADICTS'
  | 'REMOVES_ASSUMPTION'
  | 'EMPIRICALLY_SUPPORTS'
  | 'FAILS_UNDER'
  | 'GENERALIZES'
  | 'SIMPLIFIES'
  | 'INSPIRES'

export interface ResearchNode {
  id: string
  type: NodeType
  title: string
  subtitle?: string
  year?: number
  authors?: string[]
  venue?: string
  status: ExplorationStatus
  summary: string
  motivation?: string
  mechanism?: string
  previousLimitation?: string
  contribution?: string
  improvements?: string[]
  limitations?: string[]
  assumptions?: string[]
  evidence?: string[]
  missingEvidence?: string[]
  laterConsequences?: string[]
  openQuestions?: string[]
  notes?: string
  tags: string[]
  position: { x: number; y: number }
}

export interface ResearchEdge {
  id: string
  source: string
  target: string
  type: EdgeType
  explanation: string
  featured?: boolean
}
