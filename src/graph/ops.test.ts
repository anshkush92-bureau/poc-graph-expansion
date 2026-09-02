import assert from 'node:assert/strict'
import { test } from 'vitest'
import type { EntityType, Graph, GraphNode, Point, Positions } from '../engine/types.ts'
import { ENTITY, ROOT, degreeOf, fetchNeighbors, selfEdgeFor } from './data.ts'
import {
  NODE_SPACING,
  hiddenCount,
  hiddenCounts,
  isSelfEdge,
  layoutRadial,
  mergeGraph,
  neighborsOf,
  pathToRoot,
  removeNode
} from './ops.ts'
import { withLoops } from './loops.ts'

const radius = (p: Point): number => Math.hypot(p.x, p.y)

/** A position lookup that fails loudly, rather than letting a miss slip through. */
const at = (pos: Positions, id: string): Point => {
  const p = pos[id]
  assert.ok(p, `no position for ${id}`)
  return p
}

/** Fills in a full GraphNode from just an id, so fixtures stay short. */
const node = (id: string, over: Partial<GraphNode> = {}): GraphNode => ({
  id,
  type: 'account',
  level: 0,
  name: id,
  risk: 0,
  flagged: false,
  firstSeen: '2026-01-01',
  events: 0,
  ...over
})

// Characterizes makeNode's current behaviour, via fetchNeighbors, before the
// TS conversion adds a runtime guard there. Every entity type can be a parent,
// and every child must come back with a valid type — never a throw, today.
test('fetchNeighbors returns a valid-typed child for every entity type, with no throw', async () => {
  for (const type of Object.keys(ENTITY) as EntityType[]) {
    const parent = node(`${type}-parent`, { type, name: type })
    const { nodes } = await fetchNeighbors(parent)
    assert.ok(nodes.length > 0, `${type} has children to check`)
    nodes.forEach(n =>
      assert.ok(ENTITY[n.type], `${type} child has a valid entity type, got ${n.type}`)
    )
  }
})

// --- self-loop expansion, which both renderers depend on being well-formed ---

const LOOP_GRAPH: Graph = {
  nodes: [node('a'), node('b')],
  edges: [
    { id: 'a->b', source: 'a', target: 'b', label: 'SEEN_ON' },
    { id: 'b<->b', source: 'b', target: 'b', label: 'REPEAT_ATTEMPT' }
  ]
}
const AT = { a: { x: 0, y: 0 }, b: { x: 400, y: 0 } }

test('an ordinary edge passes through as one arrowed link, with no pivots', () => {
  const firstEdge = LOOP_GRAPH.edges[0]
  assert.ok(firstEdge, 'fixture has a first edge')
  const { links, pivots } = withLoops({ nodes: LOOP_GRAPH.nodes, edges: [firstEdge] }, AT)
  assert.equal(pivots.length, 0)
  assert.deepEqual(
    links.map(l => [l.from, l.to, l.arrow]),
    [['a', 'b', true]]
  )
})

test('a self-edge becomes a three-segment loop that starts and ends on its node', () => {
  const { links, pivots } = withLoops(LOOP_GRAPH, AT)
  const loop = links.filter(l => l.loop)

  assert.equal(loop.length, 3)
  assert.equal(pivots.length, 2)
  const first = loop[0]
  const last = loop[2]
  assert.ok(first, 'loop has a first segment')
  assert.ok(last, 'loop has a third segment')
  assert.equal(first.from, 'b', 'leaves the node')
  assert.equal(last.to, 'b', 'returns to the same node')
  assert.deepEqual(
    loop.map(l => l.from).slice(1),
    loop.map(l => l.to).slice(0, 2),
    'segments join end to end'
  )

  // Every endpoint that is not the node itself must be a pivot we emitted, or
  // the renderers draw a link to a node that does not exist.
  const known = new Set(pivots.map(p => p.id).concat(['b']))
  loop.forEach(l => {
    assert.ok(known.has(l.from) && known.has(l.to), `${l.from} -> ${l.to} has known endpoints`)
  })
})

test('only the returning segment is arrowed, and only the middle one is labelled', () => {
  const loop = withLoops(LOOP_GRAPH, AT).links.filter(l => l.loop)
  assert.deepEqual(
    loop.map(l => !!l.arrow),
    [false, false, true]
  )
  assert.deepEqual(
    loop.map(l => l.label),
    ['', 'REPEAT_ATTEMPT', '']
  )
})

