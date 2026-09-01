// Drives the bench one cell at a time, from a plan.
//
// `drive-bench.mjs` clicks "Everything" and takes what the default knobs give.
// This one exists for the questions that button cannot answer, because each of
// them needs the *same* scenario run more than once at different settings:
//
//   the breaking point   hairball at 1k / 5k / 20k / 50k
//   the backend swap     canvas vs svg / webgl, held otherwise identical
//   expansion            the same click-to-grow at three base sizes
//   the LOD denominator  the optimise scenario with the optimisations off
//   the leak column      the same streaming row three times over
//
// Every leg carries its own label, and the row is lifted out of localStorage
// straight after it lands — so legs that share an (engine, scenario) key cannot
// overwrite each other the way they would if the run were left to finish first.
//
// Usage: node sweep.mjs <plan.json> <out.json>

import { chromium } from 'playwright-core'
import { readFileSync, writeFileSync } from 'node:fs'

const [planPath, outPath] = process.argv.slice(2)
const plan = JSON.parse(readFileSync(planPath, 'utf8'))
const URL = process.env.BENCH_URL || 'http://localhost:4173/#/bench'
const EXEC = process.env.CHROME ||
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`

const args = [
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-background-timer-throttling',
  '--enable-precise-memory-info',
  '--window-size=1600,1000'
]
// The leak column is worthless without this: `collectGarbage()` calls
// `window.gc` when it exists and otherwise just waits and hopes, which is how
// two heap readings came back negative last time.
if (process.env.EXPOSE_GC) args.push('--js-flags=--expose-gc')

const browser = await chromium.launch({ executablePath: EXEC, headless: false, args })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
// Playwright's default action timeout is 30 s, and these scenarios deliberately
// block the main thread for longer than that — 20 expansions into 20,000 nodes
// blocks for 24 s cumulative with single tasks of several seconds. A polling
// `isDisabled()` then throws while the run is progressing perfectly well, which
// reads in the output as an engine failure and is not one.
page.setDefaultTimeout(120000)
page.on('pageerror', e => console.log('  [page error]', String(e).slice(0, 160)))

await page.goto(URL, { waitUntil: 'load' })
const gc = await page.evaluate(() => typeof window.gc === 'function')
console.log(`window.gc: ${gc ? 'available' : 'ABSENT — heap deltas are noisy'}`)

// Knob labels go into a RegExp, so metacharacters in them have to be escaped —
// "Debounce (ms)" unescaped matches "Debounce ms" and therefore nothing.
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const pick = (label, value) =>
  page.locator('.bench__controls label.jump', { hasText: new RegExp('^' + esc(label)) })
    .first().locator('select').selectOption(value)

const dial = (label, value) =>
  page.locator('.bench__knobs label.dial', { hasText: new RegExp('^' + esc(label) + '$') })
    .locator('input.dial__value').fill(String(value))

const toggle = async (label, on) => {
  const box = page.locator('.bench__knobs label.rig__check', { hasText: label }).locator('input')
  if (on) await box.check()
  else await box.uncheck()
}

const out = {}
const started = Date.now()

for (let i = 0; i < plan.length; i++) {
  const leg = plan[i]
  const tag = `${i + 1}/${plan.length} ${leg.label}`
  try {
    await pick('Engine', leg.engine)
    if (leg.backend) await pick('Backend', leg.backend)
    await pick('Scenario', leg.scenario)
    for (const [k, v] of Object.entries(leg.knobs || {})) {
      if (typeof v === 'boolean') await toggle(k, v)
      else if (typeof v === 'string') await pick(k, v)
      else await dial(k, v)
    }
    // Clear the slot first, so a leg whose pane never comes back is reported as
    // missing instead of silently handing back the previous leg's row.
    await page.evaluate(key => {
      try {
        const all = JSON.parse(localStorage.getItem('graph-bench-results-v1')) || {}
        delete all[key]
        localStorage.setItem('graph-bench-results-v1', JSON.stringify(all))
      } catch (e) {}
    }, `${leg.engine}::${leg.scenario}`)

    const runBtn = page.getByRole('button', { name: 'Run', exact: true })
    await runBtn.click()
    const budget = leg.timeoutMs || 180000
    const legStart = Date.now()
    for (;;) {
      await page.waitForTimeout(1000)
      if (!(await runBtn.isDisabled())) break
      if (Date.now() - legStart > budget) { console.log(`  ${tag}: over budget, moving on`); break }
    }

    const row = await page.evaluate(key => {
      try { return (JSON.parse(localStorage.getItem('graph-bench-results-v1')) || {})[key] || null } catch (e) { return null }
    }, `${leg.engine}::${leg.scenario}`)

    out[leg.label] = row ? Object.assign({ label: leg.label, backend: leg.backend || null }, row) : { label: leg.label, missing: true }
    const m = (row && row.metrics) || {}
    const brief = ['ttfrMs', 'p95Ms', 'frameP95', 'pushedPerSec', 'kept', 'leakMB', 'blockedMs']
      .filter(k => m[k] != null).map(k => `${k}=${m[k]}`).join(' ')
    console.log(`${((Date.now() - started) / 60000).toFixed(1)}m  ${tag}  ${row ? (row.unsupported ? 'unsupported' : row.failed ? 'FAILED: ' + row.failed.slice(0, 60) : brief) : 'NO ROW'}`)
    await page.waitForTimeout(500)
  } catch (err) {
    console.log(`  ${tag}: ${String(err).slice(0, 160)}`)
    out[leg.label] = { label: leg.label, driverError: String(err).slice(0, 300) }
    // A leg that wedges the tab wedges every leg after it — React Flow at 20,000
    // nodes did exactly that and cost the twelve legs behind it. The wedge is a
    // finding and gets recorded above; the recovery is a reload, because a
    // renderer that will not let go of the main thread will not let go of it on
    // its own either.
    try {
      await page.reload({ waitUntil: 'load', timeout: 60000 })
      await page.waitForTimeout(1500)
      console.log('  recovered by reload')
    } catch (e) {
      console.log('  reload failed too — the rest of this plan will be empty:', String(e).slice(0, 100))
    }
  }
  writeFileSync(outPath, JSON.stringify(out, null, 2))
}

console.log(`\nwrote ${outPath} — ${Object.keys(out).length} legs in ${((Date.now() - started) / 60000).toFixed(1)}m`)
await browser.close()
