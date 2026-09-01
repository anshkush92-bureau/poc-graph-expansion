# Identity graph walker

A React **16.14** POC that renders the same expandable graph through **eight**
graph libraries at once, so they can be compared on identical behaviour and
identical data.

```bash
npm install --legacy-peer-deps   # react-flow-renderer@9 peers react 16||17
npm run dev                      # http://localhost:5173
npm test                         # 26 assertions over the shared graph layer
npm run build
```

`--legacy-peer-deps` is needed because npm 11 refuses the React 16 peer graph
otherwise. React and React DOM are pinned to exact `16.14.0`, and Vite is
configured with the **classic** JSX runtime since React 16 has no automatic one.

## The engines

Toggle any combination from the header; the stage tiles one pane per selection.
Each is a lazily-loaded chunk, so selecting a pane downloads one library.

| Engine | Package | Surface | Note |
|---|---|---|---|
| Apache ECharts | `echarts` 6.1 | canvas | shape + edge-style pickers, the only engine with them |
| FusionCharts | `fusioncharts` 4.2 | SVG | PowerCharts `dragnode`; no node events, bridged from the DOM |
| Cytoscape.js | `cytoscape` 3.34 | canvas | selector stylesheet, native self-loops, real element diffing |
| vis-network | `vis-network` 10.1 | canvas | `DataSet` upserts — the shortest data effect of the eight |
| v-network-graph | `v-network-graph` 0.9 | SVG | **Vue 3 only** — mounted as a Vue island inside React |
| jsPlumb | `@jsplumb/browser-ui` 6.2 | HTML + SVG | connectivity toolkit: no layout, no viewport, no data model |
| Neo4j NVL | `@neo4j-nvl/base` 1.2 | canvas | hand-written wrapper; the React package cannot install on 16 |
| React Flow v9 | `react-flow-renderer` 9.7 | DOM + SVG | nodes are real React components; no layout engine at all |

Every pane is handed the **same graph at the same coordinates** — positions come
from one shared `layoutRadial` in `graph/ops.js`, not from each library's own
layout engine. Several of these ship perfectly good layouts and would use them in
a real app; using them here would make the comparison about layouts rather than
renderers. Only the drawing differs.

## What it does

1. **Click a node to expand one level.** Works at any depth, so expansion is
   recursive: level 1 → 2 → 3 → 4. Re-clicking an expanded node does nothing, and
   a second click while the first fetch is in flight cannot duplicate a level.
2. **Add / delete nodes** from the side panel. The root is protected, and a
   deleted node's descendants stay.
3. **Hover for a peek card**, with two actions that open the side panel on
   **Details** or **Trace**.
4. **Click an edge** (ECharts pane) to walk it through the line styles.

The peek card's centrepiece is a **degree readout**: a segmented bar showing how
many of a node's links are already on screen versus still hidden. Node brightness
carries the same meaning — a bright node still has neighbours behind it.

Keyboard/no-pointer route: the header's **Inspect** select opens any node's panel
directly, since a hover-only affordance is not reachable otherwise.

## The stress dial

Expansion grows the graph a handful of nodes at a time, which never reaches the
sizes these libraries actually differ at. The **Nodes / Edges** dials build a
synthetic graph of an exact size in the same shape (`graph/synth.js`), and each
pane header reports the **milliseconds it spent on the last update**.

`Incremental layout` switches how new nodes are placed: on, newcomers go into
free space and nothing already on screen moves, at O(n²); off, the whole circle
re-balances on every change, which is much cheaper at scale but reads as a reload.

Defaults are 120 nodes / 180 edges — legible in all eight panes at once. Past
that they start to separate, which is the point.

## Layout

```
src/engines.js          the registry: one lazy entry per library
src/graph/data.js       fake backend — swap fetchNeighbors() for a Cypher call
src/graph/synth.js      synthetic graphs of an exact size, for the stress dial
src/graph/ops.js        pure graph ops + the radial layout (all tested)
src/graph/useGraph.js   the shared interaction model: expand / add / delete / load
src/ui/                 HoverCard, SidePanel, theme, useResize — shared by all
src/<engine>/           one renderer per library, all taking identical props
```

