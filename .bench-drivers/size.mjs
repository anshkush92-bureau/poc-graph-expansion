// Bundle cost per engine. Read-only against the repo; writes only to .sizeout/.
//
// The metric the runtime scenarios cannot report and the one a product decision
// usually turns on first: what does *selecting this pane* cost the user to
// download. Every engine is already behind a `React.lazy` in `src/engines.ts`,
// so the app build has produced exactly one chunk per engine for a while — this
// script just attributes the chunks and gzips them.
//
// Marginal, not total. The chunks reachable from the HTML entry (React, the
// shared graph layer, the bench chrome) are subtracted, because they are paid
// for before any engine is chosen and counting them eight times would flatten
// the very differences the column exists to show.
//
//   node .bench-drivers/size.mjs
//   node .bench-drivers/size.mjs --json > engine-sizes.json
//
// Gzip per file rather than over a concatenation: that is how they are served,
// and a single stream would share a dictionary across files and under-report.
import { build } from 'vite'
import { gzipSync } from 'node:zlib'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const OUT = '.sizeout/app'
const ENTRY = 'index.html'
const NAME = {
  echarts: 'ECharts', fusion: 'FusionCharts', cytoscape: 'Cytoscape', vis: 'vis-network',
  vng: 'v-network-graph', jsplumb: 'jsPlumb', nvl: 'Neo4j NVL', flow: 'React Flow'
}

// `manifest` is switched on here rather than in vite.config.ts: this is a
// measurement, and the shipped build should not change shape to accommodate it.
await build({ logLevel: 'error', build: { outDir: OUT, emptyOutDir: true, manifest: true } })

const manifest = JSON.parse(readFileSync(join(OUT, '.vite/manifest.json'), 'utf8'))
if (!manifest[ENTRY]) throw new Error(`No ${ENTRY} in the manifest — nothing to subtract.`)

/**
 * Every manifest key reachable from `key`, stopping at anything in `stopAt`.
 *
 * Dynamic imports are followed as well as static ones, and both halves of that
 * matter. Following them is what puts the app's own route chunks — the lab, the
 * compare page, the shared store, our layout worker — into the baseline instead
 * of into a list of things nobody claimed. Stopping at the panes is what keeps
 * the eight engines out of it, since `React.lazy` makes every one of them a
 * dynamic import of the entry: without the stop, the baseline swallows all
 * eight and every engine measures zero.
 */
const closure = (key, stopAt = new Set(), seen = new Set()) => {
  if (seen.has(key) || !manifest[key]) return seen
  seen.add(key)
  const e = manifest[key]
  for (const dep of [...(e.imports || []), ...(e.dynamicImports || [])]) {
    if (!stopAt.has(dep)) closure(dep, stopAt, seen)
  }
  return seen
}

/** The emitted files one chunk brings with it: itself, its CSS, its assets. */
const filesOf = key => {
  const e = manifest[key]
  return [e.file, ...(e.css || []), ...(e.assets || [])]
}

const weigh = files => {
  let raw = 0
  let gz = 0
  for (const f of files) {
    const buf = readFileSync(join(OUT, f))
    raw += buf.length
    gz += gzipSync(buf, { level: 9 }).length
  }
  return { raw, gz, files: files.length }
}

const kb = n => Math.round(n / 102.4) / 10

// A pane is `src/<engine>/<Something>Graph.tsx`, which is exactly what
// `React.lazy` points at — derived from the manifest rather than listed here so
// adding a ninth engine needs no edit to this file.
const panes = Object.keys(manifest)
  .map(key => [key, /^src\/([a-z]+)\/\w+Graph\.tsx$/.exec(key)])
  .filter(([, m]) => m)
  .map(([key, m]) => [m[1], key])

const paneKeys = new Set(panes.map(([, key]) => key))
const shared = closure(ENTRY, paneKeys)
const attributed = new Set()
const rows = panes.map(([engine, key]) => {
  // Every other pane is a stop, not just the baseline's panes: the shared store
  // is dynamically imported from all eight, so an unstopped walk from one pane
  // reaches the other seven and reports the union — which it did, and made all
  // eight identical.
  const siblings = new Set([...paneKeys].filter(k => k !== key))
  const own = [...closure(key, siblings)].filter(k => !shared.has(k))
  own.forEach(k => attributed.add(k))
  const files = own.flatMap(filesOf)
  return { engine, name: NAME[engine] || engine, chunks: own.length, ...weigh(files) }
}).sort((a, b) => a.gz - b.gz)

const base = weigh([...shared].flatMap(filesOf))

// Anything the build emitted that no engine and no entry claimed. Almost always
// the libraries' own layout workers, fetched by `new Worker(new URL(...))` and
// so invisible to the import graph — deferred cost, not zero cost, and this
// repo uses the shared layout rather than theirs. Printed rather than folded in,
// because silently attributing them would overstate and silently dropping them
// would understate.
const claimed = new Set([...shared, ...attributed].flatMap(filesOf).map(f => f.replace(/^assets\//, '')))
const assets = existsSync(join(OUT, 'assets')) ? readdirSync(join(OUT, 'assets')) : []
const orphans = assets.filter(f => !claimed.has(f) && !f.endsWith('.map'))

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ base, engines: rows, unattributed: orphans }, null, 2))
} else {
  const head = ['engine', 'gzip KB', 'raw KB', 'chunks']
  const cells = rows.map(r => [r.name, String(kb(r.gz)), String(kb(r.raw)), String(r.chunks)])
  const w = head.map((h, i) => Math.max(h.length, ...cells.map(c => c[i].length)))
  console.log('\n### Bundle cost per engine — marginal, on top of a shared %s KB gzipped\n', kb(base.gz))
  console.log('| ' + head.map((h, i) => h.padEnd(w[i])).join(' | ') + ' |')
  console.log('|' + w.map(x => '-'.repeat(x + 2)).join('|') + '|')
  cells.forEach(c => console.log('| ' + c.map((v, i) => v.padEnd(w[i])).join(' | ') + ' |'))
  if (orphans.length) {
    console.log('\nEmitted but claimed by nobody — the libraries\' own layout workers, fetched')
    console.log('at runtime and not on any import path. Deferred, not free:')
    orphans.forEach(f => {
      const buf = readFileSync(join(OUT, 'assets', f))
      console.log(`  ${f}  ${kb(gzipSync(buf, { level: 9 }).length)} KB gzipped`)
    })
  }
  console.log('')
}
