import React, { useEffect, useRef } from 'react'
// The standalone bundle. vis-network declares `vis-data`, `keycharm`,
// `component-emitter`, `uuid` and `@egjs/hammerjs` as *peer* dependencies, so
// the plain entry point expects the host app to have installed all five. The
// standalone build has them rolled in, which is one dependency in package.json
// instead of six.
import { DataSet, Network } from 'vis-network/standalone'
import { ENTITY } from '../graph/data.ts'
import { isSelfEdge } from '../graph/ops.ts'
import { BONE, FLARE, INK, mix, nodeColor } from '../ui/theme.ts'
import { useResize } from '../ui/useResize.ts'
import type { GraphEdge, GraphNode, GraphPaneProps, Point, Positions } from '../engine/types.ts'

/**
 * The vis-network renderer.
 *
 * vis-network is the closest thing here to a drop-in: nodes and edges are
 * `DataSet`s, the network observes them, and an `update()` call diffs and
 * redraws by itself. There is no option-object rebuild and no manual add/remove
 * pass — this is the shortest data effect of the eight.
 *
 * Two things it does that the others do not:
 *
 * - **Self-edges are native and shaped.** `selfReference` sets the loop's size
 *   and where it sits, so no pivot detour is needed.
 * - **Labels carry their own font styling per node**, including a stroke, so
 *   dense captions stay readable without a separate text layer.
 *
 * The physics engine is switched **off**. vis-network's Barnes-Hut solver is
 * genuinely good and would be the right call in a real app, but every pane in
 * this POC draws the shared `layoutRadial` output so the comparison stays about
 * rendering. `fixed` pins each node against the solver while still allowing a
 * deliberate drag.
 */

const EDGE = '#2F3746'
const LOOP = '#7FD4E8'

const nodeFor = (
  node: GraphNode,
  positions: Positions,
  hidden: ReadonlyMap<string, number>,
  explored: boolean,
  pending: boolean
) => {
  const meta = ENTITY[node.type]
  const behind = hidden.get(node.id) || 0
  // Non-null: callers filter to nodes the layout has placed.
  const at = positions[node.id]!
  const fill = nodeColor(meta.color, { explored, pending })
  return {
    id: node.id,
    x: at.x,
    y: at.y,
    // Pinned rather than physics-driven, but still draggable by hand: `fixed`
    // only stops the solver moving a node, not the pointer.
    fixed: true,
    shape: 'dot',
    size: node.level === 0 ? 19 : node.flagged ? 14 : 11,
    opacity: pending ? 0.55 : 1,
    label: `${meta.tag} ${node.name}` + (behind > 0 ? `  +${behind}` : ''),
    color: {
      background: fill,
      border: node.flagged ? FLARE : mix(meta.color, INK, 0.4),
      highlight: { background: mix(meta.color, BONE, 0.4), border: BONE },
      hover: { background: mix(meta.color, BONE, 0.4), border: BONE }
    },
    borderWidth: node.flagged ? 3 : 1,
    font: {
      color: BONE,
      size: 11,
      face: 'Inter Tight',
      strokeWidth: 3,
      strokeColor: INK,
      vadjust: 2
    }
  }
}

const edgeFor = (edge: GraphEdge) => ({
  id: edge.id,
  from: edge.source,
  to: edge.target,
  label: edge.label || '',
  arrows: { to: { enabled: true, scaleFactor: 0.5 } },
  // `hover` is the adjacency highlight's half of this: vis's
  // `hoverConnectedEdges` (on by default) puts every edge touching the hovered
  // node into its hover state, and without a hover colour declared that state
  // looks identical to the resting one.
  color: { color: isSelfEdge(edge) ? LOOP : EDGE, highlight: BONE, hover: BONE, opacity: 0.9 },
  font: {
    color: '#6B7385',
    size: 9,
    face: 'Inter Tight',
    strokeWidth: 3,
    strokeColor: INK,
    align: 'top'
  },
  // Loops arch above the node, matching where the other engines put theirs, so
  // a self-edge reads the same whichever pane you are looking at.
  selfReference: { size: 22, angle: Math.PI / 2, renderBehindTheNode: false }
})

const OPTIONS = {
  physics: { enabled: false },
  layout: { improvedLayout: false }, // no solver runs, so skip the O(n²) prep
  interaction: {
    hover: true,
    dragNodes: true,
    dragView: true,
    zoomView: true,
    // The hover card carries the summary and its two buttons; vis's own tooltip
    // cannot hold a button, and two floating panels would compete.
    tooltipDelay: 1e9,
    navigationButtons: false
  },
  edges: {
    smooth: { enabled: true, type: 'continuous', roundness: 0.15 },
    width: 1,
    // Colour alone is not enough to pick a 1px line out of a dense graph.
    hoverWidth: 1.5,
    selectionWidth: 1.5
  },
  nodes: { shapeProperties: { interpolation: false } }
}

