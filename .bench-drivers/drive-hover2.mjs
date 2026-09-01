// Hover, with a real pointer — second attempt, after the first one asked the
// wrong question.
//
// The scripted scenario walks a 56×28 grid and keeps the points that fired a
// callback. On a fitted 1,000-node graph a node is about eleven pixels across
// and the grid samples every 28 px, so it lands on one rarely: ECharts' measured
// `hitArea` was 0.2% — three points out of 1,568. A driver using a coarser 40×20
// grid therefore expects 1.6 hits and legitimately gets zero, which reads as
// "this engine reports no hover" and is really "this grid missed every node".
// That is what the first run of this script reported, and it was wrong.
//
// So: stop teleporting between sample points and *sweep*. `mouse.move` with
// `steps` makes the browser interpolate, emitting that many trusted moves along
// the line, which crosses whatever is in the way at ~1 px resolution. A
// serpentine over the pane is then ~40 calls instead of 800 and covers it
// densely rather than sparsely.
//
// This drops `hitArea` — per-point attribution is gone — and that is the right
// trade: `hitArea` is a by-product, and the two questions that matter are
// "does this engine report hover under real input at all" and "what does the
// debounce buy". A sweep answers both.
//
// Usage: node drive-hover2.mjs <out.json>

import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'

const OUT = process.argv[2] || 'hover-rows.json'
const BASE = process.env.BENCH_BASE || 'http://localhost:4173'
const EXEC = process.env.CHROME ||
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`

const ENGINES = ['echarts', 'fusion', 'cytoscape', 'vis', 'vng', 'jsplumb', 'nvl', 'flow']
// v-network-graph refuses past ~150 nodes. A pane that drew nothing cannot
// report a hover, and that would be a third explanation tangled into the two
// under test.
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
  page.setDefaultTimeout(90000)
  page.on('pageerror', e => console.log(`  [${key}] page error`, String(e).slice(0, 140)))
  try {
    await page.goto(`${BASE}/#/lab/${key}`, { waitUntil: 'load' })
    await page.bringToFront()
    await page.waitForTimeout(800)

    const rx = label => new RegExp('^' + label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$')
    const set = (label, value) =>
      page.locator('label.dial', { hasText: rx(label) }).first().locator('input.dial__value').fill(String(value))

    const nodes = SIZE[key] || 1000
    await set('Initial nodes', nodes)
    await set('Edges', Math.round(nodes * 1.5))
    await page.getByRole('button', { name: 'Build' }).click()
    await page.waitForTimeout(nodes > 500 ? 7000 : 3000)

    const box = await page.locator('.pane__body').boundingBox()
    if (!box) throw new Error('no pane box')

    // Read the counter, not the gauge that displays it — the gauge repaints on
    // the HUD's own schedule and is stale immediately after a move.
    const readHovers = () => page.evaluate(() =>
      (typeof window.__benchHovers === 'function' ? window.__benchHovers() : null))
    if ((await readHovers()) === null) throw new Error('no __benchHovers seam in this build')
    const reset = () => page.getByRole('button', { name: 'Reset hovers' }).click()

    /** One serpentine pass over the pane. Returns callbacks fired and moves emitted. */
    const sweep = async rows => {
      await reset()
      await page.waitForTimeout(150)
      let emitted = 0
      const t0 = Date.now()
      for (let r = 0; r < rows; r++) {
        const y = box.y + (box.height * (r + 0.5)) / rows
        const x0 = r % 2 ? box.x + box.width - 2 : box.x + 2
        const x1 = r % 2 ? box.x + 2 : box.x + box.width - 2
        await page.mouse.move(x0, y)
        // One trusted move per ~2 px of travel, so an 11 px node cannot be
        // stepped over.
        const steps = Math.round(box.width / 2)
        await page.mouse.move(x1, y, { steps })
        emitted += steps + 1
      }
      return { callbacks: await readHovers(), pointerMoves: emitted, elapsedMs: Date.now() - t0 }
    }

    await set('Debounce (ms)', 0)
    await page.waitForTimeout(150)
    const probe = await sweep(24)

    if (!probe.callbacks) {
      out[key] = {
        engine: key,
        nodes,
        ...probe,
        verdict: 'no hover callbacks under trusted input either — this is a library finding, not a harness one'
      }
      console.log(`${key}: 0 callbacks over ${probe.pointerMoves} trusted moves — genuinely silent`)
      writeFileSync(OUT, JSON.stringify(out, null, 2))
      await page.close()
      continue
    }

    // It reports. Now: what does the debounce buy? Same sweep, same travel.
    const legs = { debounce0: probe }
    for (const debounce of [50]) {
      await set('Debounce (ms)', debounce)
      await page.waitForTimeout(150)
      legs['debounce' + debounce] = await sweep(24)
    }
    await set('Debounce (ms)', 0)

    out[key] = {
      engine: key,
      nodes,
      legs,
      // Callbacks per 1,000 trusted moves, which is comparable across engines
      // even though the sweep length is not identical in wall-clock.
      per1000: Object.fromEntries(Object.entries(legs).map(([k, v]) =>
        [k, Math.round((1000 * v.callbacks) / v.pointerMoves)])),
      verdict: 'hover measured under trusted input'
    }
    console.log(`${key}: ${probe.callbacks} callbacks / ${probe.pointerMoves} moves ` +
      `(${out[key].per1000.debounce0}/1k at 0 ms, ${out[key].per1000.debounce50}/1k at 50 ms)`)
  } catch (err) {
    out[key] = { engine: key, driverError: String(err).slice(0, 300) }
    console.log(`${key}: ${String(err).slice(0, 160)}`)
  }
  writeFileSync(OUT, JSON.stringify(out, null, 2))
  await page.close().catch(() => {})
}

console.log(`\nwrote ${OUT} in ${((Date.now() - started) / 60000).toFixed(1)}m`)
await browser.close()
