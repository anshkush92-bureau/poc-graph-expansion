import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CAP_ROWS, ENGINES, ENGINE_KEYS } from '../engines.js'
import { layoutRadial } from '../graph/ops.ts'
import { synthGraph } from '../graph/synth.ts'
import { routeHash } from '../route.js'
import { useHud } from './hud.js'
import { optimise } from './optimize.js'
import { runLayout } from './runLayout.js'
import { SCENARIOS, defaultKnobs, prune, sprout } from './scenarios.js'
import { loadResults, saveResult } from './store.js'
import { Knob, ResultTable, format } from './table.jsx'
import { runScenario, usePane } from './usePane.js'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE LAB — one library, its own URL, every control exposed
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The Bench answers "which of these eight is fastest at X" by running the same
 * script over all of them. That is the right instrument for a comparison and the
 * wrong one for the question underneath it, which is "what happens to *this*
 * library when I do the thing my app actually does".
 *
 * So: one engine per page at `#/lab/<key>`, and every dial the scenarios turn
 * behind the scenes turned by hand instead —
 *
 *   graph size      the hairball, at whatever size you want to find the wall at
 *   layout + worker the physics pass, on the UI thread or off it, live
 *   LOD + culling   the two optimisations, toggled while you watch the gauge
 *   streaming       churn at a fixed rate, running until you stop it
 *   hover debounce  the event storm, with and without the debounce
 *
 * The gauge along the top is the same arithmetic the scenarios report (see
 * `hud.js`), sampled continuously rather than over a scripted window. It stops
 * while a scripted scenario runs: that scenario's row is the record, and two
 * disagreeing readouts on one screen is an invitation to quote the wrong one.
 *
 * Nothing here measures anything the Bench does not. It is the same probes, the
 * same optimisations and the same scenarios — driven by a person.
 */

const RATE_TICK_MS = 100

export default function Lab({ engine }) {
  if (!engine || !ENGINES[engine]) return <LabIndex />
  return <LabPane key={engine} engineKey={engine} />
}

