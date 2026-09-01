// Hover, with a real pointer.
//
// Six of eight engines came back "no hover callbacks anywhere on the pane" in
// the scripted run, which is not credible as a library finding. The scenario
// builds its events with `new MouseEvent(...)` and `dispatchEvent`, so every one
// of them arrives with `isTrusted: false` — and one geometry explanation was
// already tested and falsified, which leaves the events themselves.
//
// So this drives the pointer through the browser instead of through the DOM:
// `page.mouse.move` goes out as CDP `Input.dispatchMouseEvent`, which the
// renderer processes as real input — trusted, hit-tested by the compositor,
// coalesced the way a human's moves are. If an engine reports hover here and
// not there, the harness was the problem and not the library.
//
// The lab is the page rather than the bench, because the lab already has the
// hover counter, a Reset button and a Build at a size we choose.
//
// Usage: node drive-hover.mjs <out.json>

import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'

const OUT = process.argv[2] || 'hover-rows.json'
const BASE = process.env.BENCH_BASE || 'http://localhost:4173'
const EXEC = process.env.CHROME ||
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`

const ENGINES = ['echarts', 'fusion', 'cytoscape', 'vis', 'vng', 'jsplumb', 'nvl', 'flow']
// v-network-graph refuses past ~150 nodes, so it gets a graph it will actually
// draw. A pane that drew nothing cannot report a hover, and that would be a
// third explanation muddled into the two under test.
const SIZE = { vng: 120 }

const browser = await chromium.launch({
  executablePath: EXEC,
  headless: false,
  args: [
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-background-timer-throttling',
    '--window-size=1600,1000'
  ]
})

const out = {}
const started = Date.now()

for (const key of ENGINES) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
  page.on('pageerror', e => console.log(`  [${key}] page error`, String(e).slice(0, 140)))
  try {
    await page.goto(`${BASE}/#/lab/${key}`, { waitUntil: 'load' })
    // Focus the window for real. rAF and input delivery both care, and the
    // whole point of this run is to be the case the automated one was not.
    await page.bringToFront()
    await page.waitForTimeout(800)

    const nodes = SIZE[key] || 1000
    // The label goes into a RegExp, and "Debounce (ms)" contains regex
    // metacharacters — unescaped, `^Debounce (ms)$` matches "Debounce ms" and
    // therefore nothing on the page. The first run of this script lost all eight
    // engines to that after the calibration pass had already succeeded.
    const rx = label => new RegExp('^' + label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$')
    const set = (label, value) =>
      page.locator('label.dial', { hasText: rx(label) })
        .first().locator('input.dial__value').fill(String(value))
    await set('Initial nodes', nodes)
    await set('Edges', Math.round(nodes * 1.5))
    await page.getByRole('button', { name: 'Build' }).click()
    await page.waitForTimeout(nodes > 500 ? 6000 : 2500)

    const box = await page.locator('.pane__body').boundingBox()
    if (!box) throw new Error('no pane box')

    // Read the counter itself, not the gauge that displays it. The gauge repaints
    // on the HUD's sampling schedule, so reading it straight after a pointer move
    // returns the value from before the move — which scored Cytoscape at 0 hits
    // out of 800 on a page where it was demonstrably firing.
    const readHovers = () => page.evaluate(() =>
      (typeof window.__benchHovers === 'function' ? window.__benchHovers() : null))
    if ((await readHovers()) === null) throw new Error('no __benchHovers seam — rebuild dist')
    const reset = () => page.getByRole('button', { name: 'Reset hovers' }).click()

    // ── Calibration: where does this engine think its nodes are? ────────────
    // Same procedure as the scripted scenario — walk a grid, keep the points
    // that produced a callback — only with a real pointer. Coarser than 56×28
    // because every move here is a round trip to the browser rather than a
    // synchronous dispatch.
    const COLS = 40
    const ROWS = 20
    const hits = []
    const misses = []
    await reset()
    let before = await readHovers()
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = box.x + (box.width * (c + 0.5)) / COLS
        const y = box.y + (box.height * (r + 0.5)) / ROWS
        await page.mouse.move(x, y)
        const now = await readHovers()
        if (now > before) hits.push({ x, y })
        else if (misses.length < 200) misses.push({ x, y })
        before = now
      }
    }

    const calibMs = Date.now() - started
    if (!hits.length) {
      out[key] = { engine: key, nodes, probePoints: COLS * ROWS, hits: 0, verdict: 'no hover with a real pointer either' }
      console.log(`${key}: 0 hits of ${COLS * ROWS} — real input changes nothing`)
      await page.close()
      continue
    }

    // ── The measured sweep, at two debounce settings ────────────────────────
    const legs = {}
    for (const debounce of [0, 50]) {
      await set('Debounce (ms)', debounce)
      await page.waitForTimeout(200)
      await reset()
      const t0 = Date.now()
      let sent = 0
      // On a node then off it: transitions are the traffic a debounce exists to
      // absorb, and sitting on one node lets every engine dedupe to a single
      // callback.
      while (Date.now() - t0 < 6000) {
        const hit = hits[sent % hits.length]
        await page.mouse.move(hit.x, hit.y)
        sent += 1
        if (misses.length) {
          const miss = misses[(sent * 7) % misses.length]
          await page.mouse.move(miss.x, miss.y)
          sent += 1
        }
      }
      const callbacks = await readHovers()
      legs['debounce' + debounce] = {
        pointerMoves: sent,
        hoverCallbacks: callbacks,
        callbacksPerMove: sent ? Math.round((callbacks / sent) * 100) / 100 : 0
      }
    }

    out[key] = {
      engine: key,
      nodes,
      probePoints: COLS * ROWS,
      hits: hits.length,
      hitArea: Math.round((1000 * hits.length) / (COLS * ROWS)) / 10 + '%',
      legs,
      verdict: 'hover measured with trusted input'
    }
    console.log(`${key}: ${hits.length}/${COLS * ROWS} hit points (${out[key].hitArea}) · ` +
      `0ms ${legs.debounce0.callbacksPerMove}/move · 50ms ${legs.debounce50.callbacksPerMove}/move`)
  } catch (err) {
    out[key] = { engine: key, driverError: String(err).slice(0, 300) }
    console.log(`${key}: ${String(err).slice(0, 160)}`)
  }
  writeFileSync(OUT, JSON.stringify(out, null, 2))
  await page.close().catch(() => {})
}

console.log(`\nwrote ${OUT} in ${((Date.now() - started) / 60000).toFixed(1)}m`)
await browser.close()
