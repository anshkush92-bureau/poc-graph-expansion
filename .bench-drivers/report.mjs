// Turns the sweep files into the tables the RFC needs. Read-only.
import { readFileSync, existsSync } from 'node:fs'

const load = p => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {})
const main = load('main-sweep.json')
const wall = load('wall-sweep.json')
const hover = load('hover-rows.json')
const followup = load('followup-sweep.json')
Object.assign(main, followup)
// The first pass's rows, for the LOD-on half of the comparison: that leg has not
// changed and re-running it would only add a second run's variance to a
// difference this table is trying to read.
const pass1 = load('/Users/anshkush92/Documents/poc-graph-expansion/graph-bench-results.json')
const p1 = (engine, scenario) => pass1[`${engine}::${scenario}`]

const NAME = {
  echarts: 'ECharts', fusion: 'FusionCharts', cytoscape: 'Cytoscape', vis: 'vis-network',
  vng: 'v-network-graph', jsplumb: 'jsPlumb', nvl: 'Neo4j NVL', flow: 'React Flow'
}
const g = (row, k) => (row && row.metrics ? row.metrics[k] : undefined)
const cell = v => (v === undefined || v === null ? '—' : String(v))

const table = (title, head, rows) => {
  console.log(`\n### ${title}\n`)
  const w = head.map((h, i) => Math.max(h.length, ...rows.map(r => cell(r[i]).length)))
  console.log('| ' + head.map((h, i) => h.padEnd(w[i])).join(' | ') + ' |')
  console.log('|' + w.map(x => '-'.repeat(x + 2)).join('|') + '|')
  rows.forEach(r => console.log('| ' + r.map((v, i) => cell(v).padEnd(w[i])).join(' | ') + ' |'))
}

// ── LOD: the denominator ───────────────────────────────────────────────────
const ENG = Object.keys(NAME)
table('LOD & culling — what the optimisations actually bought (frameP95)',
  ['engine', 'off (100%)', 'labels off', 'culled (4.6%)', 'ttfr off', 'ttfr culled'],
  ENG.map(e => {
    const off = main[`lod-off/${e}`]
    const only = main[`lod-only/${e}`]
    const on = p1(e, 'optimise')
    return [NAME[e], g(off, 'frameP95'), g(only, 'frameP95'), g(on, 'frameP95'), g(off, 'ttfrMs'), g(on, 'ttfrMs')]
  }))

// ── Backends ───────────────────────────────────────────────────────────────
for (const [e, bs] of Object.entries({ echarts: ['canvas', 'svg'], cytoscape: ['canvas', 'webgl'], nvl: ['canvas', 'webgl'] })) {
  table(`${NAME[e]} — ${bs.join(' vs ')}`,
    ['backend', 'hairball ttfr', 'hairball blocked', 'expand p95', 'expand upd p95', 'zoom fP95', 'zoom blocked', 'stream absorbed', 'stream fP95', 'stream blocked'],
    bs.map(b => {
      const h = main[`backend/${e}-${b}/hairball`]
      const x = main[`backend/${e}-${b}/expand`]
      const z = main[`backend/${e}-${b}/zoompan`]
      const s = main[`backend/${e}-${b}/stream`]
      return [b, g(h, 'ttfrMs'), g(h, 'blockedMs'), g(x, 'p95Ms'), g(x, 'updateP95Ms'),
        g(z, 'frameP95'), g(z, 'blockedMs'), g(s, 'pushedPerSec'), g(s, 'frameP95'), g(s, 'blockedMs')]
    }))
}

// ── Expansion across sizes ─────────────────────────────────────────────────
table('Expansion — 20 clicks × 25 nodes, p95 wait per click (ms)',
  ['engine', '1k p50', '1k p95', '5k p50', '5k p95', '20k p50', '20k p95', '20k first→last', '20k layout p95'],
  ['nvl', 'cytoscape', 'vis', 'echarts', 'flow'].map(e => {
    const r = n => main[`expand/${n}/${e}`]
    const big = r(20000)
    return [NAME[e], g(r(1000), 'p50Ms'), g(r(1000), 'p95Ms'), g(r(5000), 'p50Ms'), g(r(5000), 'p95Ms'),
      g(big, 'p50Ms'), g(big, 'p95Ms'),
      g(big, 'firstMs') != null ? `${g(big, 'firstMs')}→${g(big, 'lastMs')}` : null,
      g(big, 'layoutP95Ms')]
  }))

// ── Leak, three runs ───────────────────────────────────────────────────────
table('Streaming heap — three runs, --expose-gc',
  ['engine', 'baseMB', 'leak r1', 'leak r2', 'leak r3', 'slope r1', 'absorbed r1'],
  ['nvl', 'cytoscape', 'vis', 'echarts'].map(e => [
    NAME[e], g(main[`leak/r1/${e}`], 'baseMB'),
    ...[1, 2, 3].map(r => g(main[`leak/r${r}/${e}`], 'leakMB')),
    g(main['leak/r1/' + e], 'heapSlopeMBs'), g(main['leak/r1/' + e], 'pushedPerSec')
  ]))

