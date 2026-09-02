// One entry point for "lay this graph out", on the main thread or off it.
//
// Both paths return the same shape so a scenario can flip the `worker` knob and
// change nothing else. The two numbers that matter are kept apart:
//
//   solveMs  what the layout itself cost, wherever it ran
//   totalMs  what the caller waited, including both structured-clone passes
//
// On the main thread they are the same number. Off it, `totalMs - solveMs` is
// the price of the boundary, and it is not small at 50,000 nodes — which is the
// honest counterweight to "just put it in a worker".

import { layoutRadial } from '../graph/ops.ts'
import { forceLayout } from './force.ts'
import type { ForceOptions } from './force.ts'
import type { LayoutMode, LayoutRequest, LayoutResponse } from './layout.worker.ts'
import type { Graph, Positions } from '../engine/types.ts'

export interface LayoutRun {
  positions: Positions
  ticks: number | null
  alpha: number | null
  converged: boolean
  solveMs: number
  totalMs: number
  transferMs: number
}

export interface RunLayoutOptions extends ForceOptions {
  mode?: LayoutMode
  worker?: boolean
}

let worker: Worker | null = null
let nextId = 1

/**
 * The worker is created once and kept.
 *
 * Spinning one up per run would put module parsing and d3-force's own
 * initialisation inside every measurement, which at small graph sizes is most
 * of the number. A benchmark should measure the steady state.
 */
function ensureWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./layout.worker.ts', import.meta.url), { type: 'module' })
  }
  return worker
}

/** Kills the worker mid-solve. The only way to abort a run that has hung. */
export function stopWorker(): void {
  if (worker) {
    worker.terminate()
    worker = null
  }
}

/**
 * Strips the graph down to what a layout actually reads.
 *
 * Nodes carry a name, a risk score, a first-seen date and half a dozen other
 * fields no solver looks at, and every one of them is structured-cloned on the
 * way into the worker and has no counterpart on the way out. Sending the whole
 * node at 50,000 nodes charges the worker path a serialisation cost the main
 * thread never pays, which would make the comparison flattering in the wrong
 * direction.
 */
const forTransfer = (graph: Graph): Graph => ({
  // Cast: a layout reads ids and endpoints and nothing else, so the trimmed
  // objects stand in for full ones rather than the boundary carrying a second
  // graph type through every signature below.
  nodes: graph.nodes.map(n => ({ id: n.id })) as Graph['nodes'],
  edges: graph.edges.map(e => ({ id: e.id, source: e.source, target: e.target })) as Graph['edges']
})

export function layoutOnMain(graph: Graph, mode: LayoutMode, options?: ForceOptions): LayoutRun {
  const started = performance.now()
  const result: {
    positions: Positions
    ticks: number | null
    alpha: number | null
    converged: boolean
    ms?: number
  } =
    mode === 'force'
      ? forceLayout(graph, options)
      : { positions: layoutRadial(graph, null), ticks: null, alpha: null, converged: true }
  const totalMs = Math.round(performance.now() - started)
  return {
    positions: result.positions,
    ticks: result.ticks,
    alpha: result.alpha,
    converged: result.converged,
    solveMs: result.ms == null ? totalMs : result.ms,
    totalMs,
    transferMs: 0
  }
}

export function layoutInWorker(
  graph: Graph,
  mode: LayoutMode,
  options?: ForceOptions
): Promise<LayoutRun> {
  return new Promise<LayoutRun>((resolve, reject) => {
    const instance = ensureWorker()
    const id = nextId++
    const started = performance.now()

    const onMessage = (event: MessageEvent<LayoutResponse>) => {
      const data = event.data
      if (data.id !== id) return
      instance.removeEventListener('message', onMessage)
      if (!data.ok) {
        reject(new Error(data.error))
        return
      }
      const totalMs = Math.round(performance.now() - started)
      resolve({
        positions: data.positions,
        ticks: data.ticks,
        alpha: data.alpha,
        converged: data.converged,
        solveMs: data.solveMs,
        totalMs,
        transferMs: Math.max(0, totalMs - data.solveMs)
      })
    }

    instance.addEventListener('message', onMessage)
    const request: LayoutRequest = {
      id,
      graph: forTransfer(graph),
      mode,
      ...(options && { options })
    }
    instance.postMessage(request)
  })
}

export const runLayout = (
  graph: Graph,
  { mode = 'radial', worker: offThread = false, ...options }: RunLayoutOptions = {}
): Promise<LayoutRun> =>
  offThread
    ? layoutInWorker(graph, mode, options)
    : Promise.resolve(layoutOnMain(graph, mode, options))
