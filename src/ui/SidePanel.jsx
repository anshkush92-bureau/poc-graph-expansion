import React, { useEffect, useRef, useState } from 'react'
import { ENTITY } from '../graph/data.js'
import { neighborsOf, pathToRoot } from '../graph/ops.js'

const ADDABLE = Object.keys(ENTITY)

export default function SidePanel({
  graph,
  node,
  tab,
  onTab,
  onClose,
  onAdd,
  onDelete,
  onExpand,
  isRoot,
  hidden
}) {
  const [addType, setAddType] = useState('device')
  const closeRef = useRef(null)
  const meta = ENTITY[node.type]

  useEffect(() => {
    if (closeRef.current) closeRef.current.focus()
  }, [node.id])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const chain = pathToRoot(graph, node.id)
  const links = neighborsOf(graph, node.id)

  return (
    <aside className="panel" aria-label={`${meta.label} ${node.name}`}>
      <header className="panel__head" style={{ '--accent': meta.color }}>
        <div>
          <p className="panel__eyebrow">{meta.label}</p>
          <h2 className="panel__title">{node.name}</h2>
          <p className="panel__id">{node.id}</p>
        </div>
        <button
          type="button"
          className="panel__close"
          onClick={onClose}
          ref={closeRef}
          aria-label="Close panel"
        >
          ✕
        </button>
      </header>

      <nav className="panel__tabs">
        <button
          type="button"
          className={tab === 'details' ? 'is-on' : ''}
          onClick={() => onTab('details')}
        >
          Details
        </button>
        <button
          type="button"
          className={tab === 'trace' ? 'is-on' : ''}
          onClick={() => onTab('trace')}
        >
          Trace
        </button>
      </nav>

      <div className="panel__body">
        {tab === 'details' ? (
          <dl className="rows">
            <div>
              <dt>Type</dt>
              <dd>{meta.label}</dd>
            </div>
            <div>
              <dt>Risk score</dt>
              <dd>
                {node.risk}
                <span className="risk" style={{ '--v': node.risk + '%' }} />
              </dd>
            </div>
            <div>
              <dt>Flagged</dt>
              <dd>{node.flagged ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt>First seen</dt>
              <dd>{node.firstSeen}</dd>
            </div>
            <div>
              <dt>Events</dt>
              <dd>{node.events}</dd>
            </div>
            <div>
              <dt>Depth</dt>
              <dd>Level {node.level}</dd>
            </div>
            <div>
              <dt>Unmapped links</dt>
              <dd>{hidden}</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>{node.synthetic ? 'Added by analyst' : 'Graph backend'}</dd>
            </div>
          </dl>
        ) : (
          <React.Fragment>
            <p className="panel__label">Path from root</p>
            <ol className="chain">
              {chain.map(step => (
                <li key={step.id} style={{ '--accent': ENTITY[step.type].color }}>
                  <span className="chain__tag">{ENTITY[step.type].tag}</span>
                  <span className="chain__name">{step.name}</span>
                </li>
              ))}
            </ol>
            <p className="panel__label">Direct links ({links.length})</p>
            <ul className="links">
              {links.map(({ edge, direction, node: other }) => (
                <li key={edge.id}>
                  <span className="links__dir">{direction === 'out' ? '→' : '←'}</span>
                  <span className="links__rel">{edge.label}</span>
                  <span className="links__node" style={{ '--accent': ENTITY[other.type].color }}>
                    {other.name}
                  </span>
                </li>
              ))}
              {links.length === 0 && <li className="links__empty">No links on screen.</li>}
            </ul>
          </React.Fragment>
        )}
      </div>

      <footer className="panel__foot">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => onExpand(node)}
          disabled={hidden === 0}
        >
          {hidden > 0 ? `Expand ${hidden} link${hidden > 1 ? 's' : ''}` : 'Nothing to expand'}
        </button>

        <div className="addrow">
          <label className="addrow__label" htmlFor="addtype">
            Add linked node
          </label>
          <div className="addrow__controls">
            <select id="addtype" value={addType} onChange={e => setAddType(e.target.value)}>
              {ADDABLE.map(t => (
                <option key={t} value={t}>
                  {ENTITY[t].label}
                </option>
              ))}
            </select>
            <button type="button" className="btn" onClick={() => onAdd(node, addType)}>
              Add
            </button>
          </div>
        </div>

        <button
          type="button"
          className="btn btn--danger"
          onClick={() => onDelete(node)}
          disabled={isRoot}
        >
          {isRoot ? 'Root cannot be deleted' : 'Delete this node'}
        </button>
      </footer>
    </aside>
  )
}
