# TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate this eight-engine graph bake-off from JavaScript to strict TypeScript, upgrade the runtime to Node 24 LTS / React 19 / Vite 8, and restructure engine configuration so each library's manifest lives beside its adapter.

**Architecture:** Eight graph libraries render one shared graph through one uniform adapter contract. Today that contract is a doc comment and all eight manifests sit in a single `engines.js`. After this plan the contract is a TypeScript interface the compiler enforces, and each library owns an `engine.ts` next to its adapter, collected by an explicit barrel that preserves literal key types.

**Tech Stack:** Node 24.20.0 LTS · React 19.2.8 · Vite 8.2.2 · TypeScript 6.0.3 · Vitest 4.1.11 · ESLint 10.9.1 + typescript-eslint 8.69.0 · Prettier 3.9.6

**Spec:** `docs/superpowers/specs/2026-09-02-ts-migration-design.md`

## Global Constraints

- Branch: `ts-migration`. One commit per task. `npm test` green at every commit.
- Node **24.20.0** LTS ("Krypton"). React and ReactDOM **19.2.8**. Vite **8.2.2**. `@vitejs/plugin-react` **6.1.1**. TypeScript **6.0.3** — *not* 7.x, because `typescript-eslint@8.69.0` peers `typescript >=4.8.4 <6.1.0`. Vitest **4.1.11**. ESLint **10.9.1**. Prettier **3.9.6**. `@types/react` **19.2.18**, `@types/react-dom` **19.2.5**.
- House code style, which Prettier must be configured to preserve: **single quotes, no semicolons, 100 columns, 2-space indent, no trailing commas**. The migration diff must be about types, not punctuation.
- **No behaviour changes.** If `tsc` surfaces a genuine bug, fix it in its own commit with a message starting `fix:` and note it in the task's completion report. Do not fold behaviour fixes into mechanical phases.
- **Preserve every existing comment.** This codebase's comments explain non-obvious library behaviour and are the most valuable thing in it. Moving a function to TypeScript means moving its comment too. Where a comment becomes wrong (React 16 references, the NVL wrapper rationale), rewrite it rather than deleting it.
- TS compiler options, fixed for the whole migration: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noFallthroughCasesInSwitch`, `jsx: "react-jsx"`, `moduleResolution: "bundler"`, `verbatimModuleSyntax`, `target: "ES2022"`.
- Never use `any` to clear an error. Use `unknown` plus a narrowing check, or a local `.d.ts` shim scoped to the engine folder that needs it. If you genuinely cannot type something, use `// @ts-expect-error` with a one-line reason — that at least fails loudly when the upstream types improve.

---

## Task 1: Upgrade Node, React, and Vite — still JavaScript

The riskiest change in the plan, deliberately isolated from TypeScript so a failure has one possible cause. Nothing becomes `.ts` here.

**Files:**
- Create: `.nvmrc`
- Modify: `package.json`, `vite.config.js`, `src/main.jsx`, `src/graph/useGraph.js:2,31-36`

**Interfaces:**
- Consumes: nothing.
- Produces: a React 19 app on Vite 8. Task 3 and Task 4 rewrite the two adapters this task knowingly leaves broken.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b ts-migration
```

- [ ] **Step 2: Pin Node**

Create `.nvmrc`:

```
24.20.0
```

Add to `package.json`, after `"version"`:

```json
  "engines": { "node": ">=24.20.0" },
```

- [ ] **Step 3: Confirm the local Node satisfies it**

Run: `node --version`
Expected: `v24.20.0` or newer. If not, install it (`nvm install 24.20.0 && nvm use`) before continuing — Vite 8 requires `^20.19.0 || >=22.12.0` and the rest of this plan assumes 24.

- [ ] **Step 4: Install the new runtime**

```bash
npm install react@19.2.8 react-dom@19.2.8
npm install -D vite@8.2.2 @vitejs/plugin-react@6.1.1
```

- [ ] **Step 5: Drop the classic JSX runtime**

React 19 has an automatic JSX runtime; the classic transform was only there for React 16. Replace `vite.config.js` entirely:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
})
```

- [ ] **Step 6: Switch the entry point to createRoot**

`ReactDOM.render` was removed in React 19. Replace `src/main.jsx` entirely:

```jsx
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const host = document.getElementById('root')
if (!host) throw new Error('index.html is missing #root')
createRoot(host).render(<App />)
```

- [ ] **Step 7: Delete the unstable_batchedUpdates workaround**

React 18+ batches automatically, so the wrapper is dead weight. In `src/graph/useGraph.js`, delete the import on line 2 and unwrap the call. The `expand` callback becomes:

```js
  const expand = useCallback(node => {
    if (!node || status.current.has(node.id)) return
    status.current.set(node.id, 'pending')
    publish()
    fetchNeighbors(node).then(incoming => {
      // React 18+ batches these automatically; before 19 this needed
      // unstable_batchedUpdates or the graph re-rendered and re-laid-out twice.
      status.current.set(node.id, 'done')
      setGraph(g => mergeGraph(g, incoming))
      publish()
    })
  }, [])
```

- [ ] **Step 8: Run the tests**

Run: `npm test`
Expected: 50 assertions pass. These cover the pure graph layer, which this task does not touch — a failure here means something broke that should not have.

- [ ] **Step 9: Commit**

```bash
git add .nvmrc package.json package-lock.json vite.config.js src/main.jsx src/graph/useGraph.js
git commit -m "build: Node 24.20 LTS, React 19.2.8, Vite 8.2.2

Automatic JSX runtime replaces the classic transform, createRoot
replaces ReactDOM.render, and unstable_batchedUpdates is dropped now
that React batches promise callbacks on its own.

The React Flow and NVL panes are knowingly broken by this commit and
are repaired in the two that follow."
```

---

## Task 2: Verify the six React-agnostic panes still render

A checkpoint, not a code change. Six of the eight libraries are vanilla JS or Vue and should be indifferent to React 19; confirming that before touching the other two keeps the blast radius legible.

**Files:** none modified.

**Interfaces:**
- Consumes: Task 1's upgraded runtime.
- Produces: a known-good baseline for Tasks 3 and 4.

- [ ] **Step 1: Clean install without the legacy flag**

```bash
rm -rf node_modules package-lock.json
npm install
```

Expected: install succeeds with no `--legacy-peer-deps`. That flag existed only for React 16's peer graph. If it still fails, read the peer error — it will name whichever library is the holdout, and that finding belongs in the task report.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`

- [ ] **Step 3: Check each of the six panes by hand**

Open `http://localhost:5173`. Toggle each of `echarts`, `fusion`, `cytoscape`, `vis`, `vng`, `jsplumb` on one at a time. For each, confirm: nodes draw, clicking a node expands it, the pane header's `ms` readout updates.

Record any pane that misbehaves in the task report. Do **not** fix it here unless it is a one-line React 19 API removal — a real regression deserves its own commit.

- [ ] **Step 4: Confirm the two expected failures**

Toggle `flow` and `nvl`. Both are expected to fail — React Flow v9 cannot mount on React 19, and NVL is about to be replaced. Note the actual error text; it is useful context for the next two tasks.

- [ ] **Step 5: Commit only if something needed fixing**

If all six were clean, there is nothing to commit — say so and move on. If a one-line fix was needed:

```bash
git add -A && git commit -m "fix: <pane> under React 19 — <what changed>"
```

---

## Task 3: Port the React Flow pane to @xyflow/react v12

`react-flow-renderer` is abandoned — its final release is 10.3.17 from 2022, peering `react 16 || 17 || 18`. This is a rewrite against the maintained successor, not a version bump.

**Files:**
- Modify: `src/flow/FlowGraph.jsx` (full rewrite), `package.json`
- Check: `src/styles.css` for `.flow-node` and `.react-flow__*` rules

**Interfaces:**
- Consumes: `ENTITY` from `../graph/data.js`; `isSelfEdge` from `../graph/ops.js`; `BONE, FLARE, INK, mix, nodeColor` from `../ui/theme.js`; `useResize` from `../ui/useResize.js`.
- Produces: default export `FlowGraph`, accepting the same twelve props as every other adapter and calling `onViewport({ zoomBy, panBy, fit })` on mount and `onViewport(null)` on unmount. Task 9 registers it; Task 12 types it.

- [ ] **Step 1: Swap the dependency**

```bash
npm uninstall react-flow-renderer
npm install @xyflow/react@12.11.6
```

- [ ] **Step 2: Note the API changes you are porting across**

Read these before writing code; each one is a real difference:

| v9 | v12 |
|---|---|
| `import ReactFlow from 'react-flow-renderer'` | `import { ReactFlow } from '@xyflow/react'` |
| no stylesheet import | `import '@xyflow/react/dist/style.css'` **required** |
| one `elements` prop | separate `nodes` and `edges` props |
| `useZoomPanHelper()` → `{ fitView, transform }` | `useReactFlow()` → `{ fitView, setViewport, getViewport }` |
| `useStoreState(s => s.transform)` to read the viewport | `getViewport()` — the mirror ref is no longer needed |
| `arrowHeadType: 'arrowclosed'` | `markerEnd: { type: MarkerType.ArrowClosed }` |
| no `onEdgeClick`; sort with `isEdge` in `onElementClick` | `onEdgeClick` is a first-class prop |
| node click bound inside the custom node to dodge `onDragStop` | `onNodeClick` no longer fires after a drag; use the prop |

The last two let you delete the per-node closures in `data` entirely, which also stops every node object being rebuilt whenever a handler identity changes.

- [ ] **Step 3: Rewrite the file**

Replace `src/flow/FlowGraph.jsx` entirely. Keep the header comment's content — update the version references and delete the two v9-specific traps that no longer apply.

