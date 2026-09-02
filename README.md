# Identity graph walker

A React **19** + TypeScript POC that renders the same expandable identity graph
through **eight** graph libraries at once, so they can be compared on identical
behaviour, identical data and identical node coordinates.

It is two things in one app: an **explore** view where the panes sit side by side
on one live, clickable graph, and a **benchmark** — seven scripted scenarios, a
per-library lab, and a results matrix — for finding where each library's ceiling
actually is.

---

## Setup

```bash
node -v                # 24.20.0+ — see .nvmrc  (nvm use)
npm install
npm run dev            # http://localhost:5173
```

That is the whole setup. There is no backend, no env file, no API key: the graph
comes from a deterministic stand-in in [src/graph/data.ts](src/graph/data.ts).

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server on port 5173 |
| `npm test` | 81 tests across 7 files — the shared graph layer, the radial layout, and the benchmark arithmetic (~30 s; `layoutRadial`'s growth tests are genuinely slow) |
| `npm run test:watch` | the same in watch mode |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config, typescript-eslint + react-hooks) |
| `npm run format` | Prettier over `src/` |
| `npm run check` | typecheck + lint + test — run this before committing |
| `npm run build` | `tsc --noEmit && vite build` |
| `npm run preview` | serve the build on port 4173 (what the bench drivers hit) |

Notes on the toolchain, in case something surprises you:

- **No `--legacy-peer-deps`.** It used to be required, back when this ran on
  React 16.14 and npm refused the peer graph. Every dependency now accepts React
  19, so a plain `npm install` is correct.
- **Strict TypeScript**, including `noUncheckedIndexedAccess` and
  `exactOptionalPropertyTypes`. `allowJs` is off — there is no JavaScript left in
  `src/`. Imports carry their `.ts` / `.tsx` extension
  (`allowImportingTsExtensions`), which is why every import in this repo looks
  like `./graph/ops.ts`.
- **Vite 8** with the automatic JSX runtime. `vite.config.ts` is also the Vitest
  config; tests run in the `node` environment because nothing under test touches
  the DOM.
- **`v-network-graph` pulls in Vue 3.** That is not a mistake — see the engine
  table below.

---

## The engines

Toggle any combination from the header; the stage tiles one pane per selection.
Each engine is a lazily-loaded chunk, so selecting a pane downloads one library
and nothing else. Loading all eight eagerly puts several megabytes in the entry
chunk (NVL alone is ~509 KB gzipped).

| Engine | Package | Surface | Note |
|---|---|---|---|
| Apache ECharts | `echarts` 6.1 | canvas **or SVG** | shape + edge-style pickers; the only engine with them |
| FusionCharts | `fusioncharts` 4.2 | SVG | PowerCharts `dragnode`; no node events, bridged from the DOM; **no viewport at all** |
| Cytoscape.js | `cytoscape` 3.34 | canvas **or WebGL** | selector stylesheet, native self-loops, real element diffing |
| vis-network | `vis-network` 10.1 | canvas | `DataSet` upserts — the shortest data effect of the eight |
| v-network-graph | `v-network-graph` 0.9 + `vue` 3.5 | SVG | **Vue 3 only** — mounted as a Vue island inside React |
| jsPlumb | `@jsplumb/browser-ui` 6.2 | HTML + SVG | connectivity toolkit: no layout, no viewport, no data model |
| Neo4j NVL | `@neo4j-nvl/react` 1.2 | canvas **or WebGL** | `InteractiveNvlWrapper`; diffs nodes/rels internally |
| React Flow | `@xyflow/react` 12.11 | DOM + SVG | nodes are real React components; no layout engine at all |

Every pane is handed the **same graph at the same coordinates** — positions come
from one shared `layoutRadial` in [src/graph/ops.ts](src/graph/ops.ts), not from
each library's own layout engine. Several of these ship perfectly good layouts
and would use them in a real app; using them here would make the comparison
about layouts rather than renderers. Only the drawing differs.

