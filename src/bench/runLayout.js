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
import { forceLayout } from './force.js'

let worker = null
let nextId = 1

/**
 * The worker is created once and kept.
 *
 * Spinning one up per run would put module parsing and d3-force's own
 * initialisation inside every measurement, which at small graph sizes is most
 * of the number. A benchmark should measure the steady state.
 */
function ensureWorker() {
  if (!worker) {
    worker = new Worker(new URL('./layout.worker.js', import.meta.url), { type: 'module' })
  }
  return worker
}

/** Kills the worker mid-solve. The only way to abort a run that has hung. */
export function stopWorker() {
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
const forTransfer = graph => ({
  nodes: graph.nodes.map(n => ({ id: n.id })),
  edges: graph.edges.map(e => ({ id: e.id, source: e.source, target: e.target }))
})

export function layoutOnMain(graph, mode, options) {
  const started = performance.now()
  const result =
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

export function layoutInWorker(graph, mode, options) {
  return new Promise((resolve, reject) => {
    const instance = ensureWorker()
    const id = nextId++
    const started = performance.now()

    const onMessage = event => {
      if (event.data.id !== id) return
      instance.removeEventListener('message', onMessage)
      if (!event.data.ok) {
        reject(new Error(event.data.error))
        return
      }
      const totalMs = Math.round(performance.now() - started)
      resolve({
        positions: event.data.positions,
        ticks: event.data.ticks,
        alpha: event.data.alpha,
        converged: event.data.converged,
        solveMs: event.data.solveMs,
        totalMs,
        transferMs: Math.max(0, totalMs - event.data.solveMs)
      })
    }

    instance.addEventListener('message', onMessage)
    instance.postMessage({ id, graph: forTransfer(graph), mode, options })
  })
}

export const runLayout = (
  graph,
  { mode = 'radial', worker: offThread = false, ...options } = {}
) =>
  offThread
    ? layoutInWorker(graph, mode, options)
    : Promise.resolve(layoutOnMain(graph, mode, options))
