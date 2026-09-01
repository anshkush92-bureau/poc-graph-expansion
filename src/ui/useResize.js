import { useEffect, useRef } from 'react'

/**
 * Runs `onResize` whenever an element's box changes — including once as soon as
 * it is observed.
 *
 * That first call is the reason this exists. Every engine here measures its
 * container when it initialises and fits the graph to what it measured, and each
 * one is a lazily-loaded chunk mounted into a grid cell that may not have been
 * laid out yet. The result is a viewport fitted to the wrong box: the root node
 * drawn enormous and clipped, or a few pixels across with an unreadable caption,
 * or parked in a corner. ResizeObserver fires on `observe`, so re-fitting from
 * here corrects it on the first real measurement without anyone having to guess
 * how many frames to wait.
 *
 * The callback is held in a ref so a fresh closure each render does not tear the
 * observer down and rebuild it.
 */
export function useResize(ref, onResize) {
  const cb = useRef(onResize)
  cb.current = onResize

  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => cb.current())
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}
