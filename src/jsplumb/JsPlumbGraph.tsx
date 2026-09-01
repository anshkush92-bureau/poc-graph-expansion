import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowOverlay,
  BezierConnector,
  StateMachineConnector,
  newInstance
} from '@jsplumb/browser-ui'
import { ENTITY } from '../graph/data.ts'
import { isSelfEdge } from '../graph/ops.ts'
import { BONE, FLARE, INK, mix, nodeColor } from '../ui/theme.ts'
import { useResize } from '../ui/useResize.ts'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE jsPLUMB RENDERER — AND WHY IT IS THE ODD ONE OUT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * jsPlumb Community (`@jsplumb/browser-ui`) is **not a graph library**. It is a
 * connectivity toolkit: you give it DOM elements, it draws SVG connectors
 * between them and lets you drag them around. Everything a graph view normally
 * provides, it does not have:
 *
 * - **No layout.** Not "no good layouts" — none at all. Elements sit wherever
 *   CSS puts them. (Layouts live in jsPlumb *Toolkit*, which is commercial.)
 * - **No viewport.** No pan, no zoom, no fit. `setZoom` tells the connector
 *   maths about a scale you applied yourself; it does not apply one.
 * - **No data model.** There is no node list to diff against — connections are
 *   imperative objects you create and delete.
 *
 * Which means the two things the other seven engines hand you are hand-built
 * here, and they are most of this file:
 *
 * 1. **The nodes are React.** Ordinary absolutely-positioned divs, rendered by
 *    React from the shared positions. That is genuinely the nicest node model of
 *    the eight — a node is a component, so anything CSS can do, a node can do.
 * 2. **The viewport is a CSS transform** on the surface those divs live in,
 *    computed from the graph's bounding box, with `setZoom` telling jsPlumb the
 *    scale so it places connector endpoints correctly.
 *
 * The honest summary: on a graph this is a lot of scaffolding for a weaker
 * result. On a flowchart or a pipeline editor — a handful of boxes the user
 * wires together — it is the right tool and the others are overkill.
 */

const EDGE = '#2F3746'
const LOOP = '#7FD4E8'

// Breathing room around the graph's bounding box, in layout units.
const PAD = 90
// A lone root has a zero-sized box; give it something to be fitted against.
const MIN_SPAN = 700

const sizeOf = node => (node.level === 0 ? 38 : node.flagged ? 28 : 22)

const connectorFor = edge =>
  isSelfEdge(edge)
    ? // A bezier between an element and itself has no direction to bow in and
      // renders as a dot under the node. The state-machine connector is jsPlumb's
      // answer to exactly this case and draws a proper loop.
      { type: StateMachineConnector.type, options: { curviness: 12, loopbackRadius: 26 } }
    : { type: BezierConnector.type, options: { curviness: 28 } }

