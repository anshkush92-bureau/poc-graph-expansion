// The two optimisations every one of these engines can be given, expressed as
// pure graph transforms.
//
// Level of detail and viewport culling are normally per-library settings —
// Cytoscape has `min-zoomed-font-size`, React Flow has
// `onlyRenderVisibleElements`, NVL drops captions on its own, and four of the
// eight have nothing at all. Measuring those against each other measures eight
// different features.
//
// Doing both in the shared layer instead measures one thing: what the engine
// costs when it is handed less to draw. Every pane already builds its captions
// from `node.name` / `edge.label` and draws exactly the nodes it is given, so
// neither transform needs a single line inside a renderer, and the comparison
// stays about the renderer.
//
// The honest caveat, stated here because it belongs in the write-up: an engine
// with its own culling gets no *extra* credit from this, and an engine with
// none gets to borrow it. That is the point — it separates "this library is
// fast" from "this library ships the optimisation you would have written".

import type { Graph, Positions } from '../engine/types.ts'

export interface Box {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export interface OptimiseOptions {
  lod?: boolean
  cull?: boolean
  fraction?: number
}

/**
 * Level of detail: the same graph with nothing to letter.
 *
 * Captions are the expensive half of a dense graph on every renderer here.
 * Canvas engines pay a `measureText` and a fill per label; the SVG and DOM
 * engines pay a whole element each. Blanking them is what a real LOD does when
 * the zoom drops below the point where text is legible anyway — Cytoscape's
 * `min-zoomed-font-size` is exactly this rule, applied automatically.
 *
 * Node objects are copied rather than mutated: the same node objects are handed
 * to whichever pane is on screen and to the side panel, and blanking a name in
 * place would blank it everywhere.
 */
export function stripLabels(graph: Graph): Graph {
  return {
    nodes: graph.nodes.map(n => Object.assign({}, n, { name: '' })),
    edges: graph.edges.map(e => Object.assign({}, e, { label: '' }))
  }
}

/**
 * The bounding box of a centred fraction of the graph.
 *
 * Standing in for a real viewport, and deliberately so. Reading the visible
 * world rectangle back out of eight engines means eight different APIs, two of
 * which have no viewport at all — and the resulting box would differ per engine,
 * so each would be culled to a different node count and the numbers would not
 * compare. A fixed centred fraction is the same cut for everyone: `0.25` is
 * what a reader sees having zoomed in to a quarter of the graph's extent, which
 * is an ordinary thing to do and the case culling exists for.
 */
export function centreBox(positions: Positions, fraction: number): Box {
  const points = Object.values(positions)
  if (!points.length) return { minX: 0, maxX: 0, minY: 0, maxY: 0 }

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  points.forEach(p => {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.y < minY) minY = p.y
    if (p.y > maxY) maxY = p.y
  })

  const midX = (minX + maxX) / 2
  const midY = (minY + maxY) / 2
  const halfX = ((maxX - minX) * fraction) / 2
  const halfY = ((maxY - minY) * fraction) / 2
  return { minX: midX - halfX, maxX: midX + halfX, minY: midY - halfY, maxY: midY + halfY }
}

/**
 * Drops everything outside the box.
 *
 * An edge survives only if both ends do. Keeping half-edges would mean keeping
 * their off-screen endpoint as a node, which is culling that culls nothing —
 * and on a graph with any hub in it, that is most of the graph.
 *
 * The root is *not* given an exemption. It would be a lie about the cost: a
 * viewport does not keep a node because it is important.
 */
export function cullToBox(graph: Graph, positions: Positions, box: Box): Graph {
  const kept = new Set<string>()
  const nodes = graph.nodes.filter(n => {
    const at = positions[n.id]
    if (!at || at.x < box.minX || at.x > box.maxX || at.y < box.minY || at.y > box.maxY)
      return false
    kept.add(n.id)
    return true
  })
  const edges = graph.edges.filter(e => kept.has(e.source) && kept.has(e.target))
  return { nodes, edges }
}

/**
 * Applies whichever optimisations are switched on, and reports what survived.
 *
 * `drawn` is reported alongside every frame number in the results table, because
 * "culling made it three times faster" is not a finding on its own — it is only
 * a finding next to how much of the graph stopped being drawn.
 */
export function optimise(
  graph: Graph,
  positions: Positions,
  { lod = false, cull = false, fraction = 0.25 }: OptimiseOptions = {}
): { graph: Graph; drawn: { nodes: number; edges: number } } {
  let out = graph
  if (cull) out = cullToBox(out, positions, centreBox(positions, fraction))
  if (lod) out = stripLabels(out)
  return { graph: out, drawn: { nodes: out.nodes.length, edges: out.edges.length } }
}
