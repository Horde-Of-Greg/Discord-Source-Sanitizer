import type { ConditionedRuleIndex } from "../../../data/rules/ConditionedRuleIndex.js";

export interface IRuleBucketEntry {
    key: string;
    conditioned: ConditionedRuleIndex;
}
