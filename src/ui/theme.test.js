// The palette helpers, checked.
//
// Every renderer in this repo calls nodeColor on every node it draws, so a
// silent change here miscolours all eight panes at once — and miscolouring is
// exactly the kind of break that looks like a design decision rather than a
// bug. These assertions pin the current behaviour, including the two parts of
// it that are surprising: mix always returns lowercase hex, and nodeColor
// returns its base argument by reference when a node is neither explored nor
// pending, so that one path alone preserves the caller's casing.

import assert from 'node:assert/strict'
import { test } from 'vitest'
import { BONE, FLARE, INK, mix, nodeColor } from './theme.js'

const HEX = /^#[0-9a-f]{6}$/

test('the palette constants are well-formed hex', () => {
  ;[INK, BONE, FLARE].forEach(colour => {
    assert.match(colour.toLowerCase(), HEX, `${colour} is not a 6-digit hex colour`)
  })
})

test('mix at t=0 is the first colour, lowercased', () => {
  assert.equal(mix('#E5484D', '#0A0C10', 0), '#e5484d')
})

test('mix at t=1 is the second colour, lowercased', () => {
  assert.equal(mix('#E5484D', '#0A0C10', 1), '#0a0c10')
})

test('mix at t=0.5 is the rounded midpoint of each channel', () => {
  // 0x00 -> 0xff at t=0.5 is 127.5, and Math.round takes it up to 0x80.
  assert.equal(mix('#000000', '#ffffff', 0.5), '#808080')
  // An exact midpoint needing no rounding, so a change to the rounding rule
  // cannot hide behind the case above.
  assert.equal(mix('#000000', '#101010', 0.5), '#080808')
})

test('mix returns well-formed hex across the whole range', () => {
  for (let t = 0; t <= 1.0001; t += 0.05) {
    const out = mix(FLARE, INK, t)
    assert.match(out, HEX, `mix(FLARE, INK, ${t}) produced ${out}`)
  }
})

test('mix is symmetric — swapping the colours reverses the parameter', () => {
  assert.equal(mix('#123456', '#abcdef', 0.25), mix('#abcdef', '#123456', 0.75))
})

test('an untouched node keeps its base colour verbatim, casing included', () => {
  // The one path that does not go through mix, so the uppercase survives.
  assert.equal(nodeColor('#E5484D', { explored: false, pending: false }), '#E5484D')
})

test('a pending node is blended towards BONE', () => {
  const out = nodeColor('#E5484D', { explored: false, pending: true })
  assert.equal(out, mix('#E5484D', BONE, 0.45))
  assert.notEqual(out.toLowerCase(), '#e5484d')
})

test('an explored node sinks back towards INK', () => {
  const out = nodeColor('#E5484D', { explored: true, pending: false })
  assert.equal(out, mix('#E5484D', INK, 0.55))
  assert.notEqual(out.toLowerCase(), '#e5484d')
})

test('pending wins over explored when a node is both', () => {
  assert.equal(
    nodeColor('#E5484D', { explored: true, pending: true }),
    nodeColor('#E5484D', { explored: false, pending: true })
  )
})

test('explored and pending are visibly different states', () => {
  const base = '#E5484D'
  const explored = nodeColor(base, { explored: true, pending: false })
  const pending = nodeColor(base, { explored: false, pending: true })
  assert.notEqual(explored, pending)
})
