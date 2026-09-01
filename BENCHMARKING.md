# Benchmarking a frontend graph library

Designing a solid POC for frontend graph visualisation depends on one thing:
finding your application's **absolute breaking point**. Not "is this library
fast" — every library is fast at 200 nodes — but *where does this one stop
working, and is that past where my data goes?*

Graph libraries fall into three rendering families, and the family predicts more
about the answer than the library does.

| Family | How it draws | Customisation | Scale |
|---|---|---|---|
| **SVG** | one DOM element per node and per edge | highest — it's CSS and the DOM | poor; the element count *is* the cost |
| **Canvas** | pixels into one `<canvas>`, redrawn per frame | moderate — you draw it yourself | good, medium-to-large |
| **WebGL** | pixels via the GPU, geometry uploaded once | hardest — shaders and instancing | built for massive |

The eight engines in this repo, by family:

| Engine | Surface | Lab |
|---|---|---|
| Apache ECharts | canvas | `#/lab/echarts` |
| Cytoscape.js | canvas | `#/lab/cytoscape` |
| vis-network | canvas | `#/lab/vis` |
| Neo4j NVL | canvas / WebGL | `#/lab/nvl` |
| FusionCharts | SVG | `#/lab/fusion` |
| v-network-graph | SVG (Vue 3) | `#/lab/vng` |
| jsPlumb | HTML + SVG | `#/lab/jsplumb` |
| React Flow v9 | DOM + SVG | `#/lab/flow` |

Every pane is handed **the same graph at the same coordinates**, from one shared
`layoutRadial`, not from each library's own layout engine. Several of these ship
perfectly good layouts and a real app would use them; using them here would make
the comparison about layouts rather than renderers. Only the drawing differs.

What follows is the four dimensions worth testing, and what in this repo
implements each one.

---

## 1. The scalability stress tests

Push the rendering engine until the browser drops frames or gives up.

### The "hairball" test

Load a dense network on a **cold pane** — starting from an empty graph, so you
are measuring a first render and not an update against a graph the engine
already has. Default 1,000 nodes / 1,500 edges — the same size every other
scenario starts from, so the six rows are comparable to each other before
anything is turned up. The dial goes to 50,000, which is past where most of
these are usable, and finding that ceiling per library is a separate pass.

> **Scenario:** `Hairball` · knobs: Nodes, Edges
> **Reports:** `ttfrMs` `updateMs` `synthMs` `layoutMs` `heapMB` `blockedMs` `longestTaskMs`
> **Headline:** `ttfrMs` — time to first *visible* render

The wait is split into four legs because one total hides which is your problem:
building the data and laying it out are shared code and identical for every
engine; `updateMs` is what the library spent; `ttfrMs` is what a user felt.

**How to find a breaking point with it:** open the lab for one library, set
nodes to 2,000, hit Build, and keep doubling. Somewhere the pane stops painting,
the tab stops responding, or `ttfrMs` crosses whatever your product considers
acceptable. Write down that number — it is the single most useful figure this
whole exercise produces, and it is per-library, not per-family.

### The expansion test — the interaction this app actually performs

The hairball is a cold render, and the streaming test is a feed nobody asked
for. Neither is the thing a user does: **click one node on a graph that is
already large, and wait for its neighbours.** A small diff into a big scene is a
different cost from either, and no vendor benchmark covers it.

> **Scenario:** `Expansion` · knobs: Nodes, Edges, Nodes per click, Expansions
> **Reports:** `p50Ms` `p95Ms` `worstMs` `firstMs` `lastMs` `layoutP95Ms` `updateP95Ms` `blockedMs` `heapMB`
> **Headline:** `p50Ms` — the wait, at the click. At the default 20 clicks
> `p95Ms` is arithmetically the maximum, so read it as worst-of-twenty.

Laid out **incrementally against the previous frame**, so newcomers go into free
space and nothing already on screen moves; a re-solve would read as a reload and
would bury the number under a full layout pass. The clicks are spread across the
graph rather than repeated on one node, so the run is not measuring a
neighbourhood the engine has already got warm.

