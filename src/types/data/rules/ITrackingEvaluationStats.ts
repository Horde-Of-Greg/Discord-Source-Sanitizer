import type { IEvaluationCounters } from "./IEvaluationCounters.js";

export interface ITrackingEvaluationStats extends IEvaluationCounters {
    hostBucketsResolved: number;
    conditionsEvaluated: number;
    activeIndexes: number;
}
