// The catalog's one real invariant: a shape set returns a KEY, and the renderer
// does `SHAPE[key].symbol` on it unguarded. A typo'd key is a TypeError on the
// first paint, and the graph is gone — cheaper to catch here.

import { test } from 'vitest'
import assert from 'node:assert/strict'
import { EDGE_RULES, EDGE_STYLES, EDGE_STYLE_ORDER, SHAPE, SHAPE_SETS } from './symbols.ts'
import { ENTITY, ROOT } from '../graph/data.ts'

// One node per entity type, at every depth the layout can reach, flagged and
// not — between them these cover every branch in every `shapeOf`.
const NODES = Object.keys(ENTITY)
  .flatMap(type =>
    [0, 1, 2, 3, 4, 5, 9].flatMap(level =>
      [
        { risk: 10, flagged: false },
        { risk: 70, flagged: false },
        { risk: 95, flagged: true }
      ].map(risk => Object.assign({ id: `${type}-${level}`, type, level, name: type }, risk))
    )
  )
  .concat(ROOT, { id: 'x', type: 'nonsense', level: 1, name: 'x', risk: 0, flagged: false })

test('every shape a set can return exists in SHAPE', () => {
  ;(Object.keys(SHAPE_SETS) as (keyof typeof SHAPE_SETS)[]).forEach(setKey => {
    NODES.forEach(node => {
      // Each shapeOf takes a different arity (uniform's takes none), so a call
      // through the unioned SHAPE_SETS[setKey] type doesn't narrow past
      // `string` — the assertions below are the actual check.
      const key = SHAPE_SETS[setKey].shapeOf(node) as keyof typeof SHAPE
      assert.ok(SHAPE[key], `${setKey} returned unknown shape "${key}"`)
      assert.ok(SHAPE[key].symbol, `${key} has no symbol`)
      assert.ok(SHAPE[key].scale > 0, `${key} has a non-positive scale`)
    })
  })
})

// Same hazard on the edge side: the renderer does `EDGE_STYLES[chosen]`, and a
// rule returning a key that isn't there falls back silently — every edge looks
// solid and nobody can tell the rule is broken.
const LINKS = ['SHARED_BY', 'SEEN_ON', 'PAIRED_WITH', 'REPEAT_ATTEMPT', 'RELATED_TO', ''].flatMap(
  label =>
    [{}, { loop: true }, { synthetic: true }].map(kind =>
      Object.assign({ id: 'a->b', from: 'a', to: 'b', label, arrow: true }, kind)
    )
)

test('every style a rule can return exists in EDGE_STYLES', () => {
  ;(Object.keys(EDGE_RULES) as (keyof typeof EDGE_RULES)[]).forEach(ruleKey => {
    LINKS.forEach(link => {
      // -1 is the pivot case: a loop's middle leg leaves no real node.
      ;[-1, 0, 1, 2, 3, 4, 8].forEach(level => {
        const key = EDGE_RULES[ruleKey].styleOf(link, { level })
        assert.ok(EDGE_STYLES[key], `${ruleKey} returned unknown style "${key}"`)
      })
    })
  })
})

test('the click cycle covers every style and ends by clearing the override', () => {
  assert.deepEqual(EDGE_STYLE_ORDER, Object.keys(EDGE_STYLES))
  // App walks index+1 and deletes past the end, so a full cycle must return an
  // edge to the picker's control rather than sticking on the last style.
  let at = -1
  const seen = []
  while (at + 1 < EDGE_STYLE_ORDER.length) seen.push(EDGE_STYLE_ORDER[++at])
  assert.deepEqual(seen, EDGE_STYLE_ORDER)
})

test('every edge style is a complete recipe', () => {
  ;(Object.keys(EDGE_STYLES) as (keyof typeof EDGE_STYLES)[]).forEach(key => {
    const style = EDGE_STYLES[key]
    assert.equal(style.ends.length, 2, `${key} needs a [tail, head] pair`)
    assert.ok(style.line.width > 0, `${key} has no line width`)
    assert.equal(typeof style.curveness, 'number', `${key} has no curveness`)
  })
})

// Characterization tests, written before the EDGE_RULES restructure
// (Object.assign(reduce(...), {...}) → Object.fromEntries(...)) so the diff
// proves them green against the old implementation first. The middle one is
// the one that matters: a rewrite in which every flat rule closed over the
// same variable and returned it (instead of its own key) would still pass
// every other test in this file, because nothing else checks which key a
// flat rule actually returns versus just that the key exists in EDGE_STYLES.

test('EDGE_RULES has exactly the current set of keys, in order', () => {
  // Pinned literal, not derived from EDGE_STYLES/EDGE_RULES themselves — the
  // restructure must not silently drop, add, or reorder a rule.
  assert.deepEqual(Object.keys(EDGE_RULES), [
    'arrow',
    'dashed',
    'dotted',
    'curved',
    'socket',
    'plain',
    'kind',
    'relation',
    'depth'
  ])
})

test('every flat edge rule returns its own key, not a shared closure value', () => {
  ;(Object.keys(EDGE_STYLES) as (keyof typeof EDGE_STYLES)[]).forEach(key => {
    LINKS.forEach(link => {
      ;[-1, 0, 1, 2, 3, 4, 8].forEach(level => {
        assert.equal(EDGE_RULES[key].styleOf(link, { level }), key)
      })
    })
  })
})

test('every flat edge rule label matches its EDGE_STYLES label', () => {
  ;(Object.keys(EDGE_STYLES) as (keyof typeof EDGE_STYLES)[]).forEach(key => {
    assert.equal(EDGE_RULES[key].label, EDGE_STYLES[key].label)
  })
})
