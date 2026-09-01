import React from 'react'

/**
 * The engine registry — one entry per library under comparison.
 *
 * Every `Component` here takes the *same* props and is a dumb view over the
 * shared graph layer:
 *
 *   graph, positions, hidden, isExpanded, isPending, statusVersion
 *   onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick, onStat
 *   onViewport, renderer
 *
 * `renderer` is the paint backend, and only three of these eight have more than
 * one to offer: ECharts can draw the same series to canvas or to SVG, and
 * Cytoscape and NVL both have a WebGL path behind a flag. `renderers` below
 * lists what each accepts, first entry being the default. It is fixed at
 * construction in every case, so changing it means remounting the pane — the
 * lab does that with a key rather than trying to swap it live.
 *
 * `onViewport` is the one addition the benchmark needed. A pane calls it once
 * on mount with `{ zoomBy, panBy, fit }` — or with `null` if the library has no
 * viewport to drive — and again with `null` on unmount. Relative rather than
 * absolute (`zoomBy(1.1)`, not `zoomTo(2)`) because every engine here can
 * express a relative zoom and only some can express an absolute one.
 *
 * The scenarios in `bench/` drive the viewport through that handle and nothing
 * else, which is what keeps the zoom/pan test identical across all eight.
 *
 * That uniformity is the whole comparison. Node coordinates in particular come
 * from `layoutRadial` in App, not from each library's own layout engine, so
 * every pane draws the identical arrangement and the only variable left is the
 * drawing. Several of these libraries ship perfectly good layouts — that is
 * noted per engine below rather than used, because a side-by-side where each
 * pane arranges the graph differently compares nothing.
 *
 * ── Lazy on purpose ────────────────────────────────────────────────────────
 * `React.lazy` (React 16.6+) keeps a library out of the bundle until its pane
 * is actually selected. With eight engines loaded eagerly the entry chunk is
 * several megabytes and dominated by whichever library is heaviest — NVL alone
 * is ~509 KB gzipped. Selecting one pane should cost one library.
 */