`layoutP95Ms` is quoted next to the wait on purpose: it is the shared
incremental layout, identical for all eight, and it costs **~2 ms at 1,000 nodes,
~9 ms at 5,000 and ~22 ms at 20,000**. Anything above that in `p95Ms` is the
engine, not the app. `firstMs` against `lastMs` is the same question inside one
row — a cost that grows with the graph under it shows up there before it shows up
across sizes.

### The streaming data test

Simulate real-time traffic: nodes and edges arriving and expiring continuously.
Default 500 nodes/sec against a 2,000-node base, for 20 seconds.

Two design decisions make this a real test rather than a slideshow. Arrivals are
pushed **on a timer, not after each paint** — a pane that cannot keep up falls
behind visibly instead of quietly slowing the feed down to whatever it can
manage. And the same number of nodes is removed as added, so the **node count
stays flat**: a streaming test whose graph grows without bound is just the
hairball test again, arriving slowly.

> **Scenario:** `Streaming` · knobs: Base nodes, Nodes/sec, Seconds
> **Reports:** `fps` `frameP95` `worstFrameMs` `dropped` `heapMB` `heapSlopeMBs` `leakMB`
> **Headline:** `fps` under churn

Memory is read three times: at the start, at the end, and again **after the
graph has been emptied**. Churn moving the heap around during the run is not a
leak. Memory that does not come back once every node is gone is.

**In the lab:** the Streaming group starts and stops it by hand and leaves it
running, which is the way to catch a slow leak — set it going at 500/sec and
watch `heap MB` on the gauge for a few minutes.

### The 60 fps zoom and pan

A scripted zoom into a cluster and back out — 1× to 4× and back — with a pan
riding on top, driven **once per animation frame** so the interaction happens at
exactly the rate the engine can present frames. Pushing transforms from a
`setInterval` instead would queue work the renderer never gets to show and turn
this into a queue-depth test.

> **Scenario:** `Zoom & pan` · knobs: Nodes, Edges, Seconds
> **Reports:** `fps` `frameP50` `frameP95` `worstFrameMs` `dropped` `blockedMs`
> **Headline:** `frameP95`

This is the test a library passes by **offloading the transform** rather than
re-deriving the scene: a canvas engine that keeps a tile cache or applies a
matrix beats one that recomputes and redraws every node per frame by an order of
magnitude. It only goes to 4× because four of these engines clamp their zoom
there, and a sweep that spends half its frames pinned against a ceiling measures
the clamp instead of the redraw.

Two engines report `unsupported` here, and that is a finding rather than a gap:
FusionCharts PowerCharts has no viewport at all — a "zoom" means recomputing the
axis bounds and rebuilding the chart — and jsPlumb's viewport is twenty lines of
CSS transform this repo wrote by hand.

---

## 2. Physics and layout performance

Calculating the forces that push and pull nodes apart usually kills performance
before rendering does, and it is the part that freezes the tab while it runs.

> **Scenario:** `Layout & worker` · knobs: Nodes, Edges, Solver, **In a Web Worker**, Convergence α
> **Reports:** `where` `solveMs` `transferMs` `ticks` `alpha` `converged` `framesDuring` `worstFrameMs` `blockedMs`
> **Headline:** `worstFrameMs` — the longest frozen frame

The solver is **one d3-force simulation, identical for every engine**, and
deliberately not any library's own layout. Every one of these ships a force
layout with a different solver, different constants and a different stopping
rule; timing eight of those against each other measures eight unrelated
implementations, not the question being asked.

### Convergence speed

How fast a chaotic graph settles. d3 decays `alpha` geometrically toward
`alphaMin`; when it arrives, the arrangement has stopped meaningfully moving.
`ticks` is how many steps that took and `solveMs` is what they cost — report
both, because a solver that converges in few ticks but takes 40 ms per tick is
not fast.

