# Identity graph walker

A React **16.14** POC that renders the same expandable graph two ways — **Neo4j
NVL** and **React Flow v9** — so the two can be compared on identical behaviour.

Read **[COMPARISON.md](COMPARISON.md)** for the findings.

```bash
npm install --legacy-peer-deps   # react-flow-renderer@9 peers react 16||17
npm run dev                      # http://localhost:5173
npm test                         # 13 assertions over the shared graph layer
npm run build
```

`--legacy-peer-deps` is needed because npm 11 refuses the React 16 peer graph
otherwise. React and React DOM are pinned to exact `16.14.0`, and Vite is
configured with the **classic** JSX runtime since React 16 has no automatic one.

## What it does

Switch engines with the tabs in the header. Both tabs share one graph and one
set of handlers.

1. **Click a node to expand one level.** Works at any depth, so expansion is
   recursive: level 1 → 2 → 3 → 4. Re-clicking an expanded node does nothing, and
   a second click while the first fetch is in flight cannot duplicate a level.
2. **Add / delete nodes.** From the side panel — pick a type and add a linked
   node, or delete the current one (its edges go with it, its descendants stay).
   The root is protected.
3. **Hover for a peek card**, with two actions that open the side panel on
   **Details** or **Trace**.

The peek card's centrepiece is a **degree readout**: a segmented bar showing how
many of a node's links are already on screen versus still hidden, so you know
what a click will cost before you spend it. Node brightness carries the same
meaning — a bright node still has neighbours behind it.

Keyboard/no-pointer route: the header's **Inspect** select opens any node's panel
directly, since a hover-only affordance is not reachable otherwise.

## Layout

```
src/graph/data.js      fake backend — swap fetchNeighbors() for a Cypher call
src/graph/ops.js       pure graph ops + the radial layout (all tested)
src/graph/useGraph.js  the shared interaction model: expand / add / delete
src/nvl/NvlGraph.jsx   React 16 wrapper over @neo4j-nvl/base
src/flow/FlowGraph.jsx react-flow-renderer@9 renderer + custom self-loop edge
src/ui/                HoverCard, SidePanel, theme — shared by both engines
```

Both renderers are dumb views over `useGraph`. To point this at a real Neo4j
instance, replace `fetchNeighbors(node)` in `data.js` — it is the only function
that invents data.

## Notes

- `@neo4j-nvl/react` is **not** used: no published version supports React 16.
  `@neo4j-nvl/base` is framework-free, so `NvlGraph.jsx` is the wrapper. See
  [COMPARISON.md](COMPARISON.md) §1.
- Nodes are circular in the React Flow tab and support **self-edges**
  (`source === target`), which v9's built-in edge types cannot draw.
- `MAX_DEPTH` in `data.js` caps expansion at level 4.
