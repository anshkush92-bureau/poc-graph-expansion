# Graph Report - .  (2026-09-03)

## Corpus Check
- 89 files · ~169,320 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 632 nodes · 1197 edges · 40 communities (37 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.86)
- Token cost: 225,715 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Canvas Pane Adapters|Canvas Pane Adapters]]
- [[_COMMUNITY_ECharts Pipeline & Engine Registry|ECharts Pipeline & Engine Registry]]
- [[_COMMUNITY_Bench UI & Result Store|Bench UI & Result Store]]
- [[_COMMUNITY_Measurement Probes & Optimisers|Measurement Probes & Optimisers]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Layout Solver & Worker|Layout Solver & Worker]]
- [[_COMMUNITY_TypeScript Compiler Config|TypeScript Compiler Config]]
- [[_COMMUNITY_Sweep Data & POC Constraints|Sweep Data & POC Constraints]]
- [[_COMMUNITY_Rendering Families & Blind Spots|Rendering Families & Blind Spots]]
- [[_COMMUNITY_Report Table Driver|Report Table Driver]]
- [[_COMMUNITY_Bundle Size Probe|Bundle Size Probe]]
- [[_COMMUNITY_Cold Load & Cost Metrics|Cold Load & Cost Metrics]]
- [[_COMMUNITY_Migration Design Decisions|Migration Design Decisions]]
- [[_COMMUNITY_Engine Verdict & Rankings|Engine Verdict & Rankings]]
- [[_COMMUNITY_Migration Task Plan|Migration Task Plan]]
- [[_COMMUNITY_Parameter Sweep Driver|Parameter Sweep Driver]]
- [[_COMMUNITY_Frame Time Metrics|Frame Time Metrics]]
- [[_COMMUNITY_Expansion & Radial Layout|Expansion & Radial Layout]]
- [[_COMMUNITY_App Views & Routing|App Views & Routing]]
- [[_COMMUNITY_Zoom, Pan & Props Contract|Zoom, Pan & Props Contract]]
- [[_COMMUNITY_Hover, Hit Area & Synth Graph|Hover, Hit Area & Synth Graph]]
- [[_COMMUNITY_Streaming & Memory Leaks|Streaming & Memory Leaks]]
- [[_COMMUNITY_React Flow Port|React Flow Port]]
- [[_COMMUNITY_Prettier Formatting|Prettier Formatting]]
- [[_COMMUNITY_RFC HTML Builder|RFC HTML Builder]]
- [[_COMMUNITY_Worker Layout Finding|Worker Layout Finding]]
- [[_COMMUNITY_App Entry & Upgrade|App Entry & Upgrade]]
- [[_COMMUNITY_Shared Type Layer|Shared Type Layer]]
- [[_COMMUNITY_Hover Driver|Hover Driver]]
- [[_COMMUNITY_Hover Driver Retry|Hover Driver Retry]]
- [[_COMMUNITY_LOD & Viewport Culling|LOD & Viewport Culling]]
- [[_COMMUNITY_Edge Style Resolution|Edge Style Resolution]]
- [[_COMMUNITY_Node Symbol Catalogue|Node Symbol Catalogue]]
- [[_COMMUNITY_Node Expansion Interaction|Node Expansion Interaction]]
- [[_COMMUNITY_FusionCharts Type Shim|FusionCharts Type Shim]]
- [[_COMMUNITY_Full Bench Driver|Full Bench Driver]]
- [[_COMMUNITY_CSS Type Shim|CSS Type Shim]]

