import type { ParsedTrackingRule } from "../../../data/rules/ParsedTrackingRule.js";
import type { TrackingRuleSet } from "../../../data/rules/TrackingRuleSet.js";
import type { ITrackingRuleSetBuilderOptions } from "./ITrackingRuleSetBuilderOptions.js";

export interface ITrackingRuleSetBuilder {
    add(rule: ParsedTrackingRule): void;
    build(options: ITrackingRuleSetBuilderOptions): TrackingRuleSet;
}