Each manifest (`src/<engine>/engine.ts`) declares its own `renderers` list — the
paint backends it accepts, first one being the default — and a `caps` block
answering the same six questions for every library: viewport control, layouts
shipped, level of detail, culling, custom glyphs, edge routing. Those `caps` are
**read off the APIs, not measured**, and the Compare view keeps them in a
separate table for exactly that reason.

**Adding a library**: `npm i thelib`, write `src/thelib/engine.ts` and
`src/thelib/TheLibGraph.tsx`, then add two lines to
[src/engines.ts](src/engines.ts). The registry is a hand-written barrel rather
than an `import.meta.glob` on purpose: the glob makes that a zero-line change but
widens `EngineKey` from a literal union to `string`, and every consumer loses
exhaustiveness checking.

---

## What it does

1. **Click a node to expand one level.** Works at any depth, so expansion is
   recursive: level 1 → 2 → 3 → 4 (`MAX_DEPTH` in `data.ts`). Re-clicking an
   expanded node does nothing, and a second click while the first fetch is in
   flight cannot duplicate a level.
2. **Add / delete nodes** from the side panel. The root is protected, and a
   deleted node's descendants stay — an analyst deleting a hop should not lose
   the evidence beyond it.
3. **Hover for a peek card**, with two actions that open the side panel on
   **Details** or **Trace**.
4. **Click an edge** (ECharts pane) to walk it through the line styles.

The peek card's centrepiece is a **degree readout**: a segmented bar showing how
many of a node's links are already on screen versus still hidden. Node brightness
carries the same meaning — a bright node still has neighbours behind it.

Keyboard/no-pointer route: the header's **Inspect** select opens any node's panel
directly, since a hover-only affordance is not reachable otherwise.

### The stress dial

Expansion grows the graph a handful of nodes at a time, which never reaches the
sizes these libraries actually differ at. The **Nodes / Edges** dials build a
synthetic graph of an exact size in the same shape
([src/graph/synth.ts](src/graph/synth.ts)) — same node fields, same edge fields,
so every renderer, the hover card, the side panel and the radial layout keep
working unchanged. Each pane header reports the **milliseconds it spent on the
last update**.

`Incremental layout` switches how new nodes are placed: on, newcomers go into
free space and nothing already on screen moves, at O(n²); off, the whole circle
re-balances on every change, which is much cheaper at scale but reads as a
reload. Defaults are 120 nodes / 180 edges — legible in all eight panes at once.
The dials go to 5,000 / 15,000, which is past where several of these engines are
usable, and that is the point.

`synthGraph(nodes, edges, seed)` is deterministic: the same triple always builds
the same graph, so two benchmark runs are comparable and a screenshot can be
reproduced.

---

## The four views

Each has its own URL, so a page survives the reload after a 50,000-node run took
the tab down with it. The hash rather than a path because this is a static Vite
build with no server rewrite — [src/route.ts](src/route.ts) is 30 lines and no
dependency.

| URL | What it is |
|---|---|
| `#/explore` | the eight panes side by side on one live, expandable graph (default) |
| `#/bench` | one scenario, one paint backend, across all eight engines, sequentially |
| `#/lab` | index of the per-library pages |
| `#/lab/<engine>` | **one library, every dial by hand**, with a live frame/heap gauge |
| `#/compare` | everything measured so far, plus the capability matrix |

**Bench** mounts exactly one pane at a time, because frame times and heap belong
to the tab rather than to a component — eight panes would make every row read
"this engine plus seven others". Results are written to `localStorage` the moment
each one lands, one row per `(engine, scenario, backend)`, so the matrix survives
whatever the next engine does to the page. The paint backend is in that key
because three of these libraries have two of them — running Cytoscape's WebGL
path is a second measurement, not a re-run of the canvas one.

The **seven scenarios** ([src/bench/scenarios.ts](src/bench/scenarios.ts)) each
know nothing about which engine is on screen — they set data, drive the viewport
through the handle the pane published, and read the probes:

