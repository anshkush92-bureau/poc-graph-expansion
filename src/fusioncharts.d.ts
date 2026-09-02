// fusioncharts 4.2 ships no type definitions, and DefinitelyTyped has none for
// the plain (non-React) package. Only the handful of members this repo touches
// is declared — the suite's real surface is enormous and none of the rest is
// used here.

declare module 'fusioncharts' {
  export interface FusionChartsConfig {
    type: string
    renderAt: HTMLElement
    width: string
    height: string
    dataFormat: string
    dataSource: unknown
  }

  export default class FusionCharts {
    constructor(config: FusionChartsConfig)
    render(): void
    dispose(): void
    setJSONData(data: unknown): void
    addEventListener(event: string, handler: () => void): void
  }
}

declare module 'fusioncharts/fusioncharts.powercharts' {
  import type FusionCharts from 'fusioncharts'

  /** Registers the PowerCharts module, which is where `dragnode` lives. */
  export default function PowerCharts(core: typeof FusionCharts): void
}
