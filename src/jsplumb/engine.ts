import { lazy } from 'react'
import type { GraphEngine } from '../engine/types.ts'

/** jsPlumb Community — a connectivity toolkit, not a graph renderer. */
const jsplumb = {
  name: 'jsPlumb',
  lib: '@jsplumb/browser-ui 6.2',
  note: 'HTML nodes + SVG connectors · connectivity toolkit, no layout and no viewport',
  surface: 'dom+svg',
  renderers: ['dom+svg'],
  caps: {
    // Community has none; the one this pane drives is the CSS transform the
    // renderer builds by hand, which is exactly the finding.
    viewport: 'hand-built CSS transform (~20 lines)',
    layout: 'none — Toolkit only, commercial',
    lod: 'none',
    culling: 'none',
    images: 'anything CSS can draw — nodes are HTML',
    routing: 'Bezier, Flowchart, StateMachine, Straight'
  },
  Component: lazy(() => import('./JsPlumbGraph.tsx'))
} satisfies GraphEngine

export default jsplumb
