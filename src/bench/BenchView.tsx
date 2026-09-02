import React, { Suspense, useCallback, useMemo, useState } from 'react'
import { ENGINES, ENGINE_KEYS } from '../engines.ts'
import { SCENARIOS, defaultKnobs } from './scenarios.ts'
import { sleep } from './probes.ts'
import { Knob, ResultTable } from './table.tsx'
import { runScenario, usePane } from './usePane.ts'
import { loadResults, saveResult } from './store.ts'
import type { EngineKey, KnobValue, Knobs, Scenario } from './types.ts'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE BENCH — every engine, one scenario, one row each
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * One pane, one engine, one scenario at a time — and that is the single most
 * important thing in this file.
 *
 * The explore view tiles up to eight panes because looking at them together is
 * the point there. Here it would poison every number that matters: frame times,
 * long tasks and heap are properties of *the tab*, not of a component, so eight
 * panes sharing a main thread would produce eight rows that each read "this
 * engine plus seven others". Sequential is slower to sit through and is the only
 * way the comparison means anything.
 *
 * The pane wiring lives in `usePane`, the knobs and table in `table.jsx`, and
 * the measurement in `scenarios.js` — what is left here is the run loop.
 *
 * For driving one library by hand instead, see the Lab (`Lab.jsx`).
 *
 * ── Why results are written per row ────────────────────────────────────────
 * A 50,000-node run on the DOM engines is expected to take the tab with it.
 * Each result is committed to localStorage the moment it lands, so a crash
 * costs the row that caused it and nothing else.
 */