Ticks are pumped **synchronously** rather than left to d3's rAF-driven internal
timer, which would spread the work over as many seconds as the frame rate needs
and measure wall-clock instead of CPU — and would not reproduce the freeze a
real app suffers doing this the naive way.

`maxTicks` (400) is a floor under the worst case, not a target. A graph that has
not settled reports the alpha it reached and `converged: false`.

### Worker offloading

**This is the toggle that matters most in the whole rig**, and the number to
read is not the solve time. `solveMs` barely moves between the main thread and a
worker — it is the same arithmetic on the same CPU. What moves is
`framesDuring`: on the main thread the tab is frozen for the entire solve and
presents almost no frames; in a worker it stays at 60 throughout.

`transferMs` is the honest counterweight. Graphs are stripped to `{id}` and
`{id, source, target}` before crossing, so the worker path is not charged a
serialisation cost the main-thread path never pays — and even stripped, at
50,000 nodes the structured-clone round trip is not free. That is the price the
worker charges for the freeze it removes.

**In the lab:** the "Layout & worker" group has the solver, the worker toggle
and α. Set the solver to `force`, build 3,000 nodes, and hit Re-layout with the
worker off and then on while watching the gauge. Off, the gauge visibly stops
updating — because it cannot; the thread it runs on is busy.

---

## 3. Customisation versus performance

The easiest way to break a high-performance canvas or WebGL library is to demand
complex styling. This is the half of the comparison a stopwatch cannot answer,
and on a real project it decides more often than the frame times do.

**Status: read off each library's API, not benchmarked.** The capability matrix
on the Compare page and on every lab page reports what each library offers for:

- **Custom glyphs and images** — replacing circles with avatars, SVGs or HTML.
  This ranges from `symbol: image://…` per node (ECharts) through
  `background-image` per selector (Cytoscape) to *anything React can render*
  (React Flow) — and that last one is exactly the trade: it is the most
  customisable and the least scalable, for the same reason.
- **Edge routing** — quadratic bezier, orthogonal/taxi, step, self-loops,
  directional arrows. Curves cost significantly more maths per edge than
  straight lines, and an engine offering five routing modes is telling you it
  will happily let you make it slow.

Implementing avatars and bezier routing eight times is the next pass. Until it
exists, an unmeasured column is more honest than a guessed one — a benchmark
that reports a number nobody produced is worse than one that admits a gap.

### The one part of this that *is* measured: the paint backend

Three of the eight can draw the identical scene through more than one backend,
and both the bench (**Backend**, next to Engine) and each lab page expose it as
a knob. It belongs in the bench and not only in the lab because otherwise every
row in the matrix is the engine's *default* backend, and the SVG and WebGL halves
of three libraries go unmeasured — which was exactly the hole in the first pass.
Each result row records the backend it ran on.

| Engine | Backends | What the flag actually changes |
|---|---|---|
| ECharts | `canvas` / `svg` | the ZRender paint target — same series, same option object |
| Cytoscape | `canvas` / `webgl` | the rasteriser under the canvas renderer; geometry and hit testing unchanged |
| NVL | `canvas` / `webgl` | the renderer, and **captions stop rendering entirely** on WebGL |

This is the cleanest test of the SVG / canvas / WebGL framing this document
opens with, because it is the only place where the family changes and the
library, the data and the layout do not. In the bench: pick the engine, pick the
backend, hit Run, flip the backend, Run again.

Two caveats worth stating with any number that comes out of it. None of the
three can swap backends on a live instance, so flipping the knob **remounts the
pane** — what you are comparing is two cold starts, not a switch. And NVL's
WebGL win is partly bought by dropping captions, so it must be read against an
LOD-on canvas run rather than against the default one.

**What to do in the meantime:** pick your two or three finalists on the measured
dimensions, then implement your *actual* node design in each of them and re-run
the hairball and zoom scenarios. Custom rendering is where canvas libraries lose
most of their advantage, and it is entirely dependent on what your design asks
for.

---

## 4. The optimisations, applied

Do not test libraries out of the box. Apply these and see the real ceiling.

### Level of detail, and viewport culling