```jsx
import { useCallback, useEffect, useMemo, useRef } from 'react'
import React from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  MarkerType,
  EdgeText,
  useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ENTITY } from '../graph/data.js'
import { isSelfEdge } from '../graph/ops.js'
import { BONE, FLARE, INK, mix, nodeColor } from '../ui/theme.js'
import { useResize } from '../ui/useResize.js'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE REACT FLOW v12 RENDERER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The only engine here where a node is a **real React component**. The discs
 * below are HTML and CSS — the risk number, the `+N` hidden badge, the flagged
 * glow are ordinary markup, and anything the design team can draw, a node can
 * be. Every canvas engine in this comparison would need custom drawing code for
 * the same result.
 *
 * ── The catch: no layout engine at all ─────────────────────────────────────
 * Not "weak layouts" — none. Nodes render exactly where you put them. A graph
 * that grows by expansion therefore needs a layout you write and maintain, and
 * that is the origin of `layoutRadial` in `graph/ops.js`: ~90 lines plus its
 * tests that exist solely because of this engine. Budget for it; it is not
 * optional.
 *
 * ── Traps this file is shaped around ───────────────────────────────────────
 * - `nodeTypes` / `edgeTypes` must be **module-level constants**. A fresh
 *   object identity on each render rebuilds every node and edge.
 * - Inline `width`/`height` on a node makes the renderer skip measuring the
 *   DOM. Nodes are sized from CSS so it can measure them.
 * - `deleteKeyCode` defaults to Backspace deleting the selection. Deletion here
 *   is an explicit side-panel action, so it is disabled.
 * - `smoothstep` drops every edge onto one horizontal band and stacks the
 *   labels; `straight` spreads them.
 * - Self-edges still cannot be drawn by any built-in type: source and target
 *   resolve to the same handle coordinates and the curve collapses. Hence the
 *   explicit cubic arc in `SelfLoopEdge`.
 */

const EDGE = '#2F3746'
const LOOP = '#7FD4E8'

/** Node visuals as a React component — the thing this engine is here for. */
function DiscNode({ data }) {
  return (
    <div
      className={'flow-node' + (data.flagged ? ' is-flagged' : '')}
      style={{ '--disc': data.color, '--ring': data.border, opacity: data.pending ? 0.55 : 1 }}
    >
      {/* Every edge endpoint resolves through a Handle. Both are hidden and sit
          at the disc's centre, so edges leave from the middle of the node the
          way they do on the canvas panes. */}
      <Handle type="target" position={Position.Left} className="flow-node__handle" />
      <Handle type="source" position={Position.Right} className="flow-node__handle" />
      <span className="flow-node__risk">{data.risk}</span>
      {data.behind > 0 && <span className="flow-node__badge">+{data.behind}</span>}
      <span className="flow-node__label">{data.label}</span>
    </div>
  )
}

/**
 * Self-edges, which no built-in edge type can draw: both endpoints resolve to
 * the same coordinates and there is no curve left. So the loop is an explicit
 * cubic arc out to the right and back.
 *
 * The label is pushed clear of the disc rather than sat at the midpoint — nodes
 * paint above edges, so a closer label has its first half hidden behind the
 * circle.
 */
function SelfLoopEdge({ id, sourceX, sourceY, style, data }) {
  const reach = 62
  const path =
    `M ${sourceX},${sourceY} C ${sourceX + reach},${sourceY - reach} ` +
    `${sourceX + reach},${sourceY + reach} ${sourceX},${sourceY}`
  return (
    <>
      <path id={id} d={path} className="react-flow__edge-path" style={style} fill="none" />
      {data && data.label && (
        <EdgeText x={sourceX + reach + 6} y={sourceY} label={data.label} labelBgPadding={[2, 1]} />
      )}
    </>
  )
}

// Module-level, for the reason in the header: a fresh identity here rebuilds
// every node and edge on every render.
const NODE_TYPES = { disc: DiscNode }
const EDGE_TYPES = { selfloop: SelfLoopEdge }

// `maxZoom` is the important half. A one-node graph has a bounding box the size
// of one disc, and an uncapped fit scales it to the pane — the root fills the
// whole thing. Panning by hand can still reach zoom 4; this caps only what an
// automatic fit may do, matching the other panes' 1:1 rule.
const FIT = { padding: 0.15, maxZoom: 1 }

function FlowCanvas({
  graph, positions, hidden, isExpanded, isPending, statusVersion,
  onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick, onStat, onViewport
}) {
  const { fitView, setViewport, getViewport } = useReactFlow()
  const fitted = useRef(-1)
  const frame = useRef(null)

  const handlers = useRef({})
  handlers.current = { onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick }

  // How long the last element build took, written during the memo and reported
  // from an effect. `onStat` sets state in App, and doing that from inside a
  // useMemo is a state update during another component's render.
  const cost = useRef(0)

  const nodes = useMemo(() => {
    const started = performance.now()
    const built = graph.nodes
      .filter(n => positions[n.id])
      .map(node => {
        const meta = ENTITY[node.type]
        const pending = isPending(node.id)
        return {
          id: node.id,
          type: 'disc',
          position: positions[node.id],
          data: {
            label: `${meta.tag} ${node.name}`,
            risk: node.risk,
            behind: hidden.get(node.id) || 0,
            flagged: !!node.flagged,
            pending,
            color: nodeColor(meta.color, { explored: isExpanded(node.id), pending }),
            border: node.flagged ? FLARE : mix(meta.color, INK, 0.4)
          }
        }
      })
    cost.current = Math.round(performance.now() - started)
    return built
    // statusVersion is in here because expansion status lives in a ref: without
    // it, a node finishing its fetch would not change any value this reads.
  }, [graph, positions, hidden, statusVersion, isExpanded, isPending])

  const edges = useMemo(
    () =>
      graph.edges.map(edge => {
        const loop = isSelfEdge(edge)
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: loop ? 'selfloop' : 'straight',
          label: loop ? undefined : edge.label,
          data: loop ? { label: edge.label } : undefined,
          markerEnd: loop ? undefined : { type: MarkerType.ArrowClosed },
          style: { stroke: loop ? LOOP : EDGE, strokeWidth: 1 },
          labelStyle: { fill: '#6B7385', fontSize: 8 },
          labelBgStyle: { fill: INK, fillOpacity: 0.8 }
        }
      }),
    [graph.edges]
  )

  useEffect(() => {
    if (onStat) onStat(cost.current)
  }, [nodes, onStat])

  useEffect(() => {
    if (fitted.current === graph.nodes.length) return
    fitted.current = graph.nodes.length
    // After paint: fitView measures rendered nodes, and on the frame the
    // elements change they have no size yet.
    const id = requestAnimationFrame(() => fitView(FIT))
    return () => cancelAnimationFrame(id)
  }, [graph.nodes.length, fitView])

  // This pane is a lazily-loaded chunk mounted into a grid cell, so the first
  // fitView above can measure a box that has not been laid out — which parks
  // the graph in a corner. Re-fit on the first real measurement.
  useResize(frame, () => fitView(FIT))

  // The benchmark's handle. Zooming about the pane's centre rather than the
  // origin, the same correction the canvas panes need: setViewport writes the
  // top-left offset directly, so the pan is worked out by hand. v12's
  // getViewport() means there is no need to mirror store state into a ref.
  useEffect(() => {
    if (!onViewport) return undefined
    onViewport({
      zoomBy: factor => {
        const { x, y, zoom } = getViewport()
        const box = frame.current
          ? frame.current.getBoundingClientRect()
          : { width: 0, height: 0 }
        const cx = box.width / 2
        const cy = box.height / 2
        setViewport({ x: cx - (cx - x) * factor, y: cy - (cy - y) * factor, zoom: zoom * factor })
      },
      panBy: (dx, dy) => {
        const { x, y, zoom } = getViewport()
        setViewport({ x: x + dx, y: y + dy, zoom })
      },
      fit: () => fitView(FIT)
    })
    return () => onViewport(null)
  }, [onViewport, setViewport, getViewport, fitView])

  // v12 gives node and edge clicks their own props, and a node click no longer
  // fires at the end of a drag — so the v9 workaround of binding the click
  // inside the custom node is gone, along with the per-node closures it needed.
  const handleNodeClick = useCallback((_, node) => handlers.current.onNodeClick(node.id), [])
  const handleEdgeClick = useCallback((_, edge) => handlers.current.onEdgeClick(edge.id), [])
  const handleNodeEnter = useCallback(
    (event, node) => handlers.current.onNodeHover(node.id, { x: event.clientX, y: event.clientY }),
    []
  )
  const handleNodeLeave = useCallback(() => handlers.current.onNodeHover(null, null), [])
  const handlePaneClick = useCallback(() => handlers.current.onBackgroundClick(), [])

  return (
    <div className="canvas" ref={frame}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onNodeMouseEnter={handleNodeEnter}
        onNodeMouseLeave={handleNodeLeave}
        onPaneClick={handlePaneClick}
        // Backspace would otherwise delete the selection; deletion is the side
        // panel's job, against state every pane shares.
        deleteKeyCode={null}
        nodesConnectable={false}
        selectNodesOnDrag={false}
        // One DOM subtree per node. Culling what is off-screen is the only thing
        // that keeps a few thousand nodes interactive at all — and it is still,
        // by a distance, the heaviest pane at that size.
        onlyRenderVisibleElements
        minZoom={0.02}
        maxZoom={4}
        proOptions={{ hideAttribution: false }}
      />
    </div>
  )
}

const Memoised = React.memo(FlowCanvas)

// `useReactFlow` only works inside a provider, and the provider has to sit
// outside the component that uses it.
export default function FlowGraph(props) {
  return (
    <ReactFlowProvider>
      <Memoised {...props} />
    </ReactFlowProvider>
  )
}
```

- [ ] **Step 4: Check the stylesheet still matches**

Run: `node -e "const s=require('fs').readFileSync('src/styles.css','utf8'); ['flow-node','react-flow__'].forEach(k=>console.log(k, s.split(k).length-1))"`

Both counts should be non-zero. v12 renamed some internal classes; if the pane renders unstyled, the `.react-flow__*` selectors in `styles.css` are the place to look. Fix any that no longer match and note the change.

- [ ] **Step 5: Verify in the browser**

Run: `npm run dev`, open `#/lab/flow`.
Expected: discs render at the shared radial coordinates, clicking a node expands it, clicking an edge cycles its style, dragging a node does **not** expand it, self-loops draw as arcs to the right with labels clear of the disc, and the zoom/pan buttons in the lab move the viewport.

- [ ] **Step 6: Run the tests**

Run: `npm test`
Expected: 50 pass. Nothing here touches the graph layer, but `layoutRadial` exists for this engine so a regression would be meaningful.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/flow/FlowGraph.jsx src/styles.css
git commit -m "feat: port the React Flow pane to @xyflow/react v12

react-flow-renderer's last release is from 2022 and peers react
16 || 17 || 18, so it cannot run on 19. v12 splits elements into
nodes/edges, replaces useZoomPanHelper with useReactFlow, and gives
node and edge clicks their own props.

