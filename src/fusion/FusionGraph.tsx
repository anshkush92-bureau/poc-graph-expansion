import React, { useEffect, useRef } from 'react'
import FusionCharts from 'fusioncharts'
import PowerCharts from 'fusioncharts/fusioncharts.powercharts'
import { ENTITY } from '../graph/data.ts'
import { withLoops } from '../graph/loops.ts'
import { BONE, FLARE, INK, mix, nodeColor } from '../ui/theme.ts'
import type { GraphPaneProps, Point } from '../engine/types.ts'

/** A node entry in drag-node's dataset. Every value is a string, as it wants. */
interface DragNode {
  id: string
  x: string
  y: string
  label: string
  shape: string
  radius: string
  color: string
  alpha?: string
  borderColor?: string
  hoverColor?: string
  allowDrag: string
}

interface DragConnector {
  from: string
  to: string
  label: string
  color: string
  alpha: string
  arrowAtStart: string
  arrowAtEnd: string
  strength: string
}

interface DragNodeData {
  chart: Record<string, string>
  dataset: [{ data: DragNode[] }]
  labels: { label: { text: string; x: string; y: string; allowDrag: string }[] }
  connectors?: [{ stdThickness: string; connector: DragConnector[] }]
}

/**
 * The FusionCharts renderer, on the drag-node chart (`dragnode`).
 *
 * Drag-node is the only FusionCharts type that draws a free node-link graph —
 * everything else in the suite that looks graph-shaped (org/tree, Sankey,
 * chord) fixes the topology for you. It lives in PowerCharts, not the base
 * bundle, so the module has to be registered before the type resolves.
 *
 * Three things to know before reading further, all of which shape this file:
 *
 * 1. Drag-node takes node positions in axis space, not pixels, and scales that
 *    space to the canvas — so it fits the graph for free as it grows, which the
 *    ECharts tab has to ask for. The cost is that the axis range has to be
 *    aspect-corrected by hand or the radial layout renders visibly squashed.
 *
 * 2. Drag-node nodes raise no click or hover event. They bind only
 *    `fc-mousedown` / `fc-mousemove` / `fc-mouseup` internally for dragging;
 *    `dataPlotClick` and `dataPlotRollOver` are never dispatched for this
 *    chart type. So click-to-expand and the hover card are bridged from the
 *    rendered SVG instead — see `idAtTarget`.
 *
 * 3. A node's own `label` is hard-clipped to the node's shape: drag-node sizes
 *    it with `getSmartText(text, plotWidth - 1, plotHeight - 1)`, so anything
 *    longer than the disc is truncated to "AC..." and `labelAlign` only moves
 *    it between top, middle and bottom *inside* that box. Readable node names
 *    therefore come from the separate free-text `labels` collection, positioned
 *    below each node by hand in axis space.
 */

PowerCharts(FusionCharts)

const EDGE = '#2F3746'
const LOOP = '#7FD4E8'
const SYNTH = '#5FD39B'

// Room around the outermost ring, in layout units, so node labels are not
// clipped against the canvas edge.
const PAD = 130
// A lone root node has a zero-sized bounding box; give it a span to sit in.
const MIN_SPAN = 700

// Raphael renders each node into one shared group, in dataset order. Matching
// on the group rather than the shape keeps connectors — also paths — out.
const NODE_SHAPES = '[class*="nodesGroup"] path'

/**
 * Bounding box of the graph in FusionCharts axis space, widened so its aspect
 * ratio matches the canvas. Without this the shorter data axis is stretched to
 * fill the container and every ring renders as an ellipse.
 *
 * The y axis points up in FusionCharts and down in the layout, hence the flip.
 */
