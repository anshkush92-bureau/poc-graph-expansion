// The benchmark's own arithmetic, checked.
//
// Nothing here touches a renderer or the DOM — the probes that do are driven by
// requestAnimationFrame and are only meaningful in a browser. What is worth a
// test is the maths that turns raw samples into the numbers the results table
// reports, because a wrong `dropped` count or an inverted slope would look
// entirely plausible in the UI and quietly change every conclusion.

import assert from 'node:assert/strict'
import test from 'node:test'
import { synthGraph } from '../graph/synth.js'
import { layoutRadial } from '../graph/ops.js'
import { summarise } from './probes.js'
import { centreBox, cullToBox, optimise, stripLabels } from './optimize.js'
import { forceLayout } from './force.js'
import { sprout, trend } from './scenarios.js'
import { ENGINES, ENGINE_KEYS } from '../engines.js'

test('summarise: a steady 60fps stream reports 60 and drops nothing', () => {
  const deltas = new Array(120).fill(1000 / 60)
  const out = summarise(deltas)
  assert.equal(out.frames, 120)
  assert.equal(out.fps, 60)
  assert.equal(out.dropped, 0)
})

test('summarise: one long frame counts the frames it swallowed, not itself', () => {
  // 100 ms is six budgets: one frame arrived, five never got presented.
  const out = summarise([16.7, 16.7, 100, 16.7])
  assert.equal(out.dropped, 5)
  assert.equal(out.worst, 100)
})

test('summarise: p95 does not hide the stalls a mean would', () => {
  const deltas = new Array(95).fill(16).concat(new Array(5).fill(200))
  const out = summarise(deltas)
  assert.ok(out.p95 >= 200, `p95 was ${out.p95}`)
  assert.ok(out.p50 <= 16, `p50 was ${out.p50}`)
})

test('summarise: no samples is reported as no samples, not as zero cost', () => {
  const out = summarise([])
  assert.equal(out.frames, 0)
  assert.equal(out.p95, null)
})

test('stripLabels blanks captions without touching the caller\'s nodes', () => {
  const graph = synthGraph(40, 60)
  const before = graph.nodes[5].name
  const out = stripLabels(graph)
  assert.equal(out.nodes[5].name, '')
  assert.equal(out.edges[3].label, '')
  // The same node objects feed the side panel and whichever pane is mounted.
  assert.equal(graph.nodes[5].name, before)
  assert.equal(out.nodes.length, graph.nodes.length)
})

test('centreBox is centred on the graph and scales with the fraction', () => {
  const positions = { a: { x: -100, y: -50 }, b: { x: 100, y: 50 } }
  const half = centreBox(positions, 0.5)
  assert.equal(half.minX, -50)
  assert.equal(half.maxX, 50)
  assert.equal(half.minY, -25)
  assert.equal(half.maxY, 25)
  const whole = centreBox(positions, 1)
  assert.equal(whole.minX, -100)
  assert.equal(whole.maxX, 100)
})

test('cullToBox keeps only whole edges', () => {
  const positions = { a: { x: 0, y: 0 }, b: { x: 0, y: 0 }, far: { x: 9999, y: 9999 } }
  const graph = {
    nodes: [{ id: 'a' }, { id: 'b' }, { id: 'far' }],
    edges: [
      { id: 'inside', source: 'a', target: 'b' },
      { id: 'straddling', source: 'a', target: 'far' }
    ]
  }
  const out = cullToBox(graph, positions, { minX: -1, maxX: 1, minY: -1, maxY: 1 })
  assert.deepEqual(out.nodes.map(n => n.id), ['a', 'b'])
  // A half-edge would mean keeping its off-screen endpoint, which is culling
  // that culls nothing.
  assert.deepEqual(out.edges.map(e => e.id), ['inside'])
})

test('optimise reports what survived, which is the denominator for every other number', () => {
  const graph = synthGraph(400, 700)
  const positions = layoutRadial(graph, null)
  const out = optimise(graph, positions, { lod: true, cull: true, fraction: 0.3 })
  assert.ok(out.drawn.nodes < graph.nodes.length, 'culling removed nothing')
  assert.equal(out.drawn.nodes, out.graph.nodes.length)
  assert.equal(out.graph.nodes[0].name, '')
})

