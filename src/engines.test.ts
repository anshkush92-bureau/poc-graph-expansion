// The engine registry, pinned field by field.
//
// This exists because the registry is about to be split into eight co-located
// manifests, and a hand-copied config is exactly where a `caps` string gets
// dropped or a `renderers` array loses its second element. Nothing would fail
// loudly if one did: the Compare grid would render a blank cell and the
// bake-off would quietly stop comparing that row. `bench.test.ts` only asserts
// `renderers` is non-empty, so it would not notice any of it.
//
// The expected values below are copied out of the registry by hand on purpose.
// Computing them from `ENGINES` would assert that `ENGINES` equals `ENGINES`,
// which asserts nothing.

import assert from 'node:assert/strict'
import { test } from 'vitest'
import { CAP_ROWS, ENGINES, ENGINE_KEYS } from './engines.js'
import type { GraphEngine } from './engine/types.ts'

// Order is load-bearing, not cosmetic: Compare and BenchView both sort their
// result rows by `ENGINE_KEYS.indexOf(...)`, and the engine tabs render in it.
const KEYS = ['echarts', 'fusion', 'cytoscape', 'vis', 'vng', 'jsplumb', 'nvl', 'flow'] as const

type Key = (typeof KEYS)[number]

/** Every field the tables and tabs render, i.e. the whole entry bar `Component`. */
const EXPECTED: Record<Key, Omit<GraphEngine, 'Component'>> = {
  echarts: {
    name: 'Apache ECharts',
    lib: 'echarts 6.1',
    note: 'graph series · canvas · roam + drag · shape and edge pickers',
    surface: 'canvas',
    renderers: ['canvas', 'svg'],
    caps: {
      viewport: 'roam · graphRoam action',
      layout: 'force, circular — unused here',
      lod: 'none built in',
      culling: 'none built in',
      images: 'symbol: image://… per node',
      routing: 'straight, curved by curveness'
    }
  },
  fusion: {
    name: 'FusionCharts',
    lib: 'fusioncharts 4.2',
    note: 'PowerCharts dragnode · SVG · drag only · no node events, bridged from the DOM',
    surface: 'svg',
    renderers: ['svg'],
    caps: {
      viewport: null,
      layout: 'none — coordinates only',
      lod: 'none',
      culling: 'none',
      images: 'none — shape is circle/rectangle',
      routing: 'straight only'
    }
  },
  cytoscape: {
    name: 'Cytoscape.js',
    lib: 'cytoscape 3.34',
    note: 'canvas · selector stylesheet · native self-loops · ships its own layouts (unused here)',
    surface: 'canvas',
    renderers: ['canvas', 'webgl'],
    caps: {
      viewport: 'zoom() / panBy() · native',
      layout: 'breadthfirst, cose, concentric, circle, grid',
      lod: 'min-zoomed-font-size — automatic',
      culling: 'automatic, viewport-based',
      images: 'background-image per selector',
      routing: 'bezier, taxi, segments, haystack, loop'
    }
  },
  vis: {
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
    }
  },
  vng: {
    name: 'v-network-graph',
    lib: 'v-network-graph 0.9 + vue 3',
    note: 'SVG · Vue 3 only — mounted as a Vue island inside React 16',
    surface: 'svg',
    renderers: ['svg'],
    caps: {
      viewport: 'svg-pan-zoom · zoomBy / panBy',
      layout: 'force-layout module (d3-force)',
      lod: 'none',
      culling: 'none — one Vue component per element',
      images: '#override-node slot (Vue template required)',
      routing: 'straight, curved, selfLoop'
    }
  },
  jsplumb: {
    name: 'jsPlumb',
    lib: '@jsplumb/browser-ui 6.2',
    note: 'HTML nodes + SVG connectors · connectivity toolkit, no layout and no viewport',
    surface: 'dom+svg',
    renderers: ['dom+svg'],
    caps: {
      viewport: 'hand-built CSS transform (~20 lines)',
      layout: 'none — Toolkit only, commercial',
      lod: 'none',
      culling: 'none',
      images: 'anything CSS can draw — nodes are HTML',
      routing: 'Bezier, Flowchart, StateMachine, Straight'
    }
  },
  nvl: {
    name: 'Neo4j NVL',
    lib: '@neo4j-nvl/react 1.2',
    note: 'canvas/WebGL · InteractiveNvlWrapper — official package, diffs nodes/rels internally',
    surface: 'canvas/webgl',
    renderers: ['canvas', 'webgl'],
    caps: {
      viewport: 'setZoom() / setPan() · native',
      layout: 'force, hierarchical, circular, d3-force, grid — in workers',
      lod: 'automatic caption dropping',
      culling: 'automatic',
      images: 'icon per node',
      routing: 'straight, native loops'
    }
  },
  flow: {
    name: 'React Flow v9',
    lib: 'react-flow-renderer 9.7',
    note: 'DOM + SVG · real React components as nodes · no layout engine at all',
    surface: 'dom+svg',
    renderers: ['dom+svg'],
    caps: {
      viewport: 'useZoomPanHelper · zoomTo / transform',
      layout: 'none at all',
      lod: 'write it yourself in the node component',
      culling: 'onlyRenderVisibleElements — on in this pane',
      images: 'anything React can render',
      routing: 'bezier, step, smoothstep, straight, custom'
    }
  }
}

test('ENGINE_KEYS is the eight engines in the order the tables read', () => {
  assert.deepEqual(ENGINE_KEYS, [...KEYS])
})

test('every entry carries the config the tabs and tables render', () => {
  for (const key of KEYS) {
    const { Component, ...config } = ENGINES[key]
    assert.ok(Component, `${key} has no Component`)
    assert.deepEqual(config, EXPECTED[key], key)
  }
})

test('CAP_ROWS is the six capability rows in grid order', () => {
  assert.deepEqual(CAP_ROWS, [
    ['viewport', 'Viewport control'],
    ['layout', 'Layouts shipped'],
    ['lod', 'Level of detail'],
    ['culling', 'Viewport culling'],
    ['images', 'Custom glyphs / images'],
    ['routing', 'Edge routing']
  ])
})
