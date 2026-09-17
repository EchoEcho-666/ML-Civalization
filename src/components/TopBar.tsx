import { BookOpenText, BookPlus, Clock3, Eye, EyeOff, GitFork, Map, Search, Sparkles } from 'lucide-react'

interface TopBarProps {
  fog: boolean
  lineage: boolean
  timeline: boolean
  selectedTitle?: string
  onToggleFog: () => void
  onToggleLineage: () => void
  onToggleTimeline: () => void
  onOpenSearch: () => void
  onOpenProgress: () => void
  onOpenDiscovery: () => void
}

export function TopBar({ fog, lineage, timeline, selectedTitle, onToggleFog, onToggleLineage, onToggleTimeline, onOpenSearch, onOpenProgress, onOpenDiscovery }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-sigil"><Sparkles size={16} /></div>
        <div><div className="brand-name">ML EVOLUTION</div><div className="brand-sub">AN INTELLECTUAL ATLAS</div></div>
      </div>
      <div className="era-indicator">
        <span>ACTIVE DOMAIN</span>
        <strong>Sequence Intelligence</strong>
        <i />
        <span>1986—FRONTIER</span>
      </div>
      <div className="topbar-actions">
        <button className="search-trigger" onClick={onOpenSearch}><Search size={15} /><span>Search the atlas</span><kbd>⌘ K</kbd></button>
        <button className="tool-button add-paper" onClick={onOpenDiscovery} title="Search open literature and link a paper"><BookPlus size={15} /> Add paper</button>
        <button className={`tool-button ${timeline ? 'active' : ''}`} onClick={onToggleTimeline} title="Toggle historical timeline"><span>{timeline ? <Map size={15} /> : <Clock3 size={15} />}</span>{timeline ? 'Map' : 'Timeline'}</button>
        <button className={`tool-button ${lineage ? 'active' : ''}`} onClick={onToggleLineage} disabled={!selectedTitle} title="Trace causal ancestry and descendants"><GitFork size={15} /> Lineage</button>
        <button className={`tool-button ${!fog ? 'active' : ''}`} onClick={onToggleFog} title="Toggle fog of war">{fog ? <EyeOff size={15} /> : <Eye size={15} />} Fog</button>
        <button className="progress-trigger" onClick={onOpenProgress} title="Exploration progress"><BookOpenText size={16} /><span className="progress-ring"><i /></span></button>
      </div>
    </header>
  )
}
