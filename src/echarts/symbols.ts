// ─────────────────────────────────────────────────────────────────────────────
// The ECharts customization catalog: every node shape and edge style the UI
// offers, kept out of the renderer so EChartsGraph.jsx stays about *pipeline*
// and this file stays about *appearance*.
//
// DEPENDENCIES: none. Not even echarts. Every value here is a plain string or
// number that the graph series accepts as-is — which is the point of the file:
// shape choice is data, not code, so adding a shape never touches the renderer.
//
// WHO READS THIS
//   src/echarts/EChartsGraph.jsx  → STEP 4 (node symbols) and STEP 5 (edges)
//   src/App.jsx                   → builds the two <select>s off the labels
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A shape is a `symbol` string plus a size correction.
 *
 * The correction exists because ECharts fits every symbol to the same square
 * bounding box, and equal boxes are not equal *ink*: a triangle inscribed in a
 * 22px box covers under half the area of a 22px circle, so at one symbolSize a
 * triangle node reads as a smaller node rather than a different one. `scale`
 * pushes the box out until the shapes look like siblings.
 *
 * ECharts' built-ins are the eight named ones below. Anything else has to be a
 * `path://` string — an SVG path in any coordinate space, which ECharts reads
 * the bounding box of and scales to symbolSize. The 0–100 space used here is
 * arbitrary and just easier to hand-write than a normalised one.
 */
export const SHAPE = {
  // ── built-in symbols ───────────────────────────────────────────────────────
  circle: { symbol: 'circle', scale: 1, label: 'Circle' },
  square: { symbol: 'rect', scale: 0.88, label: 'Square' },
  rounded: { symbol: 'roundRect', scale: 0.92, label: 'Rounded square' },
  triangle: { symbol: 'triangle', scale: 1.24, label: 'Triangle' },
  diamond: { symbol: 'diamond', scale: 1.18, label: 'Diamond' },
  pin: { symbol: 'pin', scale: 1.3, label: 'Pin' },
  arrowhead: { symbol: 'arrow', scale: 1.2, label: 'Arrow' },

  // ── custom SVG paths ───────────────────────────────────────────────────────
  // Drawn clockwise from the top point. A path symbol costs nothing extra to
  // render — ZRender treats it as one more path in the same display list.
  hexagon: {
    symbol: 'path://M50 2 L95 26 L95 74 L50 98 L5 74 L5 26 Z',
    scale: 1.12,
    label: 'Hexagon'
  },
  star: {
    symbol: 'path://M50 3 L61 38 L98 38 L68 60 L79 96 L50 74 L21 96 L32 60 L2 38 L39 38 Z',
    scale: 1.4,
    label: 'Star'
  },
  shield: {
    symbol: 'path://M50 2 L95 18 L95 52 C95 82 74 94 50 98 C26 94 5 82 5 52 L5 18 Z',
    scale: 1.14,
    label: 'Shield'
  },
  plus: {
    symbol:
      'path://M35 2 L65 2 L65 35 L98 35 L98 65 L65 65 L65 98 L35 98 L35 65 L2 65 L2 35 L35 35 Z',
    scale: 1.16,
    label: 'Cross'
  },
  chip: {
    symbol:
      'path://M18 18 L82 18 L82 82 L18 82 Z M32 4 L38 4 L38 18 L32 18 Z M62 4 L68 4 L68 18 L62 18 Z M32 82 L38 82 L38 96 L32 96 Z M62 82 L68 82 L68 96 L62 96 Z M4 32 L18 32 L18 38 L4 38 Z M4 62 L18 62 L18 68 L4 68 Z M82 32 L96 32 L96 38 L82 38 Z M82 62 L96 62 L96 68 L82 68 Z',
    scale: 1.25,
    label: 'Chip'
  }
}

// The subset of GraphNode a shape set's shapeOf needs. `type` stays a bare
// string rather than the app's EntityType union: shapeOf must survive a node
// whose type doesn't match anything below (the symbols test exercises exactly
// that, with a `'nonsense'` type), falling back rather than refusing to type.
interface ShapeNode {
  type: string
  level: number
  risk: number
  flagged: boolean
}

// One shape per entity type. This is the set worth shipping: shape carries the
// type, so the graph survives being read at a glance, printed, or looked at by
// someone who cannot separate the six palette hues.
const BY_TYPE: Record<string, keyof typeof SHAPE> = {
  account: 'circle',
  device: 'square',
  phone: 'rounded',
  email: 'diamond',
  ip: 'triangle',
  card: 'pin'
}

