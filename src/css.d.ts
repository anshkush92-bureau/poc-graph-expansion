// Every pane paints its accent colour and a couple of other one-off values
// through a CSS custom property (`style={{ '--accent': meta.color }}`) rather
// than a class per colour, since the palette is data (`ENTITY[type].color`),
// not something CSS can enumerate. csstype's `Properties` has no index
// signature for custom properties by default, so without this augmentation
// every such `style` object fails to typecheck. This is csstype's own
// documented fix, narrowed to the value types CSS custom properties actually
// take instead of `any`.
declare module 'csstype' {
  interface Properties {
    [index: `--${string}`]: string | number | undefined
  }
}
