# The verdict

Eight graph libraries, one shared graph, two measured passes.

**Pass 1** ran 7 scenarios × 8 engines at 1,000 / 1,500. **Pass 2** swept the
sizes (1k / 5k / 20k / 50k), both paint backends on the three engines that have
two, expansion at three sizes, the LOD-off baseline, and the leak column three
times over with `--expose-gc`. Raw rows: [`bench-data/`](bench-data/). Full tables,
caveats and reasoning: **[RFC.html](RFC.html)** §5 — this file is the short answer.

> **Read [RFC.html](RFC.html) §5.0 before quoting anything.** Eleven
> configurations were measured in both passes: they repeat to within 0–3% where an
> engine has headroom and swing **43–92%** where it is marginal. One conclusion in
> this file's previous version was retracted on that basis, and two of its claims
> were simply wrong.

---

## The short answer

| | Engine | Verdict |
|---|---|---|
| 🥇 | **Neo4j NVL** (**WebGL**) | **Pick this, subject to two caveats.** The only engine measured that is usable above ~10,000 nodes: **480 ms at 20,000 and 1,196 ms at 50,000**. The only one that yields the thread while rendering (489 ms longest task of a 1,028 ms load). Caveats: **518 KB gzip** (~10× React Flow) and it **retains ~69 MB after churn against a 7.1 MB base**. |
| 🥈 | **vis-network** | **Shortlist, and the value pick.** Fastest cold load at small sizes (136 ms), clean 9.2 ms zoom, **161 KB**, and the only engine with a **clean leak column** (≈0 MB retained). But 2,170 ms at 20,000 with a 1,272 ms single task, and 5,630 ms at 50,000. |
| 🥉 | **Cytoscape.js** | **Third, and it fades at scale.** Good to ~5,000 (873 ms). At 20,000 it is 4,266 ms with a **3,479 ms un-interruptible task** and 319 MB; at 50,000 it locked the tab past **two minutes**. Its WebGL mode does not help — a rasteriser swap under the same geometry, 7% better. |
| | **ECharts** | **Out, on the evidence.** Passes cold load (189 ms), then: **absorbed 365 / 310 / 308 / 253 of 500 nodes/sec across four runs** — the single "500" in pass 1 was the outlier. 503 MB of heap at 20,000 nodes and a 47.6 MB base for 1,000. Its SVG backend is 3.6× worse at zoom with 9.7 s blocked. One genuine win: **dropping labels alone buys it 2.7×**. |
| | **React Flow v9** | **Out on rendering family.** 50 KB and by far the nicest API. **10.8 s to paint 5,000 nodes** — of which 10.8 s is one task — and at 20,000 it **killed the renderer process**; a page reload timed out after 60 s. Its own `updateMs` is **1–5 ms**. The DOM is the ceiling, not the library. |
| | **FusionCharts** | **Out on capability.** No viewport at all — `unsupported` for zoom. Absorbed 103 of 500 nodes/sec. 897 KB. |
| | **jsPlumb** | **Out.** 6.6 s to first paint at 1,000 nodes, with a **3.9 s single task**. Not a graph library — a connectivity toolkit with no layout, viewport or data model. |
| | **v-network-graph** | **Out.** Hard-capped at **150 nodes** in its own source. Every cell at 1,000 nodes is an empty pane, and it needs a second framework (Vue 3) in the bundle. |

**D1 is answered and it separates the shortlist.** If the product needs 20,000+
nodes, NVL on WebGL is the only option measured. If it needs ~5,000, vis-network
wins on weight, memory hygiene and simplicity.

---

## But fix this before choosing an engine

**The expansion interaction — click a node, get its neighbours — is capped by
this repo's own props contract, not by any library.** At 20,000 nodes it costs
**~1 second per click and freezes the tab for about that long on every engine
measured**, and the shared incremental layout is only **25 ms** of it.