/**
 * The shape sets the user picks between.
 *
 * `shapeOf(node)` returns a key into SHAPE above. It gets the whole node, so a
 * set is free to key off anything the graph knows — type, level, risk, whether
 * the analyst added it by hand.
 */
// Typed (rather than a bare array literal) for the same reason as
// DEPTH_STYLES below: indexing it must stay a literal SHAPE key, not widen to
// `string`, once `|| 'plus'` covers a level past the array's end.
const DEPTH_SHAPES: readonly (keyof typeof SHAPE)[] = [
  'circle',
  'hexagon',
  'square',
  'diamond',
  'triangle'
]

export const SHAPE_SETS = {
  type: {
    label: 'Shape per entity type',
    shapeOf: (node: ShapeNode) => BY_TYPE[node.type] || 'circle'
  },
  uniform: {
    label: 'All circles',
    shapeOf: () => 'circle'
  },
  custom: {
    label: 'Custom SVG paths',
    // Same six types, drawn with hand-written path:// symbols instead of
    // built-ins — the proof that the shape vocabulary is not capped at eight.
    shapeOf: (node: ShapeNode) =>
      (
        ({
          account: 'hexagon',
          device: 'chip',
          phone: 'shield',
          email: 'plus',
          ip: 'triangle',
          card: 'star'
        }) as Record<string, keyof typeof SHAPE>
      )[node.type] || 'hexagon'
  },
  risk: {
    label: 'Shape per risk band',
    // Shape as a severity channel: the thing an analyst is hunting for is the
    // only pointed shape on the canvas.
    shapeOf: (node: ShapeNode) => (node.flagged ? 'star' : node.risk > 55 ? 'triangle' : 'rounded')
  },
  depth: {
    label: 'Shape per hop distance',
    // Reads the ring you are on off the symbol, so a screenshot still says how
    // far from the root each node sits after the labels are cropped off.
    shapeOf: (node: ShapeNode) => DEPTH_SHAPES[node.level] || 'plus'
  }
}

/**
 * The edge styles the user picks between.
 *
 * `line` merges into the link's `lineStyle`; `ends` is the [tail, head] symbol
 * pair; `curveness` bows the line. Colour is *not* here — it is assigned in the
 * renderer, because it carries meaning (loop / analyst-added / ordinary) that
 * an appearance preset has no business overwriting.
 *
 * Two things a graph series cannot do, worth knowing before asking for them:
 * there is no travelling-pulse effect on a graph edge (that is the `lines`
 * series' `effect`, and it needs its own coordinate system), and dash offset is
 * not animatable per link — a "flowing" edge means a second series on top.
 */
export const EDGE_STYLES = {
  arrow: {
    label: 'Solid, arrowhead',
    line: { width: 1.4, type: 'solid' },
    ends: ['none', 'arrow'],
    curveness: 0
  },
  dashed: {
    label: 'Dashed',
    // A number pair instead of 'dashed' — the keyword picks a dash length off
    // the line width, which at 1.4px is too fine to read as dashed at all.
    line: { width: 1.5, type: [7, 5] },
    ends: ['none', 'arrow'],
    curveness: 0
  },
  dotted: {
    label: 'Dotted',
    line: { width: 2, type: [1, 4], cap: 'round' },
    ends: ['none', 'arrow'],
    curveness: 0
  },
  curved: {
    label: 'Curved',
    // Bowed the same way for every link, which is what separates the two edges
    // of a reciprocal pair — drawn straight they land on top of each other.
    line: { width: 1.4, type: 'solid' },
    ends: ['none', 'arrow'],
    curveness: 0.22
  },
  socket: {
    label: 'Thick, socketed',
    line: { width: 3.2, type: 'solid', opacity: 0.5, cap: 'round' },
    // A tail symbol as well as a head: the dot marks which end the relationship
    // is read from, so direction survives the arrowhead being hidden under a
    // node at low zoom.
    ends: ['circle', 'arrow'],
    curveness: 0.08
  },
  plain: {
    label: 'Hairline, no arrows',
    line: { width: 1, type: 'solid', opacity: 0.8 },
    ends: ['none', 'none'],
    curveness: 0
  }
}

