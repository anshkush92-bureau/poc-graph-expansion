# TypeScript migration, runtime upgrade, and a per-library engine contract

**Date:** 2026-09-02
**Status:** approved, not yet implemented
**Branch:** `ts-migration`

## Context

This repo is a bake-off harness, not a product. It renders one shared identity
graph through eight graph libraries at once so they can be compared on
identical data and identical behaviour, and it ships a benchmark runner
(`bench/`), a per-library lab, and a comparison matrix alongside the explore
view.

Two things prompted this work:

1. The repo is about to be shared with another engineer, and the adapter
   contract — twelve props that every renderer must accept — exists only as a
   doc comment in `engines.js`. Getting it wrong produces a blank pane at
   runtime, not an error.
2. All eight libraries' configuration lives in one 197-line `engines.js`. That
   file is the thing that does not scale to a second contributor adding a
   ninth library.

The bake-off has **not** produced a winner. All eight engines stay.

## Goals

- Migrate the whole `src/` tree from JS/JSX to TypeScript under full strict
  settings, so the adapter contract is enforced by the compiler.
- Make configuration per-library: a library's manifest lives next to its
  adapter, and adding one touches two new files plus two lines of shared code.
- Upgrade the runtime to current versions — Node LTS, React, Vite.
- Leave a `npm run check` that a contributor can run before pushing.

## Non-goals

- **No SaaS work.** No auth, tenancy, billing, backend, or persistence. This
  repo answers "which library"; productionising the winner is a separate
  project with its own spec, and starting it now would mean carrying seven
  losing libraries into it. Revisit once the bake-off concludes.
- **No behaviour changes.** This is a type migration plus a version bump. If
  `tsc` surfaces a genuine bug, it gets fixed in its own commit and called out,
  not folded into a mechanical phase.
- No runtime schema validation (zod and friends), beyond a guard on the one
  place that already parses untrusted input — `bench/store.js`'s `localStorage`
  read.
- No branded ID types. Plain `string` for node and edge ids.
- No CI workflow. `npm run check` is the contract; add GitHub Actions later if
  the team wants it.

## Target versions

Verified against the npm and nodejs.org registries on 2026-09-02.

| | From | To | Note |
|---|---|---|---|
| Node | unpinned | **24.20.0 LTS ("Krypton")** | 26.8.1 exists but is Current, not LTS |
| React / ReactDOM | 16.14.0 | **19.2.8** | React has no LTS track; this is latest stable |
| Vite | 5.4.11 | **8.2.2** | three majors |
| `@vitejs/plugin-react` | 4.3.4 | **6.1.1** | peers `vite ^8` |
| TypeScript | — | **6.0.3** | *not* 7.0.2 — see below |
| Vitest | — | 4.1.11 | peers `vite ^6 \|\| ^7 \|\| ^8` |
| ESLint | — | 10.9.1 | |
| typescript-eslint | — | 8.69.0 | |
| `eslint-plugin-react-hooks` | — | 7.1.1 | supports eslint ^10 |
| Prettier | — | 3.9.6 | |
| `@types/react` / `-dom` | — | 19.2.18 / 19.2.5 | |

### Why TypeScript 6.0.3 and not 7.0.2

TypeScript 7.0.2 is the current release, but `typescript-eslint@8.69.0` peers
`typescript >=4.8.4 <6.1.0`, and its `canary` tag carries the same range. Since
we are adopting typescript-eslint, TypeScript caps at 6.0.3. Bump when
typescript-eslint ships TS 7 support; nothing in this design depends on a TS 7
feature.

## Runtime upgrade fallout

Six of the eight libraries are vanilla JS or Vue and are indifferent to the
React version: `cytoscape`, `echarts`, `vis-network`, `fusioncharts`,
`@jsplumb/browser-ui`, `v-network-graph`. Two are not.

### React Flow must change package

`react-flow-renderer` is abandoned. The installed version is 9.7.4; the
package's final release is 10.3.17, published in 2022, peering
`react 16 || 17 || 18`. It cannot run on React 19.

The maintained successor is **`@xyflow/react@12.11.6`**. This is a rewrite of
`src/flow/FlowGraph.jsx` (271 lines), not a migration:

- package rename, and the CSS import path moves
- the single `elements` prop splits into `nodes` and `edges`
- `useZoomPanHelper` is replaced by `useReactFlow`
- `onlyRenderVisibleElements` and the node-type registration API both moved

The pane keeps its contract — same `GraphPaneProps` in, same `ViewportHandle`
out — so nothing outside `src/flow/` changes.

### NVL switches to the official React package

`src/nvl/NvlGraph.jsx` is 226 lines of hand-written wrapper, and `engines.js`
records the reason: "the React package cannot install on 16."
`@neo4j-nvl/react@1.2.1` peers `18.0.0 || ^19.0.0`, so on React 19 that
constraint is gone.

We delete the hand-written wrapper and use `@neo4j-nvl/react`. This changes
what the NVL row measures — from our render path to Neo4j's — and the README
must say so.

### Smaller fallout, handled in passing

- `unstable_batchedUpdates` in `graph/useGraph.js:2` is dead weight under React
  18+ automatic batching. Delete the import and the wrapper call.
