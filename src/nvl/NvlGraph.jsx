import React, { useEffect, useMemo, useRef } from 'react'
import { FreeLayoutType } from '@neo4j-nvl/base'
import { InteractiveNvlWrapper } from '@neo4j-nvl/react'
import { ENTITY } from '../graph/data.ts'
import { isSelfEdge } from '../graph/ops.ts'
import { INK, nodeColor } from '../ui/theme.ts'
import { useResize } from '../ui/useResize.ts'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE NEO4J NVL RENDERER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This uses the official `@neo4j-nvl/react` wrapper (`InteractiveNvlWrapper`)
 * instead of driving `@neo4j-nvl/base` by hand. That used to be off the table:
 * every published version peers `react: 18.0.0 || ^19.0.0`, which this POC
 * didn't satisfy until it moved off React 16. On React 19 the wrapper installs
 * cleanly with no hard React dependency of its own, so this file is now props
 * in, canvas out — no `new NVL(...)`, no interaction handlers built one by
 * one, no id-diffed `present` ref, no `destroy()` cascade on unmount. The
 * wrapper's own `BasicNvlWrapper` does that diffing internally by comparing
 * the `nodes`/`rels` arrays it's given on each render.
 *
 * It does not do everything, though. Four things below exist because the
 * wrapper doesn't: the `hoveredId` dedupe, the debounced `refit`, the `fitted`
 * tracking, and the `onViewport` handle, now built from the wrapper's ref.
 *
 * One wrapper behaviour worth knowing before it bites: `InteractiveNvlWrapper`
 * only constructs a Pan / Zoom / DragNode interaction handler when
 * `mouseEventCallbacks` carries a truthy entry for that event (`onPan`,
 * `onZoom`, `onDrag`) — see `@neo4j-nvl/react`'s `InteractionHandlers.js` and
 * `hooks.js`. This app has no use for those specific callbacks, but leaving
 * them out doesn't error, it just silently disables panning, zooming and node
 * dragging. They're passed as `true` below purely to switch the handlers on,
 * which is what the hand-rolled version got for free by constructing
 * `PanInteraction` / `ZoomInteraction` / `DragNodeInteraction` unconditionally.
 *
 * ── What NVL gives back ────────────────────────────────────────────────────
 * - **Self-edges are native**, drawn as proper labelled loops. No pivot detour.
 * - **Level of detail is automatic**: captions are dropped as you zoom out
 *   instead of turning into unreadable mush.
 * - **Real layouts ship with it** — force-directed, hierarchical, circular,
 *   d3-force, grid. Not used here: `FreeLayoutType` plus explicit coordinates
 *   is what makes this pane comparable to the other seven. In an app where the
 *   comparison did not matter, this is the one engine that would need no layout
 *   code at all.
 *
 * ── What it costs ──────────────────────────────────────────────────────────
 * Roughly **482 KB gzipped** (measured from `npm run build`'s own chunk
 * report), about eight times the lightest engine here. It bundles `mobx`,
 * `d3-force`, `gl-matrix`, `lodash`, `tinycolor2`, `concaveman` — and
 * `@segment/analytics-next`, which is worth knowing about before shipping it
 * into a product. `disableTelemetry` below switches the reporting off; the
 * dependency is still in the bundle.
 */

const EDGE = '#2F3746'
const LOOP = '#7FD4E8'

const OPTIONS = {
  // Coordinates come from the shared radial layout, so NVL must not run one of
  // its own over the top of them.
  layout: FreeLayoutType,
  backgroundColor: INK,
  disableTelemetry: true,
  allowDynamicMinZoom: true
}

