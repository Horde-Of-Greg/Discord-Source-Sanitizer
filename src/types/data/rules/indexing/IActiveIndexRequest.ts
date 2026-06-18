import type { ITrackingEvaluationStats } from "../evaluation/ITrackingEvaluationStats.js";

export interface IActiveIndexRequest {
    url: URL;
    urlWithoutHash: string;
    counters?: ITrackingEvaluationStats;
}