> **Scenario:** `LOD & culling` · knobs: Nodes, Edges, **Level of detail**, **Viewport culling**, Visible fraction, Seconds
> **Reports:** `kept` `drawnNodes` `drawnEdges` `ttfrMs` `updateMs` `fps` `frameP95` `dropped`
> **Headline:** `frameP95`, optimised

Both are applied in the **shared layer**, not through each library's own
feature, and that choice is worth defending. LOD is normally
`min-zoomed-font-size` in Cytoscape, `scaling.label.drawThreshold` in
vis-network, automatic caption dropping in NVL, and nothing at all in four of
the eight. Measuring those against each other measures eight different features.
Doing both in shared code measures one thing: **what the engine costs when it is
handed less to draw.**

- **LOD** blanks every caption. Captions are the expensive half of a dense graph
  on every renderer here — canvas engines pay a `measureText` and a fill each,
  SVG and DOM engines pay a whole element each.
- **Culling** drops everything outside a centred box, keeping an edge only if
  **both** endpoints survive. Keeping half-edges means keeping their off-screen
  endpoint, which is culling that culls nothing.

The caveat, stated plainly: an engine with its own culling gets no extra credit
from this, and an engine with none gets to borrow yours. That is deliberate — it
separates *"this library is fast"* from *"this library ships the optimisation you
would otherwise have written"*.

**Always read the speed-up next to `kept`.** A radial layout puts most of its
nodes on the outermost ring, so a centred box at `fraction: 0.5` typically keeps
well under half the graph — three times faster while drawing a fifth of the
nodes is not a win.

### Event debouncing

> **Scenario:** `Hover & debounce` · knobs: Nodes, Edges, **Debounce (ms)**, Seconds
> **Reports:** `hitArea` `pointerMoves` `hoverCallbacks` `callbacksPerMove` `fps` `frameP95` `dropped`
> **Headline:** `frameP95` under hover traffic

Run it once at 0 ms and once at, say, 40 ms, and compare the frame numbers —
that difference is what the debounce buys you.

The pointer is driven along points **known to sit on a node**, found by a
calibration pass first, and alternates on and off so every step is a real enter
or leave. This matters: a node is about eleven pixels across on a fitted graph,
so a blind sweep lands on one roughly never, and an earlier version of this
scenario reported "1 callback out of 181 moves" for all eight engines — which
measured the geometry of the sweep and nothing about the libraries.

The debounce is on the **React state update**, where the real cost is, not on the
engine's callback. And the ranked metric is deliberately not `callbacksPerMove`:
`1.0` there means the engine reported every transition, which is correct rather
than bad, and ranking on it would put the engine that silently drops hovers at
the top.

`hitArea` falls out of the calibration and is worth reading on its own — it is
how much of the pane each engine considers hit-testable, and the eight do not
agree. A canvas engine hit-tests the drawn symbol; a DOM engine hit-tests the
element's whole box; jsPlumb's label sits outside the disc and counts as part of
the node.

---

## Running it

```bash
npm install --legacy-peer-deps
npm run dev            # http://localhost:5173
```

Four views, each with its own URL:

| URL | What it is |
|---|---|
| `#/explore` | up to eight panes side by side on one live graph |
| `#/bench` | one scenario across all eight engines, sequentially |
| `#/lab` | index of the per-library pages |
| `#/lab/<engine>` | **one library, every dial by hand, live gauge** |
| `#/compare` | everything measured so far, plus the capability matrix |

### Driving one by hand

A lab page puts the controls above the graph and the gauge between them, so a
dial and its consequence are on screen together. Beyond the scripted knobs it
adds two things the bench has no equivalent for:

