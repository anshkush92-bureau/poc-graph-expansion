// Graphs of an exact size, for the stress dial.
//
// The expansion path grows the graph a handful of nodes at a time. That is the
// realistic shape, and a useless benchmark: no renderer shows its ceiling at 40
// nodes, and the differences this POC is trying to measure only appear once the
// node count is in the thousands.
//
// So this builds a graph of a requested size in the *same* shape the rest of the
// app already understands — same node fields, same edge fields — which is what
// lets every renderer, the hover card, the side panel and the radial layout all
// keep working unchanged at 2,000 nodes.
//
// Deterministic on purpose: a given (nodes, edges, seed) triple always produces
// the same graph, so two runs of the same benchmark are comparable and a
// screenshot can be reproduced.

import { ENTITY, ROOT, hash, relationLabel } from './data.js'

const TYPES = Object.keys(ENTITY)

const pick = (salt, n) => hash(salt) % n

/**
 * Children per node.
 *
 * Fourth root, so depth stays around four rings whatever the size: 100 nodes
 * branch by 4, 5,000 by 9. A fixed branching factor instead would put a 5,000
 * node graph twelve rings deep, and `layoutRadial` spaces rings 230px apart —
 * the graph would be mostly empty space and the fit would zoom it to nothing.
 */
const branchingFor = count => Math.max(2, Math.ceil(Math.pow(count, 0.25)))

function nameFor(type, seq) {
  switch (type) {
    case 'account': return `acct_${seq}`
    case 'device': return ['iPhone 14', 'Pixel 7', 'Win/Chrome', 'macOS/Safari'][seq % 4]
    case 'phone': return `+91 ${seq}${(seq * 7) % 100000}`
    case 'email': return `user${seq}@${['proton.me', 'gmail.com', 'mailinator.com'][seq % 3]}`
    case 'ip': return `10.${seq % 255}.${(seq * 3) % 255}.${(seq * 11) % 255}`
    case 'card': return `**** ${String(seq).padStart(4, '0')}`
    default: return String(seq)
  }
}

/**
 * A graph of exactly `nodeCount` nodes and about `edgeCount` edges.
 *
 * The first `nodeCount - 1` edges form a spanning tree, which is not a stylistic
 * choice: `layoutRadial` places a node inside its parent's angular wedge, so a
 * node with no path from a root falls back to the top of its ring and every such
 * node lands on the same angle. A tree first, extras second, keeps the layout
 * meaningful at any edge count.
 *
 * Extra edges are cross-links between existing nodes — including, deliberately,
 * a few self-edges, since drawing those is one of the things the engines differ
 * on most and a stress graph that omits them would hide it.
 *
 * `edgeCount` is a target, not a guarantee, and it is bounded at *both* ends.
 * The tree comes first, so anything below `nodeCount - 1` is ignored — ask for
 * 100 edges on 2,000 nodes and you get 1,999. Above, duplicate pairs are skipped
 * rather than retried, so a request for far more than the node count can support
 * lands short. Callers report what was actually built, not what was asked.
 */
export function synthGraph(nodeCount, edgeCount, seed = 1) {
  const n = Math.max(0, Math.floor(nodeCount))
  // Zero means zero. The dials go down to it, and floors that quietly hand back
  // one node are the same lie as the edge floor above — better to draw nothing
  // and let the pane say so.
  if (!n) return { nodes: [], edges: [] }
  const branching = branchingFor(n)
  const nodes = [ROOT]
  const edges = []
  const seen = new Set()

  for (let i = 1; i < n; i++) {
    const salt = `${seed}:${i}`
    const parent = nodes[Math.floor((i - 1) / branching)]
    const type = TYPES[pick(salt + ':type', TYPES.length)]
    const seq = pick(salt + ':seq', 9000) + 1000
    const risk = pick(salt + ':risk', 100)
    const node = {
      id: `S${i}-${ENTITY[type].tag}`,
      type,
      level: parent.level + 1,
      name: nameFor(type, seq),
      risk,
      flagged: risk > 92, // rarer than the hand-built graph: at 2,000 nodes an
      firstSeen: `2026-0${1 + (seq % 6)}-${10 + (seq % 18)}`, // 18% flag rate is
      events: 4 + (seq % 240) // a screen of pulsing rings and nothing else.
    }
    nodes.push(node)
    const id = `${parent.id}->${node.id}`
    seen.add(id)
    edges.push({ id, source: parent.id, target: node.id, label: relationLabel(parent.type, type) })
  }

  const extra = Math.max(0, Math.floor(edgeCount) - edges.length)
  for (let j = 0; j < extra; j++) {
    const salt = `${seed}:x${j}`
    const from = nodes[pick(salt + ':from', n)]
    // Every fortieth cross-link loops back on itself. Left to chance a
    // self-edge needs source and target to collide, which at 2,000 nodes is
    // roughly never — and the engines differ more on self-edges than on almost
    // anything else, so a stress graph without them hides the interesting part.
    const to = j % 40 === 0 ? from : nodes[pick(salt + ':to', n)]
    const id = `${from.id}=>${to.id}`
    if (seen.has(id)) continue
    seen.add(id)
    edges.push({ id, source: from.id, target: to.id, label: relationLabel(from.type, to.type) })
  }

  return { nodes, edges }
}