function NvlGraph({
  graph,
  positions,
  hidden,
  isExpanded,
  isPending,
  statusVersion,
  renderer = 'canvas',
  onNodeClick,
  onNodeHover,
  onEdgeClick,
  onBackgroundClick,
  onStat,
  onViewport
}) {
  const frame = useRef(null)
  // The wrapper's ref, once mounted, is not the NVL instance itself but a
  // proxy object exposing NVL's instance methods directly (`.fit`, `.setZoom`,
  // `.getScale`, `.getPan`, `.setPan`, ...) — see `BasicNvlWrapper`'s
  // `useImperativeHandle`. No `.nvl` nesting.
  const nvl = useRef(null)
  // Node ids to fit against, as an array, so a resize can re-fit without
  // waiting for the next graph change.
  const shown = useRef([])
  const fitted = useRef(-1)
  const hoveredId = useRef(null)
  const fitTimer = useRef(null)

  const handlers = useRef({})
  handlers.current = { onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick }

  // Captions only render on the canvas backend — the WebGL one drops them
  // entirely, which is most of what makes it fast and is exactly the trade
  // worth seeing rather than reading about. `renderer` is read once here: the
  // lab remounts this pane with a key to change it rather than swapping it
  // live, so a stable ref (evaluated once, on first render) matches that
  // contract instead of reacting to a prop that in practice never changes
  // under a mounted instance.
  const nvlOptions = useRef(
    Object.assign({}, OPTIONS, {
      renderer: renderer === 'webgl' ? 'webgl' : 'canvas'
    })
  ).current

  const mouseEventCallbacks = useRef({
    onNodeClick: node => handlers.current.onNodeClick(node.id),
    onRelationshipClick: rel => handlers.current.onEdgeClick(rel.id),
    onCanvasClick: () => handlers.current.onBackgroundClick(),
    // `onHover` fires on **every mousemove**, hit or miss, so without this
    // dedupe it thrashes React state continuously while the pointer moves.
    onHover: (element, hit, event) => {
      const id = element && element.id && !element.from ? element.id : null
      if (id === hoveredId.current) return
      hoveredId.current = id
      handlers.current.onNodeHover(id, id ? { x: event.clientX, y: event.clientY } : null)
    },
    // Turns the Pan/Zoom/DragNode interaction handlers on — see the header
    // comment. No app-level behaviour hangs off these three; they exist only
    // because leaving them unset leaves panning, zooming and dragging off.
    onPan: true,
    onZoom: true,
    onDrag: true
  }).current

  useEffect(() => {
    // The benchmark's handle. NVL is the only engine here that exposes zoom and
    // pan as one call — `setZoomAndPan` exists precisely because setting them
    // separately jitters — so the two are kept apart only to match the shared
    // contract, and a scenario that drives both per frame pays for that.
    if (onViewport) {
      onViewport({
        zoomBy: factor => {
          if (nvl.current) nvl.current.setZoom(nvl.current.getScale() * factor)
        },
        panBy: (dx, dy) => {
          if (!nvl.current) return
          const at = nvl.current.getPan()
          nvl.current.setPan(at.x + dx, at.y + dy)
        },
        fit: () => {
          if (nvl.current && shown.current.length) nvl.current.fit(shown.current)
        }
      })
    }

    return () => {
      if (onViewport) onViewport(null)
      clearTimeout(fitTimer.current)
    }
  }, [])

  /**
   * Fit the scene, debounced.
   *
   * The delay is not decoration: NVL animates elements into place, and a fit
   * measured during that animation is measured against a box that is still
   * moving. It also covers the mount case, where this lazily-loaded pane can
   * initialise before its grid cell has been laid out.
   */
  const refit = useRef(() => {
    clearTimeout(fitTimer.current)
    fitTimer.current = setTimeout(() => {
      if (nvl.current && shown.current.length) nvl.current.fit(shown.current)
    }, 120)
  })

  useResize(frame, () => refit.current())

  // The node and relationship mapping the wrapper is handed each render.
  // `addAndUpdateElementsInGraph`-style diffing now happens inside
  // `BasicNvlWrapper` itself, comparing this array against the previous one —
  // this file no longer tracks which ids are already on screen.
  const scene = useMemo(() => {
    const started = performance.now()

    const nodes = graph.nodes
      .filter(n => positions[n.id])
      .map(node => {
        const meta = ENTITY[node.type]
        const behind = hidden.get(node.id) || 0
        return {
          id: node.id,
          x: positions[node.id].x,
          y: positions[node.id].y,
          // Without this the free layout still lets a drag drift a node; pinned
          // keeps the shared arrangement exactly as the other panes draw it.
          pinned: true,
          size: node.level === 0 ? 19 : node.flagged ? 14 : 11,
          color: nodeColor(meta.color, {
            explored: isExpanded(node.id),
            pending: isPending(node.id)
          }),
          caption: `${meta.tag} ${node.name}` + (behind > 0 ? `  +${behind}` : ''),
          captionAlign: 'bottom',
          // Flagged nodes borrow NVL's *selection* ring, because a node has no
          // border of its own: the public `Node` type is id, color, size, caption,
          // captionAlign, x, y, pinned, selected, icon — there is no stroke colour
          // or stroke width to set. So the ring is NVL's selection blue rather
          // than the app's alert red, and the pulse the ECharts and FusionCharts
          // panes animate has no equivalent here at all. Both are properties of
          // the library, not of this file.
          selected: !!node.flagged
        }
      })

    const rels = graph.edges.map(edge => ({
      id: edge.id,
      from: edge.source,
      to: edge.target,
      caption: edge.label || '',
      color: isSelfEdge(edge) ? LOOP : EDGE,
      width: 1
    }))

    // The timestamp, not the elapsed time, is what this memo hands back. NVL's
    // own add/update work now happens inside InteractiveNvlWrapper's effect,
    // which React commits before this component's own effect below runs — so
    // reading the clock there, against this `started`, still spans mapping
    // *and* the hand-off into NVL, matching what the other seven panes time.
    return { nodes, rels, started }
  }, [graph, positions, hidden, statusVersion, isExpanded, isPending])

  useEffect(() => {
    shown.current = scene.nodes.map(n => n.id)

    // NVL never re-fits when elements are added, so an expanding graph walks
    // off screen.
    if (fitted.current !== graph.nodes.length) {
      fitted.current = graph.nodes.length
      refit.current()
    }

    if (onStat) onStat(Math.round(performance.now() - scene.started))
  }, [scene, graph.nodes.length, onStat])

  return (
    <div className="canvas" ref={frame}>
      <InteractiveNvlWrapper
        ref={nvl}
        nodes={scene.nodes}
        rels={scene.rels}
        nvlOptions={nvlOptions}
        mouseEventCallbacks={mouseEventCallbacks}
      />
    </div>
  )
}

export default React.memo(NvlGraph)
