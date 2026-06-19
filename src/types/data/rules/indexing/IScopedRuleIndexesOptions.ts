import type { ConditionedRuleIndex } from "../../../../data/rules/indexing/ConditionedRuleIndex.js";

export interface IScopedRuleIndexesOptions {
    byHostname: ReadonlyMap<string, readonly ConditionedRuleIndex[]>;
    byEntity: ReadonlyMap<string, readonly ConditionedRuleIndex[]>;
    general: readonly ConditionedRuleIndex[];
}