export default function BenchView() {
  const [engine, setEngine] = useState<EngineKey>('echarts')
  const [scenarioKey, setScenarioKey] = useState(SCENARIOS[0].key)
  const scenario = useMemo(
    () => SCENARIOS.find(s => s.key === scenarioKey) ?? SCENARIOS[0],
    [scenarioKey]
  )

  // Knob values, tagged with the scenario they belong to.
  //
  // Resetting them from an effect instead left one render where the new
  // scenario's knobs were undefined, which flips every input from uncontrolled
  // to controlled and React warns about it. Deriving them during render means
  // a knob is never undefined in the first place.
  const [knobState, setKnobState] = useState<{ key: string; values: Knobs }>({
    key: SCENARIOS[0].key,
    values: defaultKnobs(SCENARIOS[0])
  })
  const knobs = knobState.key === scenarioKey ? knobState.values : defaultKnobs(scenario)
  const setKnob = useCallback(
    (key: string, value: KnobValue) => {
      setKnobState(prev => ({
        key: scenarioKey,
        values: {
          ...(prev.key === scenarioKey ? prev.values : defaultKnobs(scenario)),
          [key]: value
        }
      }))
    },
    [scenario, scenarioKey]
  )

  // The paint backend, for the three engines that have more than one. Derived
  // during render off the same pattern as the knobs above: an effect that reset
  // it on engine change would leave one render where the selected renderer
  // belongs to the previous engine, and `echarts: webgl` is not a thing.
  //
  // It exists here and not only in the lab because otherwise every row in the
  // matrix is the engine's *default* backend and the SVG/WebGL halves of three
  // libraries go unmeasured — which was exactly the hole in the first pass.
  const [rendererState, setRendererState] = useState<{ key: EngineKey; value: string }>({
    key: 'echarts',
    value: ENGINES.echarts.renderers[0]!
  })
  const renderer =
    rendererState.key === engine ? rendererState.value : ENGINES[engine].renderers[0]!

  const [results, setResults] = useState(loadResults)
  const [status, setStatus] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const { data, paneRef, paneProps, clear, makeCtx, begin, cancel, aborted } = usePane()

  /** Mounts an engine and waits until its pane is alive and has painted once. */
  const ready = useCallback(
    async (key: EngineKey) => {
      setEngine(key)
      // A tick for React to swap the lazy component in before the first show.
      await sleep(0)
      await clear()
    },
    [clear]
  )

  const runOne = useCallback(
    async (engineKey: EngineKey, scen: Scenario, values: Knobs) => {
      const row = await runScenario(engineKey, scen, values, makeCtx(values))
      // Recomputed from the engine being run rather than read off the closure:
      // `runEverything` walks the engines itself, and its closure's `renderer`
      // belongs to whichever engine was selected when the run started.
      row.renderer =
        rendererState.key === engineKey ? rendererState.value : ENGINES[engineKey].renderers[0]!
      setResults(saveResult(row))
      return row
    },
    [makeCtx, rendererState]
  )

  const run = useCallback(
    async (engineKeys: EngineKey[]) => {
      if (running) return
      begin()
      setRunning(true)
      try {
        for (let i = 0; i < engineKeys.length; i++) {
          if (aborted()) break
          const key = engineKeys[i]!
          setStatus(`${ENGINES[key].name} · ${scenario.label} (${i + 1}/${engineKeys.length})`)
          await ready(key)
          await runOne(key, scenario, knobs)
          // A beat between engines so the previous one's teardown and any
          // collection it triggers land outside the next one's measurement.
          await sleep(400)
        }
      } finally {
        setStatus(null)
        setRunning(false)
      }
    },
    [aborted, begin, knobs, ready, running, runOne, scenario]
  )

  const runEverything = useCallback(async () => {
    if (running) return
    begin()
    setRunning(true)
    try {
      for (let e = 0; e < ENGINE_KEYS.length; e++) {
        if (aborted()) break
        const key = ENGINE_KEYS[e]!
        await ready(key)
        for (let s = 0; s < SCENARIOS.length; s++) {
          if (aborted()) break
          const scen = SCENARIOS[s]!
          setStatus(
            `${ENGINES[key].name} · ${scen.label} (engine ${e + 1}/${ENGINE_KEYS.length}, scenario ${s + 1}/${SCENARIOS.length})`
          )
          await runOne(key, scen, defaultKnobs(scen))
          await sleep(300)
        }
        await sleep(400)
      }
    } finally {
      setStatus(null)
      setRunning(false)
    }
  }, [begin, ready, running, runOne])

  const { name, lib, Component } = ENGINES[engine]
  const rows = useMemo(
    () =>
      Object.keys(results)
        .flatMap(k => {
          const row = results[k]
          return row ? [row] : []
        })
        .filter(r => r.scenario === scenarioKey)
        .sort((a, b) => ENGINE_KEYS.indexOf(a.engine) - ENGINE_KEYS.indexOf(b.engine)),
    [results, scenarioKey]
  )

  return (
    <div className="bench">
      <div className="bench__controls">
        <div className="bench__row">
          <label className="jump">
            <span>Engine</span>
            <select
              value={engine}
              onChange={e => setEngine(e.target.value as EngineKey)}
              disabled={running}
            >
              {ENGINE_KEYS.map(key => (
                <option key={key} value={key}>
                  {ENGINES[key].name}
                </option>
              ))}
            </select>
          </label>

          <label className="jump">
            <span>Backend</span>
            <select
              value={renderer}
              disabled={running || ENGINES[engine].renderers.length < 2}
              onChange={e => setRendererState({ key: engine, value: e.target.value })}
            >
              {ENGINES[engine].renderers.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="jump">
            <span>Scenario</span>
            <select
              value={scenarioKey}
              onChange={e => setScenarioKey(e.target.value)}
              disabled={running}
            >
              {SCENARIOS.map(s => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="btn btn--primary"
            disabled={running}
            onClick={() => run([engine])}
          >
            Run
          </button>
          <button type="button" className="btn" disabled={running} onClick={() => run(ENGINE_KEYS)}>
            All engines
          </button>
          <button type="button" className="btn" disabled={running} onClick={runEverything}>
            Everything
          </button>
          {running && (
            <button type="button" className="btn btn--danger" onClick={cancel}>
              Stop
            </button>
          )}
          {status && <span className="bench__status">{status}</span>}
        </div>

        <p className="bench__blurb">{scenario.blurb}</p>

        <div className="bench__knobs">
          {scenario.knobs.map(knob => (
            <Knob
              key={knob.key}
              knob={knob}
              value={knobs[knob.key] ?? knob.value}
              disabled={running}
              onChange={v => setKnob(knob.key, v)}
            />
          ))}
        </div>
      </div>

      <section className="pane pane--bench">
        <header className="pane__bar">
          <b className="pane__name">{name}</b>
          <span className="pane__lib">
            {lib} · {renderer}
          </span>
          <span className="pane__stat">
            {data.graph.nodes.length.toLocaleString()} nodes ·{' '}
            {data.graph.edges.length.toLocaleString()} links
          </span>
        </header>
        <div className="pane__body" ref={paneRef}>
          <Suspense fallback={<p className="pane__wait">loading {lib}…</p>}>
            <Component
              // Remounting per engine is what keeps a run from inheriting the
              // previous engine's canvas, listeners and retained graph. Keyed on
              // the backend too: not one of these can swap its paint target on a
              // live instance.
              key={engine + '::' + renderer}
              graph={data.graph}
              positions={data.positions}
              {...paneProps}
              renderer={renderer}
            />
          </Suspense>
        </div>
      </section>

      <ResultTable rows={rows} scenario={scenario} />
    </div>
  )
}
