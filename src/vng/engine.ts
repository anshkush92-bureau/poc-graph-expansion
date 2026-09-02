import { lazy } from 'react'
import type { GraphEngine } from '../engine/types.ts'

/** v-network-graph — the one non-React library here, mounted as a Vue island. */
const vng = {
  name: 'v-network-graph',
  lib: 'v-network-graph 0.9 + vue 3',
  note: 'SVG · Vue 3 only — mounted as a Vue island inside React 19',
  surface: 'svg',
  renderers: ['svg'],
  caps: {
    viewport: 'svg-pan-zoom · zoomBy / panBy',
    layout: 'force-layout module (d3-force)',
    lod: 'none',
    culling: 'none — one Vue component per element',
    images: '#override-node slot (Vue template required)',
    routing: 'straight, curved, selfLoop'
  },
  Component: lazy(() => import('./VngGraph.tsx'))
} satisfies GraphEngine

export default vng
