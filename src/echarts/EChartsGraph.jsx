import React, { useEffect, useRef } from 'react'
// The graph chart and one renderer, not the whole library. `import * from
// 'echarts'` pulls every chart type in and costs 446 KB gzipped; this is 170 KB.
// Nothing else is needed here — the tooltip is switched off, and a graph with
// `layout: 'none'` uses no grid or axis components.
import * as echarts from 'echarts/core'
import { GraphChart } from 'echarts/charts'
// Both backends, because the lab lets you switch between them. The SVG one is
// ~15 KB on top of the canvas one, which is a fair price for being able to A/B
// the two rendering families with everything else held identical.
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'

echarts.use([GraphChart, CanvasRenderer, SVGRenderer])
import { ENTITY } from '../graph/data.ts'
import { withLoops } from '../graph/loops.ts'
import { BONE, FLARE, INK, nodeColor } from '../ui/theme.js'
import { EDGE_RULES, EDGE_STYLES, SHAPE, SHAPE_SETS } from './symbols.ts'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE ECHARTS RENDERER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ECharts is framework-agnostic, so this component is the React bridge: a ref,
 * one setup effect that lives for the component's lifetime, and one data effect
 * that pushes options in. There is no official React wrapper (echarts-for-react
 * is community-maintained), which on React 16 is a feature — nothing to check
 * for a React 18 peer dependency.
 *
 * ECharts ships no graph layout beyond force and circular, and neither keeps a
 * hierarchy legible, so positions arrive as a prop. App computes them with the
 * shared `layoutRadial` and hands the same object to the FusionCharts tab:
 * only the drawing differs.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WHAT THIS FILE DEPENDS ON, AND WHAT EACH PIECE CONTRIBUTES
 * ───────────────────────────────────────────────────────────────────────────
 *
 *   echarts/core          the chart instance, `init` and `setOption`
 *   echarts/charts        GraphChart — the only series type used
 *   echarts/renderers     CanvasRenderer — the paint backend (see STEP 7)
 *
 *   ../graph/data.ts      ENTITY: per-type colour, tag and display label.
 *                         Also the fake backend, but this file never calls it.
 *   ../graph/loops.ts     withLoops: turns self-edges into three drawable
 *                         links plus the invisible pivot nodes they need.
 *   ../ui/theme.js        nodeColor: the one place brightness is decided.
 *   ./symbols.ts          SHAPE / SHAPE_SETS / EDGE_STYLES — every shape and
 *                         line recipe the user can pick between.
 *
 * Nothing above imports this file back. The data flows one way:
 *
 *   data.js ──► useGraph.js ──► App.jsx ──► EChartsGraph.jsx ──► canvas
 *                   ▲                            │
 *                   └──── onNodeClick(id) ───────┘
 *
 * ───────────────────────────────────────────────────────────────────────────
 * THE PIPELINE, IN THE ORDER IT RUNS
 * ───────────────────────────────────────────────────────────────────────────
 *
 *   STEP 0  mount: create the instance, bind listeners once     (setup effect)
 *   STEP 1  read the graph — the domain shape, nothing visual
 *   STEP 2  read the positions App handed down (ids -> graph-space coords)
 *   STEP 3  edge flattening: self-edges become three links + pivots
 *   STEP 4  node build: one ECharts data item per node (shape lives here)
 *   STEP 5  link build: one ECharts link per drawable edge (style lives here)
 *   STEP 6  assemble the option object
 *   STEP 7  setOption — hand it over; ECharts diffs, tweens and paints
 *   STEP 8  overlay: re-place the CSS pulse rings over the fresh canvas
 *
 * Each step is marked in the code below. STEP 4 is the one to read if the
 * question is "what does it take to draw one node".
 */

const EDGE = '#2F3746'
const LOOP = '#7FD4E8'
const SYNTH = '#5FD39B'
const MONO = 'JetBrains Mono, ui-monospace, monospace'