Every renderer is a dumb view over `useGraph` and takes the same props. To point
this at a real Neo4j instance, replace `fetchNeighbors(node)` in `data.js` — it is
the only function that invents data.

## Notes

- `@neo4j-nvl/react` is **not** used: no published version supports React 16.
  `@neo4j-nvl/base` is framework-free, so `NvlGraph.jsx` is the wrapper.
- `v-network-graph` has no React binding and no framework-free core, so that pane
  runs a second framework. It also refuses to draw past ~150 nodes — see the
  measurements in `vng/VngGraph.jsx`.
- `MAX_DEPTH` in `data.js` caps click-expansion at level 4.

## The four views

Each has its own URL, so a page survives the reload after a 50,000-node run took
the tab down with it.

| URL | What it is |
|---|---|
| `#/explore` | the eight panes side by side on one live, expandable graph |
| `#/bench` | one scenario, one paint backend, across all eight engines, sequentially |
| `#/lab` | index of the per-library pages |
| `#/lab/<engine>` | **one library, every dial by hand**, with a live frame/heap gauge |
| `#/compare` | everything measured so far, plus the capability matrix |

The **lab** is where you drive a single library yourself. Controls on top, graph
underneath, gauge between them:

- **Graph** — initial node count, edge count, and *expand by*. There is no
  total-nodes dial because the total is a result: Build lays a spanning tree over
  the initial count, then adds cross-links until it reaches the edge count, and
  every click hangs *expand by* more nodes off the node you clicked. So the edge
  dial is a target with a floor at `initial − 1` — asking for fewer changes
  nothing, and the strip says by how much. Both dials, and every other one on the
  page, bottom out at **0**: an empty pane is the baseline the rest are read
  against.
- **Interaction** — click any node to expand it, laid out incrementally so
  nothing already on screen moves. Zoom / fit buttons drive the same viewport
  handle the scripted zoom test uses. Pan, wheel-zoom and node drag are the
  library's own.
- **Renderer** — the paint backend, where the library has more than one:
  ECharts canvas **or SVG**, Cytoscape and NVL canvas **or WebGL**. The same
  code, the same data, one word different.
- **Layout & worker** — radial or d3-force, on the main thread or in a Web
  Worker, with the convergence α.
- **LOD & culling**, **Streaming** at a rate you set, and **hover debounce**.

Frame, long-task and heap readouts are sampled continuously while you turn the
dials, and stand down while a scripted scenario is measuring. The seven scripted
scenarios are on the same page, scoped to that engine alone.

## The docs

- **[RFC.html](RFC.html)** — the same document, rendered, and the best way to read
  §5: every table, colour-coded, with the retractions marked in place. Open it in a
  browser. (`RFC.artifact.html` is the same content without the page wrapper, for
  publishing.)
- [RFC.md](RFC.md) — the design-huddle submission: problem statement, the
  architecture under review, the five review focus areas, and **§5, the measured
  results**. Two passes: seven scenarios × eight engines at 1,000 / 1,500, then the
  size sweep to **50,000 nodes**, both paint backends, expansion at three sizes,
  the LOD-off baseline, and the leak column three times over. Start here if you are
  reviewing rather than building — **§5.0's run-to-run spread table first**, because
  it is what retracted four of pass 1's claims; §5.9 is the summary.
- [bench-data/](bench-data/) — the raw rows behind every number, and a README
  explaining which files are trustworthy and which contain the broken leak metric.
- [BENCHMARKING.md](BENCHMARKING.md) — the four dimensions worth testing, and
  which scenario and knob implements each.
- [METRICS.md](METRICS.md) — every metric, exactly how it is computed, how it
  lies, and how to present it without lying with it.
- [COMPARISON.md](COMPARISON.md) — the verdict, measured at 1,000 / 1,500 across
  all eight engines. Read this if you want the answer without the reasoning.
