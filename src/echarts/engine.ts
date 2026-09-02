import { lazy } from 'react'
import type { GraphEngine } from '../engine/types.ts'

/**
 * Apache ECharts.
 *
 * The same series, the same option object, two paint backends. Worth having as
 * a knob: it is the one place in this repo where canvas vs SVG is a one-word
 * change with everything else held identical.
 *
 * The shape and edge-style pickers are declared in `controls`, which is what
 * puts them in the toolbar — App does not know this engine by name.
 */
const echarts = {
  name: 'Apache ECharts',
  lib: 'echarts 6.1',
  note: 'graph series · canvas · roam + drag · shape and edge pickers',
  surface: 'canvas',
  renderers: ['canvas', 'svg'],
  controls: ['shapeSet', 'edgeStyle'],
  caps: {
    viewport: 'roam · graphRoam action',
    layout: 'force, circular — unused here',
    lod: 'none built in',
    culling: 'none built in',
    images: 'symbol: image://… per node',
    routing: 'straight, curved by curveness'
  },
  Component: lazy(() => import('./EChartsGraph.tsx'))
} satisfies GraphEngine

export default echarts