| Scenario | What it measures |
|---|---|
| **Hairball** | one dense graph dropped on a cold pane — where the time to first pixel goes |
| **Expansion** | the interaction this app is for: clicking a node on an already-large graph |
| **Streaming** | nodes and edges arriving and expiring at a fixed rate |
| **Zoom & pan** | a scripted zoom into a cluster and back out, with a pan riding on top |
| **Layout & worker** | the d3-force pass, on the UI thread and off it, identical either way |
| **LOD & culling** | the zoom sweep again with both optimisations applied in the shared layer |
| **Hover & debounce** | a pointer driven along points known to sit on nodes, with and without the debounce |

`unsupported` is a first-class scenario result, not an error: two of these
engines have no viewport API at all, and "cannot do this" is a more useful row
than an invented zero.

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
  code, the same data, one word different. It is fixed at construction in every
  case, so switching remounts the pane.
- **Layout & worker** — radial or d3-force, on the main thread or in a Web
  Worker, with the convergence α.
- **LOD & culling**, **Streaming** at a rate you set, and **hover debounce**.

Frame, long-task and heap readouts are sampled continuously while you turn the
dials, and stand down while a scripted scenario is measuring. The seven scripted
scenarios are on the same page too, scoped to that engine alone.

---

## Layout

```
index.html                  the only HTML — mounts src/main.tsx
vite.config.ts              Vite + Vitest config (one file, both jobs)

src/main.tsx                createRoot
src/App.tsx                 owns state, renders the chrome, tiles the panes
src/route.ts                #/explore | #/bench | #/lab/<engine> | #/compare
src/engines.ts              the registry: one lazy entry per library
src/styles.css              all of the styling

src/engine/types.ts         GraphNode / GraphEdge / GraphPaneProps / ViewportHandle
                            — the props contract every renderer is checked against

src/graph/data.ts           fake backend — swap fetchNeighbors() for a Cypher call
src/graph/synth.ts          deterministic synthetic graphs of an exact size
src/graph/ops.ts            pure graph ops + layoutRadial (all tested)
src/graph/loops.ts          self-edges → drawable links, via invisible pivots
src/graph/useGraph.ts       the shared interaction model: expand / add / delete

src/ui/HoverCard.tsx        the peek card + degree readout
src/ui/SidePanel.tsx        Details / Trace, add + delete
src/ui/CanvasControls.tsx   the zoom/fit overlay every pane gets
src/ui/theme.ts             nodeColor — the one place brightness is decided
src/ui/useResize.ts         ResizeObserver hook

src/<engine>/engine.ts      one manifest per library: name, caps, renderers, lazy import
src/<engine>/*Graph.tsx     one renderer per library, all taking identical props
src/echarts/symbols.ts      the shape + edge-style catalog (no echarts import)

src/bench/scenarios.ts      the seven scripted scenarios
src/bench/probes.ts         the measurement primitives — frames, long tasks, heap
src/bench/usePane.ts        wiring between a mounted engine and whatever drives it
src/bench/runLayout.ts      "lay this graph out", main thread or worker
src/bench/layout.worker.ts  the worker — runs the same two layout functions
src/bench/force.ts          one d3-force run, identical for every pane
src/bench/optimize.ts       LOD + culling as pure graph transforms
src/bench/hud.ts            the live gauge (same arithmetic, rolling window)
src/bench/store.ts          results in localStorage, one row per (engine, scenario, backend)
src/bench/BenchView.tsx     the sequential run over all eight
src/bench/Lab.tsx           one library, every dial
src/bench/Compare.tsx       the results matrix + capability grid
src/bench/table.tsx         knob and result-table rendering

.bench-drivers/*.mjs        Playwright/CDP drivers that ran the recorded sweeps
bench-data/                 the raw rows behind every number in RFC §5
.sizeprobe/ .sizeout/       per-library bundle-size probes and their output
```

Every renderer is a dumb view over `useGraph` and takes the same props —
`GraphPaneProps` in [src/engine/types.ts](src/engine/types.ts) is the enforced
version of that list. A pane publishes its viewport once on mount as
`{ zoomBy, panBy, fit }`, or `null` if the library has no viewport to drive;
relative rather than absolute because every engine here can express a relative
zoom and only some can express an absolute one. The scripted zoom test and the
on-pane zoom buttons both go through that one handle, which is what keeps them
identical across all eight.