test('a loop stays inside the elbow room the layout guarantees each node', () => {
  const { pivots } = withLoops(LOOP_GRAPH, AT)
  pivots.forEach(p => {
    assert.ok(Math.hypot(p.x - AT.b.x, p.y - AT.b.y) < NODE_SPACING, 'within one node slot')
  })
})

test('link and pivot ids stay unique across several loops', () => {
  const graph: Graph = {
    nodes: [node('a'), node('b')],
    edges: [
      { id: 'a<->a', source: 'a', target: 'a', label: 'REROUTED_VIA' },
      { id: 'b<->b', source: 'b', target: 'b', label: 'RE_AUTHORISED' }
    ]
  }
  const { links, pivots } = withLoops(graph, AT)
  assert.equal(new Set(links.map(l => l.id)).size, links.length, 'link ids unique')
  assert.equal(new Set(pivots.map(p => p.id)).size, pivots.length, 'pivot ids unique')
})

test('a self-edge on an unpositioned node is dropped, not drawn to the origin', () => {
  const { links, pivots } = withLoops(LOOP_GRAPH, { a: AT.a })
  assert.equal(pivots.length, 0)
  assert.deepEqual(
    links.map(l => l.id),
    ['a->b'],
    'only the positioned edge survives'
  )
})

/** Expands every node that still has neighbours, `rounds` times over. */
async function grow(graph: Graph, rounds: number): Promise<Graph> {
  let g = graph
  for (let r = 0; r < rounds; r++) {
    const counts = hiddenCounts(g)
    const targets = g.nodes.filter(n => (counts.get(n.id) ?? 0) > 0)
    if (!targets.length) break
    for (const t of targets) g = mergeGraph(g, await fetchNeighbors(t))
  }
  return g
}

const empty: Graph = { nodes: [ROOT], edges: [] }

test('merge is idempotent — expanding the same node twice adds nothing', async () => {
  const first = await fetchNeighbors(ROOT)
  const once = mergeGraph(empty, first)
  const twice = mergeGraph(once, first)
  assert.equal(twice.nodes.length, once.nodes.length)
  assert.equal(twice.edges.length, once.edges.length)
})

test('expansion is recursive — a child expands to its own level', async () => {
  const l1 = mergeGraph(empty, await fetchNeighbors(ROOT))
  const child = l1.nodes.find(n => n.level === 1)
  assert.ok(child, 'a level-1 child was created')
  const l2 = mergeGraph(l1, await fetchNeighbors(child))
  assert.ok(
    l2.nodes.some(n => n.level === 2),
    'level 2 reached'
  )
  assert.ok(l2.nodes.length > l1.nodes.length)
})

test('delete removes the node and every edge touching it, keeping descendants', async () => {
  const l1 = mergeGraph(empty, await fetchNeighbors(ROOT))
  const child = l1.nodes.find(n => n.level === 1)
  assert.ok(child, 'a level-1 child was created')
  const l2 = mergeGraph(l1, await fetchNeighbors(child))
  const grandchildren = l2.nodes.filter(n => n.level === 2).length
  assert.ok(grandchildren > 0)

  const after = removeNode(l2, child.id)
  assert.equal(
    after.nodes.find(n => n.id === child.id),
    undefined
  )
  assert.equal(after.edges.filter(e => e.source === child.id || e.target === child.id).length, 0)
  assert.equal(after.nodes.filter(n => n.level === 2).length, grandchildren)
})

test('hiddenCount goes to zero once a node is expanded', async () => {
  assert.equal(hiddenCount(empty, ROOT), degreeOf(ROOT))
  const l1 = mergeGraph(empty, await fetchNeighbors(ROOT))
  assert.equal(hiddenCount(l1, ROOT), 0)
})

test('pathToRoot returns the chain from the root down', async () => {
  const l1 = mergeGraph(empty, await fetchNeighbors(ROOT))
  const child = l1.nodes.find(n => n.level === 1)
  assert.ok(child, 'a level-1 child was created')
  const l2 = mergeGraph(l1, await fetchNeighbors(child))
  const leaf = l2.nodes.find(n => n.level === 2)
  assert.ok(leaf, 'a level-2 leaf was created')
  const chain = pathToRoot(l2, leaf.id).map(n => n.id)
  assert.deepEqual(chain, [ROOT.id, child.id, leaf.id])
})