function axisBox(
  points: Point[],
  width: number,
  height: number
): { minX: number; maxX: number; minY: number; maxY: number } {
  // An empty graph is a legitimate state — the size dials go down to zero — and
  // `Math.min()` of nothing is `Infinity`, which makes every number below NaN.
  // One point at the origin costs nothing and lets the MIN_SPAN path below do
  // exactly what it already does for a single unexpanded node.
  const at = points.length ? points : [{ x: 0, y: 0 }]
  const xs = at.map(p => p.x)
  const ys = at.map(p => -p.y)
  let minX = Math.min(...xs) - PAD
  let maxX = Math.max(...xs) + PAD
  let minY = Math.min(...ys) - PAD
  let maxY = Math.max(...ys) + PAD

  const grow = (lo: number, hi: number, to: number): [number, number] => {
    const mid = (lo + hi) / 2
    return [mid - to / 2, mid + to / 2]
  }

  const spanX = Math.max(maxX - minX, MIN_SPAN)
  const spanY = Math.max(maxY - minY, MIN_SPAN)
  ;[minX, maxX] = grow(minX, maxX, spanX)
  ;[minY, maxY] = grow(minY, maxY, spanY)

  const target = width / height
  if (spanX / spanY < target) [minX, maxX] = grow(minX, maxX, spanY * target)
  else [minY, maxY] = grow(minY, maxY, spanX / target)

  return { minX, maxX, minY, maxY }
}

