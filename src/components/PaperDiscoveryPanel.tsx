import { useEffect, useState } from 'react'
import { ArrowUpRight, BookPlus, ChevronDown, Database, ExternalLink, FileText, Link2, LoaderCircle, PanelRightClose, Search } from 'lucide-react'
import type { EdgeType, ResearchNode } from '../types'
import { searchScholarlyWorks, type ScholarlyPaper } from '../services/scholarly'

interface PaperDiscoveryPanelProps {
  selectedNode?: ResearchNode
  onClose: () => void
  onImport: (paper: ScholarlyPaper, relation: EdgeType, explanation: string) => void
}

const relationOptions: EdgeType[] = ['EXTENDS', 'INSPIRES', 'MOTIVATED_BY', 'SOLVES', 'MITIGATES', 'GENERALIZES', 'CONTRADICTS', 'EMPIRICALLY_SUPPORTS']

export function PaperDiscoveryPanel({ selectedNode, onClose, onImport }: PaperDiscoveryPanelProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ScholarlyPaper[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [relation, setRelation] = useState<EdgeType>('EXTENDS')
  const [explanation, setExplanation] = useState('')

  useEffect(() => {
    if (!selectedNode) return
    setExplanation(`Imported as a candidate ${relation.toLowerCase().replaceAll('_', ' ')} relationship to ${selectedNode.title}. Review the paper before confirming this causal link.`)
  }, [relation, selectedNode])

  const runSearch = async (event: React.FormEvent) => {
    event.preventDefault()
    if (query.trim().length < 3) return
    setLoading(true)
    setError('')
    try {
      setResults(await searchScholarlyWorks(query.trim()))
    } catch {
      setError('The open literature services are temporarily unavailable. Try again shortly.')
    } finally {
      setLoading(false)
    }
  }

  return <aside className="discovery-panel">
    <div className="discovery-head">
      <div><span>OPEN LITERATURE</span><h2>Link a paper</h2></div>
      <button onClick={onClose} aria-label="Close literature search"><PanelRightClose size={18} /></button>
    </div>
    <p className="discovery-intro">Search open scholarly metadata, then place a paper into the intellectual atlas with an explicit causal relationship.</p>

    <form className="literature-search" onSubmit={runSearch}>
      <Search size={16} />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, DOI, author, or research idea…" />
      <button disabled={loading || query.trim().length < 3}>{loading ? <LoaderCircle className="spin" size={15} /> : 'Search'}</button>
    </form>

    <div className="provider-note"><Database size={12} /><span>OpenAlex primary · Crossref fallback</span><em>Provenance preserved</em></div>

    {selectedNode && <div className="link-composer">
      <div className="link-target"><Link2 size={13} /><span>LINK NEW PAPER TO</span><strong>{selectedNode.title}</strong></div>
      <label>Relationship</label>
      <div className="relation-select"><select value={relation} onChange={(event) => setRelation(event.target.value as EdgeType)}>{relationOptions.map((value) => <option key={value}>{value}</option>)}</select><ChevronDown size={14} /></div>
      <label>Why are they connected?</label>
      <textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} />
    </div>}

    <div className="literature-results">
      {error && <div className="literature-error">{error}</div>}
      {!loading && !error && !results.length && <div className="literature-empty"><BookPlus size={26} /><strong>Bring evidence into the atlas</strong><span>Imported papers remain distinct from curated causal history until you analyze their relationship.</span></div>}
      {results.map((paper) => <article className="literature-result" key={`${paper.provider}-${paper.id}`}>
        <div className="result-provider"><span>{paper.provider}</span>{paper.doi && <em>DOI</em>}</div>
        <h3>{paper.title}</h3>
        <p>{paper.authors.slice(0, 4).join(', ')}{paper.authors.length > 4 ? ' et al.' : ''}</p>
        <div className="result-metadata"><span>{paper.year ?? 'Year unknown'}</span><i /> <span>{paper.venue ?? 'Venue unknown'}</span>{typeof paper.citationCount === 'number' && <><i /><span>{paper.citationCount.toLocaleString()} citations</span></>}</div>
        <div className="result-buttons">
          <a href={paper.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink size={12} /> Source</a>
          {paper.pdfUrl && <a href={paper.pdfUrl} target="_blank" rel="noreferrer"><FileText size={12} /> Open PDF</a>}
          <button onClick={() => onImport(paper, relation, explanation)}><BookPlus size={12} /> Add to atlas <ArrowUpRight size={12} /></button>
        </div>
      </article>)}
    </div>
  </aside>
}
