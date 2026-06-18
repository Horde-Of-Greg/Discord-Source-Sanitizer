import type { FilterLoadResult } from "../../../filters/pipeline/FilterLoadResult.js";

export interface IFilterLoadingPipeline {
    load(): Promise<FilterLoadResult>;
}
