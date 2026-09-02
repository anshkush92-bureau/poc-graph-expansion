// The scenario catalog.
//
// Every scenario is a plain async function over one context object and knows
// nothing about which engine is on screen — it sets graph data, drives the
// viewport through the handle the pane published, and reads the probes. That is
// what makes eight engines comparable: they all run the identical script.
//
// ── The context ─────────────────────────────────────────────────────────────
//   knobs          resolved knob values for this run
//   show(graph, positions)   set the pane's data, resolve once it has painted
//   push(graph, positions)   set it and do NOT wait — for the streaming test
//   lastStat()     ms the pane reported for its most recent update
//   viewport()     { zoomBy, panBy, fit } published by the pane, or null
//   pane()         the pane's DOM element, for synthetic pointer events
//   hover          { count(), reset(), setDebounce(ms) }
//   signal         { aborted } — checked inside every loop
//
// ── What a scenario returns ─────────────────────────────────────────────────
//   { metrics: {...}, note?: string, unsupported?: string }
//
// `unsupported` is a first-class result, not an error. Two of these engines
// have no viewport API at all, and "cannot do this" is a finding worth a row in
// the table — much more useful than an invented zero.

import { ENTITY, ROOT, relationLabel } from '../graph/data.ts'
import { layoutRadial } from '../graph/ops.ts'
import { synthGraph } from '../graph/synth.ts'
import { optimise } from './optimize.ts'
import {
  domNodes,
  heapMB,
  latency,
  nextPaint,
  round,
  sampleFrames,
  sleep,
  startFrames,
  summarise,
  watchLag,
  watchLongTasks,
  collectGarbage
} from './probes.ts'
import { runLayout } from './runLayout.ts'
import type { EntityType, Graph, GraphNode } from '../engine/types.ts'
import type { LayoutMode } from './layout.worker.ts'
import type { KnobValue, Knobs, Scenario, ScenarioKnob } from './types.ts'

const EMPTY: Graph = { nodes: [ROOT], edges: [] }
const TYPES = Object.keys(ENTITY) as EntityType[]

// Knob reads. The catalog declares each knob's type and the runner carries the
// resolved values as one loose map, so a scenario says which kind it is reading.
const num = (value: KnobValue | undefined): number => Number(value ?? 0)
const flag = (value: KnobValue | undefined): boolean => value === true

/**
 * A heap difference in MB, or `null` where either reading is missing.
 *
 * `heapMB` returns null off Chromium, and a difference against a missing
 * reading has to stay missing rather than becoming a plausible-looking zero.
 */
const delta = (after: number | null, before: number | null): number | null =>
  after == null || before == null ? null : Math.round((after - before) * 100) / 100

/**
 * A per-node figure from a total, in KB.
 *
 * Worth having because the raw totals are not comparable across the dial: 40 MB
 * at 1,000 nodes and 40 MB at 50,000 are the same number and opposite findings,
 * and only the second one scales. Same argument for elements per node.
 */
const perNodeKB = (mb: number | null, n: number): number | null =>
  mb == null || !n ? null : round((mb * 1024) / n, 2)

const per = (total: number | null, n: number): number | null =>
  total == null || !n ? null : round(total / n, 2)

/**
 * Adds `count` nodes hung off nodes already present, plus one cross-link each.
 *
 * The streaming test spreads the arrivals across the graph, which is what a live
 * feed does. Pass `onto` and every newcomer hangs off that one node instead,
 * which is what a click-to-expand does — same growth mechanics either way, so
 * the two paths cannot drift into measuring different things.
 *
 * New objects, never mutation: every pane is memoised on graph identity, so an
 * in-place push would be invisible to all eight.
 */
export function sprout(graph: Graph, count: number, seq: number, onto?: GraphNode): Graph {
  const nodes = graph.nodes.slice()
  const edges = graph.edges.slice()
  for (let i = 0; i < count; i++) {
    const n = seq + i
    // Both indices are taken modulo a non-empty array's length.
    const type = TYPES[n % TYPES.length]!
    const parent = onto || graph.nodes[(n * 7919) % graph.nodes.length]!
    const node = {
      id: `LIVE-${n}`,
      type,
      level: parent.level + 1,
      name: `live_${n}`,
      risk: n % 100,
      flagged: n % 37 === 0,
      firstSeen: 'streamed',
      events: n % 200,
      synthetic: true
    }
    nodes.push(node)
    edges.push({
      id: `${parent.id}->${node.id}`,
      source: parent.id,
      target: node.id,
      label: relationLabel(parent.type, type)
    })
  }
  return { nodes, edges }
}

