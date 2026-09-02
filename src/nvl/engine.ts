import { lazy } from 'react'
import type { GraphEngine } from '../engine/types.ts'

/** Neo4j NVL. */
const nvl = {
  name: 'Neo4j NVL',
  lib: '@neo4j-nvl/react 1.2',
  note: 'canvas/WebGL · InteractiveNvlWrapper — official package, diffs nodes/rels internally',
  surface: 'canvas/webgl',
  // WebGL is the reason to reach for NVL at all — and it drops captions
  // entirely, which is the trade the knob exists to make visible.
  renderers: ['canvas', 'webgl'],
  caps: {
    viewport: 'setZoom() / setPan() · native',
    layout: 'force, hierarchical, circular, d3-force, grid — in workers',
    lod: 'automatic caption dropping',
    culling: 'automatic',
    images: 'icon per node',
    routing: 'straight, native loops'
  },
  Component: lazy(() => import('./NvlGraph.tsx'))
} satisfies GraphEngine

export default nvl