### Pointing it at real data

Replace `fetchNeighbors(node)` in [src/graph/data.ts](src/graph/data.ts) — it is
the only function that invents data, and the Cypher it stands in for is in the
comment at the top of the file. Nothing else in the app changes.

---

## Notes and known limits

- **`v-network-graph` runs a second framework.** It has no React binding and no
  framework-free core, so that pane mounts a Vue 3 app inside React. It also
  refuses to draw past ~150 nodes — the ceiling is a constant in
  [src/vng/VngGraph.tsx](src/vng/VngGraph.tsx).
- **FusionCharts has no viewport.** Not an omission in the wrapper: PowerCharts
  DragNode has no pan/zoom at all, and a "zoom" there means recomputing axis
  bounds and rebuilding the chart. It also emits no node events, so clicks and
  hovers are bridged from the DOM.
- **jsPlumb is a connectivity toolkit, not a graph renderer.** No layout, no
  viewport, no data model. The pane's viewport is a CSS transform written by
  hand (~20 lines), which is itself the finding.
- **Self-edges are faked identically everywhere.** Neither ECharts nor
  FusionCharts draws a link whose source and target match, so
  [src/graph/loops.ts](src/graph/loops.ts) routes every loop through two
  invisible pivots. Those pivots are not graph nodes and never enter state — a
  click or hover that resolves to one finds nothing and no-ops. Worth knowing
  before adding an interaction that assumes every drawn node is real.
- **`@neo4j-nvl/react` is now used directly.** On the old React 16 stack no
  published version would install, and this repo shipped a hand-written wrapper
  over `@neo4j-nvl/base`. On React 19 the official package works.
- **NVL's WebGL renderer drops captions entirely.** That trade is the reason the
  renderer knob exists.

---

## The docs

Everything below `RFC.md` was written **before** the migration to React 19 and
TypeScript, and its measurements were taken on the React **16.14** stack with
`react-flow-renderer` 9 in place of `@xyflow/react`. The numbers are the record
of that run and have been left exactly as measured; both files now carry a note
saying so. What the numbers say about *renderer* behaviour still holds — the
React-16-specific findings (§8.3 of the RFC) are the part to re-measure.

- **[RFC.html](RFC.html)** — the same document, rendered, and the best way to read
  §5: every table, colour-coded, with the retractions marked in place. Open it in a
  browser. (`RFC.artifact.html` is the same content without the page wrapper, for
  publishing. Both are generated — see the header of
  [.bench-drivers/build-rfc-html.mjs](.bench-drivers/build-rfc-html.mjs).)
- [RFC.md](RFC.md) — the design-huddle submission: problem statement, the
  architecture under review, the five review focus areas, and **§5, the measured
  results**. Two passes: seven scenarios × eight engines at 1,000 / 1,500, then the
  size sweep to **50,000 nodes**, both paint backends, expansion at three sizes,
  the LOD-off baseline, and the leak column three times over. Start here if you are
  reviewing rather than building — **§5.0's run-to-run spread table first**, because
  it is what retracted four of pass 1's claims; §5.9 is the summary.
- [COMPARISON.md](COMPARISON.md) — the verdict, measured at 1,000 / 1,500 across
  all eight engines. Read this if you want the answer without the reasoning.
- [BENCHMARKING.md](BENCHMARKING.md) — the four dimensions worth testing, and
  which scenario and knob implements each.
- [METRICS.md](METRICS.md) — every metric, exactly how it is computed, how it
  lies, and how to present it without lying with it.
- [ECHARTS_PIPELINE.md](ECHARTS_PIPELINE.md) — one engine traced end to end,
  from the backend stand-in to the canvas, keyed to `STEP n` markers in the code.
- [bench-data/](bench-data/) — the raw rows behind every number, and a README
  explaining which files are trustworthy and which contain the broken leak metric.
- [docs/superpowers/](docs/superpowers/) — the specs and plan the POC and the
  TypeScript migration were built from.