/** The landing page: pick a library, get its own URL. */
function LabIndex() {
  return (
    <div className="lab">
      <p className="bench__blurb">
        One page per library, each with the whole rig exposed: graph size, force layout on or off
        the main thread, level of detail, viewport culling, live streaming and hover debounce — plus
        a live frame/heap gauge and the seven scripted scenarios scoped to that engine alone. Every
        page is its own URL, so a run that takes the tab down survives a reload.
      </p>
      <div className="lab__cards">
        {ENGINE_KEYS.map(key => {
          const e = ENGINES[key]
          return (
            <a className="lab__card" key={key} href={routeHash('lab', key)}>
              <b>{e.name}</b>
              <span className="lab__card-lib">{e.lib}</span>
              <span
                className={'lab__surface lab__surface--' + e.surface.split('/')[0].split('+')[0]}
              >
                {e.surface}
              </span>
              <span className="lab__card-note">{e.note}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

// Knob descriptors for the manual controls. Built here rather than hand-rolling
// a second slider component: `Knob` already clamps, already pairs the range with
// an exact number box, and a control that clamps differently in two places
// silently produces two different runs.
//
// Every one of these bottoms out at zero, matching the explore view's dial. A
// floor of 100 was a guess at what is worth measuring, and it is the wrong guess
// twice over: the interesting question at the bottom is what an *empty* pane
// costs — that is the baseline every other reading is relative to — and a knob
// that cannot reach zero also cannot be used to turn the thing off.
const num = (label, min, max, step) => ({ type: 'number', label, min, max, step })
const SOLVER = { type: 'choice', label: 'Solver', options: ['radial', 'force'] }

function LabPane({ engineKey }) {
  const engine = ENGINES[engineKey]
  const Renderer = engine.Component
  const {
    data,
    paneRef,
    paneProps,
    show,
    push,
    makeCtx,
    begin,
    cancel,
    lastStat,
    viewport,
    hoverCount,
    resetHover,
    setHoverDebounce
  } = usePane()

  // ── Manual knobs ─────────────────────────────────────────────────────────
  // `initial` is what Build makes; expansion adds to it. Kept apart because the
  // total on screen is a result, not a setting — "5,000 nodes" means something
  // different when 2,000 of them arrived a click at a time.
  // Same 1,000 / 1,500 the scripted scenarios start from, so a hand-driven run
  // and a scripted row are read against the same graph.
  const [initial, setInitial] = useState(1000)
  const [edges, setEdges] = useState(1500)
  const [expandBy, setExpandBy] = useState(25)
  const [renderer, setRenderer] = useState(engine.renderers[0])
  const [layoutMode, setLayoutMode] = useState('radial')
  const [worker, setWorker] = useState(false)
  const [alphaMin, setAlphaMin] = useState(0.02)
  const [lod, setLod] = useState(false)
  const [cull, setCull] = useState(false)
  const [fraction, setFraction] = useState(0.5)
  const [debounce, setDebounce] = useState(0)
  const [streaming, setStreaming] = useState(false)
  const [rate, setRate] = useState(500)

  const [busy, setBusy] = useState(false)
  const [report, setReport] = useState(null)
  // Bumped on every expansion, because a renderer's data effect keys off it to
  // re-read the explored/pending status of nodes it has already drawn.
  const [statusVersion, setStatusVersion] = useState(0)

  // The last *full* graph built, so a re-layout does not rebuild it — and so the
  // stream has something to churn that is not whatever the cull left behind.
  const fullRef = useRef(null)
  // Its positions, kept so an expansion can be laid out *against* them.
  const posRef = useRef(null)
  const seqRef = useRef(0)
  const expandedRef = useRef(new Set())
  // What the last Build actually made, and what it was asked for, so the split
  // below stays honest while the sliders are dragged to numbers nothing has been
  // built at yet.
  const builtRef = useRef(0)
  const askedRef = useRef(0)
  // The click guard. `busy` state cannot do this job: it is read through a
  // closure that a stable callback froze on the first render.
  const busyRef = useRef(false)
  const dataRef = useRef(data)
  dataRef.current = data

  // Knobs the expansion handler reads, mirrored into a ref so that handler can
  // keep one identity for the life of the page — a fresh `onNodeClick` on every
  // gauge tick would re-render the engine under test twice a second.
  const live = useRef({})
  live.current = { expandBy, lod, cull, fraction }

  // ── Scripted runs, scoped to this engine ─────────────────────────────────
  const [scenarioKey, setScenarioKey] = useState(SCENARIOS[0].key)
  const scenario = useMemo(() => SCENARIOS.find(s => s.key === scenarioKey), [scenarioKey])
  const [knobState, setKnobState] = useState({
    key: SCENARIOS[0].key,
    values: defaultKnobs(SCENARIOS[0])
  })
  const knobs = knobState.key === scenarioKey ? knobState.values : defaultKnobs(scenario)
  const setKnob = useCallback(
    (key, value) => {
      setKnobState(prev => ({
        key: scenarioKey,
        values: Object.assign({}, prev.key === scenarioKey ? prev.values : defaultKnobs(scenario), {
          [key]: value
        })
      }))
    },
    [scenario, scenarioKey]
  )
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(loadResults)

  // The gauge stands down whenever something else is doing the measuring.
  const hud = useHud(!running && !busy)

  useEffect(() => {
    setHoverDebounce(debounce)
  }, [debounce, setHoverDebounce])

  /**
   * Lay a graph out, cut it down, put it on screen, and report every leg of it
   * separately.
   *
   * The split is the point: `solveMs` is the physics, `transferMs` is what the
   * worker boundary charged for removing the freeze, `updateMs` is what the
   * engine spent turning the graph into its own elements, and `ttfrMs` is what
   * you actually waited. One total would hide which of the four is your problem.
   */
  const apply = useCallback(
    async (full, buildMs) => {
      busyRef.current = true
      setBusy(true)
      try {
        const laid = await runLayout(full, { mode: layoutMode, worker, alphaMin })
        // Positions come from the whole graph, then the cut is applied — laying
        // out only the survivors would rearrange them, and you would be looking at
        // a different graph rather than a cropped one.
        const { graph, drawn } = optimise(full, laid.positions, { lod, cull, fraction })
        posRef.current = laid.positions
        const handed = performance.now()
        await show(graph, laid.positions)
        setReport({
          nodes: full.nodes.length,
          edges: full.edges.length,
          buildMs: buildMs == null ? null : buildMs,
          layout: layoutMode,
          where: worker ? 'worker' : 'main',
          solveMs: laid.solveMs,
          transferMs: laid.transferMs,
          ticks: laid.ticks,
          converged: laid.converged,
          drawnNodes: drawn.nodes,
          drawnEdges: drawn.edges,
          kept: Math.round((1000 * drawn.nodes) / Math.max(1, full.nodes.length)) / 10 + '%',
          updateMs: lastStat(),
          ttfrMs: Math.round(performance.now() - handed)
        })
      } finally {
        busyRef.current = false
        setBusy(false)
      }
    },
    [alphaMin, cull, fraction, lastStat, layoutMode, lod, show, worker]
  )

  const build = useCallback(() => {
    setStreaming(false)
    seqRef.current = 0
    expandedRef.current = new Set()
    setStatusVersion(v => v + 1)
    const t0 = performance.now()
    const full = synthGraph(initial, edges)
    const buildMs = Math.round(performance.now() - t0)
    fullRef.current = full
    builtRef.current = full.nodes.length
    askedRef.current = edges
    return apply(full, buildMs)
  }, [apply, edges, initial])

  const redraw = useCallback(() => {
    if (!fullRef.current) return build()
    return apply(fullRef.current, null)
  }, [apply, build])

  // ── Expansion ────────────────────────────────────────────────────────────
  //
  // Click a node, get `expandBy` neighbours hung off it. Deliberately *not*
  // routed through `apply`: an expansion is an interaction, and re-solving the
  // whole layout on every click would both re-arrange the screen — which reads
  // as a reload rather than as an expansion — and bury the number you came for
  // under a full force pass. So it uses the incremental radial layout, the same
  // one the explore view uses, which places the newcomers and moves nothing
  // already on screen.
  //
  // One identity for the life of the page (every mutable input is read through
  // `live` or a ref), so the engine under test is never re-rendered just because
  // a slider moved.
  const expandFrom = useCallback(
    async id => {
      const graph = fullRef.current
      if (!graph || busyRef.current) return
      // Re-expanding is a no-op rather than a second helping — the same rule
      // `useGraph` enforces, and without it a double-click doubles the level.
      if (expandedRef.current.has(id)) return
      const node = graph.nodes.find(n => n.id === id)
      if (!node) return

      const { expandBy: by, lod: l, cull: c, fraction: f } = live.current
      if (by < 1) return

      busyRef.current = true
      setBusy(true)
      try {
        const t0 = performance.now()
        const grown = sprout(graph, by, seqRef.current, node)
        seqRef.current += by
        expandedRef.current.add(id)
        const positions = layoutRadial(grown, posRef.current)
        const expandMs = Math.round(performance.now() - t0)
        fullRef.current = grown
        posRef.current = positions
        setStatusVersion(v => v + 1)

        const { graph: cut, drawn } = optimise(grown, positions, { lod: l, cull: c, fraction: f })
        const handed = performance.now()
        await show(cut, positions)
        setReport({
          nodes: grown.nodes.length,
          edges: grown.edges.length,
          expandedFrom: id,
          addedNodes: by,
          expandMs,
          drawnNodes: drawn.nodes,
          drawnEdges: drawn.edges,
          updateMs: lastStat(),
          ttfrMs: Math.round(performance.now() - handed)
        })
      } finally {
        busyRef.current = false
        setBusy(false)
      }
    },
    [lastStat, show]
  )

  // Stable too, and read through the ref rather than closed over: renderers
  // memoise on it, and a fresh function each render would re-run their data
  // effect — a full re-derive of the scene — on every gauge tick.
  const isExpanded = useCallback(id => expandedRef.current.has(id), [])

  const zoom = useCallback(
    what => {
      const handle = viewport()
      if (!handle) return
      if (what === 'fit') handle.fit()
      else handle.zoomBy(what)
    },
    [viewport]
  )

  // ── The stream ───────────────────────────────────────────────────────────
  //
  // Same mechanics as the scripted streaming scenario: grow and shrink by the
  // same amount so the node count stays flat, push on a timer rather than after
  // each paint so a pane that cannot keep up falls behind visibly instead of
  // quietly slowing the feed.
  useEffect(() => {
    const perTick = Math.round(rate / (1000 / RATE_TICK_MS))
    // A rate of zero pushes nothing rather than being rounded up to one node a
    // tick. The gauge then reads the idle cost of holding this graph, which is
    // the baseline any churn number is only meaningful against.
    if (!streaming || perTick < 1) return undefined
    let graph = fullRef.current || dataRef.current.graph
    let positions = posRef.current || dataRef.current.positions
    let seq = 0

    const timer = setInterval(() => {
      graph = prune(sprout(graph, perTick, seq), perTick)
      seq += perTick
      positions = layoutRadial(graph, positions)
      fullRef.current = graph
      posRef.current = positions
      push(optimise(graph, positions, { lod, cull, fraction }).graph, positions)
    }, RATE_TICK_MS)

    return () => clearInterval(timer)
  }, [cull, fraction, lod, push, rate, streaming])

  const runScripted = useCallback(async () => {
    if (running) return
    setStreaming(false)
    // The scenario owns the pane's data from here, so the hand-built graph is no
    // longer what is on screen. Dropping it is what keeps a click afterwards
    // from silently swapping the scenario's graph back out for this one — the
    // ids collide, because `synthGraph` is deterministic.
    fullRef.current = null
    posRef.current = null
    begin()
    setRunning(true)
    try {
      const row = await runScenario(engineKey, scenario, knobs, makeCtx(knobs))
      setResults(saveResult(row))
    } finally {
      // The hover scenario owns the debounce while it runs and leaves it at 0.
      // Put the slider's value back, or the control lies about what is in force.
      setHoverDebounce(debounce)
      setRunning(false)
    }
  }, [begin, debounce, engineKey, knobs, makeCtx, running, scenario, setHoverDebounce])

  const rows = useMemo(
    () =>
      Object.keys(results)
        .map(k => results[k])
        .filter(r => r.engine === engineKey && r.scenario === scenarioKey),
    [engineKey, results, scenarioKey]
  )

  const locked = busy || running
  const built = builtRef.current
  const grown = Math.max(0, (fullRef.current ? fullRef.current.nodes.length : 0) - built)
  // Edges are reported the same way, and for the same reason: the dial is a
  // target the spanning tree can overrule, so the only honest number is the one
  // that got built. `floored` is the gap, shown only when there is one.
  const liveEdges = fullRef.current ? fullRef.current.edges.length : 0
  const floored = built ? Math.max(0, built - 1 - askedRef.current) : 0

  return (
    <div className="lab">
      <div className="lab__nav">
        <a className="btn" href={routeHash('lab')}>
          ← All libraries
        </a>
        {ENGINE_KEYS.map(key => (
          <a
            key={key}
            className={'engines__tab' + (key === engineKey ? ' is-on' : '')}
            href={routeHash('lab', key)}
          >
            {ENGINES[key].name}
          </a>
        ))}
      </div>

      <header className="lab__head">
        <h2>{engine.name}</h2>
        <span className="pane__lib">{engine.lib}</span>
        <span
          className={'lab__surface lab__surface--' + engine.surface.split('/')[0].split('+')[0]}
        >
          {engine.surface}
        </span>
        <p className="lab__note">{engine.note}</p>
      </header>

      <div className="lab__grid">
        <Group
          title="Graph"
          hint="Build makes a spanning tree over `initial nodes` first, then adds cross-links until it reaches `edges` — so the edge dial is a target with a floor at initial − 1, and asking for fewer changes nothing. There is no total-nodes dial because the total is a result: what Build made, plus everything you have clicked into. Drag the initial count up until this engine gives out — that number is the finding."
        >
          <Knob
            knob={num('Initial nodes', 0, 50000, 1)}
            value={initial}
            disabled={locked}
            onChange={setInitial}
          />
          <Knob
            knob={num('Edges', 0, 150000, 1)}
            value={edges}
            disabled={locked}
            onChange={setEdges}
          />
          <Knob
            knob={num('Expand by (per click)', 0, 2000, 1)}
            value={expandBy}
            disabled={locked}
            onChange={setExpandBy}
          />
          <button type="button" className="btn btn--primary" disabled={locked} onClick={build}>
            Build
          </button>
          <p className="lab__hint">
            {built.toLocaleString()} built + {grown.toLocaleString()} expanded ={' '}
            <b>{(built + grown).toLocaleString()}</b> nodes, {liveEdges.toLocaleString()} edges
            {floored > 0 && (
              <b> — {floored.toLocaleString()} more edges than asked for: the tree comes first.</b>
            )}
          </p>
        </Group>

        <Group
          title="Interaction"
          hint="Click any node to hang `expand by` new neighbours off it — laid out incrementally, so nothing already on screen moves. Panning, wheel-zoom and node drag are the library's own; the buttons drive the same viewport handle the scripted zoom test uses, so they are comparable across engines."
        >
          {engine.caps.viewport ? (
            <React.Fragment>
              <button type="button" className="btn" onClick={() => zoom(1.25)}>
                Zoom in
              </button>
              <button type="button" className="btn" onClick={() => zoom(0.8)}>
                Zoom out
              </button>
              <button type="button" className="btn" onClick={() => zoom('fit')}>
                Fit
              </button>
            </React.Fragment>
          ) : (
            <p className="lab__hint">
              No viewport API at all in this library — pan and zoom are the finding, not an
              omission.
            </p>
          )}
          <p className="lab__hint">
            expanded: {expandedRef.current.size} node{expandedRef.current.size === 1 ? '' : 's'}
          </p>
        </Group>

        <Group
          title="Renderer"
          hint={
            engine.renderers.length > 1
              ? 'The same code path with a different paint backend. Switching remounts the pane — none of these can swap it on a live instance — so the graph is redrawn from scratch and the viewport resets.'
              : 'This library has exactly one backend. That is the finding for it.'
          }
        >
          <Knob
            knob={{ type: 'choice', label: 'Paint backend', options: engine.renderers }}
            value={renderer}
            disabled={locked || engine.renderers.length < 2}
            onChange={setRenderer}
          />
        </Group>

        <Group
          title="Layout & worker"
          hint="Identical d3-force either way, so the only variable is where it runs. Watch the gauge, not the solve time — off the main thread the solve costs the same and the tab stays at 60."
        >
          <Knob knob={SOLVER} value={layoutMode} disabled={locked} onChange={setLayoutMode} />
          <Knob
            knob={{ type: 'toggle', label: 'In a Web Worker' }}
            value={worker}
            disabled={locked}
            onChange={setWorker}
          />
          {layoutMode === 'force' && (
            <Knob
              knob={num('Convergence α', 0, 0.2, 0.005)}
              value={alphaMin}
              disabled={locked}
              onChange={setAlphaMin}
            />
          )}
          <button type="button" className="btn" disabled={locked} onClick={redraw}>
            Re-layout
          </button>
        </Group>

        <Group
          title="LOD & culling"
          hint="Both applied in the shared layer, so this engine gets exactly the help every other one gets. Read any speed-up next to `kept` below — “three times faster” means nothing without how much stopped being drawn. A visible fraction of 0 keeps nothing, which is the floor the rest of the readings sit on."
        >
          <Knob
            knob={{ type: 'toggle', label: 'Level of detail (drop labels)' }}
            value={lod}
            disabled={locked}
            onChange={setLod}
          />
          <Knob
            knob={{ type: 'toggle', label: 'Viewport culling' }}
            value={cull}
            disabled={locked}
            onChange={setCull}
          />
          <Knob
            knob={num('Visible fraction', 0, 1, 0.05)}
            value={fraction}
            disabled={locked || !cull}
            onChange={setFraction}
          />
          <button type="button" className="btn" disabled={locked} onClick={redraw}>
            Apply
          </button>
        </Group>

        <Group
          title="Streaming"
          hint="Nodes arriving and expiring at a fixed rate, the way a live feed behaves. Node count stays flat, so what you are watching is churn. Leave it running and watch the heap. At 0 nothing is pushed — that is the idle cost of holding this graph, which is what a churn reading should be compared against."
        >
          <Knob
            knob={num('Nodes / sec', 0, 5000, 10)}
            value={rate}
            disabled={running}
            onChange={setRate}
          />
          <button
            type="button"
            className={'btn' + (streaming ? ' btn--danger' : '')}
            disabled={running}
            onClick={() => setStreaming(s => !s)}
          >
            {streaming ? 'Stop stream' : 'Start stream'}
          </button>
        </Group>

        <Group
          title="Hover"
          hint="Move the pointer over the pane yourself. The counter is every callback this engine fired; the debounce is on the React state update the real hover card does, not on the engine."
        >
          <Knob
            knob={num('Debounce (ms)', 0, 200, 5)}
            value={debounce}
            disabled={running}
            onChange={setDebounce}
          />
        </Group>
      </div>

      <Gauge hud={hud} live={!locked} hovers={hoverCount()} onResetHovers={resetHover} />

      <section className="pane pane--bench">
        <header className="pane__bar">
          <b className="pane__name">{engine.name}</b>
          <span className="pane__lib">{renderer}</span>
          <span className="pane__stat">
            {data.graph.nodes.length.toLocaleString()} drawn nodes ·{' '}
            {data.graph.edges.length.toLocaleString()} links
          </span>
          {streaming && <span className="lab__live">streaming {rate}/s</span>}
        </header>
        <div className="pane__body" ref={paneRef}>
          <Suspense fallback={<p className="pane__wait">loading {engine.lib}…</p>}>
            {/* Keyed on the backend: not one of these libraries can swap its
                paint target on a live instance, so the only honest way to offer
                the choice is to build a new one. */}
            <Renderer
              key={renderer}
              graph={data.graph}
              positions={data.positions}
              {...paneProps}
              renderer={renderer}
              isExpanded={isExpanded}
              statusVersion={statusVersion}
              onNodeClick={expandFrom}
            />
          </Suspense>
        </div>
      </section>

      {report && (
        <section className="lab__report">
          <h3>Last build</h3>
          <dl className="lab__stats">
            {Object.keys(report).map(key => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{format(report[key])}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="lab__scripted">
        <h3>Scripted scenarios</h3>
        <div className="bench__row">
          <label className="jump">
            <span>Scenario</span>
            <select
              value={scenarioKey}
              disabled={locked}
              onChange={e => setScenarioKey(e.target.value)}
            >
              {SCENARIOS.map(s => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn btn--primary"
            disabled={locked}
            onClick={runScripted}
          >
            Run on {engine.name}
          </button>
          {running && (
            <button type="button" className="btn btn--danger" onClick={cancel}>
              Stop
            </button>
          )}
          {running && <span className="bench__status">running — the gauge is paused</span>}
        </div>
        <p className="bench__blurb">{scenario.blurb}</p>
        <div className="bench__knobs">
          {scenario.knobs.map(knob => (
            <Knob
              key={knob.key}
              knob={knob}
              value={knobs[knob.key]}
              disabled={locked}
              onChange={v => setKnob(knob.key, v)}
            />
          ))}
        </div>
        <ResultTable rows={rows} scenario={scenario} />
      </section>

      <section className="lab__caps">
        <h3>What the library gives you</h3>
        <p className="compare__sub">
          Read off this library's API, not measured — the half of the comparison a stopwatch cannot
          answer, and on a real project the half that decides it.
        </p>
        <table className="grid">
          <tbody>
            {CAP_ROWS.map(([capKey, label]) => (
              <tr key={capKey}>
                <th scope="row">{label}</th>
                <td className={engine.caps[capKey] ? '' : 'is-na'}>
                  {engine.caps[capKey] || 'none'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

/**
 * The live gauge.
 *
 * `—` throughout is not a bug and not a zero: `blockedMs` and `heapMB` are
 * Chromium-only, and reporting 0 ms blocked in a browser that cannot see long
 * tasks reads as "never blocked", which is a much worse lie than "not measured
 * here".
 */
function Gauge({ hud, live, hovers, onResetHovers }) {
  const cells = [
    ['fps', hud.fps || '—', 'frames presented per second over the last ~3s'],
    ['p50 ms', hud.p50, 'median frame time'],
    ['p95 ms', hud.p95, '95th-percentile frame time — the stutter you notice'],
    ['worst ms', hud.worst, 'longest single frame in the window'],
    ['dropped', hud.dropped, 'frames the browser never got to present'],
    ['blocked ms', hud.blockedMs, 'main thread inside long tasks, per ½s (Chromium only)'],
    ['heap MB', hud.heapMB, 'used JS heap (Chromium only, GC-scheduled)'],
    ['hovers', hovers, 'hover callbacks this engine has fired']
  ]
  return (
    <div className={'lab__hud' + (live ? '' : ' is-paused')}>
      {cells.map(([label, value, hint]) => (
        <div className="lab__cell" key={label} title={hint}>
          <dt>{label}</dt>
          <dd>{format(value)}</dd>
        </div>
      ))}
      <button type="button" className="btn" onClick={onResetHovers}>
        Reset hovers
      </button>
    </div>
  )
}

function Group({ title, hint, children }) {
  return (
    <section className="lab__group">
      <h3>{title}</h3>
      <div className="lab__controls">{children}</div>
      <p className="lab__hint">{hint}</p>
    </section>
  )
}
