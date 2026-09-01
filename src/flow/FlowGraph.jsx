import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import ReactFlow, {
  EdgeText,
  Handle,
  Position,
  ReactFlowProvider,
  isEdge,
  useStoreState,
  useZoomPanHelper
} from 'react-flow-renderer'
import { ENTITY } from '../graph/data.js'
import { isSelfEdge } from '../graph/ops.js'
import { BONE, FLARE, INK, mix, nodeColor } from '../ui/theme.js'
import { useResize } from '../ui/useResize.js'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE REACT FLOW v9 RENDERER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The only engine here whose peer range names React 16 on purpose
 * (`react: 16 || 17`), and the only one where a node is a **real React
 * component**. The discs below are HTML and CSS — the risk number, the `+N`
 * hidden badge, the flagged glow are all ordinary markup, and anything the
 * product design team can draw, a node can be. Every canvas engine in this
 * comparison would need custom drawing code for the same result.
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
 * - `onElementClick` fires from react-draggable's **`onDragStop`**, not the
 *   node's own `onClick`, whenever nodes are draggable. Node clicks are bound
 *   on the custom node component instead, where they behave.
 * - Inline `width`/`height` on a node makes v9 skip measuring the DOM, after
 *   which it logs `couldn't create edge for source handle id: null`. Nodes are
 *   sized from CSS so it can measure them.
 * - `nodeTypes` / `edgeTypes` must be **module-level constants**. A fresh object
 *   identity on each render rebuilds every node and edge.
 * - `deleteKeyCode` defaults to Backspace deleting the selection. Deletion here
 *   is an explicit side-panel action, so it is disabled.
 * - `smoothstep` drops every edge onto one horizontal band and stacks the
 *   labels; `straight` spreads them.
 */

const EDGE = '#2F3746'
const LOOP = '#7FD4E8'

/** Node visuals as a React component — the thing this engine is here for. */
function DiscNode({ data }) {
  return (
    <div
      className={'flow-node' + (data.flagged ? ' is-flagged' : '')}
      style={{ '--disc': data.color, '--ring': data.border, opacity: data.pending ? 0.55 : 1 }}
      onClick={data.onClick}
      onMouseEnter={data.onEnter}
      onMouseLeave={data.onLeave}
    >
      {/* v9 resolves every edge endpoint through a Handle. Both are hidden and
          sit at the disc's centre, so edges leave from the middle of the node
          the way they do on the canvas panes. */}
      <Handle type="target" position={Position.Left} className="flow-node__handle" />
      <Handle type="source" position={Position.Right} className="flow-node__handle" />
      <span className="flow-node__risk">{data.risk}</span>
      {data.behind > 0 && <span className="flow-node__badge">+{data.behind}</span>}
      <span className="flow-node__label">{data.label}</span>
    </div>
  )
}

/**
 * Self-edges, which v9 cannot draw.
 *
 * `bezier` and `smoothstep` both collapse to nothing when source and target are
 * the same node: the two endpoints resolve to the same handle coordinates and
 * there is no curve left. So the loop is an explicit cubic arc out to the right
 * and back.
 *
 * The label is pushed clear of the disc rather than sat at the midpoint — nodes
 * paint above edges, so a closer label has its first half hidden behind the
 * circle.
 */
function SelfLoopEdge({ id, sourceX, sourceY, style, data }) {
  const reach = 62
  const path = `M ${sourceX},${sourceY} C ${sourceX + reach},${sourceY - reach} ` +
    `${sourceX + reach},${sourceY + reach} ${sourceX},${sourceY}`
  return (
    <React.Fragment>
      <path id={id} d={path} className="react-flow__edge-path" style={style} fill="none" />
      {data && data.label && (
        <EdgeText x={sourceX + reach + 6} y={sourceY} label={data.label} labelBgPadding={[2, 1]} />
      )}
    </React.Fragment>
  )
}

// Module-level, for the reason in the header comment: a fresh identity here
// rebuilds every node and edge on every render.
const NODE_TYPES = { disc: DiscNode }
const EDGE_TYPES = { selfloop: SelfLoopEdge }

// `maxZoom` is the important half. A one-node graph has a bounding box the size
// of one disc, and an uncapped fit scales it to the pane — the root fills the
// whole thing. The component still allows zooming to 4 by hand; this caps only
// what an automatic fit is allowed to do, matching the other panes' 1:1 rule.
const FIT = { padding: 0.15, maxZoom: 1 }