function VisGraph({
  graph,
  positions,
  hidden,
  isExpanded,
  isPending,
  statusVersion,
  onNodeClick,
  onNodeHover,
  onEdgeClick,
  onBackgroundClick,
  onStat,
  onViewport
}: GraphPaneProps) {
  const frame = useRef<HTMLDivElement>(null)
  const net = useRef<Network | null>(null)
  const nodes = useRef<DataSet<ReturnType<typeof nodeFor>>>(null)
  const edges = useRef<DataSet<ReturnType<typeof edgeFor>>>(null)
  const fitted = useRef(-1)

  const handlers = useRef<Pick<
    GraphPaneProps,
    'onNodeClick' | 'onNodeHover' | 'onEdgeClick' | 'onBackgroundClick'
  > | null>(null)
  handlers.current = { onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick }

  // Where the pointer last was, in page coordinates.
  //
  // vis's `hoverNode` payload carries the node id but no reliable screen point —
  // `pointer.DOM` is canvas-relative and `event` is a Hammer event whose shape
  // has changed between releases. Tracking the raw mousemove on the container is
  // both simpler and stable across versions.
  const pointer = useRef<Point>({ x: 0, y: 0 })

  useEffect(() => {
    const el = frame.current!
    nodes.current = new DataSet<ReturnType<typeof nodeFor>>([])
    edges.current = new DataSet<ReturnType<typeof edgeFor>>([])
    const instance = new Network(el, { nodes: nodes.current, edges: edges.current }, OPTIONS)

    const track = (event: MouseEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY }
    }
    el.addEventListener('mousemove', track)

    instance.on('click', params => {
      if (params.nodes.length) handlers.current?.onNodeClick(String(params.nodes[0]))
      else if (params.edges.length) handlers.current?.onEdgeClick(String(params.edges[0]))
      else handlers.current?.onBackgroundClick()
    })
    instance.on('hoverNode', params =>
      handlers.current?.onNodeHover(String(params.node), pointer.current)
    )
    instance.on('blurNode', () => handlers.current?.onNodeHover(null, null))

    // The other direction, which vis does *not* do for itself: hovering an edge
    // highlights the edge but says nothing about the two nodes it joins. There
    // is no adjacency focus to switch on, so the two endpoints are put into
    // their own hover colours by hand and put back on the way out.
    //
    // Two DataSet updates per hover, not a pass over the graph — `getConnectedNodes`
    // is an index lookup, and only the two rows that changed are written.
    let litNodes: string[] = []
    const relight = (ids: string[]) => {
      const set = nodes.current
      if (!set) return
      const off = litNodes.filter(id => !ids.includes(id))
      litNodes = ids
      // `borderWidth` and the border colour together, because a flagged node
      // already carries a 3px flare border and only the colour separates them.
      set.update(
        off
          .flatMap(id => {
            const row = set.get(id)
            return row ? [row] : []
          })
          .map(row => ({ id: row.id, borderWidth: row.color.border === FLARE ? 3 : 1 }))
      )
      set.update(ids.map(id => ({ id, borderWidth: 4 })))
    }
    instance.on('hoverEdge', params =>
      relight(instance.getConnectedNodes(String(params.edge)).map(String))
    )
    instance.on('blurEdge', () => relight([]))
    // Dragging the canvas under a hovered node never fires blurNode, so the card
    // would be left floating over a node that has moved out from under it.
    instance.on('dragStart', () => handlers.current?.onNodeHover(null, null))

    net.current = instance

    // The benchmark's handle. `moveTo` is vis's own viewport call, so a scripted
    // zoom takes exactly the path a wheel event takes — the pan is converted out
    // of pixels into world units first, since `position` is in graph space.
    if (onViewport) {
      onViewport({
        zoomBy: (factor: number) =>
          instance.moveTo({ scale: instance.getScale() * factor, animation: false }),
        panBy: (dx: number, dy: number) => {
          const scale = instance.getScale() || 1
          const at = instance.getViewPosition()
          instance.moveTo({
            position: { x: at.x + dx / scale, y: at.y + dy / scale },
            animation: false
          })
        },
        fit: () => refit.current()
      })
    }

    return () => {
      el.removeEventListener('mousemove', track)
      if (onViewport) onViewport(null)
      instance.destroy()
      net.current = null
    }
    // Mount-only on purpose: `onViewport` is a stable callback from the bench and
    // absent everywhere else, and re-running this would rebuild the canvas.
  }, [])

  /**
   * Re-measure and fit.
   *
   * `redraw()` makes vis pick up the container's current size — this pane is a
   * lazily-loaded chunk mounted into a grid cell, so the size it read at
   * construction can be stale or zero.
   *
   * Then a zoom clamp, for the opposite failure to Cytoscape's: `fit` has no
   * limits, and a graph whose bounding box is smaller than the canvas gets
   * fitted against a default world extent, so the nodes come out a few pixels
   * across with unreadable captions. 1:1 either way — never magnified, and never
   * shrunk when the graph already fits.
   */
  const refit = useRef(() => {
    const instance = net.current
    if (!instance) return
    instance.redraw()
    instance.fit({ animation: false })
    if (instance.getScale() > 1) instance.moveTo({ scale: 1, animation: false })
  })

  useResize(frame, () => refit.current())

  useEffect(() => {
    if (!net.current) return
    const started = performance.now()

    // DataSet.update is an upsert keyed on id, so this one call covers both the
    // newcomers and the restyle of everything already on screen. Removal is the
    // only part that has to be worked out here.
    const wantNodes = new Set(graph.nodes.map(n => n.id))
    const wantEdges = new Set(graph.edges.map(e => e.id))
    const nodeSet = nodes.current!
    const edgeSet = edges.current!
    const goneNodes = nodeSet.getIds().filter(id => !wantNodes.has(String(id)))
    const goneEdges = edgeSet.getIds().filter(id => !wantEdges.has(String(id)))
    if (goneNodes.length) nodeSet.remove(goneNodes)
    if (goneEdges.length) edgeSet.remove(goneEdges)

    nodeSet.update(
      graph.nodes
        .filter(n => positions[n.id])
        .map(n => nodeFor(n, positions, hidden, isExpanded(n.id), isPending(n.id)))
    )
    edgeSet.update(graph.edges.map(edgeFor))

    if (fitted.current !== graph.nodes.length) {
      refit.current()
      fitted.current = graph.nodes.length
    }

    if (onStat) onStat(Math.round(performance.now() - started))
  }, [graph, positions, hidden, statusVersion, isExpanded, isPending, onStat])

  return <div className="canvas" ref={frame} />
}

export default React.memo(VisGraph)