## God Nodes (most connected - your core abstractions)
1. `GraphNode` - 19 edges
2. `compilerOptions` - 19 edges
3. `Graph` - 18 edges
4. `TypeScript Migration Implementation Plan` - 18 edges
5. `ENTITY` - 17 edges
6. `Positions` - 15 edges
7. `nodeColor()` - 15 edges
8. `GraphEngine` - 14 edges
9. `isSelfEdge()` - 14 edges
10. `mix()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `unsupported as a first-class scenario result` --semantically_similar_to--> `Rule: '—' is not zero`  [INFERRED] [semantically similar]
  README.md → METRICS.md
- `FREEZE_AT threshold (30 nodes)` --semantically_similar_to--> `Incremental Layout Toggle`  [INFERRED] [semantically similar]
  ECHARTS_PIPELINE.md → README.md
- `leakMB baseline sign error` --semantically_similar_to--> `ECharts streaming pass-claim retracted on repeat`  [INFERRED] [semantically similar]
  METRICS.md → COMPARISON.md
- `Hover calibration pass (4 px grid)` --semantically_similar_to--> `synthGraph spanning tree + edge target floor/ceiling`  [INFERRED] [semantically similar]
  METRICS.md → BENCHMARKING.md
- `replaceMerge with a stable series id` --semantically_similar_to--> `A delta channel in the renderer props`  [INFERRED] [semantically similar]
  ECHARTS_PIPELINE.md → COMPARISON.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **The seven scripted benchmark scenarios** — benchmarking_hairball, benchmarking_expansion, benchmarking_streaming, benchmarking_zoom_pan, benchmarking_layout_worker, benchmarking_lod_culling, benchmarking_hover_debounce [EXTRACTED 1.00]
- **The memory metrics that together diagnose a leak** — metrics_heapmb, metrics_heapslopembs, metrics_heappernodekb, metrics_basemb, metrics_leakmb [EXTRACTED 1.00]
- **The eight graph engines under comparison** — readme_echarts, readme_fusioncharts, readme_cytoscape, readme_vis_network, readme_v_network_graph, readme_jsplumb, readme_neo4j_nvl, readme_react_flow [EXTRACTED 1.00]
- **Benchmark measurement integrity practices** — bench_data_readme_leakmb_metric_defect, bench_data_readme_missing_vs_drivererror, bench_data_readme_duplicate_config_variance, bench_data_readme_expose_gc, specs_2026_08_31_graph_bench_poc_real_tab_measurement, specs_2026_08_31_graph_bench_poc_one_engine_per_run [INFERRED 0.85]
- **Uniform engine contract: props, viewport handle, manifest, barrel** — specs_2026_09_02_ts_migration_design_graphpaneprops, specs_2026_09_02_ts_migration_design_viewporthandle, specs_2026_09_02_ts_migration_design_graphengine, specs_2026_09_02_ts_migration_design_explicit_barrel, specs_2026_08_31_graph_bench_poc_identical_prop_contract [EXTRACTED 1.00]
- **TS migration phase sequence: runtime, harness, types, adapters, lockdown** — plans_2026_09_02_ts_migration_task1_runtime_upgrade, plans_2026_09_02_ts_migration_task5_harness, plans_2026_09_02_ts_migration_task6_type_layer, plans_2026_09_02_ts_migration_task9_registry_split, plans_2026_09_02_ts_migration_task11_canvas_adapters, plans_2026_09_02_ts_migration_task14_bench_tree, plans_2026_09_02_ts_migration_task15_lockdown [EXTRACTED 1.00]

## Communities (40 total, 3 thin omitted)

### Community 0 - "Canvas Pane Adapters"
Cohesion: 0.05
Nodes (72): CytoscapeGraph(), dataFor(), STYLE, EntityType, GraphEdge, GraphNode, GraphPaneProps, Point (+64 more)

### Community 1 - "ECharts Pipeline & Engine Registry"
Cohesion: 0.05
Nodes (47): baseSizeOf(), EDGE_LABEL, GraphView, NO_OVERRIDES, RICH, SeriesNode, ShapeSet, sizeOf() (+39 more)

### Community 2 - "Bench UI & Result Store"
Cohesion: 0.07
Nodes (43): BenchView(), Headline, LabPane(), num(), SectionKey, SECTIONS, SOLVER, surfaceClass() (+35 more)

### Community 3 - "Measurement Probes & Optimisers"
Cohesion: 0.07
Nodes (41): HudStats, IDLE, useHud(), Box, centreBox(), cullToBox(), optimise(), OptimiseOptions (+33 more)

### Community 4 - "Package Dependencies"
Cohesion: 0.04
Nodes (46): dependencies, cytoscape, d3-force, echarts, fusioncharts, @jsplumb/browser-ui, @neo4j-nvl/base, @neo4j-nvl/interaction-handlers (+38 more)

### Community 5 - "Layout Solver & Worker"
Cohesion: 0.19
Nodes (17): forceLayout(), ForceOptions, ForceResult, now(), SimNode, LayoutMode, LayoutRequest, LayoutResponse (+9 more)

### Community 6 - "TypeScript Compiler Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, allowJs, exactOptionalPropertyTypes, isolatedModules, jsx, lib, module (+12 more)

### Community 7 - "Sweep Data & POC Constraints"
Cohesion: 0.13
Nodes (20): Eleven twice-measured configurations as variance estimate, EXPOSE_GC and one-browser-at-a-time rule, Trusted pointer input hover run, leakMB baseline defect and the fixed leak metric, missing vs driverError distinction, Raw rows behind RFC §5, Sweep plan files and repeatable runs, React Flow has no layout engine, hence layoutRadial (+12 more)

### Community 8 - "Rendering Families & Blind Spots"
Cohesion: 0.12
Nodes (17): Finding the absolute breaking point, Customisation versus performance (unmeasured), Hairball scenario, What this does not measure, The paint backend knob, Three rendering families (SVG / canvas / WebGL), What this file still cannot tell you, 'Has a WebGL mode' means nothing until measured (+9 more)

### Community 9 - "Report Table Driver"
Cohesion: 0.13
Nodes (11): ENG, followup, g(), hover, main, missing, NAME, pass1 (+3 more)

### Community 10 - "Bundle Size Probe"
Cohesion: 0.13
Nodes (10): attributed, base, claimed, manifest, NAME, orphans, paneKeys, panes (+2 more)

### Community 11 - "Cold Load & Cost Metrics"
Cohesion: 0.15
Nodes (13): Cold load at 1,000 nodes (54x spread), React Flow: 2 ms of library work, 293 ms to pixels, blockedMs / longestTaskMs (longtask observer), Rule: '—' is not zero, domNodes / domPerNode DOM footprint, heapMB delta, heapPerNodeKB, inputP50Ms / inputP95Ms pointer-to-paint latency (+5 more)

### Community 12 - "Migration Design Decisions"
Cohesion: 0.21
Nodes (13): exhaustive-deps as warning, not error, Prettier configured to the house style before conversion, Task 5: TypeScript, Vitest, ESLint and Prettier harness, Task 9: Split the registry into per-library manifests, TypeScript migration and per-library engine contract design, controls array replaces the showsEcharts hardcode, Explicit engines barrel over import.meta.glob, fetchNeighbors as the deferred backend seam (+5 more)

### Community 13 - "Engine Verdict & Rankings"
Cohesion: 0.18
Nodes (12): Breaking-point table (ttfrMs 1k-50k), Read the longest-task column, not the total, Measured on the pre-migration React 16.14 stack, The Verdict — eight engines ranked, The shape/edge picker is ECharts-only, Cytoscape.js engine, FusionCharts engine, jsPlumb engine (connectivity toolkit) (+4 more)

### Community 14 - "Migration Task Plan"
Cohesion: 0.18
Nodes (12): TypeScript Migration Implementation Plan, Never use any; unknown plus narrowing or a scoped .d.ts shim, Preserve every existing comment constraint, Task 10: A contract test for the registry, Task 11: Convert the four self-contained canvas adapters, Task 12: Convert the three framework-boundary adapters, Task 13: Convert the Vue island, then close the contract, Task 14: Convert the benchmark tree (+4 more)

### Community 15 - "Parameter Sweep Driver"
Cohesion: 0.24
Nodes (8): args, dial(), esc(), out, pick(), plan, [planPath, outPath], started

### Community 16 - "Frame Time Metrics"
Cohesion: 0.22
Nodes (10): A protocol that produces defensible numbers, Reproducing the passes, dropped frames metric, fps metric, The FPS bar chart is the trap, Rule: a mean hides the failure you can see, p95 frame time (headline metric), Measurement Probes (probes.ts primitives) (+2 more)

### Community 17 - "Expansion & Radial Layout"
Cohesion: 0.27
Nodes (10): Expansion scenario, Domain model holds no visual information, FREEZE_AT threshold (30 nodes), layoutRadial(graph, prev) positional memory, The ECharts rendering pipeline (eight STEPs), Expansion metrics (p50Ms, layoutP95Ms, firstMs/lastMs), At 20 clicks p95Ms is arithmetically worstMs, Apache ECharts engine (+2 more)

### Community 18 - "App Views & Routing"
Cohesion: 0.20
Nodes (10): Why the bench runs one engine at a time, Run-to-run spread (43-92% where marginal), Do not average across scenarios into one score, Run it more than once, report the median, Bench View (#/bench), Compare View (#/compare), Explore View (#/explore), Hash Routing (src/route.ts) (+2 more)

### Community 19 - "Zoom, Pan & Props Contract"
Cohesion: 0.25
Nodes (8): Zoom & pan scenario, A delta channel in the renderer props, name is the join key, not id, replaceMerge with a stable series id, STEP 0 as a separate setup effect, zoom sent on the first push only, GraphPaneProps contract, ViewportHandle { zoomBy, panBy, fit }

### Community 20 - "Hover, Hit Area & Synth Graph"
Cohesion: 0.29
Nodes (7): Hover & debounce scenario, synthGraph spanning tree + edge target floor/ceiling, callbacksPerMove (deliberately not ranked), hitArea — engines disagree on 'on a node', Hover calibration pass (4 px grid), The Stress Dial (Nodes / Edges), synthGraph deterministic synthetic graph

### Community 21 - "Streaming & Memory Leaks"
Cohesion: 0.43
Nodes (7): Streaming scenario, ECharts streaming pass-claim retracted on repeat, Streaming results — absorbed feed rate, baseMB per-engine footprint, heapSlopeMBs least-squares heap slope, leakMB empty-pane-to-empty-pane retention, leakMB baseline sign error

### Community 22 - "React Flow Port"
Cohesion: 0.29
Nodes (7): FIT maxZoom cap for the one-node graph, Module-level nodeTypes/edgeTypes constants, SelfLoopEdge explicit cubic arc, Task 3: Port the React Flow pane to @xyflow/react v12, Customization benchmark across all eight engines, Customization vs performance dimension, React Flow must change package to @xyflow/react

### Community 23 - "Prettier Formatting"
Cohesion: 0.29
Nodes (6): arrowParens, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 24 - "RFC HTML Builder"
Cohesion: 0.33
Nodes (5): bad, forHead, fragment, lines, rest

### Community 25 - "Worker Layout Finding"
Cohesion: 0.40
Nodes (6): Layout & worker scenario, One shared d3-force solver for every engine, Put the layout in a Web Worker (top finding), runLayout() main-thread vs worker, Synchronously pumped d3-force ticks, transferMs structured-clone cost

### Community 26 - "App Entry & Upgrade"
Cohesion: 0.33
Nodes (6): index.html #root mount point, createRoot entry point replacing ReactDOM.render, Task 1: Upgrade Node, React and Vite — still JavaScript, Task 2: Verify the six React-agnostic panes, Deleting the unstable_batchedUpdates workaround, Only one engine mounted during a measured run

### Community 27 - "Shared Type Layer"
Cohesion: 0.33
Nodes (6): EDGE_RULES rebuilt to preserve the literal key union, statusVersion in the memo deps because status lives in a ref, Task 6: The shared type layer, Identical prop contract across every renderer, GraphPaneProps compiler-enforced adapter contract, ViewportHandle relative-zoom handle

### Community 28 - "Hover Driver"
Cohesion: 0.40
Nodes (4): ENGINES, out, SIZE, started

### Community 29 - "Hover Driver Retry"
Cohesion: 0.40
Nodes (4): ENGINES, out, SIZE, started

### Community 30 - "LOD & Viewport Culling"
Cohesion: 0.60
Nodes (5): LOD & culling scenario, LOD and culling — a targeted fix, not a general one, kept — the denominator for every optimisation row, optimise() — LOD + culling in the shared layer, Rule: never quote a speed-up without its denominator

### Community 31 - "Edge Style Resolution"
Cohesion: 0.50
Nodes (5): Colour is deliberately not part of an edge style, ctx.level, -1 for a loop's pivot legs, Three-source edge style resolution, Override key drops the #suffix so loop legs restyle together, withLoops — self-edge to three links over two pivots

### Community 32 - "Node Symbol Catalogue"
Cohesion: 0.40
Nodes (5): dataToPoint via series.coordinateSystem, CSS pulse rings over the canvas (STEP 8), Shape per entity type as the shipping default, symbols.ts customization catalog, symbolSize is a bounding box, so shapes carry a scale

### Community 33 - "Node Expansion Interaction"
Cohesion: 0.67
Nodes (3): Degree Readout on the Peek Card, fetchNeighbors backend stand-in, Recursive One-level Node Expansion

## Ambiguous Edges - Review These
- `Bench View (#/bench)` → `Run it more than once, report the median`  [AMBIGUOUS]
  METRICS.md · relation: conceptually_related_to
- `index.html #root mount point` → `Only one engine mounted during a measured run`  [AMBIGUOUS]
  index.html · relation: conceptually_related_to

## Knowledge Gaps
- **205 isolated node(s):** `fragment`, `lines`, `forHead`, `rest`, `bad` (+200 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Bench View (#/bench)` and `Run it more than once, report the median`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `index.html #root mount point` and `Only one engine mounted during a measured run`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `GraphNode` connect `Canvas Pane Adapters` to `ECharts Pipeline & Engine Registry`, `Bench UI & Result Store`, `Measurement Probes & Optimisers`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `The Verdict — eight engines ranked` connect `Engine Verdict & Rankings` to `Rendering Families & Blind Spots`, `Frame Time Metrics`, `App Views & Routing`, `Streaming & Memory Leaks`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `ENTITY` connect `Canvas Pane Adapters` to `ECharts Pipeline & Engine Registry`, `Measurement Probes & Optimisers`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `fragment`, `lines`, `forHead` to the rest of the system?**
  _234 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Canvas Pane Adapters` be split into smaller, more focused modules?**
  _Cohesion score 0.0507048180096781 - nodes in this community are weakly interconnected._