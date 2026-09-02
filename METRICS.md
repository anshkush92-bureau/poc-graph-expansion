# Every metric, and how it was calculated

This is the reference for the numbers the bench, the lab and the compare page
report. For each one: what it is, exactly how it is computed and where, what
it is for, how it lies, and how to present it without lying with it.

Nothing here is a library-specific measurement. Every number comes from four
primitives in [`src/bench/probes.ts`](src/bench/probes.ts) that know nothing
about graphs, so the same arithmetic covers all eight engines — which is the
only reason the rows are comparable at all. Anything engine-specific lives in
that renderer's viewport handle, never in a probe.

---

## Three rules for reading any of them

**1. `—` is not zero.** Long tasks and heap are Chromium-only. Where the browser
will not say, every probe returns `null` and the table prints `—`. A reported
`0 ms blocked` would read as "never blocked", which is a far worse lie than "not
measured here". If your column is full of dashes you are in Firefox or Safari;
the frame numbers are still real, the blocking and memory ones do not exist.

**2. Never quote a speed-up without its denominator.** "Culling made it three
times faster" is not a finding. "Culling made it three times faster while
dropping 71% of the nodes" is. Every optimisation row carries `kept` for exactly
this reason.

**3. A mean is the one statistic that hides the failure you can see.** 16.8 ms
average is what you get from a steady 60 fps *and* from 56 clean frames plus
four 90 ms stalls per second. One of those looks broken. That is why every frame
figure here is a percentile, and why `p95` is the headline rather than `fps`.

---

## Frame metrics

