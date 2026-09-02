import type { CapKey, GraphEngine } from './engine/types.ts'

import cytoscape from './cytoscape/engine.ts'
import echarts from './echarts/engine.ts'
import flow from './flow/engine.ts'
import fusion from './fusion/engine.ts'
import jsplumb from './jsplumb/engine.ts'
import nvl from './nvl/engine.ts'
import vis from './vis/engine.ts'
import vng from './vng/engine.ts'

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
 * `GraphPaneProps` in `engine/types.ts` is the enforced version of that list —
 * this comment describes it, that file checks it.
 *
 * `renderer` is the paint backend, and only three of these eight have more than
 * one to offer: ECharts can draw the same series to canvas or to SVG, and
 * Cytoscape and NVL both have a WebGL path behind a flag. Each manifest's
 * `renderers` lists what it accepts, first entry being the default. It is fixed
 * at construction in every case, so changing it means remounting the pane — the
 * lab does that with a key rather than trying to swap it live.
 *
 * `onViewport` started as the benchmark's addition and is now what every zoom
 * control in the app runs on. A pane calls it once on mount with
 * `{ zoomBy, panBy, fit }` — or with `null` if the library has no viewport to
 * drive — and again with `null` on unmount. Relative rather than absolute
 * (`zoomBy(1.1)`, not `zoomTo(2)`) because every engine here can express a
 * relative zoom and only some can express an absolute one.
 *
 * The scenarios in `bench/` and the `CanvasControls` overlay on every pane both
 * drive the viewport through that handle and nothing else, which is what keeps
 * the zoom/pan test — and the buttons — identical across all eight. `caps.viewport`
 * is the manifest's own answer for whether there is a handle at all; the overlay
 * reads it to disable the buttons with a reason rather than hide them.
 *
 * That uniformity is the whole comparison. Node coordinates in particular come
 * from `layoutRadial` in App, not from each library's own layout engine, so
 * every pane draws the identical arrangement and the only variable left is the
 * drawing. Several of these libraries ship perfectly good layouts — that is
 * noted per engine in its own manifest rather than used, because a side-by-side
 * where each pane arranges the graph differently compares nothing.
 *
 * ── Lazy on purpose ────────────────────────────────────────────────────────
 * `React.lazy` keeps a library out of the bundle until its pane is actually
 * selected. With eight engines loaded eagerly the entry chunk is several
 * megabytes and dominated by whichever library is heaviest — NVL alone is
 * ~509 KB gzipped. Selecting one pane should cost one library.
 *
 * ── Order ──────────────────────────────────────────────────────────────────
 * Order is deliberate — it is the order every table renders in — so this is a
 * hand-written barrel rather than an `import.meta.glob`. The glob version would
 * make adding a library a zero-line change, but `EngineKey` would widen from a
 * literal union to `string` and every consumer would lose exhaustiveness and
 * autocomplete. Two lines per engine is the price of keeping that.
 *
 * Adding a library: `npm i thelib`, create `src/thelib/engine.ts` and
 * `src/thelib/TheLibGraph.tsx`, then add the import and the entry below.
 */
export const ENGINES = {
  echarts,
  fusion,
  cytoscape,
  vis,
  vng,
  jsplumb,
  nvl,
  flow
} satisfies Record<string, GraphEngine>

export type EngineKey = keyof typeof ENGINES

export const ENGINE_KEYS = Object.keys(ENGINES) as EngineKey[]

/** The rows of the capability grid, in the order they read best. */
export const CAP_ROWS = [
  ['viewport', 'Viewport control'],
  ['layout', 'Layouts shipped'],
  ['lod', 'Level of detail'],
  ['culling', 'Viewport culling'],
  ['images', 'Custom glyphs / images'],
  ['routing', 'Edge routing']
] as const satisfies readonly (readonly [CapKey, string])[]
