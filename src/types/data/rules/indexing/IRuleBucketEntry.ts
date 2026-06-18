import type { ConditionedRuleIndex } from "../../../../data/rules/indexing/ConditionedRuleIndex.js";

export interface IRuleBucketEntry {
    key: string;
    conditioned: ConditionedRuleIndex;
}
