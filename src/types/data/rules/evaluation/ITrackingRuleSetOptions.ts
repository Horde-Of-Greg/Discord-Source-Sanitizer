import type { TrackingRuleStats } from "../../TrackingRuleStats.js";
import type { IActiveRuleIndexesResolver } from "../indexing/IActiveRuleIndexesResolver.js";
import type { IParameterRemovalEvaluator } from "./IParameterRemovalEvaluator.js";

export interface ITrackingRuleSetOptions {
    indexes: IActiveRuleIndexesResolver;
    evaluator: IParameterRemovalEvaluator;
    stats: TrackingRuleStats;
}
