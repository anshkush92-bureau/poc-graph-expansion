import { lazy } from 'react'
import type { GraphEngine } from '../engine/types.ts'

/** Cytoscape.js. */
const cytoscape = {
  name: 'Cytoscape.js',
  lib: 'cytoscape 3.34',
  note: 'canvas · selector stylesheet · native self-loops · ships its own layouts (unused here)',
  surface: 'canvas',
  // 3.31+ ships a WebGL path behind `renderer: { name: 'canvas', webgl: true }`.
  // Still the canvas renderer's geometry — WebGL is the rasteriser under it —
  // so it is a fair A/B rather than a different library.
  renderers: ['canvas', 'webgl'],
  caps: {
    viewport: 'zoom() / panBy() · native',
    layout: 'breadthfirst, cose, concentric, circle, grid',
    lod: 'min-zoomed-font-size — automatic',
    culling: 'automatic, viewport-based',
    images: 'background-image per selector',
    routing: 'bezier, taxi, segments, haystack, loop'
  },
  Component: lazy(() => import('./CytoscapeGraph.tsx'))
} satisfies GraphEngine

export default cytoscape
