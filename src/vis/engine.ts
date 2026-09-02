import { lazy } from 'react'
import type { GraphEngine } from '../engine/types.ts'

/** vis-network. */
const vis = {
  name: 'vis-network',
  lib: 'vis-network 10.1',
  note: 'canvas · DataSet diffing · physics off so the shared layout wins',
  surface: 'canvas',
  renderers: ['canvas'],
  caps: {
    viewport: 'moveTo() / getScale() · native',
    layout: 'Barnes-Hut, repulsion, hierarchical',
    lod: 'scaling.label.drawThreshold',
    culling: 'automatic, viewport-based',
    images: 'shape: image / circularImage',
    routing: 'dynamic, continuous, cubicBezier, curvedCW'
  },
  Component: lazy(() => import('./VisGraph.tsx'))
} satisfies GraphEngine

export default vis