test('optimise with everything off is a pass-through', () => {
  const graph = synthGraph(50, 80)
  const positions = layoutRadial(graph, null)
  const out = optimise(graph, positions, { lod: false, cull: false })
  assert.equal(out.graph, graph)
  assert.equal(out.drawn.nodes, graph.nodes.length)
})

test('forceLayout converges and places every node', () => {
  const graph = synthGraph(150, 220)
  const out = forceLayout(graph, { alphaMin: 0.05, maxTicks: 400 })
  assert.equal(Object.keys(out.positions).length, graph.nodes.length)
  assert.ok(out.converged, `did not settle: alpha ${out.alpha} after ${out.ticks} ticks`)
  assert.ok(out.ticks > 0 && out.ticks < 400)
  Object.keys(out.positions).forEach(id => {
    assert.ok(Number.isFinite(out.positions[id].x), `${id} has no x`)
  })
})

test('forceLayout does not write coordinates back onto the shared graph', () => {
  const graph = synthGraph(60, 90)
  forceLayout(graph, { alphaMin: 0.1, maxTicks: 60 })
  // d3-force mutates what it is handed; the same node objects are shared with
  // eight renderers and must come back untouched.
  assert.equal(graph.nodes[3].x, undefined)
  assert.equal(typeof graph.edges[0].source, 'string')
})

test('forceLayout stops at maxTicks and says so rather than pretending', () => {
  const graph = synthGraph(120, 200)
  const out = forceLayout(graph, { alphaMin: 1e-6, maxTicks: 5 })
  assert.equal(out.ticks, 5)
  assert.equal(out.converged, false)
})

test('synthGraph at zero builds nothing, and every knob can reach zero', () => {
  // The dials bottom out at 0 now, so an empty graph is a state the whole
  // pipeline has to survive rather than a floor quietly rounded up to one root.
  const empty = synthGraph(0, 0)
  assert.deepEqual(empty, { nodes: [], edges: [] })
  assert.deepEqual(synthGraph(0, 5000), { nodes: [], edges: [] })
  assert.deepEqual(layoutRadial(empty, null), {})
  assert.equal(optimise(empty, {}, { lod: true, cull: true, fraction: 0 }).drawn.nodes, 0)
})

test('the edge dial has a floor: the spanning tree comes first', () => {
  // Asking for fewer edges than nodes cannot be honoured — a tree of n nodes is
  // n-1 edges — and the lab reports the overshoot rather than the ask.
  const graph = synthGraph(500, 1)
  assert.equal(graph.nodes.length, 500)
  assert.equal(graph.edges.length, 499)
})

test('trend: a flat heap has no slope, a growing one does', () => {
  assert.equal(trend([10, 10, 10, 10]), 0)
  assert.equal(trend([10, 11, 12, 13]), 1)
  assert.ok(trend([10, 9, 8, 7]) < 0)
})

test('trend: too few readings, or a gap, reports nothing rather than a guess', () => {
  assert.equal(trend([10, 11]), null)
  assert.equal(trend([10, null, 12, 13]), null)
})

test('sprout hangs every newcomer off the node it was given', () => {
  const graph = synthGraph(40, 60)
  const onto = graph.nodes[7]
  const grown = sprout(graph, 5, 0, onto)

  assert.equal(grown.nodes.length, graph.nodes.length + 5)
  const added = grown.edges.slice(graph.edges.length)
  assert.equal(added.length, 5)
  // The whole point of the argument: an expansion is a fan out of one node, not
  // five arrivals scattered over the graph the way the stream places them.
  added.forEach(edge => assert.equal(edge.source, onto.id))
  grown.nodes.slice(graph.nodes.length).forEach(node => {
    assert.equal(node.level, onto.level + 1)
  })
  // Untouched: every pane is memoised on graph identity, and a mutation here
  // would be invisible to all eight.
  assert.equal(graph.nodes.length, 40)
})

test('sprout without a parent still spreads the arrivals around', () => {
  const graph = synthGraph(40, 60)
  const sources = new Set(sprout(graph, 8, 0).edges.slice(graph.edges.length).map(e => e.source))
  assert.ok(sources.size > 1)
})

test('every engine declares at least one paint backend', () => {
  // `Lab` reads `renderers[0]` as its default the moment a page mounts, so a
  // missing entry is a blank screen for that library and nothing else.
  ENGINE_KEYS.forEach(key => {
    const list = ENGINES[key].renderers
    assert.ok(Array.isArray(list) && list.length > 0, `${key} has no renderers`)
  })
})