function FlowCanvas({
  graph, positions, hidden, isExpanded, isPending, statusVersion,
  onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick, onStat, onViewport
}) {
  const { fitView, transform: setTransform } = useZoomPanHelper()
  const fitted = useRef(-1)
  const frame = useRef(null)

  // v9's viewport is store state, and the helper only writes it — there is no
  // getter. Mirroring it into a ref is what lets the relative `zoomBy` in the
  // shared contract be turned into the absolute transform this engine wants.
  const view = useStoreState(state => state.transform)
  const viewRef = useRef(view)
  viewRef.current = view

  const handlers = useRef({})
  handlers.current = { onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick }

  // How long the last element build took, written during the memo and reported
  // from an effect. `onStat` sets state in App, and doing that from inside a
  // useMemo is a state update during another component's render — React 16
  // warns, and it can loop.
  const cost = useRef(0)

  const elements = useMemo(() => {
    const started = performance.now()

    const nodes = graph.nodes.filter(n => positions[n.id]).map(node => {
      const meta = ENTITY[node.type]
      return {
        id: node.id,
        type: 'disc',
        position: positions[node.id],
        data: {
          label: `${meta.tag} ${node.name}`,
          risk: node.risk,
          behind: hidden.get(node.id) || 0,
          flagged: !!node.flagged,
          pending: isPending(node.id),
          color: nodeColor(meta.color, { explored: isExpanded(node.id), pending: isPending(node.id) }),
          border: node.flagged ? FLARE : mix(meta.color, INK, 0.4),
          onClick: () => handlers.current.onNodeClick(node.id),
          onEnter: e => handlers.current.onNodeHover(node.id, { x: e.clientX, y: e.clientY }),
          onLeave: () => handlers.current.onNodeHover(null, null)
        }
      }
    })

    const edges = graph.edges.map(edge => {
      const loop = isSelfEdge(edge)
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: loop ? 'selfloop' : 'straight',
        label: loop ? undefined : edge.label,
        data: loop ? { label: edge.label } : undefined,
        arrowHeadType: loop ? undefined : 'arrowclosed',
        style: { stroke: loop ? LOOP : EDGE, strokeWidth: 1 },
        labelStyle: { fill: '#6B7385', fontSize: 8 },
        labelBgStyle: { fill: INK, fillOpacity: 0.8 }
      }
    })

    cost.current = Math.round(performance.now() - started)
    return nodes.concat(edges)
    // statusVersion is in here because expansion status lives in a ref: without
    // it, a node finishing its fetch would not change any value this reads.
  }, [graph, positions, hidden, statusVersion, isExpanded, isPending])

  useEffect(() => {
    if (onStat) onStat(cost.current)
  }, [elements, onStat])

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
  // origin, the same correction the canvas panes need: `transform` sets the
  // top-left offset directly, so the pan has to be worked out by hand.
  useEffect(() => {
    if (!onViewport) return undefined
    onViewport({
      zoomBy: factor => {
        const [x, y, zoom] = viewRef.current
        const box = frame.current ? frame.current.getBoundingClientRect() : { width: 0, height: 0 }
        const cx = box.width / 2
        const cy = box.height / 2
        setTransform({ x: cx - (cx - x) * factor, y: cy - (cy - y) * factor, zoom: zoom * factor })
      },
      panBy: (dx, dy) => {
        const [x, y, zoom] = viewRef.current
        setTransform({ x: x + dx, y: y + dy, zoom })
      },
      fit: () => fitView(FIT)
    })
    return () => onViewport(null)
  }, [onViewport, setTransform, fitView])

  // v9 has no `onEdgeClick` — that arrived in v10. Everything clickable comes
  // through one `onElementClick`, and you sort nodes from edges yourself with
  // the exported `isEdge`. Nodes are excluded here because their click is bound
  // on the custom node component: `onElementClick` fires from react-draggable's
  // `onDragStop` for a draggable node, so a drag to read the graph underneath
  // would otherwise expand it.
  const onElementClick = useCallback((_, element) => {
    if (isEdge(element)) handlers.current.onEdgeClick(element.id)
  }, [])
  const onPaneClicked = useCallback(() => handlers.current.onBackgroundClick(), [])

  // Wrapped rather than given the ref directly: v9's ReactFlow is a plain
  // function component and does not forward one.
  return (
    <div className="canvas" ref={frame}>
      <ReactFlow
        elements={elements}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onElementClick={onElementClick}
        onPaneClick={onPaneClicked}
        // Backspace would otherwise delete the selection; deletion is the side
        // panel's job, against state both this and every other pane share.
        deleteKeyCode={null}
        nodesConnectable={false}
        selectNodesOnDrag={false}
        // v9 renders one DOM subtree per node. Culling what is off-screen is the
        // only thing that keeps a few thousand nodes interactive at all — and it
        // is still, by a distance, the heaviest pane at that size.
        onlyRenderVisibleElements
        minZoom={0.02}
        maxZoom={4}
      />
    </div>
  )
}

const Memoised = React.memo(FlowCanvas)

// `useZoomPanHelper` only works inside a provider, and the provider has to sit
// outside the component that uses it.
export default function FlowGraph(props) {
  return (
    <ReactFlowProvider>
      <Memoised {...props} />
    </ReactFlowProvider>
  )
}
