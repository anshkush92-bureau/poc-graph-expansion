// Pure graph operations. Both renderers sit on top of these, which is what
// makes the NVL / React Flow comparison honest: only the drawing differs.

import type { Graph, GraphEdge, GraphNode, Positions } from '../engine/types.ts'
import { degreeOf } from './data.ts'

/** Adds nodes and edges, skipping anything already present (by id). */
export function mergeGraph(graph: Graph, incoming: Graph): Graph {
  const nodeIds = new Set(graph.nodes.map(n => n.id))
  const edgeIds = new Set(graph.edges.map(e => e.id))
  return {
    nodes: graph.nodes.concat(incoming.nodes.filter(n => !nodeIds.has(n.id))),
    edges: graph.edges.concat(incoming.edges.filter(e => !edgeIds.has(e.id)))
  }
}

/**
 * Removes a node and every edge touching it. Descendants are deliberately
 * kept — an analyst deleting a hop should not lose the evidence beyond it.
 */
export function removeNode(graph: Graph, id: string): Graph {
  return {
    nodes: graph.nodes.filter(n => n.id !== id),
    edges: graph.edges.filter(e => e.source !== id && e.target !== id)
  }
}

export const isSelfEdge = (e: GraphEdge): boolean => e.source === e.target

/**
 * Neighbours the backend holds for every node that are not on screen yet,
 * as one id -> count map.
 *
 * Deliberately batched: called per node this is O(n²) — at ~40 nodes that is
 * 1,600 set builds on every render, which is exactly the kind of thing that
 * makes a graph feel laggy.
 */
export function hiddenCounts(graph: Graph): Map<string, number> {
  const onScreen = new Set(graph.nodes.map(n => n.id))
  const shown = new Map<string, number>()
  graph.edges.forEach(e => {
    if (isSelfEdge(e) || !onScreen.has(e.target)) return
    shown.set(e.source, (shown.get(e.source) || 0) + 1)
  })
  const counts = new Map<string, number>()
  graph.nodes.forEach(n => counts.set(n.id, Math.max(0, degreeOf(n) - (shown.get(n.id) || 0))))
  return counts
}

/** Single-node convenience wrapper. Use `hiddenCounts` in render paths. */
export function hiddenCount(graph: Graph, node: GraphNode): number {
  return hiddenCounts(graph).get(node.id) || 0
}

type NeighborDirection = 'self' | 'out' | 'in'

interface Neighbor {
  edge: GraphEdge
  direction: NeighborDirection
  node: GraphNode
}

/** Edges touching `id`, paired with the node at the other end. */
export function neighborsOf(graph: Graph, id: string): Neighbor[] {
  const byId = new Map(graph.nodes.map(n => [n.id, n]))
  return graph.edges
    .filter(e => e.source === id || e.target === id)
    .map((e): { edge: GraphEdge; direction: NeighborDirection; node: GraphNode | undefined } => ({
      edge: e,
      direction: isSelfEdge(e) ? 'self' : e.source === id ? 'out' : 'in',
      node: byId.get(e.source === id ? e.target : e.source)
    }))
    .filter((n): n is Neighbor => n.node !== undefined)
}

/** Root → node chain, so the side panel can show how we got here. */
export function pathToRoot(graph: Graph, id: string): GraphNode[] {
  const parentOf = new Map<string, string>()
  // A self-edge would make a node its own parent and truncate the chain.
  graph.edges.forEach(e => {
    if (isSelfEdge(e) || parentOf.has(e.target)) return
    parentOf.set(e.target, e.source)
  })
  const byId = new Map(graph.nodes.map(n => [n.id, n]))
  const chain: GraphNode[] = []
  const guard = new Set<string>()
  let cursor: string | undefined = id
  while (cursor && byId.has(cursor) && !guard.has(cursor)) {
    guard.add(cursor)
    const node = byId.get(cursor)
    if (!node) break
    chain.unshift(node)
    cursor = parentOf.get(cursor)
  }
  return chain
}

/** Ring spacing, and the elbow room every node is guaranteed on its ring. */
const RING = 230
export const NODE_SPACING = 108

/** Signed shortest way round the circle from one angle to another. */
const arc = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a))

/**
 * Radial layout: root at the centre, each level on its own ring, children
 * fanned inside the angular wedge their parent occupies.
 *
 * React Flow v9 ships no layout engine, so this is the price of the React Flow
 * side of the POC. A top-down tree was the first attempt and it does not
 * survive expansion — width grows with the number of leaves, so at ~100 nodes
 * it was 19,000px wide and four rows tall, past what fitView can zoom to.
 * Rings grow in both directions, so the graph stays roughly square.
 *
 * ── `prev` ────────────────────────────────────────────────────────────────
 * The positions this returned last time, fed back in. Without it every call
 * re-derives every angle from scratch, and since the cold-start pass numbers
 * leaves in traversal order, two new children shift the slot of every leaf
 * after them: expanding one node re-arranged the entire graph, which is what
 * made an append look like a reload.
 *
 * With it, a node that already has a position keeps it — exactly, not to
 * within a rounding error — and only the newcomers are placed. Their angles
 * come from the free space inside their parent's wedge, so an expansion moves
 * nothing that was already on screen.
 *
 * The trade is density. Placing into a frozen wedge cannot rebalance the whole
 * circle the way the cold pass does, so a branch expanded many times over ends
 * up finer-grained than its neighbours and pushes its ring outward. Reset
 * drops `prev` and gets the cold layout back.
 */
