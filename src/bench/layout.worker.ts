// The layout worker.
//
// It runs the *same two functions* the main thread runs — `layoutRadial` from
// the shared graph layer and `forceLayout` from this folder — so the worker/no
// worker comparison is one variable, not two implementations. If this file had
// its own solver the numbers would be meaningless.
//
// What crosses the boundary is worth knowing, because it is the cost the
// worker charges you for the freeze it removes:
//
//   in   { nodes: [{id, ...}], edges: [{id, source, target}] }
//   out  { [id]: {x, y} }
//
// Both are structured-cloned, which at 50,000 nodes is a real serialisation
// pass on each side. That is measured too — `runLayout` reports the round trip
// as well as the solve, and the gap between them is the transfer.

import { layoutRadial } from '../graph/ops.ts'
import { forceLayout } from './force.ts'
import type { ForceOptions } from './force.ts'
import type { Graph, Positions } from '../engine/types.ts'

export type LayoutMode = 'radial' | 'force'

export interface LayoutRequest {
  id: number
  graph: Graph
  mode: LayoutMode
  options?: ForceOptions
}

export type LayoutResponse =
  | {
      id: number
      ok: true
      positions: Positions
      ticks: number | null
      alpha: number | null
      converged: boolean
      solveMs: number
    }
  | { id: number; ok: false; error: string }

/**
 * `self` is typed as a Window here because the app compiles against lib.dom —
 * pulling in lib.webworker instead would retype the whole project. One local
 * view of the two members this file uses is cheaper and just as safe.
 */
const scope = self as unknown as {
  onmessage: ((event: MessageEvent<LayoutRequest>) => void) | null
  postMessage(message: LayoutResponse): void
}

scope.onmessage = event => {
  const { id, graph, mode, options } = event.data
  const started = performance.now()

  try {
    // Radial takes no `prev`: the incremental path is O(n²) and exists to keep
    // an expansion from re-arranging the screen, which is not what a one-shot
    // layout benchmark is measuring.
    const result =
      mode === 'force'
        ? forceLayout(graph, options)
        : { positions: layoutRadial(graph, null), ticks: null, alpha: null, converged: true }

    scope.postMessage({
      id,
      ok: true,
      positions: result.positions,
      ticks: result.ticks,
      alpha: result.alpha,
      converged: result.converged,
      // Solve time as the worker sees it, excluding both clone passes.
      solveMs: Math.round(performance.now() - started)
    })
  } catch (err) {
    scope.postMessage({ id, ok: false, error: err instanceof Error ? err.message : String(err) })
  }
}
