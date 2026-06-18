import type { TrackingRuleSet } from "../../../../data/rules/evaluation/TrackingRuleSet.js";
import type { ParsedTrackingRule } from "../../../../data/rules/model/ParsedTrackingRule.js";
import type { ITrackingRuleSetBuilderOptions } from "./ITrackingRuleSetBuilderOptions.js";

export interface ITrackingRuleSetBuilder {
    add(rule: ParsedTrackingRule): void;
    build(options: ITrackingRuleSetBuilderOptions): TrackingRuleSet;
}
