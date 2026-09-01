// Stand-in for the graph backend. Swap `fetchNeighbors` for a real Cypher call
// (`MATCH (n {id:$id})--(m) RETURN m`) and nothing else in the app changes.

export const ENTITY = {
  account: { label: 'Account', color: '#E8A33D', tag: 'ACC' },
  device: { label: 'Device', color: '#7FD4E8', tag: 'DEV' },
  phone: { label: 'Phone', color: '#9B8CFF', tag: 'TEL' },
  email: { label: 'Email', color: '#5FD39B', tag: 'EML' },
  ip: { label: 'IP address', color: '#C9C3B5', tag: 'NET' },
  card: { label: 'Card', color: '#E5484D', tag: 'CRD' }
}

// What each entity type tends to connect to, in order of preference.
const LINKS = {
  account: ['device', 'phone', 'email', 'card'],
  device: ['account', 'ip', 'phone'],
  phone: ['account', 'device'],
  email: ['account', 'device'],
  ip: ['device', 'account'],
  card: ['account', 'ip']
}

const RELATION = {
  'account>device': 'SIGNED_IN_FROM',
  'account>phone': 'VERIFIED_WITH',
  'account>email': 'REGISTERED_AS',
  'account>card': 'PAID_WITH',
  'device>account': 'SHARED_BY',
  'device>ip': 'SEEN_ON',
  'device>phone': 'PAIRED_WITH',
  'phone>account': 'SHARED_BY',
  'phone>device': 'PAIRED_WITH',
  'email>account': 'SHARED_BY',
  'email>device': 'SEEN_ON',
  'ip>device': 'HOSTED',
  'ip>account': 'SHARED_BY',
  'card>account': 'SHARED_BY',
  'card>ip': 'AUTHORISED_FROM'
}

export const MAX_DEPTH = 4

// Deterministic hash so the same node always has the same neighbours — the
// graph is stable across reloads and screenshots.
function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0)
}

const pick = (id, salt, n) => hash(id + ':' + salt) % n

/**
 * How many neighbours a node has in the backend, whether or not they are on
 * screen yet. The hover card needs this before the node is ever expanded.
 */
export function degreeOf(node) {
  if (node.synthetic) return 0
  if (node.level >= MAX_DEPTH) return 0
  return 2 + pick(node.id, 'degree', 3)
}

export function relationLabel(fromType, toType) {
  return RELATION[fromType + '>' + toType] || 'RELATED_TO'
}

// Entities that can legitimately relate to themselves: the same device
// retrying, the same card re-authorising, an IP re-routing through itself.
const SELF_RELATION = {
  device: 'REPEAT_ATTEMPT',
  card: 'RE_AUTHORISED',
  ip: 'REROUTED_VIA'
}

/** The self-referring relationship on a node, if the backend holds one. */
export function selfEdgeFor(node) {
  const label = SELF_RELATION[node.type]
  if (!label || node.synthetic) return null
  if (pick(node.id, 'self', 2) !== 0) return null
  return { id: `${node.id}<->${node.id}`, source: node.id, target: node.id, label }
}

function makeNode(parent, index) {
  const options = LINKS[parent.type]
  const type = options[pick(parent.id, 'type' + index, options.length)]
  const seq = pick(parent.id, 'seq' + index, 9000) + 1000
  const risk = pick(parent.id, 'risk' + index, 100)
  return {
    id: `${ENTITY[type].tag}-${seq}-${parent.level + 1}${index}`,
    type,
    level: parent.level + 1,
    name: nameFor(type, seq),
    risk,
    flagged: risk > 82,
    firstSeen: `2026-0${1 + (seq % 6)}-${10 + (seq % 18)}`,
    events: 4 + (seq % 240)
  }
}

function nameFor(type, seq) {
  switch (type) {
    case 'account': return `acct_${seq}`
    case 'device': return `${['iPhone 14', 'Pixel 7', 'Win/Chrome', 'macOS/Safari'][seq % 4]}`
    case 'phone': return `+91 ${seq}${(seq * 7) % 100000}`
    case 'email': return `user${seq}@${['proton.me', 'gmail.com', 'mailinator.com'][seq % 3]}`
    case 'ip': return `10.${seq % 255}.${(seq * 3) % 255}.${(seq * 11) % 255}`
    case 'card': return `**** ${String(seq).padStart(4, '0')}`
    default: return String(seq)
  }
}

export const ROOT = {
  id: 'ACC-4471-0',
  type: 'account',
  level: 0,
  name: 'acct_4471',
  risk: 74,
  flagged: false,
  firstSeen: '2025-11-02',
  events: 1284
}

/**
 * Returns the next level down from `node`. Async on purpose — expansion has to
 * survive a real network round trip, including a second click while in flight.
 */
export function fetchNeighbors(node) {
  return new Promise(resolve => {
    setTimeout(() => {
      const count = degreeOf(node)
      const nodes = []
      for (let i = 0; i < count; i++) nodes.push(makeNode(node, i))
      const edges = []
      nodes.forEach(child => {
        edges.push({
          id: `${node.id}->${child.id}`,
          source: node.id,
          target: child.id,
          label: relationLabel(node.type, child.type)
        })
        const loop = selfEdgeFor(child)
        if (loop) edges.push(loop)
      })
      resolve({ nodes, edges })
    }, 220)
  })
}
