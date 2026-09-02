import React, { useMemo, useState } from 'react'
import { CAP_ROWS, ENGINES, ENGINE_KEYS } from '../engines.ts'
import { SCENARIOS } from './scenarios.ts'
import { ResultTable, format, rowLabel } from './table.tsx'
import { clearResults, loadResults } from './store.ts'
import type { BenchResult, EngineKey, MetricValue } from './types.ts'

/** The one number worth ranking a scenario on, and which way is better. */
interface Headline {
  metric: string
  label: string
  unit: string
  lowerIsBetter: boolean
}

/**
 * Everything measured so far, in one place.
 *
 * Two halves, and the split is deliberate. The tables at the bottom are what
 * this repo *measured*; the grid at the top is what the libraries *are*, read
 * off their APIs rather than timed. Mixing the two into one score is how
 * comparisons like this usually go wrong — "fastest" and "can draw an avatar
 * on a node" are not commensurable, and a reader choosing a library needs both
 * kept apart.
 *
 * The summary row at the very top picks one headline number per scenario and
 * ranks the engines on it. It is a convenience, not a verdict: the number it
 * ranks on is named in the header so it can be argued with.
 */

/**
 * The rows of the headline grid: one per (engine, paint backend), in registry
 * order with each engine's default backend first.
 *
 * Not derived from what has been measured — an engine that has never run still
 * gets its row, blank, and so does the WebGL half of one that has only been run
 * on canvas. A grid that hides the cells nobody has filled in reads as if there
 * were nothing left to measure.
 */
const HEADLINE_ROWS = ENGINE_KEYS.flatMap(engine =>
  ENGINES[engine].renderers.map(renderer => ({ engine, renderer }))
)

const HEADLINE: Record<string, Headline> = {
  hairball: { metric: 'ttfrMs', label: 'time to first render', unit: 'ms', lowerIsBetter: true },
  stream: {
    metric: 'fps',
    label: 'frames per second under churn',
    unit: 'fps',
    lowerIsBetter: false
  },
  zoompan: {
    metric: 'frameP95',
    label: '95th-percentile frame time',
    unit: 'ms',
    lowerIsBetter: true
  },
  layout: {
    metric: 'worstFrameMs',
    label: 'longest frozen frame during layout',
    unit: 'ms',
    lowerIsBetter: true
  },
  optimise: {
    metric: 'frameP95',
    label: '95th-percentile frame time, optimised',
    unit: 'ms',
    lowerIsBetter: true
  },
  // Not `callbacksPerMove`: 1.0 there means the engine reported every
  // transition, which is correct rather than bad, and ranking on it would put
  // the engine that silently drops hovers at the top. What the debounce is
  // there to protect is the frame time, so that is what gets ranked.
  hover: {
    metric: 'frameP95',
    label: '95th-percentile frame time under hover traffic',
    unit: 'ms',
    lowerIsBetter: true
  }
}

