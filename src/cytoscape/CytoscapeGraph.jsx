import React, { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import { ENTITY } from '../graph/data.js'
import { isSelfEdge } from '../graph/ops.js'
import { BONE, FLARE, INK, mix, nodeColor } from '../ui/theme.js'
import { useResize } from '../ui/useResize.js'

/**
 * The Cytoscape.js renderer.
 *
 * Cytoscape is a graph library rather than a chart library, and it shows in
 * three places this file gets for free that the chart engines needed work for:
 *
 * 1. **Self-edges are native.** `withLoops` — the three-segment detour through
 *    invisible pivots that ECharts and FusionCharts both need — is not imported
 *    here. An edge whose source and target match draws as a loop above the node,
 *    labelled, arrowheaded, and it stays attached when the node is dragged.
 *
 * 2. **Styling is a selector stylesheet**, not per-element properties. The rules
 *    below are declared once at construction; elements carry data and the
 *    stylesheet maps it, so an update writes `data()` and never touches style.
 *
 * 3. **Diffing is first class.** `cy.getElementById` and `.remove()` mean an
 *    expansion adds only the new elements. Nothing is rebuilt, so pan, zoom and
 *    any hand-dragged position survive an update.
 *
 * What it does *not* do here is lay the graph out. Cytoscape ships breadthfirst,
 * cose, concentric, circle and grid, any of which would be a fair choice in a
 * real app — but every pane in this POC has to draw the same arrangement or the
 * comparison is about layouts rather than renderers. So `layout: preset` and the
 * coordinates come from the shared `layoutRadial`.
 */

const EDGE = '#2F3746'
const LOOP = '#7FD4E8'

// Cytoscape resolves fonts against the document, so the stylesheet names the
// same stack the rest of the app uses rather than a family only this file knows.
const UI = "'Inter Tight', system-ui, sans-serif"

const STYLE = [
  {
    selector: 'node',
    style: {
      'background-color': 'data(color)',
      'border-color': 'data(border)',
      'border-width': 'data(borderWidth)',
      width: 'data(size)',
      height: 'data(size)',
      label: 'data(label)',
      color: BONE,
      'font-family': UI,
      'font-size': 10,
      'text-valign': 'bottom',
      'text-margin-y': 5,
      // Node captions overlap heavily once the graph is dense. An outline is
      // cheaper than a background box and keeps the disc unobscured.
      'text-outline-color': INK,
      'text-outline-width': 2,
      'min-zoomed-font-size': 8 // Cytoscape's own LOD: stop drawing text that
    }                           // would be unreadable rather than draw mush.
  },
  {
    selector: 'edge',
    style: {
      width: 1,
      'line-color': 'data(color)',
      'target-arrow-color': 'data(color)',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 0.7,
      'curve-style': 'bezier',
      label: 'data(label)',
      color: '#6B7385',
      'font-family': UI,
      'font-size': 8,
      'text-rotation': 'autorotate',
      'min-zoomed-font-size': 9
    }
  },
  // A loop needs its own curve style: `bezier` on an edge whose endpoints are
  // the same point has no direction to bend in and collapses under the disc.
  {
    selector: 'edge.loop',
    style: { 'curve-style': 'loop', 'loop-direction': '0deg', 'loop-sweep': '-40deg' }
  },
  { selector: 'node.pending', style: { opacity: 0.55 } }
]

const dataFor = (node, hidden, explored, pending) => {
  const meta = ENTITY[node.type]
  const behind = hidden.get(node.id) || 0
  return {
    id: node.id,
    label: `${meta.tag} ${node.name}` + (behind > 0 ? `  +${behind}` : ''),
    color: nodeColor(meta.color, { explored, pending }),
    border: node.flagged ? FLARE : mix(meta.color, INK, 0.4),
    borderWidth: node.flagged ? 3 : 1,
    size: node.level === 0 ? 38 : node.flagged ? 28 : 22
  }
}

function CytoscapeGraph({
  graph, positions, hidden, isExpanded, isPending, statusVersion, renderer = 'canvas',
  onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick, onStat, onViewport
}) {
  const frame = useRef(null)
  const cy = useRef(null)
  // Node count at the last fit, so a refit happens when the graph grows or
  // shrinks and not merely when it is recoloured.
  const fitted = useRef(-1)

  const handlers = useRef({})
  handlers.current = { onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick }

  useEffect(() => {
    const instance = cytoscape({
      container: frame.current,
      style: STYLE,
      // Still the canvas renderer either way — `webgl` swaps the rasteriser
      // underneath it, so the geometry, the stylesheet and the hit testing are
      // identical and the flag is a fair A/B. Fixed at construction, so
      // switching it means remounting this component.
      renderer: { name: 'canvas', webgl: renderer === 'webgl' },
      // Cytoscape's own box-select and multi-select would fight the side panel,
      // which is the one place selection means anything in this app.
      boxSelectionEnabled: false,
      autounselectify: true,
      wheelSensitivity: 0.2,
      minZoom: 0.02,
      maxZoom: 4
    })

    // `tap` rather than `click`: it is Cytoscape's unified pointer event, and
    // unlike a raw click it does not fire at the end of a node drag — dragging
    // a node to read the graph underneath must not expand it.
    instance.on('tap', 'node', evt => handlers.current.onNodeClick(evt.target.id()))
    instance.on('tap', 'edge', evt => handlers.current.onEdgeClick(evt.target.id()))
    instance.on('tap', evt => { if (evt.target === instance) handlers.current.onBackgroundClick() })

    instance.on('mouseover', 'node', evt => {
      const e = evt.originalEvent
      handlers.current.onNodeHover(evt.target.id(), { x: e.clientX, y: e.clientY })
    })
    instance.on('mouseout', 'node', () => handlers.current.onNodeHover(null, null))

    cy.current = instance

    // The benchmark's handle. Cytoscape zooms about a point, so the pane's
    // centre is passed explicitly — zooming about the world origin would walk
    // the graph off screen over a long sweep and turn a render test into a
    // test of drawing nothing.
    if (onViewport) {
      onViewport({
        zoomBy: factor => instance.zoom({
          level: instance.zoom() * factor,
          renderedPosition: { x: instance.width() / 2, y: instance.height() / 2 }
        }),
        panBy: (dx, dy) => instance.panBy({ x: dx, y: dy }),
        fit: () => refit.current()
      })
    }

    return () => {
      if (onViewport) onViewport(null)
      instance.destroy()
      cy.current = null
    }
    // Mount-only: see the note on the same effect in VisGraph.
  }, [])

  /**
   * Re-measure the container and fit the graph into it.
   *
   * `resize()` first: Cytoscape caches the container's size, and this pane's
   * chunk is mounted lazily into a grid cell that may not have been laid out
   * yet — without it the fit is computed against a stale, often zero-sized box.
   *
   * The zoom ceiling is lowered for the duration of the fit. A one-node graph
   * has a bounding box the size of one disc, and an unclamped fit scales that to
   * the pane: the root comes out a circle several hundred pixels across, cropped
   * by its own pane. Cytoscape's `fit` honours `maxZoom`, so borrowing it for
   * the call is cheaper than fitting and correcting afterwards.
   */
  const refit = useRef(() => {
    const instance = cy.current
    if (!instance) return
    instance.resize()
    instance.maxZoom(1)
    instance.fit(undefined, 40)
    instance.maxZoom(4)
  })

  useResize(frame, () => refit.current())

  useEffect(() => {
    const instance = cy.current
    if (!instance) return
    const started = performance.now()

    // One batch for the whole update: without it Cytoscape re-runs style
    // resolution and schedules a redraw per element, which at a few thousand
    // nodes is the difference between an update and a freeze.
    instance.batch(() => {
      const wantNodes = new Set(graph.nodes.map(n => n.id))
      const wantEdges = new Set(graph.edges.map(e => e.id))
      instance.elements().forEach(el => {
        if (!(el.isNode() ? wantNodes : wantEdges).has(el.id())) el.remove()
      })

      graph.nodes.forEach(node => {
        const at = positions[node.id]
        if (!at) return
        const pending = isPending(node.id)
        const data = dataFor(node, hidden, isExpanded(node.id), pending)
        const existing = instance.getElementById(node.id)
        if (existing.nonempty()) {
          existing.data(data)
          // Position is *not* rewritten for a node that already has one. The
          // shared layout is incremental — an existing node's coordinates do
          // not change — and writing them back would undo any hand drag.
          existing.toggleClass('pending', pending)
          return
        }
        instance.add({ group: 'nodes', data, position: { x: at.x, y: at.y }, classes: pending ? 'pending' : '' })
      })

      graph.edges.forEach(edge => {
        if (instance.getElementById(edge.id).nonempty()) return
        instance.add({
          group: 'edges',
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.label || '',
            color: isSelfEdge(edge) ? LOOP : EDGE
          },
          classes: isSelfEdge(edge) ? 'loop' : ''
        })
      })
    })

    // Cytoscape never re-fits on its own, so an expanding graph walks off the
    // viewport. Refit only when the node count actually moved: an update that
    // just recolours nodes must not throw away the reader's pan and zoom.
    if (fitted.current !== graph.nodes.length) {
      refit.current()
      fitted.current = graph.nodes.length
    }

    if (onStat) onStat(Math.round(performance.now() - started))
  }, [graph, positions, hidden, statusVersion, isExpanded, isPending, onStat])

  return <div className="canvas" ref={frame} />
}

// Same reason as every other renderer here: hover sets state in App, and
// without memo that would re-run the update effect on every mouse move.
export default React.memo(CytoscapeGraph)
