// Palette lives here in JS as well as CSS because both engines paint their own
// nodes and take colours as plain strings — neither can read a CSS custom
// property, so these values are duplicated from styles.css on purpose.

export const INK = '#0A0C10'
export const BONE = '#E8E4DA'
export const FLARE = '#E5484D'

const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const pad = n => Math.round(n).toString(16).padStart(2, '0')

/** Blends two hex colours. t=0 → a, t=1 → b. */
export function mix(a, b, t) {
  const [ar, ag, ab] = hex(a)
  const [br, bg, bb] = hex(b)
  return '#' + pad(ar + (br - ar) * t) + pad(ag + (bg - ag) * t) + pad(ab + (bb - ab) * t)
}

/**
 * Brightness carries one meaning only: a bright node still has neighbours
 * behind it. Fully explored nodes sink back towards the canvas.
 */
export function nodeColor(base, { explored, pending }) {
  if (pending) return mix(base, BONE, 0.45)
  return explored ? mix(base, INK, 0.55) : base
}
