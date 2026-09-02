// The bits of chrome the bench, the lab and the compare page all draw: one
// knob, one results table, one number formatter.
//
// Shared rather than copied because a knob that clamps differently in two places
// silently produces two different runs, and a table that formats `null` as `0`
// in one of them turns "not measured here" into "never blocked".

import React, { useMemo } from 'react'
import { ENGINES } from '../engines.ts'
import type { BenchResult, Knob as KnobDef, KnobValue, MetricValue, Scenario } from './types.ts'

/** A scenario knob: toggle, choice, or a slider paired with its exact value. */
export function Knob({
  knob,
  value,
  disabled,
  onChange
}: {
  knob: KnobDef
  value: KnobValue
  disabled?: boolean
  onChange(value: KnobValue): void
}) {
  if (knob.type === 'toggle') {
    return (
      <label className="rig__check">
        <input
          type="checkbox"
          checked={!!value}
          disabled={disabled}
          onChange={e => onChange(e.target.checked)}
        />
        <span>{knob.label}</span>
      </label>
    )
  }
  if (knob.type === 'choice') {
    return (
      <label className="jump">
        <span>{knob.label}</span>
        <select value={String(value)} disabled={disabled} onChange={e => onChange(e.target.value)}>
          {knob.options.map(o => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
    )
  }
  const clamp = (raw: string) => Math.max(knob.min, Math.min(knob.max, Number(raw) || knob.min))
  return (
    <label className="dial">
      <span className="dial__label">{knob.label}</span>
      <input
        className="dial__slide"
        type="range"
        min={knob.min}
        max={knob.max}
        step={knob.step}
        value={Number(value)}
        disabled={disabled}
        onChange={e => onChange(clamp(e.target.value))}
      />
      <input
        className="dial__value"
        type="number"
        min={knob.min}
        max={knob.max}
        step={knob.step}
        value={Number(value)}
        disabled={disabled}
        onChange={e => onChange(clamp(e.target.value))}
      />
    </label>
  )
}

/**
 * The results for one scenario.
 *
 * Columns are the union of every metric any row reported, in first-seen order,
 * rather than a fixed list per scenario — a scenario that returns `unsupported`
 * carries fewer metrics than one that ran, and hard-coding the columns would
 * mean maintaining the same list in two places.
 */
export function ResultTable({ rows, scenario }: { rows: BenchResult[]; scenario: Scenario }) {
  const columns = useMemo(() => {
    const seen: string[] = []
    rows.forEach(row => {
      Object.keys(row.metrics || {}).forEach(key => {
        if (seen.indexOf(key) === -1) seen.push(key)
      })
    })
    return seen
  }, [rows])

  if (!rows.length) {
    return (
      <p className="bench__empty">
        No results for {scenario.label} yet. Run an engine, or run all eight.
      </p>
    )
  }

  return (
    <div className="bench__results">
      <table className="grid">
        <thead>
          <tr>
            <th>Engine</th>
            {columns.map(c => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr
              key={row.engine}
              className={row.failed ? 'is-failed' : row.unsupported ? 'is-na' : ''}
            >
              <th scope="row">{ENGINES[row.engine].name}</th>
              {row.unsupported || row.failed ? (
                <td colSpan={columns.length} className="grid__note">
                  {row.failed ? `failed — ${row.failed}` : row.unsupported}
                </td>
              ) : (
                columns.map(c => <td key={c}>{format(row.metrics[c])}</td>)
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {rows
        .filter(r => r.note)
        .map(r => (
          <p key={r.engine} className="bench__note">
            <b>{ENGINES[r.engine].name}</b> — {r.note}
          </p>
        ))}
    </div>
  )
}

/** `null` is "not measured", never "zero". The distinction is the whole point. */
export function format(value: MetricValue): string {
  if (value == null) return '—'
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (typeof value === 'number')
    return Number.isInteger(value) ? value.toLocaleString() : String(value)
  return String(value)
}
