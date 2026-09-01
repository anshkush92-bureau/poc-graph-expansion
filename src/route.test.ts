// The hash parser, checked.
//
// Worth a test because every failure mode of it is silent: a lab URL that parses
// as `explore` looks like a working app that ignored your link, and an engine
// key read out of the wrong path segment mounts the wrong library under the
// right heading — which would then be measured and written down.

import assert from 'node:assert/strict'
import { test } from 'vitest'
import { ENGINE_KEYS } from './engines.js'
import { parseRoute, routeHash } from './route.ts'

test('a bare page is explore', () => {
  assert.deepEqual(parseRoute(''), { mode: 'explore', arg: null })
  assert.deepEqual(parseRoute('#'), { mode: 'explore', arg: null })
  assert.deepEqual(parseRoute('#/'), { mode: 'explore', arg: null })
})

test('a mode with no argument keeps no argument', () => {
  assert.deepEqual(parseRoute('#/bench'), { mode: 'bench', arg: null })
  assert.deepEqual(parseRoute('#/compare'), { mode: 'compare', arg: null })
  // Only the lab takes one — `#/bench/cytoscape` is not a thing, and silently
  // carrying an arg it would ignore invites writing a link that does nothing.
  assert.deepEqual(parseRoute('#/bench/cytoscape'), { mode: 'bench', arg: null })
})

test('a lab URL carries its engine', () => {
  assert.deepEqual(parseRoute('#/lab/cytoscape'), { mode: 'lab', arg: 'cytoscape' })
  assert.deepEqual(parseRoute('#/lab'), { mode: 'lab', arg: null })
})

test('an unknown mode lands somewhere useful rather than erroring', () => {
  assert.deepEqual(parseRoute('#/nonsense/deeper'), { mode: 'explore', arg: null })
  assert.deepEqual(parseRoute(null), { mode: 'explore', arg: null })
})

test('routeHash round-trips every engine the app can mount', () => {
  ENGINE_KEYS.forEach(key => {
    assert.deepEqual(parseRoute(routeHash('lab', key)), { mode: 'lab', arg: key })
  })
  assert.equal(routeHash('bench'), '#/bench')
})
