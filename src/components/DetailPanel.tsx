import { useMemo, useState } from 'react'
import { ArrowDownRight, BookMarked, ChevronDown, CircleDotDashed, GitFork, Lightbulb, Network, PanelRightClose, Route, Save, SearchCheck } from 'lucide-react'
import type { ExplorationStatus, ResearchNode } from '../types'
import { nodeTypeLabels, statusLabels } from '../data/researchGraph'

interface DetailPanelProps {
  node: ResearchNode
  note: string
  status: ExplorationStatus
  onClose: () => void
  onStatus: (status: ExplorationStatus) => void
  onNote: (note: string) => void
  onTrace: (mode: 'all' | 'ancestors' | 'descendants' | 'unresolved') => void
}

const availableStatuses: ExplorationStatus[] = ['unread', 'reading', 'understood', 'mastered', 'current-research']

function Section({ title, children, open = false }: { title: string; children?: React.ReactNode; open?: boolean }) {
  const [expanded, setExpanded] = useState(open)
  if (!children) return null
  return (
    <section className={`detail-section ${expanded ? 'open' : ''}`}>
      <button onClick={() => setExpanded(!expanded)}><span>{title}</span><ChevronDown size={15} /></button>
      {expanded && <div className="section-content">{children}</div>}
    </section>
  )
}

function List({ values }: { values?: string[] }) {
  if (!values?.length) return null
  return <ul>{values.map((value) => <li key={value}>{value}</li>)}</ul>
}

export function DetailPanel({ node, note, status, onClose, onStatus, onNote, onTrace }: DetailPanelProps) {
  const [draftNote, setDraftNote] = useState(note)
  const initials = useMemo(() => node.authors?.slice(0, 3).map((author) => author.split(' ').map((p) => p[0]).join('')).join(' · '), [node.authors])

  return (
    <aside className="detail-panel">
      <div className="detail-scroll">
        <div className="detail-actions"><span>{nodeTypeLabels[node.type]}</span><button onClick={onClose} aria-label="Close details"><PanelRightClose size={18} /></button></div>
        <div className="detail-hero">
          <div className="detail-era"><span>{node.year ?? 'ONGOING'}</span><i /><span>{node.venue ?? nodeTypeLabels[node.type]}</span></div>
          <h1>{node.title}</h1>
          <p>{node.subtitle}</p>
          {node.authors && <div className="authors"><span>{initials}</span><div>{node.authors.join(', ')}</div></div>}
        </div>

        <div className="status-control">
          <label>Exploration state</label>
          <div className="select-wrap"><CircleDotDashed size={14} /><select value={status} onChange={(event) => onStatus(event.target.value as ExplorationStatus)}>
            {[...new Set([status, ...availableStatuses])].map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}
          </select><ChevronDown size={14} /></div>
        </div>

        <div className="trace-actions">
          <button onClick={() => onTrace('ancestors')}><Route size={15} /><span>Why it exists<small>Trace prerequisites</small></span></button>
          <button onClick={() => onTrace('descendants')}><GitFork size={15} /><span>What followed<small>Show descendants</small></span></button>
          <button onClick={() => onTrace('unresolved')}><SearchCheck size={15} /><span>Open questions<small>Find the frontier</small></span></button>
        </div>

        <div className="detail-summary"><span>IN BRIEF</span><p>{node.summary}</p></div>

        <div className="sections">
          <Section title="Why this existed" open>{node.motivation && <p>{node.motivation}</p>}</Section>
          <Section title="Previous limitation">{node.previousLimitation && <p>{node.previousLimitation}</p>}</Section>
          <Section title="Core mechanism">{node.mechanism && <p>{node.mechanism}</p>}</Section>
          <Section title="Contribution">{node.contribution && <p>{node.contribution}</p>}</Section>
          <Section title="What it improved"><List values={node.improvements} /></Section>
          <Section title="New limitations"><List values={node.limitations} /></Section>
          <Section title="Assumptions"><List values={node.assumptions} /></Section>
          <Section title="Evidence"><List values={node.evidence} /></Section>
          <Section title="Missing evidence"><List values={node.missingEvidence} /></Section>
          <Section title="Later consequences"><List values={node.laterConsequences} /></Section>
          <Section title="Open questions" open><List values={node.openQuestions} /></Section>
        </div>

        <div className="notes-editor">
          <div className="notes-title"><span><BookMarked size={14} /> MY NOTES</span>{draftNote !== note && <em>Unsaved</em>}</div>
          <textarea value={draftNote} onChange={(event) => setDraftNote(event.target.value)} placeholder="Record an interpretation, caveat, or connection…" />
          <button onClick={() => onNote(draftNote)}><Save size={13} /> Save note</button>
        </div>

        {node.openQuestions?.length ? <div className="idea-seed"><Lightbulb size={15} /><div><span>RESEARCH SEED</span><p>{node.openQuestions[0]}</p></div><ArrowDownRight size={15} /></div> : null}
        <button className="trace-lineage" onClick={() => onTrace('all')}><Network size={15} /> Trace full research lineage</button>
      </div>
    </aside>
  )
}