export const ENGINES = {
  echarts: {
    name: 'Apache ECharts',
    lib: 'echarts 6.1',
    note: 'graph series · canvas · roam + drag · shape and edge pickers',
    surface: 'canvas',
    // The same series, the same option object, two paint backends. Worth having
    // as a knob: it is the one place in this repo where canvas vs SVG is a
    // one-word change with everything else held identical.
    renderers: ['canvas', 'svg'],
    caps: {
      viewport: 'roam · graphRoam action',
      layout: 'force, circular — unused here',
      lod: 'none built in',
      culling: 'none built in',
      images: 'symbol: image://… per node',
      routing: 'straight, curved by curveness'
    },
    Component: React.lazy(() => import('./echarts/EChartsGraph.jsx'))
  },
  fusion: {
    name: 'FusionCharts',
    lib: 'fusioncharts 4.2',
    note: 'PowerCharts dragnode · SVG · drag only · no node events, bridged from the DOM',
    surface: 'svg',
    renderers: ['svg'],
    caps: {
      // Not an omission: there is no pan/zoom in PowerCharts DragNode at all.
      // A "zoom" means recomputing the axis bounds and rebuilding the chart,
      // which is a full re-render, not a viewport transform.
      viewport: null,
      layout: 'none — coordinates only',
      lod: 'none',
      culling: 'none',
      images: 'none — shape is circle/rectangle',
      routing: 'straight only'
    },
    Component: React.lazy(() => import('./fusion/FusionGraph.jsx'))
  },
  cytoscape: {
    name: 'Cytoscape.js',
    lib: 'cytoscape 3.34',
    note: 'canvas · selector stylesheet · native self-loops · ships its own layouts (unused here)',
    surface: 'canvas',
    // 3.31+ ships a WebGL path behind `renderer: { name: 'canvas', webgl: true }`.
    // Still the canvas renderer's geometry — WebGL is the rasteriser under it —
    // so it is a fair A/B rather than a different library.
    renderers: ['canvas', 'webgl'],
    caps: {
      viewport: 'zoom() / panBy() · native',
      layout: 'breadthfirst, cose, concentric, circle, grid',
      lod: 'min-zoomed-font-size — automatic',
      culling: 'automatic, viewport-based',
      images: 'background-image per selector',
      routing: 'bezier, taxi, segments, haystack, loop'
    },
    Component: React.lazy(() => import('./cytoscape/CytoscapeGraph.jsx'))
  },
  vis: {
    name: 'vis-network',
    lib: 'vis-network 10.1',
    note: 'canvas · DataSet diffing · physics off so the shared layout wins',
    surface: 'canvas',
    renderers: ['canvas'],
    caps: {
      viewport: 'moveTo() / getScale() · native',
      layout: 'Barnes-Hut, repulsion, hierarchical',
      lod: 'scaling.label.drawThreshold',
      culling: 'automatic, viewport-based',
      images: 'shape: image / circularImage',
      routing: 'dynamic, continuous, cubicBezier, curvedCW'
    },
    Component: React.lazy(() => import('./vis/VisGraph.jsx'))
  },
  vng: {
    name: 'v-network-graph',
    lib: 'v-network-graph 0.9 + vue 3',
    note: 'SVG · Vue 3 only — mounted as a Vue island inside React 16',
    surface: 'svg',
    renderers: ['svg'],
    caps: {
      viewport: 'svg-pan-zoom · zoomBy / panBy',
      layout: 'force-layout module (d3-force)',
      lod: 'none',
      culling: 'none — one Vue component per element',
      images: '#override-node slot (Vue template required)',
      routing: 'straight, curved, selfLoop'
    },
    Component: React.lazy(() => import('./vng/VngGraph.jsx'))
  },
  jsplumb: {
    name: 'jsPlumb',
    lib: '@jsplumb/browser-ui 6.2',
    note: 'HTML nodes + SVG connectors · connectivity toolkit, no layout and no viewport',
    surface: 'dom+svg',
    renderers: ['dom+svg'],
    caps: {
      // Community has none; the one this pane drives is the CSS transform the
      // renderer builds by hand, which is exactly the finding.
      viewport: 'hand-built CSS transform (~20 lines)',
      layout: 'none — Toolkit only, commercial',
      lod: 'none',
      culling: 'none',
      images: 'anything CSS can draw — nodes are HTML',
      routing: 'Bezier, Flowchart, StateMachine, Straight'
    },
    Component: React.lazy(() => import('./jsplumb/JsPlumbGraph.jsx'))
  },
  nvl: {
    name: 'Neo4j NVL',
    lib: '@neo4j-nvl/base 1.2',
    note: 'canvas/WebGL · hand-written wrapper — the React package cannot install on 16',
    surface: 'canvas/webgl',
    // WebGL is the reason to reach for NVL at all — and it drops captions
    // entirely, which is the trade the knob exists to make visible.
    renderers: ['canvas', 'webgl'],
    caps: {
      viewport: 'setZoom() / setPan() · native',
      layout: 'force, hierarchical, circular, d3-force, grid — in workers',
      lod: 'automatic caption dropping',
      culling: 'automatic',
      images: 'icon per node',
      routing: 'straight, native loops'
    },
    Component: React.lazy(() => import('./nvl/NvlGraph.jsx'))
  },
  flow: {
    name: 'React Flow v9',
    lib: 'react-flow-renderer 9.7',
    note: 'DOM + SVG · real React components as nodes · no layout engine at all',
    surface: 'dom+svg',
    renderers: ['dom+svg'],
    caps: {
      viewport: 'useZoomPanHelper · zoomTo / transform',
      layout: 'none at all',
      lod: 'write it yourself in the node component',
      culling: 'onlyRenderVisibleElements — on in this pane',
      images: 'anything React can render',
      routing: 'bezier, step, smoothstep, straight, custom'
    },
    Component: React.lazy(() => import('./flow/FlowGraph.jsx'))
  }
}

export const ENGINE_KEYS = Object.keys(ENGINES)

/** The rows of the capability grid, in the order they read best. */
export const CAP_ROWS = [
  ['viewport', 'Viewport control'],
  ['layout', 'Layouts shipped'],
  ['lod', 'Level of detail'],
  ['culling', 'Viewport culling'],
  ['images', 'Custom glyphs / images'],
  ['routing', 'Edge routing']
]
