import { BaseEdge, getBezierPath, type Edge, type EdgeProps } from '@xyflow/react'
import type { EdgeType } from '../types'

export type CausalEdgeData = {
  relation: EdgeType
  explanation: string
  dimmed: boolean
  featured: boolean
}

export type CausalFlowEdge = Edge<CausalEdgeData, 'causal'>

export function CausalEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data }: EdgeProps<CausalFlowEdge>) {
  const [path, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, curvature: 0.34 })
  const relation = data?.relation ?? 'EXTENDS'

  return (
    <g className={`causal-edge ${data?.dimmed ? 'is-dimmed' : ''} ${data?.featured ? 'is-featured' : ''}`}>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} className="edge-visible" />
      <path d={path} className="edge-hitbox" fill="none" />
      <foreignObject x={labelX - 110} y={labelY - 34} width="220" height="68" className="edge-foreign">
        <div
          className="edge-label nodrag nopan"
        >
          <strong>{relation.replaceAll('_', ' ')}</strong>
          <span>{data?.explanation}</span>
        </div>
      </foreignObject>
    </g>
  )
}
