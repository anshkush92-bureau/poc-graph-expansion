// Drives the bench's "Everything" button in a real Chrome and dumps the results.
//
// This is the same run a human does at #/bench — same button, same default
// knobs, same sequential one-pane-at-a-time loop. The only thing added is
// patience and a file write at the end.
//
// Frame numbers from an automated browser are not the same as frame numbers
// from a human's browser: the window is not focused, the flags below are what
// keep Chrome from throttling rAF because of it, and there is no user watching
// to notice a pane that rendered nothing. Read the ms columns first.

import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'

const URL = process.env.BENCH_URL || 'http://localhost:4173/#/bench'
const OUT = process.env.BENCH_OUT || 'graph-bench-results.json'
const EXEC = process.env.CHROME ||
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`

const browser = await chromium.launch({
  executablePath: EXEC,
  headless: false,
  args: [
    // rAF is throttled in an unfocused or occluded window, which would turn
    // every fps and p95 column into a measurement of the window manager.
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-background-timer-throttling',
    // performance.memory is coarse-grained by default; without this the heap
    // columns move in 5 MB steps and the leak signal disappears into the noise.
    '--enable-precise-memory-info',
    '--window-size=1600,1000'
  ]
})

const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
page.on('console', m => {
  if (m.type() === 'error') console.log('  [console error]', m.text().slice(0, 200))
})
page.on('pageerror', e => console.log('  [page error]', String(e).slice(0, 200)))

await page.goto(URL, { waitUntil: 'load' })
await page.evaluate(() => localStorage.removeItem('graph-bench-results-v1'))
await page.reload({ waitUntil: 'load' })

const knobs = await page.evaluate(() => {
  const out = {}
  document.querySelectorAll('.bench__knobs label').forEach(l => {
    const input = l.querySelector('input, select')
    if (input) out[l.textContent.replace(input.value, '').trim()] = input.value
  })
  return out
})
console.log('scenario 1 knobs as loaded:', JSON.stringify(knobs))

const started = Date.now()
await page.getByRole('button', { name: 'Everything' }).click()

// Poll the store rather than the button: a pane that hangs still leaves every
// row it already committed, and localStorage is where they land.
let last = -1
let quiet = 0
const CELLS = 8 * 6
for (;;) {
  await page.waitForTimeout(5000)
  let count, status, running
  try {
    ;[count, status, running] = await page.evaluate(() => {
      let n = 0
      try { n = Object.keys(JSON.parse(localStorage.getItem('graph-bench-results-v1')) || {}).length } catch (e) {}
      const s = document.querySelector('.bench__status')
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Everything')
      return [n, s ? s.textContent : null, btn ? btn.disabled : false]
    })
  } catch (err) {
    console.log('  [page unreachable]', String(err).slice(0, 120))
    break
  }
  const mins = ((Date.now() - started) / 60000).toFixed(1)
  console.log(`${mins}m  ${count}/${CELLS}  ${status || (running ? 'running' : 'idle')}`)
  if (!running && count > 0) break
  if (count === last) {
    // Ten minutes with no new row and the button still disabled means a pane is
    // wedged, not slow: the longest scenario is twenty seconds.
    if (++quiet > 120) { console.log('  [stalled — giving up]'); break }
  } else {
    quiet = 0
    last = count
  }
}

const results = await page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('graph-bench-results-v1')) || {} } catch (e) { return {} }
})
writeFileSync(OUT, JSON.stringify(results, null, 2))
console.log(`\nwrote ${OUT} — ${Object.keys(results).length} rows in ${((Date.now() - started) / 60000).toFixed(1)}m`)

await browser.close()
