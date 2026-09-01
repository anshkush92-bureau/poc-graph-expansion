import React from 'react'
import { ENTITY } from '../graph/data.js'

/**
 * The peek layer: enough to decide whether this node is worth opening, and
 * nothing more. The degree readout is the point — it says how much is still
 * hidden behind the node before you spend a click finding out.
 */
export default function HoverCard({
  node,
  shown,
  hidden,
  explored,
  at,
  onOpen,
  onHold,
  onRelease
}) {
  const meta = ENTITY[node.type]
  const total = shown + hidden
  const style = {
    left: Math.min(at.x + 18, window.innerWidth - 300),
    top: Math.min(at.y + 12, window.innerHeight - 250)
  }

  return (
    <div className="peek" style={style} onMouseEnter={onHold} onMouseLeave={onRelease}>
      <div className="peek__head" style={{ '--accent': meta.color }}>
        <span className="peek__tag">{meta.tag}</span>
        <span className="peek__type">{meta.label}</span>
        {node.flagged && <span className="peek__flag">flagged</span>}
      </div>

      <p className="peek__name">{node.name}</p>
      <p className="peek__id">{node.id}</p>

      <div className="degree">
        <div className="degree__bar" style={{ '--accent': meta.color }}>
          {total === 0 ? (
            <span className="degree__none" />
          ) : (
            Array.from({ length: total }, (_, i) => (
              <span key={i} className={i < shown ? 'degree__seg is-mapped' : 'degree__seg'} />
            ))
          )}
        </div>
        <p className="degree__read">
          {total === 0 ? (
            'no onward links'
          ) : (
            <React.Fragment>
              <b>{shown}</b> of <b>{total}</b> links mapped
            </React.Fragment>
          )}
        </p>
      </div>

      <dl className="peek__stats">
        <div>
          <dt>Risk</dt>
          <dd>{node.risk}</dd>
        </div>
        <div>
          <dt>Events</dt>
          <dd>{node.events}</dd>
        </div>
        <div>
          <dt>Level</dt>
          <dd>{node.level}</dd>
        </div>
      </dl>

      <div className="peek__actions">
        <button type="button" onClick={() => onOpen('details')}>
          Open details
        </button>
        <button type="button" onClick={() => onOpen('trace')}>
          Trace connections
        </button>
      </div>

      <p className="peek__hint">
        {hidden > 0
          ? `Click the node to pull in ${hidden} more`
          : explored
            ? 'Fully expanded'
            : 'Nothing left to expand'}
      </p>
    </div>
  )
}
