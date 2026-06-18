import type { ITrackingEvaluationStats } from "./ITrackingEvaluationStats.js";

export interface IActiveIndexRequest {
    url: URL;
    urlWithoutHash: string;
    counters?: ITrackingEvaluationStats;
}
