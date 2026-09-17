import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { BookOpen, BrainCircuit, CircleHelp, FlaskConical, GitCompareArrows, Lightbulb, LockKeyhole, TriangleAlert } from 'lucide-react'
import type { ExplorationStatus, NodeType, ResearchNode as ResearchNodeModel } from '../types'
import { nodeTypeLabels, statusLabels } from '../data/researchGraph'

export type ResearchNodeData = {
  record: ResearchNodeModel
  displayStatus: ExplorationStatus
  obscured: boolean
  dimmed: boolean
  selected: boolean
}

export type ResearchFlowNode = Node<ResearchNodeData, 'research'>

const icons: Record<NodeType, typeof BookOpen> = {
  paper: BookOpen,
  concept: BrainCircuit,
  problem: TriangleAlert,
  mechanism: FlaskConical,
  'open-question': CircleHelp,
  contradiction: GitCompareArrows,
  'research-idea': Lightbulb,
}

export function ResearchNode({ data }: NodeProps<ResearchFlowNode>) {
  const { record, displayStatus, obscured, dimmed, selected } = data
  const Icon = obscured ? LockKeyhole : icons[record.type]
  const title = obscured ? 'Undiscovered research' : record.title
  const subtitle = obscured ? 'Continue exploring to reveal' : record.subtitle

  return (
    <article
      className={`research-node type-${record.type} status-${displayStatus} ${obscured ? 'is-obscured' : ''} ${dimmed ? 'is-dimmed' : ''} ${selected ? 'is-selected' : ''}`}
      aria-label={`${nodeTypeLabels[record.type]}: ${title}`}
    >
      <Handle type="target" position={Position.Left} className="node-handle" />
      <div className="node-topline">
        <span className="node-kind"><Icon size={12} strokeWidth={1.8} /> {nodeTypeLabels[record.type]}</span>
        <span className="node-year">{obscured ? '—' : record.year ?? '—'}</span>
      </div>
      <div className="node-title">{title}</div>
      {subtitle && <div className="node-subtitle">{subtitle}</div>}
      <div className="node-status">
        <span className="status-glyph" />
        {statusLabels[displayStatus]}
      </div>
      <Handle type="source" position={Position.Right} className="node-handle" />
    </article>
  )
}
