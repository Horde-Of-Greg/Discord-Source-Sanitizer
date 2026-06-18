import type { FilterLoadResult } from "../../filters/FilterLoadResult.js";

export interface IFilterLoadingPipeline {
    load(): Promise<FilterLoadResult>;
}
