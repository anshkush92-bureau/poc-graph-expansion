// The wiring between one mounted engine and whatever is driving it.
//
// Lifted out of BenchView so the lab can drive the identical pane. Everything
// awkward about measuring a renderer lives here exactly once:
//
//   * `show()` resolves when there are **pixels**, not when the engine's update
//     call returned. The pane's own `onStat` is the signal, so nothing upstream
//     has to guess how long an engine needs.
//   * A pane that refuses to draw (v-network-graph past its ceiling) or has
//     crashed never calls back, so `show()` also carries a timeout — without it
//     one dead pane hangs every remaining row of a run.
//   * The hover path sets React state, because the real one does. Counting
//     callbacks without the render would measure how chatty the engine is and
//     miss the half of the cost a debounce exists to remove.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ROOT } from '../graph/data.ts'
import { layoutRadial } from '../graph/ops.ts'
import { nextPaint, sleep } from './probes.ts'
import { stopWorker } from './runLayout.ts'
import type { Graph, GraphPaneProps, Positions, ViewportHandle } from '../engine/types.ts'
import type { BenchContext, BenchResult, EngineKey, Knobs, Scenario } from './types.ts'

declare global {
  interface Window {
    /** The synchronous read seam for the hover counter — see the note below. */
    __benchHovers?: () => number
  }
}

export const EMPTY: Graph = { nodes: [ROOT], edges: [] }

const EMPTY_HIDDEN = new Map<string, number>()
const NEVER = () => false

// How long a single `show` may take before the caller gives up on the pane.
// Generous because the first show on a freshly-selected engine also covers
// downloading that library's chunk, and NVL's is half a megabyte.
const SHOW_TIMEOUT_MS = 45000

