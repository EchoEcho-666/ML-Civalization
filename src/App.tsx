import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Crosshair, Focus, Layers3, LocateFixed } from 'lucide-react'
import { researchEdges, researchNodes } from './data/researchGraph'
import type { EdgeType, ExplorationStatus, ResearchEdge, ResearchNode as ResearchNodeModel } from './types'
import { ResearchNode, type ResearchFlowNode } from './components/ResearchNode'
import { CausalEdge, type CausalFlowEdge } from './components/CausalEdge'
import { DetailPanel } from './components/DetailPanel'
import { Legend } from './components/Legend'
import { ProgressPanel } from './components/ProgressPanel'
import { SearchPalette } from './components/SearchPalette'
import { SideRail } from './components/SideRail'
import { TopBar } from './components/TopBar'
import { useResearchState } from './hooks/useResearchState'
import { PaperDiscoveryPanel } from './components/PaperDiscoveryPanel'
import type { ScholarlyPaper } from './services/scholarly'

const nodeTypes = { research: ResearchNode }
const edgeTypes = { causal: CausalEdge }

type TraceMode = 'all' | 'ancestors' | 'descendants' | 'unresolved'

function traverse(startId: string, direction: 'ancestors' | 'descendants', edges: ResearchEdge[]) {
  const visited = new Set<string>([startId])
  const queue = [startId]
  while (queue.length) {
    const current = queue.shift()!
    for (const edge of edges) {
      const next = direction === 'ancestors' && edge.target === current
        ? edge.source
        : direction === 'descendants' && edge.source === current
          ? edge.target
          : null
      if (next && !visited.has(next)) { visited.add(next); queue.push(next) }
    }
  }
  return visited
}

function buildTrace(id: string, mode: TraceMode, nodes: ResearchNodeModel[], edges: ResearchEdge[]) {
  if (mode === 'ancestors') return traverse(id, 'ancestors', edges)
  if (mode === 'descendants') return traverse(id, 'descendants', edges)
  const all = new Set([...traverse(id, 'ancestors', edges), ...traverse(id, 'descendants', edges)])
  if (mode === 'unresolved') {
    const unresolved = new Set(nodes.filter((node) => ['unresolved', 'frontier', 'current-research'].includes(node.status)).map((node) => node.id))
    const keep = new Set([id])
    edges.forEach((edge) => {
      if (all.has(edge.source) && unresolved.has(edge.target)) { keep.add(edge.source); keep.add(edge.target) }
    })
    unresolved.forEach((nodeId) => { if (all.has(nodeId)) keep.add(nodeId) })
    return keep
  }
  return all
}

function timelinePosition(node: ResearchNodeModel, index: number, nodes: ResearchNodeModel[]) {
  const year = node.year ?? 2026
  const lanes = { paper: 30, concept: 260, mechanism: 490, problem: 710, 'open-question': 900, contradiction: 900, 'research-idea': 900 }
  const sameYearOffset = nodes.filter((item, itemIndex) => itemIndex < index && item.year === year && item.type === node.type).length
  return { x: (year - 1986) * 90, y: lanes[node.type] + sameYearOffset * 155 }
}

