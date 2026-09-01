// Why did six of eight engines report no hover callbacks?
//
// The calibration grid walks `pane.getBoundingClientRect()` and dispatches at
// whatever `elementFromPoint` finds there. If the pane sits partly below the
// fold, elementFromPoint returns null outside the viewport and the scenario
// falls back to the container — which reaches the two engines that bind their
// listeners to the container and none of the ones that bind to an inner canvas
// or to per-node elements. This measures whether that is what happened.

import { chromium } from 'playwright-core'

const EXEC = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`
const browser = await chromium.launch({ executablePath: EXEC, headless: false, args: ['--window-size=1600,1000'] })

for (const [w, h] of [[1600, 1000], [1600, 1600]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto('http://localhost:4173/#/bench', { waitUntil: 'load' })
  await page.waitForTimeout(1500)
  const out = await page.evaluate(() => {
    const pane = document.querySelector('.pane__body')
    if (!pane) return { error: 'no pane' }
    const b = pane.getBoundingClientRect()
    let inside = 0
    let nulls = 0
    let toContainer = 0
    const COLS = 56
    const ROWS = 28
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = b.left + (b.width * (c + 0.5)) / COLS
        const y = b.top + (b.height * (r + 0.5)) / ROWS
        if (y >= 0 && y <= innerHeight && x >= 0 && x <= innerWidth) inside++
        const el = document.elementFromPoint(x, y)
        if (!el) nulls++
        else if (el === pane) toContainer++
      }
    }
    return {
      viewport: `${innerWidth}x${innerHeight}`,
      paneRect: `${Math.round(b.width)}x${Math.round(b.height)} at y=${Math.round(b.top)}..${Math.round(b.bottom)}`,
      gridPoints: COLS * ROWS,
      insideViewport: inside,
      elementFromPointNull: nulls,
      resolvedToContainerItself: toContainer
    }
  })
  console.log(JSON.stringify(out, null, 2))
  await page.close()
}

await browser.close()