test('neighborsOf reports direction', async () => {
  const l1 = mergeGraph(empty, await fetchNeighbors(ROOT))
  const child = l1.nodes.find(n => n.level === 1)
  assert.ok(child, 'a level-1 child was created')
  assert.deepEqual(
    neighborsOf(l1, child.id).map(n => n.direction),
    ['in']
  )
  assert.ok(neighborsOf(l1, ROOT.id).every(n => n.direction === 'out'))
})

// --- self-edges: source === target. Every hierarchy walk has to ignore them. ---

const child = node('DEV-1', { type: 'device', level: 1, name: 'dev' })
const looped: Graph = {
  nodes: [ROOT, child],
  edges: [
    { id: 'e1', source: ROOT.id, target: child.id, label: 'SIGNED_IN_FROM' },
    { id: 'loop', source: child.id, target: child.id, label: 'REPEAT_ATTEMPT' },
    { id: 'rootloop', source: ROOT.id, target: ROOT.id, label: 'REPEAT_ATTEMPT' }
  ]
}

test('a self-edge does not cost its node its place as a layout root', () => {
  const pos = layoutRadial(looped)
  assert.equal(Object.keys(pos).length, 2, 'both nodes placed')
  assert.equal(radius(at(pos, ROOT.id)), 0, 'root stays at the centre despite its own self-edge')
  assert.ok(radius(at(pos, child.id)) > 0)
})

test('a self-edge does not truncate pathToRoot', () => {
  assert.deepEqual(
    pathToRoot(looped, child.id).map(n => n.id),
    [ROOT.id, child.id]
  )
})

test('a self-edge does not count as a mapped onward link', () => {
  const counts = hiddenCounts(looped)
  // The child's only edge is its own loop, so nothing of its degree is mapped.
  assert.equal(counts.get(child.id), degreeOf(child))
  // The root's real child is mapped; its self-edge adds nothing either way.
  assert.equal(counts.get(ROOT.id), degreeOf(ROOT) - 1)
})

test('neighborsOf labels a self-edge as self', () => {
  const dirs = neighborsOf(looped, child.id).map(n => n.direction)
  assert.deepEqual(dirs.sort(), ['in', 'self'])
})

test('selfEdgeFor only ever points a node at itself, and never for added nodes', async () => {
  const l1 = mergeGraph(empty, await fetchNeighbors(ROOT))
  l1.edges.filter(isSelfEdge).forEach(e => assert.equal(e.source, e.target))
  assert.equal(selfEdgeFor(node('DEV-x', { type: 'device', synthetic: true })), null)
})

test('layoutRadial places every node, root centred, children on outer rings', async () => {
  const l1 = mergeGraph(empty, await fetchNeighbors(ROOT))
  const kid = l1.nodes.find(n => n.level === 1)
  assert.ok(kid, 'a level-1 child was created')
  const l2 = mergeGraph(l1, await fetchNeighbors(kid))

  const pos = layoutRadial(l2)
  assert.equal(Object.keys(pos).length, l2.nodes.length, 'no node left unpositioned')
  assert.equal(radius(at(pos, ROOT.id)), 0, 'root at the centre')
  l2.edges
    .filter(e => !isSelfEdge(e))
    .forEach(e => {
      assert.ok(
        radius(at(pos, e.target)) > radius(at(pos, e.source)) + 1,
        `${e.target} sits outside ${e.source}`
      )
    })
})

// --- incremental layout: the whole point is that an expansion is an append ---

test('expanding a node leaves every node already on screen exactly where it was', async () => {
  const l1 = mergeGraph(empty, await fetchNeighbors(ROOT))
  const before = layoutRadial(l1)
  const kid = l1.nodes.find(n => n.level === 1)
  assert.ok(kid, 'a level-1 child was created')
  const l2 = mergeGraph(l1, await fetchNeighbors(kid))
  const after = layoutRadial(l2, before)

  assert.ok(l2.nodes.length > l1.nodes.length, 'the expansion has to add something')
  assert.equal(Object.keys(after).length, l2.nodes.length, 'newcomers still get placed')
  // Exact, not within a tolerance. A node that should not move must not drift
  // by a float either — the renderers tween on any change at all.
  l1.nodes.forEach(n => assert.deepEqual(after[n.id], before[n.id], `${n.id} moved`))
})

