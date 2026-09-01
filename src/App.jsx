import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import EChartsGraph from './echarts/EChartsGraph.jsx'
import FusionGraph from './fusion/FusionGraph.jsx'
import { ENTITY, MAX_DEPTH, ROOT } from './graph/data.js'
import { hiddenCounts, isSelfEdge, layoutRadial } from './graph/ops.js'
import { useGraph } from './graph/useGraph.js'
import HoverCard from './ui/HoverCard.jsx'
import SidePanel from './ui/SidePanel.jsx'
// The shape and line catalogs, read here only to label the two pickers. The
// renderer is handed the chosen *key* and looks the recipe up itself, so App
// never touches an ECharts option object.
import { EDGE_RULES, EDGE_STYLE_ORDER, SHAPE_SETS } from './echarts/symbols.js'

const ENGINES = {
  echarts: { name: 'Apache ECharts', note: 'echarts 6.1 · graph series · canvas · roam + drag', Component: EChartsGraph },
  fusion: { name: 'FusionCharts', note: 'fusioncharts 4.2 · PowerCharts dragnode · SVG · drag only', Component: FusionGraph }
}

// Node count past which the layout stops moving anything already on screen.
// Around 30 the circle is full enough that a re-balance shifts every node far
// enough to be worth watching, which is the point it stops being free.
const FREEZE_AT = 30

