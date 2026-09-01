// The contract every engine implements, and the domain types the whole app
// shares. This file has no runtime code — it is the thing that makes adding a
// ninth library a compile-time exercise rather than a runtime surprise.

import type { ComponentType, LazyExoticComponent } from 'react'
import type { EDGE_STYLES, EDGE_RULES, SHAPE_SETS } from '../echarts/symbols.ts'

// ── The graph ───────────────────────────────────────────────────────────────

export type EntityType = 'account' | 'device' | 'phone' | 'email' | 'ip' | 'card'

export interface GraphNode {
  id: string
  type: EntityType
  level: number
  name: string
  risk: number
  flagged: boolean
  firstSeen: string
  events: number
  /** Added by the analyst rather than returned by the backend. */
  synthetic?: boolean
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
  synthetic?: boolean
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface Point {
  x: number
  y: number
}

/**
 * Node coordinates from the shared radial layout.
 *
 * Under `noUncheckedIndexedAccess` a lookup yields `Point | undefined`, which is
 * correct: the layout is computed from one graph and a renderer may hold a
 * slightly older one. Every adapter must handle the miss.
 */
export type Positions = Record<string, Point>

// ── Appearance keys, derived so a new entry widens the type for free ────────

export type ShapeSetKey = keyof typeof SHAPE_SETS

/** A concrete line style. What an individual edge override holds. */
export type EdgeStyleKey = keyof typeof EDGE_STYLES

/**
 * What the edge picker offers: every EdgeStyleKey, plus the computed rules
 * (`kind`, `relation`, `depth`) that derive a style per edge. Not
 * interchangeable with EdgeStyleKey — an override cannot be a rule.
 */
export type EdgeRuleKey = keyof typeof EDGE_RULES

// ── The engine contract ─────────────────────────────────────────────────────

/**
 * Relative rather than absolute (`zoomBy(1.1)`, not `zoomTo(2)`) because every
 * engine here can express a relative zoom and only some can express an absolute
 * one. A pane with no viewport at all passes `null` instead of a handle.
 */
export interface ViewportHandle {
  zoomBy(factor: number): void
  panBy(dx: number, dy: number): void
  fit(): void
}

/**
 * The props every renderer takes. Identical across all engines on purpose —
 * that uniformity is the entire comparison.
 */
export interface GraphPaneProps {
  graph: Graph
  positions: Positions
  hidden: ReadonlyMap<string, number>
  isExpanded(id: string): boolean
  isPending(id: string): boolean
  /** Bumped when expansion status changes, which lives in a ref. */
  statusVersion: number

  /** One of the engine's declared `renderers`. Fixed at construction. */
  renderer?: string

  shapeSet?: ShapeSetKey
  edgeStyle?: EdgeRuleKey
  edgeOverrides?: ReadonlyMap<string, EdgeStyleKey>

  onNodeClick(id: string): void
  onNodeHover(id: string | null, at: Point | null): void
  onEdgeClick(id: string): void
  onBackgroundClick(): void
  onStat?(ms: number): void
  /** Called once on mount with a handle or `null`, and with `null` on unmount. */
  onViewport?(handle: ViewportHandle | null): void
}

export type CapKey = 'viewport' | 'layout' | 'lod' | 'culling' | 'images' | 'routing'

/** Optional controls an engine opts into. App renders one if any pane wants it. */
export type ControlKey = 'shapeSet' | 'edgeStyle'

export interface GraphEngine {
  name: string
  lib: string
  note: string
  surface: string
  /**
   * Paint backends, first entry being the default. A non-empty tuple so
   * `renderers[0]` is defined under `noUncheckedIndexedAccess` — BenchView
   * depends on that.
   */
  renderers: readonly [string, ...string[]]
  /** Total over CapKey: a new capability row cannot leave a hole in Compare. */
  caps: Record<CapKey, string | null>
  controls?: readonly ControlKey[]
  Component: LazyExoticComponent<ComponentType<GraphPaneProps>>
}
