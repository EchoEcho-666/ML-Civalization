import { BookOpen, BrainCircuit, CircleHelp, FlaskConical, Lightbulb, TriangleAlert } from 'lucide-react'

export function Legend() {
  return (
    <div className="legend-panel">
      <div className="legend-title">MAP KEY</div>
      <div className="legend-items">
        <span><BookOpen />Paper</span><span><BrainCircuit />Concept</span><span><FlaskConical />Mechanism</span>
        <span><TriangleAlert />Problem</span><span><CircleHelp />Question</span><span><Lightbulb />Research idea</span>
      </div>
    </div>
  )
}
