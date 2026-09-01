# The ECharts rendering pipeline

How a click becomes a drawn node, file by file. Every step is also marked in
[EChartsGraph.jsx](src/echarts/EChartsGraph.jsx) as `STEP n`, so the code and this
document can be read side by side.

---

## 1. The file map

```
src/graph/data.js        the backend stand-in + the entity dictionary
src/graph/useGraph.js    the only mutable state in the app
src/App.jsx             ─┬─ owns state, renders the chrome, picks the engine
                         │
src/echarts/symbols.js  ─┤  the shape + edge-style catalog (no echarts import)
src/echarts/EChartsGraph.jsx ─── the React↔ECharts bridge. Everything below.
src/graph/ops.js         layoutRadial — ids → coordinates (called by App)
src/graph/loops.js       withLoops — self-edges → drawable links
src/ui/theme.js          nodeColor — the one place brightness is decided
```

Data flows one way. Interaction flows back up as ids only:

```
data.js → useGraph.js → App.jsx → EChartsGraph.jsx → <canvas>
              ▲                        │
              └──── onNodeClick(id) ───┘
```

### Dependencies, and what each one is for

| Import | Why it is there |
| --- | --- |
| `echarts/core` | `init` and `setOption`. The instance, nothing else. |
| `echarts/charts` → `GraphChart` | The only series type used. |
| `echarts/renderers` → `CanvasRenderer` | The paint backend. |

That is the whole of ECharts in this app. `import * as echarts from 'echarts'`
would work and costs **446 KB gzipped**; the three-module form costs **170 KB**.
The tradeoff is that anything not in the `echarts.use([...])` call is genuinely
absent — which is why the option object has no `tooltip` key at all rather than
`tooltip: { show: false }`. Naming a component you did not import logs
`Component tooltip is used but not imported` on every single chart render.

Nothing else is installed for the ECharts side. Every shape in the picker is
either a built-in symbol name or a `path://` string — **no shape library, no
icon font, no SVG assets**.

---

## 2. The data transformation, end to end

Four representations, in order. Each one is derived; only the first is stored.

### 2a. Domain model — `useGraph.js`

The only state. Holds **no visual information whatsoever**:

```js
graph = {
  nodes: [
    { id: 'ACC-4471-0', type: 'account', level: 0, name: 'acct_4471',
      risk: 74, flagged: false, firstSeen: '2025-11-02', events: 1284 }
  ],
  edges: [
    { id: 'ACC-4471-0->DEV-8123-10', source: 'ACC-4471-0',
      target: 'DEV-8123-10', label: 'SIGNED_IN_FROM' }
  ]
}
```

No `x`, no `y`, no colour, no shape, no size. That absence is the point: this is
the same object the FusionCharts tab consumes, which is what makes the
comparison honest. Expansion state lives beside it in a ref
(`id -> 'pending' | 'done'`) so a second click landing mid-fetch cannot
duplicate a level.

### 2b. Geometry — `ops.js` → `layoutRadial(graph, prev)`

```js
positions = {
  'ACC-4471-0':  { x: 0,      y: 0 },
  'DEV-8123-10': { x: 141.4,  y: -141.4 }
}
```

Root at the centre, one ring per hop, children fanned inside their parent's
wedge. Called by `App.jsx`, not by the renderer — both tabs are handed the same
object, and the renderers are remounted on every engine switch while the layout
has to remember what it placed last time.

That memory is `prev`, the previous return value fed back in. Without it every
call re-derives every angle, and because the cold pass numbers leaves in
traversal order, two new children shift the slot of every leaf after them — one
expansion re-arranges the whole graph. With it, anything already placed keeps
its exact coordinates and only the newcomers are positioned, in the free space
inside their parent's wedge.

Both behaviours are wanted, at different sizes, so `App.jsx` withholds `prev`
until the graph passes `FREEZE_AT` (30 nodes). Small graphs get the cold pass:
it is the tighter arrangement and the shuffle reads as settling. Past the
threshold the layout freezes, because a rearrangement of 60 nodes reads as a
reload. The frozen wedges cost density — measured, cold vs frozen: 1408px vs
2198px at 59 nodes, 4159px vs 8800px at 180 — and there is one visible jolt on
the expansion that crosses the threshold. Both are the accepted price.

Two things move even while frozen, deliberately. A ring widens when a new node
makes its tightest angular pair too tight to hold 76px discs — the alternative
is overlap. And Reset drops `prev` entirely.

