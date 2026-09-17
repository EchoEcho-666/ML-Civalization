import { BookOpenCheck, BrainCircuit, CircleHelp, Compass, PanelRightClose } from 'lucide-react'
import type { ExplorationStatus, ResearchNode } from '../types'

interface ProgressPanelProps {
  nodes: ResearchNode[]
  statuses: Record<string, ExplorationStatus>
  onClose: () => void
}

export function ProgressPanel({ nodes, statuses, onClose }: ProgressPanelProps) {
  const statusOf = (node: ResearchNode) => statuses[node.id] ?? node.status
  const read = nodes.filter((node) => node.type === 'paper' && ['understood', 'mastered'].includes(statusOf(node))).length
  const connected = nodes.filter((node) => ['concept', 'mechanism'].includes(node.type) && ['understood', 'mastered'].includes(statusOf(node))).length
  const questions = nodes.filter((node) => ['open-question', 'contradiction'].includes(node.type) || statusOf(node) === 'unresolved').length
  const explored = nodes.filter((node) => statusOf(node) !== 'locked').length

  return <aside className="progress-panel">
    <div className="progress-head"><div><span>FIELD NOTES</span><h2>Exploration record</h2></div><button onClick={onClose}><PanelRightClose size={18} /></button></div>
    <p>Your map reflects relationships you can explain—not points earned.</p>
    <div className="knowledge-ring"><div><strong>{explored}</strong><span>of {nodes.length}<br />territories revealed</span></div></div>
    <div className="metric-grid">
      <div><BookOpenCheck /><strong>{read}</strong><span>Papers understood</span></div>
      <div><BrainCircuit /><strong>{connected}</strong><span>Concepts connected</span></div>
      <div><CircleHelp /><strong>{questions}</strong><span>Open questions found</span></div>
      <div><Compass /><strong>4</strong><span>Branches explored</span></div>
    </div>
    <div className="frontier-distance"><span>FRONTIER DISTANCE</span><strong>Near</strong><div><i /></div><p>You are tracing ideas that touch active research.</p></div>
  </aside>
}
