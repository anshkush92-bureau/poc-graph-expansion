// Every pane paints its accent colour, and a couple of other one-off values,
// through a CSS custom property (`style={{ '--accent': meta.color }}`) rather
// than a class per colour, since the palette is data (`ENTITY[type].color`)
// and not something CSS can enumerate. React's `CSSProperties` has no index
// signature for custom properties, so without this augmentation every such
// `style` object fails to typecheck.
//
// This augments React's own `CSSProperties` rather than csstype's
// `Properties`. That distinction is not cosmetic: `Properties` is generic
// (`Properties<TLength, TTime>`), so a non-generic re-declaration of it does
// not merge — it replaces, and the replacement has no known CSS properties at
// all. The effect is that `style={{ color: 123 }}` compiles silently, which
// removes the compiler from the one surface every pane touches. The pattern
// index signature below only widens the `--*` key space and leaves every real
// CSS property checked as before.
import 'react'

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
