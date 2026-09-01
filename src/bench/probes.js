// Measurement primitives.
//
// Nothing in here knows what a graph is. Each probe is handed a window of time
// and reports what the browser did during it, so the same four functions cover
// all eight engines and every scenario — which is the only way the numbers stay
// comparable. Anything engine-specific lives in the renderer's viewport handle,
// not here.

/** One frame's budget at 60 Hz. */
const BUDGET = 1000 / 60

const round = (n, places = 1) => {
  const f = Math.pow(10, places)
  return Math.round(n * f) / f
}

/**
 * Turn a list of frame deltas into the numbers worth reporting.
 *
 * p95 rather than a mean, because a mean is the one statistic that hides the
 * failure a reader actually notices: 16.8 ms average is what you get from a
 * steady 60 fps *and* from 56 clean frames plus four 90 ms stalls a second. The
 * second one looks broken and the first does not.
 *
 * `dropped` counts frames the browser never got to present, not frames that ran
 * slow — a 100 ms delta is one frame that arrived plus five that did not.
 */
export function summarise(deltas) {
  if (!deltas.length) {
    return { frames: 0, fps: 0, p50: null, p95: null, worst: null, dropped: 0 }
  }
  const sorted = deltas.slice().sort((a, b) => a - b)
  const at = q => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]
  const total = deltas.reduce((sum, d) => sum + d, 0)
  return {
    frames: deltas.length,
    fps: round((1000 * deltas.length) / total),
    p50: round(at(0.5)),
    p95: round(at(0.95)),
    worst: round(sorted[sorted.length - 1]),
    dropped: deltas.reduce((sum, d) => sum + Math.max(0, Math.round(d / BUDGET) - 1), 0)
  }
}

/**
 * Frame sampler with no fixed end — stop it when whatever you were measuring
 * finishes.
 *
 * This is the shape the layout scenario needs. A synchronous layout on the main
 * thread blocks `requestAnimationFrame` outright, so the sampler cannot count
 * down to a deadline while it runs: it simply records one enormous delta, which
 * *is* the answer. A fixed-duration sampler would have to guess a window long
 * enough to contain a layout whose duration is the thing being measured.
 */
export function startFrames() {
  const deltas = []
  let last = performance.now()
  let skipped = false
  let live = true

  const tick = now => {
    const delta = now - last
    last = now
    // The first delta spans whatever happened before the sampler started —
    // usually the build that set the scenario up — and is not a frame cost.
    if (skipped) deltas.push(delta)
    else skipped = true
    if (live) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  return {
    stop() {
      live = false
      return summarise(deltas)
    }
  }
}

/**
 * Frame sampler for a fixed window, driving `step(progress, elapsed)` once per
 * frame.
 *
 * The step callback is where a scripted zoom or pan lives, so the interaction
 * is driven at exactly the rate the engine can present frames — pushing
 * transforms from a `setInterval` instead would queue work the renderer never
 * gets to show and turn the measurement into a queue-depth test.
 */
export function sampleFrames(ms, step) {
  return new Promise(resolve => {
    const deltas = []
    const t0 = performance.now()
    let last = t0
    let skipped = false

    const tick = now => {
      const delta = now - last
      last = now
      if (skipped) deltas.push(delta)
      else skipped = true

      const elapsed = now - t0
      if (step) step(Math.min(1, elapsed / ms), elapsed)
      if (elapsed < ms) requestAnimationFrame(tick)
      else resolve(summarise(deltas))
    }
    requestAnimationFrame(tick)
  })
}

/**
 * Main-thread blocking, via the `longtask` performance entry.
 *
 * This is the number that answers "does this library lock the UI thread", and
 * it is the only one that stays meaningful when the work happens somewhere the
 * frame sampler cannot see it — a layout in a worker produces zero long tasks
 * *and* clean frames, which is the whole point of the worker comparison.
 *
 * Only Chromium implements the entry type. Returning `null` rather than zeroes
 * elsewhere is deliberate: a reported 0 ms blocked reads as "never blocked",
 * which is a much worse lie than "not measured here".
 */
export function watchLongTasks() {
  const entries = []
  let observer = null
  try {
    observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => entries.push(entry))
    })
    observer.observe({ entryTypes: ['longtask'] })
  } catch (err) {
    return { stop: () => null }
  }
  return {
    stop() {
      // `takeRecords` before disconnecting, and this is not belt-and-braces.
      // A PerformanceObserver's callback is delivered on a later task, so an
      // entry for work that finished microseconds ago has not arrived yet —
      // stopping straight after an awaited solve reported a flat 0 ms blocked
      // for a layout that had visibly frozen the tab. `takeRecords` drains what
      // is pending synchronously.
      observer.takeRecords().forEach(entry => entries.push(entry))
      observer.disconnect()
      return {
        count: entries.length,
        blockedMs: Math.round(entries.reduce((sum, e) => sum + e.duration, 0)),
        longestMs: Math.round(entries.reduce((max, e) => Math.max(max, e.duration), 0))
      }
    }
  }
}

/**
 * Used JS heap, in MB, or `null` where the browser will not say.
 *
 * `performance.memory` is Chromium-only and it is a coarse, GC-scheduled
 * number — a single reading means very little. It is worth having anyway,
 * because the streaming test does not read it once: it reads it at the start,
 * at the end, and again after the graph has been emptied, and *that* difference
 * is a leak signal rather than a snapshot.
 */
export const heapMB = () =>
  (performance.memory ? round(performance.memory.usedJSHeapSize / (1024 * 1024), 2) : null)

/**
 * Resolves once the change you just made has actually been painted.
 *
 * One `requestAnimationFrame` fires *before* the paint it belongs to, so a
 * single frame only proves the browser is about to draw. The second callback
 * runs on the following frame, by which point the first has been presented —
 * this is the difference between time-to-render and time-to-first-*visible*,
 * and on the DOM engines it is a large difference.
 */
export const nextPaint = () =>
  new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve(performance.now())))
  })

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Asks the browser to collect garbage, if it has been started with
 * `--js-flags="--expose-gc"`. Almost always absent, so heap deltas are noisy by
 * default — this makes them less so where it is available and costs nothing
 * where it is not.
 */
export const collectGarbage = async () => {
  if (typeof window !== 'undefined' && typeof window.gc === 'function') window.gc()
  // A frame plus a macrotask gives an idle-time collector a chance either way.
  await nextPaint()
  await sleep(60)
}

export { round }