Produced by `summarise(deltas)`
([probes.ts:51](src/bench/probes.ts#L51)), where `deltas` is the list of gaps
between consecutive `requestAnimationFrame` callbacks during the measured
window. Two samplers feed it: `sampleFrames(ms, step)` for a fixed window with
an interaction driven once per frame, and `startFrames()` for an open-ended one
you stop when the thing you were measuring finishes.

Both discard their **first delta**, always. That gap spans whatever happened
before the sampler started — usually the build that set the scenario up — and is
not a frame cost.

| Metric | Unit | Computation | Direction |
|---|---|---|---|
| `frames` | count | `deltas.length` | context, not a score |
| `fps` | frames/s | `1000 × frames ÷ Σdeltas` | higher better |
| `p50` | ms | sorted delta at index `⌊0.50 × n⌋` | lower better |
| `p95` | ms | sorted delta at index `⌊0.95 × n⌋` | lower better |
| `worst` | ms | `max(deltas)` | lower better |
| `dropped` | count | `Σ max(0, round(delta ÷ 16.67) − 1)` | lower better |

### `fps`
Frames actually presented per second of the window. **Bounded above by the
display**, and that is its whole problem as a headline: on a 60 Hz panel every
engine that clears the frame budget reports ~60 and they all look identical,
while on a 120 Hz MacBook the same code reports ~120 and your slide changes
meaning with the hardware. Use it for the failure end of the scale, where it is
genuinely informative (12 fps is 12 fps anywhere), and use `p95` for the rest.

### `p50` / `p95`
Median and 95th-percentile frame time. `p50` says what it usually feels like;
`p95` says what the worst twentieth of frames feel like, which is what a person
actually notices and complains about. **`p95` is the headline metric for four of
the seven scenarios** ([Compare.tsx:31](src/bench/Compare.tsx#L31)) because it is
unbounded — an engine three times better than the budget shows it, where `fps`
would flatten it to 60.

The percentile is a nearest-rank pick from the sorted list, not an interpolated
one. With 600 samples in a 10-second window the difference is irrelevant, and a
raw sample is a frame that really happened.

### `worst`
The single longest frame. On the layout scenario this is not a tail statistic at
all — it *is* the measurement: a synchronous d3-force solve blocks rAF outright,
so the freeze shows up as one enormous delta, and `worst` is its length.

### `dropped`
Frames the browser never got to present, **not** frames that ran slow. A 100 ms
delta is one frame that arrived plus five that did not: `round(100/16.67) − 1 = 5`.
Counting the slow frame itself would double-count it, since it is already in
`p95` and `worst`.

The 16.67 ms budget is hard-coded to 60 Hz
([probes.ts:33](src/bench/probes.ts#L33)). On a 120 Hz display this
under-reports by half. Say which display you measured on.

---

## Main-thread blocking

### `blockedMs`, `longestTaskMs`, `count`
From `watchLongTasks()` ([probes.ts:151](src/bench/probes.ts#L151)), a
`PerformanceObserver` on the `longtask` entry type — the browser's own record of
tasks that occupied the main thread for over 50 ms.

- `blockedMs` = `Σ entry.duration` over the window, rounded
- `longestTaskMs` = `max(entry.duration)`

This is the number that answers **"does this library lock the UI thread"**, and
it is the only one that stays meaningful when the work happens somewhere the
frame sampler cannot see it. A layout in a worker produces clean frames *and*
zero long tasks; a layout on the main thread produces one long task the length
of the solve. That contrast is the entire point of the worker toggle.

One implementation detail that was a real bug: `observer.takeRecords()` is
called before `disconnect()`. A `PerformanceObserver` delivers its callback on a
later task, so entries for work that finished microseconds ago have not arrived
yet — stopping straight after an awaited solve reported a flat `0 ms blocked`
for a layout that had visibly frozen the tab. `takeRecords()` drains what is
pending, synchronously.

**Chromium only.** `null` elsewhere.

In the lab's live gauge this is measured per half-second window instead, and
because the observer callback lands on a later task, a long task at the very end
of one window is usually counted in the next. Fine for a gauge, which is why the
scripted scenarios do not read it that way.

### `idleLagP95Ms`, `lagP95Ms`, `lagWorstMs`
From `watchLag()` ([probes.ts](src/bench/probes.ts)): a chain of 8 ms timers
runs for the window, and each one records how late it was. The reported number
is the p95 of `actual − due`.

This exists because **there is a gap the other two blocking metrics cannot
see.** `blockedMs` only fires above 50 ms. Frame deltas stay pinned at the
display cadence however busy the thread is. So an engine that runs its own
render or physics tick every frame — burning 8 ms out of every 8 ms, forever,
with nothing on screen changing — scores a clean 60 fps *and* 0 ms blocked, and
every task the app queues from then on waits behind that tick. Lag is where it
shows up.

- `idleLagP95Ms` (hairball) is measured over a **quiet** two-second window with
  the graph up and nothing driving it: the standing cost of holding the graph.
  A number near the floor means the engine is genuinely idle when idle.
- `lagP95Ms` (streaming, zoom & pan, LOD) is measured **during** the load, next
  to the frame columns. Read them together: good frames with high lag is an
  engine that paints on time but leaves the rest of the app unresponsive, which
  is exactly what a user reports as "the click did nothing".

8 ms rather than 0 because nested timers are clamped to 4 ms and the clamp would
be larger than the thing being measured. `setTimeout` rather than a
`MessageChannel` ping-pong — that version saturates the event loop and perturbs
the frame metrics it has to run beside. The floor is the scheduler's own noise,
so compare engines against each other on one machine and never quote an
absolute.

---

## Memory

### `heapMB`
`performance.memory.usedJSHeapSize ÷ 1024²`, to two decimals
([probes.ts:191](src/bench/probes.ts#L191)). Reported as a **delta**, not an
absolute: read before the scenario and again after, and the difference is what
went in the table.

Coarse and GC-scheduled — a single reading means very little, and this number
moving around by a few MB between runs is noise, not signal. Chromium only.

Every heap reading is preceded by `collectGarbage()`, which calls `window.gc()`
if the browser was started with `--js-flags="--expose-gc"` and otherwise just
yields a frame and a macrotask to give an idle-time collector its chance. Almost
nobody runs with that flag, so treat heap deltas as indicative unless you did.

### `heapSlopeMBs`
Least-squares slope of the per-second heap readings taken during the streaming
run, in MB per sample ([scenarios.ts:414](src/bench/scenarios.ts#L414)):

```
slope = Σ(i − ī)(y_i − ȳ) ÷ Σ(i − ī)²
```

The streaming scenario adds and removes the same number of nodes per tick, so
**the node count is flat**. A heap that climbs steadily under a flat node count
is a leak, and the slope catches it long before the drain test does. Returns
`null` rather than a guess if any reading is missing or there are fewer than
three of them.

### `heapPerNodeKB`
`heapMB × 1024 ÷ nodes`, two decimals. The same delta as `heapMB`, divided by
the node count that produced it — because **the raw totals are not comparable
across the dial.** 40 MB at 1,000 nodes and 40 MB at 50,000 are the same number
and opposite findings, and only the second one scales. This is the column to
read when comparing a 1k row against a 20k row; `heapMB` is the one to read
within a single size.

### `baseMB`
Empty pane to loaded: what this engine costs to hold the base graph, before any
churn. The only memory number here that is not a difference of differences, and
the one to quote if you want a per-engine footprint.

### `leakMB`
The strongest of the three signals. **Empty pane to empty pane**, with a run of
churn in between: the heap is read once with nothing but a root on screen, then
the graph is built, streamed at for the window, emptied back down to that same
root, collected, and read again. `leakMB = heapAfterDrain − heapEmpty`.

Churn moving the number around during the run is not a leak. Memory that does
not come back **once every node is gone** is.

> **This was wrong until it was fixed, and the way it was wrong is worth
> keeping.** The baseline used to be `heapStart` — read with the base graph
> already on screen — against a drain reading taken with the pane empty. So every
> engine that retained nothing scored its own base graph as a *negative* leak,
> and two rows in the first pass came back at about −25 MB. That got written up as
> a collection landing mid-window. Re-running with `--js-flags="--expose-gc"`
> reproduced it exactly, which is what a sign error does and what GC noise does
> not. A metric whose failure mode is "impossible value" is the lucky case; the
> same bug in a metric that can only be plausible is the one that ships.

---

## DOM footprint

### `domNodes`, `domPerNode`
`pane.querySelectorAll('*').length` after the paint, and that count divided by
the nodes in the graph. One query, no engine-specific API, so it is the identical
measurement for all eight.

This is not a performance number, it is the **mechanism behind** several of
them. A canvas or WebGL pane reports a handful of elements at any graph size; a
DOM pane reports several per node and pays for every one of them in style
recalculation, layout, hit-testing and memory. Read next to `ttfrMs` it turns a
slow number into a reason, and next to `heapPerNodeKB` it usually explains that
too.

Two comparisons are worth making deliberately:

- **Hairball vs expansion at the same final size.** A pane that ends up holding
  more elements per node after twenty incremental updates than it does on a cold
  render is leaking DOM — which a heap delta may or may not catch, depending on
  what the detached nodes still reference.
- **Hairball vs LOD & culling.** Culling should cut `domNodes` on a DOM engine
  roughly in proportion to `kept`. On a canvas engine it cuts nothing there, and
  that is the finding: whatever culling bought, it did not buy it by holding
  less.

---

## Time-to-render

The hairball scenario splits the wait into four legs on purpose. One total would
hide which of them is your problem.

| Metric | What it covers |
|---|---|
| `synthMs` | building the JS objects — the app's cost, identical for every engine |
| `layoutMs` | `layoutRadial` over the whole graph — also identical for every engine |
| `updateMs` | **what the engine spent** turning that graph into its own elements |
| `ttfrMs` | everything from "here is a graph" to "there are pixels" |

### `updateMs`
Self-reported by the pane through its `onStat` callback — every renderer in this
repo times its own update and reports it. **This is the number that separates
these libraries.** The two above it are shared code and will be the same in
every row; if they are not, something else was happening on the machine.

### `ttfrMs` — time to first render
Wall clock from handing the graph over until the browser has presented it,
including React's render and the paint. The one a user feels.

The measurement hinges on `nextPaint()`
([probes.ts:205](src/bench/probes.ts#L205)), which resolves after **two** rAF
callbacks, not one. A single rAF fires *before* the paint it belongs to, so it
only proves the browser is about to draw. The second callback runs on the
following frame, by which point the first has actually been presented. On the
DOM engines the gap between those two is most of the cost.

`ttfrMs` is the headline for the hairball scenario.

---

## Layout and the worker

From `runLayout()` ([runLayout.ts:142](src/bench/runLayout.ts#L142)) and
`forceLayout()` ([force.ts:56](src/bench/force.ts#L56)). The same d3-force
simulation runs either way, so the only variable the toggle changes is *where*.

| Metric | Computation |
|---|---|
| `where` | `'main'` or `'worker'` |
| `solveMs` | the simulation itself, timed inside whichever thread ran it |
| `totalMs` | what the caller waited, end to end |
| `transferMs` | `totalMs − solveMs` — the structured-clone round trip |
| `ticks` | simulation ticks executed |
| `alpha` | d3's cooling parameter when it stopped, 3 dp |
| `converged` | `alpha ≤ alphaMin` |
| `framesDuring` | frames the browser presented while the solver ran |
| `worstFrameMs` | the longest gap between two of them |

### The one to read is not `solveMs`
It barely moves between main thread and worker — it is the same arithmetic on
the same CPU. `framesDuring` and `worstFrameMs` are the finding: on the main
thread the tab is frozen for the whole solve and presents ~zero frames, and in a
worker it stays at 60 throughout.

### `transferMs`
The honest counterweight to "just put it in a worker". Graphs are stripped to
`{id}` and `{id, source, target}` before crossing
([runLayout.ts:73](src/bench/runLayout.ts#L73)) — sending whole nodes would
charge the worker path a serialisation cost the main-thread path never pays and
flatter it in the wrong direction. Even stripped, at 50,000 nodes the boundary
is not free, and this is what it costs.

### `ticks`, `alpha`, `converged`
d3-force decays `alpha` geometrically toward `alphaMin`; when it gets there, the
arrangement has stopped meaningfully moving. Ticks are pumped **synchronously**,
by hand, rather than left to d3's rAF-driven internal timer — that timer spreads
the work over as many seconds as the frame rate needs, which would make this
measure wall-clock rather than CPU, and would not reproduce the freeze a real
app suffers doing it the naive way.

`maxTicks` (400) is a floor under the worst case, not a target. A graph that has
not settled by then reports the alpha it reached and `converged: false` — that
is a finding, not a failure. **Convergence speed is `ticks`, cost of convergence
is `solveMs`; report both.**

---

## Expansion — the interaction this app ships

Two ways in, reporting the same thing. Clicking a node on a `#/lab/<engine>` page
hangs `expand by` new neighbours off it and reports that one click. The scripted
`Expansion` scenario does `clicks` of them in a row, spread across the graph, and
reports the distribution — which is the version you can compare across engines.

| Metric | What it covers |
|---|---|
| `addedNodes` | what the clicks asked for — the denominator for the rest |
| `expandMs` (lab) | growing the graph plus the **incremental** radial layout, one click |
| `layoutP95Ms` | the same incremental layout, worst of the run — **shared code, identical for all eight** |
| `p50Ms` / `p95Ms` / `worstMs` | the wait from handing over the grown graph to pixels existing |
| `firstMs` / `lastMs` | the first click against the last, so a cost that grows shows up inside one row |
| `updateP95Ms` | what the engine itself spent on the diff |

> **At the default 20 clicks, `p95Ms` *is* `worstMs`.** `summarise` indexes
> `sorted[floor(0.95 × n)]`, which at n = 20 is `sorted[19]` — the maximum. A
> percentile needs about a hundred samples before it is a percentile rather than
> an order statistic, and a hundred expansions into a 20,000-node graph is
> minutes per engine. So **`p50Ms` is the headline for this scenario** and `p95Ms`
> should be read as "worst of twenty", which is what it is. Raise `Expansions` if
> you want a real tail.

**`p50Ms` is the headline and `layoutP95Ms` is what you subtract from it.** The
shared layout costs about **2 ms at 1,000 nodes, 9 ms at 5,000 and 22 ms at
20,000**; everything above that in the wait belongs to the engine. Quoting `p95Ms`
alone would charge every library for the app's own arithmetic.

`firstMs` against `lastMs` is worth reading before anything else in the row. If
they are close, the engine is diffing — the cost of a click does not depend on
how much is already on screen. If `lastMs` is well above `firstMs`, it is
rebuilding, and the interaction gets worse the longer someone uses it.

`expandMs` is not comparable to the hairball's `layoutMs`, and quoting them
side by side would be wrong twice over. The hairball lays the whole graph out
cold; an expansion is handed the previous positions and only has to place the
newcomers, which is what keeps everything already on screen from moving. That
incremental path is **O(n²)** — it tests each candidate slot against every
placed node — so `expandMs` climbs with the size of the graph you are expanding
*into*, not with `addedNodes`. Expanding 25 nodes into a graph of 20,000 is the
case to watch, and it is the app's cost, not the engine's.

The engine's cost is `updateMs`: 25 new nodes arriving into a scene of 20,000
is a diff, and how cheaply a library does that diff is most of what separates
these eight once a graph is being explored rather than loaded.

---

## Draw budget — LOD and culling

From `optimise()` ([optimize.ts:119](src/bench/optimize.ts#L119)). Both
optimisations are applied in the **shared layer**, not through each library's own
feature, so every engine gets identical help.

- **LOD** = `stripLabels`: same graph, every `name` and `label` blanked. Captions
  are the expensive half of a dense graph everywhere — canvas engines pay a
  `measureText` and a fill each, SVG and DOM engines pay a whole element each.
  This is exactly what Cytoscape's `min-zoomed-font-size` does automatically.
- **Culling** = `cullToBox` against `centreBox(positions, fraction)`: a centred
  box covering `fraction` of the graph's extent. An edge survives only if **both**
  endpoints do — keeping half-edges means keeping their off-screen endpoint,
  which is culling that culls nothing. The root gets no exemption; a viewport
  does not keep a node because it is important.

| Metric | Meaning |
|---|---|
| `drawnNodes`, `drawnEdges` | what actually reached the engine |
| `kept` | `drawnNodes ÷ nodes`, as a percentage |

**`kept` is the denominator for every other number in that row.** And it is not
the fraction you set: a radial layout puts most of its nodes on the outermost
ring, so a centred box at `fraction: 0.5` typically keeps well under half the
graph.

The honest caveat, which belongs in any write-up: an engine that ships its own
culling gets no extra credit here, and an engine with none gets to borrow yours.
That is deliberate — it separates *"this library is fast"* from *"this library
ships the optimisation you would otherwise have written yourself"*.

---

## Interaction — hover and debounce

The hover scenario ([scenarios.ts:683](src/bench/scenarios.ts#L683)) has a
calibration pass before it measures anything, and the reason is worth knowing:
a node is about eleven pixels across on a fitted graph, so a blind sweep across
the pane lands on one roughly never. The first version of this scenario reported
"1 callback out of 181 moves" for every engine, which measured the geometry of
the sweep and nothing about the library.

So it walks a grid and keeps the points that produced a callback — the engine's
own hover callback is the oracle, which needs no engine-specific API and is the
identical procedure for all eight. The grid is derived from the pane at roughly
one sample every 4 px, which is what it takes not to step over an 11 px node; it
was a fixed 56 × 28 and that was a bug, described in
[COMPARISON.md](COMPARISON.md#what-this-file-still-cannot-tell-you).

| Metric | Computation | What it tells you |
|---|---|---|
| `hitArea` | `hits ÷ grid points`, as % | how much of the pane this engine will report a hover from |
| `pointerMoves` | synthetic pointer steps dispatched | the traffic, for context |
| `hoverCallbacks` | callbacks the engine fired | raw chattiness |
| `callbacksPerMove` | `hoverCallbacks ÷ pointerMoves`, 2 dp | see below |
| `inputP50Ms` / `inputP95Ms` / `inputWorstMs` | pointer event → the paint that answers it | see below |

### `inputP50Ms`, `inputP95Ms`, `inputWorstMs`
From `latency()` ([probes.ts](src/bench/probes.ts)): 24 samples, each one a
pointer event dispatched at a calibrated hit point with the clock stopping at
the paint that answers it — `nextPaint()`, so the paint has been *presented* and
not merely scheduled. Alternates on-node and off-node so every sample is a real
transition, with the debounce off, which makes it the engine's own floor rather
than the debounce's contribution.

**This is the number a user calls "laggy", and `frameP95` is at its most
misleading right here.** An engine can present every frame inside its budget
while the response to the pointer sits in a queue behind the redraw: the
animation is smooth and the hover card arrives 400 ms after the pointer did.
Nothing in the frame columns distinguishes that from a hover card that arrived
instantly.

There is a floor of one frame by construction — about 8 ms on a 120 Hz panel,
16 ms on a 60 Hz one — so these are comparative between engines on one machine
and are not absolutes.

### `hitArea`
A by-product worth reading on its own. A canvas engine hit-tests the drawn
symbol; a DOM engine hit-tests the element's whole bounding box, which is
larger; jsPlumb's label sits outside the disc and is part of the node, which is
larger again. Different libraries disagree about what "on a node" means.

### `callbacksPerMove`
`1.0` means the engine called back on **every** transition — correct, and
expensive. Below 1 it is deduping. Above 1 it is reporting misses as well as
hits, and every one of those is a React render.

Note it is deliberately **not** the ranked metric for this scenario: ranking on
it would put the engine that silently drops hovers at the top. What a debounce
exists to protect is the frame time, so `p95` is what gets ranked.

The pointer alternates on-node and off-node every step, because sitting still on
one node would let every engine dedupe the run down to a single callback — the
traffic a debounce absorbs is the *transitions*.

The debounce is applied to the **React state update**, not to the engine
([usePane.ts:107](src/bench/usePane.ts#L107)), because that is where the real
hover card's cost is. Counting callbacks without the state update would measure
how chatty the engine is and miss the half of the cost the debounce removes.

---

## Bundle cost — the one metric that is not a scenario

### `bundleKB`
Not measured in the browser at all. Every engine sits behind a `React.lazy` in
[`src/engines.ts`](src/engines.ts), so the app build already emits exactly one
chunk per engine; [`.bench-drivers/size.mjs`](.bench-drivers/size.mjs) builds
with the Vite manifest on, walks the import graph, and gzips what it finds.

```
node .bench-drivers/size.mjs           # a markdown table
node .bench-drivers/size.mjs --json    # the same numbers, machine-readable
```

Three decisions in it that change the number materially:

- **Marginal, not total.** Everything reachable from the HTML entry — React, the
  shared graph layer, the bench chrome — is subtracted, because it is paid for
  before any engine is chosen. Counting it eight times would flatten the
  differences the column exists to show.
- **Siblings are excluded.** The shared store is dynamically imported from all
  eight panes, so an unstopped walk from one pane reaches the other seven and
  reports the union. It did, and all eight came out identical, which is the kind
  of wrong number that looks like a working script.
- **Gzip per file, not over a concatenation.** That is how they are served; one
  stream would share a dictionary across files and under-report.

Anything the build emitted that neither the entry nor any engine claimed is
printed rather than folded in — in practice the libraries' own layout workers,
fetched by `new Worker(new URL(...))` from inside `node_modules` and so invisible
to the import graph. Cytoscape's is 152 KB gzipped, which is more than
Cytoscape's own chunk. Deferred cost, not zero cost, and this repo uses the
shared layout rather than theirs.

---

## Row-level outcomes

`unsupported` is a first-class result, not an error. Two engines have no
viewport API at all, and "cannot do this" is worth a row — much more useful than
an invented zero. `failed` is a thrown scenario: *"this engine could not complete
the 50,000-node hairball"* belongs in the table, not the console. Both render as
a spanning note instead of numbers.

---

## Which scenario reports what

| Scenario | Headline metric | Also reports |
|---|---|---|
| Hairball | `ttfrMs` | `synthMs` `layoutMs` `updateMs` `heapMB` `heapPerNodeKB` `domNodes` `domPerNode` `blockedMs` `longestTaskMs` `idleLagP95Ms` |
| Expansion | `p50Ms` | `p95Ms` `worstMs` `firstMs` `lastMs` `layoutP95Ms` `updateP95Ms` `heapMB` `heapPerNodeKB` `domNodes` `domPerNode` `blockedMs` |
| Streaming | `fps` | `frameP95` `worstFrameMs` `dropped` `pushedPerSec` `heapMB` `heapSlopeMBs` `leakMB` `lagP95Ms` `lagWorstMs` `domNodes` `domPerNode` |
| Zoom & pan | `frameP95` | `fps` `frameP50` `worstFrameMs` `dropped` `blockedMs` `lagP95Ms` |
| Layout & worker | `worstFrameMs` | `where` `solveMs` `transferMs` `ticks` `alpha` `converged` `framesDuring` |
| LOD & culling | `frameP95` | `kept` `drawnNodes` `drawnEdges` `ttfrMs` `fps` `dropped` `lagP95Ms` `domNodes` `domPerNode` |
| Hover & debounce | `frameP95` | `inputP50Ms` `inputP95Ms` `inputWorstMs` `hitArea` `callbacksPerMove` `hoverCallbacks` `dropped` |
| *(not a scenario)* | `bundleKB` | marginal gzipped cost of selecting the pane |

Headlines are declared in [Compare.tsx:31](src/bench/Compare.tsx#L31) with the
metric named in the column header, so the choice can be argued with rather than
taken on trust.

---

## Presenting these numbers

### Match the chart to the metric

| Metric shape | Present as | Not as |
|---|---|---|
| Frame time (`p50`/`p95`/`worst`) | **grouped horizontal bars, ms, log scale** — one bar per engine, p50 and p95 side by side | a line chart; there is no time axis |
| `fps` | a **threshold table** (≥55 / 30–55 / <30), or bars only when something is failing | bars across engines that all clear 60 — see below |
| `ttfrMs`, `updateMs`, `solveMs` | **stacked horizontal bars**, one segment per leg, so the stack sums to the wait | separate charts; the whole point is which leg dominates |
| `dropped`, `blockedMs` | **bars, ms or count**, with the window length in the caption | a percentage of anything |
| Heap over a run | **a line over the sampled trail**, with the drain reading marked | a single before/after number |
| `kept` | **always adjacent to** whatever speed-up it explains | its own chart |
| Capability facts (viewport, LOD, glyphs, routing) | **a text matrix** | a score |

### The FPS bar chart is the trap

A bar chart of frames-per-second across engines is the default thing everyone
builds, and it is close to useless in the middle of the range, for two reasons.

It is **bounded above by vsync**: every engine that clears the frame budget lands
on the same bar, so a library with 4 ms of headroom and one with 15 ms look
identical. And the ceiling **moves with the hardware** — the same code charts as
60 on one laptop and 120 on another, so the chart is not comparable to anyone
else's, including your own from last month.

Plot **p95 frame time in milliseconds on a log axis** instead, with a 16.7 ms
budget line drawn across it. It is unbounded, so headroom is visible; the budget
line makes pass/fail readable at a glance; and the log axis keeps a 400 ms
disaster from flattening the engines that are merely mediocre. Put fps in the
tooltip or a column if people expect to see it.

### Do not average across scenarios into one score

"Fastest" and "can draw an avatar on a node" are not commensurable, and neither
are a cold render and a zoom sweep. The compare page keeps the measured tables
and the capability matrix in separate halves for this reason. A reader choosing
a library needs both, kept apart.

### State the environment, every time

These numbers are not portable, and a chart without this block is not a claim
anyone can check:

- browser and version, and whether long-task/heap columns were available
- display refresh rate (`dropped` assumes 60 Hz)
- CPU, and **whether the machine was on battery** — throttled cores can halve
  frame rates on a laptop
- how many runs, and whether you report the median or one run
- whether `--js-flags="--expose-gc"` was on

### Run it more than once

Everything here is a single-shot measurement written to `localStorage` and
overwritten on re-run of the same engine, scenario and paint backend — a
different backend is a different row, not an overwrite. Frame percentiles over a 10-second window are reasonably
stable; heap deltas and first-render times are not. Run each engine three times,
report the median, and say that you did. For anything you plan to publish, close
every other tab: frame times and long tasks are properties of *the tab's main
thread*, and a Slack notification lands in your p95.

---

## Where to see them live

The **lab** ([`src/bench/Lab.tsx`](src/bench/Lab.tsx), one page per library at
`#/lab/<engine>`) puts the frame, blocking and heap readouts in a continuously
sampled gauge and gives you the dials by hand. It stops the gauge while a
scripted scenario runs — that scenario's row is the record, and two disagreeing
readouts on one screen is an invitation to quote the wrong one.

See [BENCHMARKING.md](BENCHMARKING.md) for what each scenario is testing and
why, and [COMPARISON.md](COMPARISON.md) for the verdict.