- The classic JSX runtime goes away: drop `jsxRuntime: 'classic'` from
  `vite.config`, set `jsx: "react-jsx"` in `tsconfig`. The `import React from
  'react'` lines at the top of every component become unnecessary.
- `npm install --legacy-peer-deps` should no longer be required. Verify on a
  clean `node_modules` and update the README.
- The README's framing ("A React **16.14** POC…") is rewritten.

### Benchmark data is invalidated

`graph-bench-results.json` and everything in `bench-data/` were measured on
React 16 with the current library versions. After this branch lands they are
not comparable to new runs, and the bake-off is still live. **The full sweep
must be re-run before anyone reads the numbers again.** This is a known,
accepted cost of the upgrade.

## The type layer — `src/engine/types.ts`

Domain types first, because this is where `noUncheckedIndexedAccess` pays for
itself.

```ts
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
  synthetic?: boolean
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
  synthetic?: boolean
}

export interface Graph { nodes: GraphNode[]; edges: GraphEdge[] }

export interface Point { x: number; y: number }
export type Positions = Record<string, Point>
```

Under `noUncheckedIndexedAccess`, `positions[node.id]` types as
`Point | undefined`. `CytoscapeGraph` already guards this
(`const at = positions[node.id]; if (!at) return`); the adapters that do not
are real bugs, and finding them is a goal of this migration rather than an
obstacle to it.

The engine contract. `ShapeSetKey` and `EdgeStyleKey` are derived in
`echarts/symbols.ts` as `keyof typeof SHAPE_SETS` and `keyof typeof EDGE_RULES`
and re-exported from `engine/types.ts`, so adding a shape set or an edge style
widens the prop type automatically. `LazyExoticComponent` and `ComponentType`
are React's own, imported from `react`.

```ts
export interface ViewportHandle {
  zoomBy(factor: number): void
  panBy(dx: number, dy: number): void
  fit(): void
}

export interface GraphPaneProps {
  graph: Graph
  positions: Positions
  hidden: ReadonlyMap<string, number>
  isExpanded(id: string): boolean
  isPending(id: string): boolean
  statusVersion: number

  renderer?: string

  shapeSet?: ShapeSetKey
  edgeStyle?: EdgeStyleKey
  edgeOverrides?: ReadonlyMap<string, EdgeStyleKey>

  onNodeClick(id: string): void
  onNodeHover(id: string | null, at: Point | null): void
  onEdgeClick(id: string): void
  onBackgroundClick(): void
  onStat?(ms: number): void
  onViewport?(handle: ViewportHandle | null): void
}

export type CapKey = 'viewport' | 'layout' | 'lod' | 'culling' | 'images' | 'routing'
export type ControlKey = 'shapeSet' | 'edgeStyle'

export interface GraphEngine {
  name: string
  lib: string
  note: string
  surface: string
  renderers: readonly [string, ...string[]]
  caps: Record<CapKey, string | null>
  controls?: readonly ControlKey[]
  Component: LazyExoticComponent<ComponentType<GraphPaneProps>>
}
```

Two details carry real weight:

- **`renderers` is a non-empty tuple.** `readonly [string, ...string[]]` makes
  `renderers[0]` safe under `noUncheckedIndexedAccess`. `BenchView` relies on
  that at lines 63 and 84, today without a guard.
- **`caps` is a total `Record<CapKey, …>`.** Adding a row to `CAP_ROWS` becomes
  a compile error in every engine that has not declared it, so the Compare grid
  can never render a hole.

### `controls` replaces the `showsEcharts` hardcode

`App.jsx:238` computes `showsEcharts` and branches on it to show the shape and
edge-style pickers. That is replaced by `controls: ['shapeSet', 'edgeStyle']` in
ECharts' own manifest. App renders a picker when *any* selected engine declares
it, and the "clear N edge styles" button follows the same rule. A future engine
opts in with one array entry and no change to App.

## Registry structure

```
src/
  engine/types.ts              contract + domain types
  engines.ts                   barrel: 8 imports, 8 entries, satisfies
  echarts/
    engine.ts                  ECharts' manifest, beside the code it describes
    EChartsGraph.tsx           adapter, props: GraphPaneProps
    symbols.ts
  cytoscape/
    engine.ts
    CytoscapeGraph.tsx
  … six more
```

```ts
// src/engines.ts
import echarts from './echarts/engine'
import cytoscape from './cytoscape/engine'
// … six more

export const ENGINES = {
  echarts, fusion, cytoscape, vis, vng, jsplumb, nvl, flow,
} satisfies Record<string, GraphEngine>

export type EngineKey = keyof typeof ENGINES
export const ENGINE_KEYS = Object.keys(ENGINES) as EngineKey[]
```

