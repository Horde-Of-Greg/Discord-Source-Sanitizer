import type { RuleIndex } from "../../../../data/rules/indexing/RuleIndex.js";
import type { CompiledUrlCondition } from "../../../../data/rules/matching/CompiledUrlCondition.js";

export interface IConditionedRuleIndexOptions {
    id: number;
    condition: CompiledUrlCondition;
    rules: RuleIndex;
}
