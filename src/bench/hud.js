// The live readout.
//
// The scenarios in `scenarios.js` measure a *scripted* window: they start a
// sampler, drive something, stop it, and report one row. That is the right shape
// for a comparison and the wrong shape for the lab, where the whole point is
// that you drag a slider yourself and watch what happens.
//
// So this is the same arithmetic (`summarise` from probes.js — one definition of
// fps and p95 for the whole repo) over a rolling window that never stops.
//
// Two deliberate differences from a scenario's sampler, both of which matter
// when reading the numbers:
//
//   * It reports twice a second, not once per frame. A setState per frame would
//     put a React render inside the thing being measured.
//   * `blockedMs` is per report window, and a PerformanceObserver delivers its
//     entries on a later task — so a long task at the very end of one window is
//     usually counted in the next. Fine for a live gauge, which is why the
//     scripted scenarios do not read it this way.

import { useEffect, useState } from 'react'
import { heapMB, summarise } from './probes.js'

export const IDLE = { frames: 0, fps: 0, p50: null, p95: null, worst: null, dropped: 0, heapMB: null, blockedMs: null }

// ~3 seconds at 60 Hz. Long enough that one stutter does not own the gauge,
// short enough that the gauge still answers "what is it doing *now*".
const WINDOW = 180
const REPORT_MS = 500

/**
 * Rolling frame / heap / long-task readout, or `IDLE` when switched off.
 *
 * `active` is false while a scripted scenario runs. Not because the sampler is
 * expensive — one closure a frame is nothing — but because a scenario's own
 * numbers are the record, and two gauges disagreeing on screen invites reading
 * the wrong one.
 */
export function useHud(active) {
  const [hud, setHud] = useState(IDLE)

  useEffect(() => {
    if (!active) return undefined

    let live = true
    let last = performance.now()
    let reported = last
    let first = true
    let blocked = 0
    const deltas = []

    let observer = null
    try {
      observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => { blocked += entry.duration })
      })
      observer.observe({ entryTypes: ['longtask'] })
    } catch (err) {
      // Chromium only. `null` rather than a zero, for the same reason as probes.
      observer = null
    }

    const tick = now => {
      const delta = now - last
      last = now
      // The first delta spans whatever happened before the gauge started —
      // usually the build that put the graph on screen — and is not a frame.
      if (first) first = false
      else {
        deltas.push(delta)
        if (deltas.length > WINDOW) deltas.shift()
      }

      if (now - reported >= REPORT_MS) {
        reported = now
        const window = Math.round(blocked)
        blocked = 0
        setHud(Object.assign({}, summarise(deltas), {
          heapMB: heapMB(),
          blockedMs: observer ? window : null
        }))
      }

      if (live) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    return () => {
      live = false
      if (observer) observer.disconnect()
    }
  }, [active])

  return active ? hud : IDLE
}
