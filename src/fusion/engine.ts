import { lazy } from 'react'
import type { GraphEngine } from '../engine/types.ts'

/** FusionCharts PowerCharts DragNode. */
const fusion = {
  name: 'FusionCharts',
  lib: 'fusioncharts 4.2',
  note: 'PowerCharts dragnode · SVG · drag only · no node events, bridged from the DOM',
  surface: 'svg',
  renderers: ['svg'],
  caps: {
    // Not an omission: there is no pan/zoom in PowerCharts DragNode at all.
    // A "zoom" means recomputing the axis bounds and rebuilding the chart,
    // which is a full re-render, not a viewport transform.
    viewport: null,
    layout: 'none — coordinates only',
    lod: 'none',
    culling: 'none',
    images: 'none — shape is circle/rectangle',
    routing: 'straight only'
  },
  Component: lazy(() => import('./FusionGraph.tsx'))
} satisfies GraphEngine

export default fusion