// Which line each relationship kind gets under the `relation` rule below.
// Grouped by what the relationship *means*, not by name: the two ways an entity
// gets shared between accounts read alike, and the two ways a device is
// physically observed read alike.
//
// Keyed by relationship label (an open string, not every label has an entry),
// so the index signature is `string` rather than a literal union — the lookup
// below is a genuine partial match, hence its `|| ...` fallback.
const RELATION_STYLE: Record<string, keyof typeof EDGE_STYLES> = {
  SHARED_BY: 'socket', // the pivot in a fraud ring — the loudest line
  AUTHORISED_FROM: 'socket',
  SIGNED_IN_FROM: 'arrow', // ordinary account activity
  VERIFIED_WITH: 'arrow',
  REGISTERED_AS: 'arrow',
  PAID_WITH: 'arrow',
  SEEN_ON: 'dotted', // observation, not assertion
  HOSTED: 'dotted',
  PAIRED_WITH: 'dashed', // a weaker inference
  REPEAT_ATTEMPT: 'curved', // the self-referring ones
  RE_AUTHORISED: 'curved',
  REROUTED_VIA: 'curved'
}

/**
 * The **Edges** picker: one entry per option, each resolving a link to a key in
 * EDGE_STYLES above.
 *
 * The first six are the flat ones — every edge gets the same recipe. The rules
 * after them derive the recipe per edge instead, which is the interesting half:
 * a graph series has no concept of an "edge style" to begin with, only a list of
 * links each carrying its own `lineStyle`, so styling them individually is the
 * native case and uniformity is what costs an extra step.
 *
 * `styleOf(link, ctx)` receives a flattened link from `withLoops`
 * (`{ id, from, to, label, arrow, loop?, synthetic? }`) and a context object
 * carrying what the link itself cannot know — currently `{ level }`, the hop
 * distance of the node the edge leaves from, or -1 for a loop's pivot legs.
 */

/** The flattened link shape `withLoops` (src/graph/loops.ts) produces. */
export interface FlatLink {
  id: string
  from: string
  to: string
  label: string
  arrow: boolean
  loop?: boolean
  synthetic?: boolean
}

export interface EdgeRule {
  label: string
  styleOf(link: FlatLink, ctx: { level: number }): keyof typeof EDGE_STYLES
}

// Lines thin out as they go further from the root, so the first hop off the
// subject reads as the spine of the graph. Typed (rather than a bare array
// literal) so indexing it stays a literal EDGE_STYLES key instead of widening
// to `string` once `|| 'plain'` covers the out-of-range case.
const DEPTH_STYLES: readonly (keyof typeof EDGE_STYLES)[] = ['socket', 'arrow', 'dashed', 'dotted']

// Flat: the picked style, everywhere. Derived from EDGE_STYLES rather than
// written out, so a new style shows up in the picker for free.
//
// Built with Object.fromEntries + an explicit Record cast rather than
// Object.assign(Object.keys(...).reduce(...), {}) — the reduce's accumulator
// had no way to declare its keys up front, so TypeScript inferred it as an
// index signature (`{ [key: string]: EdgeRule }`) and every literal key
// collapsed to `string`. fromEntries has the same runtime shape; only the
// static type changes.
const flatRules = Object.fromEntries(
  (Object.keys(EDGE_STYLES) as (keyof typeof EDGE_STYLES)[]).map(key => [
    key,
    { label: EDGE_STYLES[key].label, styleOf: () => key }
  ])
) as unknown as Record<keyof typeof EDGE_STYLES, EdgeRule>

export const EDGE_RULES = {
  ...flatRules,
  kind: {
    label: 'Rule · by edge origin',
    // Provenance as a line style: what the backend returned, what the analyst
    // drew by hand, and what an entity does to itself.
    styleOf: (link: FlatLink) => (link.loop ? 'curved' : link.synthetic ? 'dashed' : 'arrow')
  },
  relation: {
    label: 'Rule · by relationship',
    styleOf: (link: FlatLink) => RELATION_STYLE[link.label] || (link.loop ? 'curved' : 'arrow')
  },
  depth: {
    label: 'Rule · by hop distance',
    styleOf: (_link: FlatLink, ctx: { level: number }) => DEPTH_STYLES[ctx.level] || 'plain'
  }
}

/** The cycle a click walks an individual edge through. */
export const EDGE_STYLE_ORDER = Object.keys(EDGE_STYLES)