Every renderer is handed `graph`, a whole new object, and re-derives its scene:
[`VisGraph.jsx:200`](src/vis/VisGraph.jsx#L200) upserts all 20,000 nodes per
click; [`CytoscapeGraph.jsx:210`](src/cytoscape/CytoscapeGraph.jsx#L210) rewrites
`.data()` on all 20,000. Two independently written wrappers, same shape, because
the contract offers no other. WebGL makes it *worse* (NVL 1,408 ms vs canvas
1,045), which is what you would expect if the scene is re-uploaded whole each
time.

**A delta channel in the renderer props is worth more than the difference between
the three shortlisted engines.**

---

## The finding that outranks the engine choice

**Put the layout in a Web Worker.** Measured across all eight engines, both legs:

| | Main thread | In a Worker |
|---|---|---|
| `solveMs` | 362–411 ms | 362–390 ms — **unchanged** |
| `blockedMs` | 366–413 ms | **0, all eight** |
| `worstFrameMs` | ~380 ms | **8.5–24 ms** |
| `framesDuring` | **3** | **34–47** |
| `transferMs` | — | **1–2 ms** (ECharts 39) |

The solve is not faster. The tab is simply not frozen while it happens — three
presented frames becomes forty. It costs 1–2 ms of structured clone, it works
identically for every engine including the ones being eliminated, and it is the
largest single improvement in the whole exercise. **This decision does not depend
on which renderer wins.**

---

## The breaking point — `ttfrMs` to first visible render

**This is the table that decides it.** Edges at 1.5× nodes, cold pane each time.

| Engine | 1,000 | 5,000 | 20,000 | 50,000 | longest single task @20k |
|---|---|---|---|---|---|
| **Neo4j NVL · WebGL** | — | **203** | **480** | **1,196** | 466 ms |
| Neo4j NVL · canvas | 152 | 312 | 1,028 | 2,452 | **489 ms** — yields |
| vis-network | **136** | 541 | 2,170 | 5,630 | 1,272 ms |
| Cytoscape · canvas | 237 | 873 | 4,266 | **>120 s, unresponsive** | 3,479 ms |
| Cytoscape · WebGL | — | 1,039 | 3,948 | 10,813 | 3,936 ms |
| ECharts · canvas | 189 | 662 | 4,183 | — | 4,082 ms |
| React Flow | 353 | **10,843** | **killed the tab** | — | 10,819 ms @5k |
| ~~v-network-graph~~ | hard cap at ~150 nodes in its own source | | | | |
| jsPlumb | **6,594** | not attempted — its wall is at or below 1,000 | | | |

**Read the last column, not the first.** For vis-network, Cytoscape and ECharts
the longest task at 20,000 nodes is *essentially the entire render* — one
un-interruptible block, no frame, no spinner, no cancel. **NVL is the only engine
whose longest task is under half its total**, meaning it yields the thread while
working. At 20,000 nodes that is the difference between a slow load and a dead tab.

**NVL scales sublinearly** — 5.9× the time for 10× the nodes on WebGL — and it is
faster at 50,000 than Cytoscape and ECharts are at 20,000.

**"Has a WebGL mode" means nothing until measured.** NVL's WebGL moves its ceiling
by roughly an order of magnitude. Cytoscape's — a rasteriser swap beneath the same
canvas geometry and hit-testing — moves it **7%**.

---

## Cold load at 1,000 nodes — where nobody has a problem yet

| Engine | `updateMs` (library) | **`ttfrMs`** (to pixels) | longest task |
|---|---|---|---|
| vis-network | 85 | **122** | 86 |
| Neo4j NVL | 90 | **129** | 90 |
| ECharts | 153 | **238** | 152 |
| Cytoscape | 204 | **260** | 204 |
| React Flow | **2** | **293** | 283 |
| jsPlumb | 485 | **6,594** | **3,928** |
| FusionCharts | 19 | **20** ⚠️ suspect | 0 |
| ~~v-network-graph~~ | 0 | ~~11~~ | 0 |

A **54× spread** at a size that is not large for this problem — but note that this
table's ranking does **not** survive to 20,000 nodes: vis-network leads here and
NVL leads by 4× there. **A single-size benchmark would have picked the wrong
engine.**

**React Flow's row is the most instructive in the file.** Two milliseconds of
library work, 293 ms to pixels. The other 291 ms is React 16 reconciling 1,000
components and the browser laying out 1,000 DOM elements. A benchmark that timed
the library call would have crowned React Flow the fastest of the eight. This is
why the harness measures to paint.

**FusionCharts' 20 ms is flagged, not celebrated.** Zero blocked time while every
canvas engine spends 85 ms+ is implausible; it renders through its own async
lifecycle, so `show()` most likely returned before it had drawn. Its 6.2 fps under
streaming is the corroboration.

---

## Streaming — 500 nodes/sec into a 1,000-node base, 20 s

`pushedPerSec` is a **result, not a setting**: the feed asks for 500 and reports
what the engine actually took.

| Engine | **absorbed** | **`frameP95`** | `blockedMs` | `baseMB` | **retained after drain** |
|---|---|---|---|---|---|
| Neo4j NVL · WebGL | 500 / 500 | **8.9** | **0** | — | — |
| Neo4j NVL · canvas | **498 / 500** | 16.7 | **0** | 7.1 | **69.9 · 68.7 · 68.6** ⚠️ |
| Cytoscape | 500 / 500 | 33.3 | 50 | 13.3 | 12.9 · 12.2 · 12.3 |
| React Flow | 500 / 500 | 41.7 | 409 | — | — |
| vis-network | 500 / 500 | 50.0 | 110 | **5.5** | **1.2 · −0.3 · −0.1** ✅ |
| ECharts | **365 · 310 · 308 · 253** ⚠️ | 83.5–159 | **16,825** | **47.6** | 21.2 · 21.3 · 24.3 |
| FusionCharts | **103 / 500** | 533.3 | **19,203** | — | — |
| jsPlumb | **103 / 500** | 516.6 | **18,953** | — | — |

Two engines could not accept the feed at all — the timer could not even fire on
schedule, because the thread was never free. **That is the failure mode that
matters: not a low frame rate, a feed that silently falls behind.**

**ECharts is why a measurement gets repeated.** Pass 1 recorded 500 / 500 and this
file previously called it a pass. Four further runs gave **365, 310, 308 and 253** —
it absorbs roughly half to two-thirds of the feed. Its own `updateMs` is 9 ms; the
16.8 s of blocking is what it does *around* each `setOption`.

**Memory, on the fixed metric** (three runs each, `--expose-gc`, baseline read on
an *empty* pane): vis-network is clean, Cytoscape retains about one base graph —
consistent with a cache it never shrinks — and **NVL retains ~10× what it costs to
hold the graph**, reproducible to 1.3 MB. `baseMB` is the more useful column and
was not being reported at all: the same 1,000 nodes cost **5.5 MB in vis-network
and 47.6 MB in ECharts**, an 8.7× spread for identical data.

Every `heapSlopeMBs` came back *negative*, so none of this shows up as a rising
heap during the run — only in the drain. **A monitoring rule built on heap slope
alone would miss all four.**

**NVL's `updateMs` of 199 ms is the highest in the table and it still blocks for
zero.** That is what an off-thread renderer buys.

---

## Zoom and pan — the cleanest split in the run

| Engine | **`frameP95`** | `dropped` | `blockedMs` |
|---|---|---|---|
| vis-network | **9.2** | 0 | 0 |
| Cytoscape · canvas | **9.3** | 0 | 0 |
| Cytoscape · WebGL | **8.8** | 0 | 0 |
| Neo4j NVL | **9.2 / 17.7** ⚠️ unstable | 0 | 0 |
| ECharts · canvas | **17.6 / 25.2** | 16 | 0 |
| ECharts · **SVG** | **91.7** | — | **9,714** |
| React Flow | **100.0** | 454 | 8,983 |
| jsPlumb | **541.7** | 589 | 10,093 |
| FusionCharts | `unsupported` — no viewport exists | | |

**This separates by rendering family, not by library — and ECharts proves it from
the inside.** Same library, same series, same option object: canvas holds 25 ms
with **zero** blocking; SVG collapses to 91.7 ms and blocks for **9.7 of the 10
seconds**. If anyone still thinks the canvas/SVG framing is a simplification, that
pair is the answer.

**Two NVL zoom figures are shown because there are two, from identical
configurations** — 9.2 in pass 1 and 17.7 in pass 2. That 92% swing is why the
apparent "NVL WebGL improves zoom" result was **retracted**: the difference it
claimed is smaller than the noise on the metric.

The DOM engines collapse because panning a DOM scene means re-laying out 1,000
elements every frame.

---

## LOD and culling — a targeted fix, not a general one

Culling 95.4% of the graph away (`fraction: 0.5` keeps **4.6%** — 46 of 1,000
nodes, because a radial layout puts most nodes on the outer ring) bought **four of
eight engines nothing at all**. They were already holding a clean frame with
everything drawn. `frameP95`, 100% drawn → labels dropped → culled to 4.6%:

| Engine | off | labels dropped | culled | what worked |
|---|---|---|---|---|
| Cytoscape · vis · NVL · FusionCharts | 8.7–9.2 | 9.0–9.2 | 8.8–9.3 | **nothing — don't bother** |
| **ECharts** | **25.3** | **9.4** | 9.3 | **labels alone: 2.7×**, culling adds nothing |
| **React Flow** | **108.3** | 75.7 | **8.9** | culling: **12×** |
| **jsPlumb** | **600.9** | — | 25.0 | culling: **24×**, still misses 60 fps |

**ECharts is label-bound; the DOM engines are node-bound; everyone else needs
neither.** Applying the wrong one is pure cost — the cull walks the whole graph to
achieve nothing for half these engines.

---

## What this file still cannot tell you

Stated plainly, because a comparison's blind spots decide more than its rankings:

- **Whether NVL's 69 MB is an unbounded leak or a cache that stops growing.**
  Three 20-second runs cannot separate those, and the distinction is the
  difference between a blocker and a footnote. One 10-minute churn run settles it.
- **How much of NVL's WebGL win is bought by drawing less.** Its WebGL path
  renders **no captions at all**, so the honest comparison is WebGL against
  *LOD-on canvas*, and that was not run.
- **No customisation cost.** Custom glyphs, edge routing and rich labels are
  capability-matrix entries in `src/engines.js`, not measurements — and they are
  exactly where a fast canvas engine gets slow. This is why the RFC asks for a
  spike in **two** engines, not one.
- **Hover is diagnosed, not measured.** The six `unsupported` rows turned out to
  be a harness bug — the calibration grid sampled every 28 px while hunting for
  11 px nodes, so it stepped over them. At 4 px spacing five of the six report
  hover. But the hit area is still under 1%, so `callbacksPerMove` is only
  trustworthy for vis-network, jsPlumb and Cytoscape (all **1.00** — a React
  render per pointer transition). What did come out of it: **hover traffic over
  1,000 nodes blocks the thread for tens of seconds** on half these engines, and
  it never shows up in `frameP95`.
- **Nothing above 50,000 nodes** — that is where the dial stops.
- **One machine.** Every figure is one 120 Hz Apple-silicon laptop on mains power,
  in an automated browser. Nothing here has been near 60 Hz hardware, a battery,
  or a phone.

**Two claims in the previous version of this file were wrong**, and both were
caught by repeating a measurement rather than by reasoning about it: ECharts does
*not* absorb the full 500 nodes/sec, and NVL's "+118 MB leak" was a sign error in
the metric (the baseline was read with the graph already loaded). Both are
corrected above. The lesson is in [METRICS.md](METRICS.md#leakmb).

---

## Reproducing

```bash
npm install --legacy-peer-deps
npm run build && npm run preview
```

`#/bench` → **Everything** (all seven scenarios × all eight engines at the 1,000 /
1,500 defaults, ~7 min) → `#/compare` → **Export JSON**.

For pass 2 — the size sweep, both paint backends, the LOD-off baseline and the
three leak runs — the leg lists are in [`bench-data/`](bench-data/) and the driver
in [`.bench-drivers/`](.bench-drivers/):

```bash
EXPOSE_GC=1 node .bench-drivers/sweep.mjs bench-data/plan-final.json out.json
```

Two legs `Everything` never covers, because they are knob settings rather than
defaults: the **worker** half of `Layout & worker`, and any **non-default paint
backend**. Select `Layout & worker`, tick **In a Web Worker**, hit **All
engines**. `Everything` uses default knobs, so it only ever runs the main-thread
half.

Close your other tabs — frame times and long tasks belong to the tab, not the
component, and a Slack notification lands in your p95. One browser at a time: two
Chromes sharing the CPU put each one's frame times into the other's p95. Prefer
60 Hz, or state the refresh rate. `--js-flags="--expose-gc"` is **required**, not
optional, for the heap columns.

**And repeat at least one cell you have already measured.** Both errors corrected
in this file were found that way, and neither was findable by re-reading the code.

Full context, every table and the open decisions: **[RFC.html](RFC.html)** §5 (or
[RFC.md](RFC.md)). Metric definitions and how each one lies:
[METRICS.md](METRICS.md). Raw rows: [`bench-data/`](bench-data/).
