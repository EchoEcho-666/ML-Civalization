import { Binoculars, Compass, GitBranch, Map, NotebookPen, Orbit } from 'lucide-react'

interface SideRailProps {
  active: string
  onSelect: (value: string) => void
}

const items = [
  { id: 'atlas', icon: Map, label: 'Atlas' },
  { id: 'lineage', icon: GitBranch, label: 'Lineage' },
  { id: 'frontier', icon: Binoculars, label: 'Frontier' },
  { id: 'notes', icon: NotebookPen, label: 'Notes' },
]

export function SideRail({ active, onSelect }: SideRailProps) {
  return (
    <aside className="side-rail">
      <div className="rail-compass"><Compass size={18} /><Orbit size={31} /></div>
      <nav>
        {items.map(({ id, icon: Icon, label }) => (
          <button key={id} className={active === id ? 'active' : ''} onClick={() => onSelect(id)} title={label}>
            <Icon size={18} /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="coordinates"><span>ATLAS</span><strong>04.17</strong></div>
    </aside>
  )
}
