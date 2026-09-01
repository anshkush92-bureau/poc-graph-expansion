# Graph Report - .  (2026-08-05)

## Corpus Check
- Large corpus: 32 files · ~1,002,392 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 102 nodes · 219 edges · 8 communities
- Extraction: 96% EXTRACTED · 3% INFERRED · 1% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.83)
- Token cost: 113,694 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Graph Ops & Self-Edge Loops|Graph Ops & Self-Edge Loops]]
- [[_COMMUNITY_Package Manifest & Deps|Package Manifest & Deps]]
- [[_COMMUNITY_App Shell & Expansion State|App Shell & Expansion State]]
- [[_COMMUNITY_ECharts Renderer & Build Config|ECharts Renderer & Build Config]]
- [[_COMMUNITY_Mock Graph Data Source|Mock Graph Data Source]]
- [[_COMMUNITY_FusionCharts Renderer & Theme|FusionCharts Renderer & Theme]]
- [[_COMMUNITY_POC Comparison Writeup|POC Comparison Writeup]]

## God Nodes (most connected - your core abstractions)
1. `ENTITY` - 11 edges
2. `isSelfEdge()` - 11 edges
3. `hiddenCounts()` - 11 edges
4. `App()` - 10 edges
5. `layoutRadial()` - 10 edges
6. `fetchNeighbors()` - 9 edges
7. `ops.test.js test suite` - 9 edges
8. `withLoops()` - 8 edges
9. `neighborsOf()` - 7 edges
10. `pathToRoot()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Three-attempt radial layout design decision` --rationale_for--> `layoutRadial()`  [EXTRACTED]
  COMPARISON.md → src/graph/ops.js
- `React 16 hover-performance fix set` --rationale_for--> `hiddenCounts()`  [EXTRACTED]
  COMPARISON.md → src/graph/ops.js
- `Self-edge (source===target) handling across graph walks` --rationale_for--> `isSelfEdge()`  [EXTRACTED]
  COMPARISON.md → src/graph/ops.js
- `Self-edge (source===target) handling across graph walks` --rationale_for--> `hiddenCounts()`  [EXTRACTED]
  COMPARISON.md → src/graph/ops.js
- `Self-edge (source===target) handling across graph walks` --rationale_for--> `neighborsOf()`  [EXTRACTED]
  COMPARISON.md → src/graph/ops.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Functions that had to learn to skip self-edges** — graph_ops_layoutradial, graph_ops_pathtoroot, graph_ops_hiddencounts, graph_ops_neighborsof [EXTRACTED 1.00]
- **Dual-renderer POC sharing one interaction model** — echarts_echartsgraph, fusion_fusiongraph, graph_usegraph_usegraph [EXTRACTED 1.00]
- **React 16 hover-performance fix set (10x speedup)** — echarts_echartsgraph, fusion_fusiongraph, graph_usegraph_expand, graph_ops_hiddencounts [EXTRACTED 1.00]

## Communities (8 total, 0 thin omitted)

### Community 0 - "Graph Ops & Self-Edge Loops"
Cohesion: 0.19
Nodes (20): Self-edge (source===target) handling across graph walks, EChartsGraph(), axisBox(), withLoops(), hiddenCount(), hiddenCounts(), isSelfEdge(), layoutRadial() (+12 more)

### Community 1 - "Package Manifest & Deps"
Cohesion: 0.11
Nodes (18): dependencies, echarts, fusioncharts, react, react-dom, description, devDependencies, vite (+10 more)

### Community 2 - "App Shell & Expansion State"
Cohesion: 0.25
Nodes (10): ENTITY, ROOT, removeNode(), addNode callback, deleteNode callback, useGraph(), App(), ENGINES (+2 more)

### Community 3 - "ECharts Renderer & Build Config"
Cohesion: 0.18
Nodes (9): EDGE_LABEL, RICH, RING_FADE, RING_SIZE, index.html entry document, echarts (Apache ECharts) dependency, fusioncharts dependency, package.json manifest (+1 more)

### Community 4 - "Mock Graph Data Source"
Cohesion: 0.27
Nodes (10): degreeOf(), fetchNeighbors(), LINKS, makeNode(), nameFor(), pick(), RELATION, relationLabel() (+2 more)

### Community 5 - "FusionCharts Renderer & Theme"
Cohesion: 0.31
Nodes (9): Native click/hover event binding via dataType filter, Canvas double-push pulse-ring mechanism, FusionGraph(), idAtTarget function, markFlagged function, hex(), mix(), nodeColor() (+1 more)

### Community 6 - "POC Comparison Writeup"
Cohesion: 0.36
Nodes (8): Neo4j NVL library, React 16 hover-performance fix set, Three-attempt radial layout design decision, React Flow v9 library, React Flow v9 recommendation for this POC, NVL vs React Flow comparison doc, expand callback, Identity graph walker README

## Ambiguous Edges - Review These
- `EChartsGraph.jsx` → `React Flow v9 library`  [AMBIGUOUS]
  COMPARISON.md · relation: conceptually_related_to
- `FusionGraph.jsx` → `Neo4j NVL library`  [AMBIGUOUS]
  COMPARISON.md · relation: conceptually_related_to

## Knowledge Gaps
- **33 isolated node(s):** `name`, `private`, `type`, `version`, `description` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `EChartsGraph.jsx` and `React Flow v9 library`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `FusionGraph.jsx` and `Neo4j NVL library`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `ENTITY` connect `App Shell & Expansion State` to `Graph Ops & Self-Edge Loops`, `ECharts Renderer & Build Config`, `Mock Graph Data Source`, `FusionCharts Renderer & Theme`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `App()` connect `App Shell & Expansion State` to `Graph Ops & Self-Edge Loops`, `POC Comparison Writeup`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `layoutRadial()` connect `Graph Ops & Self-Edge Loops` to `ECharts Renderer & Build Config`, `FusionCharts Renderer & Theme`, `POC Comparison Writeup`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `name`, `private`, `type` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Manifest & Deps` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._