function App() {
  const { setCenter, fitView } = useReactFlow<ResearchFlowNode, CausalFlowEdge>()
  const { statuses, notes, importedNodes, importedEdges, setStatus, setNote, addImportedPaper } = useResearchState()
  const [selectedId, setSelectedId] = useState<string>('transformer')
  const [fog, setFog] = useState(true)
  const [timeline, setTimeline] = useState(false)
  const [traceMode, setTraceMode] = useState<TraceMode | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const [discoveryOpen, setDiscoveryOpen] = useState(false)
  const [activeRail, setActiveRail] = useState('atlas')
  const [introVisible, setIntroVisible] = useState(true)

  const allNodes = useMemo(() => [...researchNodes, ...importedNodes], [importedNodes])
  const allEdges = useMemo(() => [...researchEdges, ...importedEdges], [importedEdges])
  const selectedNode = allNodes.find((node) => node.id === selectedId)
  const tracedIds = useMemo(() => selectedId && traceMode ? buildTrace(selectedId, traceMode, allNodes, allEdges) : null, [allEdges, allNodes, selectedId, traceMode])

  const statusOf = useCallback((node: ResearchNodeModel): ExplorationStatus => statuses[node.id] ?? node.status, [statuses])

  const flowNodes = useMemo<ResearchFlowNode[]>(() => allNodes.map((record, index) => {
    const status = statusOf(record)
    const obscured = fog && status === 'locked'
    return {
      id: record.id,
      type: 'research',
      position: timeline ? timelinePosition(record, index, allNodes) : record.position,
      data: {
        record,
        displayStatus: status,
        obscured,
        dimmed: Boolean(tracedIds && !tracedIds.has(record.id)),
        selected: record.id === selectedId,
      },
    }
  }), [allNodes, fog, selectedId, statusOf, timeline, tracedIds])

  const flowEdges = useMemo<CausalFlowEdge[]>(() => allEdges.map((edge) => {
    const dimmed = Boolean(tracedIds && (!tracedIds.has(edge.source) || !tracedIds.has(edge.target)))
    const fogged = fog && [edge.source, edge.target].some((id) => {
      const node = allNodes.find((item) => item.id === id)
      return node ? statusOf(node) === 'locked' : false
    })
    return {
      id: edge.id, source: edge.source, target: edge.target, type: 'causal',
      markerEnd: { type: MarkerType.ArrowClosed, width: 13, height: 13, color: '#71827b' },
      data: { relation: edge.type, explanation: edge.explanation, dimmed: dimmed || fogged, featured: Boolean(edge.featured) },
    }
  }), [allEdges, allNodes, fog, statusOf, tracedIds])

  const travelTo = useCallback((id: string) => {
    const index = allNodes.findIndex((node) => node.id === id)
    const record = allNodes[index]
    if (!record) return
    setSelectedId(id)
    setSearchOpen(false)
    setProgressOpen(false)
    setDiscoveryOpen(false)
    const position = timeline ? timelinePosition(record, index, allNodes) : record.position
    setCenter(position.x + 110, position.y + 60, { zoom: 1.15, duration: 850 })
  }, [allNodes, setCenter, timeline])

  const importPaper = useCallback((paper: ScholarlyPaper, relation: EdgeType, explanation: string) => {
    const duplicate = allNodes.find((node) =>
      (paper.doi && node.doi?.toLowerCase() === paper.doi.toLowerCase()) || node.externalId === paper.id,
    )
    if (duplicate) {
      setDiscoveryOpen(false)
      travelTo(duplicate.id)
      return
    }

    const base = selectedNode?.position ?? { x: 1900, y: 680 }
    const id = `${paper.provider}-${paper.id.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()}`
    const node: ResearchNodeModel = {
      id,
      type: 'paper',
      title: paper.title,
      subtitle: paper.venue ? `Imported from ${paper.venue}` : 'Imported scholarly work',
      year: paper.year,
      authors: paper.authors,
      venue: paper.venue,
      status: 'unread',
      summary: paper.abstract ?? 'Metadata imported from an open scholarly index. Read and analyze this paper to complete its intellectual history.',
      motivation: 'Not yet analyzed. Identify the limitation that made this paper necessary.',
      openQuestions: ['What limitation made this paper necessary?', 'Which result most clearly supports its central claim?'],
      tags: ['imported', paper.provider],
      position: { x: base.x + 340, y: base.y + ((importedNodes.length % 5) - 2) * 155 },
      doi: paper.doi,
      sourceUrl: paper.sourceUrl,
      pdfUrl: paper.pdfUrl,
      externalId: paper.id,
      dataSource: paper.provider,
      citationCount: paper.citationCount,
    }
    const edge = selectedNode ? {
      id: `import-${selectedNode.id}-${id}`,
      source: selectedNode.id,
      target: id,
      type: relation,
      explanation: explanation.trim() || `Candidate ${relation.toLowerCase().replaceAll('_', ' ')} relationship.`,
      featured: false,
    } satisfies ResearchEdge : undefined

    addImportedPaper(node, edge)
    setDiscoveryOpen(false)
    setSelectedId(id)
    setTraceMode(null)
    window.setTimeout(() => setCenter(node.position.x + 110, node.position.y + 60, { zoom: 1.12, duration: 850 }), 60)
  }, [addImportedPaper, allNodes, importedNodes.length, selectedNode, setCenter, travelTo])

  const onNodeClick: NodeMouseHandler<ResearchFlowNode> = useCallback((_event, node) => {
    if (node.data.obscured) {
      setStatus(node.id, 'discoverable')
      return
    }
    setSelectedId(node.id)
    setProgressOpen(false)
    setDiscoveryOpen(false)
  }, [setStatus])

  const handleTrace = useCallback((mode: TraceMode) => {
    setTraceMode(mode)
    setActiveRail('lineage')
  }, [])

  const handleRail = (value: string) => {
    setActiveRail(value)
    if (value === 'lineage') setTraceMode('all')
    if (value === 'atlas') setTraceMode(null)
    if (value === 'frontier') {
      setTraceMode('unresolved')
      const frontier = allNodes.find((node) => statusOf(node) === 'current-research')
      if (frontier) travelTo(frontier.id)
    }
    if (value === 'notes') { setProgressOpen(true); setDiscoveryOpen(false) }
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true) }
      if (event.key === 'Escape') { setSearchOpen(false); setProgressOpen(false); setDiscoveryOpen(false) }
      if (event.key.toLowerCase() === 'f' && !event.metaKey && !event.ctrlKey && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) setFog((value) => !value)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    window.setTimeout(() => setIntroVisible(false), 5200)
  }, [])

  useEffect(() => {
    window.setTimeout(() => fitView({ padding: 0.18, duration: 800, maxZoom: 0.9 }), 50)
  }, [fitView, timeline])

  return (
    <div className="app-shell">
      <TopBar
        fog={fog} lineage={Boolean(traceMode)} timeline={timeline} selectedTitle={selectedNode?.title}
        onToggleFog={() => setFog(!fog)}
        onToggleLineage={() => { setTraceMode(traceMode ? null : 'all'); setActiveRail(traceMode ? 'atlas' : 'lineage') }}
        onToggleTimeline={() => setTimeline(!timeline)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenProgress={() => { setProgressOpen(!progressOpen); setDiscoveryOpen(false) }}
        onOpenDiscovery={() => { setDiscoveryOpen(true); setProgressOpen(false) }}
      />
      <SideRail active={activeRail} onSelect={handleRail} />

      <main
        className={`atlas ${selectedNode || discoveryOpen || progressOpen ? 'has-detail' : ''}`}
      >
        <ReactFlow<ResearchFlowNode, CausalFlowEdge>
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          minZoom={0.25}
          maxZoom={1.8}
          defaultViewport={{ x: -80, y: 240, zoom: 0.65 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          proOptions={{ hideAttribution: true }}
          fitView
          fitViewOptions={{ padding: 0.18, maxZoom: 0.82 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#52605b" />
          <Controls position="bottom-left" showInteractive={false} />
          <MiniMap
            position="bottom-right"
            nodeColor={(node) => {
              const kind = (node.data as ResearchFlowNode['data'])?.record.type
              return kind === 'problem' ? '#b36d4d' : kind === 'research-idea' ? '#bfa45a' : kind === 'paper' ? '#799e91' : '#647b80'
            }}
            maskColor="rgba(5, 9, 10, .78)"
            pannable zoomable
          />
          {timeline && <div className="timeline-banner"><ClockMark /><span>CHRONOLOGY VIEW</span><strong>Causality remains visible across time</strong></div>}
        </ReactFlow>

        <div className="canvas-vignette" />
        <div className="atlas-caption"><span><Crosshair size={13} /> SEQUENCE INTELLIGENCE</span><strong>{traceMode ? `TRACING ${traceMode.toUpperCase()}` : 'CAUSAL ATLAS'}</strong></div>
        <Legend />
        <div className="canvas-tools">
          <button onClick={() => fitView({ padding: 0.18, duration: 700, maxZoom: 0.9 })}><Focus size={15} /> Fit atlas</button>
          <button onClick={() => selectedNode && travelTo(selectedNode.id)}><LocateFixed size={15} /> Focus</button>
          <button onClick={() => setFog(!fog)}><Layers3 size={15} /> {fog ? 'Reveal all' : 'Restore fog'}</button>
        </div>
        {introVisible && <div className="intro-toast"><span>THE MAP IS ALIVE</span><p>Drag to travel · scroll to zoom · select a discovery</p></div>}
      </main>

      {selectedNode && !progressOpen && !discoveryOpen && <DetailPanel
        key={selectedNode.id}
        node={selectedNode}
        note={notes[selectedNode.id] ?? selectedNode.notes ?? ''}
        status={statusOf(selectedNode)}
        onClose={() => { setSelectedId(''); setTraceMode(null) }}
        onStatus={(status) => setStatus(selectedNode.id, status)}
        onNote={(note) => setNote(selectedNode.id, note)}
        onTrace={handleTrace}
      />}
      {progressOpen && <ProgressPanel nodes={allNodes} statuses={statuses} onClose={() => setProgressOpen(false)} />}
      {discoveryOpen && <PaperDiscoveryPanel selectedNode={selectedNode} onClose={() => setDiscoveryOpen(false)} onImport={importPaper} />}
      {searchOpen && <SearchPalette nodes={allNodes.filter((node) => !fog || statusOf(node) !== 'locked')} onClose={() => setSearchOpen(false)} onSelect={travelTo} />}
    </div>
  )
}

function ClockMark() {
  return <div className="clock-mark"><i /><i /><i /></div>
}

export default App