/**
 * Removes the `count` oldest streamed nodes, and every edge that touched them.
 *
 * Only nodes this scenario created are eligible, so the base graph stays put and
 * the node count holds steady — a streaming test whose graph grows without
 * bound is measuring the hairball again.
 */
export function prune(graph: Graph, count: number): Graph {
  const doomed = new Set<string>()
  for (let i = 0; i < graph.nodes.length && doomed.size < count; i++) {
    const id = graph.nodes[i]!.id
    if (id.indexOf('LIVE-') === 0) doomed.add(id)
  }
  if (!doomed.size) return graph
  return {
    nodes: graph.nodes.filter(n => !doomed.has(n.id)),
    edges: graph.edges.filter(e => !doomed.has(e.source) && !doomed.has(e.target))
  }
}

// Sizes bottom out at zero — an empty pane is a legitimate run and the baseline
// every other row is read against. `seconds` is the exception and stops at 1: it
// is a sampling window, not a size, and a zero-length one divides by zero on its
// way to an fps.
//
// Every scenario starts at the same 1,000 / 1,500 so a reader can lay the rows
// side by side and have the sizes cancel out: what is left between them is the
// scenario, not the dial. Where a library separates is further up, and the dial
// goes to 50,000 — but a comparison starts from one size for all of them.
const nodesKnob = (value = 1000): ScenarioKnob => ({
  key: 'nodes',
  label: 'Nodes',
  type: 'number',
  min: 0,
  max: 50000,
  step: 1,
  value
})
const edgesKnob = (value = 1500): ScenarioKnob => ({
  key: 'edges',
  label: 'Edges',
  type: 'number',
  min: 0,
  max: 150000,
  step: 1,
  value
})
const secondsKnob = (value = 10): ScenarioKnob => ({
  key: 'seconds',
  label: 'Seconds',
  type: 'number',
  min: 1,
  max: 60,
  step: 1,
  value
})