export function usePane() {
  const [data, setData] = useState(() => ({ graph: EMPTY, positions: layoutRadial(EMPTY, null) }))

  const paneRef = useRef<HTMLDivElement>(null)
  const viewport = useRef<ViewportHandle | null>(null)
  const lastStat = useRef<number | null>(null)
  // Resolver for the `show()` currently in flight. The pane's `onStat` fires it,
  // which is why every renderer in this repo reports one.
  const settle = useRef<((ms: number | null) => void) | null>(null)
  const abort = useRef({ aborted: false })

  const hoverCount = useRef(0)
  const hoverDebounce = useRef(0)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [, setHoverId] = useState<string | null>(null)

  useEffect(
    () => () => {
      abort.current.aborted = true
      clearTimeout(hoverTimer.current)
      // Leaving a solver running in a worker nobody is listening to keeps a core
      // busy for the rest of the session.
      stopWorker()
    },
    []
  )

  // A read seam for the hover counter, and it is not a convenience.
  //
  // The count lives in a ref, so the only place it surfaces is the lab's gauge —
  // which repaints on the HUD's own sampling schedule, not on each callback. A
  // driver that moves the pointer and reads the gauge immediately therefore reads
  // a stale number every time, and concludes the engine reported no hover at all.
  // That is exactly what happened: a run using real trusted pointer input scored
  // Cytoscape at "0 hits of 800" on a page where the first pass had already
  // measured it firing on every transition. The counter has to be readable
  // synchronously or the hover question cannot be asked from outside the page.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    window.__benchHovers = () => hoverCount.current
    return () => {
      delete window.__benchHovers
    }
  }, [])

  const onStat = useCallback((ms: number) => {
    lastStat.current = ms
    const resolve = settle.current
    if (!resolve) return
    settle.current = null
    // One more paint, so `show` resolves when there are pixels rather than when
    // the engine has finished building its elements. On the DOM panes the gap
    // between those two is most of the cost.
    nextPaint().then(() => resolve(ms))
  }, [])

  const onViewport = useCallback((api: ViewportHandle | null) => {
    viewport.current = api
  }, [])

  const onNodeHover = useCallback((id: string | null) => {
    hoverCount.current += 1
    if (!hoverDebounce.current) {
      setHoverId(id)
      return
    }
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setHoverId(id), hoverDebounce.current)
  }, [])

  const noop = useCallback(() => {}, [])

  const show = useCallback((graph: Graph, positions: Positions) => {
    lastStat.current = null
    return new Promise<number | null>(resolve => {
      settle.current = resolve
      setData({ graph, positions })
      sleep(SHOW_TIMEOUT_MS).then(() => {
        if (settle.current !== resolve) return
        settle.current = null
        resolve(null)
      })
    })
  }, [])

  /** Set the data and do NOT wait — the streaming path, on purpose. */
  const push = useCallback(
    (graph: Graph, positions: Positions) => setData({ graph, positions }),
    []
  )

  const clear = useCallback(() => show(EMPTY, layoutRadial(EMPTY, null)), [show])

  /**
   * The prop bundle every renderer in this repo takes.
   *
   * `hidden` is empty rather than computed: the "+N still hidden" badge is a
   * property of the explore view, and deriving it at 50,000 nodes would put the
   * app's own cost inside the engine's measurement.
   */
  const paneProps = useMemo<Omit<GraphPaneProps, 'graph' | 'positions'>>(
    () => ({
      hidden: EMPTY_HIDDEN,
      isExpanded: NEVER,
      isPending: NEVER,
      statusVersion: 0,
      shapeSet: 'type',
      edgeStyle: 'arrow',
      onNodeClick: noop,
      onNodeHover,
      onEdgeClick: noop,
      onBackgroundClick: noop,
      onStat,
      onViewport
    }),
    [noop, onNodeHover, onStat, onViewport]
  )

  /**
   * A fresh scenario context. Built per run rather than memoised, because
   * `signal` has to be the *current* abort token — a stale one means Stop stops
   * nothing.
   */
  const makeCtx = useCallback(
    (knobs: Knobs): BenchContext => ({
      knobs,
      show,
      push,
      lastStat: () => lastStat.current,
      viewport: () => viewport.current,
      pane: () => paneRef.current,
      hover: {
        count: () => hoverCount.current,
        reset: () => {
          hoverCount.current = 0
        },
        setDebounce: (ms: number) => {
          hoverDebounce.current = ms
        }
      },
      signal: abort.current
    }),
    [push, show]
  )

  const begin = useCallback(() => {
    abort.current = { aborted: false }
  }, [])

  const cancel = useCallback(() => {
    abort.current.aborted = true
    // A solver already in flight in the worker cannot be asked to stop; the
    // only lever is the terminate button.
    stopWorker()
  }, [])

  // Ref readers, memoised once. A fresh identity each render would make every
  // `useCallback` downstream that depends on one rebuild on every render.
  const readers = useMemo(
    () => ({
      aborted: () => abort.current.aborted,
      lastStat: () => lastStat.current,
      viewport: () => viewport.current,
      hoverCount: () => hoverCount.current,
      resetHover: () => {
        hoverCount.current = 0
      },
      setHoverDebounce: (ms: number) => {
        hoverDebounce.current = ms
      }
    }),
    []
  )

  return Object.assign(
    {
      data,
      paneRef,
      paneProps,
      show,
      push,
      clear,
      makeCtx,
      begin,
      cancel
    },
    readers
  )
}

/**
 * Runs one scenario and shapes the result row.
 *
 * A thrown scenario is a result too: "this engine could not complete the
 * 50,000-node hairball" belongs in the table, not in the console.
 */
export async function runScenario(
  engineKey: EngineKey,
  scenario: Scenario,
  knobs: Knobs,
  ctx: BenchContext
): Promise<BenchResult> {
  const startedAt = Date.now()
  let outcome
  try {
    outcome = await scenario.run(ctx)
  } catch (err) {
    outcome = { failed: err instanceof Error ? err.message : String(err), metrics: {} }
  }
  return { engine: engineKey, scenario: scenario.key, knobs, at: startedAt, ...outcome }
}