That last change lets the per-node handler closures go: v9 fired
onElementClick from react-draggable's onDragStop, which is why the
click was bound inside the custom node. v12 does not, so the node
data is now plain values."
```

---

## Task 4: Replace the hand-written NVL wrapper with @neo4j-nvl/react

`src/nvl/NvlGraph.jsx` is 226 lines of hand-rolled lifecycle, and its own header comment records why: `@neo4j-nvl/react` could not install on React 16. On React 19 it can — version 1.2.1 peers `react: 18.0.0 || ^19.0.0` and carries no hard React dependency.

**Files:**
- Modify: `src/nvl/NvlGraph.jsx` (full rewrite), `package.json`
- Possibly create: `src/nvl/nvl-react.d.ts`

**Interfaces:**
- Consumes: `ENTITY` from `../graph/data.js`; `isSelfEdge` from `../graph/ops.js`; `INK, nodeColor` from `../ui/theme.js`.
- Produces: default export `NvlGraph` with the same twelve-prop contract, including `onViewport`.

- [ ] **Step 1: Install the official wrapper**

```bash
npm install @neo4j-nvl/react@1.2.1
```

- [ ] **Step 2: Check whether it ships types**

Run: `node -e "const p='node_modules/@neo4j-nvl/react'; const j=require('./'+p+'/package.json'); console.log('types field:', j.types||j.typings||'NONE'); console.log(require('fs').readdirSync(p+'/lib').filter(f=>f.endsWith('.d.ts')).slice(0,10))"`

The published `package.json` declares no `types` field. If the `lib/` listing shows `.d.ts` files, TypeScript will find them via `main` and no shim is needed. If it shows none, create `src/nvl/nvl-react.d.ts` in step 4 — the plan assumes you check rather than guess.

- [ ] **Step 3: Read the wrapper's actual surface**

Run: `node -e "console.log(Object.keys(require('./node_modules/@neo4j-nvl/react/lib/index.js')))"`

Expected exports include `InteractiveNvlWrapper` and `BasicNvlWrapper`. `InteractiveNvlWrapper` is the one to use: it takes `nodes`, `rels`, `nvlOptions`, `mouseEventCallbacks`, and a `ref` exposing the underlying NVL instance. Confirm the names before writing against them; if they differ, use what is actually exported and note the difference.

- [ ] **Step 4: Add the type shim only if step 2 said none**

```ts
// src/nvl/nvl-react.d.ts
//
// @neo4j-nvl/react 1.2.1 publishes no `types` field. This declares only the
// surface this pane uses; delete the file if a later release ships its own.
declare module '@neo4j-nvl/react' {
  import type { ComponentType, Ref } from 'react'
  import type { NVL, Node as NvlNode, Relationship as NvlRel } from '@neo4j-nvl/base'

  export interface InteractiveNvlWrapperProps {
    nodes: NvlNode[]
    rels: NvlRel[]
    nvlOptions?: Record<string, unknown>
    nvlCallbacks?: Record<string, unknown>
    mouseEventCallbacks?: Record<string, unknown>
    ref?: Ref<{ nvl: NVL } | null>
    className?: string
  }

  export const InteractiveNvlWrapper: ComponentType<InteractiveNvlWrapperProps>
  export const BasicNvlWrapper: ComponentType<InteractiveNvlWrapperProps>
}
```

- [ ] **Step 5: Rewrite the pane**

Replace `src/nvl/NvlGraph.jsx`. The node and relationship mapping is unchanged from the current file — copy it across verbatim, including its comments about `pinned`, the caption format, and why flagged nodes borrow the selection ring. What goes away is the manual lifecycle: `new NVL(...)`, the five interaction-handler constructions, `updateCallback`, the `present` ref that diffed removals by id, and the `destroy()` cascade.

Keep these, which the wrapper does not do for you:

- the `hoveredId` dedupe — `onHover` still fires on every mousemove
- the debounced `refit`, because NVL animates elements into place and a fit measured mid-animation measures a moving box
- `fitted` tracking so an expansion refits but a recolour does not
- the `onViewport` handle, now driven through the wrapper's ref: `ref.current.nvl.setZoom(...)`, `.getScale()`, `.getPan()`, `.setPan(...)`, `.fit(ids)`

Rewrite the header comment. The current one opens by explaining that the React package cannot be installed; that is now false and must not survive as a stale rationale. Replace it with what the pane costs and gives — the ~509 KB gzipped, the bundled `@segment/analytics-next`, native self-edges, automatic LOD, and the fact that `FreeLayoutType` plus explicit coordinates is what makes it comparable to the other seven.

- [ ] **Step 6: Verify in the browser**

Run: `npm run dev`, open `#/lab/nvl`.
Expected: nodes draw at the shared coordinates and stay pinned when dragged, captions render on the canvas backend, clicking expands, hovering shows the card without thrashing, self-loops draw natively, and switching the renderer knob to `webgl` remounts the pane and drops captions.

- [ ] **Step 7: Run the tests and commit**

Run: `npm test` → 50 pass.

```bash
git add package.json package-lock.json src/nvl/
git commit -m "feat: use @neo4j-nvl/react instead of the hand-written wrapper

The wrapper existed because @neo4j-nvl/react could not install on
React 16 — every version peers react 18 || ^19. On 19 it installs
cleanly and carries no hard React dependency, so ~226 lines of
hand-owned lifecycle (instance construction, five interaction
handlers, id-diffed removals, the destroy cascade) go away.

This changes what the NVL row measures: Neo4j's render path rather
than ours. README notes it in the final task."
```

---

## Task 5: Install the TypeScript, Vitest, ESLint and Prettier harness

Tooling only. No `.ts` files yet — this task proves the harness runs green over the existing JavaScript before anything is converted.

**Files:**
- Create: `tsconfig.json`, `eslint.config.js`, `.prettierrc.json`, `.prettierignore`
- Modify: `package.json`, `vite.config.js`, all 4 `*.test.js` files

**Interfaces:**
- Consumes: Task 1's toolchain.
- Produces: `npm run check` = `tsc --noEmit && eslint . && vitest run`. Every later task ends by running it.

- [ ] **Step 1: Install**

```bash
npm install -D typescript@6.0.3 @types/react@19.2.18 @types/react-dom@19.2.5 \
  @types/node @types/d3-force \
  vitest@4.1.11 \
  eslint@10.9.1 typescript-eslint@8.69.0 eslint-plugin-react-hooks@7.1.1 \
  prettier@3.9.6
```

- [ ] **Step 2: Create tsconfig.json**

`allowJs` with `checkJs: false` lets the tree stay mixed while phases 3–7 convert it file by file.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "types": ["vite/client"],

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true,

    "allowJs": true,
    "checkJs": false,
    "noEmit": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": true
  },
  "include": ["src", "vite.config.ts", "eslint.config.js"]
}
```

- [ ] **Step 3: Create .prettierrc.json matching the house style**

The existing code uses single quotes and no semicolons. Getting this wrong turns every migrated file into an unreviewable whitespace diff.

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "none",
  "arrowParens": "avoid"
}
```

And `.prettierignore`:

```
dist
node_modules
.sizeout
.sizeprobe
graphify-out
package-lock.json
*.md
```

- [ ] **Step 4: Verify Prettier agrees with the existing code**

Run: `npx prettier --check "src/**/*.{js,jsx}"`

Expected: most files pass. Some will not — that is fine, but **read the diff** on two or three (`npx prettier src/route.js | diff src/route.js -`) and confirm the changes are trivial reflowing, not a style the codebase deliberately avoids. If Prettier wants to restructure the code meaningfully, adjust the config rather than the code.

- [ ] **Step 5: Format the tree in one isolated commit**

Doing this now, before any conversion, keeps formatting churn out of every later diff.

```bash
npx prettier --write "src/**/*.{js,jsx,css}" "*.js"
npm test   # 50 pass — formatting must not change behaviour
git add -A
git commit -m "style: apply Prettier (single quotes, no semicolons, 100 cols)

Formatting-only, done before the migration so later diffs are about
types rather than whitespace."
```

- [ ] **Step 6: Create eslint.config.js**

`exhaustive-deps` is a warning, not an error: this codebase has roughly fifteen deliberate mount-only effects, and each one gets an explicit disable comment as its file is migrated. Making it an error now would block every task.

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.sizeout', '.sizeprobe', 'graphify-out', '.bench-drivers'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      ecmaVersion: 2022,
      globals: { window: 'readonly', document: 'readonly', performance: 'readonly',
                 localStorage: 'readonly', requestAnimationFrame: 'readonly',
                 cancelAnimationFrame: 'readonly', setTimeout: 'readonly',
                 clearTimeout: 'readonly', ResizeObserver: 'readonly', console: 'readonly' }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Deliberate mount-only effects are everywhere in the adapters and each
      // one is commented. A warning keeps them visible without blocking work;
      // each gets an explicit disable comment as its file is migrated.
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Escape hatch of last resort, and it must say why.
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }]
    }
  }
)
```

- [ ] **Step 7: Convert the four test files to Vitest**

The assertions already use `node:assert/strict`, so only the runner import changes. In each of `src/route.test.js`, `src/graph/ops.test.js`, `src/bench/bench.test.js`, `src/echarts/symbols.test.js`:

```diff
-import test from 'node:test'
+import { test } from 'vitest'
```

Leave `import assert from 'node:assert/strict'` exactly as it is — Vitest runs it fine, and rewriting 50 assertions into `expect` buys nothing.

- [ ] **Step 8: Configure Vitest and rename the Vite config**

Rename `vite.config.js` to `vite.config.ts` and add the test block. The layout tests take about 29 seconds, so the default 5-second timeout must go up.

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,ts}'],
    // layoutRadial's growth tests are genuinely slow — ~13s each.
    testTimeout: 30_000
  }
})
```

- [ ] **Step 9: Wire up the scripts**

In `package.json`:

```json
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css}\"",
    "check": "npm run typecheck && npm run lint && npm run test"
  },
```

- [ ] **Step 10: Run the whole harness**

Run: `npm run check`
Expected: `tsc` passes (nothing is type-checked yet — `checkJs` is off), `eslint` passes or reports only `exhaustive-deps` warnings, and 50 tests pass under Vitest.

Fix any hard ESLint error. Leave the `exhaustive-deps` warnings; they are addressed file by file.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "build: TypeScript 6.0.3, Vitest 4, ESLint 10, Prettier

Harness only — no .ts files yet, and checkJs is off, so this proves
the tooling runs green over the existing JavaScript before anything
is converted. npm run check is the gate every later task ends on.

TypeScript is pinned to 6.0.3 rather than 7.0.2 because
typescript-eslint@8.69.0 peers typescript >=4.8.4 <6.1.0.

