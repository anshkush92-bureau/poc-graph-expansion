# Graph rendering POC — benchmark, documentation and verdict

**Date:** 2026-08-31
**Repo:** `poc-graph-expansion`

## The premise

Designing a solid POC for frontend graph visualisation depends on identifying the
application's absolute breaking point. Graph libraries fall into three rendering
categories:

- **SVG** — DOM-heavy, highly customisable, poor at scale.
- **Canvas** — pixel-based, good for medium-to-large datasets.
- **WebGL** — GPU-accelerated, built for massive scale, hardest to customise.

Eight libraries are under comparison, spanning all three surfaces:

| Engine | Package | Surface |
|---|---|---|
| Apache ECharts | `echarts` 6.1 | canvas |
| FusionCharts | `fusioncharts` 4.2 | svg |
| Cytoscape.js | `cytoscape` 3.34 | canvas |
| vis-network | `vis-network` 10.1 | canvas |
| v-network-graph | `v-network-graph` 0.9 + vue 3 | svg |
| jsPlumb | `@jsplumb/browser-ui` 6.2 | dom+svg |
| Neo4j NVL | `@neo4j-nvl/base` 1.2 | canvas/webgl |
| React Flow v9 | `react-flow-renderer` 9.7 | dom+svg |

## The four dimensions

### 1. Scalability stress tests

- **Hairball** — load a dense network (50,000 nodes / 100,000 edges) on a cold
  pane. Measure time-to-first-render and initial memory consumption.
- **Streaming** — add and remove 500 nodes/edges per second. Watch for memory
  leaks and GC stutters.
- **60 FPS zoom/pan** — rapidly zoom in and out of a nested cluster. A good
  library holds close to 60 FPS by natively offloading transform calculations.

### 2. Physics & layout performance

- **Convergence speed** — how fast does a chaotic graph settle?
- **Worker offloading** — does the library lock the main UI thread during layout,
  or can the physics move to a Web Worker?

### 3. Customization vs performance

- **Custom glyphs & images** — replace circle nodes with avatars, SVG paths, or
  HTML elements.
- **Edge routing** — quadratic bezier curves, orthogonal routing, directional
  arrows. Curves cost significantly more math than straight lines.

### 4. Optimizations applied

Do not test the libraries out of the box only. Apply and measure:

- **Level of detail (LOD)** — simple dots when zoomed out, labels and high-res
  glyphs only when zoomed in.
- **Viewport culling** — stop rendering nodes panned off-screen.
- **Event debouncing** — how well the library handles heavy hover/tooltip
  listeners.

## What must be delivered

1. **Every metric explained** — what each number means, exactly how it is
   calculated, and why it is the right number to report. Presented both as a
   document and inside the UI next to the numbers themselves.
2. **A page per library** — one library at a time, all scenarios, every knob
   exposed including the Web Worker toggle, so the reader can run their own
   experiments rather than only reading a table.
3. **A comparison document** — which library is better, why, and which one to
   finally choose.

## Decisions taken

| Question | Decision |
|---|---|
| How far to take the customization benchmark (dimension 3)? | **All eight engines.** Three of them will report `unsupported` for images or for orthogonal routing — that refusal is itself the finding, and a matrix with holes in it is more useful than four engines measured and four guessed. |
| How do measured numbers reach the verdict document? | **The operator runs the suite in a real Chromium tab and exports JSON**, which is committed as `measurements.json`; the comparison document's tables are generated from that file. No headless runner: headless GPU and compositing differ from a real tab, and frame times and WebGL behaviour are exactly the metrics that would be distorted. |
| What should a per-library page be? | **A profile page per engine**: that library's results across every scenario together, its capability card, a run-all button, and every knob exposed for hands-on testing. It reuses the existing pane and scenario runner. |

## Constraints inherited from the repo

- React is pinned to exact **16.14.0**, with Vite's **classic** JSX runtime — no
  automatic runtime, so every `.jsx` file must `import React`.
- **No new runtime or dev dependencies.** Charts are CSS; the doc generator is
  `node:fs`; the test runner is `node --test`.
- Every renderer keeps the **identical prop contract** — that uniformity is what
  makes the comparison mean anything.
- Node coordinates always come from the shared `layoutRadial`, never from a
  library's own layout engine.
- Only one engine is ever mounted during a measured run: frame times, long tasks
  and heap belong to the tab, not to a component.
