import type { IEvaluationCounters } from "../indexing/IEvaluationCounters.js";

export interface ITrackingEvaluationStats extends IEvaluationCounters {
    hostBucketsResolved: number;
    conditionsEvaluated: number;
    activeIndexes: number;
}
