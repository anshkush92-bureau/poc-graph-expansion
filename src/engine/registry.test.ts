import assert from 'node:assert/strict'
import { test } from 'vitest'
import { CAP_ROWS, ENGINES, ENGINE_KEYS } from '../engines.ts'
import type { GraphEngine } from './types.ts'

// The compiler already enforces the shape of a manifest. What it cannot check
// is that the values are sane — an empty renderers array, a caps entry that is
// an empty string, a Component that is not actually lazy. A blank pane is a
// miserable way to discover any of those.

test('every engine is registered under the key its own file uses', () => {
  ENGINE_KEYS.forEach(key => {
    assert.ok(ENGINES[key], `${key} is missing from ENGINES`)
  })
  assert.equal(ENGINE_KEYS.length, Object.keys(ENGINES).length)
})

test('every engine names itself and the library it wraps', () => {
  ENGINE_KEYS.forEach(key => {
    const e = ENGINES[key]
    assert.ok(e.name.length > 0, `${key} has no name`)
    assert.ok(e.lib.length > 0, `${key} does not say which library it is`)
    assert.ok(e.surface.length > 0, `${key} declares no surface`)
  })
})

test('every engine offers at least one renderer, and the first is its default', () => {
  ENGINE_KEYS.forEach(key => {
    const list = ENGINES[key].renderers
    assert.ok(list.length >= 1, `${key} offers no renderer`)
    assert.equal(new Set(list).size, list.length, `${key} lists a renderer twice`)
    assert.ok(list[0], `${key} has no default renderer`)
  })
})

test('every engine answers every capability row', () => {
  ENGINE_KEYS.forEach(key => {
    const caps = ENGINES[key].caps
    CAP_ROWS.forEach(([capKey, label]) => {
      // caps is total over CapKey and every manifest is checked with `satisfies
      // GraphEngine`, so this can never fail at the type level. Kept anyway: it
      // turns what would otherwise be a TypeError on `undefined.length` into a
      // message that names the engine and the row.
      assert.ok(capKey in caps, `${key} does not answer "${label}"`)
      const value = caps[capKey]
      // null means "the library genuinely has none", which is a real answer.
      // An empty string means someone left it blank.
      assert.ok(value === null || value.length > 0, `${key}.caps.${capKey} is blank`)
    })
  })
})

test('every engine ships a lazy component', () => {
  ENGINE_KEYS.forEach(key => {
    const C = ENGINES[key].Component
    assert.equal(typeof C, 'object', `${key}.Component is not a lazy component`)
    assert.ok('$$typeof' in C, `${key}.Component is not a React element type`)
    // This proves Component is a React.lazy object, not that the import(...)
    // specifier inside its thunk resolves — the thunk isn't called until
    // render. A bad specifier is only caught by `npm run build`.
  })
})

test('only engines that declare a control get one', () => {
  const allowed = new Set(['shapeSet', 'edgeStyle'])
  ENGINE_KEYS.forEach(key => {
    // ENGINES is typed by `satisfies`, not widened to Record<EngineKey,
    // GraphEngine>, so ENGINES[key] is a union of each manifest's own literal
    // type and only echarts's includes `controls`. Widen explicitly rather
    // than let the union leak into the assertion below.
    const engine: GraphEngine = ENGINES[key]
    const controls = engine.controls
    if (!controls) return
    controls.forEach(c => assert.ok(allowed.has(c), `${key} declares unknown control "${c}"`))
    assert.equal(new Set(controls).size, controls.length, `${key} declares a control twice`)
  })
})
