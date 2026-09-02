import { useCallback, useEffect, useRef, useState } from 'react'
import type { ViewportHandle } from '../engine/types.ts'

/**
 * The controls that belong on the canvas rather than in a toolbar.
 *
 * Zoom and fit act on one pane, so they live on that pane. A toolbar copy would
 * have to name which pane it meant, and with four engines tiled the answer is
 * never obvious.
 *
 * The handle is read through a getter, not taken as a value: every pane
 * publishes it from a mount effect, and holding it in state would re-render the
 * stage — and with it every renderer's memo — once per pane on load. `usePane`
 * already exposes exactly this shape (`viewport: () => viewport.current`), so
 * the lab passes its own getter unchanged.
 *
 * `supported` comes from the engine manifest's `caps.viewport`, so a library
 * with no viewport API shows the buttons disabled with the reason rather than
 * hiding them. That absence is a finding in a bake-off, not an omission to
 * paper over — FusionCharts is the one that publishes `null`.
 */

// Per click, and deliberately large. 1.25 was a quarter of a step, which on a
// graph that already fits the pane is a change you have to look for — the
// button read as broken rather than as gentle. 1.6/0.625 is one visible step
// in and the exact inverse out, so a click each way lands back where it began.
const IN = 1.6
const OUT = 1 / IN

// Auto-repeat while a zoom button is held. `setInterval` rather than
// per-frame: on the DOM panes one zoom step rebuilds every connector, and a
// 60 Hz queue of those outruns the renderer and keeps zooming after release.
const REPEAT_DELAY_MS = 300
const REPEAT_EVERY_MS = 110

export default function CanvasControls({
  label,
  viewport,
  supported,
  onClose
}: {
  /** Engine name, so the aria-labels say which pane a button acts on. */
  label: string
  viewport: () => ViewportHandle | null
  supported: boolean
  /** Omitted when there is nothing to close back to — the lab, or the last pane. */
  onClose?: (() => void) | undefined
}) {
  const box = useRef<HTMLDivElement>(null)
  const [full, setFull] = useState(false)

  // Tracked rather than assumed: Escape and the browser's own chrome exit
  // fullscreen without going through the button, and the icon has to follow.
  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === box.current?.parentElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const drive = useCallback(
    (what: number | 'fit') => {
      const handle = viewport()
      // Null between mount and the pane's own effect, and forever on a pane
      // with no viewport at all.
      if (!handle) return
      if (what === 'fit') handle.fit()
      else handle.zoomBy(what)
    },
    [viewport]
  )

  // Hold to keep zooming. One click is one step, which is right for nudging and
  // wrong for crossing three orders of magnitude on a 50,000-node hairball.
  const repeat = useRef<{
    delay?: ReturnType<typeof setTimeout>
    every?: ReturnType<typeof setInterval>
  }>({})
  const stop = useCallback(() => {
    clearTimeout(repeat.current.delay)
    clearInterval(repeat.current.every)
    repeat.current = {}
  }, [])
  useEffect(() => stop, [stop])

  const hold = useCallback(
    (factor: number) => {
      stop()
      drive(factor)
      repeat.current.delay = setTimeout(() => {
        repeat.current.every = setInterval(() => drive(factor), REPEAT_EVERY_MS)
      }, REPEAT_DELAY_MS)
    },
    [drive, stop]
  )

  // The parent — `.pane__body` — not this overlay: the graph is the sibling
  // that has to fill the screen. The request rejects rather than throws when
  // the document is not allowed fullscreen, and an unhandled rejection in the
  // console is worse than a button that did nothing.
  const toggleFull = () => {
    if (full) void document.exitFullscreen().catch(() => {})
    else void box.current?.parentElement?.requestFullscreen().catch(() => {})
  }

  const reason = supported
    ? undefined
    : `${label} has no viewport API — pan and zoom are the finding`

  // `onPointerDown` rather than `onClick` for the two zooms, because the repeat
  // has to start on press. Pointer up *and* leave and cancel all stop it — a
  // pointer released outside the button never sends `pointerup` to it.
  const zoomProps = (factor: number) => ({
    onPointerDown: () => hold(factor),
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop
  })

  return (
    <div className="vp" ref={box}>
      <button
        type="button"
        className="vp__btn"
        disabled={!supported}
        title={reason || `Zoom in on ${label} — hold to keep zooming`}
        aria-label={`Zoom in on ${label}`}
        {...zoomProps(IN)}
      >
        +
      </button>
      <button
        type="button"
        className="vp__btn"
        disabled={!supported}
        title={reason || `Zoom out of ${label} — hold to keep zooming`}
        aria-label={`Zoom out of ${label}`}
        {...zoomProps(OUT)}
      >
        −
      </button>
      <button
        type="button"
        className="vp__btn"
        disabled={!supported}
        title={reason || `Fit ${label} to the pane`}
        aria-label={`Fit ${label} to the pane`}
        onClick={() => drive('fit')}
      >
        ⛶
      </button>
      <button
        type="button"
        className="vp__btn"
        title={full ? `Leave fullscreen` : `Fullscreen ${label}`}
        aria-label={full ? `Leave fullscreen` : `Fullscreen ${label}`}
        aria-pressed={full}
        onClick={toggleFull}
      >
        {full ? '⤡' : '⤢'}
      </button>
      {onClose && (
        <button
          type="button"
          className="vp__btn vp__btn--drop"
          title={`Close ${label}`}
          aria-label={`Close ${label}`}
          onClick={onClose}
        >
          ×
        </button>
      )}
    </div>
  )
}
