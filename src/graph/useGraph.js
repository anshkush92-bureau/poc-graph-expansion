import { useCallback, useRef, useState } from 'react'
import { ENTITY, ROOT, fetchNeighbors, relationLabel } from './data.js'
import { mergeGraph, removeNode } from './ops.js'

/**
 * The whole interaction model, shared by both renderers.
 *
 * `expand` works on any node at any depth, so expansion is recursive by
 * construction: expanding a level-2 node reveals level 3, and so on until the
 * backend stops returning neighbours.
 */
export function useGraph() {
  const [graph, setGraph] = useState({ nodes: [ROOT], edges: [] })
  // id -> 'pending' | 'done'. A ref because the click handler has to check it
  // synchronously: a second click landing before the first fetch resolves
  // would otherwise duplicate the entire level.
  const status = useRef(new Map())
  const [statusVersion, bump] = useState(0)
  const counter = useRef(0)

  const publish = () => bump(v => v + 1)

  const expand = useCallback(node => {
    if (!node || status.current.has(node.id)) return
    status.current.set(node.id, 'pending')
    publish()
    fetchNeighbors(node).then(incoming => {
      // React 18+ batches these automatically; before 19 this needed
      // unstable_batchedUpdates or the graph re-rendered and re-laid-out twice.
      status.current.set(node.id, 'done')
      setGraph(g => mergeGraph(g, incoming))
      publish()
    })
  }, [])

  const addNode = useCallback((parent, type) => {
    counter.current += 1
    const n = counter.current
    const child = {
      id: `${ENTITY[type].tag}-manual-${n}`,
      type,
      level: parent.level + 1,
      name: `${type}_added_${n}`,
      risk: 0,
      flagged: false,
      firstSeen: 'added by analyst',
      events: 0,
      synthetic: true
    }
    setGraph(g => mergeGraph(g, {
      nodes: [child],
      edges: [{
        id: `${parent.id}->${child.id}`,
        source: parent.id,
        target: child.id,
        label: relationLabel(parent.type, type),
        synthetic: true
      }]
    }))
    return child
  }, [])

  const deleteNode = useCallback(id => {
    if (id === ROOT.id) return false // the graph needs somewhere to start
    setGraph(g => removeNode(g, id))
    // Drop the status too, so a re-added node can be expanded again.
    status.current.delete(id)
    publish()
    return true
  }, [])

  const reset = useCallback(() => {
    setGraph({ nodes: [ROOT], edges: [] })
    status.current = new Map()
    publish()
  }, [])

  /**
   * Replaces the whole graph — the stress dial's entry point.
   *
   * Expansion status is dropped with it, so the loaded nodes are all unexplored
   * and stay clickable: a synthetic graph is still a live graph, and expanding a
   * node inside one adds real neighbours on top of it.
   */
  const load = useCallback(next => {
    setGraph(next)
    status.current = new Map()
    publish()
  }, [])

  // Stable identities: both read a ref, so an empty dep list is safe. If these
  // were re-created each render, every consumer's useMemo would miss and the
  // React Flow layout would recompute on unrelated state changes like hover.
  const isExpanded = useCallback(id => status.current.get(id) === 'done', [])
  const isPending = useCallback(id => status.current.get(id) === 'pending', [])

  return { graph, isExpanded, isPending, statusVersion, expand, addNode, deleteNode, reset, load }
}