ECharts computes this for us in exactly zero cases: the graph series ships
`force` and `circular` and nothing else, and neither keeps a hierarchy legible.
Coordinates are unitless — STEP 7 fits the bounding box to the viewport, so they
only have to be correct *relative to each other*.

### 2c. Drawable links — `loops.js` → `withLoops(graph, positions)`

A self-edge (`source === target`) is not drawable in either engine: it collapses
to a zero-length line hidden under the node's own symbol. So one self-edge is
rewritten as three ordinary links routed over two invisible pivots:

```
      a ───over (carries the label)─── b
      ↑                                │
     out                             back (arrowhead)
      │                                ↓
   ┌──────────┐
   │   node   │
   └──────────┘
```

```js
links  = [{ id, from, to, label, arrow: true, loop?: true, synthetic?: true }, …]
pivots = [{ id: 'DEV-1<->DEV-1::a', x: …, y: … }, …]
```

Pivots are **not graph nodes**. They never enter `useGraph`'s state and are
absent from App's id→node map, so a click or hover that resolves to one finds
nothing and no-ops. Worth knowing before adding an interaction that assumes
every drawn symbol is a real entity.

### 2d. ECharts option — `EChartsGraph.jsx`

One plain object. Could be `JSON.stringify`'d and posted over a wire, which is
the useful mental model: by the time `setOption` is called, nothing is left to
decide.

---

## 3. Everything required to render **one** node

This is STEP 4 in the code. One domain node in, one ECharts data item out:

```js
{
  id: 'DEV-8123-10',        // ours — used by the click handler, ignored by ECharts
  name: 'DEV-8123-10',      // ECharts matches links by NAME, not id (see below)
  x: 141.4, y: -141.4,      // from STEP 2, honoured only under layout:'none'
  symbol: 'rect',           // ← the shape. Built-in name or 'path://…'
  symbolSize: 19.4,         // ← baseSizeOf(node) × SHAPE[key].scale
  itemStyle: {
    color: '#7FD4E8',       // ENTITY[type].color, dimmed if already expanded
    borderColor: '#E5484D', // flagged only
    borderWidth: 2,
    opacity: 1              // 0.55 while its fetch is in flight
  },
  label: { formatter: '{tag|DEV}{name|Pixel 7}  {hid|+3}' }
}
```

### Where each property comes from

| Property | Derived from | Via |
| --- | --- | --- |
| `x` / `y` | graph structure | `layoutRadial` (STEP 2) |
| `symbol` | `node.type`, or `risk`, or `level` | `SHAPE_SETS[chosen].shapeOf(node)` → `SHAPE[key].symbol` |
| `symbolSize` | `node.level`, `node.flagged` | `baseSizeOf(node) × SHAPE[key].scale` |
| `itemStyle.color` | `node.type` + expansion status | `ENTITY[type].color` → `nodeColor()` |
| `itemStyle.border` | `node.flagged` | inline |
| `label` | `node.name` + hidden-neighbour count | rich-text formatter |

### Three things that bite

**`name` is the join key, not `id`.** A link's `source` and `target` are matched
against node `name`. Set `name` to a display string and every edge silently
fails to attach. So `name` carries the id, and the visible text is a `label`
formatter.

**`symbolSize` is a bounding box, not an area.** A triangle inscribed in a 22px
box covers under half the ink of a 22px circle, so at one size a triangle reads
as a *smaller node* rather than a *different node*. Hence `scale` per shape in
[symbols.js](src/echarts/symbols.js) — it pushes the box out until the shapes
look like siblings. `sizeOf()` is the single function both the symbol (STEP 4)
and the pulse ring (STEP 8) call, because if they disagree the ring floats off
the star.

**Badges do not exist.** A graph node has no overlay, badge or decorator hook of
any kind. The `+3` chip is a rich-text run (`{hid|…}`) inside the node's own
label — that is why `RICH` defines a `hid` style with a background and border
radius, and why it is declared once at series level and inherited.

---

## 4. The eight steps

| Step | What happens | Where |
| --- | --- | --- |
| **0** | `echarts.init` on the empty div, bind every listener once, start the `ResizeObserver` | setup effect |
| **1** | Read `graph` — domain shape, no visuals | data effect |
| **2** | Read the `positions` prop — `layoutRadial` ran in App | `ops.js` |
| **3** | `withLoops` → links + pivots | `loops.js` |
| **4** | Build one data item per node — **shape resolves here** | `build()` |
| **5** | Build one link per drawable edge — **line style resolves here** | `buildLinks()` |
| **6** | Assemble the option object | `option()` |
| **7** | `setOption(…, { replaceMerge: ['series'] })` — ECharts diffs, tweens, fits, paints | — |
| **8** | Re-place the CSS pulse rings over the fresh canvas | `place.current()` |

