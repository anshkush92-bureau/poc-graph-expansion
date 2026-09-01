import React, { useEffect, useRef } from 'react'
import { FreeLayoutType, NVL } from '@neo4j-nvl/base'
import {
  ClickInteraction,
  DragNodeInteraction,
  HoverInteraction,
  PanInteraction,
  ZoomInteraction
} from '@neo4j-nvl/interaction-handlers'
import { ENTITY } from '../graph/data.js'
import { isSelfEdge } from '../graph/ops.js'
import { INK, nodeColor } from '../ui/theme.js'
import { useResize } from '../ui/useResize.js'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE NEO4J NVL RENDERER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * **`@neo4j-nvl/react` is not used, because it cannot be installed here.** Every
 * published version declares `react: 18 || ^19` as a peer, and the one version
 * with no peer range pins `react: ^18.2.0` as a hard *dependency*, which would
 * load a second React into the page. So the documented wrappers —
 * `BasicNvlWrapper`, `InteractiveNvlWrapper` — are off the table and this file
 * is the wrapper.
 *
 * That turns out to be little code, but the cost is not lines: **you own the
 * lifecycle**. Constructing `new NVL(...)`, constructing each interaction
 * handler separately, registering callbacks through `updateCallback(name, fn)`
 * rather than as props, diffing removals yourself through
 * `removeNodesWithIds` / `removeRelationshipsWithIds`, and calling `destroy()`
 * on every handler *and* the instance on unmount. Miss one and the canvas leaks.
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
 * Roughly **509 KB gzipped**, ten times the lightest engine here, plus ~668 KB
 * of lazily-loaded layout workers. It bundles `mobx`, `d3-force`, `gl-matrix`,
 * `lodash`, `tinycolor2`, `concaveman` — and `@segment/analytics-next`, which
 * is worth knowing about before shipping it into a product. `disableTelemetry`
 * below switches the reporting off; the dependency is still in the bundle.
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
  graph, positions, hidden, isExpanded, isPending, statusVersion, renderer = 'canvas',
  onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick, onStat, onViewport
}) {
  const frame = useRef(null)
  const nvl = useRef(null)
  const parts = useRef([])
  // Ids currently in the scene, so removals can be worked out — NVL has no
  // "replace the graph" call, only add/update and remove-by-id.
  const present = useRef({ nodes: new Set(), rels: new Set() })
  // Node ids to fit against, as an array, so a resize can re-fit without
  // waiting for the next graph change.
  const shown = useRef([])
  const fitted = useRef(-1)
  const hoveredId = useRef(null)
  const fitTimer = useRef(null)

  const handlers = useRef({})
  handlers.current = { onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick }

  useEffect(() => {
    // Captions only render on the canvas backend — the WebGL one drops them
    // entirely, which is most of what makes it fast and is exactly the trade
    // worth seeing rather than reading about. Fixed at construction: a caller
    // that wants the other one remounts this component.
    // (`useWebGL` used to sit alongside this and is not an NvlOptions key at
    // all — `renderer` is the only switch. Removed rather than kept as a
    // reassuring no-op.)
    const instance = new NVL(frame.current, [], [], Object.assign({}, OPTIONS, {
      renderer: renderer === 'webgl' ? 'webgl' : 'canvas'
    }))

    // Callbacks live on handler instances and are registered by name, not
    // passed as props. The ref indirection above is what keeps a changed
    // handler from forcing the canvas to be rebuilt.
    const click = new ClickInteraction(instance)
    click.updateCallback('onNodeClick', node => handlers.current.onNodeClick(node.id))
    click.updateCallback('onRelationshipClick', rel => handlers.current.onEdgeClick(rel.id))
    click.updateCallback('onCanvasClick', () => handlers.current.onBackgroundClick())

    const hover = new HoverInteraction(instance)
    // `onHover` fires on **every mousemove**, hit or miss, so without this
    // dedupe it thrashes React state continuously while the pointer moves.
    hover.updateCallback('onHover', (element, hit, event) => {
      const id = element && element.id && !element.from ? element.id : null
      if (id === hoveredId.current) return
      hoveredId.current = id
      handlers.current.onNodeHover(id, id ? { x: event.clientX, y: event.clientY } : null)
    })

    parts.current = [click, hover, new PanInteraction(instance), new ZoomInteraction(instance), new DragNodeInteraction(instance)]
    nvl.current = instance

    // The benchmark's handle. NVL is the only engine here that exposes zoom and
    // pan as one call — `setZoomAndPan` exists precisely because setting them
    // separately jitters — so the two are kept apart only to match the shared
    // contract, and a scenario that drives both per frame pays for that.
    if (onViewport) {
      onViewport({
        zoomBy: factor => instance.setZoom(instance.getScale() * factor),
        panBy: (dx, dy) => {
          const at = instance.getPan()
          instance.setPan(at.x + dx, at.y + dy)
        },
        fit: () => { if (shown.current.length) instance.fit(shown.current) }
      })
    }

    return () => {
      if (onViewport) onViewport(null)
      clearTimeout(fitTimer.current)
      parts.current.forEach(part => part.destroy())
      parts.current = []
      instance.destroy()
      nvl.current = null
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

  useEffect(() => {
    const instance = nvl.current
    if (!instance) return
    const started = performance.now()

    const nodes = graph.nodes.filter(n => positions[n.id]).map(node => {
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
        color: nodeColor(meta.color, { explored: isExpanded(node.id), pending: isPending(node.id) }),
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

    // Removals first, then one add-and-update pass. `addAndUpdateElementsInGraph`
    // merges by id and leaves unmentioned properties alone, so it covers both
    // the newcomers and the restyle of everything already on screen — but it
    // never deletes, which is why the id sets above have to be kept.
    const wantNodes = new Set(nodes.map(n => n.id))
    const wantRels = new Set(rels.map(r => r.id))
    const goneNodes = Array.from(present.current.nodes).filter(id => !wantNodes.has(id))
    const goneRels = Array.from(present.current.rels).filter(id => !wantRels.has(id))
    if (goneRels.length) instance.removeRelationshipsWithIds(goneRels)
    if (goneNodes.length) instance.removeNodesWithIds(goneNodes)
    present.current = { nodes: wantNodes, rels: wantRels }
    shown.current = Array.from(wantNodes)

    instance.addAndUpdateElementsInGraph(nodes, rels)

    // NVL never re-fits when elements are added, so an expanding graph walks
    // off screen.
    if (fitted.current !== graph.nodes.length) {
      fitted.current = graph.nodes.length
      refit.current()
    }

    if (onStat) onStat(Math.round(performance.now() - started))
  }, [graph, positions, hidden, statusVersion, isExpanded, isPending, onStat])

  return <div className="canvas" ref={frame} />
}

export default React.memo(NvlGraph)
