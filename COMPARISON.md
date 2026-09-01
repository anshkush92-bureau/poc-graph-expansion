# Neo4j NVL vs React Flow v9, on React 16

Both tabs in this app render the **same graph** through the **same interaction
model**. Everything except drawing lives in `src/graph/` and is shared, so the
difference between `src/nvl/NvlGraph.jsx` and `src/flow/FlowGraph.jsx` *is* the
comparison.

Every number below was measured in this repo, not quoted from docs.

---

## 1. React 16 compatibility — the deciding constraint

| | Verdict |
|---|---|
| `@neo4j-nvl/react` | **Unusable on React 16.** Every published version declares `react: 18.0.0 \|\| ^19` as a peer. The one version with no peer range (`0.3.6`) declares `react: ^18.2.0` as a *hard dependency*, which would load a second React into the page. |
| `@neo4j-nvl/base` + `@neo4j-nvl/interaction-handlers` | **Fine.** Framework-free; `base`'s only peer is `neo4j-driver`, and `interaction-handlers` has none. |
| `react-flow-renderer@9.7.4` | **Fine.** Peer is literally `react: 16 \|\| 17`. |

So on React 16 the documented NVL React wrappers (`BasicNvlWrapper`,
`InteractiveNvlWrapper`) are off the table, and you write the wrapper yourself.
That turns out to be cheap — `NvlGraph.jsx` is a ref, one setup effect and one
sync effect — because `BasicNvlWrapper` is not doing much more than that.

The cost is not lines of code, it's that **you now own the lifecycle**:
instantiating `new NVL(...)`, constructing each interaction handler, registering
callbacks via `updateCallback(name, fn)`, diffing removals with
`removeNodesWithIds` / `removeRelationshipsWithIds`, and calling `destroy()` on
every handler plus the instance on unmount. React Flow gives you all of that as
props and a normal component tree.

## 2. Weight

Each library bundled alone with esbuild (minified, React external):

| | Minified | Gzip | Extra |
|---|---|---|---|
| NVL (`base` + `interaction-handlers`) | 1,761 KB | **509 KB** | + 668 KB of lazily-loaded layout workers |
| React Flow v9 | 166 KB | **50 KB** | — |

**NVL is ~10× the wire cost.** It pulls in `mobx`, `d3-force`, `gl-matrix`,
`lodash`, `tinycolor2`, `concaveman` and `@segment/analytics-next`. That last one
is worth knowing about before shipping NVL into a product.

## 3. Layout — the biggest hidden cost of React Flow

NVL ships force-directed, hierarchical, circular, grid, free and d3-force
layouts. You pass `layout: ForceDirectedLayoutType` and you are done; the dense
159-node screenshot is NVL with zero layout code from us.

**React Flow v9 ships no layout engine at all.** Nodes render exactly where you
put them, so a graph that grows by expansion needs a layout you write and
maintain. This was by far the most error-prone part of the POC, and it took
three attempts:

1. **Top-down tree** (leaf gets the next column, parent centres over children).
   Fine at 13 nodes. At ~116 nodes it was **~19,000 px wide and four rows tall** —
   past what `fitView` can zoom to, so the graph simply ran off both edges.
2. **Radial, wedges proportional to leaf count.** Correct aspect ratio, but ring
   radius was sized off the *tightest* adjacent pair, and two nodes either side
   of a wedge boundary can sit at almost the same angle. One such pair inflated
   the radius enormously and the whole graph rendered as a single sweeping arc.
3. **Radial, one equal angular slot per leaf** (`layoutRadial` in
   `src/graph/ops.js`). Bounds the tightest gap at one slot width, so radius
   stays proportional to node count. This is what ships.

`ops.test.js` now pins all three failure modes: aspect ratio under 3, no pair
closer than the 76 px disc diameter, outer ring within `NODE_SPACING·n/2π`, and
nodes occupying at least 9 of 12 sectors.

That is ~90 lines of layout plus its tests that the NVL side never needed.

## 4. Self-edges (`source === target`)

**NVL renders them natively** — visible as small loops in the NVL screenshots,
no work required. Its types even mention self-referring relationships (e.g.
`captionAlign` documents having no effect on them).

**React Flow v9 does not.** Its `bezier` and `smoothstep` edge types collapse to
nothing when source and target are the same node, because both endpoints resolve
to the same handle coordinates. It needs a custom edge type — `SelfLoopEdge` in
`FlowGraph.jsx` — drawing an explicit cubic arc out to the right and back, plus
an `EdgeText` for the label offset clear of the disc (nodes paint above edges, so
a closer label has its first half hidden behind the circle).

The subtler cost: **self-edges break every graph walk that assumes edges mean
hierarchy.** Four separate places in the shared layer had to learn to skip them:

