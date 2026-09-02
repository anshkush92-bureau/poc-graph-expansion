import { lazy } from 'react'
import type { GraphEngine } from '../engine/types.ts'

/** React Flow (`@xyflow/react`). */
const flow = {
  name: 'React Flow',
  lib: '@xyflow/react 12.11',
  note: 'DOM + SVG · real React components as nodes · no layout engine at all',
  surface: 'dom+svg',
  renderers: ['dom+svg'],
  caps: {
    viewport: 'useReactFlow · setViewport / fitView',
    layout: 'none at all',
    lod: 'write it yourself in the node component',
    culling: 'onlyRenderVisibleElements — on in this pane',
    images: 'anything React can render',
    routing: 'bezier, step, smoothstep, straight, custom'
  },
  Component: lazy(() => import('./FlowGraph.tsx'))
} satisfies GraphEngine

export default flow
