// Results, kept in localStorage.
//
// Not a nicety. A 50,000-node run on the DOM engines is expected to take the tab
// down with it, and a run that has to be repeated because the last one crashed
// after it finished is a run nobody does twice. Results are written the moment
// each one lands, so the matrix survives whatever the next engine does to the
// page.
//
// One row per (engine, scenario). Re-running overwrites, because the interesting
// comparison is across engines at settled knob values, not a history of tuning
// attempts — and the knobs used are stored on the row, so a row that was
// measured at different settings is visible rather than silently averaged in.

import { ENGINES } from '../engines.ts'
import type { BenchResult } from './types.ts'

const KEY = 'graph-bench-results-v1'

export type Results = Record<string, BenchResult>

/**
 * A stored row still names a library this build ships.
 *
 * The rows outlive the code that wrote them — they are keyed by engine, and an
 * engine key that is renamed or dropped leaves rows behind that every table
 * here would look up in the registry and get `undefined` from. `BenchResult`
 * says `engine` is an `EngineKey`, and this is the one place that is worth more
 * than an assertion, because the value comes back off disk rather than out of
 * the app.
 */
const isCurrent = (row: unknown): row is BenchResult =>
  typeof row === 'object' &&
  row !== null &&
  typeof (row as { engine?: unknown }).engine === 'string' &&
  (row as { engine: string }).engine in ENGINES

const read = (): Results => {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Record<string, unknown> | null
    if (!stored) return {}
    const out: Results = {}
    Object.keys(stored).forEach(key => {
      const row = stored[key]
      if (isCurrent(row)) out[key] = row
    })
    return out
  } catch {
    // A corrupted or unavailable store must not take the bench down with it —
    // the run is still worth doing, it just will not be remembered.
    return {}
  }
}

const write = (all: Results): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    // Quota, or a browser with storage disabled. Nothing to do but carry on.
  }
}

export const rowKey = (engine: string, scenario: string): string => `${engine}::${scenario}`

export const loadResults = read

export function saveResult(result: BenchResult): Results {
  const all = read()
  all[rowKey(result.engine, result.scenario)] = result
  write(all)
  return all
}

export function clearResults(): Results {
  write({})
  return {}
}

export function clearScenario(scenario: string): Results {
  const all = read()
  Object.keys(all).forEach(key => {
    if (all[key]?.scenario === scenario) delete all[key]
  })
  write(all)
  return all
}
