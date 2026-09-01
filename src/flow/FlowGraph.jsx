import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  MarkerType,
  EdgeText,
  applyNodeChanges,
  useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ENTITY } from '../graph/data.js'
import { isSelfEdge } from '../graph/ops.js'
import { FLARE, INK, mix, nodeColor } from '../ui/theme.js'
import { useResize } from '../ui/useResize.js'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE REACT FLOW v12 RENDERER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The only engine here where a node is a **real React component**. The discs
 * below are HTML and CSS — the risk number, the `+N` hidden badge, the flagged
 * glow are ordinary markup, and anything the design team can draw, a node can
 * be. Every canvas engine in this comparison would need custom drawing code for
 * the same result.
 *
 * ── The catch: no layout engine at all ─────────────────────────────────────
 * Not "weak layouts" — none. Nodes render exactly where you put them. A graph
 * that grows by expansion therefore needs a layout you write and maintain, and
 * that is the origin of `layoutRadial` in `graph/ops.js`: ~90 lines plus its
 * tests that exist solely because of this engine. It took three attempts —
 * top-down tree (19,000px wide at 116 nodes), radial with leaf-proportional
 * wedges (degenerated into a single arc), then radial with one equal angular
 * slot per leaf, which is what ships. Budget for it; it is not optional.
 *
 * ── Traps this file is shaped around ───────────────────────────────────────
 * - `nodeTypes` / `edgeTypes` must be **module-level constants**. A fresh
 *   object identity on each render rebuilds every node and edge.
 * - Inline `width`/`height` on a node makes the renderer skip measuring the
 *   DOM. Nodes are sized from CSS so it can measure them.
 * - `deleteKeyCode` defaults to Backspace deleting the selection. Deletion here
 *   is an explicit side-panel action, so it is disabled.
 * - `smoothstep` drops every edge onto one horizontal band and stacks the
 *   labels; `straight` spreads them.
 * - Self-edges still cannot be drawn by any built-in type: source and target
 *   resolve to the same handle coordinates and the curve collapses. Hence the
 *   explicit cubic arc in `SelfLoopEdge`.
 * - v12's controlled mode only persists a node's position when `onNodesChange`
 *   (or `defaultNodes`) is wired up. Without it, a drag still runs and fires
 *   `onNodeDragStart`/`onNodeDragStop`, but nothing writes the new coordinate
 *   back, so the disc snaps to wherever the `nodes` prop says it is on the
 *   very next render — silently, with no error.
 */

const EDGE = '#2F3746'
const LOOP = '#7FD4E8'

/** Node visuals as a React component — the thing this engine is here for. */
function DiscNode({ data }) {
  return (
    <div
      className={'flow-node' + (data.flagged ? ' is-flagged' : '')}
      style={{ '--disc': data.color, '--ring': data.border, opacity: data.pending ? 0.55 : 1 }}
    >
      {/* Every edge endpoint resolves through a Handle. Both are hidden and sit
          at the disc's centre, so edges leave from the middle of the node the
          way they do on the canvas panes. */}
      <Handle type="target" position={Position.Left} className="flow-node__handle" />
      <Handle type="source" position={Position.Right} className="flow-node__handle" />
      <span className="flow-node__risk">{data.risk}</span>
      {data.behind > 0 && <span className="flow-node__badge">+{data.behind}</span>}
      <span className="flow-node__label">{data.label}</span>
    </div>
  )
}

/**
 * Self-edges, which no built-in edge type can draw: both endpoints resolve to
 * the same coordinates and there is no curve left. So the loop is an explicit
 * cubic arc out to the right and back.
 *
 * The label is pushed clear of the disc rather than sat at the midpoint — nodes
 * paint above edges, so a closer label has its first half hidden behind the
 * circle.
 */
function SelfLoopEdge({ id, sourceX, sourceY, style, data }) {
  const reach = 62
  const path =
    `M ${sourceX},${sourceY} C ${sourceX + reach},${sourceY - reach} ` +
    `${sourceX + reach},${sourceY + reach} ${sourceX},${sourceY}`
  return (
    <>
      <path id={id} d={path} className="react-flow__edge-path" style={style} fill="none" />
      {data && data.label && (
        <EdgeText x={sourceX + reach + 6} y={sourceY} label={data.label} labelBgPadding={[2, 1]} />
      )}
    </>
  )
}

// Module-level, for the reason in the header: a fresh identity here rebuilds
// every node and edge on every render.
const NODE_TYPES = { disc: DiscNode }
const EDGE_TYPES = { selfloop: SelfLoopEdge }

// `maxZoom` is the important half. A one-node graph has a bounding box the size
// of one disc, and an uncapped fit scales it to the pane — the root fills the
// whole thing. Panning by hand can still reach zoom 4; this caps only what an
// automatic fit may do, matching the other panes' 1:1 rule.
const FIT = { padding: 0.15, maxZoom: 1 }

