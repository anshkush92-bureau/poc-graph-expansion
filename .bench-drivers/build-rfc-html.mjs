// Wraps the artifact fragment into a standalone page and drops both into the repo.
//
// Two outputs on purpose. `RFC.artifact.html` is the fragment exactly as the
// Artifact tool wants it — no doctype, no <html>, no <body>, because the
// publisher injects those. `RFC.html` is the same bytes with that wrapper
// supplied here, so it opens by double-clicking. Editing the fragment and
// re-running this is the only supported way to change either; hand-editing
// `RFC.html` puts the two out of sync.

import { readFileSync, writeFileSync } from 'node:fs'

const SRC = 'rfc-graph-engine.html'
const REPO = '/Users/anshkush92/Documents/poc-graph-expansion'

const fragment = readFileSync(SRC, 'utf8')

// <title> and the Google Fonts links lead the fragment and belong in <head>.
const lines = fragment.split('\n')
const forHead = lines.slice(0, 3).join('\n')
const rest = lines.slice(3).join('\n')

// The same small reset the Artifact runtime applies, so the standalone copy and
// the published copy render the same.
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${forHead}
<style>
  :root { color-scheme: light dark }
  body { margin: 0; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; background: #faf9f7 }
  img { max-width: 100% }
  [hidden] { display: none !important }
</style>
</head>
<body>
<!-- ===== artifact fragment begins — everything below is RFC.artifact.html ===== -->
${rest}
<!-- ===== artifact fragment ends ===== -->
</body>
</html>
`

writeFileSync(`${REPO}/RFC.html`, page)
writeFileSync(`${REPO}/RFC.artifact.html`, fragment)

// Cheap structural check, because a silently unbalanced table renders as garbage.
const bad = []
for (const t of ['html', 'head', 'body', 'div', 'table', 'tbody', 'thead', 'tr', 'td', 'th',
  'section', 'p', 'ul', 'ol', 'li', 'h3', 'h4', 'span', 'strong', 'em', 'code', 'style', 'footer']) {
  const open = (page.match(new RegExp('<' + t + '[\\s>]', 'g')) || []).length
  const close = (page.match(new RegExp('</' + t + '>', 'g')) || []).length
  if (open !== close) bad.push(`${t}: ${open} open, ${close} close`)
}
console.log(bad.length ? 'UNBALANCED — ' + bad.join(' · ') : 'tags balanced')
console.log(`RFC.html ${(page.length / 1024).toFixed(1)} KB · RFC.artifact.html ${(fragment.length / 1024).toFixed(1)} KB`)