function FusionGraph({
  graph,
  positions,
  hidden,
  isExpanded,
  isPending,
  statusVersion,
  onNodeClick,
  onNodeHover,
  onBackgroundClick,
  onStat,
  onViewport
}: GraphPaneProps) {
  const frame = useRef<HTMLDivElement>(null)
  const chart = useRef<FusionCharts | null>(null)

  const handlers = useRef<Pick<
    GraphPaneProps,
    'onNodeClick' | 'onNodeHover' | 'onBackgroundClick'
  > | null>(null)
  handlers.current = { onNodeClick, onNodeHover, onBackgroundClick }

  // Dataset order -> graph node id, with null for the self-loop pivots. This is
  // what the SVG event bridge maps a clicked shape back through.
  const order = useRef<(string | null)[]>([])
  // The latest data-source builder, so a container resize can re-derive the
  // aspect-corrected axis box without waiting for the next graph change.
  const build = useRef<((width: number, height: number) => DragNodeData) | null>(null)
  const hoveredId = useRef<string | null>(null)
  // Which nodes carry the flagged pulse. Read by `markFlagged` after a render,
  // which is a different moment from when the data effect knows it.
  const flagged = useRef(new Set<string>())

  /**
   * Tags the flagged nodes' shapes so CSS can pulse them.
   *
   * Being real SVG, the ring costs nothing here: one `@keyframes` on a stroke
   * and the browser owns the animation. The ECharts tab has to re-push its
   * option twice a beat to get the same effect on a canvas.
   *
   * Re-run after every render because Raphael rebuilds these shapes and the
   * class does not survive.
   */
  const markFlagged = () => {
    if (!frame.current) return
    const shapes = frame.current.querySelectorAll(NODE_SHAPES)
    if (shapes.length !== order.current.length) return
    order.current.forEach((id, i) => {
      shapes[i]?.classList.toggle('is-flagged', !!id && flagged.current.has(id))
    })
  }

  /**
   * The node id under a pointer event, or null.
   *
   * Drag-node exposes no node identity in the DOM — no id attribute, no data
   * attribute — so the only handle left is position in the render order. Nodes
   * are drawn into a single `nodesGroup` as Raphael two-arc paths, one per
   * dataset entry and in dataset order, which is what makes the index the id.
   *
   * The count check is the safety rail. If a future release ever renders a
   * different number of shapes, this returns null and interaction is lost,
   * rather than confidently expanding the wrong node.
   */
  const idAtTarget = (target: EventTarget | null): string | null => {
    const shape = target instanceof SVGElement ? target : null
    if (!frame.current || !shape || shape.tagName !== 'path') return null
    const shapes = frame.current.querySelectorAll(NODE_SHAPES)
    if (shapes.length !== order.current.length) return null
    const index = Array.prototype.indexOf.call(shapes, shape)
    return index < 0 ? null : (order.current[index] ?? null)
  }

  useEffect(() => {
    const el = frame.current!

    const instance = new FusionCharts({
      type: 'dragnode',
      renderAt: el,
      width: '100%',
      height: '100%',
      dataFormat: 'json',
      // No `connectors` key, for the reason spelled out where the real one is
      // built: an empty connector group throws during render and kills the
      // instance before the first setJSONData can replace it.
      dataSource: { chart: {}, dataset: [{ data: [] }] }
    })
    // Fires after every draw, including each setJSONData, which is when the
    // node shapes exist again and can be re-tagged.
    instance.addEventListener('renderComplete', markFlagged)
    instance.render()
    chart.current = instance

    const onClick = (event: Event) => {
      const id = idAtTarget(event.target)
      if (id) handlers.current?.onNodeClick(id)
      else handlers.current?.onBackgroundClick()
    }

    // mouseover/mouseout bubble (mouseenter/mouseleave do not), which is what
    // makes one listener on the frame enough for every node.
    const onOver = (event: MouseEvent) => {
      const id = idAtTarget(event.target)
      if (!id || id === hoveredId.current) return
      hoveredId.current = id
      handlers.current?.onNodeHover(id, { x: event.clientX, y: event.clientY })
    }

    const onOut = (event: MouseEvent) => {
      if (!idAtTarget(event.target)) return
      hoveredId.current = null
      handlers.current?.onNodeHover(null, null)
    }

    el.addEventListener('click', onClick)
    el.addEventListener('mouseover', onOver as EventListener)
    el.addEventListener('mouseout', onOut as EventListener)

    const observer = new ResizeObserver(entries => {
      const box = entries[0]?.contentRect
      if (!build.current || !box || !box.width || !box.height) return
      chart.current?.setJSONData(build.current(box.width, box.height))
    })
    observer.observe(el)

    // Publishing *nothing* is the honest answer here, and it is a result.
    //
    // PowerCharts DragNode has no pan, no zoom and no viewport of any kind. The
    // nearest equivalent would be narrowing the axis bounds in `build` and
    // calling `setJSONData` again — which is a full chart rebuild per frame, not
    // a viewport transform, and reporting that as this engine's zoom cost would
    // be comparing a re-render against seven transforms. The benchmark records
    // "unsupported" instead.
    if (onViewport) onViewport(null)

    return () => {
      observer.disconnect()
      el.removeEventListener('click', onClick)
      el.removeEventListener('mouseover', onOver as EventListener)
      el.removeEventListener('mouseout', onOut as EventListener)
      instance.dispose()
      chart.current = null
    }
  }, [])

  useEffect(() => {
    if (!chart.current) return
    // The update cost, reported to App for the pane header.
    const started = performance.now()

    // Positions come from App — the same object the ECharts tab is handed, so
    // the two tabs stay comparable, and incremental, so an expansion leaves the
    // nodes already on screen exactly where they were.
    const { links, pivots } = withLoops(graph, positions)

    build.current = (width, height) => {
      const placed: Point[] = graph.nodes.flatMap(n => {
        const at = positions[n.id]
        return at ? [at] : []
      })
      const box = axisBox(placed.concat(pivots), width, height)

      // Axis units per pixel, so a caption can be offset a fixed number of
      // pixels below a node in a space that is measured in data units.
      const unitY = (box.maxY - box.minY) / height
      const captions: DragNodeData['labels']['label'] = []

      const nodes: DragNode[] = graph.nodes.map(node => {
        const meta = ENTITY[node.type]
        const behind = hidden.get(node.id) || 0
        const pending = isPending(node.id)
        const radius = node.level === 0 ? 19 : node.flagged ? 14 : 11
        // Non-null: an unplaced node cannot be drawn, and `layoutRadial` places
        // every node in the graph it is given.
        const at = positions[node.id]!

        // A free-text label rather than the node's own `label`, which would be
        // clipped to the disc. There is no badge hook either, so the count of
        // links still hidden is appended to the caption.
        captions.push({
          text: `${meta.tag} ${node.name}` + (behind > 0 ? `  +${behind}` : ''),
          x: String(at.x),
          y: String(-at.y - (radius + 14) * unitY),
          allowDrag: '0'
        })

        return {
          id: node.id,
          x: String(at.x),
          y: String(-at.y),
          // Left blank on purpose: any text here renders *over* the node and
          // becomes the pointer target, which would swallow every hover and
          // click before the event bridge could see the shape underneath.
          label: '',
          shape: 'circle',
          radius: String(radius),
          color: nodeColor(meta.color, { explored: isExpanded(node.id), pending }),
          alpha: pending ? '55' : '100',
          borderColor: node.flagged ? FLARE : INK,
          // Brightened rather than replaced: a flat white hover throws away the
          // one thing the disc encodes, which is the entity type.
          hoverColor: mix(meta.color, BONE, 0.4),
          allowDrag: '1'
        }
      })

      // Pivots go last so that if a future FusionCharts release stops emitting a
      // shape for a zero-alpha node, the index mapping for the real nodes still
      // holds and only the count check has to be relaxed.
      pivots.forEach(pivot => {
        nodes.push({
          id: pivot.id,
          x: String(pivot.x),
          y: String(-pivot.y),
          label: '',
          shape: 'circle',
          // Not zero: a node with no radius draws no shape, and the event
          // bridge counts on one shape per dataset entry.
          radius: '1',
          alpha: '0',
          color: INK,
          allowDrag: '0'
        })
      })

      order.current = [...graph.nodes.map(n => n.id), ...pivots.map(() => null)]

      const dataSource: DragNodeData = {
        chart: {
          bgColor: INK,
          bgAlpha: '100',
          showBorder: '0',
          showCanvasBorder: '0',
          canvasBorderAlpha: '0',
          canvasBgAlpha: '0',
          // Edit mode is the default and puts a Settings button plus add/delete
          // dialogs on the canvas. Adding and deleting here is the side panel's
          // job, against shared state both renderers read.
          viewMode: '1',
          allowDrag: '1',
          // Our hover card carries the summary and its two actions; the native
          // tooltip cannot hold a button, and two panels would compete.
          showTooltip: '0',
          showLegend: '0',
          showXAxisValues: '0',
          showYAxisValues: '0',
          showXAxisLine: '0',
          showYAxisLine: '0',
          numDivLines: '0',
          numVDivLines: '0',
          divLineAlpha: '0',
          vDivLineAlpha: '0',
          showAlternateHGridColor: '0',
          showAlternateVGridColor: '0',
          chartTopMargin: '4',
          chartBottomMargin: '4',
          chartLeftMargin: '4',
          chartRightMargin: '4',
          baseFont: 'Inter Tight',
          baseFontSize: '11',
          baseFontColor: '#9AA2B1',
          xAxisMinValue: String(box.minX),
          xAxisMaxValue: String(box.maxX),
          yAxisMinValue: String(box.minY),
          yAxisMaxValue: String(box.maxY)
        },
        dataset: [{ data: nodes }],
        // Not an array — drag-node wraps this single object itself.
        labels: { label: captions }
      }

      // One connector group wrapping a `connector` array. The published examples
      // elide this wrapper, but the group is where shared line attributes live
      // and drag-node reads `group.connector` for the links.
      //
      // The key is *absent*, not empty, when there is nothing to draw. A group
      // with no connectors reaches drag-node's `allocatePosition`, which reads
      // `components.data.length` off a collection it never built and throws;
      // the instance then stays blank even once links arrive. An unexpanded
      // root is exactly that case, and so is the state Reset returns to.
      if (links.length) {
        dataSource.connectors = [
          {
            stdThickness: '1',
            connector: links.map(link => ({
              from: link.from,
              to: link.to,
              label: link.label || '',
              color: link.loop ? LOOP : link.synthetic ? SYNTH : EDGE,
              alpha: '90',
              // Connectors are straight lines with no curvature control, so the
              // three-segment loop reads as a flattened triangle here where
              // ECharts can bow each segment out.
              arrowAtStart: '0',
              arrowAtEnd: link.arrow ? '1' : '0',
              strength: '1'
            }))
          }
        ]
      }

      return dataSource
    }

    flagged.current = new Set(graph.nodes.filter(n => n.flagged).map(n => n.id))

    const rect = frame.current!.getBoundingClientRect()
    chart.current.setJSONData(build.current(rect.width || 800, rect.height || 600))
    // renderComplete covers the normal path; this catches the case where the
    // draw was already synchronous and the event fired before order.current
    // matched the shapes on screen.
    requestAnimationFrame(markFlagged)

    if (onStat) onStat(Math.round(performance.now() - started))
  }, [graph, positions, hidden, statusVersion, isExpanded, isPending, onStat])

  return <div className="canvas" ref={frame} />
}

// Same reason as the ECharts side: keep hover state in App from re-running the
// data effect, which would rebuild and re-render the whole chart on every move.
export default React.memo(FusionGraph)