/**
 * The flagged-node pulse.
 *
 * ECharts has no looping per-node animation: `emphasis` is hover-driven and the
 * ripple `effectScatter` gives away is not available to a graph series. Faking
 * one by re-pushing the option on a timer is what this used to do, and it cost
 * a full series teardown twice a second — a permanently-animating canvas, roam
 * state thrown away on every beat, and the graph blanking as it re-entered.
 *
 * So the rings are not in the chart at all. They are DOM elements over the
 * canvas, animated by CSS, which is what the FusionCharts tab already does with
 * its SVG strokes — the browser runs the animation and ECharts never redraws.
 * The cost is that a DOM ring does not ride roam for free, so their positions
 * are re-read from the chart whenever it pans, zooms, or changes.
 */
const ANIM_MS = 400
// The ring's resting diameter, as a multiple of the node's own symbol size.
// The CSS animation grows outward from here.
const RING_SCALE = 1.5
// ECharts' own default for `series.nodeScaleRatio`: how much of a roam zoom a
// node symbol actually takes on. The rings have to use the same number or they
// come away from the nodes as soon as anyone scrolls — see STEP 8.
const NODE_SCALE_RATIO = 0.6

// How big a node's box is before its shape gets a say. Three sizes, and each
// one means something: the root anchors the graph, a flagged node has to be
// findable without hunting, everything else is the baseline.
const baseSizeOf = node => (node.level === 0 ? 36 : node.flagged ? 27 : 22)

/**
 * The final pixel size of a node's symbol box.
 *
 * Two numbers multiplied: what the node deserves (`baseSizeOf`) and what its
 * shape needs to look the same weight as its neighbours (`SHAPE[…].scale`).
 * Used twice — once for the symbol itself in STEP 4, once for the pulse ring in
 * STEP 8 — and they have to agree or the ring floats off a triangle.
 */
const sizeOf = (node, shapeSet) => baseSizeOf(node) * SHAPE[shapeSet.shapeOf(node)].scale

// Defined once at series level rather than per node. ECharts merges an item's
// label over the series' label, so every node inherits these styles and only
// has to supply its own formatter string.
const RICH = {
  tag: { fontFamily: MONO, fontSize: 10, fontWeight: 700, color: BONE, padding: [0, 5, 0, 0] },
  name: { fontFamily: 'Inter Tight, sans-serif', fontSize: 11, color: '#9AA2B1' },
  // The "+N links hidden" badge. ECharts graph nodes have no overlay or badge
  // hook of any kind, so it has to live inside the label as a rich-text run.
  hid: {
    fontFamily: MONO,
    fontSize: 10,
    fontWeight: 700,
    color: INK,
    backgroundColor: BONE,
    padding: [3, 5, 2, 5],
    borderRadius: 9
  }
}

// A stable identity, so a caller that ships no overrides does not invalidate the
// data effect's dependency on them every render.
const NO_OVERRIDES = new Map()

const EDGE_LABEL = {
  fontFamily: MONO,
  fontSize: 9,
  color: '#6B7385',
  backgroundColor: INK,
  padding: [2, 3, 1, 3]
}