// ── The wall ───────────────────────────────────────────────────────────────
const wallCell = r => {
  if (!r) return null
  if (r.missing || r.driverError) return 'no row'
  if (r.failed) return 'FAILED'
  return `${g(r, 'ttfrMs')} / ${g(r, 'longestTaskMs')}`
}
table('The breaking point — hairball ttfrMs / longest task',
  ['engine', '1k', '5k', '20k', '50k'],
  [
    ...['nvl', 'cytoscape', 'vis', 'echarts', 'flow'].map(e => [
      NAME[e], ...[1000, 5000, 20000, 50000].map(n => wallCell(wall[`wall/${n}/${e}`]))
    ]),
    // Does swapping the rasteriser move the wall? The only size where it could
    // is above the one canvas is already vsync-bound at.
    ...['cytoscape', 'nvl'].map(e => [
      NAME[e] + ' (WebGL)', '—', ...[5000, 20000, 50000].map(n => wallCell(main[`wallgl/${n}/${e}-webgl`]))
    ])
  ])

table('Expansion at 20k — canvas against WebGL',
  ['engine', 'canvas p95', 'WebGL p95', 'canvas blocked', 'WebGL blocked'],
  ['cytoscape', 'nvl'].map(e => {
    const c = main[`expand/20000/${e}`]
    const w = main[`expandgl/20000/${e}-webgl`]
    return [NAME[e], g(c, 'p95Ms'), g(w, 'p95Ms'), g(c, 'blockedMs'), g(w, 'blockedMs')]
  }))

table('Streaming heap — the fixed metric, three runs',
  ['engine', 'baseMB', 'leak r1', 'leak r2', 'leak r3', 'slope r1'],
  ['nvl', 'cytoscape', 'vis', 'echarts'].map(e => [
    NAME[e], g(main[`leakfix/r1/${e}`], 'baseMB'),
    ...[1, 2, 3].map(r => g(main[`leakfix/r${r}/${e}`], 'leakMB')),
    g(main['leakfix/r1/' + e], 'heapSlopeMBs')
  ]))

// ── Hover with a real pointer ──────────────────────────────────────────────
table('Hover — trusted pointer input',
  ['engine', 'hit points / 800', 'hitArea', 'cb/move @0ms', 'cb/move @50ms', 'verdict'],
  ENG.map(e => {
    const r = hover[e] || {}
    return [NAME[e], r.hits, r.hitArea, r.legs && r.legs.debounce0.callbacksPerMove,
      r.legs && r.legs.debounce50.callbacksPerMove, r.verdict || r.driverError]
  }))

// ── How much of any of this is run-to-run noise? ───────────────────────────
//
// Several legs re-ran a configuration the first pass had already measured at the
// identical size, engine and default backend. Those pairs are the only estimate
// of variance this exercise has, and every single-run difference quoted anywhere
// else has to clear the spread they show.
const repeats = [
  ['echarts', 'zoompan', 'frameP95', 'backend/echarts-canvas/zoompan'],
  ['cytoscape', 'zoompan', 'frameP95', 'backend/cytoscape-canvas/zoompan'],
  ['nvl', 'zoompan', 'frameP95', 'backend/nvl-canvas/zoompan'],
  ['echarts', 'hairball', 'ttfrMs', 'backend/echarts-canvas/hairball'],
  ['cytoscape', 'hairball', 'ttfrMs', 'backend/cytoscape-canvas/hairball'],
  ['nvl', 'hairball', 'ttfrMs', 'backend/nvl-canvas/hairball'],
  ['echarts', 'stream', 'frameP95', 'backend/echarts-canvas/stream'],
  ['cytoscape', 'stream', 'frameP95', 'backend/cytoscape-canvas/stream'],
  ['nvl', 'stream', 'frameP95', 'backend/nvl-canvas/stream'],
  ['echarts', 'stream', 'pushedPerSec', 'backend/echarts-canvas/stream'],
  ['cytoscape', 'optimise', 'frameP95', 'lod-off/cytoscape']
]
table('Run-to-run spread — same engine, same size, same default backend',
  ['engine', 'scenario', 'metric', 'pass 1', 'pass 2', 'spread'],
  repeats.map(([e, s, m, key]) => {
    const a = g(p1(e, s), m)
    const b = g(main[key], m)
    const note = key.startsWith('lod-off') ? ' (⚠ different knobs)' : ''
    const pc = a && b ? Math.round((100 * (b - a)) / a) + '%' : '—'
    return [NAME[e], s + note, m, a, b, pc]
  }))

const missing = Object.values({ ...main, ...wall }).filter(r => r.missing || r.driverError).map(r => r.label)
if (missing.length) console.log('\n**legs with no row:** ' + missing.join(', '))