- **Expansion by hand.** Click a node and `expand by` neighbours are hung off it,
  laid out incrementally so nothing already on screen moves. The scripted
  `Expansion` scenario above does the same thing on a timer; this is the version
  where you pick which node and watch what happens. See `expandMs` and `updateMs`
  in [METRICS.md](METRICS.md#expansion--the-lab-only).
- **The viewport.** Zoom / fit buttons drive the same handle the scripted zoom
  scenario drives, so what you feel by hand and what the table reports come from
  one code path. Two engines publish no handle at all, and their group says so
  rather than showing dead buttons.

### What the size dials actually build

`synthGraph(nodes, edges)` lays a **spanning tree** over the node count first,
then adds cross-links until it reaches the edge count. Two consequences worth
knowing before quoting a row:

- **The edge count is a target with a floor of `nodes − 1`.** A tree of *n* nodes
  is *n − 1* edges and the tree is not optional — `layoutRadial` places a node
  inside its parent's wedge, and a node with no path to a root has no wedge. So
  5,000 nodes never has fewer than 4,999 edges however low the dial goes, and the
  lab reports the overshoot next to the counts.
- **It is also a ceiling in practice.** Duplicate pairs are skipped rather than
  retried, so far more edges than the node count can support lands short — 100
  nodes asked for 100,000 edges builds 2,699. Every scenario reports
  `graph.edges.length`, never the knob.

Every size dial bottoms out at **0**, here and in the scripted knobs. Zero nodes
draws an empty pane, and that is a measurement rather than a broken state: it is
what this engine costs holding nothing, which is the baseline the other rows are
differences from. `Seconds` is the one exception and stops at 1 — it is a
sampling window, not a size, and there is no frame rate over zero seconds.

### Why the bench runs one engine at a time

Frame times, long tasks and heap are properties of **the tab**, not of a
component. Eight panes sharing a main thread would produce eight rows that each
read "this engine plus seven others". Sequential is slower to sit through and is
the only way the comparison means anything.

For the same reason: close your other tabs. A Slack notification lands in your
p95.

### A protocol that produces defensible numbers

1. Use Chromium. Long-task and heap columns exist nowhere else, and `—` in half
   your table is a bad look in a write-up.
2. Mains power, not battery. Throttled cores can halve frame rates.
3. `#/bench` → pick a scenario → **All engines**. Results are written to
   `localStorage` per row the moment each lands, so a crash costs one row.
4. Repeat three times. Report the median. Say that you did.
5. `#/compare` → **Export JSON** for the raw rows.
6. Publish with the environment stated: browser and version, display refresh
   rate, CPU, battery state, run count.

**Everything** runs all seven scenarios across all eight engines at default knobs
— **1,000 nodes / 1,500 edges** for all seven, so the whole 56-cell matrix is one
graph size and the differences in it are the engine and the scenario, nothing
else. Budget about ten minutes; the streaming and sweep scenarios are timed
windows and cannot be hurried.

Two legs it does **not** cover, because they are knob settings rather than
defaults: the worker half of `Layout & worker` (the toggle defaults to off), and
the non-default paint backends. Both have to be run deliberately, and the first
pass silently omitted the worker leg for exactly this reason.

Turning the dial up is the *second* pass, not the first: at 50,000 the DOM
engines fail the hairball outright, and that failure is a result that gets a row
— but a matrix where every cell ran at a different size answers no question at
all.

---

## What this does not measure

Worth saying out loud, because a benchmark's blind spots decide more than its
findings:

- **Custom glyphs and edge routing** — capability matrix only, as above.
- **Each library's own layout engine** — deliberately excluded; the shared
  `layoutRadial` and the shared d3-force keep the comparison about rendering.
- **Each library's own culling and LOD** — same reason.
- **Bundle size** — measured separately; see [`.sizeprobe/`](.sizeprobe/), and
  note NVL is ~509 KB gzipped and FusionCharts ~897 KB.
- **Accessibility, touch, and mobile GPUs.** Nothing here has been near a phone.
- **API ergonomics and maintenance load** — how long it takes to build the thing
  you actually want. The per-engine notes in
  [`src/engines.js`](src/engines.js) are the closest this repo comes, and they
  are worth reading before any of the numbers.

---

See [METRICS.md](METRICS.md) for how every number is computed and how to present
it, and [COMPARISON.md](COMPARISON.md) for the verdict.
