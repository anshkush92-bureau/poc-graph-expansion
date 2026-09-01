# Raw rows behind RFC §5

Every number in [RFC.html](../RFC.html) / [RFC.md](../RFC.md) §5 comes from these
files. Nothing in the write-up is hand-typed — `.bench-drivers/report.mjs`
regenerates the tables from this directory.

| File | What is in it |
|---|---|
| `../graph-bench-results.json` | **first pass** — 7 scenarios × 8 engines at 1,000/1,500, plus the 8 Worker rows |
| `main-sweep.json` | 64 legs: LOD off / labels-only, the paint-backend swap on 3 engines, expansion at 1k/5k/20k, and the leak runs **on the old broken metric** |
| `wall-sweep.json` | 18 legs: hairball at 1k/5k/20k/50k. The 50k legs are empty — React Flow at 20,000 killed the renderer process and took the queue with it |
| `followup-sweep.json` | 26 legs, **7 landed**: the WebGL wall for Cytoscape and NVL. The rest lost to a tab wedge |
| `final-sweep.json` | 18 legs: the LOD-off row that a cold-start race dropped, the **12 leak runs on the fixed metric**, 50k canvas, and NVL WebGL expansion at 20k |
| `hover-sweep.json` | 8 legs: the hover scenario re-run with the calibration grid at ~4 px instead of a fixed 56 × 28 |
| `hover-grid-run.json` | partial: hover driven with **real trusted pointer input**. Abandoned — ~37,000 CDP round trips per engine. One result survives: FusionCharts reports hover under trusted input where it reported none under synthetic events |
| `plan-*.json` | the leg lists each sweep was driven from, so a run can be repeated exactly |

## Reading these honestly

- **Legs carry a `label`, and repeated `(engine, scenario)` pairs are normal.** The
  store keys one row per `engine::scenario`, so each leg's row is lifted out of
  `localStorage` immediately after it lands rather than at the end of the run.
- **`missing: true` or `driverError`** means no row came back. Sometimes that is a
  finding (the engine wedged the tab) and sometimes it is the driver (a Playwright
  action timeout firing while the page was legitimately blocked). The two are not
  interchangeable and the RFC distinguishes them per cell.
- **`leakMB` in `main-sweep.json` is wrong.** It was measured against a baseline
  read with the base graph already on screen, so any engine retaining nothing
  scored its own graph as a negative leak. Use `final-sweep.json` (`leakfix/*`),
  which also reports `baseMB`. See METRICS.md.
- **Eleven configurations were measured twice**, once in each pass. That is the
  only variance estimate here, and RFC §5.0 tabulates it: 0–3% where an engine has
  headroom, 43–92% where it is marginal. One conclusion was retracted on the
  strength of it.

## Re-running

```bash
npm run build && npm run preview          # port 4173
node .bench-drivers/sweep.mjs <plan.json> <out.json>
```

`EXPOSE_GC=1` adds `--js-flags="--expose-gc"`, without which the heap columns are
noise. Run one browser at a time — two Chromes sharing the CPU put each one's
frame times into the other's p95.