test('the same graph laid out twice is a fixed point', async () => {
  const l1 = mergeGraph(empty, await fetchNeighbors(ROOT))
  const once = layoutRadial(l1)
  // Re-runs happen for reasons that are not the graph — a status change, a new
  // shape set. None of them may nudge a node.
  assert.deepEqual(layoutRadial(l1, once), once)
})

test('growing incrementally stays overlap-free', async () => {
  let g = empty
  let pos = layoutRadial(g)
  for (let round = 0; round < 4; round++) {
    const counts = hiddenCounts(g)
    const targets = g.nodes.filter(n => (counts.get(n.id) ?? 0) > 0)
    if (!targets.length) break
    // One node at a time, feeding positions back in — the real click sequence,
    // not a bulk re-layout at the end.
    for (const t of targets) {
      g = mergeGraph(g, await fetchNeighbors(t))
      pos = layoutRadial(g, pos)
    }
  }
  assert.ok(g.nodes.length >= 40, `needs a real graph, got ${g.nodes.length}`)

  let worst = Infinity
  let pair: [string, string] | null = null
  for (let i = 0; i < g.nodes.length; i++) {
    const ni = g.nodes[i]
    if (!ni) continue
    const pi = at(pos, ni.id)
    for (let j = i + 1; j < g.nodes.length; j++) {
      const nj = g.nodes[j]
      if (!nj) continue
      const pj = at(pos, nj.id)
      const d = Math.hypot(pi.x - pj.x, pi.y - pj.y)
      if (d < worst) {
        worst = d
        pair = [ni.id, nj.id]
      }
    }
  }
  assert.ok(worst > 76, `closest pair ${pair} was ${worst.toFixed(1)}px apart, discs are 76px`)
})

// This is the check that the first, top-down layout failed: it grew ~19,000px
// wide at ~100 nodes, so it could not be zoomed to fit or read.
test('layoutRadial stays compact and overlap-free as the graph grows', async () => {
  const big = await grow(empty, 4)
  assert.ok(big.nodes.length >= 40, `needs a real graph, got ${big.nodes.length}`)

  const pos = layoutRadial(big)
  assert.equal(Object.keys(pos).length, big.nodes.length)

  const xs = big.nodes.map(n => at(pos, n.id).x)
  const ys = big.nodes.map(n => at(pos, n.id).y)
  const width = Math.max(...xs) - Math.min(...xs)
  const height = Math.max(...ys) - Math.min(...ys)
  const aspect = Math.max(width, height) / Math.max(1, Math.min(width, height))
  assert.ok(aspect < 3, `layout should stay roughly square, aspect was ${aspect.toFixed(2)}`)

  // No two nodes may land on top of each other — 76px discs need >76px apart.
  let worst = Infinity
  let pair: [string, string] | null = null
  for (let i = 0; i < big.nodes.length; i++) {
    const ni = big.nodes[i]
    if (!ni) continue
    const a = at(pos, ni.id)
    for (let j = i + 1; j < big.nodes.length; j++) {
      const nj = big.nodes[j]
      if (!nj) continue
      const b = at(pos, nj.id)
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      if (d < worst) {
        worst = d
        pair = [ni.id, nj.id]
      }
    }
  }
  assert.ok(worst > 76, `closest pair ${pair} was ${worst.toFixed(1)}px apart, discs are 76px`)
  assert.ok(NODE_SPACING > 76, 'ring spacing must exceed the disc diameter')

  // Guards the regression where one tight angular pair inflated a ring's
  // radius enormously and the graph rendered as a single sweeping arc.
  const ceiling = (NODE_SPACING * big.nodes.length) / (2 * Math.PI)
  const outermost = Math.max(...big.nodes.map(n => radius(at(pos, n.id))))
  assert.ok(
    outermost <= ceiling,
    `outer ring ${outermost.toFixed(0)}px exceeds ${ceiling.toFixed(0)}px for ${big.nodes.length} nodes`
  )

  // The occupied angles must cover most of the circle, not one narrow arc.
  const filled = new Set(
    big.nodes
      .filter(n => radius(at(pos, n.id)) > 1)
      .map(n => {
        const p = at(pos, n.id)
        return Math.floor(((Math.atan2(p.y, p.x) + Math.PI * 3) % (Math.PI * 2)) / (Math.PI / 6))
      })
  )
  assert.ok(filled.size >= 9, `nodes only occupy ${filled.size}/12 sectors of the circle`)
})
