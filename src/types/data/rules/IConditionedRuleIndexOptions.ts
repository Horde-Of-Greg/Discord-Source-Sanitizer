import type { CompiledUrlCondition } from "../../../data/rules/CompiledUrlCondition.js";
import type { RuleIndex } from "../../../data/rules/RuleIndex.js";

export interface IConditionedRuleIndexOptions {
    id: number;
    condition: CompiledUrlCondition;
    rules: RuleIndex;
}