### Why STEP 0 is a separate effect

An instance re-created on every data change throws away roam state, so the graph
snaps back to centre whenever a level is added. Re-binding listeners on the same
instance is how you end up firing a click handler five times. So: one effect that
runs once and owns the instance, one that runs on data and owns the option.

Handlers arrive as new function identities on most renders, so they are routed
through a ref rather than a dependency — picking up a new callback must not cost
a chart teardown.

### Why `replaceMerge`, and why the series needs an `id`

A plain merge leaves a deleted node's symbol and label painted on the canvas.
`replaceMerge` drops any series that is no longer in the option.

It only replaces what it **cannot match**, and it matches components by `id`.
A series without one can never match, so it was replaced on every single push:
the component was destroyed, a new one built, and every node on screen entered
from nothing at the default 1-second enter duration. That is what made an
expansion look like the graph reloading. With `id: 'graph'` the same component
survives, ECharts diffs into it — data items matched **by name** — and only the
new nodes are created.

Two more keys are part of the same fix:

- **`zoom` goes on the first push only.** Roam writes the analyst's pan and zoom
  back onto this same series model, so re-sending `zoom` overwrites them and the
  view snaps back to fit on every click. The key has to be *absent*, not
  `undefined` — the merge copies an explicit undefined over the stored value and
  the zoom falls back to 1.
- **`animationDuration`** is what entering nodes use, not `animationDurationUpdate`.
  Left at its 1-second default, a new level arrives long after everything else
  has settled.

One thing still moves and is meant to: ECharts recomputes the graph's bounding
box from the data on every render, so a new outer ring rescales the fit. That is
what keeps newly expanded nodes on screen.

### STEP 8, and why the pulse is not in the chart

ECharts has no looping per-node animation. `emphasis` is hover-driven, and the
ripple `effectScatter` offers is not available to a graph series. The previous
approach re-pushed the option on a timer, which cost a full series teardown
twice a second — a permanently-animating canvas, roam state discarded on every
beat, and the graph visibly blanking as it re-entered.

So the rings are DOM elements over the canvas, animated by CSS. The browser runs
the animation and ECharts never redraws. The price is that a DOM ring does not
ride roam for free, so positions are re-read whenever the chart moves — which is
what the single `instance.on('finished', …)` listener covers: pan, zoom, resize
and new-level all end in a render.

Converting graph space to pixels there has no public API. `convertToPixel` only
knows registered coordinate systems and a graph's view is not one, so STEP 8
reaches for `series.coordinateSystem` and calls `dataToPoint` on it.

Sizing a ring is a separate question from placing it, and the obvious answer is
wrong. Measuring pixels-per-unit off two `dataToPoint` calls includes the fit —
ECharts scales the whole graph to the series rect — and a node symbol is
deliberately exempt from it: `calcCompensationScaleToPreserveNodeSize` divides
the fit back out so a symbol holds its pixel size at any graph size. On the
opening one-node graph the fit is a few hundred ×, because the data extent is a
single point that ECharts pads to two units and stretches across the canvas, and
the ring came out thousands of pixels wide. What a symbol *does* scale with is
the roam zoom, damped by `nodeScaleRatio` (0.6). STEP 8 does the same
arithmetic — `(roam - 1) × 0.6 + 1`, with `roam` read off
`view.getRoamTransform()[0]` and defaulted to 1 if that accessor ever moves.

---

## 5. The customization catalog

All of it lives in [src/echarts/symbols.js](src/echarts/symbols.js), which
imports nothing — the whole file is strings and numbers the graph series accepts
as-is. Adding a shape never touches the renderer.

### Node shapes

Eleven shapes. Seven are ECharts built-ins; five are hand-written SVG paths in a
0–100 coordinate space, which ECharts reads the bounding box of and scales to
`symbolSize`. A path symbol costs nothing extra — ZRender treats it as one more
path in the same display list.

| | Shapes |
| --- | --- |
| Built-in | `circle` · `rect` (square) · `roundRect` · `triangle` · `diamond` · `pin` · `arrow` |
| `path://` | hexagon · star · shield · cross · chip |