Test conversion was one import line per file: the assertions already
used node:assert/strict, which Vitest runs unchanged."
```

---

## Task 6: The shared type layer

The contract every later task depends on. No runtime code changes.

**Files:**
- Create: `src/engine/types.ts`
- Modify: `tsconfig.json` (turn on `checkJs`? no — see step 5)

**Interfaces:**
- Consumes: nothing at runtime. Imports `LazyExoticComponent` and `ComponentType` from `react`.
- Produces: `EntityType`, `GraphNode`, `GraphEdge`, `Graph`, `Point`, `Positions`, `ViewportHandle`, `CapKey`, `ControlKey`, `GraphPaneProps`, `GraphEngine`. Every subsequent task imports from here.

- [ ] **Step 1: Write the file**

```ts
// The contract every engine implements, and the domain types the whole app
// shares. This file has no runtime code — it is the thing that makes adding a
// ninth library a compile-time exercise rather than a runtime surprise.

import type { ComponentType, LazyExoticComponent } from 'react'
import type { EDGE_STYLES, EDGE_RULES, SHAPE_SETS } from '../echarts/symbols'

// ── The graph ───────────────────────────────────────────────────────────────

export type EntityType = 'account' | 'device' | 'phone' | 'email' | 'ip' | 'card'

export interface GraphNode {
  id: string
  type: EntityType
  level: number
  name: string
  risk: number
  flagged: boolean
  firstSeen: string
  events: number
  /** Added by the analyst rather than returned by the backend. */
  synthetic?: boolean
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
  synthetic?: boolean
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface Point {
  x: number
  y: number
}

/**
 * Node coordinates from the shared radial layout.
 *
 * Under `noUncheckedIndexedAccess` a lookup yields `Point | undefined`, which is
 * correct: the layout is computed from one graph and a renderer may hold a
 * slightly older one. Every adapter must handle the miss.
 */
export type Positions = Record<string, Point>

// ── Appearance keys, derived so a new entry widens the type for free ────────

export type ShapeSetKey = keyof typeof SHAPE_SETS

/** A concrete line style. What an individual edge override holds. */
export type EdgeStyleKey = keyof typeof EDGE_STYLES

/**
 * What the edge picker offers: every EdgeStyleKey, plus the computed rules
 * (`kind`, `relation`, `depth`) that derive a style per edge. Not
 * interchangeable with EdgeStyleKey — an override cannot be a rule.
 */
export type EdgeRuleKey = keyof typeof EDGE_RULES

// ── The engine contract ─────────────────────────────────────────────────────

/**
 * Relative rather than absolute (`zoomBy(1.1)`, not `zoomTo(2)`) because every
 * engine here can express a relative zoom and only some can express an absolute
 * one. A pane with no viewport at all passes `null` instead of a handle.
 */
export interface ViewportHandle {
  zoomBy(factor: number): void
  panBy(dx: number, dy: number): void
  fit(): void
}

/**
 * The props every renderer takes. Identical across all engines on purpose —
 * that uniformity is the entire comparison.
 */
export interface GraphPaneProps {
  graph: Graph
  positions: Positions
  hidden: ReadonlyMap<string, number>
  isExpanded(id: string): boolean
  isPending(id: string): boolean
  /** Bumped when expansion status changes, which lives in a ref. */
  statusVersion: number

  /** One of the engine's declared `renderers`. Fixed at construction. */
  renderer?: string

  shapeSet?: ShapeSetKey
  edgeStyle?: EdgeRuleKey
  edgeOverrides?: ReadonlyMap<string, EdgeStyleKey>

