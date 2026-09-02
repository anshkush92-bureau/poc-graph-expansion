// Palette lives here in JS as well as CSS because both engines paint their own
// nodes and take colours as plain strings — neither can read a CSS custom
// property, so these values are duplicated from styles.css on purpose.

export const INK = '#0A0C10'
export const BONE = '#E8E4DA'
export const FLARE = '#E5484D'

const hex = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16)
]
const pad = (n: number): string => Math.round(n).toString(16).padStart(2, '0')

/** Blends two hex colours. t=0 → a, t=1 → b. */
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hex(a)
  const [br, bg, bb] = hex(b)
  return '#' + pad(ar + (br - ar) * t) + pad(ag + (bg - ag) * t) + pad(ab + (bb - ab) * t)
}

/**
 * Brightness carries one meaning only: a bright node still has neighbours
 * behind it. Fully explored nodes sink back towards the canvas.
 */
export function nodeColor(
  base: string,
  { explored, pending }: { explored: boolean; pending: boolean }
): string {
  if (pending) return mix(base, BONE, 0.45)
  return explored ? mix(base, INK, 0.55) : base
}