export function layoutRadial(graph: Graph, prev: Positions | null = null): Positions {
  const children = new Map<string, string[]>()
  const hasParent = new Set<string>()
  graph.edges.forEach(e => {
    // Self-edges carry no hierarchy; counting one would make its node look
    // like a child of itself and cost it its place as a layout root.
    if (isSelfEdge(e)) return
    const kids = children.get(e.source) ?? []
    kids.push(e.target)
    children.set(e.source, kids)
    hasParent.add(e.target)
  })

  const known = new Set(graph.nodes.map(n => n.id))
  const roots = graph.nodes.filter(n => !hasParent.has(n.id)).map(n => n.id)

  // Walk the graph once to fix each node's ring and its child list.
  //
  // Breadth-first, which matters as soon as the graph is not a pure tree. A
  // depth-first walk gives each node the depth of whichever path happened to
  // reach it first, so one cross-link can drag a node several rings outward and
  // hand it a parent on the far side of the circle. Its slot then lands next to
  // an unrelated node, and since a ring's radius is sized off its *tightest*
  // pair, one such collision inflates the whole ring: a 100-node graph with
  // cross-links came out 9,373px across, against the 1,719px this is supposed
  // to bound it to. Breadth-first gives every node its shortest-path depth, so
  // rings stay shallow and slots stay even.
  //
  // It also removes a recursion limit. The depth-first version called itself
  // once per node, which a few thousand nodes in a chain would overflow.
  const depth = new Map<string, number>()
  const kidsOf = new Map<string, string[]>()
  const seen = new Set<string>()

  function measure(start: string): void {
    if (seen.has(start) || !known.has(start)) return
    seen.add(start)
    depth.set(start, 0)
    // A cursor rather than `shift()`, which is O(n) per call and would make
    // this quadratic on a large graph.
    const queue: string[] = [start]
    for (let at = 0; at < queue.length; at++) {
      const id = queue[at]
      if (id === undefined) continue
      const level = depth.get(id) ?? 0
      const kids: string[] = []
      ;(children.get(id) || []).forEach(kid => {
        if (!known.has(kid) || seen.has(kid)) return
        seen.add(kid)
        depth.set(kid, level + 1)
        kids.push(kid)
        queue.push(kid)
      })
      kidsOf.set(id, kids)
    }
  }
  roots.forEach(measure)
  // Anything unreachable from a root still needs a place.
  graph.nodes.forEach(n => {
    if (!seen.has(n.id)) {
      roots.push(n.id)
      measure(n.id)
    }
  })

  const byDepth = new Map<number, string[]>()
  depth.forEach((d, id) => {
    const list = byDepth.get(d) ?? []
    list.push(id)
    byDepth.set(d, list)
  })
  const deepest = Math.max(0, ...byDepth.keys())

  const angle = new Map<string, number>()
  // Anything already on screen keeps the angle it has. The radius is re-derived
  // below, so only the angle has to survive, and it survives in the position
  // itself — no second cache to keep in step with the first.
  const settled = prev ? graph.nodes.filter(n => prev[n.id] && depth.has(n.id)) : []
  settled.forEach(n => {
    const at = prev?.[n.id]
    if (!at) return
    angle.set(n.id, Math.atan2(at.y, at.x))
  })

  if (!settled.length) {
    // Pass 1, cold: every leaf gets one equal slot of the circle, in traversal
    // order, and each parent centres over the slots its subtree covers.
    //
    // Handing each subtree a wedge proportional to its leaf count was the
    // previous attempt, and it degenerates: two nodes either side of a wedge
    // boundary can end up at almost the same angle, and since pass 2 sizes a
    // ring off its tightest pair, one such pair inflated the radius enormously
    // and the graph rendered as a single sweeping arc. Equal slots bound the
    // tightest gap at one slot width, so the radius stays proportional to size.
    let slot = 0
    const assign = (id: string): number => {
      const kids = kidsOf.get(id) || []
      if (!kids.length) {
        angle.set(id, slot)
        return slot++
      }
      const spans = kids.map(assign)
      const first = spans[0]
      const last = spans[spans.length - 1]
      const centre = ((first ?? 0) + (last ?? 0)) / 2
      angle.set(id, centre)
      return centre
    }
    roots.forEach(assign)

    const slots = Math.max(1, slot)
    // Start at -90° so the first branch leaves the root upward.
    angle.forEach((s, id) => angle.set(id, -Math.PI / 2 + (2 * Math.PI * (s + 0.5)) / slots))
  } else {
    // Pass 1, incremental: place only what has no angle yet.
    //
    // A parent's wedge is half the angular distance to its nearest neighbour on
    // its own ring, either side — the room it can spend on children without
    // reaching into anyone else's. A node alone on its ring owns the circle.
    const wedgeOf = (id: string, d: number, pa: number): number => {
      const peerAngles = (byDepth.get(d) || [])
        .filter(x => x !== id)
        .map(x => angle.get(x))
        .filter((a): a is number => a !== undefined)
      if (!peerAngles.length) return Math.PI
      return Math.max(Math.min(...peerAngles.map(a => Math.abs(arc(a - pa)))) / 2, 1e-3)
    }

    const placeKids = (id: string, d: number): void => {
      const kids = (kidsOf.get(id) || []).filter(k => depth.has(k))
      const fresh = kids.filter(k => !angle.has(k))
      if (!fresh.length) return

      const pa = angle.get(id)
      if (pa === undefined) return
      const w = wedgeOf(id, d, pa)
      // A whole circle has no left and right edge to fan between, so the slots
      // are laid out from -90° instead — same convention as the cold pass.
      const full = w >= Math.PI - 1e-9
      const slots: (number | null)[] = kids.map((_, i) =>
        full
          ? -Math.PI / 2 + (2 * Math.PI * i) / kids.length
          : pa - w + ((i + 0.5) * 2 * w) / kids.length
      )

      // Siblings already placed hold their angle; each newcomer takes whichever
      // remaining slot sits furthest from all of them, so a second expansion
      // fills the gaps rather than crowding the first one's children.
      const taken: number[] = kids
        .map(k => angle.get(k))
        .filter((a): a is number => a !== undefined)
      fresh.forEach(kid => {
        let best = slots.findIndex(s => s !== null)
        let score = -Infinity
        slots.forEach((s, i) => {
          if (s === null) return
          const clearance = taken.length ? Math.min(...taken.map(t => Math.abs(arc(s - t)))) : 0
          if (clearance > score) {
            score = clearance
            best = i
          }
        })
        const chosen = slots[best]
        if (chosen === null || chosen === undefined) return
        angle.set(kid, chosen)
        taken.push(chosen)
        slots[best] = null
      })
    }

    // Ring by ring outward, so a parent always has its angle before its
    // children ask for it.
    for (let d = 0; d <= deepest; d++) {
      ;(byDepth.get(d) || []).forEach(id => {
        // A node detached from every root — a delete can leave one — has no
        // parent to inherit a wedge from, so it takes the top of its ring and
        // pass 2 widens the ring if that crowds anything.
        if (!angle.has(id)) angle.set(id, -Math.PI / 2)
        placeKids(id, d)
      })
    }
  }

  // Pass 2: size each ring off the *tightest* neighbouring pair on it, not the
  // average. Wedges are shared out by leaf count, so a crowded branch gets
  // thinner slices than the mean and an average-based radius lets its nodes
  // touch. Rings also never move inside the ring within them.
  //
  // A ring may also never move *back* inside where it already is: shrinking one
  // would drag every node on it inward, which is the reload this is here to
  // avoid. Growing is allowed, because the alternative is nodes overlapping.
  const floor = new Map<number, number>()
  settled.forEach(n => {
    const d = depth.get(n.id)
    const at = prev?.[n.id]
    if (d === undefined || !at) return
    floor.set(d, Math.max(floor.get(d) || 0, Math.hypot(at.x, at.y)))
  })
  const radii: number[] = []
  for (let d = 0; d <= deepest; d++) {
    const ids = byDepth.get(d) || []
    let needed = 0
    if (ids.length > 1) {
      const sorted = ids
        .map(id => angle.get(id))
        .filter((a): a is number => a !== undefined)
        .sort((a, b) => a - b)
      let tightest = Infinity
      for (let i = 1; i < sorted.length; i++) {
        const a = sorted[i]
        const b = sorted[i - 1]
        if (a !== undefined && b !== undefined) tightest = Math.min(tightest, a - b)
      }
      // close the circle
      const first = sorted[0]
      const last = sorted[sorted.length - 1]
      if (first !== undefined && last !== undefined) {
        tightest = Math.min(tightest, first + 2 * Math.PI - last)
      }
      if (tightest > 0) needed = NODE_SPACING / tightest
    }
    const grown = d === 0 ? needed : Math.max((radii[d - 1] ?? 0) + RING, needed)
    radii[d] = Math.max(grown, floor.get(d) || 0)
  }

  const positions: Positions = {}
  graph.nodes.forEach(n => {
    const d = depth.get(n.id) ?? 0
    const r = radii[d] ?? 0
    const was = prev ? prev[n.id] : undefined
    // Hand back the same point, not one recomputed from an angle recovered out
    // of it. cos(atan2(y, x)) · hypot(x, y) is only x to within a float, and a
    // node that is supposed to stay still must not drift.
    if (was && Math.abs(Math.hypot(was.x, was.y) - r) < 1e-9) {
      positions[n.id] = was
      return
    }
    const a = angle.get(n.id) || 0
    positions[n.id] = { x: Math.cos(a) * r, y: Math.sin(a) * r }
  })
  return positions
}