### Shape sets — the **Nodes** picker

| Set | What shape encodes |
| --- | --- |
| Shape per entity type | account ○ · device ■ · phone ▢ · email ◆ · ip ▲ · card 📍 |
| All circles | nothing — colour does all the work |
| Custom SVG paths | the same six types, drawn entirely with `path://` symbols |
| Shape per risk band | flagged ★ · risk > 55 ▲ · rest ▢ |
| Shape per hop distance | one shape per ring out from the root |

The per-type set is the one worth shipping by default: shape carries the type,
so the graph survives being printed, screenshotted, or read by someone who
cannot separate the six palette hues.

### Edge styles

Each style supplies `lineStyle` (width, dash pattern, cap, opacity), the
`[tail, head]` symbol pair, and `curveness`.

| Style | Recipe |
| --- | --- |
| Solid, arrowhead | 1.4px solid, head only |
| Dashed | `type: [7, 5]` |
| Dotted | `type: [1, 4]` with a round cap |
| Curved | `curveness: 0.22` — separates the two edges of a reciprocal pair |
| Thick, socketed | 3.2px at 50% opacity, dot tail **and** arrow head |
| Hairline, no arrows | 1px, undirected |

### Styling one edge and not the others

A graph series has **no global edge style to begin with**. `series.links` is a
list, and each entry carries its own `lineStyle`, `symbol` pair and `curveness`.
So per-edge styling is the native case, and making every edge look the same is
the part that costs an extra step. Three sources feed one link, in order of
increasing specificity — STEP 5 resolves them top to bottom:

| | Source | Scope |
| --- | --- | --- |
| 1 | `EDGE_RULES[picked].styleOf(link, ctx)` | flat, or derived per edge |
| 2 | `edgeOverrides.get(edgeId)` | one edge the analyst clicked |
| 3 | colour, and a loop's bow | decided in the renderer, never overridable |

**The rules** are the last four entries in the **Edges** picker. Each is a
function of the link, so it can key off anything the flattened link knows:

| Rule | Derives style from |
| --- | --- |
| by edge origin | backend result vs. analyst-drawn vs. self-referring |
| by relationship | the relationship name — `SHARED_BY` loud, `SEEN_ON` dotted, … |
| by hop distance | `ctx.level`, so lines thin out away from the root |

`ctx` exists because a link does not know its own depth. It carries
`{ level }` — the hop distance of the node the edge leaves from, or **-1** for a
loop's pivot legs, which leave a pivot rather than a node. -1 rather than 0,
since 0 means "the root".

**The overrides** are per-edge and beat the rule: click any edge and it walks
through the six styles, then off the end back under the picker's control. A
counter button appears in the strip once there is something to clear. This needs
no new UI because an edge click was previously inert — the node handler filters
on `dataType: 'node'`, and the background handler needs a *null* target, so an
edge click reached nobody.

Two details that are load-bearing:

- **The override key is not the link id.** STEP 3 splits one self-edge into
  `…#out`, `…#over` and `…#back`, so the key drops the `#suffix` and all three
  legs restyle together. Without it a loop comes apart into a dotted arc and two
  solid stubs.
- **It is `edgeId`, not `id`.** ECharts uses a data item's `id` to match items
  across a `setOption`, and three loop legs sharing one would collapse them.

A headless style (hairline, no arrows) is also patched for loops only: a loop
with no arrowhead is an arc floating over a node with nothing to say which end it
returns to, so the closing segment borrows a head.

**Colour is deliberately not part of a style.** It carries meaning — cyan for a
self-loop, green for analyst-added, grey for ordinary — and gets assigned in
STEP 5 where that meaning is known. Neither a preset nor a click may overwrite
it.

Two limits worth knowing before asking for them:

- **Dashes use number pairs, not `'dashed'`.** The keyword derives dash length
  from line width, and at 1.4px that is too fine to read as dashed at all.
- **A graph edge cannot carry a travelling pulse.** That is the `lines` series'
  `effect`, and it needs its own coordinate system. Dash offset is not animatable
  per link either — a "flowing" edge means a second series drawn on top.

A loop's own `curveness: 0.16` overrides whatever the preset asks for. The three
segments drawn straight read as a triangle rather than a loop, and a preset about
ordinary relationships would flatten it back.

The picker is **ECharts-only**. FusionCharts' dragnode chart draws one node shape,
full stop, so rendering the control on that tab would be a control that does
nothing.