export default function App() {
  const [engine, setEngine] = useState('echarts')
  // Appearance choices, held here rather than inside the renderer so switching
  // engine tabs and back does not silently reset them.
  const [shapeSet, setShapeSet] = useState('type')
  const [edgeStyle, setEdgeStyle] = useState('arrow')
  // Edges the analyst has restyled by hand: edge id -> style key. Beats the
  // picker for those edges only, so "everything solid except this one dashed
  // path" needs no rule written for it.
  const [edgeOverrides, setEdgeOverrides] = useState(new Map())
  const { graph, isExpanded, isPending, statusVersion, expand, addNode, deleteNode, reset } = useGraph()

  const [hover, setHover] = useState(null)   // { id, at }
  const [selected, setSelected] = useState(null) // { id, tab }
  const closeTimer = useRef(null)

  const byId = useMemo(() => new Map(graph.nodes.map(n => [n.id, n])), [graph])
  const hidden = useMemo(() => hiddenCounts(graph), [graph])

  // Node coordinates, computed once here rather than inside each renderer.
  //
  // Two reasons it moved up. The layout is now incremental — it is handed its
  // own last output so that expanding a node places the newcomers and leaves
  // everything else exactly where it is — and that history has to outlive a
  // renderer, which is remounted on every engine switch (`key={engine}`).
  // Keeping the cache in the renderer would let the two tabs drift into
  // different arrangements of the same graph, which is the one thing this
  // comparison cannot afford. Second, it is the same numbers either way, so
  // computing them twice was always waste.
  const lastPositions = useRef(null)
  const positions = useMemo(() => {
    // Under the threshold, re-balance the whole circle: it is the tighter
    // arrangement, and with few enough nodes the shuffle reads as the graph
    // settling rather than as a reload. Over it, freeze — a frozen wedge cannot
    // rebalance, so it spreads (2200px vs 1400px at 59 nodes, and the gap
    // widens), but by then a rearrangement is disorienting and the extra width
    // is the cheaper price. One visible jolt on the expansion that crosses.
    const prev = graph.nodes.length > FREEZE_AT ? lastPositions.current : null
    lastPositions.current = layoutRadial(graph, prev)
    return lastPositions.current
  }, [graph])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  // A hover card with buttons in it must survive the pointer travelling from
  // the node to the card, so closing is always on a short delay.
  const onNodeHover = useCallback((id, at) => {
    clearTimeout(closeTimer.current)
    if (!id) {
      closeTimer.current = setTimeout(() => setHover(null), 180)
      return
    }
    setHover({ id, at })
  }, [])

  const holdCard = useCallback(() => clearTimeout(closeTimer.current), [])
  const releaseCard = useCallback(() => {
    closeTimer.current = setTimeout(() => setHover(null), 180)
  }, [])

  const onNodeClick = useCallback(id => {
    const node = byId.get(id)
    if (!node) return
    expand(node)
    // The card has to go, and not on the usual delay.
    //
    // It is a real element sitting down-right of the node, so it covers the
    // nodes there. Left open after a click it swallows the next one: the
    // pointer travels from the expanded node onto the card, the renderer under
    // it never sees an enter, and the node beneath is simply unclickable. The
    // card is also stale the moment the graph grows.
    clearTimeout(closeTimer.current)
    setHover(null)
  }, [byId, expand])

  // Clicking an edge walks it through the style list, then off the end back to
  // whatever the picker says. No extra UI: the graph is the control surface, and
  // an edge has nothing else a click could mean.
  const onEdgeClick = useCallback(id => {
    setEdgeOverrides(prev => {
      const next = new Map(prev)
      const at = EDGE_STYLE_ORDER.indexOf(prev.get(id))
      // -1 (not overridden) lands on index 0; the last style deletes the entry.
      if (at + 1 >= EDGE_STYLE_ORDER.length) next.delete(id)
      else next.set(id, EDGE_STYLE_ORDER[at + 1])
      return next
    })
  }, [])

  const onBackgroundClick = useCallback(() => {
    clearTimeout(closeTimer.current)
    setHover(null)
  }, [])

  const handleDelete = useCallback(node => {
    if (deleteNode(node.id)) {
      setSelected(null)
      setHover(null)
    }
  }, [deleteNode])

  const handleAdd = useCallback((parent, type) => {
    addNode(parent, type)
  }, [addNode])

  const hoverNode = hover ? byId.get(hover.id) : null
  const selectedNode = selected ? byId.get(selected.id) : null

  // Self-edges are not a step outward, so they don't count as a mapped link.
  const shownFor = node =>
    graph.edges.filter(e => !isSelfEdge(e) && e.source === node.id && byId.has(e.target)).length

  const { Component, name, note } = ENGINES[engine]
  const deepest = graph.nodes.reduce((max, n) => Math.max(max, n.level), 0)

  return (
    <div className={'shell' + (selectedNode ? ' shell--panelled' : '')}>
      <header className="masthead">
        <div className="masthead__brand">
          <p className="masthead__eyebrow">Graph expansion POC · React 16.14</p>
          <h1 className="masthead__title">Identity graph walker</h1>
        </div>

        <div className="engines" role="tablist" aria-label="Rendering engine">
          {Object.keys(ENGINES).map(key => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={engine === key}
              className={'engines__tab' + (engine === key ? ' is-on' : '')}
              onClick={() => { setEngine(key); setHover(null) }}
            >
              {ENGINES[key].name}
            </button>
          ))}
        </div>
      </header>

      <div className="strip">
        <p className="strip__note">{note}</p>
        <dl className="counts">
          <div><dt>nodes</dt><dd>{graph.nodes.length}</dd></div>
          <div><dt>links</dt><dd>{graph.edges.length}</dd></div>
          <div><dt>depth</dt><dd>{deepest}<span className="counts__of">/{MAX_DEPTH}</span></dd></div>
        </dl>
        <div className="strip__tools">
          {/* ECharts only. FusionCharts' dragnode chart draws one node shape,
              full stop, so offering the picker on that tab would be a control
              that does nothing. */}
          {engine === 'echarts' && (
            <React.Fragment>
              <label className="jump">
                <span>Nodes</span>
                <select value={shapeSet} onChange={e => setShapeSet(e.target.value)}>
                  {Object.keys(SHAPE_SETS).map(key => (
                    <option key={key} value={key}>{SHAPE_SETS[key].label}</option>
                  ))}
                </select>
              </label>
              <label className="jump">
                <span>Edges</span>
                <select value={edgeStyle} onChange={e => setEdgeStyle(e.target.value)}>
                  {Object.keys(EDGE_RULES).map(key => (
                    <option key={key} value={key}>{EDGE_RULES[key].label}</option>
                  ))}
                </select>
              </label>
              {/* Only worth a control once there is something to clear — an
                  always-visible button that usually does nothing is noise. */}
              {edgeOverrides.size > 0 && (
                <button type="button" className="btn" onClick={() => setEdgeOverrides(new Map())}>
                  Clear {edgeOverrides.size} edge {edgeOverrides.size === 1 ? 'style' : 'styles'}
                </button>
              )}
            </React.Fragment>
          )}
          <label className="jump">
            <span>Inspect</span>
            <select
              value={selected ? selected.id : ''}
              onChange={e => setSelected(e.target.value ? { id: e.target.value, tab: 'details' } : null)}
            >
              <option value="">Pick a node…</option>
              {graph.nodes.map(n => (
                <option key={n.id} value={n.id}>{ENTITY[n.type].tag} · {n.name}</option>
              ))}
            </select>
          </label>
          {/* Dropping the position history is part of the reset: the layout is
              only incremental against a graph it has seen, and a fresh root
              deserves the cold pass, which balances the whole circle. */}
          <button type="button" className="btn" onClick={() => { lastPositions.current = null; reset(); setSelected(null); setHover(null); setEdgeOverrides(new Map()) }}>Reset</button>
        </div>
      </div>

      <main className="stage">
        <Component
          key={engine}
          graph={graph}
          positions={positions}
          hidden={hidden}
          isExpanded={isExpanded}
          isPending={isPending}
          statusVersion={statusVersion}
          shapeSet={shapeSet}
          edgeStyle={edgeStyle}
          edgeOverrides={edgeOverrides}
          onNodeClick={onNodeClick}
          onNodeHover={onNodeHover}
          onEdgeClick={onEdgeClick}
          onBackgroundClick={onBackgroundClick}
        />

        <ul className="legend">
          {Object.keys(ENTITY).map(t => (
            <li key={t} style={{ '--accent': ENTITY[t].color }}>{ENTITY[t].label}</li>
          ))}
          <li className="legend__rule">
            Bright = links still hidden. Click a node to expand a level
            {engine === 'echarts' && ', or an edge to restyle just that edge'}.
          </li>
        </ul>
      </main>

      {hoverNode && (
        <HoverCard
          node={hoverNode}
          at={hover.at}
          shown={shownFor(hoverNode)}
          hidden={hidden.get(hoverNode.id) || 0}
          explored={isExpanded(hoverNode.id)}
          onHold={holdCard}
          onRelease={releaseCard}
          onOpen={tab => { setSelected({ id: hoverNode.id, tab }); setHover(null) }}
        />
      )}

      {selectedNode && (
        <SidePanel
          graph={graph}
          node={selectedNode}
          tab={selected.tab}
          hidden={hidden.get(selectedNode.id) || 0}
          isRoot={selectedNode.id === ROOT.id}
          onTab={tab => setSelected({ id: selectedNode.id, tab })}
          onClose={() => setSelected(null)}
          onExpand={expand}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
