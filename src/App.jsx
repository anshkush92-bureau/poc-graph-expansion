import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ENGINES, ENGINE_KEYS } from './engines.js'
import { ENTITY, MAX_DEPTH, ROOT } from './graph/data.js'
import { hiddenCounts, isSelfEdge, layoutRadial } from './graph/ops.js'
import { synthGraph } from './graph/synth.js'
import { useGraph } from './graph/useGraph.js'
import { MODES, parseRoute, routeHash } from './route.js'
import HoverCard from './ui/HoverCard.jsx'
import SidePanel from './ui/SidePanel.jsx'
// The shape and line catalogs, read here only to label the two pickers. The
// renderer is handed the chosen *key* and looks the recipe up itself, so App
// never touches an ECharts option object.
import { EDGE_RULES, EDGE_STYLE_ORDER, SHAPE_SETS } from './echarts/symbols.js'

// The benchmark views, lazy for the same reason the engines are: they pull in
// d3-force and the layout worker, and the explore view needs neither.
const BenchView = React.lazy(() => import('./bench/BenchView.jsx'))
const Lab = React.lazy(() => import('./bench/Lab.jsx'))
const Compare = React.lazy(() => import('./bench/Compare.jsx'))

/**
 * Explore / Bench / Lab / Compare.
 *
 * Explore tiles as many panes as you select, because looking at them together is
 * the point. Bench mounts exactly one, because frame times and heap belong to
 * the tab rather than to a component and eight panes would make every row read
 * "this engine plus seven others". Lab mounts one too, but driven by hand rather
 * than by a script, and gets a URL per library. Compare only reads what the two
 * of them wrote.
 *
 * The mode lives in the hash (`route.js`), not in state — a page per library has
 * to be linkable, and has to survive the reload after a 50,000-node run took the
 * tab down with it.
 */

// Node count past which the incremental layout stops moving anything already on
// screen. Around 30 the circle is full enough that a re-balance shifts every
// node far enough to be worth watching, which is the point it stops being free.
const FREEZE_AT = 30

// Stress-dial bounds. 5,000 is past where several of these engines are usable,
// which is the point of having the dial go that far.
const MAX_NODES = 5000
const MAX_EDGES = 15000

/**
 * Columns to tile n panes into, indexed by n.
 *
 * A lookup rather than `repeat(auto-fit, minmax(…))`, which packs as many
 * columns as fit and leaves the remainder as dead cells — eight panes came out
 * five across with three underneath and a hole the size of two panes. These
 * counts divide evenly or nearly so, and keep each pane closer to landscape,
 * which is the shape a graph wants.
 */