export const SCENARIOS: [Scenario, ...Scenario[]] = [
  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'hairball',
    label: 'Hairball',
    blurb:
      'One dense graph dropped in on a cold pane. Reports where the time went — building the ' +
      "data, laying it out, the engine's own update, and the wait until pixels exist — plus what " +
      'it cost in heap. At the default 1,000 / 1,500 all eight should manage it; turn the dial up ' +
      'to find where each one stops, which is what it is for.',
    knobs: [nodesKnob(), edgesKnob()],
    async run(ctx) {
      // Start from a bare root so the engine is not diffing against a graph it
      // already has: this measures a cold first render, not an update.
      await ctx.show(EMPTY, layoutRadial(EMPTY, null))
      await collectGarbage()

      const heapBefore = heapMB()
      const tasks = watchLongTasks()

      const builtAt = performance.now()
      const graph = synthGraph(num(ctx.knobs.nodes), num(ctx.knobs.edges))
      const synthMs = Math.round(performance.now() - builtAt)

      const laidAt = performance.now()
      const positions = layoutRadial(graph, null)
      const layoutMs = Math.round(performance.now() - laidAt)

      const handedAt = performance.now()
      await ctx.show(graph, positions)
      const paintedMs = Math.round(performance.now() - handedAt)

      const blocking = tasks.stop()
      const heapAfter = heapMB()
      const elements = domNodes(ctx.pane())

      // A quiet window: the graph is up and nothing is driving it. An engine
      // that keeps its own render or physics tick running costs the app every
      // task it queues from here on, and this is the only column that sees it —
      // frame deltas stay at the display cadence and `longtask` never fires.
      const idle = watchLag()
      await sleep(2000)
      const idleLag = idle.stop()

      return {
        metrics: {
          nodes: graph.nodes.length,
          edges: graph.edges.length,
          synthMs,
          layoutMs,
          // What the pane itself reported: turning the graph into its own
          // elements, which is the number that separates these libraries.
          updateMs: ctx.lastStat(),
          // Everything from "here is a graph" to "there are pixels", including
          // React's render and the browser's paint. The one a user feels.
          ttfrMs: paintedMs,
          heapMB: delta(heapAfter, heapBefore),
          // Per node, so this row can be read against a row from a different
          // dial setting.
          heapPerNodeKB: perNodeKB(delta(heapAfter, heapBefore), graph.nodes.length),
          // What the pane is actually holding, and the mechanism behind
          // `ttfrMs`: a canvas engine reports a handful of elements at any size,
          // a DOM engine reports several per node.
          domNodes: elements,
          domPerNode: per(elements, graph.nodes.length),
          blockedMs: blocking && blocking.blockedMs,
          longestTaskMs: blocking && blocking.longestMs,
          idleLagP95Ms: idleLag.p95
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'expand',
    label: 'Expansion',
    blurb:
      'The interaction this app is actually for: click a node on a graph that is already large, ' +
      'and wait for its neighbours. Repeated so the cost can be read as the graph grows under it, ' +
      'and laid out incrementally against the previous frame — nothing already on screen moves, ' +
      'which is what makes it an expansion rather than a reload. The number to read is `p50Ms`: ' +
      'the wait, at the click, from a user who is still looking at the old graph. At the default ' +
      '20 clicks `p95Ms` is arithmetically the maximum, so read it as worst-of-twenty and turn ' +
      '`Expansions` up if you want a real tail.',
    knobs: [
      nodesKnob(),
      edgesKnob(),
      {
        key: 'expandBy',
        label: 'Nodes per click',
        type: 'number',
        min: 0,
        max: 2000,
        step: 1,
        value: 25
      },
      { key: 'clicks', label: 'Expansions', type: 'number', min: 1, max: 200, step: 1, value: 20 }
    ],
    async run(ctx) {
      const base = synthGraph(num(ctx.knobs.nodes), num(ctx.knobs.edges))
      let positions = layoutRadial(base, null)
      await ctx.show(base, positions)
      await collectGarbage()

      const heapBefore = heapMB()
      const tasks = watchLongTasks()

      let live = base
      let seq = 0
      const waits: number[] = []
      const layouts: number[] = []
      const updates: number[] = []

      for (let i = 0; i < num(ctx.knobs.clicks); i++) {
        if (ctx.signal.aborted) break
        // Spread the clicks over the graph the same way `sprout` spreads a
        // stream, so the run is not repeatedly expanding one hot node whose
        // neighbourhood the engine has already got warm.
        const onto = live.nodes[(i * 7919) % live.nodes.length]!

        const solvedAt = performance.now()
        const grown = sprout(live, num(ctx.knobs.expandBy), seq, onto)
        seq += num(ctx.knobs.expandBy)
        // Incremental: the previous frame's positions are passed in, so the
        // newcomers are placed into free space and everything else stays put.
        positions = layoutRadial(grown, positions)
        layouts.push(performance.now() - solvedAt)

        const handedAt = performance.now()
        await ctx.show(grown, positions)
        waits.push(performance.now() - handedAt)
        const stat = ctx.lastStat()
        if (stat != null) updates.push(stat)

        live = grown
        // A beat between clicks. Without it consecutive expansions merge into
        // one long task and the per-click numbers stop meaning per-click.
        await sleep(60)
      }

      const blocking = tasks.stop()
      const heapAfter = heapMB()
      const elements = domNodes(ctx.pane())
      const wait = summarise(waits)
      const layout = summarise(layouts)
      const update = summarise(updates)

      return {
        metrics: {
          nodes: live.nodes.length,
          edges: live.edges.length,
          expansions: waits.length,
          addedNodes: live.nodes.length - base.nodes.length,
          // The wait a user feels, per click, from handing over the grown graph
          // to pixels existing.
          p50Ms: wait.p50,
          p95Ms: wait.p95,
          worstMs: wait.worst,
          // First against last, so a cost that grows with the graph under it is
          // visible inside a single row rather than only across sizes.
          firstMs: waits.length ? round(waits[0]!) : null,
          lastMs: waits.length ? round(waits[waits.length - 1]!) : null,
          // The shared incremental layout, identical for all eight — quoted so
          // the engine's share of the wait can be separated from the app's.
          layoutP95Ms: layout.p95,
          updateP95Ms: update.p95,
          blockedMs: blocking && blocking.blockedMs,
          longestTaskMs: blocking && blocking.longestMs,
          heapMB: delta(heapAfter, heapBefore),
          heapPerNodeKB: perNodeKB(delta(heapAfter, heapBefore), live.nodes.length),
          // Read against the hairball's figure at the same final size: a pane
          // that ends up holding more elements per node after twenty
          // incremental updates than it does on a cold render is leaking DOM.
          domNodes: elements,
          domPerNode: per(elements, live.nodes.length)
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'stream',
    label: 'Streaming',
    blurb:
      'Nodes and edges arriving and expiring at a fixed rate, the way a live network feed ' +
      'behaves. Pushed on a timer rather than after each paint, so a pane that cannot keep up ' +
      'falls behind instead of quietly slowing the feed. Heap is read again after the graph is ' +
      'emptied — what does not come back is a leak.',
    knobs: [
      // The base graph is built at base × 1.5 edges, so 1,000 here is the same
      // 1,000 / 1,500 the other five scenarios start from.
      {
        key: 'base',
        label: 'Base nodes',
        type: 'number',
        min: 0,
        max: 20000,
        step: 1,
        value: 1000
      },
      {
        key: 'rate',
        label: 'Nodes / sec',
        type: 'number',
        min: 0,
        max: 5000,
        step: 10,
        value: 500
      },
      secondsKnob(20)
    ],
    async run(ctx) {
      // Heap with an empty pane, *before* the base graph exists.
      //
      // This is the baseline `leakMB` has to be measured against and it was
      // missing: the reading was taken with the base graph already loaded and
      // compared against a reading taken after the pane had been emptied, so
      // every engine that retains nothing scores its base graph as a negative
      // leak. Two rows in the first pass came back at −25 MB, which was written
      // off as a collection landing mid-window — it was not. Re-running with
      // `--js-flags="--expose-gc"` reproduced it exactly, which is what a sign
      // error does and what GC noise does not.
      await ctx.show(EMPTY, layoutRadial(EMPTY, null))
      await collectGarbage()
      const heapEmpty = heapMB()

      const base = synthGraph(num(ctx.knobs.base), num(ctx.knobs.base) * 1.5)
      await ctx.show(base, layoutRadial(base, null))
      await collectGarbage()

      const heapStart = heapMB()
      const tasks = watchLongTasks()
      // Responsiveness under load, which the frame columns cannot report: an
      // engine can present every frame on time and still make the next click
      // wait behind a queue of pushes it has not caught up with.
      const lag = watchLag()

      // Ten pushes a second. Faster than that and the batches get small enough
      // that React's own per-update overhead dominates the measurement; slower
      // and the arrivals read as periodic reloads rather than a stream.
      // A rate of 0 pushes nothing at all rather than rounding up to one node a
      // tick, which makes it the idle-cost baseline for every other rate.
      const TICK = 100
      const perTick = Math.round(num(ctx.knobs.rate) / (1000 / TICK))

      let live = base
      let previous = layoutRadial(base, null)
      let seq = 0
      let pushes = 0
      const heapTrail: (number | null)[] = []

      const timer = setInterval(() => {
        if (ctx.signal.aborted || perTick < 1) return
        // Grow and shrink by the same amount, so the node count is flat and the
        // only thing under test is churn.
        live = prune(sprout(live, perTick, seq), perTick)
        seq += perTick
        // Incremental against the previous frame — the same path the app takes
        // on an expansion, and the one a streaming app would have to use.
        previous = layoutRadial(live, previous)
        ctx.push(live, previous)
        pushes += 1
        if (pushes % 10 === 0) heapTrail.push(heapMB())
      }, TICK)

      const frames = await sampleFrames(num(ctx.knobs.seconds) * 1000)
      clearInterval(timer)

      const blocking = tasks.stop()
      const lagging = lag.stop()
      const heapEnd = heapMB()
      const elements = domNodes(ctx.pane())

      // Empty the pane and look again. A heap that does not come back down once
      // every node is gone is the leak signal — the churn itself moving the
      // number around is not.
      await ctx.show(EMPTY, layoutRadial(EMPTY, null))
      await collectGarbage()
      const heapAfterDrain = heapMB()

      // Least-squares slope over the per-second readings. A rising heap under
      // constant node count is the other half of the same signal, and it shows
      // up long before the drain does.
      const slope = heapTrail.length > 2 ? trend(heapTrail) : null

      return {
        metrics: {
          nodes: live.nodes.length,
          edges: live.edges.length,
          pushes,
          pushedPerSec: Math.round((pushes * perTick) / num(ctx.knobs.seconds)),
          fps: frames.fps,
          frameP95: frames.p95,
          worstFrameMs: frames.worst,
          dropped: frames.dropped,
          updateMs: ctx.lastStat(),
          blockedMs: blocking && blocking.blockedMs,
          lagP95Ms: lagging.p95,
          lagWorstMs: lagging.worst,
          domNodes: elements,
          domPerNode: per(elements, live.nodes.length),
          // What holding the base graph costs this engine, empty pane to loaded.
          // Free to report — the reading it needs had to exist for `leakMB` to
          // mean anything — and it is the only per-engine memory number here
          // that is not a difference of differences.
          baseMB: delta(heapStart, heapEmpty),
          heapMB: delta(heapEnd, heapStart),
          heapSlopeMBs: slope,
          // Empty pane to empty pane, with a run of churn in between. Anything
          // above zero here did not come back.
          leakMB: delta(heapAfterDrain, heapEmpty)
        },
        note:
          heapEmpty == null
            ? 'Heap columns need Chromium — performance.memory is absent here.'
            : undefined
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'zoompan',
    label: 'Zoom & pan',
    blurb:
      'A scripted zoom into a cluster and back out, with a pan riding on top, driven once per ' +
      'animation frame. This is the test a library passes by offloading the transform instead ' +
      'of re-deriving the scene — the ones that redraw every node per frame separate here by an ' +
      'order of magnitude.',
    knobs: [nodesKnob(), edgesKnob(), secondsKnob(10)],
    async run(ctx) {
      const graph = synthGraph(num(ctx.knobs.nodes), num(ctx.knobs.edges))
      await ctx.show(graph, layoutRadial(graph, null))

      const view = ctx.viewport()
      if (!view) {
        return {
          unsupported:
            'No viewport. This engine has no pan/zoom of its own, so there is nothing to drive — ' +
            'a viewport here has to be hand-built, and that is the finding.',
          metrics: { nodes: graph.nodes.length, edges: graph.edges.length }
        }
      }

      const tasks = watchLongTasks()
      const lag = watchLag()
      let last = 1

      const frames = await sampleFrames(num(ctx.knobs.seconds) * 1000, progress => {
        // A full in-and-out sweep: 1× out to 4× and back. 4 rather than
        // further because four of these engines clamp their zoom there, and a
        // sweep that spends half its frames pinned against a ceiling measures
        // the clamp instead of the redraw. Driven as a ratio against the
        // previous frame's target: every engine here exposes a relative zoom
        // and only some expose an absolute one.
        const target = 1 + 3 * Math.sin(progress * Math.PI)
        view.zoomBy(target / last)
        last = target
        // A pan on top, so the test is not a pure scale — panning is what
        // invalidates a tile cache, and several of these keep one.
        view.panBy(Math.cos(progress * Math.PI * 6) * 14, Math.sin(progress * Math.PI * 4) * 10)
      })

      const blocking = tasks.stop()
      const lagging = lag.stop()
      view.fit()

      return {
        metrics: {
          nodes: graph.nodes.length,
          edges: graph.edges.length,
          fps: frames.fps,
          frameP50: frames.p50,
          frameP95: frames.p95,
          worstFrameMs: frames.worst,
          dropped: frames.dropped,
          blockedMs: blocking && blocking.blockedMs,
          // How long anything else would have waited while the sweep ran. An
          // engine that re-derives the scene every frame leaves the whole app
          // unresponsive during a pan, not merely choppy.
          lagP95Ms: lagging.p95
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'layout',
    label: 'Layout & worker',
    blurb:
      'The physics pass, on the UI thread and off it. Identical d3-force run either way, so the ' +
      'only variable is where it runs. The number to read is not the solve time — it barely ' +
      'moves — but the frames: on the main thread the tab is frozen for the whole of it, and in ' +
      'a worker it stays at 60.',
    knobs: [
      nodesKnob(),
      edgesKnob(),
      {
        key: 'mode',
        label: 'Solver',
        type: 'choice',
        options: ['force', 'radial'],
        value: 'force'
      },
      { key: 'worker', label: 'In a Web Worker', type: 'toggle', value: false },
      // α of 0 never satisfies d3's stopping rule, so the run is capped by
      // `maxTicks` instead and reports `converged: false` — the honest answer to
      // "what does this cost if you never stop it", not a hang.
      {
        key: 'alphaMin',
        label: 'Convergence α',
        type: 'number',
        min: 0,
        max: 0.2,
        step: 0.005,
        value: 0.02
      }
    ],
    async run(ctx) {
      const graph = synthGraph(num(ctx.knobs.nodes), num(ctx.knobs.edges))
      // Put the graph on screen first, so the layout below is measured against a
      // live pane rather than an empty one — a frozen main thread with nothing
      // rendering is not the failure anybody cares about.
      await ctx.show(graph, layoutRadial(graph, null))
      await sleep(120)

      const frames = startFrames()
      // Prime the sampler before the solve. It discards its first delta — that
      // one spans whatever happened before it started — and on the main-thread
      // path the freeze *is* the first delta, so without this the one number
      // the scenario exists to report is the one that gets thrown away.
      await nextPaint()

      const tasks = watchLongTasks()
      const result = await runLayout(graph, {
        mode: String(ctx.knobs.mode) as LayoutMode,
        worker: flag(ctx.knobs.worker),
        alphaMin: num(ctx.knobs.alphaMin)
      })
      // And let a frame land after it. A synchronous solve returns before the
      // browser has presented anything, so the delta that spans the freeze does
      // not exist yet at the moment the promise resolves.
      await nextPaint()

      const frameStats = frames.stop()
      const blocking = tasks.stop()

      // Draw the settled arrangement, so the run ends with something to look at
      // and the render of a force layout is on screen next to its cost.
      await ctx.show({ nodes: graph.nodes, edges: graph.edges }, result.positions)

      return {
        metrics: {
          nodes: graph.nodes.length,
          edges: graph.edges.length,
          where: flag(ctx.knobs.worker) ? 'worker' : 'main',
          solveMs: result.solveMs,
          transferMs: result.transferMs,
          totalMs: result.totalMs,
          ticks: result.ticks,
          alpha: result.alpha,
          converged: result.converged,
          // The whole point of the toggle: frames the browser managed to
          // present while the solver ran, and the longest gap between two.
          framesDuring: frameStats.frames,
          worstFrameMs: frameStats.worst,
          blockedMs: blocking && blocking.blockedMs,
          drawMs: ctx.lastStat()
        },
        note: flag(ctx.knobs.worker)
          ? 'transferMs is the structured-clone round trip — the price the worker charges for the freeze it removes.'
          : undefined
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'optimise',
    label: 'LOD & culling',
    blurb:
      'The zoom sweep again, but with level of detail and viewport culling applied in the shared ' +
      'layer so every engine gets exactly the same help. Read the frame numbers next to `kept` — ' +
      '"three times faster" means nothing without how much of the graph stopped being drawn. Note ' +
      'that a radial layout puts most of its nodes on the outermost ring, so a centred box is a ' +
      'harsher cut than the fraction suggests: 0.5 typically keeps well under half the graph.',
    knobs: [
      nodesKnob(),
      edgesKnob(),
      { key: 'lod', label: 'Level of detail (drop labels)', type: 'toggle', value: true },
      { key: 'cull', label: 'Viewport culling', type: 'toggle', value: true },
      {
        key: 'fraction',
        label: 'Visible fraction',
        type: 'number',
        min: 0,
        max: 1,
        step: 0.05,
        value: 0.5
      },
      secondsKnob(10)
    ],
    async run(ctx) {
      const full = synthGraph(num(ctx.knobs.nodes), num(ctx.knobs.edges))
      // Positions come from the *whole* graph, then the cut is applied. Laying
      // out only the survivors would rearrange them, and the reader would be
      // looking at a different graph rather than a cropped one.
      const positions = layoutRadial(full, null)
      const { graph, drawn } = optimise(full, positions, {
        lod: flag(ctx.knobs.lod),
        cull: flag(ctx.knobs.cull),
        fraction: num(ctx.knobs.fraction)
      })

      const handedAt = performance.now()
      await ctx.show(graph, positions)
      const ttfrMs = Math.round(performance.now() - handedAt)

      const view = ctx.viewport()
      const tasks = watchLongTasks()
      const lag = watchLag()
      let last = 1

      const frames = await sampleFrames(num(ctx.knobs.seconds) * 1000, progress => {
        if (!view) return
        const target = 1 + 3 * Math.sin(progress * Math.PI)
        view.zoomBy(target / last)
        last = target
        view.panBy(Math.cos(progress * Math.PI * 6) * 14, Math.sin(progress * Math.PI * 4) * 10)
      })

      const blocking = tasks.stop()
      const lagging = lag.stop()
      const elements = domNodes(ctx.pane())
      if (view) view.fit()

      return {
        metrics: {
          nodes: full.nodes.length,
          edges: full.edges.length,
          drawnNodes: drawn.nodes,
          drawnEdges: drawn.edges,
          // How much of the graph the optimisations removed. The denominator
          // for every other number in this row.
          kept: Math.round((1000 * drawn.nodes) / Math.max(1, full.nodes.length)) / 10 + '%',
          lod: flag(ctx.knobs.lod),
          cull: flag(ctx.knobs.cull),
          ttfrMs,
          updateMs: ctx.lastStat(),
          fps: frames.fps,
          frameP95: frames.p95,
          worstFrameMs: frames.worst,
          dropped: frames.dropped,
          blockedMs: blocking && blocking.blockedMs,
          lagP95Ms: lagging.p95,
          // Against the hairball's `domNodes` at the same size, this is what
          // culling bought on a DOM engine — and on a canvas one it shows that
          // it bought nothing there, which is the finding.
          domNodes: elements,
          domPerNode: per(elements, drawn.nodes)
        },
        note: view
          ? undefined
          : 'No viewport on this engine — frame numbers here are the idle cost of holding the graph, not of moving it.'
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  {
    key: 'hover',
    label: 'Hover & debounce',
    blurb:
      'A pointer driven along points that are known to sit on a node, alternating on and off so ' +
      'every step is a real enter or leave, with the hover handler doing what the real one does — ' +
      'setting React state. Run it once at 0 ms and once with a debounce to see what the debounce ' +
      'buys. `hitArea` is a by-product worth reading on its own: it is how much of the pane this ' +
      'engine considers hit-testable, and it is not the same number for all eight.',
    knobs: [
      nodesKnob(),
      edgesKnob(),
      {
        key: 'debounce',
        label: 'Debounce (ms, 0 = off)',
        type: 'number',
        min: 0,
        max: 200,
        step: 5,
        value: 0
      },
      secondsKnob(8)
    ],
    async run(ctx) {
      const graph = synthGraph(num(ctx.knobs.nodes), num(ctx.knobs.edges))
      await ctx.show(graph, layoutRadial(graph, null))

      const el = ctx.pane()
      if (!el) return { unsupported: 'Pane element not available.', metrics: {} }

      const box = el.getBoundingClientRect()

      /**
       * One pointer step: a real enter/leave transition plus a move.
       *
       * Dispatched at whatever `elementFromPoint` finds rather than at the pane.
       * The canvas engines hit-test coordinates off a `mousemove` on their own
       * canvas and the container would do for them, but the DOM engines bind
       * enter/leave per node element and React 16 delegates those from top-level
       * `mouseover` / `mouseout` — an event aimed at the container never reaches
       * a node, and an earlier version of this scenario duly reported zero
       * callbacks for React Flow and jsPlumb, which reads as "never fires".
       */
      let over: Element | null = null
      const step = (x: number, y: number) => {
        const target = document.elementFromPoint(x, y) || el
        const init = { clientX: x, clientY: y, bubbles: true, cancelable: true, view: window }
        const pointer = Object.assign({ pointerType: 'mouse', isPrimary: true }, init)
        if (target !== over) {
          if (over) {
            over.dispatchEvent(
              new MouseEvent('mouseout', Object.assign({ relatedTarget: target }, init))
            )
            over.dispatchEvent(
              new PointerEvent('pointerout', Object.assign({ relatedTarget: target }, pointer))
            )
          }
          target.dispatchEvent(
            new MouseEvent('mouseover', Object.assign({ relatedTarget: over }, init))
          )
          // v-network-graph listens for `@node:pointerover`, not a mouse event,
          // and reported no hover at all until this line existed. Both families
          // are dispatched because the eight split roughly evenly on which one
          // they bind.
          target.dispatchEvent(
            new PointerEvent('pointerover', Object.assign({ relatedTarget: over }, pointer))
          )
          over = target
        }
        target.dispatchEvent(new MouseEvent('mousemove', init))
        target.dispatchEvent(new PointerEvent('pointermove', pointer))
      }

      // ── Calibration ──────────────────────────────────────────────────────
      //
      // Find where this engine thinks its nodes are, by asking it.
      //
      // A blind sweep across the pane is what this scenario used to do, and it
      // does not work: a node is about eleven pixels across on a fitted graph,
      // so a couple of hundred sampled points land on one perhaps once. Every
      // engine reported "1 callback out of 181 moves", which measures the
      // geometry of the sweep and nothing about the library.
      //
      // So: walk a grid, and keep the points that produced a callback. That
      // needs no engine API — the engine's own hover callback is the oracle —
      // and it is the identical procedure for all eight. Every one of these
      // dispatches its hover synchronously from the DOM event, so the counter
      // can be read immediately after each point.
      //
      // ── Grid density, and why it was the bug ────────────────────────────
      //
      // This was a fixed 56 × 28, which on a ~1,550 × 434 pane samples one point
      // every 28 × 15 px. A node is about **eleven pixels** across on a fitted
      // 1,000-node graph, so the grid steps straight over most of them: ECharts
      // scored a `hitArea` of 0.2% — three points out of 1,568 — and six of the
      // eight engines found nothing at all and were written up as
      // `unsupported`. Six libraries not reporting node hover was never
      // credible, and the arithmetic says why: at that spacing, finding zero is
      // the expected outcome for any engine whose hit area is a little smaller
      // than ECharts'.
      //
      // So the grid is now derived from the pane and from the thing it is
      // looking for: one sample every ~4 px, which cannot step over an 11 px
      // node. That is ~40,000 points on a full-width pane, and it is affordable
      // precisely because this loop is synchronous and in-page — the cost is a
      // few `dispatchEvent`s per point, not a round trip. (Driving the same
      // coverage with real pointer input through CDP was tried and is minutes
      // per engine, which is why the calibration stays synthetic and the
      // trusted-input question is asked separately.)
      const SPACING = 4
      const COLS = Math.max(56, Math.min(420, Math.round(box.width / SPACING)))
      const ROWS = Math.max(28, Math.min(220, Math.round(box.height / SPACING)))
      const hits: { x: number; y: number }[] = []
      const misses: { x: number; y: number }[] = []
      ctx.hover.setDebounce(0)
      ctx.hover.reset()
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = box.left + (box.width * (c + 0.5)) / COLS
          const y = box.top + (box.height * (r + 0.5)) / ROWS
          const before = ctx.hover.count()
          step(x, y)
          if (ctx.hover.count() > before) hits.push({ x, y })
          else if (misses.length < 400) misses.push({ x, y })
        }
      }

      if (!hits.length) {
        return {
          unsupported:
            'No hover callbacks anywhere on the pane. This engine either reports no node hover at ' +
            'all, or does not hit-test synthetic pointer events.',
          metrics: { nodes: graph.nodes.length, probePoints: COLS * ROWS }
        }
      }

      // ── The measured sweep ───────────────────────────────────────────────
      ctx.hover.setDebounce(num(ctx.knobs.debounce))
      ctx.hover.reset()
      const tasks = watchLongTasks()
      let sent = 0

      const frames = await sampleFrames(num(ctx.knobs.seconds) * 1000, () => {
        // On a node, then off it. Sitting still on one node would let every
        // engine dedupe the whole run down to a single callback — the traffic a
        // debounce exists to absorb is the *transitions*.
        const hit = hits[sent % hits.length]!
        const miss = misses.length ? misses[(sent * 7) % misses.length]! : null
        step(hit.x, hit.y)
        if (miss) step(miss.x, miss.y)
        sent += miss ? 2 : 1
      })

      const blocking = tasks.stop()
      ctx.hover.setDebounce(0)

      const callbacks = ctx.hover.count()

      // ── Input to paint ───────────────────────────────────────────────────
      //
      // The sweep above says how many callbacks fire and what the frames looked
      // like. Neither answers the question a user asks, which is how long the
      // hover takes to appear — and `frameP95` is at its most misleading here:
      // an engine can present every frame inside its budget while the response
      // to the pointer sits in a queue behind the redraw.
      //
      // Fired at calibrated hit points, alternating on and off so every sample
      // is a real transition, with the debounce off — this is the engine's own
      // floor rather than the debounce's contribution, which the `debounceMs`
      // knob is there to measure separately.
      const input = await latency(24, i => {
        if (i % 2 && misses.length) {
          const miss = misses[(i * 7) % misses.length]!
          step(miss.x, miss.y)
        } else {
          const hit = hits[i % hits.length]!
          step(hit.x, hit.y)
        }
      })

      return {
        metrics: {
          nodes: graph.nodes.length,
          debounceMs: num(ctx.knobs.debounce),
          // How much of the pane this engine will report a hover from. A canvas
          // engine hit-tests the symbol; a DOM engine hit-tests the element's
          // whole box, which is larger — and jsPlumb's label sits outside the
          // disc and is part of the node, which is larger again.
          hitArea: Math.round((1000 * hits.length) / (COLS * ROWS)) / 10 + '%',
          pointerMoves: sent,
          hoverCallbacks: callbacks,
          // 1.0 means the engine called back on every transition — correct and
          // expensive. Below 1 it is deduping; above 1 it is reporting misses as
          // well as hits, and every one of those is a React render.
          callbacksPerMove: sent ? Math.round((callbacks / sent) * 100) / 100 : 0,
          fps: frames.fps,
          frameP95: frames.p95,
          worstFrameMs: frames.worst,
          dropped: frames.dropped,
          blockedMs: blocking && blocking.blockedMs,
          // Pointer event to the paint that answers it. One frame is the floor,
          // so read these against each other and never as absolutes.
          inputP50Ms: input.p50,
          inputP95Ms: input.p95,
          inputWorstMs: input.worst
        }
      }
    }
  }
]

export const SCENARIOS_BY_KEY = SCENARIOS.reduce<Record<string, Scenario>>((out, s) => {
  out[s.key] = s
  return out
}, {})

/** Default knob values for a scenario, as the UI's starting state. */
export const defaultKnobs = (scenario: Scenario): Knobs =>
  scenario.knobs.reduce<Knobs>((out, knob) => {
    out[knob.key] = knob.value
    return out
  }, {})

/** Least-squares slope of a series sampled at one point per second, in MB/s. */
function trend(series: (number | null)[]): number | null {
  const n = series.length
  const clean = series.filter(v => v != null)
  if (clean.length !== n || n < 3) return null
  const meanX = (n - 1) / 2
  const meanY = clean.reduce((s, v) => s + v, 0) / n
  let top = 0
  let bottom = 0
  for (let i = 0; i < n; i++) {
    top += (i - meanX) * (clean[i]! - meanY)
    bottom += (i - meanX) * (i - meanX)
  }
  return bottom ? Math.round((top / bottom) * 1000) / 1000 : null
}

export { trend }
