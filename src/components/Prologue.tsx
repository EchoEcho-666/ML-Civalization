import { ArrowRight, CircleDotDashed, GitBranch, Network, Sparkles } from 'lucide-react'

interface PrologueProps {
  onEnter: () => void
}

const foundations = ['PERCEPTRON', 'BACKPROPAGATION', 'RECURRENCE', 'ATTENTION']

export function Prologue({ onEnter }: PrologueProps) {
  return (
    <section className="prologue" role="dialog" aria-modal="true" aria-labelledby="prologue-title">
      <div className="prologue-grain" />
      <div className="prologue-copy">
        <div className="prologue-mark"><Network size={15} /><span>ML EVOLUTION · PROLOGUE</span></div>
        <p className="prologue-kicker">EVERY FRONTIER HAS AN ANCESTRY</p>
        <h1 id="prologue-title">We see farther because<br />knowledge has shoulders.</h1>
        <p className="prologue-lede">
          No discovery stands alone. Each one inherits a limitation, transforms an idea,
          and opens branches that may be explored—or left unrealized.
        </p>
        <blockquote>“Standing on the shoulders of giants.”</blockquote>
        <button className="enter-atlas" onClick={onEnter} autoFocus>
          Enter the living atlas <ArrowRight size={15} />
        </button>
        <span className="prologue-hint">Trace what happened. Reveal what might have happened. Find what comes next.</span>
      </div>

      <div className="lineage-monument" aria-label="Foundations branching into realized history and an unresolved frontier">
        <div className="lineage-era era-future"><span>THE FRONTIER</span><strong>?</strong></div>
        <svg viewBox="0 0 720 570" role="img" aria-hidden="true">
          <defs>
            <linearGradient id="trunkGlow" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#596b64" stopOpacity=".22" />
              <stop offset=".55" stopColor="#92ad9f" stopOpacity=".8" />
              <stop offset="1" stopColor="#c7ab67" stopOpacity=".72" />
            </linearGradient>
            <radialGradient id="frontierGlow">
              <stop offset="0" stopColor="#d7ba71" stopOpacity=".45" />
              <stop offset="1" stopColor="#d7ba71" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle className="frontier-aura" cx="393" cy="88" r="78" fill="url(#frontierGlow)" />
          <path className="monument-path path-root" pathLength="1" d="M360 550 C355 496 355 450 360 397 C364 347 361 306 365 266" />
          <path className="monument-path path-known" pathLength="1" d="M365 378 C295 350 250 313 207 264 C170 221 128 210 81 201" />
          <path className="monument-path path-known branch-delay-1" pathLength="1" d="M361 337 C421 310 461 275 481 230 C495 198 526 177 572 167" />
          <path className="monument-path path-known branch-delay-2" pathLength="1" d="M364 268 C331 230 326 191 337 154 C347 121 369 98 393 82" />
          <path className="monument-path path-latent branch-delay-3" pathLength="1" d="M207 264 C207 223 220 185 248 153 C269 128 270 98 260 67" />
          <path className="monument-path path-latent branch-delay-4" pathLength="1" d="M481 230 C530 236 574 223 612 193 C640 171 662 140 677 105" />
          <path className="monument-path path-future branch-delay-5" pathLength="1" d="M393 82 C418 59 451 43 491 34" />

          <g className="monument-nodes">
            <circle cx="360" cy="397" r="5" /><circle cx="365" cy="378" r="4" />
            <circle cx="207" cy="264" r="5" /><circle cx="81" cy="201" r="5" />
            <circle cx="361" cy="337" r="4" /><circle cx="481" cy="230" r="5" />
            <circle cx="572" cy="167" r="5" /><circle cx="364" cy="268" r="4" />
            <circle className="node-frontier" cx="393" cy="82" r="7" />
            <circle className="node-latent" cx="260" cy="67" r="6" />
            <circle className="node-latent" cx="677" cy="105" r="6" />
            <circle className="node-future" cx="491" cy="34" r="5" />
          </g>
        </svg>

        <div className="branch-label branch-past"><GitBranch size={12} /><span>REALIZED HISTORY</span></div>
        <div className="branch-label branch-latent"><CircleDotDashed size={12} /><span>UNREALIZED BRANCH</span></div>
        <div className="branch-label branch-next"><Sparkles size={12} /><span>POSSIBLE FUTURE</span></div>
        <div className="foundation-stack">
          {foundations.map((foundation, index) => <span key={foundation} style={{ '--foundation-index': index } as React.CSSProperties}>{foundation}</span>)}
          <strong>GIANTS BECOME FOUNDATIONS</strong>
        </div>
      </div>
    </section>
  )
}
