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

const KEY = 'graph-bench-results-v1'

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    // A corrupted or unavailable store must not take the bench down with it —
    // the run is still worth doing, it just will not be remembered.
    return {}
  }
}

const write = all => {
  try {
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    // Quota, or a browser with storage disabled. Nothing to do but carry on.
  }
}

export const rowKey = (engine, scenario) => `${engine}::${scenario}`

export const loadResults = read

export function saveResult(result) {
  const all = read()
  all[rowKey(result.engine, result.scenario)] = result
  write(all)
  return all
}

export function clearResults() {
  write({})
  return {}
}

export function clearScenario(scenario) {
  const all = read()
  Object.keys(all).forEach(key => {
    if (all[key].scenario === scenario) delete all[key]
  })
  write(all)
  return all
}