- `layoutRadial` — a self-edge made a node its own child and cost it its place as a layout root
- `pathToRoot` — made a node its own parent, truncating the trace to one entry
- `hiddenCounts` — counted a loop as a mapped onward link, so badges under-reported
- `neighborsOf` — needed a third direction, `self`

None of that is React Flow's fault, but it is work the NVL path would also have
needed, and it is where the bugs were.

## 5. Rendering model

| | NVL | React Flow v9 |
|---|---|---|
| Surface | Canvas / WebGL | DOM + SVG |
| 159 nodes | one `<canvas>` | 2,308 DOM elements |
| Node visuals | `color`, `size`, `caption`, `captionSize`, icon URL | anything — real React components |
| Styling | JS values only; cannot read CSS custom properties | full CSS |
| Labels at low zoom | hidden automatically (its own LOD) | always drawn, unreadable when dense |

This is the real trade. The circular discs, the risk numbers, the `+N` hidden
badges and the flagged glow in the React Flow tab are ordinary HTML and CSS.
Reproducing them in NVL means canvas drawing or a custom renderer. Conversely
NVL's canvas does not care about node count, while React Flow needs
`onlyRenderVisibleElements` and memoisation to stay smooth.

## 6. Performance — what actually caused lag

Measured as mean ms per hover event across 150 events at 159 nodes:

| Change | ms/hover |
|---|---|
| Before | **8.65** |
| After `React.memo` on both renderers + stable callback identities | **0.86** |

A 10× improvement, and none of it was the graph library. Four fixes, all in
shared code:

1. **`React.memo` on both renderers.** Hovering sets state in `App`, which
   re-renders the tree. With memo and stable props the renderer sits out the
   hover path entirely instead of re-reconciling every node on every mousemove.
2. **Stable `isExpanded` / `isPending` identities** (`useCallback` over a ref).
   Re-created each render, they broke the `elements` `useMemo` and recomputed the
   whole radial layout on unrelated state changes — including hover.
3. **`hiddenCounts` batched into one map.** Called per node it was O(n²): at 159
   nodes that is ~25,000 set builds per render.
4. **`unstable_batchedUpdates`** around the fetch resolution. React 16 does not
   batch state updates inside a promise callback, so each expansion rendered and
   re-laid-out twice.

Points 1, 2 and 4 are React-16-specific traps that would not exist on React 18.

## 7. Traps worth knowing before you commit

**React Flow v9**
- `onElementClick` fires from react-draggable's **`onDragStop`**, not the node's
  `onClick`, whenever nodes are draggable. A synthetic `click` event expands
  nothing — this cost a whole verification round before the harness was switched
  to real CDP input events.
- Supplying inline `width`/`height` on nodes makes v9 skip measuring the DOM, and
  it then logs `couldn't create edge for source handle id: null`. Size nodes from
  CSS and let it measure.
- `nodeTypes` / `edgeTypes` must be module-level constants — a fresh object
  identity rebuilds every node and edge.
- `deleteKeyCode` defaults to Backspace deleting selected elements. Set it to
  `null` if deletion is an explicit action.
- `smoothstep` drops every edge onto the same horizontal band, so relationship
  labels stack on top of each other. `straight` spreads them.

**NVL**
- `ZoomOptions.animated: true` means "do **not** animate" — inverted naming.
- It never re-fits the viewport when elements are added, so an expanding graph
  walks off screen. Needs a debounced `fit(ids)` after the force layout settles.
- Captions only render on the `canvas` renderer, not WebGL.
- `HoverInteraction`'s `onHover` fires on **every mousemove**, hit or miss.
  Dedupe by element id or it thrashes React state continuously.
- Callbacks go on handler instances via `updateCallback(name, fn)`, not as props,
  so you need a ref indirection to avoid rebuilding the canvas when handlers change.
- Logs a GPU warning and falls back to CPU where WebGL is unavailable.

## 8. Recommendation

**Pick React Flow v9** if you are staying on React 16 and the graph is
human-scale (hundreds of nodes). It is 10× lighter, it is a genuinely supported
React 16 target rather than a workaround, nodes are ordinary React components so
product design is unconstrained, and the interaction surface is plain props.
Budget for the layout — that is the real cost, it is not optional, and it is
where this POC's bugs were.

**Pick NVL** if you need thousands of nodes on screen, want layouts and
self-edges to work without writing them, or are already committed to the Neo4j
stack and can absorb 509 KB gzip plus a bundled analytics dependency. But note
that on React 16 you are using it in an unsupported configuration: the official
React wrappers cannot be installed, so you carry the wrapper yourself and get no
help from the documented React API surface.

For this POC's brief — expand-on-click, add/delete, hover card into a side panel,
on React 16 — **React Flow v9 is the better fit**, with the layout treated as a
first-class piece of code rather than an afterthought.
