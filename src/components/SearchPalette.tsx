import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, BookOpen, BrainCircuit, CircleHelp, Command, FlaskConical, GitCompareArrows, Lightbulb, Search, TriangleAlert, X } from 'lucide-react'
import type { NodeType, ResearchNode } from '../types'
import { nodeTypeLabels } from '../data/researchGraph'

interface SearchPaletteProps {
  nodes: ResearchNode[]
  onClose: () => void
  onSelect: (id: string) => void
}

const icons: Record<NodeType, typeof BookOpen> = {
  paper: BookOpen, concept: BrainCircuit, problem: TriangleAlert, mechanism: FlaskConical,
  'open-question': CircleHelp, contradiction: GitCompareArrows, 'research-idea': Lightbulb,
}

export function SearchPalette({ nodes, onClose, onSelect }: SearchPaletteProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return nodes.filter((node) => ['paper', 'problem', 'open-question', 'research-idea'].includes(node.type)).slice(0, 8)
    return nodes.filter((node) => [node.title, node.subtitle, node.authors?.join(' '), node.tags.join(' ')].join(' ').toLowerCase().includes(term)).slice(0, 9)
  }, [nodes, query])

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="command-palette" onMouseDown={(event) => event.stopPropagation()}>
        <div className="command-input"><Search size={19} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && matches[0]) onSelect(matches[0].id) }} placeholder="Find papers, concepts, problems, authors…" /><kbd>ESC</kbd><button onClick={onClose}><X size={16} /></button></div>
        <div className="command-context"><Command size={12} /> EXPLORE THE INTELLECTUAL MAP</div>
        <div className="command-results">
          {matches.map((node, index) => {
            const Icon = icons[node.type]
            return <button key={node.id} onClick={() => onSelect(node.id)}>
              <span className={`result-icon type-${node.type}`}><Icon size={16} /></span>
              <span className="result-copy"><strong>{node.title}</strong><small>{node.year} · {nodeTypeLabels[node.type]}{node.authors?.[0] ? ` · ${node.authors[0]}` : ''}</small></span>
              {index === 0 && query && <kbd>↵</kbd>}<ArrowRight size={15} />
            </button>
          })}
          {!matches.length && <div className="empty-results"><CircleHelp size={22} /><strong>No known territory</strong><span>Try a title, mechanism, author, or research problem.</span></div>}
        </div>
        <div className="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Travel to node</span><span><kbd>esc</kbd> Close</span></div>
      </div>
    </div>
  )
}