const COLUMNS = [1, 1, 2, 3, 2, 3, 3, 4, 4]

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash))
  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  // Writing the hash is the only way modes change; the listener above turns that
  // back into state, so there is one source of truth rather than two that drift.
  const setMode = useCallback(key => {
    window.location.hash = routeHash(key)
  }, [])
  const mode = route.mode
  // A list, not a single key: the whole reason this exists is putting two or
  // three libraries side by side on the identical graph. Order is selection
  // order, so the panes do not jump around as engines are toggled.
  const [engines, setEngines] = useState(['echarts'])
  // Appearance choices, held here rather than inside the renderer so toggling a
  // pane off and back on does not silently reset them.
  const [shapeSet, setShapeSet] = useState('type')
  const [edgeStyle, setEdgeStyle] = useState('arrow')
  // Edges the analyst has restyled by hand: edge id -> style key. Beats the
  // picker for those edges only, so "everything solid except this one dashed
  // path" needs no rule written for it.
  const [edgeOverrides, setEdgeOverrides] = useState(new Map())
  const { graph, isExpanded, isPending, statusVersion, expand, addNode, deleteNode, reset, load } =
    useGraph()

  // The stress dial. Held as text-free numbers and only applied on Build, so
  // dragging a slider does not rebuild a 5,000-node graph on every pixel.
  // 120 rather than something rounder: a radial tree's radius grows with the
  // node count, so by ~500 the graph is 14,000px across and the panes that
  // scale their symbols with zoom render it as dust. 120 is legible in all
  // eight at once, and it is under the ceiling the v-network-graph pane refuses
  // past. Drag it up from there to find where each engine gives out.
  const [wantNodes, setWantNodes] = useState(120)
  const [wantEdges, setWantEdges] = useState(180)
  const [incremental, setIncremental] = useState(true)

  const [hover, setHover] = useState(null) // { id, at }
  const [selected, setSelected] = useState(null) // { id, tab }
  const closeTimer = useRef(null)

  // Milliseconds each pane last spent turning the graph into its own elements.
  // Not a frame rate — it is the update cost, which is the number that actually
  // separates these libraries once the graph is large.
  const [stats, setStats] = useState({})
  const onStats = useMemo(() => {
    const out = {}
    // One stable callback per engine, created once. A fresh identity would
    // break each renderer's memo and re-run its update effect on every render.
    ENGINE_KEYS.forEach(key => {
      out[key] = ms =>
        setStats(prev => (prev[key] === ms ? prev : Object.assign({}, prev, { [key]: ms })))
    })
    return out
  }, [])

  const byId = useMemo(() => new Map(graph.nodes.map(n => [n.id, n])), [graph])
  const hidden = useMemo(() => hiddenCounts(graph), [graph])

  // Node coordinates, computed once here rather than inside each renderer.
  //
  // Two reasons it lives here. The layout is incremental — it is handed its own
  // last output so that expanding a node places the newcomers and leaves
  // everything else exactly where it is — and that history has to outlive a
  // renderer, which is remounted whenever its pane is toggled. Keeping the cache
  // in a renderer would let two panes drift into different arrangements of the
  // same graph, which is the one thing this comparison cannot afford. Second, it
  // is the same numbers for every engine, so computing them per pane was waste.
  const lastPositions = useRef(null)
  const positions = useMemo(() => {
    // Under the threshold, re-balance the whole circle: it is the tighter
    // arrangement, and with few enough nodes the shuffle reads as the graph
    // settling rather than as a reload. Over it, freeze — a frozen wedge cannot
    // rebalance, so it spreads, but by then a rearrangement is disorienting and
    // the extra width is the cheaper price.
    const prev = incremental && graph.nodes.length > FREEZE_AT ? lastPositions.current : null
    lastPositions.current = layoutRadial(graph, prev)
    return lastPositions.current
  }, [graph, incremental])

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

  const onNodeClick = useCallback(
    id => {
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
    },
    [byId, expand]
  )

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

  const handleDelete = useCallback(
    node => {
      if (deleteNode(node.id)) {
        setSelected(null)
        setHover(null)
      }
    },
    [deleteNode]
  )

  const handleAdd = useCallback(
    (parent, type) => {
      addNode(parent, type)
    },
    [addNode]
  )

  // Toggling a pane. The last one cannot be turned off — an empty stage is a
  // broken screen, not a valid selection.
  const toggleEngine = useCallback(key => {
    setEngines(prev => {
      if (!prev.includes(key)) return prev.concat(key)
      return prev.length > 1 ? prev.filter(k => k !== key) : prev
    })
    setHover(null)
  }, [])

  // Dropping the position history is part of both of these: the layout is only
  // incremental against a graph it has seen, and a graph it has not deserves the
  // cold pass, which balances the whole circle.
  const clearView = () => {
    lastPositions.current = null
    setSelected(null)
    setHover(null)
    setStats({})
  }

  const build = useCallback(() => {
    clearView()
    setEdgeOverrides(new Map())
    load(synthGraph(wantNodes, wantEdges))
  }, [load, wantNodes, wantEdges])

  const handleReset = useCallback(() => {
    clearView()
    setEdgeOverrides(new Map())
    reset()
  }, [reset])

  const hoverNode = hover ? byId.get(hover.id) : null
  const selectedNode = selected ? byId.get(selected.id) : null

  // Self-edges are not a step outward, so they don't count as a mapped link.
  const shownFor = node =>
    graph.edges.filter(e => !isSelfEdge(e) && e.source === node.id && byId.has(e.target)).length

  const deepest = graph.nodes.reduce((max, n) => Math.max(max, n.level), 0)
  const showsEcharts = engines.includes('echarts')

  if (mode !== 'explore') {
    return (
      <div className="shell">
        <header className="masthead">
          <div className="masthead__brand">
            <p className="masthead__eyebrow">Graph rendering bake-off · React 16.14</p>
            <h1 className="masthead__title">Identity graph walker</h1>
          </div>
          <ModeTabs mode={mode} onMode={setMode} />
        </header>
        <main className="stage stage--bench">
          <Suspense fallback={<p className="pane__wait">loading the bench…</p>}>
            {mode === 'bench' && <BenchView />}
            {mode === 'lab' && <Lab engine={route.arg} />}
            {mode === 'compare' && <Compare />}
          </Suspense>
        </main>
      </div>
    )
  }

  return (
    <div className={'shell' + (selectedNode ? ' shell--panelled' : '')}>
      <header className="masthead">
        <div className="masthead__brand">
          <p className="masthead__eyebrow">Graph rendering bake-off · React 16.14</p>
          <h1 className="masthead__title">Identity graph walker</h1>
        </div>

        <ModeTabs mode={mode} onMode={setMode} />

        <div className="engines" role="group" aria-label="Rendering engines">
          {ENGINE_KEYS.map(key => (
            <button
              key={key}
              type="button"
              aria-pressed={engines.includes(key)}
              title={ENGINES[key].note}
              className={'engines__tab' + (engines.includes(key) ? ' is-on' : '')}
              onClick={() => toggleEngine(key)}
            >
              {ENGINES[key].name}
            </button>
          ))}
        </div>
      </header>

      <div className="strip">
        <dl className="counts">
          <div>
            <dt>nodes</dt>
            <dd>{graph.nodes.length}</dd>
          </div>
          <div>
            <dt>links</dt>
            <dd>{graph.edges.length}</dd>
          </div>
          <div>
            <dt>depth</dt>
            <dd>
              {deepest}
              <span className="counts__of">/{MAX_DEPTH}</span>
            </dd>
          </div>
          <div>
            <dt>panes</dt>
            <dd>{engines.length}</dd>
          </div>
        </dl>

        <div className="strip__tools">
          {/* ECharts only. The other engines take one node shape and one line
              style, so offering these pickers alongside them would be controls
              that do nothing to most of the screen. */}
          {showsEcharts && (
            <React.Fragment>
              <label className="jump">
                <span>Nodes</span>
                <select value={shapeSet} onChange={e => setShapeSet(e.target.value)}>
                  {Object.keys(SHAPE_SETS).map(key => (
                    <option key={key} value={key}>
                      {SHAPE_SETS[key].label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="jump">
                <span>Edges</span>
                <select value={edgeStyle} onChange={e => setEdgeStyle(e.target.value)}>
                  {Object.keys(EDGE_RULES).map(key => (
                    <option key={key} value={key}>
                      {EDGE_RULES[key].label}
                    </option>
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
              onChange={e =>
                setSelected(e.target.value ? { id: e.target.value, tab: 'details' } : null)
              }
            >
              <option value="">Pick a node…</option>
              {/* Capped: a native select with 5,000 options locks the tab open.
                  Past that the hover card is the way in. */}
              {graph.nodes.slice(0, 300).map(n => (
                <option key={n.id} value={n.id}>
                  {ENTITY[n.type].tag} · {n.name}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* The stress dial. Expansion grows the graph a few nodes at a time, which
          never reaches the sizes these libraries actually differ at. */}
      <div className="rig">
        <Dial label="Nodes" max={MAX_NODES} value={wantNodes} onChange={setWantNodes} />
        <Dial label="Edges" max={MAX_EDGES} value={wantEdges} onChange={setWantEdges} />
        <button type="button" className="btn btn--primary" onClick={build}>
          Build graph
        </button>

        <label className="rig__check">
          <input
            type="checkbox"
            checked={incremental}
            onChange={e => setIncremental(e.target.checked)}
          />
          <span>Incremental layout</span>
        </label>

        <p className="rig__note">
          {incremental
            ? 'Newcomers are placed into free space; nothing already on screen moves. Costs O(n²) — slow past a few hundred nodes.'
            : 'The whole circle re-balances on every change. Tighter and much cheaper at scale, but an expansion reads as a reload.'}
        </p>
      </div>

      <main className="stage">
        <div
          className="panes"
          style={{ gridTemplateColumns: `repeat(${COLUMNS[engines.length] || 4}, minmax(0, 1fr))` }}
        >
          {engines.map(key => {
            const { name, lib, Component } = ENGINES[key]
            return (
              <section className="pane" key={key}>
                <header className="pane__bar">
                  <b className="pane__name">{name}</b>
                  <span className="pane__lib">{lib}</span>
                  <span className="pane__stat">
                    {stats[key] == null ? '—' : `${stats[key]} ms`}
                  </span>
                  {engines.length > 1 && (
                    <button
                      type="button"
                      className="pane__drop"
                      aria-label={`Close ${name}`}
                      onClick={() => toggleEngine(key)}
                    >
                      ×
                    </button>
                  )}
                </header>
                <div className="pane__body">
                  {/* Each engine is a lazy chunk, so selecting one pane
                      downloads one library and nothing else. */}
                  <Suspense fallback={<p className="pane__wait">loading {lib}…</p>}>
                    <Component
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
                      onStat={onStats[key]}
                    />
                  </Suspense>
                </div>
              </section>
            )
          })}
        </div>

        <ul className="legend">
          {Object.keys(ENTITY).map(t => (
            <li key={t} style={{ '--accent': ENTITY[t].color }}>
              {ENTITY[t].label}
            </li>
          ))}
          <li className="legend__rule">
            Bright = links still hidden. Click a node to expand a level
            {showsEcharts && ', or an edge to restyle just that edge'}. Every pane draws the same
            graph at the same coordinates — only the drawing differs.
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
          onOpen={tab => {
            setSelected({ id: hoverNode.id, tab })
            setHover(null)
          }}
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

function ModeTabs({ mode, onMode }) {
  return (
    <div className="modes" role="group" aria-label="View">
      {MODES.map(([key, label]) => (
        <button
          key={key}
          type="button"
          aria-pressed={mode === key}
          className={'modes__tab' + (mode === key ? ' is-on' : '')}
          onClick={() => onMode(key)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/**
 * A slider paired with the number it is setting.
 *
 * Both are native inputs on purpose. A range alone cannot be set to an exact
 * value, which is the whole point when the number is a benchmark parameter, and
 * a number box alone gives no feel for the scale. `<input type=range>` and
 * `<input type=number>` together need no library and no state of their own.
 */
function Dial({ label, max, value, onChange }) {
  const clamp = raw => Math.max(0, Math.min(max, Number(raw) || 0))
  return (
    <label className="dial">
      <span className="dial__label">{label}</span>
      <input
        className="dial__slide"
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={e => onChange(clamp(e.target.value))}
      />
      <input
        className="dial__value"
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={e => onChange(clamp(e.target.value))}
      />
    </label>
  )
}
