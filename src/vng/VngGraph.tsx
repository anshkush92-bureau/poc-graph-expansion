import React, { useEffect, useRef, useState } from 'react'
import { createApp, h, reactive, shallowRef } from 'vue'
import VNetworkGraphPlugin, { VNetworkGraph, defineConfigs } from 'v-network-graph'
import type {
  Edge,
  Edges,
  Layouts,
  Node,
  Nodes,
  UserConfigs,
  VNetworkGraphInstance
} from 'v-network-graph'
import 'v-network-graph/lib/style.css'
import { ENTITY } from '../graph/data.ts'
import { isSelfEdge } from '../graph/ops.ts'
import { BONE, FLARE, INK, mix, nodeColor } from '../ui/theme.ts'
import { useResize } from '../ui/useResize.ts'
import type { GraphPaneProps } from '../engine/types.ts'

/**
 * What this pane puts in v-network-graph's `nodes` / `edges` maps. The library
 * types both as open records, and the config callbacks below read these fields.
 */
interface VngNode extends Node {
  name: string
  size: number
  color: string
  hoverColor: string
  strokeWidth: number
  strokeColor: string
}

interface VngEdge extends Edge {
  source: string
  target: string
  color: string
}

/** The one svg-pan-zoom member the viewport handle drives. */
interface PanZoom {
  zoomBy(factor: number): void
  panBy(by: { x: number; y: number }): void
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE v-network-graph RENDERER — AND THE ONE THAT IS NOT A REACT LIBRARY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * v-network-graph is a **Vue 3 component library**. There is no React binding,
 * official or community, and there is no framework-free core to wrap the way
 * ECharts, Cytoscape, vis-network and NVL all have. Its peer dependency is
 * literally `vue: ^3.5.13`.
 *
 * So this pane is a **Vue island**: a second framework, with its own runtime and
 * its own reactivity system, mounted into a div that React owns but never
 * renders into. That is not a workaround for React 16 specifically — it would be
 * exactly the same file on React 19.
 *
 * What that costs, stated plainly, because it is the finding for this engine:
 *
 * - **A second framework in the bundle.** Vue 3's runtime ships alongside React,
 *   and neither can use the other's components.
 * - **A manual bridge in both directions.** React props are copied into a Vue
 *   `reactive` store by hand in the data effect; Vue events are copied back out
 *   through a handler ref. Nothing is automatic.
 * - **Two reconcilers over one graph.** Vue deep-tracks every property of every
 *   node in `reactive`, which is real work React knows nothing about and cannot
 *   batch with its own.
 *
 * What you get for it is the most declarative renderer of the eight — the whole
 * drawing is a configs object — and genuinely good SVG output with native,
 * shaped self-loops.
 *
 * One real gap: **edge labels need a slot.** v-network-graph draws node labels
 * from `node.name` on its own, but a relationship label requires an
 * `#edge-label` template slot, which cannot be expressed from React without
 * writing a Vue component to hold it. This pane therefore draws unlabelled
 * edges, and that is a difference from every other pane rather than an oversight.
 */

const EDGE = '#2F3746'
const LOOP = '#7FD4E8'

/**
 * The node count past which this pane refuses to draw.
 *
 * Measured in this repo, one pane on screen and nothing else, time the main
 * thread is blocked on Build:
 *
 *     50 nodes  →  under 100 ms
 *    100 nodes  →  under 100 ms
 *    200 nodes  →  ~8 s
 *    300 nodes  →  ~15 s
 *    500 nodes  →  never finished; the tab stopped responding entirely
 *
 * None of that is our data prep, which reports 0–1 ms at every one of those
 * sizes. It is v-network-graph's own render: it is SVG with a Vue component per
 * node and per edge, and it does not scale.
 *
 * A ceiling rather than letting it hang, because a locked tab cannot be dialled
 * back down — the control that would fix it is on the same frozen page. The
 * refusal notice *is* the result for this engine at these sizes.
 */
const CEILING = 150

const CONFIGS = defineConfigs<VngNode, VngEdge>({
  view: {
    scalingObjects: true, // nodes shrink with zoom, matching the canvas engines
    minZoomLevel: 0.02,
    maxZoomLevel: 4,
    autoPanAndZoomOnLoad: 'fit-content'
  },
  node: {
    normal: {
      type: 'circle',
      radius: node => node.size,
      color: node => node.color,
      strokeWidth: node => node.strokeWidth,
      strokeColor: node => node.strokeColor
    },
    hover: { radius: node => node.size, color: node => node.hoverColor },
    selectable: false,
    focusring: { visible: false },
    label: {
      visible: true,
      fontFamily: 'Inter Tight',
      fontSize: 10,
      color: BONE,
      direction: 'south',
      margin: 5
    }
  },
  edge: {
    normal: { color: edge => edge.color, width: 1 },
    hover: { color: BONE, width: 1 },
    selectable: false,
    marker: { target: { type: 'arrow', width: 3, height: 3 } },
    // Native self-loops, sized to arch above the node like every other pane.
    selfLoop: { radius: 16, offset: 14, angle: 180, isClockwise: true }
  }
})

function VngGraph({
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
  // The Vue side: the app, the reactive store it renders, and a ref to the
  // component instance so the viewport can be refitted as the graph grows.
  const vue = useRef<ReturnType<typeof createApp> | null>(null)
  const store = useRef<{ nodes: Nodes; edges: Edges; layouts: Layouts } | null>(null)
  const instance = useRef<{ value: VNetworkGraphInstance | null } | null>(null)
  const fitted = useRef(-1)
  const [refused, setRefused] = useState(0)

  // The Vue component fits once on load, against whatever box existed then —
  // which for a lazily-mounted pane can be one that has not been laid out.
  useResize(frame, () => {
    instance.current?.value?.fitToContents()
  })

  const handlers = useRef<Pick<
    GraphPaneProps,
    'onNodeClick' | 'onNodeHover' | 'onEdgeClick' | 'onBackgroundClick'
  > | null>(null)
  handlers.current = { onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick }

  useEffect(() => {
    // `reactive` for the data — deep tracking is what makes the graph redraw
    // when a node's colour changes. `CONFIGS` stays a plain frozen constant:
    // wrapping it would build proxies for something that never changes.
    const state = reactive<{ nodes: Nodes; edges: Edges; layouts: Layouts }>({
      nodes: {},
      edges: {},
      layouts: { nodes: {} }
    })
    const graphRef = shallowRef<VNetworkGraphInstance | null>(null)

    // The component's own `zoomIn` / `zoomOut` are fixed steps with no
    // continuous form, so the viewport handle needs the svg-pan-zoom instance
    // underneath — which is only reachable through this config callback. It is
    // the one reason `CONFIGS` is copied here rather than passed as the frozen
    // module constant it is everywhere else.
    let panZoom: PanZoom | null = null
    const configs = {
      ...CONFIGS,
      view: {
        ...CONFIGS.view,
        onSvgPanZoomInitialized: (made: PanZoom) => {
          panZoom = made
        }
      }
    }

    const app = createApp({
      render: () =>
        h(VNetworkGraph, {
          ref: graphRef,
          nodes: state.nodes,
          edges: state.edges,
          layouts: state.layouts,
          // The component's props are declared over the library's base Node /
          // Edge, so a config typed against this pane's richer node does not
          // assign to it. The callbacks only ever see this pane's own nodes.
          configs: configs as UserConfigs,
          // Vue event names containing a colon do not camel-case, so the prop key
          // is the handler name spelled out. `@node:click` in a template is
          // `'onNode:click'` here.
          'onNode:click': ({ node }: { node: string }) => handlers.current?.onNodeClick(node),
          'onNode:pointerover': ({ node, event }: { node: string; event: PointerEvent }) =>
            handlers.current?.onNodeHover(node, { x: event.clientX, y: event.clientY }),
          'onNode:pointerout': () => handlers.current?.onNodeHover(null, null),
          'onEdge:click': ({ edge }: { edge: string }) => handlers.current?.onEdgeClick(edge),
          'onView:click': () => handlers.current?.onBackgroundClick()
        })
    })
    app.use(VNetworkGraphPlugin)
    app.mount(frame.current!)

    vue.current = app
    store.current = state
    instance.current = graphRef

    if (onViewport) {
      onViewport({
        zoomBy: (factor: number) => panZoom?.zoomBy(factor),
        panBy: (dx: number, dy: number) => panZoom?.panBy({ x: dx, y: dy }),
        fit: () => graphRef.value?.fitToContents()
      })
    }

    return () => {
      if (onViewport) onViewport(null)
      app.unmount()
      vue.current = store.current = instance.current = null
    }
    // Mount-only: see the note on the same effect in VisGraph.
  }, [])

  useEffect(() => {
    const state = store.current
    if (!state) return
    const started = performance.now()

    // Over the ceiling, hand Vue an empty graph and show why. Emptying rather
    // than leaving the last one is deliberate: a stale 150-node picture under a
    // notice saying 2,000 would be a lie about what this engine drew.
    if (graph.nodes.length > CEILING) {
      setRefused(graph.nodes.length)
      state.nodes = {}
      state.edges = {}
      state.layouts = { nodes: {} }
      fitted.current = -1
      if (onStat) onStat(0)
      return
    }
    setRefused(0)

    // Whole objects are reassigned rather than mutated key by key. Vue's
    // reactivity handles either, but a single assignment is one dependency
    // notification instead of one per node, which at a few thousand nodes is
    // the difference between a redraw and a stall.
    const nodes: Record<string, VngNode> = {}
    const layouts: Layouts['nodes'] = {}
    graph.nodes.forEach(node => {
      const at = positions[node.id]
      if (!at) return
      const meta = ENTITY[node.type]
      const behind = hidden.get(node.id) || 0
      nodes[node.id] = {
        name: `${meta.tag} ${node.name}` + (behind > 0 ? `  +${behind}` : ''),
        size: node.level === 0 ? 19 : node.flagged ? 14 : 11,
        color: nodeColor(meta.color, {
          explored: isExpanded(node.id),
          pending: isPending(node.id)
        }),
        hoverColor: mix(meta.color, BONE, 0.4),
        strokeWidth: node.flagged ? 3 : 1,
        strokeColor: node.flagged ? FLARE : mix(meta.color, INK, 0.4)
      }
      layouts[node.id] = { x: at.x, y: at.y }
    })

    const edges: Record<string, VngEdge> = {}
    graph.edges.forEach(edge => {
      edges[edge.id] = {
        source: edge.source,
        target: edge.target,
        color: isSelfEdge(edge) ? LOOP : EDGE
      }
    })

    state.nodes = nodes
    state.edges = edges
    state.layouts = { nodes: layouts }

    // `autoPanAndZoomOnLoad` fires once, so growth past the viewport is on us.
    // Vue renders on its own scheduler — the SVG does not exist yet on this
    // tick, and fitting before it does measures an empty box.
    if (fitted.current !== graph.nodes.length) {
      fitted.current = graph.nodes.length
      const graphRef = instance.current
      requestAnimationFrame(() => {
        graphRef?.value?.fitToContents()
      })
    }

    if (onStat) onStat(Math.round(performance.now() - started))
  }, [graph, positions, hidden, statusVersion, isExpanded, isPending, onStat])

  return (
    <React.Fragment>
      {/* Vue owns everything inside this div. React must never render children
          into it — `app.mount` replaces its contents. */}
      <div className="canvas canvas--vng" ref={frame} />
      {refused > 0 && (
        <p className="refusal">
          <b>{refused.toLocaleString()} nodes</b>
          v-network-graph draws one Vue component per node and per edge in SVG. Past ~{CEILING} it
          blocks the main thread for seconds, and by 500 the tab stops responding — so this pane
          declines rather than freezing the page. That ceiling is the result for this engine.
        </p>
      )}
    </React.Fragment>
  )
}

export default React.memo(VngGraph)
