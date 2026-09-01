// Self-referring relationships, for both renderers.
//
// Neither engine draws a link whose source and target are the same node.
// ECharts' graph series reduces it to a zero-length segment that disappears
// behind the node's own symbol, and a FusionCharts drag-node connector is a
// straight line between two node ids — from and to being equal draws nothing.
//
// So both sides get the *same* workaround, which is what keeps the comparison
// about the libraries rather than about two different cheats: the loop is
// routed through two invisible pivots, turning it into three ordinary links
// that both engines already know how to draw, with the arrowhead on the last
// one so it lands back on the node it left.
//
// The pivots are not graph nodes. They never enter `useGraph`'s state and are
// absent from App's id -> node map, so a click or hover that resolves to one
// finds nothing and no-ops. That is the whole of their isolation — worth
// knowing before adding an interaction that assumes every drawn node is real.

import { NODE_SPACING, isSelfEdge } from './ops.js'

// Kept inside the elbow room `layoutRadial` guarantees every node on its ring,
// so a loop never reaches far enough to sit on the node next door.
//
// The loop arches *above* its node, and the segment carrying the label is the
// horizontal one across the top. Both matter for legibility: node captions sit
// below the disc, so going up keeps the two apart, and ECharts rotates an edge
// label to follow its line — on a vertical segment the relationship name came
// out sideways and collided with the node next to it.
const REACH = NODE_SPACING * 0.62
const HALF = NODE_SPACING * 0.3

/**
 * Flattens a graph's edges into drawable links, expanding self-edges.
 *
 * Returns `links` in a shape both renderers map over, and the `pivots` they
 * have to add as invisible nodes for those links to have endpoints.
 */
export function withLoops(graph, positions) {
  const links = []
  const pivots = []

  graph.edges.forEach(edge => {
    if (!isSelfEdge(edge)) {
      links.push({
        id: edge.id,
        from: edge.source,
        to: edge.target,
        label: edge.label,
        arrow: true,
        synthetic: !!edge.synthetic
      })
      return
    }

    const at = positions[edge.source]
    if (!at) return // node laid out yet? if not, skip rather than draw to 0,0

    const a = { id: edge.id + '::a', x: at.x - HALF, y: at.y - REACH }
    const b = { id: edge.id + '::b', x: at.x + HALF, y: at.y - REACH }
    pivots.push(a, b)

    // Out to the first pivot, across left to right (carrying the label, clear of
    // the node), then back in with the arrowhead.
    links.push(
      { id: edge.id + '#out', from: edge.source, to: a.id, label: '', loop: true },
      { id: edge.id + '#over', from: a.id, to: b.id, label: edge.label, loop: true },
      { id: edge.id + '#back', from: b.id, to: edge.source, label: '', loop: true, arrow: true }
    )
  })

  return { links, pivots }
}
