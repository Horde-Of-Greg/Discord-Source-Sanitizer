import type { ConditionedRuleIndex } from "../../../data/rules/ConditionedRuleIndex.js";

export interface IScopedRuleIndexesOptions {
    byHostname: ReadonlyMap<string, readonly ConditionedRuleIndex[]>;
    byEntity: ReadonlyMap<string, readonly ConditionedRuleIndex[]>;
    general: readonly ConditionedRuleIndex[];
}
