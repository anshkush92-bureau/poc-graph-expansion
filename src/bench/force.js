// Force-directed layout, for the physics half of the comparison.
//
// The rest of the app deliberately uses one shared `layoutRadial` so that every
// pane draws the identical arrangement and the comparison stays about drawing.
// This file is the exception, and it exists because layout is the other thing
// that decides whether a graph view is usable: on a dense graph the physics
// pass routinely costs more than the render it feeds, and it is the part that
// freezes the tab while it runs.
//
// It is deliberately *not* any library's own layout. Every engine here ships a
// force layout of its own with a different solver, different constants and a
// different stopping rule, so timing eight of those against each other measures
// eight unrelated implementations. One d3-force run, identical for every pane,
// measures the thing the scenario is actually about: what it costs to converge
// a graph of this size, and whether that cost lands on the UI thread.

import { forceCenter, forceLink, forceManyBody, forceSimulation } from 'd3-force'
import { NODE_SPACING } from '../graph/ops.js'

/**
 * Runs a simulation to convergence and reports what it took.
 *
 * Ticks are pumped by hand rather than left to d3's internal timer. d3's own
 * loop is rAF-driven, which spreads the work over as many seconds as the frame
 * rate needs and would make this measure wall-clock rather than CPU. Pumping
 * synchronously answers the question the scenario asks — how much work is
 * convergence — and, on the main thread, produces exactly the freeze a real app
 * would suffer if it did this the naive way.
 *
 * Convergence is d3's own criterion: alpha decays geometrically toward
 * `alphaMin`, at which point the arrangement has stopped meaningfully moving.
 * `maxTicks` is a floor under the worst case rather than a target — a graph
 * that has not settled by then reports the alpha it reached, which is a
 * finding, not a failure.
 */
export function forceLayout(graph, options) {
  const { alphaMin = 0.02, maxTicks = 400 } = options || {}

  // d3-force mutates the objects it is given and stores link endpoints as
  // references into the node array, so it gets its own throwaway copies — the
  // app's graph objects are shared with eight renderers and must not grow x/y/
  // vx/vy fields behind their backs.
  const nodes = graph.nodes.map(n => ({ id: n.id }))
  const index = new Map(nodes.map((n, i) => [n.id, i]))
  const links = graph.edges
    // A self-edge has no length to satisfy and would make the solver push a
    // node against itself; unresolvable endpoints would throw outright.
    .filter(e => e.source !== e.target && index.has(e.source) && index.has(e.target))
    .map(e => ({ source: index.get(e.source), target: index.get(e.target) }))

  const started = now()
  const sim = forceSimulation(nodes)
    .force('link', forceLink(links).distance(NODE_SPACING).strength(0.4))
    // `distanceMax` is what keeps this from being O(n²) in practice: without a
    // cutoff, Barnes-Hut still walks far-away quadtree cells that contribute
    // nothing at these scales.
    .force(
      'charge',
      forceManyBody()
        .strength(-160)
        .distanceMax(NODE_SPACING * 12)
    )
    .force('centre', forceCenter(0, 0))
    .stop()

  let ticks = 0
  while (sim.alpha() > alphaMin && ticks < maxTicks) {
    sim.tick()
    ticks += 1
  }

  const positions = {}
  nodes.forEach(n => {
    positions[n.id] = { x: n.x, y: n.y }
  })

  return {
    positions,
    ticks,
    alpha: Math.round(sim.alpha() * 1000) / 1000,
    converged: sim.alpha() <= alphaMin,
    ms: Math.round(now() - started)
  }
}

// `performance` exists in a worker too, but guard anyway — this module is
// imported from both sides and a missing timer should not take the layout down.
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())