function FlowCanvas({
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
}) {
  const { fitView, setViewport, getViewport } = useReactFlow()
  const fitted = useRef(-1)
  const frame = useRef(null)

  const handlers = useRef({})
  handlers.current = { onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick }

  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  // Controlled mode: React Flow only applies a change (drag included) back
  // onto `nodes` if something is listening here. `applyNodeChanges` is the
  // library's own reducer for the change objects it emits.
  const onNodesChange = useCallback(changes => setNodes(nds => applyNodeChanges(changes, nds)), [])

  useEffect(() => {
    const started = performance.now()

    // Timed together, nodes and edges, because this is the whole update the
    // pane renders — matching how CytoscapeGraph and VisGraph measure theirs.
    const nextEdges = graph.edges.map(edge => {
      const loop = isSelfEdge(edge)
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: loop ? 'selfloop' : 'straight',
        label: loop ? undefined : edge.label,
        data: loop ? { label: edge.label } : undefined,
        markerEnd: loop ? undefined : { type: MarkerType.ArrowClosed },
        style: { stroke: loop ? LOOP : EDGE, strokeWidth: 1 },
        labelStyle: { fill: '#6B7385', fontSize: 8 },
        labelBgStyle: { fill: INK, fillOpacity: 0.8 }
      }
    })

    const nextNodeData = graph.nodes
      .filter(n => positions[n.id])
      .map(node => {
        const meta = ENTITY[node.type]
        const pending = isPending(node.id)
        return {
          id: node.id,
          seed: positions[node.id],
          data: {
            label: `${meta.tag} ${node.name}`,
            risk: node.risk,
            behind: hidden.get(node.id) || 0,
            flagged: !!node.flagged,
            pending,
            color: nodeColor(meta.color, { explored: isExpanded(node.id), pending }),
            border: node.flagged ? FLARE : mix(meta.color, INK, 0.4)
          }
        }
      })

    const took = Math.round(performance.now() - started)

    setNodes(prev => {
      const byId = new Map(prev.map(n => [n.id, n]))
      return nextNodeData.map(({ id, seed, data }) => ({
        id,
        type: 'disc',
        // Seeded once, from the shared layout, and never overwritten for a
        // node that already has one — mirrors CytoscapeGraph's rule, so a
        // hand-drag survives the next expansion instead of being undone by
        // it. `layoutRadial` is incremental precisely so this holds: an
        // existing node's coordinates never change underneath it.
        position: byId.get(id)?.position ?? seed,
        data
      }))
    })
    setEdges(nextEdges)

    if (onStat) onStat(took)
    // statusVersion is in here because expansion status lives in a ref: without
    // it, a node finishing its fetch would not change any value this reads.
  }, [graph, positions, hidden, statusVersion, isExpanded, isPending, onStat])

  useEffect(() => {
    if (fitted.current === graph.nodes.length) return
    fitted.current = graph.nodes.length
    // After paint: fitView measures rendered nodes, and on the frame the
    // elements change they have no size yet.
    const id = requestAnimationFrame(() => fitView(FIT))
    return () => cancelAnimationFrame(id)
  }, [graph.nodes.length, fitView])

  // This pane is a lazily-loaded chunk mounted into a grid cell, so the first
  // fitView above can measure a box that has not been laid out — which parks
  // the graph in a corner. Re-fit on the first real measurement.
  useResize(frame, () => fitView(FIT))

  // The benchmark's handle. Zooming about the pane's centre rather than the
  // origin, the same correction the canvas panes need: setViewport writes the
  // top-left offset directly, so the pan is worked out by hand. v12's
  // getViewport() means there is no need to mirror store state into a ref.
  useEffect(() => {
    if (!onViewport) return undefined
    onViewport({
      zoomBy: factor => {
        const { x, y, zoom } = getViewport()
        const box = frame.current ? frame.current.getBoundingClientRect() : { width: 0, height: 0 }
        const cx = box.width / 2
        const cy = box.height / 2
        setViewport({ x: cx - (cx - x) * factor, y: cy - (cy - y) * factor, zoom: zoom * factor })
      },
      panBy: (dx, dy) => {
        const { x, y, zoom } = getViewport()
        setViewport({ x: x + dx, y: y + dy, zoom })
      },
      fit: () => fitView(FIT)
    })
    return () => onViewport(null)
  }, [onViewport, setViewport, getViewport, fitView])

  // v12 gives node and edge clicks their own props, and a node click no longer
  // fires at the end of a drag — so the v9 workaround of binding the click
  // inside the custom node is gone, along with the per-node closures it needed.
  const handleNodeClick = useCallback((_, node) => handlers.current.onNodeClick(node.id), [])
  const handleEdgeClick = useCallback((_, edge) => handlers.current.onEdgeClick(edge.id), [])
  const handleNodeEnter = useCallback(
    (event, node) => handlers.current.onNodeHover(node.id, { x: event.clientX, y: event.clientY }),
    []
  )
  const handleNodeLeave = useCallback(() => handlers.current.onNodeHover(null, null), [])
  const handlePaneClick = useCallback(() => handlers.current.onBackgroundClick(), [])

  return (
    // Kept as a real element, not just a ref target: `useResize` below
    // observes it, `zoomBy` above reads its `getBoundingClientRect`, and
    // `styles.css` targets `.canvas > .react-flow` for sizing.
    <div className="canvas" ref={frame}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onNodeMouseEnter={handleNodeEnter}
        onNodeMouseLeave={handleNodeLeave}
        onPaneClick={handlePaneClick}
        // Backspace would otherwise delete the selection; deletion is the side
        // panel's job, against state every pane shares.
        deleteKeyCode={null}
        nodesConnectable={false}
        selectNodesOnDrag={false}
        // One DOM subtree per node. Culling what is off-screen is the only thing
        // that keeps a few thousand nodes interactive at all — and it is still,
        // by a distance, the heaviest pane at that size.
        onlyRenderVisibleElements
        minZoom={0.02}
        maxZoom={4}
        proOptions={{ hideAttribution: false }}
      />
    </div>
  )
}

const Memoised = React.memo(FlowCanvas)

// `useReactFlow` only works inside a provider, and the provider has to sit
// outside the component that uses it.
export default function FlowGraph(props) {
  return (
    <ReactFlowProvider>
      <Memoised {...props} />
    </ReactFlowProvider>
  )
}
