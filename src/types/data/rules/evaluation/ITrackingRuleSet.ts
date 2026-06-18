import type { TrackingRuleStats } from "../../TrackingRuleStats.js";
import type { ITrackingEvaluationStats } from "./ITrackingEvaluationStats.js";

export interface ITrackingRuleSet {
    readonly stats: TrackingRuleStats;
    sanitize(url: URL, counters?: ITrackingEvaluationStats): boolean;
}