export default function Compare() {
  const [results, setResults] = useState(loadResults)

  const byScenario = useMemo(() => {
    const out: Record<string, BenchResult[]> = {}
    SCENARIOS.forEach(s => {
      out[s.key] = []
    })
    Object.values(results).forEach(row => {
      out[row.scenario]?.push(row)
    })
    Object.values(out).forEach(rows => {
      // Registry order, then the engine's own `renderers` order — so an
      // engine's two backends land next to each other, default first.
      rows.sort(
        (a, b) =>
          ENGINE_KEYS.indexOf(a.engine) - ENGINE_KEYS.indexOf(b.engine) ||
          ENGINES[a.engine].renderers.indexOf(a.renderer) -
            ENGINES[b.engine].renderers.indexOf(b.renderer)
      )
    })
    return out
  }, [results])

  const measured = Object.keys(results).length

  const exportJson = () => {
    // A plain data: URL rather than a Blob — the whole export is a few kilobytes
    // of JSON and this needs no cleanup, no object URL to revoke, and no library.
    const href =
      'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(results, null, 2))
    const a = document.createElement('a')
    a.href = href
    a.download = 'graph-bench-results.json'
    a.click()
  }

  return (
    <div className="compare">
      <div className="bench__row">
        <p className="bench__count">
          {measured
            ? `${measured} result${measured === 1 ? '' : 's'} across ${ENGINE_KEYS.length} engines and ${SCENARIOS.length} scenarios.`
            : 'Nothing measured yet — run a scenario on the Bench tab.'}
        </p>
        <button type="button" className="btn" onClick={exportJson} disabled={!measured}>
          Export JSON
        </button>
        <button
          type="button"
          className="btn btn--danger"
          disabled={!measured}
          onClick={() => {
            if (confirm('Discard every stored result?')) setResults(clearResults())
          }}
        >
          Clear
        </button>
      </div>

      {measured > 0 && (
        <section className="compare__block">
          <h2>Headline</h2>
          <p className="compare__sub">
            One number per scenario, named so it can be argued with. Blank means that engine has not
            run that scenario, or reported it unsupported.
          </p>
          <div className="bench__results">
            <table className="grid">
              <thead>
                <tr>
                  <th>Engine</th>
                  <th>Surface</th>
                  {SCENARIOS.map(s => (
                    <th key={s.key}>
                      {s.label}
                      <small>
                        {HEADLINE[s.key]?.label} ({HEADLINE[s.key]?.unit})
                      </small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEADLINE_ROWS.map(({ engine: key, renderer }) => (
                  <tr key={key + '::' + renderer}>
                    <th scope="row">{rowLabel({ engine: key, renderer })}</th>
                    <td className="grid__soft">{ENGINES[key].surface}</td>
                    {SCENARIOS.map(s => {
                      const headline = HEADLINE[s.key]
                      const scenarioRows = byScenario[s.key] ?? []
                      const row = scenarioRows.find(
                        r => r.engine === key && r.renderer === renderer
                      )
                      const best = headline ? bestFor(scenarioRows, headline) : null
                      const value =
                        row && !row.unsupported && !row.failed && row.metrics && headline
                          ? row.metrics[headline.metric]
                          : null
                      const isBest = value != null && value === best
                      return (
                        <td
                          key={s.key}
                          className={isBest ? 'is-best' : row && row.failed ? 'is-failed' : ''}
                        >
                          {row && row.failed
                            ? 'failed'
                            : row && row.unsupported
                              ? 'n/a'
                              : format(value)}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="compare__block">
        <h2>Capabilities</h2>
        <p className="compare__sub">
          Read off each library's API, not measured. This is the half of the comparison a stopwatch
          cannot answer — and on a real project it decides more often than the frame times do.
          Custom glyphs and edge routing are listed here rather than benchmarked: implementing them
          eight times is the next pass, and until it exists an unmeasured column is more honest than
          a guessed one.
        </p>
        <div className="bench__results">
          <table className="grid grid--caps">
            <thead>
              <tr>
                <th>Capability</th>
                {ENGINE_KEYS.map(key => (
                  <th key={key}>{ENGINES[key].name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAP_ROWS.map(([capKey, label]) => (
                <tr key={capKey}>
                  <th scope="row">{label}</th>
                  {ENGINE_KEYS.map(key => {
                    const value =
                      ENGINES[key].caps[capKey as keyof (typeof ENGINES)[EngineKey]['caps']]
                    return (
                      <td key={key} className={value ? '' : 'is-na'}>
                        {value || 'none'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {SCENARIOS.map(s => (
        <section className="compare__block" key={s.key}>
          <h2>{s.label}</h2>
          <p className="compare__sub">{s.blurb}</p>
          <ResultTable rows={byScenario[s.key] ?? []} scenario={s} />
        </section>
      ))}
    </div>
  )
}

/** The winning value for a scenario's headline metric, or null if nothing ran. */
function bestFor(rows: BenchResult[], headline: Headline): number | null {
  const values = rows
    .filter(r => !r.unsupported && !r.failed && r.metrics)
    .map((r): MetricValue => r.metrics[headline.metric])
    .filter((v): v is number => typeof v === 'number')
  if (!values.length) return null
  return headline.lowerIsBetter ? Math.min(...values) : Math.max(...values)
}
