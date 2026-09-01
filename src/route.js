// Which view is on screen, in the URL.
//
// State alone would have done for three tabs. It stops being enough the moment
// there is a page *per library*: "open the Cytoscape lab" has to be a link you
// can bookmark, send to someone, and reload after the 50,000-node run took the
// tab down — none of which survives a useState.
//
// The hash rather than a path because this is a Vite static build with no
// server rewrite, and `#/lab/cytoscape` needs no router and no dependency.

export const MODES = [
  ['explore', 'Explore'],
  ['bench', 'Bench'],
  ['lab', 'Lab'],
  ['compare', 'Compare']
]

const KEYS = MODES.map(m => m[0])

/**
 * `#/lab/cytoscape` -> { mode: 'lab', arg: 'cytoscape' }
 *
 * Anything unrecognised falls back to explore rather than erroring: a stale
 * bookmark from a renamed engine should land somewhere useful.
 */
export function parseRoute(hash) {
  const parts = String(hash || '').replace(/^#\/?/, '').split('/').filter(Boolean)
  const mode = KEYS.indexOf(parts[0]) === -1 ? 'explore' : parts[0]
  return { mode, arg: mode === 'lab' && parts[1] ? parts[1] : null }
}

export const routeHash = (mode, arg) => '#/' + mode + (arg ? '/' + arg : '')
