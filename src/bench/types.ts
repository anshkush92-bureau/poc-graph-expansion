// The shapes the benchmark passes around: a knob, a scenario, the context a
// scenario runs against, and one stored result row.
//
// Here rather than beside any one of them because every file in this folder
// touches at least two: the catalog declares knobs and returns results, the
// pane hook builds the context, the tables render both, and `store` persists
// the rows. One definition is what keeps a knob that clamps in `table` and a
// knob that is read in `scenarios` the same knob.

import type { Graph, Positions, ViewportHandle } from '../engine/types.ts'
import type { EngineKey } from '../engines.ts'

export type { EngineKey } from '../engines.ts'

// ── Knobs ───────────────────────────────────────────────────────────────────

export type KnobValue = number | string | boolean

/**
 * A knob descriptor. `key` and `value` are optional because the lab builds
 * throwaway descriptors for its hand-driven controls and keeps their value in
 * React state; a scenario's own knobs always carry both — see {@link ScenarioKnob}.
 */
export interface NumberKnob {
  type: 'number'
  label: string
  min: number
  max: number
  step: number
  key?: string
  value?: number
}

export interface ChoiceKnob {
  type: 'choice'
  label: string
  options: readonly string[]
  key?: string
  value?: string
}

export interface ToggleKnob {
  type: 'toggle'
  label: string
  key?: string
  value?: boolean
}

export type Knob = NumberKnob | ChoiceKnob | ToggleKnob

/** A knob as a scenario declares it: keyed, and with a default to start from. */
export type ScenarioKnob = Knob & { key: string; value: KnobValue }

/** Resolved knob values for one run, keyed by knob. */
export type Knobs = Record<string, KnobValue>

// ── Results ─────────────────────────────────────────────────────────────────

/** `null` is "not measured here" and never zero — see `format` in table.tsx. */
export type MetricValue = number | string | boolean | null | undefined

export type Metrics = Record<string, MetricValue>

export interface ScenarioResult {
  metrics: Metrics
  note?: string | undefined
  /** A first-class result: "this engine cannot do that" belongs in the table. */
  unsupported?: string | undefined
  failed?: string | undefined
}

/** One stored row: what was run, on what, with which knobs. */
export interface BenchResult extends ScenarioResult {
  engine: EngineKey
  scenario: string
  knobs: Knobs
  at: number
  renderer?: string
}

// ── Scenarios ───────────────────────────────────────────────────────────────

/**
 * What a scenario is handed. It knows nothing about which engine is mounted —
 * it sets data, drives the viewport the pane published, and reads the probes.
 */
export interface BenchContext {
  knobs: Knobs
  /** Sets the pane's data and resolves once it has painted, or `null` on timeout. */
  show(graph: Graph, positions: Positions): Promise<number | null>
  /** Sets it and does NOT wait — the streaming path, on purpose. */
  push(graph: Graph, positions: Positions): void
  lastStat(): number | null
  viewport(): ViewportHandle | null
  pane(): HTMLElement | null
  hover: {
    count(): number
    reset(): void
    setDebounce(ms: number): void
  }
  signal: { aborted: boolean }
}

export interface Scenario {
  key: string
  label: string
  blurb: string
  knobs: ScenarioKnob[]
  run(ctx: BenchContext): Promise<ScenarioResult>
}