function EChartsGraph({
  graph,
  positions,
  hidden,
  isExpanded,
  isPending,
  statusVersion,
  shapeSet,
  edgeStyle,
  edgeOverrides = NO_OVERRIDES,
  renderer = 'canvas',
  onNodeClick,
  onNodeHover,
  onEdgeClick,
  onBackgroundClick,
  onStat,
  onViewport
}) {
  const frame = useRef(null)
  const chart = useRef(null)
  const layer = useRef(null)

  // Fall back rather than crash if a caller forgets the prop or ships a stale
  // key — an unknown shape set is a UI bug, not a reason to lose the graph.
  const shapes = SHAPE_SETS[shapeSet] || SHAPE_SETS.type
  const rule = EDGE_RULES[edgeStyle] || EDGE_RULES.arrow

  // Handlers are new on most renders; the listeners are bound once. Routing
  // through a ref keeps us from tearing the chart down to pick up a callback.
  const handlers = useRef({})
  handlers.current = { onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick }

  // Set by the data effect, which is the only place that knows where the nodes
  // are. The setup effect calls it back whenever the chart moves under them.
  const place = useRef(null)

  // Whether the chart has been given an option yet. Only the first one may
  // carry the view settings — see `zoom` in STEP 6.
  const pushed = useRef(false)

  // ══ STEP 0 ═══════════════════════════════════════════════════════════════
  // Mount. Runs once: create the ECharts instance against the empty <div>,
  // bind every listener, watch for resize. Deliberately separate from the data
  // effect below — an instance that is re-created on data change loses its
  // roam position, and re-binding listeners is how you end up firing a click
  // handler five times.
  useEffect(() => {
    // Fixed for the instance's life — ECharts has no way to swap the backend on
    // a live chart, so a caller that wants the other one has to remount this
    // component. `renderer` is deliberately absent from the deps below for that
    // reason: re-running here would rebuild the chart and throw the roam away.
    const instance = echarts.init(frame.current, null, { renderer })
    chart.current = instance

    // `{ dataType: 'node' }` is what keeps these off the edges — without it the
    // same handler fires for a clicked relationship and reports its source.
    instance.on('click', { dataType: 'node' }, params => {
      // Pivots carry no id, so a loop's invisible endpoints resolve to nothing.
      if (params.data.id) handlers.current.onNodeClick(params.data.id)
    })

    instance.on('mouseover', { dataType: 'node' }, params => {
      if (!params.data.id) return
      const native = params.event && params.event.event
      handlers.current.onNodeHover(params.data.id, {
        x: native ? native.clientX : 0,
        y: native ? native.clientY : 0
      })
    })

    instance.on('mouseout', { dataType: 'node' }, () => handlers.current.onNodeHover(null, null))

    // The other half of `dataType` — the same event stream, filtered to links.
    // Clicking an edge was previously inert (the node handler filters it out,
    // and the background handler below needs a *null* target), so this costs
    // no existing interaction. `edgeId` is ours: see STEP 5 for why it is not
    // the link's own id.
    instance.on('click', { dataType: 'edge' }, params => {
      const { edgeId } = params.data
      if (edgeId && handlers.current.onEdgeClick) handlers.current.onEdgeClick(edgeId)
    })

    // Empty background is not a series, so it never reaches `instance.on`.
    // ZRender is the layer below, where a miss shows up as a null target.
    instance.getZr().on('click', event => {
      if (!event.target) handlers.current.onBackgroundClick()
    })

    // Everything that can move the rings ends in a render: a pan, a zoom, a
    // resize, a new level. One listener on the end of that render covers them
    // all, and it costs nothing while the chart is idle — which, with the pulse
    // now in CSS, is all the time.
    instance.on('finished', () => place.current && place.current())

    const observer = new ResizeObserver(() => instance.resize())
    observer.observe(frame.current)

    // The benchmark's handle.
    //
    // `graphRoam` is the action ECharts dispatches to itself when you scroll or
    // drag the chart, so driving it is the same code path a wheel event takes —
    // and, importantly, the path that does *not* re-derive the series. Sending
    // `zoom` through `setOption` would work too and would look faster or slower
    // depending on nothing but which of the two you picked, which is exactly the
    // sort of choice a comparison must not make silently.
    //
    // `zoom` in the payload is a multiplier, which is why the shared contract is
    // relative: this engine has no absolute form to convert from.
    if (onViewport) {
      onViewport({
        zoomBy: factor => {
          const box = frame.current
            ? frame.current.getBoundingClientRect()
            : { width: 0, height: 0 }
          instance.dispatchAction({
            type: 'graphRoam',
            seriesId: 'graph',
            zoom: factor,
            originX: box.width / 2,
            originY: box.height / 2
          })
        },
        panBy: (dx, dy) =>
          instance.dispatchAction({ type: 'graphRoam', seriesId: 'graph', dx, dy }),
        // No fit action exists — the series fits its own bounding box whenever
        // an option is pushed without a roam transform, and there is no way to
        // ask for that without a `setOption`. Resetting the roam is the closest
        // honest equivalent.
        fit: () => instance.dispatchAction({ type: 'graphRoam', seriesId: 'graph', zoom: 1 })
      })
    }

    return () => {
      if (onViewport) onViewport(null)
      observer.disconnect()
      instance.dispose()
      chart.current = null
    }
    // Mount-only: `onViewport` is stable where it is passed at all, and
    // re-running this effect would tear down the chart and lose the roam.
  }, [])

  // ══ STEPS 1–8 ════════════════════════════════════════════════════════════
  // The data effect. Everything from "here is a graph" to "there are pixels".
  // Re-runs on a new graph, a status change, or a new shape/edge choice — and
  // on nothing else, which is why the hover path can afford to be chatty.
  useEffect(() => {
    const instance = chart.current
    if (!instance) return
    // What this whole effect costs, reported to App for the pane header. It is
    // the update cost — deriving the option and handing it over — which is the
    // number that separates these libraries once the graph is large.
    const started = performance.now()

    // ── STEP 1 · READ THE GRAPH ───────────────────────────────────────────
    // `graph` is the domain model and holds no visual information at all:
    //
    //   graph.nodes[i] = { id, type, level, name, risk, flagged, events, … }
    //   graph.edges[i] = { id, source, target, label, synthetic? }
    //
    // No x, no y, no colour, no shape. Everything ECharts needs is derived
    // below, which is what lets the same state feed the FusionCharts tab.

    // ── STEP 2 · LAYOUT ───────────────────────────────────────────────────
    // ids -> graph-space coordinates, computed by App and shared with the other
    // renderer. Graph space is unitless: STEP 7 fits it to the viewport, so
    // these numbers only have to be right relative to each other.
    //
    //   positions = { 'ACC-4471-0': { x: 0, y: 0 }, 'DEV-8123-10': { x: … } }
    //
    // Incremental, and that matters here: an expansion changes the entries for
    // the new nodes and leaves the rest identical, so the diff in STEP 7 has
    // nothing to tween for nodes that did not move.

    // ── STEP 3 · FLATTEN THE EDGES ────────────────────────────────────────
    // A self-edge is not drawable — source and target at the same point is a
    // zero-length line hidden under the node's own symbol. `withLoops` rewrites
    // each one as three ordinary links routed through two invisible pivots, and
    // hands back the pivots so STEP 4 can add them as zero-size nodes.
    //
    //   links  = [{ id, from, to, label, arrow, loop?, synthetic? }, …]
    //   pivots = [{ id, x, y }, …]   ← positions only, never real nodes
    const { links, pivots } = withLoops(graph, positions)

    // ── STEP 4 · BUILD THE NODES ──────────────────────────────────────────
    // The transformation that matters. One domain node in, one ECharts data
    // item out, and every visual property decided here:
    //
    //   node.type      → ENTITY[type].color → itemStyle.color   (which entity)
    //   node.type      → ENTITY[type].tag   → label prefix
    //   node.type/risk → shapes.shapeOf()   → symbol            (the shape)
    //   node.level     → baseSizeOf()       → symbolSize        (how big)
    //   node.flagged   → itemStyle.border   → the red rim
    //   expand status  → nodeColor()        → brightness        (more to see?)
    //   hidden count   → the {hid} label run → "+3" badge
    //
    // `name` is what ECharts matches links against — id is not used for that,
    // so the node id has to be the name, and the display text is a formatter.
    const build = () => {
      const nodes = graph.nodes.map(node => {
        const meta = ENTITY[node.type]
        const behind = hidden.get(node.id) || 0
        const pending = isPending(node.id)
        // The user's shape choice resolves here, and only here: a key from the
        // active set, looked up in the SHAPE table for the actual symbol.
        const shape = SHAPE[shapes.shapeOf(node)]
        return {
          id: node.id,
          name: node.id,
          // Graph-space coordinates from STEP 2. Only honoured because the
          // series sets `layout: 'none'` — under 'force' they are seed values
          // the simulation immediately overwrites.
          x: positions[node.id].x,
          y: positions[node.id].y,
          // 'circle' | 'rect' | 'triangle' | 'path://…' — a built-in name or a
          // raw SVG path, and the series treats the two identically.
          symbol: shape.symbol,
          symbolSize: sizeOf(node, shapes),
          itemStyle: {
            color: nodeColor(meta.color, { explored: isExpanded(node.id), pending }),
            // A thin static edge as well as the ring, so a flagged node still
            // reads as flagged in a still frame or with motion turned down.
            borderColor: node.flagged ? FLARE : 'transparent',
            borderWidth: node.flagged ? 2 : 0,
            opacity: pending ? 0.55 : 1
          },
          label: {
            formatter:
              `{tag|${meta.tag}}{name|${node.name}}` + (behind > 0 ? `  {hid|+${behind}}` : '')
          }
        }
      })

      // The loop pivots from STEP 3, added as real data items so the loop's
      // three links have endpoints to attach to. `symbolSize: 0` is what makes
      // them invisible, and carrying no `id` is what makes them unclickable.
      pivots.forEach(pivot => {
        nodes.push({
          name: pivot.id,
          x: pivot.x,
          y: pivot.y,
          symbolSize: 0,
          label: { show: false }
        })
      })

      return nodes
    }

    // ── STEP 5 · BUILD THE LINKS ──────────────────────────────────────────
    // Same idea one level down: a flattened link in, an ECharts link out.
    //
    // Nothing here is global. A graph series has no "edge style" setting to
    // begin with — only a list of links, each carrying its own `lineStyle`,
    // `symbol` pair and `curveness`. So styling every edge the same way is the
    // step that costs work, and styling one differently costs nothing. Three
    // sources feed each link's appearance, in order of increasing specificity:
    //
    //   1. the rule       EDGE_RULES[edgeStyle].styleOf(link, ctx) — flat or derived
    //   2. the override    edgeOverrides.get(edgeId) — one edge the user clicked
    //   3. the meaning     colour and a loop's bow, decided right here
    //
    // (3) is last on purpose. Colour is not decoration — cyan is a self-loop,
    // green is analyst-added, grey is what the backend returned — so neither a
    // preset nor a click is allowed to overwrite it.
    const levelOf = new Map(graph.nodes.map(node => [node.id, node.level]))

    const buildLinks = () =>
      links.map(link => {
        // The override key drops the `#out` / `#over` / `#back` suffix STEP 3 adds,
        // so clicking any one leg of a loop restyles all three. Without this a
        // loop would come apart into a dotted arc and two solid stubs.
        const edgeId = link.id.split('#')[0]

        const chosen =
          edgeOverrides.get(edgeId) ||
          rule.styleOf(link, {
            // A loop's middle leg leaves a pivot, not a node, so there is no hop
            // distance to report. -1 rather than 0, which would read as "the root".
            level: levelOf.has(link.from) ? levelOf.get(link.from) : -1
          })
        const style = EDGE_STYLES[chosen] || EDGE_STYLES.arrow

        // `arrow` is set by STEP 3 — the two invisible legs of a loop carry no
        // head, only the segment landing back on the node does. Copied, not
        // shared: handing the same array instance to every link means one
        // in-place edit anywhere downstream restyles the whole graph.
        let ends = link.arrow ? style.ends.slice() : ['none', 'none']
        // A loop with no arrowhead is unreadable — it becomes an arc floating over
        // a node with nothing to say which end it returns to. So a headless style
        // keeps its tail but borrows a head for the closing segment only.
        if (link.loop && link.arrow && ends[1] === 'none') ends[1] = 'arrow'

        return {
          source: link.from,
          target: link.to,
          // Not `id`: ECharts uses a data item's `id` to match items across a
          // `setOption`, and three loop legs sharing one would collapse them.
          edgeId,
          symbol: ends,
          // Per link, not per series — the series-level `edgeSymbolSize` below is
          // only a fallback now. A style with a `circle` tail needs a non-zero
          // tail size, and a style without one must not reserve space for it.
          symbolSize: [ends[0] === 'none' ? 0 : 5, 9],
          lineStyle: Object.assign({}, style.line, {
            color: link.loop ? LOOP : link.synthetic ? SYNTH : EDGE,
            // A straight run between the loop pivots would read as a triangle; a
            // little curvature on each of the three makes it read as a loop. The
            // loop's own bow wins over the style's — a style is about ordinary
            // relationships and would flatten the loop back into a triangle.
            curveness: link.loop ? 0.16 : style.curveness
          }),
          label: link.label
            ? Object.assign({ show: true, formatter: link.label }, EDGE_LABEL)
            : { show: false }
        }
      })

    // ── STEP 6 · ASSEMBLE THE OPTION ──────────────────────────────────────
    // One plain object describing the whole chart. Nothing has been drawn yet,
    // and this could be JSON.stringify'd and sent over a wire — which is worth
    // remembering when tempted to close over something mutable in it.
    const option = () => {
      const series = {
        // Load-bearing, and easy to leave off. `replaceMerge` below matches
        // components by id; a series without one can never match, so every
        // push destroyed the series and built a new one — which means every
        // node entered from nothing at the 1s enter duration, on every click.
        // With an id the same component survives and ECharts diffs into it, so
        // only the nodes that actually changed do anything.
        id: 'graph',
        type: 'graph',
        // The whole reason STEP 2 exists. 'force' and 'circular' are the only
        // layouts ECharts ships, and neither keeps a hierarchy readable.
        layout: 'none',
        roam: true,
        draggable: true,
        // [tail, head] in pixels, series-wide. Every link overrides this in
        // STEP 5; it stands only for a link that somehow ships without one.
        edgeSymbolSize: [0, 9],
        label: { show: true, position: 'bottom', distance: 11, rich: RICH },
        emphasis: { scale: 1.12, label: { show: true } },
        data: build(),
        links: buildLinks()
      }

      // The view settings go on the first push and never again.
      //
      // Roam writes the analyst's pan and zoom back onto this same series
      // model, so re-sending `zoom` overwrites them — every click threw the
      // view away and snapped back to fit. Left off, the merge keeps whatever
      // roam last set. It has to be *absent* rather than undefined: the merge
      // copies an explicit undefined over the stored value and the zoom falls
      // back to 1, which is the same bug wearing a different hat.
      //
      // At zoom 1 the graph's bounding box is fitted to the series rect, so
      // 0.9 is a fit with margin rather than a magnification.
      if (!pushed.current) series.zoom = 0.9

      return {
        backgroundColor: 'transparent',
        // No `tooltip` key at all. Our hover card does that job, and a native
        // tooltip alongside it would be two competing panels — but the reason
        // it is absent rather than `{ show: false }` is that naming the
        // component asks for it: with TooltipComponent left out of the `use`
        // call above, even a disabling option logs "Component tooltip is used
        // but not imported" on every chart.
        //
        // Long enough that a new level slides in rather than appearing, short
        // enough that the chart is idle again well before the next click.
        animationDurationUpdate: ANIM_MS,
        animationEasingUpdate: 'sinusoidalInOut',
        // Entering nodes use this one, not the update duration, and it
        // defaults to a full second — so a newly expanded level would arrive
        // well after everything else had settled.
        animationDuration: ANIM_MS,
        series: [series]
      }
    }

    // ── STEP 7 · HAND IT OVER ─────────────────────────────────────────────
    // `setOption` is where ECharts takes over: it diffs against the previous
    // option, tweens what it can match, fits the graph's bounding box to the
    // series rect, and asks ZRender to paint the display list to the canvas.
    //
    // `replaceMerge` is what drops a series that is no longer in the option —
    // a plain merge leaves a deleted node's symbol and label on the canvas.
    // It only *replaces* what it cannot match, and it matches on the series id
    // set in STEP 6, so ours survives every push and ECharts diffs into it:
    // nodes already on screen are matched by name and left alone, and only the
    // newcomers are created.
    instance.setOption(option(), { replaceMerge: ['series'] })
    pushed.current = true

    // ── STEP 8 · PLACE THE OVERLAY ────────────────────────────────────────
    // Where the rings go. `positions` is graph space; the view is what turns it
    // into pixels, and it is the same object ECharts pans and zooms, so reading
    // it back after a render is what keeps a ring on its node. There is no
    // public API for it — `convertToPixel` only knows registered coordinate
    // systems, and a graph's view is not one.
    place.current = () => {
      const series = instance.getModel().getSeriesByIndex(0)
      const view = series && series.coordinateSystem
      if (!view || !layer.current) return

      // How much bigger than its symbol size a node is actually drawn.
      //
      // Not pixels-per-unit, which is what this used to measure. That number
      // includes the fit — ECharts scales the whole graph to the series rect —
      // and a node symbol is deliberately *not* subject to it: the view divides
      // the fit back out so a symbol keeps its pixel size at any graph size. On
      // a one-node graph the fit is enormous (the data extent is a point, which
      // ECharts pads to two units and stretches across the canvas), so the ring
      // came out a few thousand pixels wide and swallowed the screen.
      //
      // What a symbol does scale with is the roam zoom, damped by
      // `nodeScaleRatio`. Same arithmetic here, so the ring tracks the node.
      const roam = view.getRoamTransform ? Math.abs(view.getRoamTransform()[0]) || 1 : 1
      const zoom = (roam - 1) * NODE_SCALE_RATIO + 1

      const flagged = new Map(graph.nodes.map(node => [node.id, node]))

      Array.from(layer.current.children).forEach(ring => {
        const node = flagged.get(ring.dataset.node)
        const at = node && positions[node.id]
        if (!at) return
        const [x, y] = view.dataToPoint([at.x, at.y])
        // The disc is drawn at a fixed pixel size but scales with roam, so the
        // ring has to scale with it too or it drifts inside the node on zoom.
        // Same `sizeOf` as STEP 4, shape correction included — a star's box is
        // 40% wider than a circle's and the ring has to know.
        const size = sizeOf(node, shapes) * RING_SCALE * zoom
        ring.style.width = ring.style.height = size + 'px'
        ring.style.left = x - size / 2 + 'px'
        ring.style.top = y - size / 2 + 'px'
      })
    }
    place.current()

    if (onStat) onStat(Math.round(performance.now() - started))
  }, [
    graph,
    positions,
    hidden,
    statusVersion,
    isExpanded,
    isPending,
    shapes,
    rule,
    edgeOverrides,
    onStat
  ])

  return (
    <React.Fragment>
      {/* ECharts owns everything inside this div. React must never render
          children into it — `init` writes its own canvas there. */}
      <div className="canvas" ref={frame} />
      {/* Decoration only — `pointer-events: none` in the stylesheet keeps these
          from eating the clicks meant for the node underneath. */}
      <div className="rings" ref={layer} aria-hidden="true">
        {graph.nodes
          .filter(node => node.flagged)
          .map(node => (
            <i key={node.id} className="ring" data-node={node.id} />
          ))}
      </div>
    </React.Fragment>
  )
}

// Hovering a node sets state in App, which re-renders the tree. Every prop here
// is stable or memoised, so memo keeps the hover path from re-running the data
// effect — which would re-layout and re-fit the graph on every mouse move.
export default React.memo(EChartsGraph)