An explicit barrel rather than `import.meta.glob` auto-discovery. Glob would
make adding a library a zero-line change, but `EngineKey` would collapse from a
literal union to `string` — losing exhaustiveness checking and autocomplete
across every consumer, which is most of what strict TS is buying here. It would
also make table order filesystem-dependent (today's order is deliberate), fail
silently on a mistyped folder, and need extra configuration for the Vitest node
environment. Two lines per engine is the whole price of avoiding that.

**Adding a library becomes:** `npm i thelib`, create `src/thelib/engine.ts` and
`src/thelib/TheLibGraph.tsx`, add two lines to the barrel. It then appears in
Explore, Bench, Lab, Compare and the lab route table automatically, and any
mistake is a compile error rather than an empty pane.

## Phases

One commit per phase on the `ts-migration` branch. `npm test` green at every
commit. The two genuinely risky pieces — the React upgrade and the adapter
typing — are deliberately in separate phases, so a failure points at one cause.

**1 — Runtime upgrade, still JavaScript.**
Node 24.20.0 (`.nvmrc` + `engines` field), React 19.2.8, Vite 8.2.2,
`@vitejs/plugin-react` 6.1.1. Drop `jsxRuntime: 'classic'`. Delete
`unstable_batchedUpdates`. Replace `react-flow-renderer` with `@xyflow/react`
and port `FlowGraph.jsx`. Replace the hand-written NVL wrapper with
`@neo4j-nvl/react`. Still `node --test`, still `.jsx`.
*Done when:* 50 assertions pass, dev server runs, all eight panes render, a
clean install needs no `--legacy-peer-deps`.

**2 — TS and lint harness, no `.ts` files yet.**
TypeScript 6.0.3, `tsconfig.json` (`strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noFallthroughCasesInSwitch`, `jsx: "react-jsx"`,
`moduleResolution: "bundler"`, `allowJs: true`, `checkJs: false`). Vitest 4 —
convert the 50 assertions, which is near-mechanical since they already use
`node:assert/strict` and only the `import test from 'node:test'` line changes.
ESLint 10 flat config + typescript-eslint + `eslint-plugin-react-hooks`.
Prettier configured to the existing house style — single quotes, **no
semicolons**, 100 columns — so the migration diff stays about types rather than
punctuation. Add `npm run check`.

**3 — Domain types and the graph layer.**
`src/engine/types.ts`, then `graph/{data,ops,loops,synth,useGraph}.ts` and their
tests. Expect `noUncheckedIndexedAccess` to bite on `ENTITY[node.type]`,
`RELATION[key]`, and `positions[id]`.

**4 — Route and UI.**
`route.ts`, `ui/{theme,useResize}.ts`, `ui/{HoverCard,SidePanel}.tsx`. Small.

**5 — The registry.**
Eight `engine.ts` manifests, the barrel, `controls`, and removal of
`showsEcharts` from App. Add a Vitest contract test asserting every registered
engine has a non-empty `renderers`, a `caps` entry for every `CapKey`, and a
lazy `Component` — extending the check that `bench.test.js:187` already does for
`renderers`.

**6 — The eight adapters to `.tsx`.**
The largest phase. Eight of ten dependencies ship their own types; only
`fusioncharts` needs a hand-written `.d.ts`, kept local to `src/fusion/` rather
than global, and `d3-force` uses `@types/d3-force`. `VngGraph` — a Vue 3 island
mounted inside React — is the hardest single file, mixing two frameworks' types
in one module. If one adapter fights hard it gets a local shim and the branch
moves on.

**7 — `bench/` to TS.**
Scenarios, probes, force, optimize, runLayout, hud, usePane, store, the layout
worker, and the four views. `store.ts` needs a real runtime guard: `JSON.parse`
no longer returns something assignable to the result type for free.

**8 — Lockdown.**
`allowJs: false`. Clean `tsc --noEmit`, clean `eslint`, all tests green. Rewrite
the README: new versions, the `@xyflow/react` and NVL changes, and a new
"Adding a library" section. Re-run the full benchmark sweep and replace the
stale result files.

## Verification

`npm run check` = `tsc --noEmit && eslint . && vitest run`.

At every phase boundary: the check passes, and the dev server renders all eight
panes. Phases 1 and 6 additionally get a manual pass over each pane — expand a
node, drag the viewport, confirm the stat readout updates — because the type
system cannot see a renderer that silently draws nothing.

## Risks

- **Phase 6 is the schedule risk.** Adapter typing quality varies, and the Vue
  island is genuinely awkward. Mitigation: local `.d.ts` shims rather than
  blocking.
- **Phase 1 is the correctness risk.** Two adapters change library, and React
  19's stricter effect and ref semantics may surface latent bugs in panes that
  currently work by accident. It is first and isolated for exactly this reason.
- **`exactOptionalPropertyTypes` is the strictest setting here** and interacts
  badly with some third-party prop types. If it forces widespread `| undefined`
  noise in adapter code specifically, relax it there and record why.
- Vite 5 → 8 is three majors; the worker import (`?worker`) and the lazy-chunk
  splitting both need a look.

## Deferred

The SaaS product — auth, multi-tenancy, a real graph backend behind
`fetchNeighbors`, billing — is out of scope and gets its own spec once the
bake-off names a winner. `graph/data.js` is already the seam: it is a stubbed
`setTimeout` today, and its comment ("Swap `fetchNeighbors` for a real Cypher
call and nothing else in the app changes") is the interface that spec will
start from.