  onNodeClick(id: string): void
  onNodeHover(id: string | null, at: Point | null): void
  onEdgeClick(id: string): void
  onBackgroundClick(): void
  onStat?(ms: number): void
  /** Called once on mount with a handle or `null`, and with `null` on unmount. */
  onViewport?(handle: ViewportHandle | null): void
}

export type CapKey = 'viewport' | 'layout' | 'lod' | 'culling' | 'images' | 'routing'

/** Optional controls an engine opts into. App renders one if any pane wants it. */
export type ControlKey = 'shapeSet' | 'edgeStyle'

export interface GraphEngine {
  name: string
  lib: string
  note: string
  surface: string
  /**
   * Paint backends, first entry being the default. A non-empty tuple so
   * `renderers[0]` is defined under `noUncheckedIndexedAccess` — BenchView
   * depends on that.
   */
  renderers: readonly [string, ...string[]]
  /** Total over CapKey: a new capability row cannot leave a hole in Compare. */
  caps: Record<CapKey, string | null>
  controls?: readonly ControlKey[]
  Component: LazyExoticComponent<ComponentType<GraphPaneProps>>
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: it will **fail**, because `src/echarts/symbols.js` is still JavaScript with `checkJs: false`, so `keyof typeof SHAPE_SETS` cannot resolve. That failure is the signal that symbols must be converted first.

- [ ] **Step 3: Convert symbols.js to TypeScript**

Rename `src/echarts/symbols.js` to `src/echarts/symbols.ts` and `src/echarts/symbols.test.js` to `.ts`. The one construct that needs care is `EDGE_RULES`: the current `Object.assign(Object.keys(...).reduce(...), {...})` infers as an index signature and destroys the literal key union. Replace that shape with:

```ts
export interface EdgeRule {
  label: string
  styleOf(link: FlatLink, ctx: { level: number }): EdgeStyleKey
}

const flatRules = Object.fromEntries(
  (Object.keys(EDGE_STYLES) as (keyof typeof EDGE_STYLES)[]).map(key => [
    key,
    { label: EDGE_STYLES[key].label, styleOf: () => key }
  ])
) as Record<keyof typeof EDGE_STYLES, EdgeRule>

export const EDGE_RULES = {
  ...flatRules,
  kind: { label: 'Rule · by edge origin', styleOf: /* unchanged */ },
  relation: { label: 'Rule · by relationship', styleOf: /* unchanged */ },
  depth: { label: 'Rule · by hop distance', styleOf: /* unchanged */ }
}
```

Keep every existing comment. Define `FlatLink` to match what `withLoops` produces: `{ id: string; from: string; to: string; label: string; arrow: boolean; loop?: boolean; synthetic?: boolean }`.

- [ ] **Step 4: Run typecheck and the symbols tests**

Run: `npx tsc --noEmit && npx vitest run src/echarts/symbols.test.ts`
Expected: clean, and the symbols assertions pass.

- [ ] **Step 5: Confirm the derived types are literal unions, not `string`**

This is the whole point of the barrel design, so verify it rather than assume it. Create a scratch file `src/engine/types.check.ts`:

```ts
import type { EdgeRuleKey, EdgeStyleKey, ShapeSetKey } from './types'

// Each must be a literal union. If any widened to `string`, these fail.
const shape: ShapeSetKey = 'type'
const style: EdgeStyleKey = 'arrow'
const rule: EdgeRuleKey = 'kind'
// @ts-expect-error 'nonsense' is not a shape set
const bad: ShapeSetKey = 'nonsense'
void shape; void style; void rule; void bad
```

Run: `npx tsc --noEmit`
Expected: clean. A failure on the `@ts-expect-error` line means the type widened to `string` and the derivation is broken — fix it before continuing. Delete the scratch file once it passes.

- [ ] **Step 6: Commit**

```bash
rm src/engine/types.check.ts
git add src/engine/types.ts src/echarts/symbols.ts src/echarts/symbols.test.ts
git rm --cached src/echarts/symbols.js src/echarts/symbols.test.js 2>/dev/null || true
npm run check
git commit -m "feat: shared type layer and the engine contract

GraphPaneProps replaces the twelve-prop doc comment in engines.js.
renderers is a non-empty tuple so renderers[0] is defined under
noUncheckedIndexedAccess, and caps is total over CapKey so a new
capability row cannot leave a hole in the Compare grid.

symbols.ts comes along because the appearance keys derive from it.
EDGE_RULES is rebuilt with an explicit Record rather than
Object.assign over a reduce, which was inferring an index signature
and collapsing the literal key union to string."
```

---

## Task 7: Convert the graph layer

The pure logic the whole app sits on, and the best-tested part of the codebase. Expect `noUncheckedIndexedAccess` to find real gaps here.

**Files:**
- Rename and convert: `src/graph/data.js`, `ops.js`, `loops.js`, `synth.js`, `useGraph.js` → `.ts`; `src/graph/ops.test.js` → `.ts`
- Modify: importers' extensions where they name `.js` explicitly

**Interfaces:**
- Consumes: `Graph`, `GraphNode`, `GraphEdge`, `EntityType`, `Positions`, `Point` from `../engine/types`.
- Produces: typed `ENTITY: Record<EntityType, { label: string; color: string; tag: string }>`, `ROOT: GraphNode`, `MAX_DEPTH: number`, `hash(s: string): number`, `degreeOf(n: GraphNode): number`, `relationLabel(from: EntityType, to: EntityType): string`, `selfEdgeFor(n: GraphNode): GraphEdge | null`, `fetchNeighbors(n: GraphNode): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }>`, `mergeGraph`, `removeNode`, `isSelfEdge`, `hiddenCounts(g: Graph): Map<string, number>`, `hiddenCount`, `neighborsOf`, `pathToRoot`, `layoutRadial(g: Graph, prev: Positions | null): Positions`, `NODE_SPACING`, `withLoops`, `synthGraph(nodes: number, edges: number): Graph`, and the `useGraph()` hook.

- [ ] **Step 1: Convert data.ts first — everything imports it**

`git mv src/graph/data.js src/graph/data.ts`. Type the constants explicitly so the literal unions survive:

```ts
export const ENTITY: Record<EntityType, { label: string; color: string; tag: string }> = { /* unchanged */ }

const LINKS: Record<EntityType, readonly EntityType[]> = { /* unchanged */ }

const RELATION: Record<string, string> = { /* unchanged */ }

const SELF_RELATION: Partial<Record<EntityType, string>> = { /* unchanged */ }
```

`SELF_RELATION` is `Partial` because only three of the six types have one — `selfEdgeFor` already handles the miss with `if (!label ...) return null`, and the type should say so.

In `makeNode`, `options[pick(...)]` is now `EntityType | undefined`. `pick` returns a value modulo `options.length` so it cannot actually miss, but the compiler cannot know that. Write the guard rather than asserting:

```ts
const type = options[pick(parent.id, 'type' + index, options.length)]
if (!type) throw new Error(`no link target for ${parent.type}`)
```

- [ ] **Step 2: Typecheck after each file, not at the end**

Run: `npx tsc --noEmit` after converting each of `data.ts`, `loops.ts`, `ops.ts`, `synth.ts`, `useGraph.ts`. Converting all five and then debugging a hundred errors at once is much slower than five small passes.

- [ ] **Step 3: Watch for these specific spots in ops.ts**

- `layoutRadial` reads and writes `Positions`; every `prev[id]` lookup is now `Point | undefined`.
- `hiddenCounts` builds a `Map<string, number>`; `shown.get(id)` is `number | undefined` and the existing `|| 0` already covers it.
- `neighborsOf` pairs an edge with the node at its other end; `byId.get(...)` can miss, and the existing code should be checked rather than assumed.

- [ ] **Step 4: In useGraph.ts, type the status ref precisely**

```ts
type ExpandStatus = 'pending' | 'done'
const status = useRef<Map<string, ExpandStatus>>(new Map())
```

`addNode(parent: GraphNode, type: EntityType): GraphNode` and `load(next: Graph): void`. The hook's return is inferred; do not annotate it by hand.

- [ ] **Step 5: Convert the test file**

`git mv src/graph/ops.test.js src/graph/ops.test.ts`. The test builds partial nodes (`{ id: 'a' }`) that do not satisfy `GraphNode`. Add one local helper rather than casting at every call site:

```ts
const node = (id: string, over: Partial<GraphNode> = {}): GraphNode => ({
  id, type: 'account', level: 0, name: id, risk: 0,
  flagged: false, firstSeen: '2026-01-01', events: 0, ...over
})
```

Do not weaken the production types to make test fixtures easier.

- [ ] **Step 6: Run the full check**

Run: `npm run check`
Expected: clean typecheck, and all 50 assertions still pass. If a test now fails, `noUncheckedIndexedAccess` found a real bug — fix it in a separate `fix:` commit before this one.

- [ ] **Step 7: Commit**

```bash
git add src/graph src/App.jsx
git commit -m "refactor: convert the graph layer to TypeScript

data, ops, loops, synth and useGraph, plus ops.test. LINKS and ENTITY
are keyed by EntityType so a new entity type is a compile error in
every table that must know about it, and SELF_RELATION is Partial
because only three of the six have one.

noUncheckedIndexedAccess turns every positions[id] and options[i]
into a possible undefined; each is guarded rather than asserted."
```

---

## Task 8: Convert routing and the UI layer

Small, mechanical, and a good breather between the graph layer and the adapters.

**Files:**
- Convert: `src/route.js` → `.ts`, `src/route.test.js` → `.ts`, `src/ui/theme.js` → `.ts`, `src/ui/useResize.js` → `.ts`, `src/ui/HoverCard.jsx` → `.tsx`, `src/ui/SidePanel.jsx` → `.tsx`

**Interfaces:**
- Consumes: `Graph`, `GraphNode`, `EntityType` from `../engine/types`.
- Produces: `MODES: readonly (readonly [ModeKey, string])[]`, `ModeKey = 'explore' | 'bench' | 'lab' | 'compare'`, `parseRoute(hash: string): { mode: ModeKey; arg: string | null }`, `routeHash(mode: ModeKey, arg?: string): string`, `INK/BONE/FLARE: string`, `mix(a: string, b: string, t: number): string`, `nodeColor(base: string, s: { explored: boolean; pending: boolean }): string`, `useResize(ref: RefObject<HTMLElement | null>, onResize: () => void): void`.

- [ ] **Step 1: route.ts — keep the mode union literal**

```ts
export const MODES = [
  ['explore', 'Explore'],
  ['bench', 'Bench'],
  ['lab', 'Lab'],
  ['compare', 'Compare']
] as const

export type ModeKey = (typeof MODES)[number][0]

const KEYS: readonly string[] = MODES.map(m => m[0])

export function parseRoute(hash: string): { mode: ModeKey; arg: string | null } {
  const parts = String(hash || '').replace(/^#\/?/, '').split('/').filter(Boolean)
  const head = parts[0]
  const mode: ModeKey = head && KEYS.includes(head) ? (head as ModeKey) : 'explore'
  return { mode, arg: mode === 'lab' && parts[1] ? parts[1] : null }
}

export const routeHash = (mode: ModeKey, arg?: string): string =>
  '#/' + mode + (arg ? '/' + arg : '')
```

`as const` is what keeps `ModeKey` a literal union instead of `string`. Keep the file's existing header comment about why the mode lives in the hash.

- [ ] **Step 2: theme.ts — the destructures need care**

`hex()` returns `number[]`, so `const [ar, ag, ab] = hex(a)` gives three `number | undefined` under `noUncheckedIndexedAccess`. Return a tuple instead:

```ts
const hex = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16)
]
```

That is a genuine improvement — the old `[1,3,5].map(...)` form gave no guarantee there were three components.

- [ ] **Step 3: useResize.ts**

```ts
import { useEffect, useRef, type RefObject } from 'react'

export function useResize(ref: RefObject<HTMLElement | null>, onResize: () => void): void {
```

Body is unchanged. Keep the header comment — it explains why the first `observe` call matters.

- [ ] **Step 4: HoverCard.tsx and SidePanel.tsx**

Define a props interface at the top of each rather than inlining. Read the current JSX for the exact prop list; do not guess it. `SidePanel` takes `graph`, `node`, `tab`, `hidden`, `isRoot`, `onTab`, `onClose`, `onExpand`, `onAdd`, `onDelete`.

- [ ] **Step 5: Run the check and commit**

Run: `npm run check` → clean, 50 pass.

```bash
git add src/route.ts src/route.test.ts src/ui
git commit -m "refactor: convert routing and the UI layer to TypeScript

MODES is `as const` so ModeKey stays a literal union and parseRoute
cannot return a mode the app has no branch for. theme's hex() returns
a real 3-tuple rather than number[], which the destructure was
already assuming."
```

---

## Task 9: Split the registry into per-library manifests

The structural change the whole plan exists for. Eight new `engine.ts` files, one rewritten barrel, and the `showsEcharts` hardcode removed.

**Files:**
- Create: `src/{echarts,fusion,cytoscape,vis,vng,jsplumb,nvl,flow}/engine.ts`
- Replace: `src/engines.js` → `src/engines.ts`
- Modify: `src/App.jsx:238,299-325` (the `showsEcharts` branch)

**Interfaces:**
- Consumes: `GraphEngine`, `CapKey`, `ControlKey` from `./engine/types`.
- Produces: `ENGINES` (satisfying `Record<string, GraphEngine>`), `EngineKey = keyof typeof ENGINES`, `ENGINE_KEYS: EngineKey[]`, `CAP_ROWS: readonly (readonly [CapKey, string])[]`. Tasks 10–14 all consume these.

- [ ] **Step 1: Write one manifest and check it before writing eight**

`src/echarts/engine.ts`. Move the per-engine comments out of `engines.js` verbatim — they are the documentation of each library's behaviour and must not be lost in the split.

```ts
import { lazy } from 'react'
import type { GraphEngine } from '../engine/types'

/**
 * Apache ECharts.
 *
 * The same series, the same option object, two paint backends. Worth having as
 * a knob: it is the one place in this repo where canvas vs SVG is a one-word
 * change with everything else held identical.
 *
 * The shape and edge-style pickers are declared in `controls`, which is what
 * puts them in the toolbar — App does not know this engine by name.
 */
const echarts: GraphEngine = {
  name: 'Apache ECharts',
  lib: 'echarts 6.1',
  note: 'graph series · canvas · roam + drag · shape and edge pickers',
  surface: 'canvas',
  renderers: ['canvas', 'svg'],
  controls: ['shapeSet', 'edgeStyle'],
  caps: {
    viewport: 'roam · graphRoam action',
    layout: 'force, circular — unused here',
    lod: 'none built in',
    culling: 'none built in',
    images: 'symbol: image://… per node',
    routing: 'straight, curved by curveness'
  },
  Component: lazy(() => import('./EChartsGraph.jsx'))
}

export default echarts
```

Run: `npx tsc --noEmit`

Expected: an error, because `EChartsGraph.jsx` is still untyped JavaScript and does not satisfy `ComponentType<GraphPaneProps>`. **This is the contract working.** Until Task 11 converts the adapters, relax `Component`'s type in `src/engine/types.ts` to:

```ts
  // Tightened to ComponentType<GraphPaneProps> in Task 13, once every adapter
  // is .tsx. Until then the adapters are untyped .jsx and cannot satisfy it.
  Component: LazyExoticComponent<ComponentType<never>> | LazyExoticComponent<ComponentType<GraphPaneProps>>
```

Note this in the task report — Task 13 is the one that removes the escape hatch.

- [ ] **Step 2: Write the remaining seven manifests**

`src/fusion/engine.ts`, `cytoscape/engine.ts`, `vis/engine.ts`, `vng/engine.ts`, `jsplumb/engine.ts`, `nvl/engine.ts`, `flow/engine.ts`. Copy each entry's fields and comments out of the existing `src/engines.js` unchanged, except:

- **flow**: `lib` becomes `'@xyflow/react 12.11'`, `note` and `caps.viewport` updated — `useReactFlow · setViewport / fitView`.
- **nvl**: `note` becomes `'canvas/WebGL · @neo4j-nvl/react'`, and the comment explaining the hand-written wrapper is replaced.
- No engine other than `echarts` gets a `controls` field.

- [ ] **Step 3: Write the barrel**

Replace `src/engines.js` with `src/engines.ts`. Keep the long header comment from the original describing the shared props, `onViewport`, and why layout is shared — it is the best explanation of the contract in the repo. Add a line pointing at `engine/types.ts` as the enforced version.

```ts
import type { CapKey, GraphEngine } from './engine/types'

import cytoscape from './cytoscape/engine'
import echarts from './echarts/engine'
import flow from './flow/engine'
import fusion from './fusion/engine'
import jsplumb from './jsplumb/engine'
import nvl from './nvl/engine'
import vis from './vis/engine'
import vng from './vng/engine'

/**
 * The engine registry.
 *
 * Order is deliberate — it is the order every table renders in — so this is a
 * hand-written barrel rather than an `import.meta.glob`. The glob version would
 * make adding a library a zero-line change, but `EngineKey` would widen from a
 * literal union to `string` and every consumer would lose exhaustiveness and
 * autocomplete. Two lines per engine is the price of keeping that.
 *
 * Adding a library: `npm i thelib`, create `src/thelib/engine.ts` and
 * `src/thelib/TheLibGraph.tsx`, then add the import and the entry below.
 */
export const ENGINES = {
  echarts,
  fusion,
  cytoscape,
  vis,
  vng,
  jsplumb,
  nvl,
  flow
} satisfies Record<string, GraphEngine>

export type EngineKey = keyof typeof ENGINES

export const ENGINE_KEYS = Object.keys(ENGINES) as EngineKey[]

/** The rows of the capability grid, in the order they read best. */
export const CAP_ROWS = [
  ['viewport', 'Viewport control'],
  ['layout', 'Layouts shipped'],
  ['lod', 'Level of detail'],
  ['culling', 'Viewport culling'],
  ['images', 'Custom glyphs / images'],
  ['routing', 'Edge routing']
] as const satisfies readonly (readonly [CapKey, string])[]
```

`satisfies` rather than `:` is deliberate in both places — it checks each entry against the interface while leaving `ENGINES` its precise literal type, which is what makes `EngineKey` a union of the eight names.

- [ ] **Step 4: Replace the showsEcharts hardcode in App.jsx**

Delete `const showsEcharts = engines.includes('echarts')` at line 238. Add:

```jsx
  // Which optional controls to show: the union of what the selected panes ask
  // for. No engine is named here — an engine opts in via `controls` in its own
  // manifest.
  const controls = useMemo(() => {
    const on = new Set()
    engines.forEach(key => (ENGINES[key].controls || []).forEach(c => on.add(c)))
    return on
  }, [engines])
```

Then replace `{showsEcharts && (` with `{(controls.has('shapeSet') || controls.has('edgeStyle')) && (`, and guard each picker individually with `controls.has('shapeSet')` and `controls.has('edgeStyle')`. The "Clear N edge styles" button belongs inside the `edgeStyle` guard.

There is a second use at line 421 in the legend text — `{showsEcharts && ', or an edge to restyle just that edge'}` becomes `{controls.has('edgeStyle') && ...}`.

- [ ] **Step 5: Verify the split changed nothing visible**

Run: `npm run dev`. Confirm: all eight tabs still list in the same order, the shape and edge pickers appear when ECharts is selected and vanish when it is not, and the Compare grid renders every capability row for every engine.

- [ ] **Step 6: Run the check and commit**

Run: `npm run check` → clean, 50 pass. `bench.test.js` asserts every engine's `renderers` is non-empty and will catch a manifest that lost its array in the move.

```bash
git add src/engines.ts src/*/engine.ts src/App.jsx
git rm src/engines.js
git commit -m "refactor: one manifest per library, collected by a barrel

Each engine's config now lives beside its adapter instead of in a
197-line shared file. engines.ts is eight imports and a satisfies,
which keeps EngineKey a literal union and keeps table order explicit
— both of which an import.meta.glob would have cost.

App no longer knows any engine by name: the shape and edge pickers
are driven by a `controls` field on the manifest, so the showsEcharts
branch is gone and a future engine opts in with one array entry."
```

---

## Task 10: A contract test for the registry

Extends the `renderers` check in `bench.test.js` to the whole manifest, so a malformed engine fails a test rather than rendering a blank pane.

**Files:**
- Create: `src/engine/registry.test.ts`

**Interfaces:**
- Consumes: `ENGINES`, `ENGINE_KEYS`, `CAP_ROWS` from `../engines`.
- Produces: nothing importable.

- [ ] **Step 1: Write the failing test**

```ts
import assert from 'node:assert/strict'
import { test } from 'vitest'
import { CAP_ROWS, ENGINES, ENGINE_KEYS } from '../engines'

// The compiler already enforces the shape of a manifest. What it cannot check
// is that the values are sane — an empty renderers array, a caps entry that is
// an empty string, a Component that is not actually lazy. A blank pane is a
// miserable way to discover any of those.

test('every engine is registered under the key its own file uses', () => {
  ENGINE_KEYS.forEach(key => {
    assert.ok(ENGINES[key], `${key} is missing from ENGINES`)
  })
  assert.equal(ENGINE_KEYS.length, Object.keys(ENGINES).length)
})

test('every engine names itself and the library it wraps', () => {
  ENGINE_KEYS.forEach(key => {
    const e = ENGINES[key]
    assert.ok(e.name.length > 0, `${key} has no name`)
    assert.ok(e.lib.length > 0, `${key} does not say which library it is`)
    assert.ok(e.surface.length > 0, `${key} declares no surface`)
  })
})

test('every engine offers at least one renderer, and the first is its default', () => {
  ENGINE_KEYS.forEach(key => {
    const list = ENGINES[key].renderers
    assert.ok(list.length >= 1, `${key} offers no renderer`)
    assert.equal(new Set(list).size, list.length, `${key} lists a renderer twice`)
    assert.ok(list[0], `${key} has no default renderer`)
  })
})

test('every engine answers every capability row', () => {
  ENGINE_KEYS.forEach(key => {
    const caps = ENGINES[key].caps
    CAP_ROWS.forEach(([capKey, label]) => {
      assert.ok(capKey in caps, `${key} does not answer "${label}"`)
      const value = caps[capKey]
      // null means "the library genuinely has none", which is a real answer.
      // An empty string means someone left it blank.
      assert.ok(value === null || value.length > 0, `${key}.caps.${capKey} is blank`)
    })
  })
})

test('every engine ships a lazy component', () => {
  ENGINE_KEYS.forEach(key => {
    const C = ENGINES[key].Component
    assert.equal(typeof C, 'object', `${key}.Component is not a lazy component`)
    assert.ok('$$typeof' in C, `${key}.Component is not a React element type`)
  })
})

test('only engines that declare a control get one', () => {
  const allowed = new Set(['shapeSet', 'edgeStyle'])
  ENGINE_KEYS.forEach(key => {
    const controls = ENGINES[key].controls
    if (!controls) return
    controls.forEach(c => assert.ok(allowed.has(c), `${key} declares unknown control "${c}"`))
    assert.equal(new Set(controls).size, controls.length, `${key} declares a control twice`)
  })
})
```

- [ ] **Step 2: Run it and watch it pass**

Run: `npx vitest run src/engine/registry.test.ts`
Expected: 6 tests pass. If any fails, a manifest lost something in Task 9's move — fix the manifest, not the test.

- [ ] **Step 3: Prove the test actually bites**

A test that has never failed is not yet a test. Temporarily empty one engine's `renderers` array:

Run: `npx vitest run src/engine/registry.test.ts`
Expected: FAIL with "offers no renderer". Restore the array and confirm it passes again.

- [ ] **Step 4: Remove the now-duplicated assertion from bench.test.js**

`src/bench/bench.test.js:187-189` checks the same `renderers` property. Delete that block; this file owns the check now.

- [ ] **Step 5: Commit**

```bash
npm run check
git add src/engine/registry.test.ts src/bench/bench.test.js
git commit -m "test: contract test over the engine registry

The compiler checks a manifest's shape; this checks its values are
sane — no empty renderers array, no blank capability, no duplicate
control, a Component that is really lazy. Supersedes the renderers
assertion in bench.test.js."
```

---

## Task 11: Convert the four self-contained canvas adapters

`cytoscape`, `vis`, `echarts` and `fusion`. Grouped because all four wrap a vanilla-JS library through a ref and an effect, and none has a framework boundary to negotiate.

**Files:**
- Convert: `src/cytoscape/CytoscapeGraph.jsx`, `src/vis/VisGraph.jsx`, `src/echarts/EChartsGraph.jsx`, `src/fusion/FusionGraph.jsx` → `.tsx`
- Create: `src/fusion/fusioncharts.d.ts`
- Modify: the four `engine.ts` files' import extensions

**Interfaces:**
- Consumes: `GraphPaneProps`, `ViewportHandle` from `../engine/types`.
- Produces: four `React.memo`'d default exports typed `ComponentType<GraphPaneProps>`.

- [ ] **Step 1: Start with Cytoscape — it has the best upstream types**

`git mv src/cytoscape/CytoscapeGraph.jsx src/cytoscape/CytoscapeGraph.tsx`. The signature becomes:

```tsx
function CytoscapeGraph({
  graph, positions, hidden, isExpanded, isPending, statusVersion, renderer = 'canvas',
  onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick, onStat, onViewport
}: GraphPaneProps) {
```

Refs need explicit parameters: `useRef<HTMLDivElement>(null)`, `useRef<cytoscape.Core | null>(null)`, `useRef(-1)`.

The `handlers` ref pattern appears in all eight adapters. Type it once, the same way each time:

```tsx
type Handlers = Pick<GraphPaneProps, 'onNodeClick' | 'onNodeHover' | 'onEdgeClick' | 'onBackgroundClick'>
const handlers = useRef<Handlers>({ onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick })
handlers.current = { onNodeClick, onNodeHover, onEdgeClick, onBackgroundClick }
```

- [ ] **Step 2: Add the exhaustive-deps disables as you go**

Every mount-only effect in these files already carries a prose comment explaining itself. Add the machine-readable form directly above it, keeping the prose:

```tsx
    // Mount-only: the instance is built once and diffed thereafter; rebuilding
    // it on a handler change would throw away pan, zoom and every hand drag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
```

- [ ] **Step 3: Typecheck after each adapter**

Run: `npx tsc --noEmit` after each of the four. Do not batch them.

- [ ] **Step 4: Write the FusionCharts shim**

`fusioncharts` ships no types at all. Declare only what the pane uses, scoped to its own folder:

```ts
// src/fusion/fusioncharts.d.ts
//
// fusioncharts publishes no types. This declares the surface this pane touches
// and nothing more — a global `any` would hide real mistakes in the rest of the
// file, which is the part worth checking.
declare module 'fusioncharts' {
  interface FusionChartsStatic {
    new (config: Record<string, unknown>): { render(): void; dispose(): void }
    (config: Record<string, unknown>): { render(): void; dispose(): void }
    ready(cb: () => void): void
  }
  const FusionCharts: FusionChartsStatic
  export default FusionCharts
}
declare module 'fusioncharts/fusioncharts.powercharts' { const m: unknown; export default m }
declare module 'fusioncharts/themes/fusioncharts.theme.fusion' { const m: unknown; export default m }
```

Read `FusionGraph.jsx` first and declare what it actually imports — the module paths above are the usual ones but must be checked against the file.

- [ ] **Step 5: Update the four manifests' import paths**

In each `engine.ts`, `import('./XGraph.jsx')` becomes `import('./XGraph')`.

- [ ] **Step 6: Verify each pane in the browser**

Run: `npm run dev`. Open each of `#/lab/cytoscape`, `#/lab/vis`, `#/lab/echarts`, `#/lab/fusion`. For each: nodes draw, expansion works, hover card appears, the `ms` readout updates, and the lab's zoom/pan/fit buttons move the viewport (except fusion, which correctly has none).

For ECharts additionally: switch the shape picker through all three sets and the edge picker through every rule, and click an edge to cycle its override.

- [ ] **Step 7: Run the check and commit**

```bash
npm run check
git add src/cytoscape src/vis src/echarts src/fusion
git commit -m "refactor: convert the four canvas adapters to TypeScript

cytoscape, vis-network and echarts all ship their own types.
fusioncharts ships none, so it gets a shim scoped to its own folder
declaring only the surface the pane touches — a global any would hide
mistakes in the part actually worth checking.

Each deliberate mount-only effect keeps its prose comment and gains
an explicit exhaustive-deps disable, so the intent is now
machine-readable rather than only human-readable."
```

---

## Task 12: Convert the three framework-boundary adapters

`jsplumb`, `flow` and `nvl`. Grouped because each negotiates a boundary — hand-built DOM transforms, React components as nodes, and a third-party React wrapper.

**Files:**
- Convert: `src/jsplumb/JsPlumbGraph.jsx`, `src/flow/FlowGraph.jsx`, `src/nvl/NvlGraph.jsx` → `.tsx`
- Modify: the three `engine.ts` import extensions

**Interfaces:**
- Consumes: `GraphPaneProps`, `ViewportHandle`, `Point` from `../engine/types`; for flow, `Node`, `Edge`, `NodeProps`, `EdgeProps` from `@xyflow/react`.
- Produces: three typed default exports.

- [ ] **Step 1: jsPlumb first — no framework boundary, just DOM**

`@jsplumb/browser-ui` ships types. The hand-built CSS transform viewport is plain arithmetic and types cleanly. Node elements are `HTMLDivElement`; the element map ref is `useRef<Map<string, HTMLDivElement>>(new Map())`.

- [ ] **Step 2: flow — type the custom node and edge properly**

v12 requires custom node data to be assignable to `Record<string, unknown>`. Declare the types rather than inlining:

```tsx
import type { Edge, EdgeProps, Node, NodeProps } from '@xyflow/react'

type DiscData = {
  label: string
  risk: number
  behind: number
  flagged: boolean
  pending: boolean
  color: string
  border: string
}
type DiscNodeType = Node<DiscData, 'disc'>

type LoopData = { label: string }
type SelfLoopEdgeType = Edge<LoopData, 'selfloop'>

function DiscNode({ data }: NodeProps<DiscNodeType>) { /* … */ }
function SelfLoopEdge({ id, sourceX, sourceY, style, data }: EdgeProps<SelfLoopEdgeType>) { /* … */ }
```

The `style={{ '--disc': ... }}` custom properties are not in `CSSProperties`. Cast that one object rather than the whole component:

```tsx
style={{ '--disc': data.color, '--ring': data.border, opacity: data.pending ? 0.55 : 1 } as CSSProperties}
```

- [ ] **Step 3: nvl — depends on what Task 4 found**

If `@neo4j-nvl/react` shipped types, use them. If Task 4 created `src/nvl/nvl-react.d.ts`, widen it now to cover anything the typed pane needs. `@neo4j-nvl/base` does ship types, so `Node` and `Relationship` are importable from there for the mapping functions.

- [ ] **Step 4: Update the three manifests' import paths and typecheck**

Run: `npx tsc --noEmit` after each.

- [ ] **Step 5: Verify all three in the browser**

Run: `npm run dev`. Open `#/lab/jsplumb`, `#/lab/flow`, `#/lab/nvl`. Same checklist as Task 11 step 6. For nvl, also switch the renderer knob to `webgl` and confirm the pane remounts and drops captions.

- [ ] **Step 6: Commit**

```bash
npm run check
git add src/jsplumb src/flow src/nvl
git commit -m "refactor: convert the jsPlumb, React Flow and NVL adapters

React Flow's custom node and edge get real generic types, which is
what v12's Node<Data, Type> is for — the data shape is now checked at
the point the nodes are built rather than trusted at the point they
are read.

The CSS custom properties on the disc still need a CSSProperties cast;
they are not part of the standard type and there is no cleaner way."
```

---

## Task 13: Convert the Vue island, then close the contract

`v-network-graph` is a Vue 3 component library mounted inside React — the hardest single file, and the one most likely to need an escape hatch. Once it lands, every adapter is `.tsx` and `GraphEngine.Component` can be tightened to its real type.

**Files:**
- Convert: `src/vng/VngGraph.jsx` → `.tsx`
- Modify: `src/engine/types.ts` (remove the Task 9 escape hatch), `src/vng/engine.ts`

**Interfaces:**
- Consumes: `GraphPaneProps` from `../engine/types`; `createApp`, `h`, `reactive`, `shallowRef` from `vue`.
- Produces: the eighth typed adapter, and `GraphEngine.Component: LazyExoticComponent<ComponentType<GraphPaneProps>>` with no union.

- [ ] **Step 1: Convert VngGraph**

Both `vue` and `v-network-graph` ship types, so the pieces are typed — the difficulty is that one module holds two frameworks' type worlds. Type the React side normally (`GraphPaneProps`, `useRef<HTMLDivElement>(null)`) and the Vue side with Vue's own types (`reactive<Record<string, VngNode>>({})`, `shallowRef`, the app instance as `ReturnType<typeof createApp>`).

If a specific interop point genuinely resists typing, use `@ts-expect-error` with a one-line reason — the ESLint config requires the description. Do not reach for `any`, and do not weaken `GraphPaneProps` to accommodate this file.

- [ ] **Step 2: Tighten the contract**

In `src/engine/types.ts`, replace the Task 9 escape hatch with the real type:

```ts
  Component: LazyExoticComponent<ComponentType<GraphPaneProps>>
```

- [ ] **Step 3: Run the typecheck — this is the moment the contract is proved**

Run: `npx tsc --noEmit`
Expected: clean. Any error here names an adapter whose props do not match the contract, which is exactly the class of bug this migration exists to prevent. Fix the adapter.

- [ ] **Step 4: Prove the contract rejects a bad adapter**

The contract has not been tested until something has failed it. Temporarily break one manifest — in `src/vis/engine.ts`, point `Component` at a component with wrong props:

```ts
const Wrong = lazy(async () => ({ default: (_: { nope: number }) => null }))
```

Run: `npx tsc --noEmit`
Expected: FAIL, naming `vis/engine.ts` and the prop mismatch. Revert and confirm clean. Record the error message in the task report — it is what a teammate will see, and it should be legible.

- [ ] **Step 5: Verify the pane and commit**

Run: `npm run dev`, open `#/lab/vng`. Nodes draw, expansion works, hover works, `svg-pan-zoom` viewport responds.

```bash
npm run check
git add src/vng src/engine/types.ts
git commit -m "refactor: convert the Vue island, and close the engine contract

v-network-graph is Vue 3 only and is mounted as a Vue app inside a
React component, so this file holds two frameworks' type worlds at
once — the awkward one, saved for last.

With every adapter now .tsx, GraphEngine.Component drops the union
that let untyped .jsx through during the migration. A component whose
props do not match GraphPaneProps is now a compile error naming the
engine file, which is the whole point of the exercise."
```

---

## Task 14: Convert the benchmark tree

Fourteen files, and the only place in the codebase that parses untrusted input.

**Files:**
- Convert to `.ts`: `src/bench/{store,scenarios,probes,force,optimize,runLayout,hud,usePane,layout.worker}.js`
- Convert to `.tsx`: `src/bench/{BenchView,Compare,Lab,table}.jsx`
- Convert: `src/bench/bench.test.js` → `.ts`

**Interfaces:**
- Consumes: `ENGINES`, `ENGINE_KEYS`, `EngineKey`, `CAP_ROWS` from `../engines`; `Graph`, `Positions`, `ViewportHandle` from `../engine/types`.
- Produces: `BenchResult` (the row shape written to localStorage), `rowKey(engine, scenario): string`, `loadResults(): Record<string, BenchResult>`, `saveResult(r: BenchResult)`, `clearResults()`, `clearScenario(s: string)`, `SCENARIOS`.

- [ ] **Step 1: Define the result row type first — everything else keys off it**

In `src/bench/store.ts`, above the existing header comment:

```ts
export interface BenchResult {
  engine: EngineKey
  scenario: string
  renderer: string
  nodes: number
  edges: number
  /** Knob values the row was measured at, so a row measured differently is
   *  visible rather than silently averaged in. */
  knobs: Record<string, number | boolean | string>
  metrics: Record<string, number>
  note?: string
  at: string
}
```

Read the current `saveResult` callers in `BenchView.jsx` and `Lab.jsx` to get the real field list — the shape above is the documented intent, but the code is the authority. Match it exactly.

- [ ] **Step 2: Write the failing test for the localStorage guard**

`JSON.parse` returns `any`, and the current `read()` casts it implicitly. A corrupted store should not produce a `BenchResult` shaped like garbage. Create `src/bench/store.test.ts`:

```ts
import assert from 'node:assert/strict'
import { beforeEach, test } from 'vitest'
import { clearResults, loadResults, saveResult } from './store'

const KEY = 'graph-bench-results-v1'

// jsdom is not configured for this suite, so stub the minimum surface.
const store = new Map<string, string>()
beforeEach(() => {
  store.clear()
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: () => null,
    length: 0
  } as Storage
})

test('a round-trips through the store', () => {
  const row = {
    engine: 'echarts', scenario: 'zoom', renderer: 'canvas',
    nodes: 120, edges: 180, knobs: {}, metrics: { p50: 4 }, at: '2026-09-02'
  } as const
  saveResult(row)
  assert.deepEqual(loadResults()['echarts::zoom'], row)
})

test('a corrupted store reads as empty rather than throwing', () => {
  store.set(KEY, '{not json')
  assert.deepEqual(loadResults(), {})
})

test('a store holding a non-object reads as empty', () => {
  store.set(KEY, '"a string"')
  assert.deepEqual(loadResults(), {})
})

test('a store holding an array reads as empty', () => {
  store.set(KEY, '[1,2,3]')
  assert.deepEqual(loadResults(), {})
})
```

- [ ] **Step 3: Run it and watch the last two fail**

Run: `npx vitest run src/bench/store.test.ts`
Expected: the first two pass (the existing try/catch covers malformed JSON), the last two **fail** — `JSON.parse('"a string"')` returns a string, and `|| {}` does not catch it.

- [ ] **Step 4: Fix the guard**

```ts
const read = (): Record<string, BenchResult> => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null') as unknown
    // Not just `|| {}`: a store holding a string, a number or an array parses
    // fine and would be handed back as if it were a result table.
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
    return raw as Record<string, BenchResult>
  } catch {
    // A corrupted or unavailable store must not take the bench down with it —
    // the run is still worth doing, it just will not be remembered.
    return {}
  }
}
```

- [ ] **Step 5: Run the test again**

Run: `npx vitest run src/bench/store.test.ts`
Expected: 4 pass.

- [ ] **Step 6: Convert the rest of the tree**

Order matters — convert leaves first so each typecheck is small: `force.ts`, `optimize.ts`, `hud.ts`, `probes.ts`, `runLayout.ts`, `scenarios.ts`, `usePane.ts`, `layout.worker.ts`, then `table.tsx`, `Compare.tsx`, `BenchView.tsx`, `Lab.tsx`.

For the worker, Vite's `?worker` import needs its client types, which `tsconfig.json` already has via `"types": ["vite/client"]`. Type the message payloads explicitly on both sides — a worker boundary is exactly where an untyped `postMessage` hides a bug:

```ts
export type LayoutRequest = { graph: Graph; mode: 'radial' | 'force' }
export type LayoutResponse = { positions: Positions; ms: number }
```

- [ ] **Step 7: Convert bench.test.js and run everything**

`git mv src/bench/bench.test.js src/bench/bench.test.ts`.

Run: `npm run check`
Expected: clean typecheck, clean lint, all tests pass — the original 50 minus the `renderers` assertion removed in Task 10, plus 6 registry tests and 4 store tests.

- [ ] **Step 8: Verify the bench actually runs**

Run: `npm run dev`, open `#/bench`. Run one scenario against one engine and confirm a row appears in the table and survives a page reload. Open `#/compare` and confirm it reads the row.

- [ ] **Step 9: Commit**

```bash
git add src/bench
git commit -m "refactor: convert the benchmark tree to TypeScript

BenchResult is now a declared shape rather than whatever the last
caller happened to write, and the layout worker's message payloads
are typed on both sides of postMessage.

store.read() gained a real guard: JSON.parse returns unknown, and a
store holding a string or an array parsed fine and was handed back as
if it were a result table. Four tests cover the corrupted-store paths."
```

---

## Task 15: Lock it down and document it

The last conversion, then the settings that stop the tree drifting back.

**Files:**
- Convert: `src/App.jsx` → `.tsx`, `src/main.jsx` → `.tsx`
- Modify: `tsconfig.json`, `index.html`, `README.md`

**Interfaces:**
- Consumes: everything.
- Produces: a tree with no `.js`/`.jsx` left under `src/`, and `allowJs: false`.

- [ ] **Step 1: Convert App.jsx and main.jsx**

`App.tsx` is the biggest single file at 506 lines. Local component props need interfaces:

```tsx
function ModeTabs({ mode, onMode }: { mode: ModeKey; onMode: (key: ModeKey) => void }) { /* … */ }

function Dial({ label, max, value, onChange }: {
  label: string
  max: number
  value: number
  onChange: (n: number) => void
}) { /* … */ }
```

State needs explicit parameters where it starts empty or null:

```tsx
const [engines, setEngines] = useState<EngineKey[]>(['echarts'])
const [edgeOverrides, setEdgeOverrides] = useState<Map<string, EdgeStyleKey>>(new Map())
const [hover, setHover] = useState<{ id: string; at: Point } | null>(null)
const [selected, setSelected] = useState<{ id: string; tab: string } | null>(null)
const [stats, setStats] = useState<Partial<Record<EngineKey, number>>>({})
const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
const lastPositions = useRef<Positions | null>(null)
```

`COLUMNS[engines.length]` is `number | undefined` under `noUncheckedIndexedAccess` — the existing `|| 4` already handles it.

- [ ] **Step 2: Point index.html at the new entry**

`index.html` references `/src/main.jsx`. Change it to `/src/main.tsx`.

- [ ] **Step 3: Turn off allowJs**

In `tsconfig.json`, set `"allowJs": false` and delete `"checkJs": false`.

- [ ] **Step 4: Confirm nothing is left behind**

Run: `node -e "const {execSync}=require('child_process'); const out=execSync('git ls-files src').toString().trim().split('\n').filter(f=>/\.(js|jsx)$/.test(f)); console.log(out.length? 'STILL JS:\n'+out.join('\n') : 'clean — no .js or .jsx under src')"`

Expected: `clean`. Anything listed must be converted or deliberately excluded with a recorded reason.

- [ ] **Step 5: Run the full check and a production build**

```bash
npm run check
npm run build
```

Expected: both clean. `build` runs `tsc --noEmit` first, so a type error fails the build rather than shipping.

- [ ] **Step 6: Verify the built app**

Run: `npm run preview`. Open it, toggle all eight panes on at once, expand a few nodes. This is the last chance to catch something that works in dev and breaks in a production build — lazy chunk boundaries changed when the manifests moved.

- [ ] **Step 7: Rewrite the README**

Sections that are now wrong:

- The title and opening: no longer "A React **16.14** POC". React 19.2.8.
- The install block: `--legacy-peer-deps` should be gone; `npm test` now says Vitest; add `npm run check`.
- The note about the classic JSX runtime and pinned React 16 — delete, replace with the Node 24 `.nvmrc` requirement.
- The engine table: React Flow is now `@xyflow/react` 12.11; NVL's note changes from the hand-written wrapper to `@neo4j-nvl/react`.
- The test count: state the real number after this migration rather than "26 assertions".

Add a new section, which is the reason a teammate opens this file:

````markdown
## Adding a library

Four steps, and the compiler checks three of them.

```bash
npm install thelib
```

1. `src/thelib/TheLibGraph.tsx` — the adapter. Its props are
   `GraphPaneProps` from `src/engine/types.ts`; that interface is the whole
   contract and nothing else is passed in.
2. `src/thelib/engine.ts` — the manifest: `name`, `lib`, `note`, `surface`,
   `renderers` (first entry is the default), `caps` (one line per row of the
   capability grid), an optional `controls`, and `Component` as a
   `lazy(() => import('./TheLibGraph'))`.
3. Two lines in `src/engines.ts` — the import, and the entry in `ENGINES`.
   Position in that object is the order it appears in every table.
4. `npm run check`.

It then appears in Explore, Bench, Lab and Compare with no further work. A
missing capability, an empty `renderers`, or an adapter whose props do not
match is a compile error naming your file — not a blank pane.
````

- [ ] **Step 8: Note the invalidated benchmark data**

Add to the README's benchmark section, and to `bench-data/README.md`:

```markdown
> **Results predating 2026-09-02 are not comparable to current runs.** They were
> measured on React 16.14 with `react-flow-renderer` v9 and a hand-written NVL
> wrapper. The React 19 upgrade replaced both. Re-run the full sweep before
> reading across the old and new numbers.
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor: convert App and main, disable allowJs, rewrite the README

No .js or .jsx remains under src/, so allowJs is off and the tree
cannot drift back. npm run build now typechecks before it bundles.

README gains an 'Adding a library' section — four steps, three of
which the compiler checks — and a warning that benchmark data from
before this branch is not comparable to runs after it."
```

- [ ] **Step 10: Re-run the benchmark sweep**

The last substantive step, and the one that makes the bake-off usable again.

Run: `npm run dev`, open `#/bench`, and run the full matrix (the "run all engines" button). Export the results and replace `graph-bench-results.json`.

```bash
git add graph-bench-results.json bench-data/
git commit -m "chore: re-sweep the benchmark on React 19

First full matrix since the upgrade. Supersedes the React 16 numbers,
which are not comparable — @xyflow/react replaced react-flow-renderer
v9 and NVL now runs through Neo4j's own React wrapper."
```

- [ ] **Step 11: Open the pull request**

```bash
git push -u origin ts-migration
gh pr create --title "TypeScript migration, React 19, per-library engine manifests" --body "$(cat <<'EOF'
Implements `docs/superpowers/specs/2026-09-02-ts-migration-design.md`.

**Runtime:** Node 24.20 LTS, React 19.2.8, Vite 8.2.2, TypeScript 6.0.3.

**Two engines changed library.** `react-flow-renderer` is abandoned and caps
at React 18, so the pane was ported to `@xyflow/react` v12. NVL's 226-line
hand-written wrapper existed only because the official React package could not
install on React 16; it now can, so the wrapper is gone.

**Configuration is per-library.** Each engine owns an `engine.ts` beside its
adapter. `engines.ts` is eight imports and a `satisfies`, which keeps
`EngineKey` a literal union rather than widening to `string`. Adding a library
is two files and two lines, and getting it wrong is a compile error naming the
file rather than a blank pane.

**The contract is enforced.** `GraphPaneProps` replaces the twelve-prop doc
comment. `App` no longer knows any engine by name — the ECharts-only pickers
are declared via a `controls` field.

**Benchmark data was re-swept.** Results from before this branch were measured
on React 16 with two different libraries and are not comparable.

Read commit by commit; each phase stands alone and `npm run check` is green at
every one.
EOF
)"
```

---

## Self-Review

**Spec coverage.** Every section of the spec maps to a task: target versions → Tasks 1 and 5; React Flow → Task 3; NVL → Task 4; smaller React fallout → Task 1 steps 5–7; benchmark invalidation → Task 15 steps 8 and 10; the type layer → Task 6; `controls` → Task 9 step 4; registry structure → Task 9; the eight phases → Tasks 1–15; verification → the `npm run check` step ending every task; the `exactOptionalPropertyTypes` risk → Global Constraints and Task 11.

**Two places where the plan deliberately departs from the spec, both recorded above:**

1. The spec typed `edgeStyle` as `EdgeStyleKey`. That is wrong — `EDGE_RULES` is `EDGE_STYLES` *plus* the computed rules `kind`, `relation` and `depth`, so the picker's value is an `EdgeRuleKey`. Only `edgeOverrides` values are `EdgeStyleKey`. The spec has been corrected to match.
2. The spec implied `GraphEngine.Component` could be typed strictly from the start. It cannot: manifests land in Task 9 while adapters are still `.jsx` until Task 13. Task 9 step 1 adds a temporary union and Task 13 step 2 removes it, with step 4 proving the closed contract rejects a bad adapter.

**Sequencing check.** The React upgrade precedes everything so no adapter is migrated to TypeScript and then rewritten. `symbols.ts` is pulled forward into Task 6 because the appearance types derive from it. `store.ts`'s type is defined before its consumers in Task 14.

**Verification is real, not assumed.** Three tasks prove a check actually bites before trusting it: Task 6 step 5 (derived types are literal unions, not `string`), Task 10 step 3 (the contract test fails on an empty `renderers`), and Task 13 step 4 (the closed contract rejects a mismatched adapter).