function JsPlumbGraph({
  graph,
  positions,
  hidden,
  isExpanded,
  isPending,
  // Load-bearing despite being unread. Nodes here are React elements coloured
  // during render, so unlike the canvas panes there is no effect to hang this
  // on — but the export below is React.memo'd, and on a status-only update
  // (explored/pending flipped, graph identity unchanged) this counter is the
  // one prop whose value differs. Drop it from the call site and the memo
  // short-circuits: the pane keeps its old colours until something else moves.
  statusVersion: _statusVersion,
  onNodeClick,
  onNodeHover,
  onEdgeClick,
  onBackgroundClick,
  onStat,
  onViewport
}) {
  const frame = useRef(null)
  const surface = useRef(null)
  const plumb = useRef(null)
  // id -> the div React rendered for that node, collected by ref callback.
  const els = useRef(new Map())
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 })
  // Bumped whenever the pane is resized, so the fit below re-runs against the
  // new box. There is no viewport object to ask — the fit *is* this state.
  const [measure, remeasure] = useState(0)
  useResize(frame, () => remeasure(n => n + 1))

  const handlers = useRef({})
  handlers.current = { onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick }

  useEffect(() => {
    const instance = newInstance({
      container: surface.current,
      // Endpoints are the little handles jsPlumb draws for building connections
      // by dragging. This graph is not an editor, so they are switched off and
      // only the line itself is drawn.
      endpoint: 'Blank',
      // Continuous anchors let a connector attach wherever on the disc's edge
      // is closest to the other end, which is what stops every line converging
      // on one point of a node with a dozen links.
      anchor: 'Continuous',
      paintStyle: { stroke: EDGE, strokeWidth: 1 },
      connectionsDetachable: false
    })

    instance.bind('connection:click', connection =>
      handlers.current.onEdgeClick(connection.getData().edgeId)
    )

    plumb.current = instance
    return () => {
      instance.destroy()
      plumb.current = null
    }
  }, [])

  /**
   * Fit the graph into the frame.
   *
   * Runs before paint, and before the connector pass below, because jsPlumb
   * computes endpoint geometry from the elements' *laid out* size — reading it
   * mid-transition would place every arrowhead slightly wrong.
   */
  useLayoutEffect(() => {
    const box = frame.current && frame.current.getBoundingClientRect()
    const points = graph.nodes.map(n => positions[n.id]).filter(Boolean)
    if (!box || !box.width || !points.length) return

    const xs = points.map(p => p.x)
    const ys = points.map(p => p.y)
    // Grow around the *centre*, not the origin. Widening a small graph's box by
    // moving only its far edge leaves the graph pinned to the top-left corner —
    // which is exactly what an unexpanded root looked like.
    const midX = (Math.min(...xs) + Math.max(...xs)) / 2
    const midY = (Math.min(...ys) + Math.max(...ys)) / 2
    const spanX = Math.max(Math.max(...xs) - Math.min(...xs) + PAD * 2, MIN_SPAN)
    const spanY = Math.max(Math.max(...ys) - Math.min(...ys) + PAD * 2, MIN_SPAN)
    const minX = midX - spanX / 2
    const minY = midY - spanY / 2
    const scale = Math.min(box.width / spanX, box.height / spanY)

    setView({
      scale,
      x: (box.width - spanX * scale) / 2 - minX * scale,
      y: (box.height - spanY * scale) / 2 - minY * scale
    })
  }, [graph, positions, measure])

  // Connectors, rebuilt whole on every change.
  //
  // There is no cheaper option: a jsPlumb connection is an object keyed by the
  // two elements it joins, not by an id we control, so working out which ones
  // survived an update costs more than recreating them. This is the pane's main
  // scaling cost and it is a property of the toolkit, not of this code.
  useEffect(() => {
    const instance = plumb.current
    if (!instance) return
    const started = performance.now()

    instance.setZoom(view.scale)
    instance.deleteEveryConnection()

    graph.edges.forEach(edge => {
      const from = els.current.get(edge.source)
      const to = els.current.get(edge.target)
      if (!from || !to) return
      const color = isSelfEdge(edge) ? LOOP : EDGE
      instance.connect({
        source: from,
        target: to,
        data: { edgeId: edge.id },
        connector: connectorFor(edge),
        paintStyle: { stroke: color, strokeWidth: 1 },
        hoverPaintStyle: { stroke: BONE, strokeWidth: 2 },
        overlays: [
          { type: ArrowOverlay.type, options: { location: 1, width: 8, length: 9, foldback: 0.7 } }
        ]
      })
    })

    // `repaintEverything` after the batch rather than per connection: each
    // `connect` would otherwise trigger its own geometry pass.
    instance.repaintEverything()

    if (onStat) onStat(Math.round(performance.now() - started))
  }, [graph, positions, view.scale, onStat])

  /**
   * The benchmark's handle — and the one place where publishing it is itself a
   * result.
   *
   * jsPlumb Community has no viewport, so there is no library call to forward
   * to. What gets driven here is the CSS transform this file builds by hand,
   * which means every zoom frame goes through React state, re-renders every node
   * div, and — because the connector effect below depends on `view.scale` —
   * deletes and recreates every connection. That is not this wrapper being
   * naive: a connection is keyed by the two elements it joins, so there is
   * nothing cheaper to do. The zoom/pan numbers for this pane are the cost of
   * having no viewport, measured rather than asserted.
   */
  useEffect(() => {
    if (!onViewport) return undefined
    onViewport({
      zoomBy: factor =>
        setView(v => {
          const box = frame.current
            ? frame.current.getBoundingClientRect()
            : { width: 0, height: 0 }
          const cx = box.width / 2
          const cy = box.height / 2
          return {
            scale: v.scale * factor,
            x: cx - (cx - v.x) * factor,
            y: cy - (cy - v.y) * factor
          }
        }),
      panBy: (dx, dy) => setView(v => Object.assign({}, v, { x: v.x + dx, y: v.y + dy })),
      // The fit *is* the layout effect above, and the only way to ask for it is
      // to tell it the box changed.
      fit: () => remeasure(n => n + 1)
    })
    return () => onViewport(null)
  }, [onViewport])

  const collect = (id, el) => {
    if (el) els.current.set(id, el)
    else els.current.delete(id)
  }

  return (
    <div
      className="canvas plumb"
      ref={frame}
      onClick={event => {
        if (event.target === frame.current) handlers.current.onBackgroundClick()
      }}
    >
      <div
        className="plumb__surface"
        ref={surface}
        style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
      >
        {graph.nodes.map(node => {
          const at = positions[node.id]
          if (!at) return null
          const meta = ENTITY[node.type]
          const behind = hidden.get(node.id) || 0
          const size = sizeOf(node)
          return (
            <div
              key={node.id}
              ref={el => collect(node.id, el)}
              className={'plumb__node' + (node.flagged ? ' is-flagged' : '')}
              style={{
                left: at.x - size / 2,
                top: at.y - size / 2,
                width: size,
                height: size,
                background: nodeColor(meta.color, {
                  explored: isExpanded(node.id),
                  pending: isPending(node.id)
                }),
                borderColor: node.flagged ? FLARE : mix(meta.color, INK, 0.4),
                opacity: isPending(node.id) ? 0.55 : 1
              }}
              onClick={() => handlers.current.onNodeClick(node.id)}
              onMouseEnter={e =>
                handlers.current.onNodeHover(node.id, { x: e.clientX, y: e.clientY })
              }
              onMouseLeave={() => handlers.current.onNodeHover(null, null)}
            >
              {/* Counter-scaled so captions stay legible as the fit zooms out.
                  A node is a real DOM element here, which is the one thing this
                  engine does better than every canvas pane — but it also means
                  the browser lays out one element per node, and at a few
                  thousand nodes that is the ceiling. */}
              <span
                className="plumb__label"
                style={{ transform: `translateX(-50%) scale(${1 / view.scale})` }}
              >
                {meta.tag} {node.name}
                {behind > 0 ? `  +${behind}` : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(JsPlumbGraph)
